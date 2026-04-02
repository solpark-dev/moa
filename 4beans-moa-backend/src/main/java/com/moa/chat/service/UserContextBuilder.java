package com.moa.chat.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.moa.payment.dto.response.PaymentResponse;
import com.moa.payment.repository.PaymentDao;
import com.moa.party.domain.PartyMember;
import com.moa.party.repository.PartyMemberDao;
import com.moa.subscription.dto.SubscriptionDTO;
import com.moa.subscription.repository.SubscriptionDao;
import com.moa.user.domain.User;
import com.moa.user.repository.UserDao;

/**
 * 로그인 유저의 DB 데이터를 모아 LLM 프롬프트 컨텍스트 문자열로 변환.
 *
 * LLM에 개인 데이터를 넘겨줄 때 PII(개인식별정보)를 최소화:
 * - 이름/닉네임은 포함, 카드번호/계좌번호는 제외
 * - 결제는 금액·서비스명·날짜·상태만 포함
 */
@Service
public class UserContextBuilder {

	private static final Logger log = LoggerFactory.getLogger(UserContextBuilder.class);

	private static final int PAYMENT_MONTHS = 3;
	private static final int PAYMENT_LIMIT = 10;

	private final UserDao userDao;
	private final SubscriptionDao subscriptionDao;
	private final PaymentDao paymentDao;
	private final PartyMemberDao partyMemberDao;

	public UserContextBuilder(UserDao userDao, SubscriptionDao subscriptionDao,
			PaymentDao paymentDao, PartyMemberDao partyMemberDao) {
		this.userDao = userDao;
		this.subscriptionDao = subscriptionDao;
		this.paymentDao = paymentDao;
		this.partyMemberDao = partyMemberDao;
	}

	/**
	 * 유저 컨텍스트 문자열 생성.
	 * 조회 실패 시 해당 섹션을 빈 상태로 넘기고 계속 진행 (부분 실패 허용).
	 */
	public String build(String userId) {
		StringBuilder sb = new StringBuilder();

		appendUserInfo(sb, userId);
		appendSubscriptions(sb, userId);
		appendRecentPayments(sb, userId);
		appendPartyMemberships(sb, userId);

		return sb.toString().trim();
	}

	// ── 섹션별 빌더 ────────────────────────────────────────────────

	private void appendUserInfo(StringBuilder sb, String userId) {
		try {
			userDao.findByUserId(userId).ifPresent(user -> {
				sb.append("[사용자 정보]\n");
				sb.append("닉네임: ").append(user.getNickname()).append("\n\n");
			});
		} catch (Exception e) {
			log.warn("[UserContext] 사용자 정보 조회 실패 userId={}", userId, e);
		}
	}

	private void appendSubscriptions(StringBuilder sb, String userId) {
		try {
			List<SubscriptionDTO> subs = subscriptionDao.getSubscriptionList(userId);
			if (subs == null || subs.isEmpty()) return;

			sb.append("[구독 중인 서비스]\n");
			subs.stream()
					.filter(s -> !"CANCELLED".equalsIgnoreCase(s.getSubscriptionStatus()))
					.forEach(s -> sb.append("- ")
							.append(s.getProductName() != null ? s.getProductName() : "상품ID:" + s.getProductId())
							.append(" | 상태: ").append(s.getSubscriptionStatus())
							.append(s.getEndDate() != null ? " | 만료: " + s.getEndDate() : "")
							.append("\n"));
			sb.append("\n");
		} catch (Exception e) {
			log.warn("[UserContext] 구독 조회 실패 userId={}", userId, e);
		}
	}

	private void appendRecentPayments(StringBuilder sb, String userId) {
		try {
			List<PaymentResponse> payments = paymentDao.findByUserId(userId);
			if (payments == null || payments.isEmpty()) return;

			LocalDateTime cutoff = LocalDateTime.now().minusMonths(PAYMENT_MONTHS);

			List<PaymentResponse> recent = payments.stream()
					.filter(p -> p.getPaymentDate() != null && p.getPaymentDate().isAfter(cutoff))
					.limit(PAYMENT_LIMIT)
					.toList();

			if (recent.isEmpty()) return;

			sb.append("[최근 ").append(PAYMENT_MONTHS).append("개월 결제 내역]\n");
			recent.forEach(p -> sb.append("- ")
					.append(p.getProductName() != null ? p.getProductName() : "파티ID:" + p.getPartyId())
					.append(" | ").append(p.getPaymentAmount()).append("원")
					.append(" | ").append(formatDate(p.getPaymentDate()))
					.append(" | ").append(p.getPaymentStatus())
					.append(p.getTargetMonth() != null ? " | 대상월: " + p.getTargetMonth() : "")
					.append("\n"));
			sb.append("\n");
		} catch (Exception e) {
			log.warn("[UserContext] 결제 내역 조회 실패 userId={}", userId, e);
		}
	}

	private void appendPartyMemberships(StringBuilder sb, String userId) {
		try {
			List<PartyMember> memberships = partyMemberDao.findActiveMembershipsByUserId(userId);
			if (memberships == null || memberships.isEmpty()) return;

			sb.append("[참여 중인 파티]\n");
			memberships.forEach(m -> sb.append("- 파티ID: ").append(m.getPartyId())
					.append(" | 역할: ").append("LEADER".equalsIgnoreCase(m.getMemberRole()) ? "파티장" : "파티원")
					.append(" | 가입일: ").append(m.getJoinDate() != null ? formatDate(m.getJoinDate()) : "미상")
					.append("\n"));
			sb.append("\n");
		} catch (Exception e) {
			log.warn("[UserContext] 파티 멤버십 조회 실패 userId={}", userId, e);
		}
	}

	// ── 유틸 ──────────────────────────────────────────────────────

	private String formatDate(LocalDateTime dt) {
		return dt.toLocalDate().toString();
	}
}
