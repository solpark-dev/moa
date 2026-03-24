// src/api/userApi.js
import httpClient from "@/api/httpClient";

export const getUser = () => httpClient.get("/users/me");

export const getUserList = (params) =>
  httpClient.get("/users/list", { params });

export const updateUser = (data) => httpClient.post("/users/update", data);

export const updatePwd = (data) => httpClient.post("/users/updatePwd", data);

export const uploadProfileImage = (formData) =>
  httpClient.post("/users/uploadProfileImage", formData, {
    headers: { "Content-Type": undefined },
  });

export const resetPwdByOldApi = (data) =>
  httpClient.post("/users/resetPwd", data);

export const startResetPwdByToken = (data) =>
  httpClient.post("/users/resetPwd/start", data);

export const resetPwdByToken = (data) =>
  httpClient.post("/users/resetPwd", data);

export const withdrawUser = (data) => httpClient.post("/users/delete", data);

export const getMyAccount = () => httpClient.get("/users/me/account");

export const getMyCard = () => httpClient.get("/users/me/card");

// 빌링키 발급 및 카드 정보 저장 (사용자 카드 등록/업데이트)
export const issueBillingKey = (authKey) =>
  httpClient.post("/users/me/billing-key/issue", { authKey });

export const deleteMyAccount = () => httpClient.delete("/users/me/account");

export const deleteMyCard = () => httpClient.delete("/users/me/card");
