package com.moa.service.payment;

import java.util.List;

import com.moa.domain.Payment;
import com.moa.dto.payment.request.PaymentRequest;
import com.moa.dto.payment.response.PaymentDetailResponse;
import com.moa.dto.payment.response.PaymentResponse;

/**
 * 결제 서비스 인터페이스
 *
 * v1.0 결제 유형:
 * 1. 파티원 첫 달 결제 (가입 시)
 * 2. 월별 자동 결제 (스케줄러)
 */
public interface PaymentService {

        /**
         * 첫 달 결제 생성 (파티원 가입 시)
         *
         * @param partyId       파티 ID
         * @param partyMemberId 파티 멤버 ID
         * @param userId        사용자 ID
         * @param amount        결제 금액
         * @param targetMonth   대상 월 (YYYY-MM)
         * @param request       결제 요청 정보
         * @return 생성된 결제 정보
         */
        Payment createInitialSubscriptionPayment( // 이름 변경
                        Integer partyId,
                        Integer partyMemberId,
                        String userId,
                        Integer amount,
                        String targetMonth,
                        String paymentKey, // 변경
                        String orderId,    // 변경
                        String paymentMethod); // 변경

        /**
         * 결제 상세 정보 조회
         *
         * @param paymentId 결제 ID
         * @return 결제 상세 정보
         */
        PaymentDetailResponse getPaymentDetail(Integer paymentId);

        /**
         * 사용자별 결제 내역 조회
         *
         * @param userId 사용자 ID
         * @return 결제 목록
         */
        List<PaymentResponse> getMyPayments(String userId);

        /**
         * 파티별 결제 내역 조회
         *
         * @param partyId 파티 ID
         * @return 결제 목록
         */
        List<PaymentResponse> getPartyPayments(Integer partyId);

        /**
         * 중복 결제 확인
         *
         * @param partyMemberId 파티 멤버 ID
         * @param targetMonth   대상 월 (YYYY-MM)
         * @return 이미 결제했으면 true
         */
        boolean isDuplicatePayment(Integer partyMemberId, String targetMonth);

        /**
         * Process monthly payment with retry logic
         * Called by PaymentScheduler for automatic monthly payments
         * Creates PENDING payment and attempts execution
         *
         * @param partyId       Party ID
         * @param partyMemberId Party Member ID
         * @param userId        User ID
         * @param amount        Payment amount
         * @param targetMonth   Target month (YYYY-MM format)
         */
        void processMonthlyPayment(
                        Integer partyId,
                        Integer partyMemberId,
                        String userId,
                        Integer amount,
                        String targetMonth);

        /**
         * Attempt payment execution with billing key
         * Handles Toss API call, retry recording, and event publishing
         * Uses REQUIRES_NEW transaction to separate from scheduler transaction
         *
         * @param payment       Payment to attempt
         * @param attemptNumber Attempt number (1-4)
         */
        void attemptPaymentExecution(Payment payment, int attemptNumber);

        /**
         * 결제 환불 (파티 탈퇴 시)
         *
         * @param partyId       파티 ID
         * @param partyMemberId 파티 멤버 ID
         * @param reason        환불 사유
         */
        void refundPayment(Integer partyId, Integer partyMemberId, String reason);
}