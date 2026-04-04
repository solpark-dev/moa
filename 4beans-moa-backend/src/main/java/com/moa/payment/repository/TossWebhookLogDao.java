package com.moa.payment.repository;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.moa.payment.domain.TossWebhookLog;

@Mapper
public interface TossWebhookLogDao {

	void insert(TossWebhookLog log);

	Optional<TossWebhookLog> findByPaymentKeyAndEventType(String paymentKey, String eventType);

	List<TossWebhookLog> findUnprocessed(int limit);

	void markProcessed(Long id);

	void markError(Long id, String errorMessage);
}
