package com.moa.payment.service;

import com.moa.payment.domain.Payment;

public interface PaymentExecutionService {
	void executePaymentWithTransaction(Payment payment, int attemptNumber);
}
