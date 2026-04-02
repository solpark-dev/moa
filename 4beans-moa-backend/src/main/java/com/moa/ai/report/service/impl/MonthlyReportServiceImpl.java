package com.moa.ai.report.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.moa.ai.report.domain.MonthlyReport;
import com.moa.ai.report.repository.MonthlyReportDao;
import com.moa.ai.report.service.MonthlyReportService;
import com.moa.global.common.prompt.MonthlyReportPrompt;
import com.moa.global.service.ai.LlmChatClient;
import com.moa.payment.dto.response.PaymentResponse;
import com.moa.payment.repository.PaymentDao;
import com.moa.user.domain.User;
import com.moa.user.repository.UserDao;

import reactor.core.publisher.Mono;

@Service
public class MonthlyReportServiceImpl implements MonthlyReportService {

    private static final Logger log = LoggerFactory.getLogger(MonthlyReportServiceImpl.class);
    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("yyyy-MM");

    private final MonthlyReportDao reportDao;
    private final PaymentDao paymentDao;
    private final UserDao userDao;
    private final LlmChatClient llmChatClient;

    public MonthlyReportServiceImpl(MonthlyReportDao reportDao, PaymentDao paymentDao,
            UserDao userDao, LlmChatClient llmChatClient) {
        this.reportDao = reportDao;
        this.paymentDao = paymentDao;
        this.userDao = userDao;
        this.llmChatClient = llmChatClient;
    }

    @Override
    public MonthlyReport generate(String userId, String targetMonth) {
        log.info("[MonthlyReport] 생성 시작 userId={} month={}", userId, targetMonth);

        // 1. 닉네임 조회
        String nickname = userDao.findByUserId(userId)
                .map(User::getNickname)
                .orElse("사용자");

        // 2. 이번 달 결제 내역
        List<PaymentResponse> payments = paymentDao.findByUserIdAndTargetMonth(userId, targetMonth);
        int totalPaid = payments.stream()
                .mapToInt(p -> p.getPaymentAmount() != null ? p.getPaymentAmount() : 0)
                .sum();

        // 3. 전월 결제 합계 (비교용)
        String prevMonth = LocalDate.parse(targetMonth + "-01").minusMonths(1).format(MONTH_FMT);
        List<PaymentResponse> prevPayments = paymentDao.findByUserIdAndTargetMonth(userId, prevMonth);
        int prevTotal = prevPayments.stream()
                .mapToInt(p -> p.getPaymentAmount() != null ? p.getPaymentAmount() : 0)
                .sum();

        // 4. LLM 호출
        String userPrompt = MonthlyReportPrompt.build(
                nickname, targetMonth, payments, totalPaid,
                prevPayments.isEmpty() ? -1 : prevTotal);

        String summary = llmChatClient.chat(MonthlyReportPrompt.SYSTEM, userPrompt)
                .onErrorResume(e -> {
                    log.warn("[MonthlyReport] LLM 호출 실패 userId={}, fallback 사용. 원인: {}", userId, e.getMessage());
                    return Mono.just(buildFallbackSummary(nickname, targetMonth, totalPaid, payments.size()));
                })
                .block();

        // 5. DB 저장 (ON DUPLICATE KEY UPDATE로 재생성도 지원)
        MonthlyReport report = MonthlyReport.builder()
                .userId(userId)
                .targetMonth(targetMonth)
                .summary(summary)
                .totalPaid(totalPaid)
                .paymentCount(payments.size())
                .build();

        reportDao.insert(report);
        log.info("[MonthlyReport] 저장 완료 userId={} month={} totalPaid={}", userId, targetMonth, totalPaid);
        return report;
    }

    @Override
    public Optional<MonthlyReport> findByUserIdAndMonth(String userId, String targetMonth) {
        return reportDao.findByUserIdAndMonth(userId, targetMonth);
    }

    @Override
    public List<MonthlyReport> findAllByUserId(String userId) {
        return reportDao.findByUserId(userId);
    }

    // ── LLM 실패 시 기본 요약 ──────────────────────────────────────

    private String buildFallbackSummary(String nickname, String targetMonth,
            int totalPaid, int paymentCount) {
        return "%s님의 %s 월간 리포트\n총 %d건의 구독 결제, %d원이 처리되었습니다."
                .formatted(nickname, targetMonth, paymentCount, totalPaid);
    }
}
