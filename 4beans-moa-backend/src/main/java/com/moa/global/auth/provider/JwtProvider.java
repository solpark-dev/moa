package com.moa.global.auth.provider;

import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.moa.user.dto.TokenResponse;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtProvider {

	private static final String AUTHORITIES_KEY = "auth";
	private static final String PROVIDER_KEY = "provider";
	private static final String BEARER_TYPE = "Bearer";

	private final SecretKey secretKey;
	private final SecretKey refreshSecretKey;
	private final long accessTokenExpirationMillis;
	private final long refreshTokenExpirationMillis;

	public JwtProvider(@Value("${jwt.secret}") String secret,
			@Value("${jwt.refresh-secret}") String refreshSecret,
			@Value("${jwt.access-token-expiration-millis}") long accessTokenExpirationMillis,
			@Value("${jwt.refresh-token-expiration-millis}") long refreshTokenExpirationMillis) {
		this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
		this.refreshSecretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(refreshSecret));
		this.accessTokenExpirationMillis = accessTokenExpirationMillis;
		this.refreshTokenExpirationMillis = refreshTokenExpirationMillis;
	}

	public TokenResponse generateToken(Authentication authentication, String provider) {
		String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.collect(Collectors.joining(","));

		long now = (new Date()).getTime();
		Date accessTokenExpiresIn = new Date(now + accessTokenExpirationMillis);
		Date refreshTokenExpiresIn = new Date(now + refreshTokenExpirationMillis);

		Date issuedAt = new Date(now);

		String accessToken = Jwts.builder().setSubject(authentication.getName()).claim(AUTHORITIES_KEY, authorities)
				.claim(PROVIDER_KEY, provider == null || provider.isBlank() ? "email" : provider)
				.setIssuedAt(issuedAt).setExpiration(accessTokenExpiresIn).signWith(secretKey, SignatureAlgorithm.HS256).compact();

		String refreshToken = Jwts.builder().setSubject(authentication.getName()).claim(AUTHORITIES_KEY, authorities)
				.claim(PROVIDER_KEY, provider == null || provider.isBlank() ? "email" : provider)
				.setIssuedAt(issuedAt).setExpiration(refreshTokenExpiresIn).signWith(refreshSecretKey, SignatureAlgorithm.HS256).compact();

		return TokenResponse.builder().grantType(BEARER_TYPE).accessToken(accessToken).refreshToken(refreshToken)
				.accessTokenExpiresIn(accessTokenExpiresIn.getTime()).build();
	}

	public TokenResponse generateToken(Authentication authentication) {
		return generateToken(authentication, "email");
	}

	public TokenResponse refresh(String refreshToken) {
		Claims claims = parseClaims(refreshToken, true);

		String userId = claims.getSubject();
		String authorities = claims.get(AUTHORITIES_KEY, String.class);
		String provider = claims.get(PROVIDER_KEY, String.class);

		if (userId == null || userId.isBlank()) {
			throw new RuntimeException("리프레시 토큰에 사용자 정보가 없습니다.");
		}

		long now = (new Date()).getTime();
		Date issuedAt = new Date(now);
		Date accessTokenExpiresIn = new Date(now + accessTokenExpirationMillis);
		Date newRefreshTokenExpiresIn = new Date(now + refreshTokenExpirationMillis);

		String newAccessToken = Jwts.builder().setSubject(userId).claim(AUTHORITIES_KEY, authorities)
				.claim(PROVIDER_KEY, provider == null || provider.isBlank() ? "email" : provider)
				.setIssuedAt(issuedAt).setExpiration(accessTokenExpiresIn).signWith(secretKey, SignatureAlgorithm.HS256).compact();

		String newRefreshToken = Jwts.builder().setSubject(userId).claim(AUTHORITIES_KEY, authorities)
				.claim(PROVIDER_KEY, provider == null || provider.isBlank() ? "email" : provider)
				.setIssuedAt(issuedAt).setExpiration(newRefreshTokenExpiresIn).signWith(refreshSecretKey, SignatureAlgorithm.HS256).compact();

		return TokenResponse.builder().grantType(BEARER_TYPE).accessToken(newAccessToken).refreshToken(newRefreshToken)
				.accessTokenExpiresIn(accessTokenExpiresIn.getTime()).build();
	}

	public Authentication getAuthentication(String accessToken) {
		Claims claims = parseClaims(accessToken, false);

		if (claims.get(AUTHORITIES_KEY) == null) {
			throw new RuntimeException("Authority information not found in the token.");
		}

		Collection<? extends GrantedAuthority> authorities = Arrays
				.stream(claims.get(AUTHORITIES_KEY).toString().split(",")).map(SimpleGrantedAuthority::new).toList();

		UserDetails principal = new User(claims.getSubject(), "", authorities);
		return new UsernamePasswordAuthenticationToken(principal, accessToken, authorities);
	}

	public boolean validateToken(String token) {
		return validateToken(token, false);
	}

	public boolean validateToken(String token, boolean isRefreshToken) {
		try {
			parseClaims(token, isRefreshToken);
			return true;
		} catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
			log.warn("잘못된 JWT 서명: {}", e.getMessage());
		} catch (ExpiredJwtException e) {
			log.debug("만료된 JWT 토큰");
		} catch (UnsupportedJwtException e) {
			log.warn("지원하지 않는 JWT 토큰: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			log.warn("JWT claims가 비어있음: {}", e.getMessage());
		}
		return false;
	}

	public Claims parseClaims(String token) {
		return parseClaims(token, false);
	}

	public Claims parseClaims(String token, boolean isRefreshToken) {
		try {
			return Jwts.parserBuilder().setSigningKey(isRefreshToken ? refreshSecretKey : secretKey).build()
					.parseClaimsJws(token).getBody();
		} catch (ExpiredJwtException e) {
			return e.getClaims();
		}
	}

	/** 토큰의 남은 유효 시간(밀리초). 이미 만료된 경우 0 반환. */
	public long getRefreshTokenExpirationMillis() {
		return refreshTokenExpirationMillis;
	}

	public long getRemainingTtlMillis(String token) {
		return getRemainingTtlMillis(token, false);
	}

	public long getRemainingTtlMillis(String token, boolean isRefreshToken) {
		try {
			Claims claims = parseClaims(token, isRefreshToken);
			long expMillis = claims.getExpiration().getTime();
			long remaining = expMillis - System.currentTimeMillis();
			return Math.max(remaining, 0L);
		} catch (Exception e) {
			return 0L;
		}
	}

	/** 토큰의 발급 시각(epoch millis). iat 클레임이 없으면 0 반환. */
	public long getIssuedAtMillis(String token) {
		return getIssuedAtMillis(token, false);
	}

	public long getIssuedAtMillis(String token, boolean isRefreshToken) {
		try {
			Claims claims = parseClaims(token, isRefreshToken);
			Date iat = claims.getIssuedAt();
			return iat != null ? iat.getTime() : 0L;
		} catch (Exception e) {
			return 0L;
		}
	}

	public String getProviderFromToken(String token) {
		return getProviderFromToken(token, false);
	}

	public String getProviderFromToken(String token, boolean isRefreshToken) {
		try {
			Claims claims = parseClaims(token, isRefreshToken);
			String provider = claims.get(PROVIDER_KEY, String.class);
			return provider == null || provider.isBlank() ? "email" : provider;
		} catch (Exception e) {
			return "email";
		}
	}
}
