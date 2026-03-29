package com.moa.party.service;

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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.moa.deposit.service.DepositService;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.party.domain.Party;
import com.moa.party.domain.PartyMember;
import com.moa.party.domain.enums.MemberStatus;
import com.moa.party.domain.enums.PartyStatus;
import com.moa.party.dto.request.PartyCreateRequest;
import com.moa.party.repository.PartyDao;
import com.moa.party.repository.PartyMemberDao;
import com.moa.party.service.impl.PartyServiceImpl;
import com.moa.payment.dto.request.PaymentRequest;
import com.moa.payment.service.PaymentService;
import com.moa.payment.service.RefundRetryService;
import com.moa.payment.service.TossPaymentService;
import com.moa.product.repository.ProductDao;
import com.moa.push.service.PushService;
import com.moa.user.repository.UserCardDao;
import com.moa.user.repository.UserDao;

@ExtendWith(MockitoExtension.class)
@DisplayName("파티 서비스")
class PartyServiceTest {

    @InjectMocks private PartyServiceImpl partyService;

    @Mock private PartyDao partyDao;
    @Mock private PartyMemberDao partyMemberDao;
    @Mock private ProductDao productDao;
    @Mock private DepositService depositService;
    @Mock private PaymentService paymentService;
    @Mock private PushService pushService;
    @Mock private TossPaymentService tossPaymentService;
    @Mock private RefundRetryService refundRetryService;
    @Mock private UserDao userDao;
    @Mock private UserCardDao userCardDao;

    private static final Integer PARTY_ID = 1;
    private static final String LEADER_ID = "leader01";
    private static final String USER_ID = "user01";

    @Nested
    @DisplayName("파티 가입")
    class JoinParty {

        @Test
        @DisplayName("RECRUITING이 아닌 파티에 가입 시도 → PARTY_NOT_RECRUITING 예외")
        void RECRUITING_아닌_파티_가입_예외() {
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(partyWith(PartyStatus.ACTIVE)));

