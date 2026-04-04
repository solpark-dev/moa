package com.moa.payment.repository;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.payment.domain.Payment;
import com.moa.payment.dto.response.PaymentDetailResponse;
import com.moa.payment.dto.response.PaymentResponse;

@Mapper
public interface PaymentDao {

	int insertPayment(Payment payment);

	Optional<Payment> findById(@Param("paymentId") Integer paymentId);

	Optional<PaymentDetailResponse> findDetailById(@Param("paymentId") Integer paymentId);

	List<PaymentResponse> findByUserId(@Param("userId") String userId);

	List<PaymentResponse> findByPartyId(@Param("partyId") Integer partyId);

	Optional<Payment> findByPartyMemberIdAndTargetMonth(@Param("partyMemberId") Integer partyMemberId,
			@Param("targetMonth") String targetMonth);

	Optional<Payment> findByOrderId(@Param("orderId") String orderId);

	int updatePaymentStatus(@Param("paymentId") Integer paymentId, @Param("status") String status);

	Optional<Payment> findByPartyMemberIdAndType(@Param("partyMemberId") Integer partyMemberId,
			@Param("paymentType") String paymentType);

	long calculateTotalRevenue();

	int updateSettlementId(@Param("paymentId") Integer paymentId, @Param("settlementId") Integer settlementId);

	List<PaymentResponse> findBySettlementId(@Param("settlementId") Integer settlementId);

	Optional<Payment> findLastMonthlyPayment(@Param("partyId") Integer partyId,
			@Param("partyMemberId") Integer partyMemberId);

	/** 월간 리포트 스케줄러: 해당 월에 완료 결제가 있는 유저 ID 목록 */
	List<String> findDistinctUserIdsByTargetMonth(@Param("targetMonth") String targetMonth);

	/** 월간 리포트: 특정 유저의 특정 월 완료 결제 내역 */
	List<PaymentResponse> findByUserIdAndTargetMonth(
			@Param("userId") String userId,
			@Param("targetMonth") String targetMonth);

	/** Toss Webhook: paymentKey로 상태 업데이트 */
	int updateByPaymentKey(@Param("paymentKey") String paymentKey, @Param("status") String status);
}