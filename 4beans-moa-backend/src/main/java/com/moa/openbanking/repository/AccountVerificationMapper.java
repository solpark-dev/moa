package com.moa.openbanking.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.openbanking.domain.AccountVerification;

@Mapper
public interface AccountVerificationMapper {

	void insert(AccountVerification verification);

	AccountVerification findByBankTranId(@Param("bankTranId") String bankTranId);

	AccountVerification findLatestByUserId(@Param("userId") String userId);

	void updateStatus(@Param("verificationId") Long verificationId, @Param("status") String status);

	void incrementAttemptCount(@Param("verificationId") Long verificationId);

	int updateExpiredSessions();

	/**
	 * 사용자의 PENDING 상태 세션을 모두 EXPIRED로 변경
	 */
	int expirePendingByUserId(@Param("userId") String userId);
}
