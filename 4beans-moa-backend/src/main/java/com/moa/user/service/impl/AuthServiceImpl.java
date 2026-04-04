package com.moa.user.service.impl;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moa.global.auth.provider.JwtProvider;
import com.moa.global.auth.service.TokenBlacklistService;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.global.service.mail.EmailService;
import com.moa.user.repository.EmailVerificationDao;
import com.moa.user.repository.UserDao;
import com.moa.user.domain.EmailVerification;
import com.moa.user.domain.User;
import com.moa.party.domain.enums.UserStatus;
import com.moa.user.dto.BackupCodeLoginRequest;
import com.moa.user.dto.OtpLoginVerifyRequest;
import com.moa.user.dto.TokenResponse;
import com.moa.user.dto.request.LoginRequest;
import com.moa.user.dto.response.LoginResponse;
import com.moa.user.service.AuthService;
import com.moa.user.service.BackupCodeService;
import com.moa.user.service.LoginHistoryService;
import com.moa.user.service.OtpService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private static final long OTP_TOKEN_TTL_MILLIS = 5 * 60 * 1000L;

	private final UserDao userDao;
	private final EmailVerificationDao emailVerificationDao;
	private final EmailService emailService;
	private final TokenBlacklistService tokenBlacklistService;
	private final PasswordEncoder passwordEncoder;
	private final JwtProvider jwtProvider;
	private final OtpService otpService;
	private final BackupCodeService backupCodeService;
	private final LoginHistoryService loginHistoryService;

	public LoginResponse login(LoginRequest request) {

		User user = userDao.findByUserIdIncludeDeleted(request.getUserId().toLowerCase())
				.orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "아이디를 확인해주세요."));

		if (user.getDeleteDate() != null && user.getStatus() == UserStatus.WITHDRAW) {
			loginHistoryService.recordFailure(user.getUserId(), "PASSWORD", null, null, "탈퇴한 계정");
			throw new BusinessException(ErrorCode.ACCOUNT_WITHDRAW, "탈퇴한 계정입니다.");
		}

		if (user.getStatus() == UserStatus.BLOCK) {
			if (user.getUnlockScheduledAt() != null && LocalDateTime.now().isAfter(user.getUnlockScheduledAt())) {
				userDao.updateUserStatus(user.getUserId(), UserStatus.ACTIVE);
				userDao.resetLoginFailCount(user.getUserId());
				user.setStatus(UserStatus.ACTIVE);
			} else {
				loginHistoryService.recordFailure(user.getUserId(), "PASSWORD", null, null, "잠금된 계정");
				throw new BusinessException(ErrorCode.FORBIDDEN, "잠금 처리된 계정입니다.");
			}
		}

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			userDao.increaseLoginFailCount(user.getUserId());

			loginHistoryService.recordFailure(user.getUserId(), "PASSWORD", null, null, "비밀번호 불일치");

			int failCount = userDao.getFailCount(user.getUserId());
			if (failCount >= 5) {
				userDao.blockUser(user.getUserId(), LocalDateTime.now().plusMinutes(60));
				throw new BusinessException(ErrorCode.FORBIDDEN, "로그인 5회 실패로 잠금 처리되었습니다.");
			}

			throw new BusinessException(ErrorCode.INVALID_LOGIN, "비밀번호를 확인해주세요.");
		}

		if (user.getStatus() == UserStatus.PENDING) {
			loginHistoryService.recordFailure(user.getUserId(), "PASSWORD", null, null, "이메일 미인증");
			throw new BusinessException(ErrorCode.FORBIDDEN, "이메일 인증이 필요합니다.");
		}

		userDao.resetLoginFailCount(user.getUserId());

		boolean otpEnabled = Boolean.TRUE.equals(user.getOtpEnabled());
		if (otpEnabled) {
			String otpToken = createOtpToken(user.getUserId());

			return LoginResponse.builder().otpRequired(true).otpToken(otpToken).build();
		}

		userDao.updateLastLoginDate(user.getUserId());

		Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUserId(), null,
				List.of(new SimpleGrantedAuthority(user.getRole())));

		TokenResponse token = jwtProvider.generateToken(authentication);

		return LoginResponse.builder().otpRequired(false).accessToken(token.getAccessToken())
				.refreshToken(token.getRefreshToken()).accessTokenExpiresIn(token.getAccessTokenExpiresIn()).build();
	}

	@Override
	public TokenResponse refresh(String refreshToken) {
		try {
			if (tokenBlacklistService.isTokenBlacklisted(refreshToken)) {
				throw new BusinessException(ErrorCode.UNAUTHORIZED, "로그아웃된 토큰입니다.");
			}

			String userId = jwtProvider.getUserIdFromToken(refreshToken);
			if (tokenBlacklistService.getBanTimestamp(userId) > 0) {
				throw new BusinessException(ErrorCode.UNAUTHORIZED, "밴된 계정입니다.");
			}

			TokenResponse newTokens = jwtProvider.refresh(refreshToken);

			long remaining = jwtProvider.getRemainingTtlMillis(refreshToken);
			tokenBlacklistService.blacklistToken(refreshToken, remaining);

			return newTokens;
		} catch (BusinessException e) {
			throw e;
		} catch (Exception e) {
			throw new BusinessException(ErrorCode.UNAUTHORIZED, "리프레시 토큰이 유효하지 않습니다.");
		}
	}

	@Override
	public void logout(String accessToken, String refreshToken) {
		if (accessToken != null && !accessToken.isBlank()) {
			String token = accessToken.startsWith("Bearer ") ? accessToken.substring(7) : accessToken;
			long remaining = jwtProvider.getRemainingTtlMillis(token);
			tokenBlacklistService.blacklistToken(token, remaining);
		}
		if (refreshToken != null && !refreshToken.isBlank()) {
			long remaining = jwtProvider.getRemainingTtlMillis(refreshToken);
			tokenBlacklistService.blacklistToken(refreshToken, remaining);
		}
	}

	@Override
	@Transactional
	public void verifyEmail(String token) {
		EmailVerification verification = emailVerificationDao.findByToken(token)
				.orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST, "유효하지 않은 토큰입니다."));

		if (verification.getExpiresAt() == null || verification.getExpiresAt().isBefore(LocalDateTime.now())) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "만료된 인증 링크입니다.");
		}

		if (verification.getVerifiedAt() != null) {
			return;
		}

		emailVerificationDao.updateVerifiedAt(token);
		userDao.updateUserStatus(verification.getUserId(), UserStatus.ACTIVE);
	}

	@Override
	@Transactional
	public void resendVerificationEmail(String email) {
		String userId = email.toLowerCase();

		User user = userDao.findByUserId(userId)
				.orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "가입된 이메일이 없습니다."));

		if (user.getStatus() != UserStatus.PENDING) {
			throw new BusinessException(ErrorCode.CONFLICT, "이미 인증이 완료된 계정입니다.");
		}

		emailVerificationDao.expirePreviousTokens(userId);

		String token = java.util.UUID.randomUUID().toString();
		LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(30);

		EmailVerification verification = EmailVerification.builder()
				.userId(userId).token(token).expiresAt(expiresAt).build();

		emailVerificationDao.insert(verification);

		emailService.sendSignupVerificationEmail(userId, user.getNickname(), token);
	}

	@Override
	public TokenResponse verifyLoginOtp(OtpLoginVerifyRequest request) {
		String userId = extractUserIdFromOtpToken(request.getOtpToken());

		User user = userDao.findByUserIdIncludeDeleted(userId)
				.orElseThrow(() -> new BusinessException(ErrorCode.INVALID_LOGIN));

		if (!Boolean.TRUE.equals(user.getOtpEnabled())) {
			throw new BusinessException(ErrorCode.FORBIDDEN, "OTP가 설정된 계정이 아닙니다.");
		}

		otpService.verifyLoginCode(userId, request.getCode());

		userDao.updateLastLoginDate(userId);

		Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null,
				List.of(new SimpleGrantedAuthority(user.getRole())));

		TokenResponse token = jwtProvider.generateToken(authentication);

		return token;
	}

	private String createOtpToken(String userId) {
		long now = System.currentTimeMillis();
		String value = userId + ":" + now;
		return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
	}

	private String extractUserIdFromOtpToken(String otpToken) {
		try {
			String decoded = new String(Base64.getUrlDecoder().decode(otpToken), StandardCharsets.UTF_8);
			String[] parts = decoded.split(":");
			if (parts.length != 2) {
				throw new IllegalArgumentException();
			}
			long issuedAt = Long.parseLong(parts[1]);
			long now = System.currentTimeMillis();
			if (now - issuedAt > OTP_TOKEN_TTL_MILLIS) {
				throw new BusinessException(ErrorCode.UNAUTHORIZED, "OTP 세션이 만료되었습니다.");
			}
			return parts[0];
		} catch (BusinessException e) {
			throw e;
		} catch (Exception e) {
			throw new BusinessException(ErrorCode.UNAUTHORIZED, "OTP 토큰이 유효하지 않습니다.");
		}
	}

	@Override
	public TokenResponse verifyLoginBackupCode(BackupCodeLoginRequest request) {
		String userId = extractUserIdFromOtpToken(request.getOtpToken());

		User user = userDao.findByUserIdIncludeDeleted(userId)
				.orElseThrow(() -> new BusinessException(ErrorCode.INVALID_LOGIN));

		if (!Boolean.TRUE.equals(user.getOtpEnabled())) {
			throw new BusinessException(ErrorCode.FORBIDDEN, "OTP가 설정된 계정이 아닙니다.");
		}

		backupCodeService.verifyForLogin(userId, request.getCode());

		userDao.updateLastLoginDate(userId);

		Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null,
				List.of(new SimpleGrantedAuthority(user.getRole())));

		return jwtProvider.generateToken(authentication);
	}

	@Override
	public TokenResponse issueToken(String userId) {
		User user = userDao.findByUserId(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

		Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null,
				List.of(new SimpleGrantedAuthority(user.getRole())));

		return jwtProvider.generateToken(authentication);
	}
}
