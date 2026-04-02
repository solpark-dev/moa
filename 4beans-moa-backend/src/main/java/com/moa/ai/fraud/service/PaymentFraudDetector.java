package com.moa.ai.fraud.service;

import com.moa.global.common.event.MonthlyPaymentCompletedEvent;

public interface PaymentFraudDetector {

    /**
     * 결제 완료 이벤트를 분석해 이상 여부를 판단.
     * 의심 결제로 판정되면 DB 저장 + 관리자 알림 발송.
     */
    void analyze(MonthlyPaymentCompletedEvent event);
}
