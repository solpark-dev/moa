package com.moa.payment.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.moa.global.common.event.MonthlyPaymentCompletedEvent;
import com.moa.global.common.event.MonthlyPaymentFailedEvent;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.global.common.exception.TossPaymentException;
import com.moa.party.domain.Party;
import com.moa.party.domain.enums.PartyStatus;
import com.moa.party.domain.enums.PaymentStatus;
import com.moa.party.domain.enums.PushCodeType;
import com.moa.party.repository.PartyDao;
import com.moa.payment.domain.Payment;
import com.moa.payment.repository.PaymentDao;
import com.moa.payment.service.PaymentExecutionService;
import com.moa.payment.service.PaymentRetryService;
import com.moa.payment.service.TossPaymentService;
import com.moa.product.service.ProductNameResolver;
import com.moa.push.dto.request.TemplatePushRequest;
import com.moa.push.service.PushService;
import com.moa.user.domain.User;
import com.moa.user.domain.UserCard;
import com.moa.user.repository.UserCardDao;
import com.moa.user.repository.UserDao;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentExecutionServiceImpl implements PaymentExecutionService {

	private final PaymentDao paymentDao;
	private final PartyDao partyDao;
	private final ProductNameResolver productNameResolver;
	private final UserDao userDao;
	private final UserCardDao userCardDao;
	private final TossPaymentService tossPaymentService;
	private final PaymentRetryService retryService;
	private final ApplicationEventPublisher eventPublisher;
	private final PushService pushService;

	private static final int MAX_RETRY_ATTEMPTS = 4;

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void executePaymentWithTransaction(Payment payment, int attemptNumber) {
		try {
			UserCard userCard = userCardDao.findByUserId(payment.getUserId())
					.orElseThrow(() -> new BusinessException(ErrorCode.BILLING_KEY_NOT_FOUND));

			String paymentKey = tossPaymentService.payWithBillingKey(
					userCard.getBillingKey(),
					payment.getOrderId(),
					payment.getPaymentAmount(),
					"MOA 월 구독료 (" + payment.getTargetMonth() + ")",
					payment.getUserId());

			payment.setPaymentStatus(PaymentStatus.COMPLETED);
			payment.setTossPaymentKey(paymentKey);
			payment.setCardNumber(userCard.getCardNumber());
			payment.setCardCompany(userCard.getCardCompany());
			paymentDao.updatePaymentStatus(payment.getPaymentId(), "COMPLETED");

			retryService.recordSuccess(payment, attemptNumber);

			eventPublisher.publishEvent(new MonthlyPaymentCompletedEvent(
					payment.getPartyId(), payment.getPartyMemberId(),
					payment.getUserId(), payment.getPaymentAmount(), payment.getTargetMonth()));

			sendPaymentSuccessPush(payment);

		} catch (BusinessException e) {
			handlePaymentFailure(payment, attemptNumber, e);
		}
	}

	private void handlePaymentFailure(Payment payment, int attemptNumber, BusinessException e) {
		paymentDao.updatePaymentStatus(payment.getPaymentId(), "FAILED");

		String errorCode = e.getErrorCode().getCode();
		String errorMessage = e.getMessage();

		if (e instanceof TossPaymentException pe) {
			errorCode = pe.getTossErrorCode();
			errorMessage = pe.getMessage();
		}

		boolean shouldRetry = attemptNumber < MAX_RETRY_ATTEMPTS;

		if (shouldRetry) {
			LocalDateTime nextRetry = calculateNextRetryTime(attemptNumber);
			retryService.recordFailureWithRetry(payment, attemptNumber, errorCode, errorMessage, nextRetry);
			sendPaymentFailedRetryPush(payment, attemptNumber, errorCode, errorMessage, nextRetry);
		} else {
			retryService.recordPermanentFailure(payment, attemptNumber, e);
			eventPublisher.publishEvent(new MonthlyPaymentFailedEvent(
					payment.getPartyId(), payment.getPartyMemberId(),
					payment.getUserId(), payment.getTargetMonth(), e.getMessage()));
			sendPaymentFinalFailedPush(payment, attemptNumber, e.getMessage());
			suspendPartyOnPaymentFailure(payment);
		}
	}

	private LocalDateTime calculateNextRetryTime(int attemptNumber) {
		return LocalDateTime.now().plusMinutes(30L * attemptNumber);
	}

	private void sendPaymentSuccessPush(Payment payment) {
		try {
			String productName = productNameResolver.getProductNameByPartyId(payment.getPartyId());
			String nickname = getUserNickname(payment.getUserId());
			Map<String, String> params = Map.of(
					"productName", productName,
					"amount", String.valueOf(payment.getPaymentAmount()),
					"nickname", nickname,
					"targetMonth", payment.getTargetMonth());

			TemplatePushRequest pushRequest = TemplatePushRequest.builder()
					.receiverId(payment.getUserId())
					.pushCode(PushCodeType.PAY_SUCCESS.getCode())
					.params(params)
					.moduleId(String.valueOf(payment.getPaymentId()))
					.moduleType(PushCodeType.PAY_SUCCESS.getModuleType())
					.build();

			pushService.addTemplatePush(pushRequest);
		} catch (Exception e) {
			log.error("푸시알림 발송 실패: paymentId={}", payment.getPaymentId(), e);
		}
	}

	private void sendPaymentFailedRetryPush(Payment payment, int attemptNumber, String errorCode, String errorMessage, LocalDateTime nextRetry) {
		try {
			String productName = productNameResolver.getProductNameByPartyId(payment.getPartyId());
			Map<String, String> params = Map.of(
					"productName", productName,
					"amount", String.valueOf(payment.getPaymentAmount()),
					"attempt", String.valueOf(attemptNumber),
					"errorCode", errorCode,
					"errorMessage", errorMessage,
					"nextRetry", nextRetry.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

			TemplatePushRequest pushRequest = TemplatePushRequest.builder()
					.receiverId(payment.getUserId())
					.pushCode(PushCodeType.PAY_FAILED_RETRY.getCode())
					.params(params)
					.moduleId(String.valueOf(payment.getPaymentId()))
					.moduleType(PushCodeType.PAY_FAILED_RETRY.getModuleType())
					.build();

			pushService.addTemplatePush(pushRequest);
		} catch (Exception e) {
			log.error("푸시알림 발송 실패: paymentId={}", payment.getPaymentId(), e);
		}
	}

	private void sendPaymentFinalFailedPush(Payment payment, int attemptNumber, String errorMessage) {
		try {
			String productName = productNameResolver.getProductNameByPartyId(payment.getPartyId());
			Map<String, String> params = Map.of(
					"productName", productName,
					"amount", String.valueOf(payment.getPaymentAmount()),
					"attempt", String.valueOf(attemptNumber),
					"errorMessage", errorMessage);

			TemplatePushRequest pushRequest = TemplatePushRequest.builder()
					.receiverId(payment.getUserId())
					.pushCode(PushCodeType.PAY_FINAL_FAILED.getCode())
					.params(params)
					.moduleId(String.valueOf(payment.getPaymentId()))
					.moduleType(PushCodeType.PAY_FINAL_FAILED.getModuleType())
					.build();

			pushService.addTemplatePush(pushRequest);
		} catch (Exception e) {
			log.error("푸시알림 발송 실패: paymentId={}", payment.getPaymentId(), e);
		}
	}

	private void suspendPartyOnPaymentFailure(Payment payment) {
		try {
			Party party = partyDao.findById(payment.getPartyId()).orElse(null);
			if (party == null) {
				log.warn("파티를 찾을 수 없음: partyId={}", payment.getPartyId());
				return;
			}
			if (party.getPartyStatus() == PartyStatus.SUSPENDED
					|| party.getPartyStatus() == PartyStatus.CLOSED) {
				return;
			}
			partyDao.updatePartyStatus(payment.getPartyId(), PartyStatus.SUSPENDED);
			log.warn("파티 일시정지: partyId={}, 사유=4회 결제 실패", payment.getPartyId());
		} catch (Exception e) {
			log.error("파티 일시정지 실패: partyId={}", payment.getPartyId(), e);
		}
	}

	private String getUserNickname(String userId) {
		try {
			User user = userDao.findByUserId(userId).orElse(null);
			return (user != null && user.getNickname() != null) ? user.getNickname() : "사용자";
		} catch (Exception e) {
			return "사용자";
		}
	}
}
