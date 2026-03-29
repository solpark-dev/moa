package com.moa.global.auth.service;

public interface TokenBlacklistService {

	/** 로그아웃 토큰 블랙리스트 등록 (남은 만료 시간만큼 Redis에 보관) */
	void blacklistToken(String token, long remainingTtlMillis);

	/** 해당 토큰이 블랙리스트에 있는지 확인 */
	boolean isTokenBlacklisted(String token);

	/** 유저 밴 처리: 현재 시각을 기준으로 이전에 발급된 토큰 전체 무효화 */
	void banUser(String userId);

	/** 밴 해제 */
	void unbanUser(String userId);

	/**
	 * userId 기준 밴 타임스탬프(epoch millis) 조회.
	 * 밴되지 않은 경우 -1 반환.
	 */
	long getBanTimestamp(String userId);
}
