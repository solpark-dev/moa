import httpClient from "./httpClient";

const API_BASE_URL = "/parties";
const PRODUCT_API_URL = "/product";

export const createParty = (partyData) => {
    return httpClient.post(`${API_BASE_URL}`, partyData);
};

export const getPartyList = (params) => {
    return httpClient.get(`${API_BASE_URL}`, { params });
};

export const getPartyDetail = (id) => {
    return httpClient.get(`${API_BASE_URL}/${id}`);
};

export const getProducts = () => {
    return httpClient.get(`${PRODUCT_API_URL}`);
};

export const updateOttAccount = (partyId, ottData) => {
    return httpClient.patch(`${API_BASE_URL}/${partyId}/ott-account`, ottData);
};

export const joinParty = (partyId, paymentData) => {
    return httpClient.post(`${API_BASE_URL}/${partyId}/join`, paymentData);
};

export const leaveParty = (partyId) => {
    return httpClient.delete(`${API_BASE_URL}/${partyId}/leave`);
};

export const getMyParties = async () => {
    try {
        const response = await httpClient.get("/parties/my");
        // Backend returns ApiResponse<List<PartyListResponse>>
        // httpClient interceptor unwraps response.data, so 'response' is ApiResponse object
        // Return the ApiResponse object so partyService can unwrap .data
        return response;
    } catch (error) {
        console.error("Failed to fetch my parties:", error);
        throw error;
    }
};

export const getMyClosedParties = async () => {
    try {
        const response = await httpClient.get("/parties/my/closed");
        return response;
    } catch (error) {
        console.error("Failed to fetch my closed parties:", error);
        throw error;
    }
};

export const getPartyMembers = (partyId) => {
    return httpClient.get(`${API_BASE_URL}/${partyId}/members`);
};

export const processLeaderDeposit = (partyId, paymentData) => {
    return httpClient.post(`${API_BASE_URL}/${partyId}/leader-deposit`, paymentData);
};

