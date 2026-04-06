package com.moa.user.service.impl;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.global.service.mail.EmailService;
import com.moa.user.repository.UserDao;
import com.moa.user.service.ResetPasswordService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResetPasswordServiceImpl implements ResetPasswordService {

    private static final String OTP_PREFIX       = "reset:otp:";
    private static final String OTP_FAIL_PREFIX  = "reset:otp:fail:";
    private static final String TOKEN_PREFIX     = "reset:token:";
    private static final int    OTP_TTL_MIN      = 10;
    private static final int    TOKEN_TTL_MIN    = 15;
    private static final int    MAX_ATTEMPTS     = 5;

    private final StringRedisTemplate redis;
    private final UserDao userDao;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void sendOtp(String email) {
        String userId = email.toLowerCase();

        // 이메일 존재 여부와 무관하게 동일한 응답 (열거 공격 방지)
        boolean userExists = userDao.findByUserId(userId).isPresent();

        if (userExists) {
            String otp = generateOtp();

            redis.delete(OTP_FAIL_PREFIX + userId);
            redis.opsForValue().set(OTP_PREFIX + userId, otp, OTP_TTL_MIN, TimeUnit.MINUTES);

            try {
                emailService.sendResetPasswordOtp(userId, otp);
            } catch (Exception e) {
                log.error("[비밀번호 재설정] OTP 이메일 발송 실패 - {}", userId, e);
                // 이메일 발송 실패를 사용자에게 노출하지 않음 (타이밍 공격 방지)
            }
        }
    }

    @Override
    public String verifyOtp(String email, String code) {
        String userId = email.toLowerCase();

        String storedOtp = redis.opsForValue().get(OTP_PREFIX + userId);
        if (storedOtp == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "인증 코드가 만료되었거나 발송된 코드가 없습니다.");
        }

        String failKey = OTP_FAIL_PREFIX + userId;
        String failStr = redis.opsForValue().get(failKey);
        int failCount = failStr == null ? 0 : Integer.parseInt(failStr);

        if (failCount >= MAX_ATTEMPTS) {
            redis.delete(OTP_PREFIX + userId);
            redis.delete(failKey);
            throw new BusinessException(ErrorCode.FORBIDDEN, "인증 시도 횟수를 초과했습니다. 코드를 다시 요청해주세요.");
        }

        if (!storedOtp.equals(code)) {
            redis.opsForValue().set(failKey, String.valueOf(failCount + 1), OTP_TTL_MIN, TimeUnit.MINUTES);
            int remaining = MAX_ATTEMPTS - failCount - 1;
            throw new BusinessException(ErrorCode.BAD_REQUEST,
                    "인증 코드가 올바르지 않습니다. (남은 시도 " + remaining + "회)");
        }

        // 검증 성공 → OTP 즉시 소멸
        redis.delete(OTP_PREFIX + userId);
        redis.delete(failKey);

        // 1회성 재설정 토큰 발급
        String resetToken = generateResetToken();
        redis.opsForValue().set(TOKEN_PREFIX + resetToken, userId, TOKEN_TTL_MIN, TimeUnit.MINUTES);

        return resetToken;
    }

    @Override
    public void confirmReset(String resetToken, String newPassword, String newPasswordConfirm) {
        if (!newPassword.equals(newPasswordConfirm)) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "비밀번호 확인이 일치하지 않습니다.");
        }

        validatePasswordRule(newPassword);

        String userId = redis.opsForValue().get(TOKEN_PREFIX + resetToken);
        if (userId == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "재설정 토큰이 만료되었거나 유효하지 않습니다.");
        }

        redis.delete(TOKEN_PREFIX + resetToken);

        String encoded = passwordEncoder.encode(newPassword);
        userDao.updatePassword(userId, encoded);
    }

    private void validatePasswordRule(String password) {
        if (password == null || password.length() < 8 || password.length() > 20) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "비밀번호는 8~20자여야 합니다.");
        }
        boolean hasLetter = false;
        boolean hasDigitOrSpecial = false;
        for (char c : password.toCharArray()) {
            if (Character.isLetter(c)) hasLetter = true;
            if (Character.isDigit(c) || !Character.isLetterOrDigit(c)) hasDigitOrSpecial = true;
        }
        if (!hasLetter || !hasDigitOrSpecial) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "비밀번호는 영문과 숫자 또는 특수문자를 포함해야 합니다.");
        }
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    private String generateResetToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
