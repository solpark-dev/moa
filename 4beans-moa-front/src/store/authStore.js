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
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresIn: null,
      loading: false,

      /* =========================
       * TOKEN SET
       * ========================= */
      setTokens: ({ accessToken, refreshToken, accessTokenExpiresIn }) => {
        set({
          accessToken,
          refreshToken,
          accessTokenExpiresIn: Number(accessTokenExpiresIn),
        });
        get().fetchSession();
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          accessTokenExpiresIn: null,
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
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        accessTokenExpiresIn: state.accessTokenExpiresIn,
      }),
      onRehydrateStorage: () => (state) => {
        // localStorage에서 상태 복원 후 세션 확인
        if (state?.accessToken) {
          state.fetchSession();
        }
      },
    }
  )
);
