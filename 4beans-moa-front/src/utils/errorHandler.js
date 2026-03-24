// Complete error code mapping with user-friendly Korean messages
const ERROR_MESSAGES = {
  // Payment Errors
  PAY404: "결제 정보를 찾을 수 없습니다",
  PAY409: "이미 해당 월에 결제한 내역이 있습니다",
  PAY500: "결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요",
  PAY501: "결제 재시도에 실패했습니다",
  PAY502: "최대 재시도 횟수를 초과했습니다. 고객센터에 문의해주세요",
  PAY503: "재시도 정보를 찾을 수 없습니다",
  PAY400: "결제 금액이 올바르지 않습니다",
  BILLING_KEY_NOT_FOUND:
    "등록된 결제 수단을 찾을 수 없습니다. 카드를 다시 등록해주세요",

  // Deposit Errors
  DEP404: "보증금 정보를 찾을 수 없습니다",
  DEP409: "이미 결제된 보증금입니다",
  DEP410: "이미 환불된 보증금입니다",
  DEP400: "보증금 금액이 일치하지 않습니다",

  // Party Errors
  P404: "파티를 찾을 수 없습니다",
  P409: "파티 인원이 가득 찼습니다",
  ALREADY_JOINED: "이미 참여 중인 파티입니다",
  P403: "권한이 없습니다",
  LEADER_CANNOT_JOIN: "파티장은 자신의 파티에 참여할 수 없습니다",
  LEADER_CANNOT_LEAVE:
    "파티장은 탈퇴할 수 없습니다. 파티를 삭제하거나 리더를 변경해주세요",
  NOT_PARTY_LEADER: "파티장만 실행할 수 있습니다",
  NOT_PARTY_MEMBER: "파티 참여자가 아닙니다",
  P400: "잘못된 파티 상태입니다",
  PARTY_NOT_RECRUITING: "현재 모집 중인 파티가 아닙니다",
  PARTY_MEMBER_NOT_FOUND: "파티 구성원을 찾을 수 없습니다",
  INVALID_PARTY_STATUS: "잘못된 파티 상태입니다",
  INVALID_MAX_MEMBERS: "파티 최대 인원이 잘못되었습니다",
  PARTY_FULL: "파티 인원이 가득 찼습니다",
  PARTY_ALREADY_MATCHED: "이미 매칭된 파티입니다",

  // Settlement Errors
  ST404: "정산 정보를 찾을 수 없습니다",
  ST409: "이미 정산된 내역입니다",
  ST500: "정산 처리 중 오류가 발생했습니다",
  SETTLEMENT_ALREADY_COMPLETED: "이미 완료된 정산입니다",
  SETTLEMENT_FAILED: "정산 처리 중 오류가 발생했습니다",
  DUPLICATE_SETTLEMENT: "이미 정산된 내역입니다",

  // Account Errors
  ACC404: "계좌 정보를 찾을 수 없습니다",
  ACC400: "인증되지 않은 계좌입니다. 계좌 인증을 완료해주세요",
  ACCOUNT_NOT_FOUND: "계좌 정보를 찾을 수 없습니다",
  ACCOUNT_NOT_VERIFIED: "인증되지 않은 계좌입니다",

  // User Errors
  U404: "사용자를 찾을 수 없습니다",
  U401: "아이디 또는 비밀번호가 올바르지 않습니다",
  U410: "탈퇴한 계정입니다",
  E401: "로그인이 필요합니다",
  UNAUTHORIZED: "로그인이 필요합니다",
  DUPLICATED_PHONE: "이미 사용중인 휴대폰번호입니다",
  ACCOUNT_WITHDRAW: "탈퇴한 계정입니다",
  INVALID_LOGIN: "아이디 또는 비밀번호가 올바르지 않습니다",

  // Product Errors
  PR404: "상품을 찾을 수 없습니다",
  PRODUCT_NOT_FOUND: "상품을 찾을 수 없습니다",
  PRODUCT_ID_REQUIRED: "상품 ID는 필수입니다",

  // Subscription Errors
  SB404: "구독 정보를 찾을 수 없습니다",
  SUBSCRIPTION_NOT_FOUND: "구독 정보를 찾을 수 없습니다",
  SUBSCRIPTION_ID_REQUIRED: "구독 ID는 필수입니다",

  // Validation Errors
  V001: "상품 ID는 필수입니다",
  V002: "구독 ID는 필수입니다",
  V004: "파티 시작일은 필수입니다",
  V006: "OTT 계정 ID는 필수입니다",
  V007: "OTT 계정 비밀번호는 필수입니다",
  START_DATE_REQUIRED: "파티 시작일은 필수입니다",
  OTT_ID_REQUIRED: "OTT 계정 ID는 필수입니다",
  OTT_PASSWORD_REQUIRED: "OTT 계정 비밀번호는 필수입니다",

  // Generic Errors
  E400: "잘못된 요청입니다",
  E403: "접근 권한이 없습니다",
  E404: "요청한 정보를 찾을 수 없습니다",
  E422: "입력 정보를 확인해주세요",
  E409: "요청 충돌이 발생했습니다",
  E999: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요",
  BAD_REQUEST: "잘못된 요청입니다",
  FORBIDDEN: "접근 권한이 없습니다",
  NOT_FOUND: "요청한 정보를 찾을 수 없습니다",
  VALIDATION_ERROR: "입력 정보를 확인해주세요",
  CONFLICT: "요청 충돌이 발생했습니다",
  INTERNAL_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요",
  INVALID_INPUT_VALUE: "잘못된 입력값입니다",
  BUSINESS_ERROR: "처리 중 오류가 발생했습니다",
  FEATURE_NOT_AVAILABLE: "현재 버전에서는 지원하지 않는 기능입니다",
  E450: "이미 발급된 백업 코드가 있습니다. 기존 코드를 확인해주세요",
};

