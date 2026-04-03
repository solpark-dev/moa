import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/utils/toast";

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
      console.log("[HttpClient] Request with skipAuth flag, skipping auth headers");
      return config;
    }

    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("[HttpClient] Request with Authorization header (in-memory token)");
    } else {
      console.log("[HttpClient] Request without Authorization header (relying on cookies)");
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

    // ── 네트워크 에러 (서버 응답 없음) ──────────────────────
    if (!error.response) {
      console.error("[Network Error]", error.message);
      toast.error("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.", { duration: 5000 });
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

      console.log("[HttpClient] Attempting token refresh...");

      try {
        // REFRESH_TOKEN은 HttpOnly 쿠키로 자동 전송 (withCredentials: true)
        const refreshRes = await axios.post("/api/auth/refresh", null, {
          withCredentials: true,
          headers: { "Content-Type": "application/json; charset=UTF-8" },
        });

        const apiRes = refreshRes.data;

        if (!apiRes.success) {
          console.warn("[HttpClient] Token refresh failed: Invalid response", apiRes);
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

        console.log("[HttpClient] Token refresh successful");
        setTokens({ accessToken: newAccessToken, accessTokenExpiresIn });

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        console.error("[HttpClient] Token refresh error:", {
          status: refreshError.response?.status,
          message: refreshError.response?.data?.error?.message || refreshError.message,
        });
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
      toast.warning(errorData?.error?.message || "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", { duration: 5000 });
    }

    // 403: 권한 없음
    if (status === 403 && !isAuthEndpoint) {
      toast.error("접근 권한이 없습니다.");
    }

    // 500: 서버 에러 — traceId 로깅
    if (status === 500) {
      const traceId = errorData?.error?.traceId;
      if (traceId) {
        console.error(`[Server Error] TraceId: ${traceId}`, errorData);
      }
      toast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", { duration: 5000 });
    }

    return Promise.reject(error);
  }
);

export default httpClient;

