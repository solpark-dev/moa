package com.moa.global.common.prompt;

import java.util.List;

import com.moa.payment.dto.response.PaymentResponse;

public class MonthlyReportPrompt {

    public static final String SYSTEM = """
            너는 구독 공유 플랫폼 MoA의 월간 리포트 작성 AI야.
            사용자가 제공한 결제 데이터를 바탕으로 친근하고 간결한 한국어 월간 리포트를 작성해.
            숫자는 '원' 단위로 표시하고, 이모지를 적절히 활용해서 읽기 쉽게 만들어줘.
            절대 데이터에 없는 내용을 추측하거나 만들지 마.
            """;

    /**
     * 리포트 생성용 유저 프롬프트.
     *
     * @param nickname     유저 닉네임
     * @param targetMonth  대상 월 (예: "2026-03")
     * @param payments     해당 월 완료 결제 목록
     * @param totalPaid    이번 달 총 결제액
     * @param prevTotal    지난 달 총 결제액 (없으면 -1)
     */
    public static String build(String nickname, String targetMonth,
            List<PaymentResponse> payments, int totalPaid, int prevTotal) {

        StringBuilder data = new StringBuilder();
        data.append("[이번 달 결제 내역]\n");
        if (payments.isEmpty()) {
            data.append("- 완료된 결제 없음\n");
        } else {
            payments.forEach(p -> data.append("- ")
                    .append(p.getProductName() != null ? p.getProductName() : "OTT 서비스")
                    .append(" | ").append(p.getPaymentAmount()).append("원")
                    .append(" | ").append(p.getPaymentDate() != null
                            ? p.getPaymentDate().toLocalDate() : "날짜 미상")
                    .append("\n"));
        }

        data.append("\n[총 결제 금액]\n");
        data.append("- 이번 달: ").append(totalPaid).append("원\n");
        if (prevTotal >= 0) {
            int diff = totalPaid - prevTotal;
            String diffStr = diff > 0
                    ? "+" + diff + "원 증가"
                    : diff < 0
                    ? Math.abs(diff) + "원 감소"
                    : "전월과 동일";
            data.append("- 전월 대비: ").append(diffStr).append("\n");
        }

        return """
                %s님의 %s 월간 구독 리포트를 아래 데이터를 바탕으로 작성해줘.

                %s
                리포트 형식 (이 순서로, 각 항목 2~3문장):
                1. 이번 달 요약
                2. 절약 포인트 (파티 공유로 아낀 금액이 있다면)
                3. 한 줄 응원 메시지
                """.formatted(nickname, targetMonth, data);
    }
}
