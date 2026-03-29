package com.moa.global.auth.service.impl;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.moa.global.auth.service.TokenBlacklistService;

@Service
public class TokenBlacklistServiceImpl implements TokenBlacklistService {

	private static final String TOKEN_PREFIX = "blacklist:token:";
	private static final String BAN_PREFIX = "banned:user:";

	private final StringRedisTemplate redis;

	public TokenBlacklistServiceImpl(StringRedisTemplate redis) {
		this.redis = redis;
	}

	@Override
	public void blacklistToken(String token, long remainingTtlMillis) {
		if (remainingTtlMillis <= 0) return;
		redis.opsForValue().set(
			TOKEN_PREFIX + token,
			"1",
			remainingTtlMillis,
			TimeUnit.MILLISECONDS
		);
	}

	@Override
	public boolean isTokenBlacklisted(String token) {
		return Boolean.TRUE.equals(redis.hasKey(TOKEN_PREFIX + token));
	}

	@Override
	public void banUser(String userId) {
		redis.opsForValue().set(
			BAN_PREFIX + userId,
			String.valueOf(System.currentTimeMillis())
		);
	}

	@Override
	public void unbanUser(String userId) {
		redis.delete(BAN_PREFIX + userId);
	}

	@Override
	public long getBanTimestamp(String userId) {
		String value = redis.opsForValue().get(BAN_PREFIX + userId);
		if (value == null) return -1L;
		try {
			return Long.parseLong(value);
		} catch (NumberFormatException e) {
			return -1L;
		}
	}
}
