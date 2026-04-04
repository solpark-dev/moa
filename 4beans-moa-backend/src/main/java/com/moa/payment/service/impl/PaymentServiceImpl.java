package com.moa.payment.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.moa.global.common.event.MonthlyPaymentCompletedEvent;
import com.moa.global.common.event.MonthlyPaymentFailedEvent;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.party.repository.PartyDao;
import com.moa.party.repository.PartyMemberDao;
import com.moa.payment.repository.PaymentDao;
import com.moa.product.service.ProductNameResolver;
import com.moa.user.repository.UserCardDao;
import com.moa.user.repository.UserDao;
import com.moa.party.domain.Party;
import com.moa.payment.domain.Payment;
import com.moa.user.domain.User;
import com.moa.user.domain.UserCard;
import com.moa.party.domain.enums.PartyStatus;
import com.moa.party.domain.enums.PaymentStatus;
import com.moa.party.domain.enums.PushCodeType;
import com.moa.payment.dto.request.PaymentRequest;
import com.moa.payment.dto.response.PaymentDetailResponse;
import com.moa.payment.dto.response.PaymentResponse;
import com.moa.push.dto.request.TemplatePushRequest;
import com.moa.payment.service.PaymentExecutionService;
import com.moa.payment.service.PaymentRetryService;
import com.moa.payment.service.PaymentService;
import com.moa.payment.service.TossPaymentService;
import com.moa.push.service.PushService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

	private final PaymentDao paymentDao;
	private final PartyDao partyDao;
	private final PartyMemberDao partyMemberDao;
	private final TossPaymentService tossPaymentService;
	private final UserCardDao userCardDao;
	private final PaymentRetryService retryService;
	private final PaymentExecutionService paymentExecutionService;
	private final ApplicationEventPublisher eventPublisher;

	private final PushService pushService;
	private final ProductNameResolver productNameResolver;
	private final UserDao userDao;

	private static final int MAX_RETRY_ATTEMPTS = 4;





	@Override
	public Payment createInitialSubscriptionPayment(
			Integer partyId,
			Integer partyMemberId,
			String userId,
			Integer amount,
			String targetMonth,
			String paymentKey,
			String orderId,
			String paymentMethod) {

		if (isDuplicatePayment(partyMemberId, targetMonth)) {
			throw new BusinessException(ErrorCode.DUPLICATE_PAYMENT);
		}

		if (amount <= 0) {
			throw new BusinessException(ErrorCode.INVALID_PAYMENT_AMOUNT);
		}

		Payment payment = Payment.builder()
				.partyId(partyId)
				.partyMemberId(partyMemberId)
				.userId(userId)
				.paymentType("INITIAL_FEE") // INITIAL_FEE 타입으로 변경
				.paymentAmount(amount)
				.paymentStatus(PaymentStatus.COMPLETED)
				.paymentMethod(paymentMethod)
				.paymentDate(LocalDateTime.now())
				.tossPaymentKey(paymentKey)
				.orderId(orderId)
				.targetMonth(targetMonth)
				.cardNumber("UNAVAILABLE") // Toss Payment API 응답에서 카드 정보 추출 필요 (현재는 UNAVAILABLE)
				.cardCompany("TOSS")       // Toss Payment API 응답에서 카드 정보 추출 필요 (현재는 TOSS)
				.build();

		paymentDao.insertPayment(payment);

		return payment;
	}





	@Override
	@Transactional(readOnly = true)
	public PaymentDetailResponse getPaymentDetail(Integer paymentId, String userId) {
		PaymentDetailResponse response = paymentDao.findDetailById(paymentId)
				.orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_NOT_FOUND));

		if (!userId.equals(response.getUserId())) {
			throw new BusinessException(ErrorCode.FORBIDDEN, "결제 정보를 조회할 권한이 없습니다.");
		}

		return response;
	}

	@Override
	@Transactional(readOnly = true)
	public List<PaymentResponse> getMyPayments(String userId) {
		return paymentDao.findByUserId(userId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<PaymentResponse> getPartyPayments(Integer partyId, String userId) {
		com.moa.party.domain.PartyMember member = partyMemberDao.findByPartyIdAndUserId(partyId, userId).orElse(null);
		if (member == null) {
			throw new BusinessException(ErrorCode.FORBIDDEN, "파티 멤버가 아닙니다.");
		}
		return paymentDao.findByPartyId(partyId);
	}

	@Override
	@Transactional(readOnly = true)
	public boolean isDuplicatePayment(Integer partyMemberId, String targetMonth) {
		return paymentDao.findByPartyMemberIdAndTargetMonth(partyMemberId, targetMonth).isPresent();
	}

	@Override
	@Transactional
	public void processMonthlyPayment(Integer partyId, Integer partyMemberId, String userId, Integer amount,
			String targetMonth) {

		if (isDuplicatePayment(partyMemberId, targetMonth)) {
			return;
		}

		Payment payment = Payment.builder().partyId(partyId).partyMemberId(partyMemberId).userId(userId)
				.paymentType("MONTHLY").paymentAmount(amount).paymentStatus(PaymentStatus.PENDING).paymentMethod("CARD")
				.paymentDate(LocalDateTime.now()).targetMonth(targetMonth)
				.orderId("MONTHLY_" + partyId + "_" + partyMemberId + "_" + System.currentTimeMillis()).build();

		paymentDao.insertPayment(payment);
		paymentExecutionService.executePaymentWithTransaction(payment, 1);
	}

	@Override
	public void attemptPaymentExecution(Payment payment, int attemptNumber) {
		paymentExecutionService.executePaymentWithTransaction(payment, attemptNumber);
	}

	@Override
	public void refundPayment(Integer partyId, Integer partyMemberId, String reason) {
		Payment payment = paymentDao.findLastMonthlyPayment(partyId, partyMemberId)
				.orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_NOT_FOUND));

		if (!"COMPLETED".equals(payment.getPaymentStatus())) {
			throw new BusinessException(ErrorCode.INVALID_PAYMENT_STATUS);
		}

		try {
			tossPaymentService.cancelPayment(payment.getTossPaymentKey(), reason, null);
			paymentDao.updatePaymentStatus(payment.getPaymentId(), "REFUNDED");
		} catch (com.moa.global.common.exception.TossPaymentException e) {
			log.error("Toss refund failed: code={}, message={}", e.getTossErrorCode(), e.getMessage());
			throw new BusinessException(ErrorCode.PAYMENT_FAILED, e.getMessage());
		} catch (Exception e) {
			log.error("Refund failed", e);
			throw new BusinessException(ErrorCode.PAYMENT_FAILED);
		}
	}

	private LocalDateTime calculateNextRetryTime(int attemptNumber) {
		int hoursToAdd = 24 * attemptNumber;
		return LocalDateTime.now().plusHours(hoursToAdd);
	}

	private String getUserNickname(String userId) {
		if (userId == null)
			return "파티원";

		try {
			return userDao.findByUserId(userId).map(User::getNickname).orElse("파티원");
		} catch (Exception e) {
			log.warn("사용자 조회 실패: userId={}", userId);
			return "파티원";
		}
	}

	private void sendPaymentSuccessPush(Payment payment, int attemptNumber) {
		try {
			Party party = partyDao.findById(payment.getPartyId()).orElse(null);
			if (party == null)
				return;

			String productName = productNameResolver.getProductName(party.getProductId());
			String pushCode;
			Map<String, String> params;

			if (attemptNumber > 1) {
				pushCode = PushCodeType.PAY_RETRY_SUCCESS.getCode();
				params = Map.of("productName", productName, "attemptNumber", String.valueOf(attemptNumber), "amount",
						String.valueOf(payment.getPaymentAmount()));
			} else {
				pushCode = PushCodeType.PAY_SUCCESS.getCode();
				params = Map.of("productName", productName, "targetMonth", payment.getTargetMonth(), "amount",
						String.valueOf(payment.getPaymentAmount()));
			}

			TemplatePushRequest pushRequest = TemplatePushRequest.builder().receiverId(payment.getUserId())
					.pushCode(pushCode).params(params).moduleId(String.valueOf(payment.getPaymentId()))
					.moduleType(PushCodeType.PAY_SUCCESS.getModuleType()).build();

			pushService.addTemplatePush(pushRequest);
			log.info("푸시알림 발송 완료: {} -> userId={}", pushCode, payment.getUserId());

		} catch (Exception e) {
			log.error("푸시알림 발송 실패: paymentId={}, error={}", payment.getPaymentId(), e.getMessage());
		}
	}

	private void sendPaymentFailedRetryPush(Payment payment, int attemptNumber, String errorCode, String errorMessage,
			LocalDateTime nextRetryDate) {
		try {
			Party party = partyDao.findById(payment.getPartyId()).orElse(null);
			if (party == null)
				return;

			String productName = productNameResolver.getProductName(party.getProductId());

			String pushCode = determinePushCodeByError(errorCode);

			Map<String, String> params = Map.of("productName", productName, "attemptNumber",
					String.valueOf(attemptNumber), "errorMessage",
					errorMessage != null ? errorMessage : "결제 처리 중 오류가 발생했습니다.", "nextRetryDate",
					nextRetryDate.toLocalDate().toString());

			TemplatePushRequest pushRequest = TemplatePushRequest.builder().receiverId(payment.getUserId())
					.pushCode(pushCode).params(params).moduleId(String.valueOf(payment.getPaymentId()))
					.moduleType(PushCodeType.PAY_FAILED_RETRY.getModuleType()).build();

			pushService.addTemplatePush(pushRequest);
			log.info("푸시알림 발송 완료: {} -> userId={}", pushCode, payment.getUserId());

		} catch (Exception e) {
			log.error("푸시알림 발송 실패: paymentId={}, error={}", payment.getPaymentId(), e.getMessage());
		}
	}

	private void sendPaymentFinalFailedPush(Payment payment, int attemptNumber, String errorMessage) {
		try {
			Party party = partyDao.findById(payment.getPartyId()).orElse(null);
			if (party == null)
				return;

			String productName = productNameResolver.getProductName(party.getProductId());

			Map<String, String> memberParams = Map.of("productName", productName, "attemptNumber",
					String.valueOf(attemptNumber), "errorMessage",
					errorMessage != null ? errorMessage : "결제 처리 중 오류가 발생했습니다.");

			TemplatePushRequest memberPush = TemplatePushRequest.builder().receiverId(payment.getUserId())
					.pushCode(PushCodeType.PAY_FINAL_FAILED.getCode()).params(memberParams)
					.moduleId(String.valueOf(payment.getPaymentId()))
					.moduleType(PushCodeType.PAY_FINAL_FAILED.getModuleType()).build();

			pushService.addTemplatePush(memberPush);
			log.info("푸시알림 발송 완료: PAY_FINAL_FAILED -> userId={}", payment.getUserId());
			String memberNickname = getUserNickname(payment.getUserId());

			Map<String, String> leaderParams = Map.of("memberNickname", memberNickname, "productName", productName,
					"errorMessage", errorMessage != null ? errorMessage : "결제 처리 중 오류가 발생했습니다.");

			TemplatePushRequest leaderPush = TemplatePushRequest.builder().receiverId(party.getPartyLeaderId())
					.pushCode(PushCodeType.PAY_MEMBER_FAILED_LEADER.getCode()).params(leaderParams)
					.moduleId(String.valueOf(payment.getPaymentId()))
					.moduleType(PushCodeType.PAY_MEMBER_FAILED_LEADER.getModuleType()).build();

			pushService.addTemplatePush(leaderPush);
			log.info("푸시알림 발송 완료: PAY_MEMBER_FAILED_LEADER -> leaderId={}", party.getPartyLeaderId());

		} catch (Exception e) {
			log.error("푸시알림 발송 실패: paymentId={}, error={}", payment.getPaymentId(), e.getMessage());
		}
	}

	private String determinePushCodeByError(String errorCode) {
		if (errorCode == null) {
			return PushCodeType.PAY_FAILED_RETRY.getCode();
		}

		return switch (errorCode) {
		case "INSUFFICIENT_BALANCE", "NOT_ENOUGH_BALANCE" -> PushCodeType.PAY_FAILED_BALANCE.getCode();

		case "EXCEED_CARD_LIMIT", "DAILY_LIMIT_EXCEEDED", "MONTHLY_LIMIT_EXCEEDED" ->
			PushCodeType.PAY_FAILED_LIMIT.getCode();

		case "INVALID_CARD_NUMBER", "INVALID_CARD_EXPIRATION", "INVALID_CVV", "CARD_EXPIRED", "CARD_RESTRICTED",
				"CARD_LOST_OR_STOLEN" ->
			PushCodeType.PAY_FAILED_CARD.getCode();

		default -> PushCodeType.PAY_FAILED_RETRY.getCode();
		};
	}
}