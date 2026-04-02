package com.moa.global.service.ai;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeoutException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.global.service.ai.dto.ChatMessage;
import com.moa.global.service.ai.dto.LlmRequest;
import com.moa.global.service.ai.dto.LlmResponse;

import reactor.core.publisher.Mono;

/**
 * OpenAI 호환 LLM API 공통 클라이언트.
 *
 * 제공자(provider) 교체 방법:
 *   application.properties 에서 ai.provider / ai.base-url / ai.model / ai.api-key 만 바꾸면 됩니다.
 *   코드 수정 없이 NVIDIA NIM ↔ OpenRouter ↔ OpenAI 전환 가능.
 *
 * 사용 예시:
 *   llmChatClient.chat(SystemPrompt.MOA_CHATBOT.content(), userMessage)
 *   llmChatClient.chat(List.of(ChatMessage.system(...), ChatMessage.user(...)))
 */
@Service
public class LlmChatClient {

    private static final Logger log = LoggerFactory.getLogger(LlmChatClient.class);

    private final WebClient webClient;
    private final AiProperties props;

    public LlmChatClient(WebClient.Builder builder, AiProperties props) {
        this.props = props;
        this.webClient = buildWebClient(builder);
        log.info("[AI] 제공자={} / 모델={} / baseUrl={}",
                props.getProvider(), props.getModel(), props.getBaseUrl());
    }

    // ── 공개 API ──────────────────────────────────────────────────

    /**
     * system + user 메시지 두 개로 LLM 호출.
     * 가장 자주 쓰는 단순 케이스.
     */
    public Mono<String> chat(String systemPrompt, String userMessage) {
        return chat(List.of(
                ChatMessage.system(systemPrompt),
                ChatMessage.user(userMessage)
        ));
    }

    /**
     * 대화 히스토리(멀티턴) 또는 직접 조합한 메시지 목록으로 호출.
     * Phase 2 고객 상담처럼 DB 컨텍스트를 messages 안에 직접 넣을 때 사용.
     */
    public Mono<String> chat(List<ChatMessage> messages) {
        LlmRequest request = LlmRequest.of(
                props.getModel(), messages, props.getTemperature(), props.getMaxTokens());

        log.debug("[AI] 요청 → 모델={} / 메시지 수={}", props.getModel(), messages.size());

        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.value() == 429,
                        resp -> Mono.error(new BusinessException(ErrorCode.AI_RATE_LIMIT)))
                .onStatus(status -> status.value() >= 500,
                        resp -> resp.bodyToMono(String.class)
                                .flatMap(body -> {
                                    log.error("[AI] 제공자 서버 오류 → {}", body);
                                    return Mono.error(new BusinessException(ErrorCode.AI_CALL_FAILED));
                                }))
                .onStatus(status -> status.is4xxClientError(),
                        resp -> resp.bodyToMono(String.class)
                                .flatMap(body -> {
                                    log.error("[AI] 클라이언트 오류 (키/모델 확인) → {}", body);
                                    return Mono.error(new BusinessException(ErrorCode.AI_CALL_FAILED,
                                            "AI API 호출 오류 — API 키 또는 모델명을 확인하세요."));
                                }))
                .bodyToMono(LlmResponse.class)
                .map(resp -> {
                    String content = resp.content();
                    log.debug("[AI] 응답 수신 → {}자", content.length());
                    return content;
                })
                .timeout(Duration.ofSeconds(props.getTimeoutSeconds()))
                .onErrorMap(TimeoutException.class,
                        e -> new BusinessException(ErrorCode.AI_TIMEOUT))
                .onErrorMap(WebClientResponseException.class,
                        e -> new BusinessException(ErrorCode.AI_CALL_FAILED, e.getMessage()));
    }

    // ── 내부 구성 ─────────────────────────────────────────────────

    private WebClient buildWebClient(WebClient.Builder builder) {
        WebClient.Builder b = builder
                .baseUrl(props.getBaseUrl())
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + props.getApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        // OpenRouter는 출처 헤더가 있어야 무료 모델 접근 가능
        if (props.getProvider() == AiProvider.OPENROUTER) {
            b.defaultHeader("HTTP-Referer", "https://moa.onesun.shop");
            b.defaultHeader("X-Title", "MOA");
        }

        return b.build();
    }
}
