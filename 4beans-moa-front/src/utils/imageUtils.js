/**
 * Image Path Utility
 * 방법 A: 문자열 치환 방식으로 DB의 로고 경로를 아이콘 경로로 변환
 * 
 * DB에는 로고 경로만 저장하고, 아이콘은 규칙 기반으로 프론트엔드에서 변환
 * - 로고: /uploads/product-image/Netflix_logo.png
 * - 아이콘: /uploads/product-icon/Netflix_icon.png
 */

/**
 * API Base URL 가져오기
 * @returns {string} - API Base URL
 */
const getApiBaseUrl = () => {
    // Vite 환경변수에서 API URL 가져오기
    const apiUrl = import.meta.env.VITE_API_URL || '';
    return apiUrl;
};

/**
 * DB에서 받아온 로고 이미지 경로를 완전한 URL로 변환
 * @param {string} imagePath - DB에서 받아온 이미지 경로 (예: /uploads/product-logo/Netflix_logo.png)
 * @returns {string} - 완전한 이미지 URL
 */
export const getProductLogoUrl = (imagePath) => {
    if (!imagePath) return '';

    // 이미 완전한 URL인 경우 그대로 반환
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // 상대 경로인 경우 API Base URL 추가
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}${imagePath}`;
};

/**
 * DB에서 받아온 이미지 경로를 아이콘 경로로 변환
 * 폴더는 동일하게 유지하고 파일명만 변환: _logo.png → _icon.png
 * @param {string} imagePath - DB에서 받아온 이미지 경로 (예: /uploads/product-image/YouTube_logo.png)
 * @returns {string} - 아이콘 경로 (예: /uploads/product-image/YouTube_icon.png)
 */
export const getProductIconUrl = (imagePath) => {
    if (!imagePath) return '';

    // 파일명만 변환 (_logo → _icon, 대소문자 모두 처리)
    const iconPath = imagePath.replace(/_[Ll]ogo\./, '_icon.');

    // 이미 완전한 URL인 경우
    if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
        return iconPath;
    }

    // 상대 경로인 경우 API Base URL 추가
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}${iconPath}`;
};

/**
 * 이미지 로드 실패 시 대체 이미지 처리
 * @param {Event} event - 이미지 에러 이벤트
 * @param {string} fallbackText - 대체 텍스트 (보통 서비스 이름의 첫 글자)
 */
export const handleImageError = (event, fallbackText = '?') => {
    const target = event.target;

    // 이미지 숨기고 대체 텍스트 표시를 위해 data 속성 설정
    target.style.display = 'none';
    target.dataset.error = 'true';
    target.dataset.fallback = fallbackText;
};

/**
 * 이미지 경로가 유효한지 확인
 * @param {string} imagePath - 확인할 이미지 경로
 * @returns {boolean} - 유효 여부
 */
export const isValidImagePath = (imagePath) => {
    if (!imagePath) return false;
    if (typeof imagePath !== 'string') return false;

    // 기본적인 경로 패턴 확인
    return imagePath.includes('/uploads/') ||
        imagePath.startsWith('http://') ||
        imagePath.startsWith('https://');
};
