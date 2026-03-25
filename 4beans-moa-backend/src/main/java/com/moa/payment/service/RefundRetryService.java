package com.moa.payment.service;

import java.time.LocalDateTime;
import java.util.List;

import com.moa.payment.domain.RefundRetryHistory;

public interface RefundRetryService {

	List<RefundRetryHistory> findPendingRetries();

	void retryRefund(RefundRetryHistory retry);

	LocalDateTime calculateNextRetryDate(int attemptNumber);

	void recordFailure(com.moa.deposit.domain.Deposit deposit, Exception e, String reason);

	void registerCompensation(Integer depositId, String tossPaymentKey, Integer amount, String reason);

	void recordCompensation(com.moa.deposit.domain.Deposit deposit, String reason);
}
