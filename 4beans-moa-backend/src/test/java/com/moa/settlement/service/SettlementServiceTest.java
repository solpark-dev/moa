package com.moa.settlement.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.moa.account.domain.Account;
import com.moa.account.repository.AccountDao;
import com.moa.deposit.domain.Deposit;
import com.moa.deposit.repository.DepositDao;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.openbanking.service.OpenBankingService;
import com.moa.party.domain.Party;
import com.moa.party.domain.enums.SettlementStatus;
import com.moa.party.repository.PartyDao;
import com.moa.payment.dto.response.PaymentResponse;
import com.moa.payment.repository.PaymentDao;
import com.moa.settlement.domain.Settlement;
import com.moa.settlement.repository.SettlementDao;
import com.moa.settlement.service.impl.SettlementServiceImpl;

@ExtendWith(MockitoExtension.class)
@DisplayName("정산 서비스")
class SettlementServiceTest {

    @InjectMocks private SettlementServiceImpl settlementService;

    @Mock private SettlementDao settlementDao;
    @Mock private PaymentDao paymentDao;
    @Mock private PartyDao partyDao;
    @Mock private AccountDao accountDao;
    @Mock private DepositDao depositDao;
    @Mock private OpenBankingService openBankingService;

    private static final Integer PARTY_ID = 1;
    private static final String TARGET_MONTH = "2025-01";
    private static final String LEADER_ID = "leader01";
    // 파티 시작일 = 2025-01-01 → billingDay=1, 정산범위 2025-01-01 ~ 2025-01-31
    private static final LocalDateTime PARTY_START = LocalDateTime.of(2025, 1, 1, 0, 0, 0);
    private static final LocalDateTime PAYMENT_DATE = LocalDateTime.of(2025, 1, 15, 10, 0, 0);

    @Nested
    @DisplayName("월별 정산 생성")
    class CreateMonthlySettlement {

        @Test
        @DisplayName("동일 월 중복 정산 요청 시 DUPLICATE_SETTLEMENT 예외 발생")
        void 중복_정산_예외() {
            given(settlementDao.findByPartyIdAndMonth(PARTY_ID, TARGET_MONTH))
                .willReturn(Optional.of(new Settlement()));

            assertThatThrownBy(() -> settlementService.createMonthlySettlement(PARTY_ID, TARGET_MONTH))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.DUPLICATE_SETTLEMENT);
        }

        @Test
        @DisplayName("파티장 계좌 미등록 시 PENDING_ACCOUNT 상태로 정산 생성")
        void 계좌_미등록_PENDING_ACCOUNT() {
            given(settlementDao.findByPartyIdAndMonth(PARTY_ID, TARGET_MONTH)).willReturn(Optional.empty());
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(party()));
            given(accountDao.findByUserId(LEADER_ID)).willReturn(Optional.empty());
            given(paymentDao.findByPartyId(PARTY_ID))
                .willReturn(completedPaymentsByTargetMonth(3625, 3625, 3625, 3625));
            given(depositDao.findForfeitedByPartyIdAndPeriod(any(), any(), any())).willReturn(List.of());

            settlementService.createMonthlySettlement(PARTY_ID, TARGET_MONTH);

