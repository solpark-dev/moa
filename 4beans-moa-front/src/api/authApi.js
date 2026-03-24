// src/api/authApi.js
import httpClient from "./httpClient";

export const fetchCurrentUser = () => httpClient.get("/users/me");

export const login = (data) => httpClient.post("/auth/login", data);

export const logout = () => httpClient.post("/auth/logout");

export const signup = (data) => httpClient.post("/signup/add", data);

export const oauthTransfer = (data) => httpClient.post("/oauth/transfer", data);

export const oauthConnectByPhone = (data) =>
  httpClient.post("/oauth/connect-by-phone", data);

export const verifyEmail = (token) =>
  httpClient.post(`/auth/verify-email?token=${token}`);

export const checkCommon = (data) => httpClient.post("/signup/check", data);

export const checkPasswordFormat = (password) =>
  httpClient.post("/users/checkPasswordFormat", { password });

export const checkPasswordConfirm = (password, passwordConfirm) =>
  httpClient.post("/users/checkPasswordConfirm", { password, passwordConfirm });

export const checkCurrentPassword = (currentPassword) =>
  httpClient.post("/users/checkCurrentPassword", {
    currentPassword,
  });

export const startPassAuth = () => httpClient.get("/signup/pass/start");

export const verifyPassAuth = (data) =>
  httpClient.post("/signup/pass/verify", data);

export const checkPhone = (phone) =>
  httpClient.post("/signup/check", { type: "phone", value: phone });

export const restoreAccount = (data) => httpClient.post("/auth/restore", data);

export const unlockAccount = (data) => httpClient.post("/auth/unlock", data);

export const setupOtp = () => httpClient.post("/auth/otp/setup");

export const verifyOtp = (code) =>
  httpClient.post("/auth/otp/verify", { code });

export const disableOtp = () => httpClient.post("/auth/otp/disable");

export const disableOtpVerify = (code) =>
  httpClient.post("/auth/otp/disable-verify", { code });

export const connectSocial = (provider, providerUserId) =>
  httpClient.post("/users/me/oauth/connect", { provider, providerUserId });
