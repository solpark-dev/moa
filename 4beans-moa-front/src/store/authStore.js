import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import httpClient from "@/api/httpClient";
import { useLoginStore } from "./user/loginStore";
import { useOtpStore } from "./user/otpStore";

const PASSWORD_STORAGE_KEYS = [
  "login-password",
  "password",
  "pwd",
  "user-password",
  "pwd-remember",
];

export const purgeLoginPasswords = () => {
  [localStorage, sessionStorage].forEach((storage) => {
    if (!storage) return;
    PASSWORD_STORAGE_KEYS.forEach((key) => {
      try {
        storage.removeItem(key);
      } catch {}
    });
  });

  try {
    useLoginStore.getState().setField("password", "");
    useLoginStore.getState().setField("otpCode", "");
  } catch {}
};

// Flag to prevent multiple simultaneous fetchSession calls
let isFetchingSession = false;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      // accessToken은 메모리에만 유지 — localStorage에 저장하지 않음 (XSS 방어)
      // 페이지 새로고침 후에는 HttpOnly 쿠키(ACCESS_TOKEN)로 백엔드 인증 처리
      accessToken: null,
      // loading: true 초기값 유지 — fetchSession 완료 전까지 ProtectedRoute가 판단하지 않음
      loading: true,
      // _hydrated: Zustand rehydration + fetchSession 완료 후 true
      // ProtectedRoute는 이 값이 true일 때만 인증 판단을 내림
      _hydrated: false,

      /* =========================
       * TOKEN SET
       * ========================= */
      setTokens: ({ accessToken, accessTokenExpiresIn }) => {
        set({ accessToken });
        get().fetchSession();
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          loading: false,
        });
        localStorage.removeItem("auth-storage");
      },

      fetchSession: async () => {
        // Prevent multiple simultaneous calls
        if (isFetchingSession) {
          console.log("[AuthStore] fetchSession already in progress, skipping");
          return;
        }

        isFetchingSession = true;
        const { clearAuth } = get();

        console.log("[AuthStore] Starting session recovery...");
        set({ loading: true });

        try {
          const res = await httpClient.get("/users/me");

          if (res?.success && res.data) {
            console.log("[AuthStore] Session recovery successful", {
              userId: res.data.userId,
              role: res.data.role,
            });
            set({ user: res.data, _hydrated: true });
            useOtpStore.getState().setEnabled(!!res.data.otpEnabled);
          } else {
            console.warn("[AuthStore] Session recovery failed: Invalid response", res);
            clearAuth();
            set({ _hydrated: true });
          }
        } catch (error) {
          const status = error.response?.status;
          const errorMessage = error.response?.data?.error?.message || error.message;

          if (status === 401) {
            console.log("[AuthStore] Session recovery failed: Unauthorized (expired/invalid cookies)");
          } else if (status === 403) {
            console.warn("[AuthStore] Session recovery failed: Forbidden", errorMessage);
          } else if (status === 500) {
            console.error("[AuthStore] Session recovery failed: Server error", {
              status,
              message: errorMessage,
              traceId: error.response?.data?.error?.traceId,
            });
          } else if (!error.response) {
            console.error("[AuthStore] Session recovery failed: Network error", error.message);
          } else {
            console.error("[AuthStore] Session recovery failed: Unknown error", {
              status,
              message: errorMessage,
            });
          }

          clearAuth();
          set({ _hydrated: true });
        } finally {
          set({ loading: false });
          isFetchingSession = false;
          console.log("[AuthStore] Session recovery completed, _hydrated set to true");
        }
      },

      logout: async () => {
        try {
          await httpClient.post("/auth/logout");
        } catch (error) {
          console.error("Logout Error:", error);
        } finally {
          purgeLoginPasswords();
          get().clearAuth();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // user 정보만 persist — 토큰은 절대 localStorage에 저장하지 않음
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // Zustand rehydration 완료 후 쿠키 기반 세션 복구 시도
        // fetchSession 내부에서 _hydrated = true 로 설정
        // 실패해도 _hydrated = true 처리하므로 ProtectedRoute가 영원히 로딩되지 않음
        console.log("[AuthStore] Rehydration complete, triggering session recovery");
        if (state) {
          state.fetchSession();
        } else {
          console.warn("[AuthStore] Rehydration state is null, skipping session recovery");
        }
      },
    }
  )
);
