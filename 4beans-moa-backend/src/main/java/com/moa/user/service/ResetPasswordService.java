package com.moa.user.service;

public interface ResetPasswordService {

    /**
     * 이메일로 6자리 OTP 발송. 이메일이 존재하지 않아도 동일한 성공 응답 반환 (이메일 열거 공격 방지)
     */
    void sendOtp(String email);

    /**
     * OTP 검증 후 1회성 재설정 토큰 반환
     */
    String verifyOtp(String email, String code);

    /**
     * 재설정 토큰으로 새 비밀번호 저장 후 토큰 즉시 소멸
     */
    void confirmReset(String resetToken, String newPassword, String newPasswordConfirm);
}
