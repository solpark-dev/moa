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
// Flag to prevent rehydration-triggered fetchSession from running more than once per page load
let hasRehydrated = false;

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
        // 토큰만 메모리에 저장 — fetchSession은 호출하지 않음
        // (로그인/회원가입 흐름에서는 호출 측에서 직접 /users/me를 처리)
        // (토큰 갱신 흐름에서는 이미 user 정보가 있으므로 재조회 불필요)
        set({ accessToken });
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          loading: false,
        });
        // localStorage.removeItem 직접 호출 제거
        // → 다른 탭의 storage 이벤트로 인한 rehydration 루프 방지
        // persist 미들웨어가 partialize({ user: null })을 자동으로 저장함
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
        console.log("[AuthStore] Rehydration complete, triggering session recovery");
        if (state) {
          // 페이지 로드당 한 번만 실행 — 다른 탭의 storage 이벤트로 인한 재실행 방지
          if (hasRehydrated) {
            console.log("[AuthStore] Already rehydrated this page load, skipping");
            return;
          }
          hasRehydrated = true;
          state.fetchSession();
        } else {
          console.warn("[AuthStore] Rehydration state is null, skipping session recovery");
        }
      },
    }
  )
);
