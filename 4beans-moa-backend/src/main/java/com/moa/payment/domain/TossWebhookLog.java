package com.moa.payment.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TossWebhookLog {

	private Long id;
	private String paymentKey;
	private String orderId;
	private String eventType;
	private String status;
	private Integer amount;
	private String webhookPayload;
	private boolean processed;
	private String errorMessage;
	private LocalDateTime createdAt;
}
