package com.moa.user.service;

import com.moa.user.dto.TokenResponse;

public interface MagicLinkService {

    /**
     * 이메일로 Magic Link 발송. 이메일 존재 여부와 무관하게 동일한 성공 응답 반환 (열거 공격 방지)
     */
    void sendMagicLink(String email);

    /**
     * 토큰 검증 후 JWT 발급. 토큰은 1회 사용 후 즉시 소멸.
     */
    TokenResponse verifyMagicLink(String token);
}
