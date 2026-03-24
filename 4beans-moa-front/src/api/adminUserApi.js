import httpClient from "./httpClient";

export const fetchAdminUsers = (params) =>
  httpClient.get("/admin/users", { params });

export const getAdminUserDetail = (userId) =>
  httpClient.get(`/admin/users/${encodeURIComponent(userId)}`);

export const addUserBlacklist = (data) =>
  httpClient.post("/admin/users/blacklist", data);

export const deleteUserBlacklist = (data) =>
  httpClient.post("/admin/users/blacklist/delete", data);
