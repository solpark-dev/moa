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

const getCsrfToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

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

    const csrfToken = getCsrfToken();
    if (csrfToken && ["post", "put", "delete", "patch"].includes(config.method?.toLowerCase())) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
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

    if (status === 429) {
      toast.warning(errorData?.error?.message || "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", { duration: 5000 });
    }

    if (status === 403 && !isAuthEndpoint) {
      toast.error("접근 권한이 없습니다.");
    }

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

