package com.moa.user.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moa.global.common.exception.ApiResponse;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.user.dto.BackupCodeIssueResponse;
import com.moa.user.dto.BackupCodeLoginRequest;
import com.moa.user.dto.OtpLoginVerifyRequest;
import com.moa.user.dto.OtpSetupResponse;
import com.moa.user.dto.OtpVerifyRequest;
import com.moa.user.dto.TokenResponse;
import com.moa.user.dto.UnlockAccountRequest;
import com.moa.user.dto.request.LoginRequest;
import com.moa.user.dto.response.LoginResponse;
import com.moa.user.dto.request.ResetPasswordVerifyRequest;
import com.moa.user.dto.request.PasswordResetRequest;
import com.moa.user.service.AuthService;
import com.moa.user.service.BackupCodeService;
import com.moa.user.service.LoginHistoryService;
import com.moa.user.service.OtpService;
import com.moa.user.service.ResetPasswordService;
import com.moa.user.service.MagicLinkService;
import com.moa.global.service.passauth.PassAuthService;
import com.moa.user.repository.UserDao;
import com.moa.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthRestController {

	@Value("${app.frontend-url}")
	private String frontendUrl;
	private final AuthService authService;
	private final OtpService otpService;
	private final PassAuthService passAuthService;
	private final UserService userService;
	private final UserDao userDao;
	private final LoginHistoryService loginHistoryService;
	private final BackupCodeService backupCodeService;
	private final ResetPasswordService resetPasswordService;
	private final MagicLinkService magicLinkService;

	@PostMapping("/login")
	public ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest request, HttpServletRequest httpRequest,
			HttpServletResponse httpResponse) {

		String clientIp = extractClientIp(httpRequest);
		String userAgent = httpRequest.getHeader("User-Agent");
		String loginType = "PASSWORD";

		try {
			LoginResponse response = authService.login(request);

			String userId = extractUserIdFromLoginRequest(request);
			if (userId == null || userId.isBlank()) {
				userId = response.getUserId();
			}

			if (!response.isOtpRequired()) {
				loginHistoryService.recordSuccess(userId, "PASSWORD", clientIp, userAgent);
			}

			if (!response.isOtpRequired()) {
				boolean isHttps = "https".equalsIgnoreCase(httpRequest.getHeader("X-Forwarded-Proto")) || httpRequest.isSecure();
				String origin = httpRequest.getHeader("Origin");
				if (origin != null && origin.startsWith("http://")) isHttps = false;

				long accessMaxAge = Math.max(0, (response.getAccessTokenExpiresIn() - System.currentTimeMillis()) / 1000);
				ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", response.getAccessToken())
						.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/")
						.maxAge(accessMaxAge).build();

				ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", response.getRefreshToken())
						.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/").maxAge(60 * 60 * 24 * 14).build();

				httpResponse.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
				httpResponse.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
			}

			return ApiResponse.success(response);

		} catch (BusinessException e) {
			throw e;
		}
	}

	@PostMapping("/login/otp-verify")
	public ApiResponse<TokenResponse> verifyLoginOtp(@RequestBody @Valid OtpLoginVerifyRequest request,
			HttpServletRequest httpRequest, HttpServletResponse httpResponse) {

		String clientIp = extractClientIp(httpRequest);
		String userAgent = httpRequest.getHeader("User-Agent");
		String loginType = "OTP";
		String userId = request.getUserId();
		if (userId == null || userId.isBlank()) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "userId가 필요합니다.");
		}

		TokenResponse tokenResponse = authService.verifyLoginOtp(request);
		loginHistoryService.recordSuccess(userId, loginType, clientIp, userAgent);

		boolean isHttps = "https".equalsIgnoreCase(httpRequest.getHeader("X-Forwarded-Proto")) || httpRequest.isSecure();
		String origin = httpRequest.getHeader("Origin");
		if (origin != null && origin.startsWith("http://")) isHttps = false;

		long accessMaxAge = Math.max(0, (tokenResponse.getAccessTokenExpiresIn() - System.currentTimeMillis()) / 1000);
		ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", tokenResponse.getAccessToken())
				.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/")
				.maxAge(accessMaxAge).build();

		ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", tokenResponse.getRefreshToken())
				.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/").maxAge(60 * 60 * 24 * 14).build();

		httpResponse.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
		httpResponse.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

		return ApiResponse.success(tokenResponse);
	}

	@PostMapping("/refresh")
	public ApiResponse<TokenResponse> refresh(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
		String refreshToken = null;
		if (httpRequest.getCookies() != null) {
			for (var cookie : httpRequest.getCookies()) {
				if ("REFRESH_TOKEN".equals(cookie.getName())) {
					refreshToken = cookie.getValue();
					break;
				}
			}
		}
		if (refreshToken == null || refreshToken.isBlank()) {
			throw new BusinessException(ErrorCode.UNAUTHORIZED, "Refresh token이 없습니다.");
		}

		TokenResponse tokenResponse = authService.refresh(refreshToken);

		boolean isHttps = "https".equalsIgnoreCase(httpRequest.getHeader("X-Forwarded-Proto")) || httpRequest.isSecure();
		String origin = httpRequest.getHeader("Origin");
		if (origin != null && origin.startsWith("http://")) isHttps = false;

		long accessMaxAge = Math.max(0, (tokenResponse.getAccessTokenExpiresIn() - System.currentTimeMillis()) / 1000);
		ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", tokenResponse.getAccessToken())
				.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax")
				.path("/").maxAge(accessMaxAge).build();
		ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", tokenResponse.getRefreshToken())
				.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax")
				.path("/").maxAge(60 * 60 * 24 * 14).build();

		httpResponse.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
		httpResponse.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

		return ApiResponse.success(tokenResponse);
	}

	@PostMapping("/logout")
	public ApiResponse<Void> logout(@RequestHeader(value = "Authorization", required = false) String accessToken,
			@RequestHeader(value = "Refresh-Token", required = false) String refreshToken, HttpServletRequest request,
			HttpServletResponse response) {
		authService.logout(accessToken, refreshToken);

		boolean isHttps = "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto")) || request.isSecure();
		String origin = request.getHeader("Origin");
		if (origin != null && origin.startsWith("http://")) isHttps = false;

		ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", "").httpOnly(true).secure(isHttps)
				.sameSite(isHttps ? "None" : "Lax").path("/").maxAge(0).build();

		ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", "").httpOnly(true).secure(isHttps)
				.sameSite(isHttps ? "None" : "Lax").path("/").maxAge(0).build();

		response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
		response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

		return ApiResponse.success(null);
	}

	@PostMapping("/resend-verification")
	public ApiResponse<Void> resendVerificationEmail(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		if (email == null || email.isBlank()) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "이메일을 입력해 주세요.");
		}
		authService.resendVerificationEmail(email);
		return ApiResponse.success(null);
	}

	@PostMapping("/verify-email")
	public ApiResponse<Void> verifyEmail(@RequestParam("token") String token) {
		authService.verifyEmail(token);
		return ApiResponse.success(null);
	}

	@GetMapping("/verify-email")
	public ResponseEntity<Void> verifyEmailByLink(@RequestParam("token") String token) {
		try {
			authService.verifyEmail(token);
			String location = frontendUrl + "/email-verified?result=success";
			return ResponseEntity.status(HttpStatus.FOUND).header(HttpHeaders.LOCATION, location).build();
		} catch (Exception e) {
			String msg = URLEncoder.encode("인증에 실패했습니다.", StandardCharsets.UTF_8);
			String location = frontendUrl + "/email-verified?result=fail&message=" + msg;
			return ResponseEntity.status(HttpStatus.FOUND).header(HttpHeaders.LOCATION, location).build();
		}
	}

	@PostMapping("/otp/setup")
	public ApiResponse<OtpSetupResponse> setupOtp() {
		return ApiResponse.success(otpService.setup());
	}

	@PostMapping("/otp/verify")
	public ApiResponse<Void> verifyOtp(@RequestBody @Valid OtpVerifyRequest request) {
		otpService.verify(request);
		return ApiResponse.success(null);
	}

	@PostMapping("/otp/backup/issue")
	public ApiResponse<BackupCodeIssueResponse> issueBackupCodes() {
		List<String> codes = backupCodeService.issueForCurrentUser();
		BackupCodeIssueResponse response = BackupCodeIssueResponse.builder().codes(codes).issued(true).build();
		return ApiResponse.success(response);
	}

	@PostMapping("/login/backup-verify")
	public ApiResponse<TokenResponse> verifyLoginBackup(@RequestBody @Valid BackupCodeLoginRequest request,
			HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
		String clientIp = extractClientIp(httpRequest);
		String userAgent = httpRequest.getHeader("User-Agent");
		String loginType = "OTP_BACKUP";

		TokenResponse tokenResponse = authService.verifyLoginBackupCode(request);

		String userId = request.getUserId();
		if (userId == null || userId.isBlank()) {
			userId = SecurityContextHolder.getContext().getAuthentication() != null
					? SecurityContextHolder.getContext().getAuthentication().getName()
					: null;
		}

		if (userId != null && !userId.isBlank()) {
			loginHistoryService.recordSuccess(userId, loginType, clientIp, userAgent);
		}

		boolean isHttps = "https".equalsIgnoreCase(httpRequest.getHeader("X-Forwarded-Proto")) || httpRequest.isSecure();
		String origin = httpRequest.getHeader("Origin");
		if (origin != null && origin.startsWith("http://")) isHttps = false;

		long accessMaxAge = Math.max(0, (tokenResponse.getAccessTokenExpiresIn() - System.currentTimeMillis()) / 1000);
		ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", tokenResponse.getAccessToken())
				.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/")
				.maxAge(accessMaxAge).build();

		ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", tokenResponse.getRefreshToken())
				.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/").maxAge(60 * 60 * 24 * 14).build();

		httpResponse.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
		httpResponse.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

		return ApiResponse.success(tokenResponse);
	}

	@GetMapping("/otp/backup/list")
	public ApiResponse<BackupCodeIssueResponse> getBackupCodeList() {
		boolean issued = backupCodeService.hasBackupCodesForCurrentUser();
		BackupCodeIssueResponse response = BackupCodeIssueResponse.builder().codes(List.of()).issued(issued).build();
		return ApiResponse.success(response);
	}

	@PostMapping("/otp/disable")
	public ApiResponse<Void> disableOtp() {
		otpService.disable();
		return ApiResponse.success(null);
	}

	@PostMapping("/otp/disable-verify")
	public ApiResponse<?> disableVerify(@RequestBody OtpVerifyRequest request) {
		String userId = SecurityContextHolder.getContext().getAuthentication().getName();

		otpService.disableWithCode(userId, request.getCode());
		return ApiResponse.success(null);
	}

	@PostMapping("/unlock")
	public ApiResponse<Void> unlockAccount(@RequestBody @Valid UnlockAccountRequest request) {
		Map<String, Object> data;
		try {
			data = passAuthService.verifyCertification(request.getImpUid());
		} catch (Exception e) {
			throw new BusinessException(ErrorCode.INTERNAL_ERROR, "본인인증 처리 중 오류가 발생했습니다.");
		}

		Object phoneObj = data.get("phone");
		String phone = phoneObj != null ? phoneObj.toString() : null;
		Object ciObj = data.get("ci");
		String ci = ciObj != null ? ciObj.toString() : null;

		if (phone == null || phone.isBlank()) {
			throw new BusinessException(ErrorCode.INTERNAL_ERROR, "본인인증 결과에 휴대폰 번호가 없습니다.");
		}

		userService.unlockByCertification(request.getUserId(), phone, ci);

		return ApiResponse.success(null);
	}

	// ── 비밀번호 재설정 (Email OTP) ──────────────────────────────────────────

	@PostMapping("/reset-password/send")
	public ApiResponse<Void> sendResetPasswordOtp(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		if (email == null || email.isBlank()) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "이메일을 입력해주세요.");
		}
		resetPasswordService.sendOtp(email.toLowerCase());
		return ApiResponse.success(null);
	}

	@PostMapping("/reset-password/verify")
	public ApiResponse<Map<String, String>> verifyResetPasswordOtp(
			@RequestBody @Valid ResetPasswordVerifyRequest request) {
		String resetToken = resetPasswordService.verifyOtp(request.getEmail(), request.getCode());
		return ApiResponse.success(Map.of("resetToken", resetToken));
	}

	@PostMapping("/reset-password/confirm")
	public ApiResponse<Void> confirmResetPassword(@RequestBody PasswordResetRequest request) {
		if (request.getToken() == null || request.getToken().isBlank()) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "재설정 토큰이 없습니다.");
		}
		resetPasswordService.confirmReset(request.getToken(), request.getPassword(), request.getPasswordConfirm());
		return ApiResponse.success(null);
	}

	// ── Magic Link 로그인 ─────────────────────────────────────────────────────

	@PostMapping("/magic-link/send")
	public ApiResponse<Void> sendMagicLink(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		if (email == null || email.isBlank()) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "이메일을 입력해주세요.");
		}
		magicLinkService.sendMagicLink(email.toLowerCase());
		return ApiResponse.success(null);
	}

	@PostMapping("/magic-link/verify")
	public ApiResponse<TokenResponse> verifyMagicLink(@RequestBody Map<String, String> body,
			HttpServletResponse httpResponse, HttpServletRequest httpRequest) {
		String token = body.get("token");
		if (token == null || token.isBlank()) {
			throw new BusinessException(ErrorCode.BAD_REQUEST, "토큰이 없습니다.");
		}
		TokenResponse tokenResponse = magicLinkService.verifyMagicLink(token);

		boolean isHttps = "https".equalsIgnoreCase(httpRequest.getHeader("X-Forwarded-Proto"))
				|| httpRequest.isSecure();
		String origin = httpRequest.getHeader("Origin");
		if (origin != null && origin.startsWith("http://")) isHttps = false;

		long accessMaxAge = Math.max(0, (tokenResponse.getAccessTokenExpiresIn() - System.currentTimeMillis()) / 1000);
		ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", tokenResponse.getAccessToken())
				.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax")
				.path("/").maxAge(accessMaxAge).build();

		ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", tokenResponse.getRefreshToken())
				.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax")
				.path("/").maxAge(60 * 60 * 24 * 14).build();

		httpResponse.addHeader("Set-Cookie", accessCookie.toString());
		httpResponse.addHeader("Set-Cookie", refreshCookie.toString());

		return ApiResponse.success(tokenResponse);
	}

	@PostMapping("/exists-by-email")
	public ApiResponse<Void> existsByEmail(@RequestBody Map<String, String> body) {

		String email = body.get("email");

		if (email == null || email.isBlank()) {
			throw new BusinessException(ErrorCode.INVALID_REQUEST, "이메일을 입력해주세요.");
		}

		if (userDao.existsByUserId(email.toLowerCase()) == 0) {
			throw new BusinessException(ErrorCode.USER_NOT_FOUND, "등록된 계정이 없습니다.");
		}

		return ApiResponse.success(null);
	}

	private String extractClientIp(HttpServletRequest request) {
		String remoteAddr = request.getRemoteAddr();

		if (isTrustedProxy(remoteAddr)) {
			String xff = request.getHeader("X-Forwarded-For");
			if (xff != null && !xff.isBlank() && !"unknown".equalsIgnoreCase(xff)) {
				return xff.split(",")[0].trim();
			}
			String xri = request.getHeader("X-Real-IP");
			if (xri != null && !xri.isBlank() && !"unknown".equalsIgnoreCase(xri)) {
				return xri.trim();
			}
		}

		return "0:0:0:0:0:0:0:1".equals(remoteAddr) ? "127.0.0.1" : remoteAddr;
	}

	private boolean isTrustedProxy(String ip) {
		if (ip == null) return false;
		return ip.equals("127.0.0.1")
				|| ip.equals("0:0:0:0:0:0:0:1")
				|| ip.startsWith("10.")
				|| ip.startsWith("192.168.")
				|| (ip.startsWith("172.") && isDockerRange(ip));
	}

	private boolean isDockerRange(String ip) {
		try {
			int second = Integer.parseInt(ip.split("\\.")[1]);
			return second >= 16 && second <= 31;
		} catch (Exception e) {
			return false;
		}
	}

	private String extractUserIdFromLoginRequest(LoginRequest request) {
		try {
			return request.getUserId();
		} catch (Exception e) {
			return null;
		}
	}

	@PostMapping("/restore")
	public ApiResponse<Map<String, Object>> restore(@RequestBody @Valid com.moa.user.dto.RestoreAccountRequest request,
			HttpServletRequest httpRequest, HttpServletResponse httpResponse) {

		Map<String, Object> data;
		try {
			data = passAuthService.verifyCertification(request.getImpUid());
		} catch (Exception e) {
			throw new BusinessException(ErrorCode.INTERNAL_ERROR, "본인인증 처리 중 오류가 발생했습니다.");
		}

		Object phoneObj = data.get("phone");
		String phone = phoneObj != null ? phoneObj.toString() : null;
		Object ciObj = data.get("ci");
		String ci = ciObj != null ? ciObj.toString() : null;

		if (phone == null || phone.isBlank()) {
			throw new BusinessException(ErrorCode.INTERNAL_ERROR, "본인인증 결과에 휴대폰 번호가 없습니다.");
		}

		String userId = request.getUserId().toLowerCase();

		userService.restoreByCertification(userId, phone, ci);

		TokenResponse token = authService.issueToken(userId);

		boolean isHttps = "https".equalsIgnoreCase(httpRequest.getHeader("X-Forwarded-Proto"))
				|| httpRequest.isSecure();
		String origin = httpRequest.getHeader("Origin");
		if (origin != null && origin.startsWith("http://")) isHttps = false;

		long accessMaxAge = Math.max(0, (token.getAccessTokenExpiresIn() - System.currentTimeMillis()) / 1000);
		ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", token.getAccessToken()).httpOnly(true)
				.secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/").maxAge(accessMaxAge)
				.build();

		ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", token.getRefreshToken()).httpOnly(true)
				.secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/").maxAge(60 * 60 * 24 * 14).build();

		httpResponse.addHeader("Set-Cookie", accessCookie.toString());
		httpResponse.addHeader("Set-Cookie", refreshCookie.toString());

		String clientIp = extractClientIp(httpRequest);
		String userAgent = httpRequest.getHeader("User-Agent");
		loginHistoryService.recordSuccess(userId, "RESTORE", clientIp, userAgent);

		return ApiResponse.success(Map.of("restored", true, "userId", userId));
	}

}
