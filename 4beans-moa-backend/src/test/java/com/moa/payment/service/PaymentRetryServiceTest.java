package com.moa.payment.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.party.domain.enums.PaymentStatus;
import com.moa.party.repository.PartyDao;
import com.moa.party.repository.PartyMemberDao;
import com.moa.payment.domain.Payment;
import com.moa.payment.domain.PaymentRetryHistory;
import com.moa.payment.repository.PaymentDao;
import com.moa.payment.repository.PaymentRetryDao;
import com.moa.payment.service.impl.PaymentRetryServiceImpl;
import com.moa.push.service.PushService;

@ExtendWith(MockitoExtension.class)
@DisplayName("결제 재시도 서비스")
class PaymentRetryServiceTest {

    @InjectMocks private PaymentRetryServiceImpl retryService;

    @Mock private PaymentRetryDao retryDao;
    @Mock private PaymentDao paymentDao;
    @Mock private PaymentService paymentService;
    @Mock private PushService pushService;
    @Mock private PartyDao partyDao;
    @Mock private PartyMemberDao partyMemberDao;

    private static final Integer PAYMENT_ID = 1;
    private static final Integer PARTY_ID = 10;
    private static final Integer PARTY_MEMBER_ID = 100;

    @Nested
    @DisplayName("결제 이력 기록")
    class RecordHistory {

        @Test
        @DisplayName("성공 이력 기록: retryStatus=SUCCESS, nextRetryDate=null")
        void 성공_이력_기록() {
            Payment payment = payment(PaymentStatus.COMPLETED);

            retryService.recordSuccess(payment, 2);

            ArgumentCaptor<PaymentRetryHistory> captor = ArgumentCaptor.forClass(PaymentRetryHistory.class);
            verify(retryDao).insert(captor.capture());
            PaymentRetryHistory saved = captor.getValue();
            assertThat(saved.getRetryStatus()).isEqualTo("SUCCESS");
            assertThat(saved.getNextRetryDate()).isNull();
            assertThat(saved.getAttemptNumber()).isEqualTo(2);
            assertThat(saved.getPaymentId()).isEqualTo(PAYMENT_ID);
        }

        @Test
        @DisplayName("재시도 예약 실패 이력 기록: retryStatus=FAILED, nextRetryDate 설정")
        void 재시도_예약_실패_이력_기록() {
            Payment payment = payment(PaymentStatus.PENDING);
            LocalDateTime nextRetry = LocalDateTime.now().plusDays(1);

            retryService.recordFailureWithRetry(payment, 1, "INSUFFICIENT_FUNDS", "잔액 부족", nextRetry);

            ArgumentCaptor<PaymentRetryHistory> captor = ArgumentCaptor.forClass(PaymentRetryHistory.class);
            verify(retryDao).insert(captor.capture());
            PaymentRetryHistory saved = captor.getValue();
            assertThat(saved.getRetryStatus()).isEqualTo("FAILED");
            assertThat(saved.getNextRetryDate()).isEqualTo(nextRetry);
            assertThat(saved.getErrorCode()).isEqualTo("INSUFFICIENT_FUNDS");
            assertThat(saved.getAttemptNumber()).isEqualTo(1);
        }

        @Test
        @DisplayName("최종 실패 이력 기록: retryStatus=FAILED, nextRetryDate=null, errorCode 포함")
        void 최종_실패_이력_기록() {
            Payment payment = payment(PaymentStatus.PENDING);
            BusinessException exception = new BusinessException(ErrorCode.MAX_RETRY_EXCEEDED);

            retryService.recordPermanentFailure(payment, 4, exception);

            ArgumentCaptor<PaymentRetryHistory> captor = ArgumentCaptor.forClass(PaymentRetryHistory.class);
            verify(retryDao).insert(captor.capture());
            PaymentRetryHistory saved = captor.getValue();
            assertThat(saved.getRetryStatus()).isEqualTo("FAILED");
            assertThat(saved.getNextRetryDate()).isNull();
            assertThat(saved.getErrorCode()).isEqualTo(ErrorCode.MAX_RETRY_EXCEEDED.getCode());
            assertThat(saved.getAttemptNumber()).isEqualTo(4);
        }
    }

    @Nested
    @DisplayName("결제 재시도 실행")
    class RetryPayment {

        @Test
        @DisplayName("이미 COMPLETED 상태인 결제는 재시도 없이 스킵")
        void COMPLETED_결제_스킵() {
            Payment completedPayment = payment(PaymentStatus.COMPLETED);
            PaymentRetryHistory retry = retry(PAYMENT_ID, 1);
            given(paymentDao.findById(PAYMENT_ID)).willReturn(Optional.of(completedPayment));

            retryService.retryPayment(retry, "2025-01");

            verify(paymentService, never()).attemptPaymentExecution(any(), anyInt());
        }

        @Test
        @DisplayName("PENDING 결제는 attemptNumber+1 번호로 재시도 실행")
        void PENDING_결제_재시도_실행() {
            Payment pendingPayment = payment(PaymentStatus.PENDING);
            PaymentRetryHistory retry = retry(PAYMENT_ID, 2);
            given(paymentDao.findById(PAYMENT_ID)).willReturn(Optional.of(pendingPayment));

            retryService.retryPayment(retry, "2025-01");

            // attemptNumber=2 이므로 다음 시도는 3번
            verify(paymentService).attemptPaymentExecution(pendingPayment, 3);
        }
    }

    // ── 픽스처 ──────────────────────────────────────────────────────

    private Payment payment(PaymentStatus status) {
        return Payment.builder()
            .paymentId(PAYMENT_ID)
            .partyId(PARTY_ID)
            .partyMemberId(PARTY_MEMBER_ID)
            .paymentStatus(status)
            .build();
    }

    private PaymentRetryHistory retry(Integer paymentId, int attemptNumber) {
        return PaymentRetryHistory.builder()
            .paymentId(paymentId)
            .partyId(PARTY_ID)
            .partyMemberId(PARTY_MEMBER_ID)
            .attemptNumber(attemptNumber)
            .build();
    }
}
