package com.moa.payment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moa.payment.service.TossWebhookService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class TossWebhookController {

	private final TossWebhookService tossWebhookService;

	@PostMapping("/webhook")
	public ResponseEntity<Void> handleWebhook(
			@RequestBody String payload,
			@RequestHeader(value = "Webhook-Signature", required = false) String signature) {

		log.info("[Toss Webhook] Received webhook event");
		tossWebhookService.handleWebhook(payload, signature);
		return ResponseEntity.ok().build();
	}
}
