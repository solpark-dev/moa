import httpClient from "./httpClient";

/**
 * 1원 인증 요청
 * @param {string} bankCode - 은행코드 (3자리)
 * @param {string} accountNum - 계좌번호
 * @param {string} accountHolder - 예금주명
 */
export const requestVerification = async (bankCode, accountNum, accountHolder) => {
    try {
        const apiResponse = await httpClient.post("/bank-account/verify-request", {
            bankCode,
            accountNum,
            accountHolder
        });
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to request verification:", error);
        throw error;
    }
};

/**
 * 인증코드 검증 및 계좌 등록
 * @param {string} bankTranId - 거래고유번호
 * @param {string} verifyCode - 4자리 인증코드
 */
export const verifyAndRegister = async (bankTranId, verifyCode) => {
    try {
        const apiResponse = await httpClient.post("/bank-account/verify", {
            bankTranId,
            verifyCode
        });
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to verify code:", error);
        throw error;
    }
};

/**
 * 계좌 정보 조회
 */
export const getAccount = async () => {
    try {
        const apiResponse = await httpClient.get("/bank-account");
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch account:", error);
        throw error;
    }
};

/**
 * 계좌 삭제
 */
export const deleteAccount = async () => {
    try {
        const apiResponse = await httpClient.delete("/bank-account");
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to delete account:", error);
        throw error;
    }
};

/**
 * 계좌 변경 (새 인증 시작)
 * @param {string} bankCode - 은행코드
 * @param {string} accountNum - 계좌번호
 * @param {string} accountHolder - 예금주명
 */
export const changeAccount = async (bankCode, accountNum, accountHolder) => {
    try {
        const apiResponse = await httpClient.post("/bank-account/change", {
            bankCode,
            accountNum,
            accountHolder
        });
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to change account:", error);
        throw error;
    }
};

// 은행 코드 목록
export const BANK_CODES = [
    { code: "004", name: "KB국민은행" },
    { code: "011", name: "NH농협은행" },
    { code: "020", name: "우리은행" },
    { code: "023", name: "SC제일은행" },
    { code: "081", name: "하나은행" },
    { code: "088", name: "신한은행" },
    { code: "089", name: "케이뱅크" },
    { code: "090", name: "카카오뱅크" },
    { code: "092", name: "토스뱅크" }
];
