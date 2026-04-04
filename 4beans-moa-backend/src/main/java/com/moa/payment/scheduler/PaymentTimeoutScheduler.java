package com.moa.payment.scheduler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

import com.moa.party.repository.PartyDao;
import com.moa.product.service.ProductNameResolver;
import com.moa.party.domain.Party;

import com.moa.party.domain.enums.PartyStatus;
import com.moa.party.domain.enums.PushCodeType;
import com.moa.push.dto.request.TemplatePushRequest;
import com.moa.party.service.PartyService;
import com.moa.push.service.PushService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentTimeoutScheduler {

	private final PartyDao partyDao;
	private final PartyService partyService;
	private final PushService pushService;
	private final ProductNameResolver productNameResolver;
	private static final int TIMEOUT_MINUTES = 30;

	@Scheduled(fixedDelay = 5 * 60 * 1000, initialDelay = 5 * 60 * 1000)
	@SchedulerLock(name = "payment_timeout_check", lockAtMostFor = "10m", lockAtLeastFor = "1m")
	public void checkPaymentTimeout() {
		log.info("결제 타임아웃 체크 시작");

		try {
			LocalDateTime timeoutThreshold = LocalDateTime.now().minusMinutes(TIMEOUT_MINUTES);

			List<Party> expiredParties = partyDao.findExpiredPendingPaymentParties(PartyStatus.PENDING_PAYMENT,
					timeoutThreshold);

			if (expiredParties.isEmpty()) {
				log.info("타임아웃된 파티가 없습니다.");
				return;
			}

			log.info("타임아웃된 파티 {}개 발견", expiredParties.size());

			for (Party party : expiredParties) {
				try {
					partyService.cancelExpiredParty(party.getPartyId(), "결제 타임아웃 (30분 초과)");
					log.info("파티 취소 완료: partyId={}", party.getPartyId());

					sendPaymentTimeoutPush(party);

				} catch (Exception e) {
					log.error("파티 취소 실패: partyId={}, error={}", party.getPartyId(), e.getMessage());
				}
			}

			log.info("결제 타임아웃 체크 완료: 처리된 파티 {}개", expiredParties.size());

		} catch (Exception e) {
			log.error("결제 타임아웃 체크 중 오류 발생: {}", e.getMessage(), e);
		}
	}

	private void sendPaymentTimeoutPush(Party party) {
		try {
			String productName = productNameResolver.getProductName(party.getProductId());

			Map<String, String> params = Map.of("productName", productName, "timeoutMinutes",
					String.valueOf(TIMEOUT_MINUTES));

			TemplatePushRequest pushRequest = TemplatePushRequest.builder().receiverId(party.getPartyLeaderId())
					.pushCode(PushCodeType.PAY_TIMEOUT.getCode()).params(params)
					.moduleId(String.valueOf(party.getPartyId())).moduleType(PushCodeType.PAY_TIMEOUT.getModuleType())
					.build();

			pushService.addTemplatePush(pushRequest);
			log.info("푸시알림 발송 완료: PAY_TIMEOUT -> userId={}", party.getPartyLeaderId());

		} catch (Exception e) {
			log.error("푸시알림 발송 실패: partyId={}, error={}", party.getPartyId(), e.getMessage());
		}
	}

}