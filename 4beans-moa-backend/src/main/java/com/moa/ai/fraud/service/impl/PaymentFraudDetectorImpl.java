package com.moa.ai.fraud.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moa.ai.fraud.domain.FraudAlert;
import com.moa.ai.fraud.repository.FraudAlertDao;
import com.moa.ai.fraud.service.PaymentFraudDetector;
import com.moa.global.common.alert.WebhookNotificationService;
import com.moa.global.common.event.MonthlyPaymentCompletedEvent;
import com.moa.global.common.prompt.FraudDetectionPrompt;
import com.moa.global.service.ai.LlmChatClient;
import com.moa.payment.dto.response.PaymentResponse;
import com.moa.payment.repository.PaymentDao;

import reactor.core.publisher.Mono;

@Service
public class PaymentFraudDetectorImpl implements PaymentFraudDetector {

    private static final Logger log = LoggerFactory.getLogger(PaymentFraudDetectorImpl.class);
    private static final int OFF_HOURS_START = 1;  // 새벽 1시
    private static final int OFF_HOURS_END = 5;    // 새벽 5시
    private static final double AMOUNT_SPIKE_RATIO = 2.0; // 평균의 2배 이상
    private static final int RECENT_PAYMENTS_LIMIT = 10;

    private final PaymentDao paymentDao;
    private final FraudAlertDao fraudAlertDao;
    private final LlmChatClient llmChatClient;
    private final WebhookNotificationService webhookService;
    private final ObjectMapper objectMapper;

    public PaymentFraudDetectorImpl(PaymentDao paymentDao, FraudAlertDao fraudAlertDao,
            LlmChatClient llmChatClient, WebhookNotificationService webhookService) {
        this.paymentDao = paymentDao;
        this.fraudAlertDao = fraudAlertDao;
        this.llmChatClient = llmChatClient;
        this.webhookService = webhookService;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void analyze(MonthlyPaymentCompletedEvent event) {
        String userId = event.getUserId();
        int amount = event.getAmount();
        String targetMonth = event.getTargetMonth();
        int paymentHour = LocalDateTime.now().getHour();

        // 1. 유저 최근 결제 이력
        List<PaymentResponse> allPayments = paymentDao.findByUserId(userId);
        List<PaymentResponse> recent = allPayments.stream()
                .limit(RECENT_PAYMENTS_LIMIT)
                .collect(Collectors.toList());

        // 2. 규칙 기반 사전 검사 — 이상 없으면 LLM 호출 생략
        if (!hasAnomaly(amount, paymentHour, allPayments)) {
            log.debug("[FraudDetector] 정상 결제 userId={} amount={}", userId, amount);
            return;
        }

        log.info("[FraudDetector] 이상 징후 감지 → LLM 분석 시작 userId={} amount={}", userId, amount);

        // 3. 평균 결제 금액 계산
        int avgAmount = calcAvgAmount(allPayments);

        // 4. LLM 호출
        String userPrompt = FraudDetectionPrompt.build(amount, targetMonth, paymentHour, recent, avgAmount);
        String aiResponse = llmChatClient.chat(FraudDetectionPrompt.SYSTEM, userPrompt)
                .onErrorResume(e -> {
                    log.warn("[FraudDetector] LLM 호출 실패 — 규칙 기반 결과만 저장. 원인: {}", e.getMessage());
                    return Mono.just(buildFallbackResponse(amount, paymentHour, avgAmount));
                })
                .block();

        // 5. JSON 파싱
        FraudAnalysisResult result = parseResult(aiResponse);
        if (result == null) return; // 파싱 실패 시 무시

        log.info("[FraudDetector] 분석 결과 userId={} suspicious={} riskLevel={}",
                userId, result.suspicious(), result.riskLevel());

        // 6. 의심 결제만 저장 + 알림
        if (result.suspicious()) {
            saveAlert(event, aiResponse, result);
            webhookService.sendFraudAlert(userId, amount, targetMonth, result.riskLevel(), result.reasons());
        }
    }

    // ── 규칙 기반 사전 검사 ───────────────────────────────────────────

    private boolean hasAnomaly(int amount, int paymentHour, List<PaymentResponse> history) {
        if (isOffHours(paymentHour)) return true;
        if (isAmountSpike(amount, history)) return true;
        return false;
    }

    private boolean isOffHours(int hour) {
        return hour >= OFF_HOURS_START && hour < OFF_HOURS_END;
    }

    private boolean isAmountSpike(int amount, List<PaymentResponse> history) {
        if (history.size() < 3) return false; // 이력 부족 시 판단 보류
        int avg = calcAvgAmount(history);
        return avg > 0 && amount > avg * AMOUNT_SPIKE_RATIO;
    }

    private int calcAvgAmount(List<PaymentResponse> payments) {
        return (int) payments.stream()
                .filter(p -> "COMPLETED".equals(p.getPaymentStatus()))
                .mapToInt(p -> p.getPaymentAmount() != null ? p.getPaymentAmount() : 0)
                .average()
                .orElse(0);
    }

    // ── LLM 응답 파싱 ─────────────────────────────────────────────────

    private FraudAnalysisResult parseResult(String aiResponse) {
        try {
            // LLM이 JSON 앞뒤에 마크다운 코드블록을 붙이는 경우 제거
            String json = aiResponse
                    .replaceAll("(?s)```json\\s*", "")
                    .replaceAll("(?s)```\\s*", "")
                    .trim();
            JsonNode node = objectMapper.readTree(json);
            boolean suspicious = node.path("suspicious").asBoolean(false);
            String riskLevel = node.path("riskLevel").asText("LOW");
            String reasons = node.path("reasons").toString();
            return new FraudAnalysisResult(suspicious, riskLevel, reasons);
        } catch (Exception e) {
            log.warn("[FraudDetector] JSON 파싱 실패 — 응답: {}", aiResponse, e);
            return null;
        }
    }

    private String buildFallbackResponse(int amount, int paymentHour, int avgAmount) {
        List<String> reasons = new java.util.ArrayList<>();
        if (isOffHours(paymentHour)) reasons.add("새벽 시간대 결제");
        if (avgAmount > 0 && amount > avgAmount * AMOUNT_SPIKE_RATIO)
            reasons.add("평균 결제 금액 대비 " + String.format("%.1f", (double) amount / avgAmount) + "배");
        return "{\"suspicious\":true,\"riskLevel\":\"MEDIUM\",\"reasons\":" + reasons + "}";
    }

    // ── DB 저장 ───────────────────────────────────────────────────────

    private void saveAlert(MonthlyPaymentCompletedEvent event,
            String aiResponse, FraudAnalysisResult result) {
        FraudAlert alert = FraudAlert.builder()
                .userId(event.getUserId())
                .partyId(event.getPartyId())
                .amount(event.getAmount())
                .targetMonth(event.getTargetMonth())
                .riskLevel(result.riskLevel())
                .reasons(result.reasons())
                .aiAnalysis(aiResponse)
                .build();
        fraudAlertDao.insert(alert);
        log.info("[FraudDetector] 알림 저장 완료 alertId={}", alert.getAlertId());
    }

    // ── 내부 결과 레코드 ──────────────────────────────────────────────

    private record FraudAnalysisResult(boolean suspicious, String riskLevel, String reasons) {}
}
