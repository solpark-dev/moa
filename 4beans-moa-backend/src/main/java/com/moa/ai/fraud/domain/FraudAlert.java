package com.moa.ai.fraud.domain;

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
public class FraudAlert {
    private Integer alertId;
    private Integer paymentId;
    private String userId;
    private Integer partyId;
    private Integer amount;
    private String targetMonth;
    private String riskLevel;    // LOW | MEDIUM | HIGH
    private String reasons;      // JSON 배열 문자열
    private String aiAnalysis;   // LLM 원본 응답
    private LocalDateTime createdAt;
    private String status;       // PENDING | RESOLVED | DISMISSED
    private String memo;         // 관리자 처리 메모
}
