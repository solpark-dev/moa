package com.moa.global.common.alert;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WebhookNotificationService {

	private static final Logger log = LoggerFactory.getLogger(WebhookNotificationService.class);

	@Value("${webhook.slack.url:}")
	private String slackWebhookUrl;

	@Value("${webhook.discord.url:}")
	private String discordWebhookUrl;

	private final RestTemplate restTemplate;
	private final ObjectMapper objectMapper;

	public WebhookNotificationService() {
		this.restTemplate = new RestTemplate();
		this.objectMapper = new ObjectMapper();
	}

	@Async
	public void sendFraudAlert(String userId, int amount, String targetMonth,
			String riskLevel, String reasons) {
		String emoji = "HIGH".equals(riskLevel) ? "🚨" : "MEDIUM".equals(riskLevel) ? "⚠️" : "ℹ️";
		String message = String.format(
				"%s [결제 이상 감지] riskLevel=%s\n> userId: %s\n> 금액: %d원\n> 대상월: %s\n> 사유: %s",
				emoji, riskLevel, userId, amount, targetMonth, reasons);
		sendToSlack(message);
		sendToDiscord(message);
	}

	@Async
	public void sendErrorAlert(String traceId, Exception e) {
		String errorMessage = String.format("🚨 [SYSTEM ERROR] %s\n> Trace ID: %s\n> Message: %s\n> Class: %s",
				e.getClass().getSimpleName(),
				traceId != null ? traceId : "N/A",
				e.getMessage() != null ? e.getMessage() : "No message",
				e.getStackTrace().length > 0 ? e.getStackTrace()[0].toString() : "Unknown");

		sendToSlack(errorMessage);
		sendToDiscord(errorMessage);
	}

	private void sendToSlack(String message) {
		if (slackWebhookUrl == null || slackWebhookUrl.isBlank()) {
			return;
		}
		
		try {
			Map<String, String> payload = new HashMap<>();
			payload.put("text", message);
			
			restTemplate.postForEntity(slackWebhookUrl, payload, String.class);
			log.info("Sent error alert to Slack");
		} catch (Exception ex) {
			log.error("Failed to send Slack alert: {}", ex.getMessage());
		}
	}

	private void sendToDiscord(String message) {
		if (discordWebhookUrl == null || discordWebhookUrl.isBlank()) {
			return;
		}
		
		try {
			Map<String, String> payload = new HashMap<>();
			payload.put("content", message);
			
			restTemplate.postForEntity(discordWebhookUrl, payload, String.class);
			log.info("Sent error alert to Discord");
		} catch (Exception ex) {
			log.error("Failed to send Discord alert: {}", ex.getMessage());
		}
	}
}
