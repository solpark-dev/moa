package com.moa.global.service.ai.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * OpenAI 호환 /chat/completions 요청 바디.
 * NVIDIA NIM, OpenRouter, OpenAI 모두 동일 포맷 사용.
 */
public record LlmRequest(
        String model,
        List<ChatMessage> messages,
        double temperature,
        @JsonProperty("max_tokens") int maxTokens,
        boolean stream
) {
    /** 단순 단발성 요청 (스트리밍 없음) */
    public static LlmRequest of(String model, List<ChatMessage> messages, double temperature, int maxTokens) {
        return new LlmRequest(model, messages, temperature, maxTokens, false);
    }
}
