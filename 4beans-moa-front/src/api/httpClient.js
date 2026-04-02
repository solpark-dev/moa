import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

let isTokenRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

httpClient.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config;
    }

    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const errorData = error.response?.data;
    const { addToast } = useToastStore.getState();

    // ── 네트워크 에러 (서버 응답 없음) ──────────────────────
    if (!error.response) {
      console.error("[Network Error]", error.message);
      addToast({
        type: "error",
        message: "서버에 연결할 수 없습니다. 네트워크를 확인해주세요.",
        duration: 5000,
      });
      return Promise.reject(error);
    }

    if (originalRequest?.skipAuth) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url.startsWith("/auth/login") ||
      originalRequest.url.startsWith("/auth/refresh") ||
      originalRequest.url.startsWith("/auth/unlock") ||
      originalRequest.url.startsWith("/auth/restore") ||
      originalRequest.url.startsWith("/signup") ||
      originalRequest.url.startsWith("/auth/verify") ||
      originalRequest.url.startsWith("/auth/otp");

    if (status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    // ── 401 토큰 갱신 로직 (기존 유지) ─────────────────────
    if (
      status === 401 &&
      originalRequest.url !== "/auth/refresh" &&
      !originalRequest._retry
    ) {
      if (isTokenRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isTokenRefreshing = true;

      const { clearAuth, setTokens } = useAuthStore.getState();

      try {
        // REFRESH_TOKEN은 HttpOnly 쿠키로 자동 전송 (withCredentials: true)
        const refreshRes = await axios.post("/api/auth/refresh", null, {
          withCredentials: true,
          headers: { "Content-Type": "application/json; charset=UTF-8" },
        });

        const apiRes = refreshRes.data;

        if (!apiRes.success) {
          clearAuth();
          processQueue(
            new Error(apiRes.error?.message || "토큰 갱신 실패"),
            null
          );
          return Promise.reject(error);
        }

        const {
          accessToken: newAccessToken,
          accessTokenExpiresIn,
        } = apiRes.data || {};

        setTokens({ accessToken: newAccessToken, accessTokenExpiresIn });

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        clearAuth();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isTokenRefreshing = false;
      }
    }

    // ── 글로벌 에러 토스트 처리 ─────────────────────────────

    // 429: Rate Limit 초과
    if (status === 429) {
      addToast({
        type: "warning",
        message: errorData?.error?.message || "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        duration: 5000,
      });
    }

    // 403: 권한 없음
    if (status === 403 && !isAuthEndpoint) {
      addToast({
        type: "error",
        message: "접근 권한이 없습니다.",
      });
    }

    // 500: 서버 에러 — traceId 로깅
    if (status === 500) {
      const traceId = errorData?.error?.traceId;
      if (traceId) {
        console.error(`[Server Error] TraceId: ${traceId}`, errorData);
      }
      addToast({
        type: "error",
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        duration: 5000,
      });
    }

    return Promise.reject(error);
  }
);

export default httpClient;

