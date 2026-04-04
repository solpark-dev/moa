package com.moa.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ApplicationStartupValidator {

	@Value("${app.security.aes-key:}")
	private String aesKey;

	@Value("${jwt.secret:}")
	private String jwtSecret;

	@Value("${jwt.refresh-secret:}")
	private String jwtRefreshSecret;

	@EventListener(ApplicationReadyEvent.class)
	public void validateSecurityConfiguration() {
		String secretGuide = "\n[설정 오류] 외부 설정 파일(application-secret.properties) 또는 환경 변수를 확인하세요.\n"
				+ "현재 참조 경로(SECRET_PROPS_PATH): " + System.getenv("SECRET_PROPS_PATH") + "\n";

		if (aesKey == null || aesKey.isBlank()) {
			throw new IllegalStateException(secretGuide + "APP_SECURITY_AES_KEY (또는 app.security.aes-key)가 누락되었습니다. 32자 랜덤 키가 필요합니다.");
		}
		if (aesKey.length() < 32) {
			throw new IllegalStateException(secretGuide + "APP_SECURITY_AES_KEY는 최소 32자 이상이어야 합니다.");
		}
		if (jwtSecret == null || jwtSecret.isBlank() || jwtSecret.length() < 32) {
			throw new IllegalStateException(secretGuide + "JWT_SECRET (또는 jwt.secret)이 누락되었거나 32자보다 짧습니다.");
		}
		if (jwtRefreshSecret == null || jwtRefreshSecret.isBlank() || jwtRefreshSecret.length() < 32) {
			throw new IllegalStateException(secretGuide + "JWT_REFRESH_SECRET (또는 jwt.refresh-secret)이 누락되었거나 32자보다 짧습니다.");
		}

		log.info("Security configuration validated successfully");
	}
}
