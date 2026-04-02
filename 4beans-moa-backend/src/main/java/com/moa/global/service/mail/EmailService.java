package com.moa.global.service.mail;

public interface EmailService {
	void sendSignupVerificationEmail(String email, String nickname, String token);

	void sendBankVerificationEmail(String email, String bankName, String maskedAccount, String verifyCode);

	void sendResetPasswordOtp(String email, String otp);

	void sendMagicLink(String email, String magicUrl);
}