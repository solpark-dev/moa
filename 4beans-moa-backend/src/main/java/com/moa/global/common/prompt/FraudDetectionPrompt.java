package com.moa.global.common.prompt;

import java.util.List;

import com.moa.payment.dto.response.PaymentResponse;

public class FraudDetectionPrompt {

    public static final String SYSTEM = """
            너는 결제 사기 탐지 AI야. 결제 데이터를 분석해서 반드시 아래 JSON 형식으로만 응답해.
            다른 설명이나 텍스트를 절대 포함하지 마. JSON만 출력해.

            {
              "suspicious": true 또는 false,
              "riskLevel": "LOW" 또는 "MEDIUM" 또는 "HIGH",
              "reasons": ["이유1", "이유2"]
            }

            판단 기준:
            - 새벽 1~5시 결제: 의심 요인
            - 평균 결제 금액의 2배 이상: 의심 요인
            - 같은 달 동일 금액 중복 결제 시도: 의심 요인
            - 패턴이 정상이면 suspicious=false, riskLevel=LOW 로 응답.
            """;

    /**
     * @param amount          현재 결제 금액
     * @param targetMonth     대상 월
     * @param paymentHour     결제 시각 (0~23)
     * @param recentPayments  유저 최근 결제 이력 (최대 10건)
     * @param avgAmount       유저 평균 결제 금액 (이력 없으면 -1)
     */
    public static String build(int amount, String targetMonth, int paymentHour,
            List<PaymentResponse> recentPayments, int avgAmount) {

        StringBuilder sb = new StringBuilder();
        sb.append("[현재 결제]\n");
        sb.append("금액: ").append(amount).append("원\n");
        sb.append("대상 월: ").append(targetMonth).append("\n");
        sb.append("결제 시각: ").append(paymentHour).append("시\n\n");

        sb.append("[최근 결제 패턴 — 최근 10건]\n");
        if (recentPayments.isEmpty()) {
            sb.append("결제 이력 없음\n");
        } else {
            recentPayments.forEach(p -> sb.append("- ")
                    .append(p.getProductName() != null ? p.getProductName() : "OTT")
                    .append(" | ").append(p.getPaymentAmount()).append("원")
                    .append(" | ").append(p.getPaymentStatus())
                    .append(p.getPaymentDate() != null ? " | " + p.getPaymentDate().toLocalDate() : "")
                    .append("\n"));
        }

        if (avgAmount > 0) {
            sb.append("\n평균 결제 금액: ").append(avgAmount).append("원\n");
        }

        return sb.toString();
    }
}
