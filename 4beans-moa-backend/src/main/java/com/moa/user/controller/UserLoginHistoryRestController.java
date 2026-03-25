package com.moa.user.controller;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moa.global.common.exception.ApiResponse;
import com.moa.user.dto.TokenResponse;
import com.moa.community.dto.response.PageResponse;
import com.moa.user.dto.response.LoginHistoryResponse;
import com.moa.user.service.LoginHistoryService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/login-history")
@RequiredArgsConstructor
public class UserLoginHistoryRestController {

	private final LoginHistoryService loginHistoryService;

	@GetMapping("/me")
	public ApiResponse<PageResponse<LoginHistoryResponse>> getMyLoginHistory(
			@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "size", defaultValue = "20") int size) {
		return ApiResponse.success(loginHistoryService.getMyLoginHistory(page, size));
	}

}
