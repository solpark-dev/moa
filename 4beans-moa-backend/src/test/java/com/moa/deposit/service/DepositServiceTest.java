package com.moa.deposit.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
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
import org.springframework.context.ApplicationEventPublisher;

import com.moa.deposit.domain.Deposit;
import com.moa.deposit.repository.DepositDao;
import com.moa.deposit.service.impl.DepositServiceImpl;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.party.domain.Party;
import com.moa.party.domain.enums.DepositStatus;
import com.moa.party.repository.PartyDao;
import com.moa.payment.repository.RefundRetryHistoryDao;
import com.moa.payment.service.RefundRetryService;
import com.moa.payment.service.TossPaymentService;
import com.moa.product.repository.ProductDao;
import com.moa.push.service.PushService;

@ExtendWith(MockitoExtension.class)
@DisplayName("보증금 서비스")
class DepositServiceTest {

    @InjectMocks private DepositServiceImpl depositService;

    @Mock private DepositDao depositDao;
    @Mock private PartyDao partyDao;
    @Mock private TossPaymentService tossPaymentService;
    @Mock private ApplicationEventPublisher eventPublisher;
    @Mock private RefundRetryHistoryDao refundRetryHistoryDao;
    @Mock private RefundRetryService refundRetryService;
    @Mock private PushService pushService;
    @Mock private ProductDao productDao;

    private static final Integer PARTY_ID = 1;
    private static final Integer PARTY_MEMBER_ID = 10;
    private static final Integer DEPOSIT_ID = 100;
    private static final String USER_ID = "user01";

    @Nested
    @DisplayName("보증금 생성")
    class CreateDeposit {

        @Test
        @DisplayName("파티 없음 → PARTY_NOT_FOUND 예외")
        void 파티_없음_예외() {
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.empty());

            assertThatThrownBy(() ->
                depositService.createDeposit(PARTY_ID, PARTY_MEMBER_ID, USER_ID, 5000, "key", "order", "CARD"))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.PARTY_NOT_FOUND);
        }

        @Test
        @DisplayName("금액 0 이하 → INVALID_PAYMENT_AMOUNT 예외")
        void 유효하지_않은_금액_예외() {
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(party()));

            assertThatThrownBy(() ->
                depositService.createDeposit(PARTY_ID, PARTY_MEMBER_ID, USER_ID, 0, "key", "order", "CARD"))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.INVALID_PAYMENT_AMOUNT);
        }

        @Test
        @DisplayName("정상 생성: PAID 상태, SECURITY 타입으로 저장")
        void 정상_생성() {
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(party()));

            depositService.createDeposit(PARTY_ID, PARTY_MEMBER_ID, USER_ID, 5000, "tossKey", "orderId", "CARD");

            ArgumentCaptor<Deposit> captor = ArgumentCaptor.forClass(Deposit.class);
            verify(depositDao).insertDeposit(captor.capture());
            Deposit saved = captor.getValue();
            assertThat(saved.getDepositStatus()).isEqualTo(DepositStatus.PAID);
            assertThat(saved.getDepositType()).isEqualTo("SECURITY");
            assertThat(saved.getDepositAmount()).isEqualTo(5000);
            assertThat(saved.getUserId()).isEqualTo(USER_ID);
        }
    }

    @Nested
    @DisplayName("보증금 환불")
    class RefundDeposit {

        @Test
        @DisplayName("이미 환불된 보증금 재환불 요청 → DEPOSIT_ALREADY_REFUNDED 예외")
        void 이미_환불된_보증금_예외() {
            given(depositDao.findById(DEPOSIT_ID)).willReturn(Optional.of(refundedDeposit()));

            assertThatThrownBy(() -> depositService.refundDeposit(DEPOSIT_ID, "테스트"))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.DEPOSIT_ALREADY_REFUNDED);
        }

        @Test
        @DisplayName("정상 환불: Toss 취소 후 REFUNDED 상태 저장")
        void 정상_환불() {
            Deposit deposit = paidDeposit(5000);
            given(depositDao.findById(DEPOSIT_ID)).willReturn(Optional.of(deposit));
            // pushService 경로: partyDao.findById → empty → push 스킵
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.empty());

            depositService.refundDeposit(DEPOSIT_ID, "파티 종료");

            verify(tossPaymentService).cancelPayment(eq("tossKey"), eq("파티 종료"), eq(5000));
            ArgumentCaptor<Deposit> captor = ArgumentCaptor.forClass(Deposit.class);
            verify(depositDao).updateDeposit(captor.capture());
            assertThat(captor.getValue().getDepositStatus()).isEqualTo(DepositStatus.REFUNDED);
            assertThat(captor.getValue().getRefundAmount()).isEqualTo(5000);
        }
    }

    @Nested
    @DisplayName("파티 탈퇴 보증금 처리")
    class ProcessWithdrawalRefund {

        @Test
        @DisplayName("파티 시작 2일 이상 남은 경우 전액 환불")
        void 파티_시작_2일이상_환불() {
            Deposit deposit = paidDeposit(5000);
            Party party = partyWithStart(LocalDateTime.now().plusDays(3));
            given(depositDao.findById(DEPOSIT_ID)).willReturn(Optional.of(deposit));
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.empty()); // push 스킵용

            depositService.processWithdrawalRefund(DEPOSIT_ID, party);

            // refundDeposit 내부의 cancelPayment 호출로 환불 여부 확인
            verify(tossPaymentService).cancelPayment(any(), any(), anyInt());
        }

        @Test
        @DisplayName("파티 시작 2일 미만인 경우 전액 몰수 (FORFEITED)")
        void 파티_시작_2일미만_몰수() {
            Deposit deposit = paidDeposit(5000);
            Party party = partyWithStart(LocalDateTime.now().plusDays(1));
            given(depositDao.findById(DEPOSIT_ID)).willReturn(Optional.of(deposit));
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.empty()); // push 스킵용

            depositService.processWithdrawalRefund(DEPOSIT_ID, party);

            // Toss 취소 없이 DB만 FORFEITED로 업데이트
            verify(tossPaymentService, never()).cancelPayment(any(), any(), anyInt());
            ArgumentCaptor<Deposit> captor = ArgumentCaptor.forClass(Deposit.class);
            verify(depositDao).updateDeposit(captor.capture());
            assertThat(captor.getValue().getDepositStatus()).isEqualTo(DepositStatus.FORFEITED);
            assertThat(captor.getValue().getRefundAmount()).isEqualTo(0);
        }
    }

    // ── 픽스처 ──────────────────────────────────────────────────────

    private Party party() {
        return Party.builder().partyId(PARTY_ID).partyLeaderId("leader").build();
    }

    private Party partyWithStart(LocalDateTime startDate) {
        return Party.builder().partyId(PARTY_ID).startDate(startDate).build();
    }

    private Deposit paidDeposit(int amount) {
        return Deposit.builder()
            .depositId(DEPOSIT_ID)
            .partyId(PARTY_ID)
            .userId(USER_ID)
            .partyMemberId(PARTY_MEMBER_ID)
            .depositAmount(amount)
            .depositStatus(DepositStatus.PAID)
            .tossPaymentKey("tossKey")
            .orderId("orderId")
            .build();
    }

    private Deposit refundedDeposit() {
        return Deposit.builder()
            .depositId(DEPOSIT_ID)
            .depositStatus(DepositStatus.REFUNDED)
            .build();
    }
}
