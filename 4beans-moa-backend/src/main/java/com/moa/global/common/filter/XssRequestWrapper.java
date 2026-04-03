package com.moa.global.common.filter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

/**
 * XSS 방어용 HttpServletRequest 래퍼.
 * getParameter(), getParameterValues(), getHeader() 에서 HTML 태그를 이스케이프합니다.
 *
 * JSON 바디(getInputStream/getReader)는 처리하지 않습니다.
 * JSON은 백엔드에서 데이터로만 처리되므로 HTML 이스케이프 대상이 아니며,
 * 적용 시 큰따옴표(")가 &quot;로 변환되어 Jackson 파싱 오류가 발생합니다.
 */
public class XssRequestWrapper extends HttpServletRequestWrapper {

	public XssRequestWrapper(HttpServletRequest request) {
		super(request);
	}

	@Override
	public String getParameter(String name) {
		return sanitize(super.getParameter(name));
	}

	@Override
	public String[] getParameterValues(String name) {
		String[] values = super.getParameterValues(name);
		if (values == null) return null;
		String[] sanitized = new String[values.length];
		for (int i = 0; i < values.length; i++) {
			sanitized[i] = sanitize(values[i]);
		}
		return sanitized;
	}

	@Override
	public String getHeader(String name) {
		return sanitize(super.getHeader(name));
	}

	/**
	 * HTML 특수 문자를 이스케이프합니다.
	 * &, <, >, ", ' 를 HTML 엔티티로 변환합니다.
	 */
	public static String sanitize(String value) {
		if (value == null) return null;
		StringBuilder sb = new StringBuilder(value.length());
		for (int i = 0; i < value.length(); i++) {
			char c = value.charAt(i);
			switch (c) {
				case '&':  sb.append("&amp;");  break;
				case '<':  sb.append("&lt;");   break;
				case '>':  sb.append("&gt;");   break;
				case '"':  sb.append("&quot;"); break;
				case '\'': sb.append("&#x27;"); break;
				default:   sb.append(c);
			}
		}
		return sb.toString();
	}
}
