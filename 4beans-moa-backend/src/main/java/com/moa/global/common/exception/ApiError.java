package com.moa.global.common.exception;

import java.time.LocalDateTime;

/**
 * API 에러 응답 상세 정보.
 * traceId, timestamp, path를 포함하여 개발자가 로그를 추적할 수 있게 합니다.
 */
public class ApiError {

	private final String code;
	private final String message;
	private final String traceId;
	private final String timestamp;
	private final String path;

	public ApiError(String code, String message, String traceId) {
		this(code, message, traceId, null);
	}

	public ApiError(String code, String message, String traceId, String path) {
		this.code = code;
		this.message = message;
		this.traceId = traceId;
		this.timestamp = LocalDateTime.now().toString();
		this.path = path;
	}

	public String getCode() {
		return code;
	}

	public String getMessage() {
		return message;
	}

	public String getTraceId() {
		return traceId;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public String getPath() {
		return path;
	}
}
