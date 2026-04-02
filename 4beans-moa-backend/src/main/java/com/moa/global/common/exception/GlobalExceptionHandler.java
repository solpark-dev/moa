package com.moa.global.common.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.moa.global.common.alert.WebhookNotificationService;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 글로벌 예외 처리기.
 * 모든 예외를 캐치하여 일관된 ApiResponse 형태로 반환합니다.
 *
 * 에러 응답에는 traceId, timestamp, path가 포함되어
 * 개발자는 로그 추적이 가능하고, 사용자는 문제 신고 시 traceId를 제공할 수 있습니다.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	private final WebhookNotificationService notificationService;

	public GlobalExceptionHandler(WebhookNotificationService notificationService) {
		this.notificationService = notificationService;
	}

	// ── 비즈니스 예외 (예측 가능) ────────────────────────────────────

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<ApiResponse<Void>> handleBusiness(BusinessException e, HttpServletRequest request) {
		log.warn("[BUSINESS EXCEPTION] → {}", e.getMessage());
		ErrorCode code = e.getErrorCode();
		return ResponseEntity.status(code.getHttpStatus())
				.body(ApiResponse.error(code, e.getMessage(), request.getRequestURI()));
	}

	// ── 입력 검증 예외 ────────────────────────────────────────────

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e,
			HttpServletRequest request) {
		String message = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
		log.warn("[VALIDATION ERROR] → {}", message);
		ErrorCode code = ErrorCode.VALIDATION_ERROR;
		return ResponseEntity.status(code.getHttpStatus())
				.body(ApiResponse.error(code, message, request.getRequestURI()));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiResponse<Void>> handleJsonParse(HttpMessageNotReadableException e,
			HttpServletRequest request) {
		log.warn("[JSON PARSE ERROR] → {}", e.getMessage());
		ErrorCode code = ErrorCode.BAD_REQUEST;
		return ResponseEntity.status(code.getHttpStatus())
				.body(ApiResponse.error(code, "요청 JSON 형식이 올바르지 않습니다.", request.getRequestURI()));
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<ApiResponse<Void>> handleMissingParam(MissingServletRequestParameterException e,
			HttpServletRequest request) {
		String message = String.format("필수 파라미터 '%s'이(가) 누락되었습니다.", e.getParameterName());
		log.warn("[MISSING PARAM] → {}", message);
		ErrorCode code = ErrorCode.MISSING_PARAMETER;
		return ResponseEntity.status(code.getHttpStatus())
				.body(ApiResponse.error(code, message, request.getRequestURI()));
	}

	// ── 보안 예외 ─────────────────────────────────────────────────

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException e,
			HttpServletRequest request) {
		String traceId = MDC.get("traceId");
		log.warn("[ACCESS DENIED] TraceId: {} → {} {}", traceId, request.getMethod(), request.getRequestURI());
		ErrorCode code = ErrorCode.FORBIDDEN;
		return ResponseEntity.status(code.getHttpStatus())
				.body(ApiResponse.error(code, "접근 권한이 없습니다.", request.getRequestURI()));
	}

	// ── HTTP 메서드/라우트 예외 ────────────────────────────────────

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException e,
			HttpServletRequest request) {
		String message = String.format("'%s' 메서드는 지원하지 않습니다.", e.getMethod());
		log.warn("[METHOD NOT ALLOWED] → {} {}", e.getMethod(), request.getRequestURI());
		ErrorCode code = ErrorCode.METHOD_NOT_ALLOWED;
		return ResponseEntity.status(code.getHttpStatus())
				.body(ApiResponse.error(code, message, request.getRequestURI()));
	}

	@ExceptionHandler(NoHandlerFoundException.class)
	public ResponseEntity<ApiResponse<Void>> handleNotFound(NoHandlerFoundException e,
			HttpServletRequest request) {
		log.warn("[NOT FOUND] → {} {}", e.getHttpMethod(), e.getRequestURL());
		ErrorCode code = ErrorCode.NOT_FOUND;
		return ResponseEntity.status(code.getHttpStatus())
				.body(ApiResponse.error(code, "요청하신 페이지를 찾을 수 없습니다.", request.getRequestURI()));
	}

	// ── 파일 업로드 예외 ──────────────────────────────────────────

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ApiResponse<Void>> handleMaxUploadSize(MaxUploadSizeExceededException e,
			HttpServletRequest request) {
		log.warn("[FILE SIZE EXCEEDED] → {}", e.getMessage());
		ErrorCode code = ErrorCode.FILE_SIZE_EXCEEDED;
		return ResponseEntity.status(code.getHttpStatus())
				.body(ApiResponse.error(code, "파일 크기가 제한(20MB)을 초과합니다.", request.getRequestURI()));
	}

	// ── 시스템 예외 (예측 불가) ────────────────────────────────────

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Void>> handleException(Exception e, HttpServletRequest request) {
		String traceId = MDC.get("traceId");
		log.error("[SYSTEM ERROR] TraceId: {} → {} {}", traceId, request.getMethod(), request.getRequestURI(), e);

		notificationService.sendErrorAlert(traceId, e);

		ErrorCode code = ErrorCode.INTERNAL_ERROR;
		return ResponseEntity.status(code.getHttpStatus())
				.body(ApiResponse.error(code, "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
						request.getRequestURI()));
	}
}
