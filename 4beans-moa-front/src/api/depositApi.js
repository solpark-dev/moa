import httpClient from "./httpClient";

export const getMyDeposits = async () => {
    try {
        const apiResponse = await httpClient.get("/deposits/my");
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch deposits:", error);
        throw error;
    }
};
