package com.moa.ai.report.dto;

import java.time.LocalDateTime;

import com.moa.ai.report.domain.MonthlyReport;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MonthlyReportResponse {
    private Integer reportId;
    private String targetMonth;
    private String summary;
    private Integer totalPaid;
    private Integer paymentCount;
    private LocalDateTime createdAt;

    public static MonthlyReportResponse from(MonthlyReport report) {
        return MonthlyReportResponse.builder()
                .reportId(report.getReportId())
                .targetMonth(report.getTargetMonth())
                .summary(report.getSummary())
                .totalPaid(report.getTotalPaid())
                .paymentCount(report.getPaymentCount())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
