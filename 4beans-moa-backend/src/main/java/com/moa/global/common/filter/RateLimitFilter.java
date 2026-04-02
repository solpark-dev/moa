package com.moa.global.common.filter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moa.global.common.exception.ApiResponse;
import com.moa.global.common.exception.ErrorCode;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * IP 기반 Rate Limiting 필터.
 * 엔드포인트별로 차등 제한을 적용하여 브루트포스/DDoS 공격을 방어합니다.
 *
 * - POST /api/auth/login       → 5회/분 (브루트포스 방어)
 * - POST /api/signup/**        → 3회/분 (계정 남용 방어)
 * - POST /api/payment/**       → 10회/분 (결제 어뷰징 방어)
 * - POST /api/chatbot/**       → 20회/분 (AI API 비용 방어)
 * - 기타 전체 API              → 100회/분 (일반 DDoS 방어)
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RateLimitFilter extends OncePerRequestFilter {

	private final ObjectMapper objectMapper;

	/** IP별 버킷 캐시 (엔드포인트 카테고리별로 분리) */
	private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
	private final Map<String, Bucket> signupBuckets = new ConcurrentHashMap<>();
	private final Map<String, Bucket> paymentBuckets = new ConcurrentHashMap<>();
	private final Map<String, Bucket> chatbotBuckets = new ConcurrentHashMap<>();
	private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();

	public RateLimitFilter(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String uri = request.getRequestURI();
		// 정적 리소스, Swagger, Actuator는 Rate Limit 제외
		return uri.startsWith("/swagger-ui/")
				|| uri.startsWith("/v3/api-docs")
				|| uri.equals("/actuator/health")
				|| uri.startsWith("/uploads/")
				|| uri.endsWith(".js") || uri.endsWith(".css")
				|| uri.endsWith(".png") || uri.endsWith(".jpg")
				|| uri.endsWith(".ico");
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		String clientIp = getClientIp(request);
		String uri = request.getRequestURI();
		String method = request.getMethod();

		Bucket bucket = resolveBucket(clientIp, uri, method);

		if (bucket.tryConsume(1)) {
			filterChain.doFilter(request, response);
		} else {
			log.warn("[RATE LIMIT] IP: {} → {} {} — 요청 제한 초과", clientIp, method, uri);
			sendRateLimitResponse(response, uri);
		}
	}

	private Bucket resolveBucket(String clientIp, String uri, String method) {
		// POST 메서드만 엄격 제한, GET은 일반 제한 적용
		if ("POST".equalsIgnoreCase(method)) {
			if (uri.equals("/api/auth/login") || uri.equals("/api/auth/login/otp-verify")
					|| uri.equals("/api/auth/login/backup-verify")) {
				return loginBuckets.computeIfAbsent(clientIp, k -> createBucket(5, Duration.ofMinutes(1)));
			}
			if (uri.startsWith("/api/signup/") || uri.equals("/api/users/join")) {
				return signupBuckets.computeIfAbsent(clientIp, k -> createBucket(3, Duration.ofMinutes(1)));
			}
			if (uri.startsWith("/api/payment/")) {
				return paymentBuckets.computeIfAbsent(clientIp, k -> createBucket(10, Duration.ofMinutes(1)));
			}
			if (uri.startsWith("/api/chatbot/")) {
				return chatbotBuckets.computeIfAbsent(clientIp, k -> createBucket(20, Duration.ofMinutes(1)));
			}
		}

		return generalBuckets.computeIfAbsent(clientIp, k -> createBucket(100, Duration.ofMinutes(1)));
	}

	private Bucket createBucket(int capacity, Duration refillDuration) {
		Bandwidth limit = Bandwidth.builder()
				.capacity(capacity)
				.refillGreedy(capacity, refillDuration)
				.build();
		return Bucket.builder().addLimit(limit).build();
	}

	private void sendRateLimitResponse(HttpServletResponse response, String path) throws IOException {
		ErrorCode errorCode = ErrorCode.RATE_LIMIT_EXCEEDED;

		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");
		response.setStatus(errorCode.getHttpStatus().value());
		response.setHeader("Retry-After", "60");

		ApiResponse<Void> apiResponse = ApiResponse.error(errorCode, errorCode.getMessage());
		response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
	}

	private String getClientIp(HttpServletRequest request) {
		String remoteAddr = request.getRemoteAddr();

		// X-Forwarded-For는 신뢰된 프록시(localhost, Docker 내부망, AWS 내부망)에서 온 경우에만 허용
		if (isTrustedProxy(remoteAddr)) {
			String xff = request.getHeader("X-Forwarded-For");
			if (xff != null && !xff.isEmpty() && !"unknown".equalsIgnoreCase(xff)) {
				return xff.split(",")[0].trim();
			}
			String xri = request.getHeader("X-Real-IP");
			if (xri != null && !xri.isEmpty() && !"unknown".equalsIgnoreCase(xri)) {
				return xri.trim();
			}
		}

		return "0:0:0:0:0:0:0:1".equals(remoteAddr) ? "127.0.0.1" : remoteAddr;
	}

	/** localhost, Docker 브리지(172.16-31.x.x), AWS VPC(10.x.x.x, 192.168.x.x) 대역만 신뢰 */
	private boolean isTrustedProxy(String ip) {
		if (ip == null) return false;
		return ip.equals("127.0.0.1")
				|| ip.equals("0:0:0:0:0:0:0:1")
				|| ip.startsWith("10.")
				|| ip.startsWith("192.168.")
				|| (ip.startsWith("172.") && isDockerRange(ip));
	}

	private boolean isDockerRange(String ip) {
		// 172.16.0.0/12 (172.16.x.x ~ 172.31.x.x) — Docker/AWS 내부망
		try {
			int second = Integer.parseInt(ip.split("\\.")[1]);
			return second >= 16 && second <= 31;
		} catch (Exception e) {
			return false;
		}
	}
}
