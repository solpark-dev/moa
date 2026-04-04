package com.moa.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ApplicationStartupValidator {

	@Value("${app.security.aes-key}")
	private String aesKey;

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.refresh-secret}")
	private String jwtRefreshSecret;

	@EventListener(ApplicationReadyEvent.class)
	public void validateSecurityConfiguration() {
		if (aesKey == null || aesKey.isBlank()) {
			throw new IllegalStateException("APP_SECURITY_AES_KEY environment variable is required. "
					+ "Please set a 32-character random key for AES-GCM encryption.");
		}
		if (aesKey.length() < 32) {
			throw new IllegalStateException("APP_SECURITY_AES_KEY must be at least 32 characters. "
					+ "Use a cryptographically random value.");
		}
		if (jwtSecret == null || jwtSecret.isBlank() || jwtSecret.length() < 32) {
			throw new IllegalStateException("JWT_SECRET environment variable is required and must be at least 32 characters. "
					+ "Use a cryptographically random value.");
		}
		if (jwtRefreshSecret == null || jwtRefreshSecret.isBlank() || jwtRefreshSecret.length() < 32) {
			throw new IllegalStateException("JWT_REFRESH_SECRET environment variable is required and must be at least 32 characters. "
					+ "Use a cryptographically random value.");
		}

		log.info("Security configuration validated successfully");
	}
}
