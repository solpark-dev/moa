package com.moa.payment.service;

public interface TossWebhookService {
	void handleWebhook(String payload, String signature);
	void retryUnprocessed();
}
