import httpClient from "./httpClient";

const adminPushApi = {
    getPushCodeList: async () => {
        const response = await httpClient.get("/push/admin/codes");
        return response;
    },

    addPushCode: async (data) => {
        const response = await httpClient.post("/push/admin/codes", data);
        return response;
    },

    updatePushCode: async (pushCodeId, data) => {
        const response = await httpClient.put(`/push/admin/codes/${pushCodeId}`, data);
        return response;
    },

    deletePushCode: async (pushCodeId) => {
        const response = await httpClient.delete(`/push/admin/codes/${pushCodeId}`);
        return response;
    },

    getPushHistory: async (page = 1, size = 20, filters = {}) => {
        const params = {
            page,
            size,
            pushCode: filters.pushCode || undefined,
            receiverId: filters.receiverId || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
        };
        const response = await httpClient.get("/push/admin/history", { params });
        return response;
    },

    getUserList: async (page = 1, size = 10, keyword = "") => {
        const response = await httpClient.get("/push/admin/search", {
            params: { keyword: keyword || undefined },
        });

        const allUsers = response || [];
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const pagedUsers = allUsers.slice(startIndex, endIndex);

        return {
            content: pagedUsers,
            page: page,
            totalPages: Math.ceil(allUsers.length / size) || 1,
            totalCount: allUsers.length,
        };
    },

    sendAdminPush: async (data) => {
        const response = await httpClient.post("/push/admin/send", data);
        return response;
    },

    sendToAllUsers: async (data) => {
        const response = await httpClient.post("/push/admin/send-all", data);
        return response;
    },
};

export default adminPushApi;