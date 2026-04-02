package com.moa.ai.report.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyReport {
    private Integer reportId;
    private String userId;
    private String targetMonth;   // "yyyy-MM"
    private String summary;       // AI 생성 요약
    private Integer totalPaid;
    private Integer paymentCount;
    private LocalDateTime createdAt;
}
