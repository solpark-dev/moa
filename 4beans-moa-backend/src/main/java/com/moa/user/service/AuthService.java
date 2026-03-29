package com.moa.user.service;

import com.moa.user.dto.BackupCodeLoginRequest;
import com.moa.user.dto.OtpLoginVerifyRequest;
import com.moa.user.dto.TokenResponse;
import com.moa.user.dto.request.LoginRequest;
import com.moa.user.dto.response.LoginResponse;

public interface AuthService {

	LoginResponse login(LoginRequest request);

	TokenResponse refresh(String refreshToken);

	void logout(String accessToken, String refreshToken);

	void verifyEmail(String token);

	void resendVerificationEmail(String email);

	TokenResponse verifyLoginOtp(OtpLoginVerifyRequest request);

	TokenResponse verifyLoginBackupCode(BackupCodeLoginRequest request);
	
	TokenResponse issueToken(String userId);
}
