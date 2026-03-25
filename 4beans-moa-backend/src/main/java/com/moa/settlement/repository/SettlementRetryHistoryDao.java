package com.moa.settlement.repository;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.settlement.domain.SettlementRetryHistory;

@Mapper
public interface SettlementRetryHistoryDao {

	int insertRetry(SettlementRetryHistory retry);

	Optional<SettlementRetryHistory> findById(@Param("retryId") Integer retryId);

	List<SettlementRetryHistory> findBySettlementId(@Param("settlementId") Integer settlementId);

	List<SettlementRetryHistory> findPendingRetries();

	int updateRetryStatus(SettlementRetryHistory retry);

	Optional<SettlementRetryHistory> findLatestBySettlementId(@Param("settlementId") Integer settlementId);

	int countBySettlementId(@Param("settlementId") Integer settlementId);
}