// Error severity levels
const ERROR_SEVERITY = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
};

// Get severity based on error code or status
const getErrorSeverity = (errorCode, statusCode) => {
  // Critical errors (5xx server errors)
  if (
    statusCode >= 500 ||
    errorCode?.includes("500") ||
    errorCode?.includes("999")
  ) {
    return ERROR_SEVERITY.CRITICAL;
  }

  // Warning errors (4xx client errors, conflicts)
  if (statusCode >= 400 && statusCode < 500) {
    return ERROR_SEVERITY.WARNING;
  }

  if (errorCode?.includes("409") || errorCode?.includes("400")) {
    return ERROR_SEVERITY.WARNING;
  }

  return ERROR_SEVERITY.ERROR;
};

/**
 * Main error handler - Extracts user-friendly error messages from API responses
 * @param {Error} error - The error object from axios/fetch
 * @param {Object} options - Configuration options
 * @returns {Object} Formatted error object with user-friendly message
 */
export const handleApiError = (error, options = {}) => {
  const { logToConsole = true, customMessage = null } = options;

  const data = error.response?.data || {};
  const apiError = data.error || {};

  const errorCode = apiError.code || data.code || error.code || "UNKNOWN_ERROR";

  const errorMessage =
    apiError.message || data.message || error.message || null;

  const statusCode = error.response?.status;

  // Get user-friendly message
  const userMessage =
    customMessage ||
    ERROR_MESSAGES[errorCode] ||
    errorMessage ||
    "오류가 발생했습니다";

  // Get severity
  const severity = getErrorSeverity(errorCode, statusCode);

  // Log to console in development
  if (logToConsole && import.meta.env.DEV) {
    console.error("API Error:", {
      errorCode,
      statusCode,
      message: errorMessage,
      userMessage,
      severity,
      fullError: error,
    });
  }

  // Prepare error object for UI
  const errorObj = {
    code: errorCode,
    message: userMessage,
    severity,
    statusCode,
    canRetry:
      statusCode >= 500 ||
      errorCode?.includes("500") ||
      errorCode?.includes("NETWORK"),
    needsSupport:
      errorCode === "PAY502" || severity === ERROR_SEVERITY.CRITICAL,
  };

  return errorObj;
};

/**
 * Payment-specific error handler with additional context
 */
export const handlePaymentError = (error) => {
  const errorObj = handleApiError(error);

  // Add payment-specific guidance
  if (errorObj.code === "PAY502") {
    errorObj.action = "고객센터에 문의해주세요";
    errorObj.actionUrl = "/support";
  } else if (
    errorObj.code === "PAY404" ||
    errorObj.code === "BILLING_KEY_NOT_FOUND"
  ) {
    errorObj.action = "결제 수단을 다시 등록해주세요";
    errorObj.actionUrl = "/user/wallet";
  } else if (errorObj.code === "PAY500") {
    errorObj.action = "다시 시도";
    errorObj.canRetry = true;
  }

  return errorObj;
};

/**
 * Party-specific error handler with additional context
 */
export const handlePartyError = (error) => {
  const errorObj = handleApiError(error);

  // Add party-specific guidance
  if (
    errorObj.code === "P409" ||
    errorObj.code === "ALREADY_JOINED" ||
    errorObj.code === "PARTY_FULL"
  ) {
    errorObj.action = "다른 파티를 찾아보세요";
    errorObj.actionUrl = "/party";
  } else if (errorObj.code === "P404") {
    errorObj.action = "파티 목록으로 이동";
    errorObj.actionUrl = "/party";
  }

  return errorObj;
};

/**
 * Network error handler for connection issues
 */
export const handleNetworkError = (error) => {
  if (!error.response) {
    return {
      code: "NETWORK_ERROR",
      message: "네트워크 연결을 확인해주세요",
      severity: ERROR_SEVERITY.ERROR,
      canRetry: true,
    };
  }
  return handleApiError(error);
};

/**
 * Check if error is a specific type
 */
export const isPaymentError = (error) => {
  const code = error.response?.data?.error?.code || error.response?.data?.code;
  return code?.startsWith("PAY");
};

export const isAuthError = (error) => {
  return error.response?.status === 401;
};

export const isNotFoundError = (error) => {
  return error.response?.status === 404;
};

export const isServerError = (error) => {
  return error.response?.status >= 500;
};
