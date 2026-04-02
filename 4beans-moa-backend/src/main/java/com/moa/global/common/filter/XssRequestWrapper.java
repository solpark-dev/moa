package com.moa.global.common.filter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

/**
 * XSS 방어용 HttpServletRequest 래퍼.
 * getParameter(), getParameterValues(), getHeader() 뿐만 아니라
 * getInputStream() / getReader() (JSON body)도 HTML 이스케이프 처리합니다.
 */
public class XssRequestWrapper extends HttpServletRequestWrapper {

	private byte[] cachedBody;

	public XssRequestWrapper(HttpServletRequest request) throws IOException {
		super(request);
		String contentType = request.getContentType();
		boolean isJson = contentType != null && contentType.contains("application/json");
		if (isJson) {
			String body = new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
			this.cachedBody = sanitize(body).getBytes(StandardCharsets.UTF_8);
		}
	}

	@Override
	public ServletInputStream getInputStream() throws IOException {
		if (cachedBody != null) {
			ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(cachedBody);
			return new ServletInputStream() {
				@Override public boolean isFinished() { return byteArrayInputStream.available() == 0; }
				@Override public boolean isReady() { return true; }
				@Override public void setReadListener(ReadListener listener) {}
				@Override public int read() { return byteArrayInputStream.read(); }
			};
		}
		return super.getInputStream();
	}

	@Override
	public BufferedReader getReader() throws IOException {
		if (cachedBody != null) {
			return new BufferedReader(new InputStreamReader(new ByteArrayInputStream(cachedBody), StandardCharsets.UTF_8));
		}
		return super.getReader();
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
