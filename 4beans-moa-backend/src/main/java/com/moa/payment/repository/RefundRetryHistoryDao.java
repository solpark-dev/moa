package com.moa.payment.repository;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.payment.domain.RefundRetryHistory;

@Mapper
public interface RefundRetryHistoryDao {

	int insertRefundRetry(RefundRetryHistory refundRetry);

	Optional<RefundRetryHistory> findById(@Param("retryId") Integer retryId);

	List<RefundRetryHistory> findByDepositId(@Param("depositId") Integer depositId);

	List<RefundRetryHistory> findPendingRetries();

	int updateRetryStatus(RefundRetryHistory refundRetry);

	Optional<RefundRetryHistory> findLatestByDepositId(@Param("depositId") Integer depositId);
}
