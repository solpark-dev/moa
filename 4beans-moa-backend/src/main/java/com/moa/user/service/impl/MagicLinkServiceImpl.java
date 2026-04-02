package com.moa.user.service.impl;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.moa.global.auth.provider.JwtProvider;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.global.service.mail.EmailService;
import com.moa.user.domain.User;
import com.moa.user.dto.TokenResponse;
import com.moa.user.repository.UserDao;
import com.moa.user.service.MagicLinkService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MagicLinkServiceImpl implements MagicLinkService {

    private static final String TOKEN_PREFIX = "magic:";
    private static final int    TOKEN_TTL_MIN = 15;

    private final StringRedisTemplate redis;
    private final UserDao userDao;
    private final EmailService emailService;
    private final JwtProvider jwtProvider;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void sendMagicLink(String email) {
        String userId = email.toLowerCase();
        boolean userExists = userDao.findByUserId(userId).isPresent();

        if (userExists) {
            String token = generateToken();
            redis.opsForValue().set(TOKEN_PREFIX + token, userId, TOKEN_TTL_MIN, TimeUnit.MINUTES);

            // 프론트엔드 콜백 URL: /auth/magic?token=xxx
            String magicUrl = frontendUrl + "/auth/magic?token=" + token;

            try {
                emailService.sendMagicLink(userId, magicUrl);
            } catch (Exception e) {
                log.error("[Magic Link] 이메일 발송 실패 - {}", userId, e);
            }
        }
    }

    @Override
    public TokenResponse verifyMagicLink(String token) {
        String userId = redis.opsForValue().get(TOKEN_PREFIX + token);

        if (userId == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "링크가 만료되었거나 유효하지 않습니다.");
        }

        // 1회성 — 즉시 소멸
        redis.delete(TOKEN_PREFIX + token);

        User user = userDao.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        userDao.updateLastLoginDate(userId);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userId, null, List.of(new SimpleGrantedAuthority(user.getRole())));

        return jwtProvider.generateToken(authentication);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
