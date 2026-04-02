package com.moa.global.service.ai.dto;

import java.util.List;

/**
 * OpenAI 호환 /chat/completions 응답 파싱.
 * choices[0].message.content 를 꺼내 쓰는 것이 주 목적.
 */
public record LlmResponse(List<Choice> choices) {

    /** 응답 텍스트 추출. choices가 비어있으면 빈 문자열 반환. */
    public String content() {
        if (choices == null || choices.isEmpty()) {
            return "";
        }
        Message msg = choices.get(0).message();
        return msg != null ? msg.content() : "";
    }

    public record Choice(Message message) {}

    public record Message(String role, String content) {}
}
