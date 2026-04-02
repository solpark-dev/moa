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

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      // accessToken은 메모리에만 유지 — localStorage에 저장하지 않음 (XSS 방어)
      // 페이지 새로고침 후에는 HttpOnly 쿠키(ACCESS_TOKEN)로 백엔드 인증 처리
      accessToken: null,
      loading: false,

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
        const { clearAuth } = get();

        set({ loading: true });

        try {
          const res = await httpClient.get("/users/me");

          if (res?.success && res.data) {
            set({ user: res.data });
            useOtpStore.getState().setEnabled(!!res.data.otpEnabled);
          } else {
            clearAuth();
          }
        } catch (error) {
          clearAuth();
        } finally {
          set({ loading: false });
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
        // localStorage 복원 후 쿠키 기반으로 세션 검증
        if (state?.user) {
          state.fetchSession();
        }
      },
    }
  )
);
