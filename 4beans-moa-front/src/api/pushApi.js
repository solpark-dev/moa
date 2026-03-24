import httpClient from "./httpClient";

export const pushApi = {
  getMyPushList: (page = 0, size = 10) => 
    httpClient.get("/push/my", { params: { page: page + 1, size } }),

  getUnreadCount: () => 
    httpClient.get("/push/unread-count"),

  getPush: (pushId) => 
    httpClient.get(`/push/${pushId}`),

  updateRead: (pushId) => 
    httpClient.patch(`/push/${pushId}/read`),

  updateAllRead: () => 
    httpClient.patch("/push/read-all"),

  deletePush: (pushId) => 
    httpClient.delete(`/push/${pushId}`),

  deleteAllPushs: () => 
    httpClient.delete("/push/all"),
};

export default pushApi;