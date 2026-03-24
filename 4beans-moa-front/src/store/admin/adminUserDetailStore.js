import { create } from "zustand";

export const useAdminUserDetailStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (value) => set({ user: value }),
  setLoading: (value) => set({ loading: value }),
  setError: (value) => set({ error: value }),

  reset: () =>
    set({
      user: null,
      loading: false,
      error: null,
    }),
}));
