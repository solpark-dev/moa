package com.moa.user.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moa.global.common.exception.ApiResponse;
import com.moa.user.dto.request.CommonCheckRequest;
import com.moa.user.dto.request.UserCreateRequest;
import com.moa.user.dto.response.CommonCheckResponse;
import com.moa.global.service.passauth.PassAuthService;
import com.moa.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/signup")
@RequiredArgsConstructor
public class SignupRestController {

	private final UserService userService;
	private final PassAuthService passAuthService;

	@PostMapping("/check")
	public ApiResponse<CommonCheckResponse> check(@RequestBody CommonCheckRequest request) {
		return ApiResponse.success(userService.check(request));
	}


	@PostMapping("/add")
	public ApiResponse<?> add(@RequestBody @Valid UserCreateRequest request,
			HttpServletRequest req, HttpServletResponse response) {

		boolean isSocial = request.getProvider() != null && !request.getProvider().isBlank()
				&& request.getProviderUserId() != null && !request.getProviderUserId().isBlank();

		if (isSocial) {
			Map<String, Object> result = userService.addUserAndLogin(request);

			boolean isHttps = req.isSecure() || "https".equalsIgnoreCase(req.getHeader("X-Forwarded-Proto"));
			String origin = req.getHeader("Origin");
			if (origin != null && origin.startsWith("http://")) isHttps = false;

			long accessMaxAge = Math.max(0,
					((Long) result.get("accessTokenExpiresIn") - System.currentTimeMillis()) / 1000);

			ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", (String) result.get("accessToken"))
					.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax")
					.path("/").maxAge(accessMaxAge).build();

			ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", (String) result.get("refreshToken"))
					.httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax")
					.path("/").maxAge(60 * 60 * 24 * 14).build();

			response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
			response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

			return ApiResponse.success(Map.of("signupType", "SOCIAL", "user", result.get("user")));
		}

		return ApiResponse.success(Map.of("signupType", "NORMAL", "user", userService.addUser(request)));
	}


	@GetMapping("/pass/start")
	public ApiResponse<Map<String, Object>> startPassAuth() {
		return ApiResponse.success(passAuthService.requestCertification());
	}

	@PostMapping("/pass/verify")
	public ApiResponse<Map<String, Object>> verifyPassAuth(@RequestBody Map<String, Object> body) throws Exception {

		String impUid = (String) body.get("imp_uid");
		return ApiResponse.success(passAuthService.verifyCertification(impUid));
	}

	@GetMapping("/exists-by-phone")
	public ApiResponse<Map<String, Object>> existsByPhone(@RequestParam("phone") String phone) {

		var userOpt = userService.findByPhone(phone);
		if (userOpt.isEmpty()) {
			return ApiResponse.success(Map.of("exists", false));
		}

		// userId는 응답에 포함하지 않음 — 계정 열거 공격 방지
		return ApiResponse.success(Map.of("exists", true));
	}
}
