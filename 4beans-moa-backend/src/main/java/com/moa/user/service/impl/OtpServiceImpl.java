package com.moa.user.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.user.repository.UserDao;
import com.moa.user.dto.OtpSetupResponse;
import com.moa.user.dto.OtpVerifyRequest;
import com.moa.user.service.OtpService;

import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.secret.SecretGenerator;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

	private static final String OTP_SETUP_PREFIX = "otp:setup:";
	private static final String OTP_VERIFY_FAIL_PREFIX = "otp:verify:fail:";
	private static final long OTP_VERIFY_TTL_SECONDS = 600;
	private static final int OTP_VERIFY_MAX_ATTEMPTS = 10;

	private final UserDao userDao;
	private final SecretGenerator secretGenerator;
	private final CodeVerifier codeVerifier;
	private final StringRedisTemplate redis;

	@Value("${app.otp.issuer:MOA}")
	private String issuer;

	@Override
	@Transactional
	public OtpSetupResponse setup() {
		String userId = getCurrentUserId();
		String secret = secretGenerator.generate();
		redis.opsForValue().set(OTP_SETUP_PREFIX + userId, secret, OTP_VERIFY_TTL_SECONDS, TimeUnit.SECONDS);
		String otpAuthUrl = buildOtpAuthUrl(userId, secret);
		Boolean enabled = userDao.isOtpEnabled(userId);
		boolean alreadyEnabled = enabled != null && enabled;
		return OtpSetupResponse.builder().secret(secret).otpAuthUrl(otpAuthUrl).enabled(alreadyEnabled).build();
	}

	@Override
	@Transactional
	public void verify(OtpVerifyRequest request) {
		String userId = getCurrentUserId();
		String secret = redis.opsForValue().get(OTP_SETUP_PREFIX + userId);
		if (secret == null) {
			secret = userDao.findOtpSecret(userId);
		}
		if (secret == null) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "OTP가 설정되지 않았습니다.");
		}

		checkRateLimit(userId);

		boolean valid = codeVerifier.isValidCode(secret, request.getCode());
		if (!valid) {
			incrementFailCount(userId);
			throw new BusinessException(ErrorCode.BAD_REQUEST, "잘못된 OTP 코드입니다.");
		}

		if (redis.hasKey(OTP_SETUP_PREFIX + userId)) {
			userDao.updateOtpSettings(userId, secret, true);
			redis.delete(OTP_SETUP_PREFIX + userId);
		}
		clearFailCount(userId);
	}

	@Override
	@Transactional
	public void disable() {
		String userId = getCurrentUserId();
		userDao.updateOtpSettings(userId, null, false);
	}

	@Override
	public void verifyLoginCode(String userId, String code) {
		String secret = userDao.findOtpSecret(userId);
		if (secret == null) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "OTP가 설정되지 않았습니다.");
		}
		boolean valid = codeVerifier.isValidCode(secret, code);
		if (!valid) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "잘못된 OTP 코드입니다.");
		}
	}

	private void checkRateLimit(String userId) {
		String key = OTP_VERIFY_FAIL_PREFIX + userId;
		String count = redis.opsForValue().get(key);
		if (count != null && Integer.parseInt(count) >= OTP_VERIFY_MAX_ATTEMPTS) {
			throw new BusinessException(ErrorCode.RATE_LIMIT_EXCEEDED, "OTP 검증 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.");
		}
	}

	private void incrementFailCount(String userId) {
		String key = OTP_VERIFY_FAIL_PREFIX + userId;
		Long count = redis.opsForValue().increment(key);
		if (count != null && count == 1) {
			redis.expire(key, OTP_VERIFY_TTL_SECONDS, TimeUnit.SECONDS);
		}
	}

	private void clearFailCount(String userId) {
		redis.delete(OTP_VERIFY_FAIL_PREFIX + userId);
	}

	private String getCurrentUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || authentication.getName() == null) {
			throw new BusinessException(ErrorCode.UNAUTHORIZED, "인증 정보가 없습니다.");
		}
		return authentication.getName();
	}

	private String buildOtpAuthUrl(String userId, String secret) {
		String encodedIssuer = URLEncoder.encode(issuer, StandardCharsets.UTF_8);
		String encodedUserId = URLEncoder.encode(userId, StandardCharsets.UTF_8);
		return "otpauth://totp/" + encodedIssuer + ":" + encodedUserId + "?secret=" + secret + "&issuer="
				+ encodedIssuer + "&digits=6&period=30";
	}

	@Override
	@Transactional
	public void disableWithCode(String userId, String code) {

		String secret = userDao.findOtpSecret(userId);
		if (secret == null) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "OTP가 설정되어 있지 않습니다.");
		}

		boolean valid = codeVerifier.isValidCode(secret, code);
		if (!valid) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "잘못된 OTP 코드입니다.");
		}

		userDao.updateOtpSettings(userId, null, false);
	}
}
