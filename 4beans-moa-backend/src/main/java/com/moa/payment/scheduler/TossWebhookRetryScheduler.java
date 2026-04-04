package com.moa.payment.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.moa.payment.service.TossWebhookService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class TossWebhookRetryScheduler {

	private final TossWebhookService tossWebhookService;

	@Scheduled(fixedDelay = 30 * 60 * 1000, initialDelay = 5 * 60 * 1000)
	public void retryUnprocessedWebhooks() {
		log.info("[Toss Webhook Retry] Starting retry check...");
		tossWebhookService.retryUnprocessed();
	}
}
