import httpClient from "./httpClient";

export const getMyPayments = async () => {
    try {
        // httpClient baseURL이 /api이므로 /v1/payments/my로 호출
        // httpClient가 이미 response.data를 반환하므로 그것이 ApiResponse
        const apiResponse = await httpClient.get("/v1/payments/my");
        // ApiResponse 형식: { success: true, data: [...], error: null }
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch payments:", error);
        throw error;
    }
};

/**
 * 결제 상세 조회
 * @param {number} paymentId - 결제 ID
 * @returns {Promise<Object>} 결제 상세 정보
 */
export const getPaymentDetail = async (paymentId) => {
    try {
        const apiResponse = await httpClient.get(`/v1/payments/${paymentId}`);
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch payment detail:", error);
        throw error;
    }
};

/**
 * 월 구독료 결제 재시도
 * @param {number} paymentId - 결제 ID
 * @returns {Promise<Object>} 재시도 결과 (결제 상세 정보)
 */
export const retryPayment = async (paymentId) => {
    try {
        const apiResponse = await httpClient.post(`/v1/payments/${paymentId}/retry`);
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to retry payment:", error);
        throw error;
    }
};

/**
 * 보증금 결제 재시도 (파티장용)
 * @param {number} partyId - 파티 ID
 * @param {Object} paymentData - 결제 요청 정보 (tossPaymentKey, orderId, paymentMethod)
 * @returns {Promise<Object>} 재시도 결과 (파티 정보)
 */
export const retryDepositPayment = async (partyId, paymentData) => {
    try {
        const apiResponse = await httpClient.post(`/v1/payments/deposit/${partyId}/retry`, paymentData);
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to retry deposit payment:", error);
        throw error;
    }
};
