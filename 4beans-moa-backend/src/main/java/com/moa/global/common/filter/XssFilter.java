package com.moa.global.common.filter;

import java.io.IOException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * XSS (Cross-Site Scripting) 방어 필터.
 * 요청 파라미터와 헤더에서 HTML 태그를 이스케이프하여 XSS 공격을 방어합니다.
 *
 * 처리 대상: getParameter(), getParameterValues(), getHeader()
 * 예시: "<script>alert('xss')</script>" → "&lt;script&gt;alert('xss')&lt;/script&gt;"
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 5)
public class XssFilter extends OncePerRequestFilter {

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String contentType = request.getContentType();
		// multipart 파일 업로드 요청은 XSS 필터 제외
		return contentType != null && contentType.startsWith("multipart/");
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {
		filterChain.doFilter(new XssRequestWrapper(request), response);
	}

}
