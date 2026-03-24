import httpClient from "./httpClient";

export const getMySettlements = async () => {
    try {
        const apiResponse = await httpClient.get("/settlements/my");
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch settlements:", error);
        throw error;
    }
};

/**
 * 정산 내역 조회 (기간 필터 지원)
 * @param {string} startDate - 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 종료일 (YYYY-MM-DD)
 */
export const getSettlements = async (startDate, endDate) => {
    try {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const url = `/settlements${params.toString() ? '?' + params.toString() : ''}`;
        const apiResponse = await httpClient.get(url);
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch settlements:", error);
        throw error;
    }
};

/**
 * 정산 상세 내역 조회
 * @param {number} settlementId - 정산 ID
 */
export const getSettlementDetails = async (settlementId) => {
    try {
        const apiResponse = await httpClient.get(`/settlements/${settlementId}/details`);
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch settlement details:", error);
        throw error;
    }
};
