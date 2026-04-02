package com.moa.ai.report.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moa.ai.report.domain.MonthlyReport;
import com.moa.ai.report.dto.MonthlyReportResponse;
import com.moa.ai.report.service.MonthlyReportService;
import com.moa.global.common.exception.ApiResponse;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;

@RestController
@RequestMapping("/api/ai/report")
public class MonthlyReportController {

    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("yyyy-MM");

    private final MonthlyReportService reportService;

    public MonthlyReportController(MonthlyReportService reportService) {
        this.reportService = reportService;
    }

    /** 저장된 리포트 목록 조회 (최근 12개월) */
    @GetMapping
    public ApiResponse<List<MonthlyReportResponse>> list() {
        String userId = requireUserId();
        List<MonthlyReportResponse> list = reportService.findAllByUserId(userId)
                .stream()
                .map(MonthlyReportResponse::from)
                .toList();
        return ApiResponse.success(list);
    }

    /** 특정 월 리포트 조회 */
    @GetMapping("/{targetMonth}")
    public ApiResponse<MonthlyReportResponse> get(@PathVariable String targetMonth) {
        String userId = requireUserId();
        MonthlyReport report = reportService.findByUserIdAndMonth(userId, targetMonth)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND,
                        targetMonth + " 리포트가 아직 생성되지 않았습니다."));
        return ApiResponse.success(MonthlyReportResponse.from(report));
    }

    /** 지난 달 리포트 즉시 생성 (온디맨드) */
    @PostMapping("/generate")
    public ApiResponse<MonthlyReportResponse> generate() {
        String userId = requireUserId();
        String lastMonth = LocalDate.now().minusMonths(1).format(MONTH_FMT);
        MonthlyReport report = reportService.generate(userId, lastMonth);
        return ApiResponse.success(MonthlyReportResponse.from(report));
    }

    /** 특정 월 리포트 재생성 */
    @PostMapping("/generate/{targetMonth}")
    public ApiResponse<MonthlyReportResponse> generateForMonth(@PathVariable String targetMonth) {
        String userId = requireUserId();
        MonthlyReport report = reportService.generate(userId, targetMonth);
        return ApiResponse.success(MonthlyReportResponse.from(report));
    }

    // ── 유틸 ──────────────────────────────────────────────────────

    private String requireUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        Object principal = auth.getPrincipal();
        if (principal == null || "anonymousUser".equals(principal)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        return auth.getName();
    }
}
