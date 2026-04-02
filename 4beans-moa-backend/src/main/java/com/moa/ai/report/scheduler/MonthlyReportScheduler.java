package com.moa.ai.report.scheduler;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.moa.ai.report.service.MonthlyReportService;
import com.moa.payment.repository.PaymentDao;

/**
 * 매월 1일 오전 9시 — 전월에 완료 결제가 있는 유저의 월간 리포트를 자동 생성.
 * LLM API 요청 간 짧은 딜레이를 두어 rate limit 방지.
 */
@Component
public class MonthlyReportScheduler {

    private static final Logger log = LoggerFactory.getLogger(MonthlyReportScheduler.class);
    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final long DELAY_MS = 500L;

    private final MonthlyReportService reportService;
    private final PaymentDao paymentDao;

    public MonthlyReportScheduler(MonthlyReportService reportService, PaymentDao paymentDao) {
        this.reportService = reportService;
        this.paymentDao = paymentDao;
    }

    @Scheduled(cron = "0 0 9 1 * *")
    public void generateMonthlyReports() {
        String targetMonth = LocalDate.now().minusMonths(1).format(MONTH_FMT);
        log.info("[MonthlyReportScheduler] 시작 — 대상 월: {}", targetMonth);

        List<String> userIds = paymentDao.findDistinctUserIdsByTargetMonth(targetMonth);
        log.info("[MonthlyReportScheduler] 대상 유저 수: {}", userIds.size());

        int success = 0, fail = 0;

        for (String userId : userIds) {
            try {
                reportService.generate(userId, targetMonth);
                success++;
                Thread.sleep(DELAY_MS); // rate limit 방지
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                log.warn("[MonthlyReportScheduler] 인터럽트 발생, 중단");
                break;
            } catch (Exception e) {
                log.error("[MonthlyReportScheduler] 리포트 생성 실패 userId={}", userId, e);
                fail++;
            }
        }

        log.info("[MonthlyReportScheduler] 완료 — 성공: {}, 실패: {}", success, fail);
    }
}
