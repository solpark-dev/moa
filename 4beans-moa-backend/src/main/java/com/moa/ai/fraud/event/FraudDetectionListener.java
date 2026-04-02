package com.moa.ai.fraud.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.moa.ai.fraud.service.PaymentFraudDetector;
import com.moa.global.common.event.MonthlyPaymentCompletedEvent;

/**
 * 월간 결제 완료 이벤트를 비동기로 수신 → 사기 감지 실행.
 * @Async 로 결제 메인 플로우를 블로킹하지 않음.
 */
@Component
public class FraudDetectionListener {

    private static final Logger log = LoggerFactory.getLogger(FraudDetectionListener.class);

    private final PaymentFraudDetector fraudDetector;

    public FraudDetectionListener(PaymentFraudDetector fraudDetector) {
        this.fraudDetector = fraudDetector;
    }

    @Async
    @EventListener
    public void onPaymentCompleted(MonthlyPaymentCompletedEvent event) {
        try {
            fraudDetector.analyze(event);
        } catch (Exception e) {
            // 감지 실패가 결제 결과에 영향을 줘선 안 됨
            log.error("[FraudDetection] 분석 중 예외 발생 userId={}", event.getUserId(), e);
        }
    }
}
