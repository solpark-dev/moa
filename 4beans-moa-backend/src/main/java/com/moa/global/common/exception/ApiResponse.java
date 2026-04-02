package com.moa.global.common.exception;

/**
 * 통합 API 응답 래퍼.
 * 성공 시 data 필드에 결과를, 실패 시 error 필드에 에러 정보를 담습니다.
 */
public class ApiResponse<T> {

	private final boolean success;
	private final T data;
	private final ApiError error;

	private ApiResponse(boolean success, T data, ApiError error) {
		this.success = success;
		this.data = data;
		this.error = error;
	}

	public static <T> ApiResponse<T> success(T data) {
		return new ApiResponse<>(true, data, null);
	}

	public static <T> ApiResponse<T> error(ErrorCode errorCode, String message) {
		String traceId = org.slf4j.MDC.get("traceId");
		return new ApiResponse<>(false, null, new ApiError(errorCode.getCode(), message, traceId));
	}

	public static <T> ApiResponse<T> error(ErrorCode errorCode, String message, String path) {
		String traceId = org.slf4j.MDC.get("traceId");
		return new ApiResponse<>(false, null, new ApiError(errorCode.getCode(), message, traceId, path));
	}

	public boolean isSuccess() {
		return success;
	}

	public T getData() {
		return data;
	}

	public ApiError getError() {
		return error;
	}
}