            assertThatThrownBy(() -> partyService.joinParty(PARTY_ID, USER_ID, paymentRequest()))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.PARTY_NOT_RECRUITING);
        }

        @Test
        @DisplayName("파티장이 자신의 파티에 가입 시도 → LEADER_CANNOT_JOIN 예외")
        void 파티장_가입_시도_예외() {
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(recruitingParty()));

            // LEADER_ID로 가입 시도
            assertThatThrownBy(() -> partyService.joinParty(PARTY_ID, LEADER_ID, paymentRequest()))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.LEADER_CANNOT_JOIN);
        }

        @Test
        @DisplayName("이미 가입된 파티 재가입 시도 → ALREADY_JOINED 예외")
        void 이미_가입된_파티_재가입_예외() {
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(recruitingParty()));
            given(partyMemberDao.findByPartyIdAndUserId(PARTY_ID, USER_ID))
                .willReturn(Optional.of(activeMember()));

            assertThatThrownBy(() -> partyService.joinParty(PARTY_ID, USER_ID, paymentRequest()))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.ALREADY_JOINED);
        }

        @Test
        @DisplayName("파티 정원 초과 → PARTY_FULL 예외")
        void 정원_초과_예외() {
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(recruitingParty()));
            given(partyMemberDao.findByPartyIdAndUserId(PARTY_ID, USER_ID)).willReturn(Optional.empty());
            given(partyDao.incrementCurrentMembers(PARTY_ID)).willReturn(0); // 정원 초과로 업데이트 실패

            assertThatThrownBy(() -> partyService.joinParty(PARTY_ID, USER_ID, paymentRequest()))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.PARTY_FULL);
        }
    }

    @Nested
    @DisplayName("파티 탈퇴")
    class LeaveParty {

        @Test
        @DisplayName("파티장이 탈퇴 시도 → LEADER_CANNOT_LEAVE 예외")
        void 파티장_탈퇴_예외() {
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(recruitingParty()));

            assertThatThrownBy(() -> partyService.leaveParty(PARTY_ID, LEADER_ID))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.LEADER_CANNOT_LEAVE);
        }

        @Test
        @DisplayName("ACTIVE 상태가 아닌 멤버가 탈퇴 시도 → NOT_PARTY_MEMBER 예외")
        void 비활성_멤버_탈퇴_예외() {
            given(partyDao.findById(PARTY_ID)).willReturn(Optional.of(recruitingParty()));
            given(partyMemberDao.findByPartyIdAndUserId(PARTY_ID, USER_ID))
                .willReturn(Optional.of(inactiveMember()));

            assertThatThrownBy(() -> partyService.leaveParty(PARTY_ID, USER_ID))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.NOT_PARTY_MEMBER);
        }

        @Test
        @DisplayName("ACTIVE 파티에서 멤버 탈퇴 시 정원 미달이면 RECRUITING으로 상태 변경")
        void ACTIVE_파티_멤버_탈퇴_후_RECRUITING_전환() {
            // 4인 파티에 3명, 1명 탈퇴 → 2명 < 4명 → RECRUITING 전환
            Party activeParty = Party.builder()
                .partyId(PARTY_ID).partyLeaderId(LEADER_ID)
                .partyStatus(PartyStatus.ACTIVE).maxMembers(4).currentMembers(3)
                .startDate(LocalDateTime.now().minusDays(10)) // 이미 시작한 파티 (구독료 환불 없음)
                .build();
            Party afterLeaveParty = Party.builder()
                .partyId(PARTY_ID).partyLeaderId(LEADER_ID)
                .partyStatus(PartyStatus.ACTIVE).maxMembers(4).currentMembers(2)
                .build();

            given(partyDao.findById(PARTY_ID))
                .willReturn(Optional.of(activeParty), Optional.of(afterLeaveParty));
            given(partyMemberDao.findByPartyIdAndUserId(PARTY_ID, USER_ID))
                .willReturn(Optional.of(activeMember()));
            given(partyDao.decrementCurrentMembers(PARTY_ID)).willReturn(1);
            given(depositService.findByPartyIdAndUserId(PARTY_ID, USER_ID)).willReturn(null);

            partyService.leaveParty(PARTY_ID, USER_ID);

            verify(partyDao).updatePartyStatus(PARTY_ID, PartyStatus.RECRUITING);
        }
    }

    @Nested
    @DisplayName("파티 생성 입력 검증")
    class CreateParty {

        @Test
        @DisplayName("상품 ID 없음 → PRODUCT_ID_REQUIRED 예외")
        void 상품ID_없음_예외() {
            PartyCreateRequest request = createRequest(null, 4);

            assertThatThrownBy(() -> partyService.createParty(LEADER_ID, request))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.PRODUCT_ID_REQUIRED);
        }

        @Test
        @DisplayName("최대 인원 1명 (최소 2명 미만) → INVALID_MAX_MEMBERS 예외")
        void 최대_인원_1명_예외() {
            PartyCreateRequest request = createRequest(1, 1);

            assertThatThrownBy(() -> partyService.createParty(LEADER_ID, request))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.INVALID_MAX_MEMBERS);
        }

        @Test
        @DisplayName("최대 인원 11명 (최대 10명 초과) → INVALID_MAX_MEMBERS 예외")
        void 최대_인원_11명_예외() {
            PartyCreateRequest request = createRequest(1, 11);

            assertThatThrownBy(() -> partyService.createParty(LEADER_ID, request))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.INVALID_MAX_MEMBERS);
        }

        @Test
        @DisplayName("시작일 없음 → START_DATE_REQUIRED 예외")
        void 시작일_없음_예외() {
            PartyCreateRequest request = createRequest(1, 4);
            request.setStartDate(null);

            assertThatThrownBy(() -> partyService.createParty(LEADER_ID, request))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.START_DATE_REQUIRED);
        }
    }

    // ── 픽스처 ──────────────────────────────────────────────────────

    private Party recruitingParty() {
        return Party.builder()
            .partyId(PARTY_ID).partyLeaderId(LEADER_ID)
            .partyStatus(PartyStatus.RECRUITING).maxMembers(4).currentMembers(2)
            .monthlyFee(3625)
            .startDate(LocalDateTime.now().plusDays(5))
            .build();
    }

    private Party partyWith(PartyStatus status) {
        return Party.builder()
            .partyId(PARTY_ID).partyLeaderId(LEADER_ID)
            .partyStatus(status)
            .build();
    }

    private PartyMember activeMember() {
        return PartyMember.builder()
            .partyId(PARTY_ID).userId(USER_ID)
            .memberStatus(MemberStatus.ACTIVE)
            .build();
    }

    private PartyMember inactiveMember() {
        return PartyMember.builder()
            .partyId(PARTY_ID).userId(USER_ID)
            .memberStatus(MemberStatus.INACTIVE)
            .build();
    }

    private PaymentRequest paymentRequest() {
        PaymentRequest req = new PaymentRequest();
        req.setAuthKey("authKey");
        return req;
    }

    private PartyCreateRequest createRequest(Integer productId, Integer maxMembers) {
        PartyCreateRequest req = new PartyCreateRequest();
        req.setProductId(productId);
        req.setMaxMembers(maxMembers);
        req.setStartDate(java.time.LocalDate.now().plusDays(7));
        req.setOttId("test@ott.com");
        req.setOttPassword("password");
        return req;
    }
}
