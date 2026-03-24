/**
 * 날짜 계산 유틸리티 함수
 * 파티 생성 시 시작일/종료일 계산에 사용
 */

/**
 * 시작일과 개월 수를 기반으로 종료일 계산
 * @param {string} startDate - 시작일 (YYYY-MM-DD 형식)
 * @param {number} months - 구독 기간 (개월 수, 1-12)
 * @returns {string} 종료일 (YYYY-MM-DD 형식)
 */
export const calculateEndDate = (startDate, months) => {
  if (!startDate || !months || months < 1) {
    return "";
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    return "";
  }

  // 시작일에 개월 수를 더하고 하루를 뺌
  const end = new Date(start);
  end.setMonth(end.getMonth() + months);
  end.setDate(end.getDate() - 1);

  return formatDate(end);
};

/**
 * Date 객체를 YYYY-MM-DD 형식 문자열로 변환
 * @param {Date} date - Date 객체
 * @returns {string} YYYY-MM-DD 형식 문자열
 */
export const formatDate = (date) => {
  if (!date || isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string} 오늘 날짜 (YYYY-MM-DD 형식)
 */
export const getTodayString = () => {
  return formatDate(new Date());
};

/**
 * 내일 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string} 내일 날짜 (YYYY-MM-DD 형식)
 */
export const getTomorrowString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
};

/**
 * 날짜 문자열이 유효한 YYYY-MM-DD 형식인지 확인
 * @param {string} dateString - 날짜 문자열
 * @returns {boolean} 유효하면 true
 */
export const isValidDateFormat = (dateString) => {
  if (!dateString) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * 주어진 날짜가 오늘 이후인지 확인
 * @param {string} dateString - 날짜 문자열 (YYYY-MM-DD)
 * @returns {boolean} 오늘 이후면 true
 */
export const isDateTodayOrLater = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
};