            ArgumentCaptor<Settlement> captor = ArgumentCaptor.forClass(Settlement.class);
            verify(settlementDao).insertSettlement(captor.capture());
            assertThat(captor.getValue().getSettlementStatus()).isEqualTo(SettlementStatus.PENDING_ACCOUNT);
            assertThat(captor.getValue().getAccountId()).isNull();
        }

        @Test
        @DisplayName("4인 파티 정산: 수수료 15% 계산 검증")
        void 수수료_계산() {
            // 4명 × 3,625원 = 14,500원 → 수수료 (int)(14500 * 0.15) = 2,175원 → 순정산 12,325원
            given(settlementDao.findByPartyIdAndMonth(PARTY_ID, TARGET_MONTH)).willReturn(Optional.empty());
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(party()));
            given(accountDao.findByUserId(LEADER_ID)).willReturn(Optional.of(verifiedAccount()));
            given(paymentDao.findByPartyId(PARTY_ID))
                .willReturn(completedPaymentsByDate(3625, 3625, 3625, 3625));
            given(depositDao.findForfeitedByPartyIdAndPeriod(any(), any(), any())).willReturn(List.of());

            settlementService.createMonthlySettlement(PARTY_ID, TARGET_MONTH);

            ArgumentCaptor<Settlement> captor = ArgumentCaptor.forClass(Settlement.class);
            verify(settlementDao).insertSettlement(captor.capture());
            Settlement saved = captor.getValue();
            assertThat(saved.getTotalAmount()).isEqualTo(14500);
            assertThat(saved.getCommissionAmount()).isEqualTo(2175);
            assertThat(saved.getNetAmount()).isEqualTo(12325);
            assertThat(saved.getSettlementStatus()).isEqualTo(SettlementStatus.PENDING);
        }

        @Test
        @DisplayName("몰수 보증금은 총액에 합산되고 수수료는 결제액에만 적용")
        void 몰수_보증금_합산() {
            // 결제 10,000원 + 몰수 5,000원 = 총 15,000원
            // 수수료 = (int)(10000 * 0.15) = 1,500원 (결제액만 대상)
            // 순정산 = 15,000 - 1,500 = 13,500원
            given(settlementDao.findByPartyIdAndMonth(PARTY_ID, TARGET_MONTH)).willReturn(Optional.empty());
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(party()));
            given(accountDao.findByUserId(LEADER_ID)).willReturn(Optional.of(verifiedAccount()));
            given(paymentDao.findByPartyId(PARTY_ID)).willReturn(completedPaymentsByDate(10000));
            given(depositDao.findForfeitedByPartyIdAndPeriod(any(), any(), any()))
                .willReturn(List.of(forfeitedDeposit(5000)));

            settlementService.createMonthlySettlement(PARTY_ID, TARGET_MONTH);

            ArgumentCaptor<Settlement> captor = ArgumentCaptor.forClass(Settlement.class);
            verify(settlementDao).insertSettlement(captor.capture());
            Settlement saved = captor.getValue();
            assertThat(saved.getTotalAmount()).isEqualTo(15000);
            assertThat(saved.getCommissionAmount()).isEqualTo(1500);
            assertThat(saved.getNetAmount()).isEqualTo(13500);
        }

        @Test
        @DisplayName("정산할 결제 내역과 몰수 보증금이 모두 없으면 null 반환")
        void 정산_내역_없음_null_반환() {
            given(settlementDao.findByPartyIdAndMonth(PARTY_ID, TARGET_MONTH)).willReturn(Optional.empty());
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(party()));
            given(accountDao.findByUserId(LEADER_ID)).willReturn(Optional.of(verifiedAccount()));
            given(paymentDao.findByPartyId(PARTY_ID)).willReturn(List.of());
            given(depositDao.findForfeitedByPartyIdAndPeriod(any(), any(), any())).willReturn(List.of());

            Settlement result = settlementService.createMonthlySettlement(PARTY_ID, TARGET_MONTH);

            assertThat(result).isNull();
            verify(settlementDao, never()).insertSettlement(any());
        }
    }

    // ── 픽스처 ──────────────────────────────────────────────────────

    private Party party() {
        return Party.builder()
            .partyId(PARTY_ID)
            .partyLeaderId(LEADER_ID)
            .startDate(PARTY_START)
            .build();
    }

    private Account verifiedAccount() {
        return Account.builder()
            .accountId(10)
            .userId(LEADER_ID)
            .bankCode("004")
            .accountNumber("1234567890")
            .accountHolder("홍길동")
            .isVerified("Y")
            .build();
    }

    /** 날짜 범위 필터 통과용 (createMonthlySettlement 일반 경로) */
    private List<PaymentResponse> completedPaymentsByDate(int... amounts) {
        return Arrays.stream(amounts)
            .mapToObj(amount -> PaymentResponse.builder()
                .paymentId(amount)
                .paymentAmount(amount)
                .paymentStatus("COMPLETED")
                .paymentDate(PAYMENT_DATE)
                .build())
            .collect(Collectors.toList());
    }

    /** targetMonth 필터 통과용 (createPendingAccountSettlement 경로) */
    private List<PaymentResponse> completedPaymentsByTargetMonth(int... amounts) {
        return Arrays.stream(amounts)
            .mapToObj(amount -> PaymentResponse.builder()
                .paymentId(amount)
                .paymentAmount(amount)
                .paymentStatus("COMPLETED")
                .targetMonth(TARGET_MONTH)
                .build())
            .collect(Collectors.toList());
    }

    private Deposit forfeitedDeposit(int amount) {
        return Deposit.builder()
            .depositId(100)
            .partyId(PARTY_ID)
            .depositAmount(amount)
            .build();
    }
}
