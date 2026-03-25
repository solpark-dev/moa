package com.moa.user.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moa.global.common.exception.ApiResponse;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.user.dto.request.CommonCheckRequest;
import com.moa.user.dto.request.UserCreateRequest;
import com.moa.user.dto.response.CommonCheckResponse;
import com.moa.global.service.passauth.PassAuthService;
import com.moa.user.service.UserService;

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
	public ApiResponse<?> add(@RequestBody @Valid UserCreateRequest request) {

		boolean isSocial = request.getProvider() != null && !request.getProvider().isBlank()
				&& request.getProviderUserId() != null && !request.getProviderUserId().isBlank();

		if (isSocial) {
			return ApiResponse.success(userService.addUserAndLogin(request));
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

	@PostMapping("/find-id")
	public ApiResponse<Map<String, String>> findIdByPhone(@RequestBody Map<String, String> request) {

		String phone = request.get("phone");
		String userId = userService.findUserIdByPhone(phone);

		if (userId == null) {
			throw new BusinessException(ErrorCode.USER_NOT_FOUND, "해당 번호로 가입된 아이디가 존재하지 않습니다.");
		}

		return ApiResponse.success(Map.of("email", userId));
	}

	@GetMapping("/exists-by-phone")
	public ApiResponse<Map<String, Object>> existsByPhone(@RequestParam("phone") String phone) {

		var userOpt = userService.findByPhone(phone);
		if (userOpt.isEmpty()) {
			return ApiResponse.success(Map.of("exists", false));
		}

		var user = userOpt.get();
		return ApiResponse.success(Map.of("exists", true, "userId", user.getUserId()));
	}
}
