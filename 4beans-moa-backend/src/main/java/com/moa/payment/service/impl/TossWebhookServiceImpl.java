package com.moa.payment.service.impl;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.payment.domain.TossWebhookLog;
import com.moa.payment.repository.PaymentDao;
import com.moa.payment.repository.TossWebhookLogDao;
import com.moa.payment.service.TossWebhookService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TossWebhookServiceImpl implements TossWebhookService {

	private final TossWebhookLogDao webhookLogDao;
	private final PaymentDao paymentDao;
	private final ObjectMapper objectMapper;

	@Value("${toss.webhook-secret:}")
	private String webhookSecret;

	@Override
	public void handleWebhook(String payload, String signature) {
		if (webhookSecret != null && !webhookSecret.isBlank()) {
			verifySignature(payload, signature);
		}

		try {
			JsonNode root = objectMapper.readTree(payload);
			String eventType = root.path("eventType").asText();
			String paymentKey = root.path("paymentKey").asText(null);
			String orderId = root.path("orderId").asText(null);
			String status = root.path("status").asText(null);
			int amount = root.path("totalAmount").asInt(0);

			if (paymentKey != null && !paymentKey.isBlank()) {
				var existing = webhookLogDao.findByPaymentKeyAndEventType(paymentKey, eventType);
				if (existing.isPresent() && existing.get().isProcessed()) {
					log.info("[Toss Webhook] Already processed, skipping: paymentKey={}, eventType={}", paymentKey, eventType);
					return;
				}
			}

			TossWebhookLog webhookLog = TossWebhookLog.builder()
					.paymentKey(paymentKey)
					.orderId(orderId)
					.eventType(eventType)
					.status(status)
					.amount(amount)
					.webhookPayload(payload)
					.build();

			webhookLogDao.insert(webhookLog);

			processEvent(eventType, paymentKey, orderId, status, amount, webhookLog.getId());

		} catch (Exception e) {
			log.error("[Toss Webhook] Failed to process webhook", e);
			throw new BusinessException(ErrorCode.BUSINESS_ERROR, "웹훅 처리 실패");
		}
	}

	@Override
	@Transactional
	public void retryUnprocessed() {
		List<TossWebhookLog> unprocessed = webhookLogDao.findUnprocessed(50);
		log.info("[Toss Webhook Retry] Found {} unprocessed webhooks", unprocessed.size());

		for (TossWebhookLog logEntry : unprocessed) {
			try {
				processEvent(
						logEntry.getEventType(),
						logEntry.getPaymentKey(),
						logEntry.getOrderId(),
						logEntry.getStatus(),
						logEntry.getAmount(),
						logEntry.getId());
			} catch (Exception e) {
				log.error("[Toss Webhook Retry] Failed for id={}", logEntry.getId(), e);
				webhookLogDao.markError(logEntry.getId(), e.getMessage());
			}
		}
	}

	private void processEvent(String eventType, String paymentKey, String orderId, String status, int amount, Long logId) {
		try {
			switch (eventType) {
				case "PAYMENT_STATUS_CHANGED" -> handlePaymentStatusChanged(paymentKey, status, amount, logId);
				case "BILLING_KEY_ISSUED" -> log.info("[Toss Webhook] Billing key issued: {}", paymentKey);
				case "PAYMENT_SCHEDULED" -> log.info("[Toss Webhook] Payment scheduled: {}", paymentKey);
				default -> log.warn("[Toss Webhook] Unknown event type: {}", eventType);
			}
			webhookLogDao.markProcessed(logId);
		} catch (Exception e) {
			log.error("[Toss Webhook] Event processing failed: eventType={}, paymentKey={}", eventType, paymentKey, e);
			webhookLogDao.markError(logId, e.getMessage());
			throw e;
		}
	}

	private void handlePaymentStatusChanged(String paymentKey, String status, int amount, Long logId) {
		if (paymentKey == null) return;

		switch (status) {
			case "DONE" -> {
				log.info("[Toss Webhook] Payment DONE: paymentKey={}, amount={}", paymentKey, amount);
				paymentDao.updateByPaymentKey(paymentKey, "COMPLETED");
			}
			case "CANCELED" -> {
				log.info("[Toss Webhook] Payment CANCELED: paymentKey={}", paymentKey);
				paymentDao.updateByPaymentKey(paymentKey, "REFUNDED");
			}
			case "PARTIAL_CANCELED" -> {
				log.info("[Toss Webhook] Payment PARTIAL_CANCELED: paymentKey={}", paymentKey);
			}
			case "ABORTED" -> {
				log.warn("[Toss Webhook] Payment ABORTED: paymentKey={}", paymentKey);
				paymentDao.updateByPaymentKey(paymentKey, "FAILED");
			}
			default -> log.warn("[Toss Webhook] Unknown payment status: {}", status);
		}
	}

	private void verifySignature(String payload, String signature) {
		try {
			Mac mac = Mac.getInstance("HmacSHA256");
			mac.init(new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
			byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
			String expected = Base64.getEncoder().encodeToString(rawHmac);

			if (!expected.equals(signature)) {
				throw new BusinessException(ErrorCode.UNAUTHORIZED, "웹훅 서명 검증 실패");
			}
		} catch (BusinessException e) {
			throw e;
		} catch (Exception e) {
			log.error("[Toss Webhook] Signature verification failed", e);
			throw new BusinessException(ErrorCode.UNAUTHORIZED, "웹훅 서명 검증 실패");
		}
	}
}
