// src/store/admin/removeBlacklistStore.js
import { create } from "zustand";

export const useRemoveBlacklistStore = create((set) => ({
  userId: "",
  reason: "",
  submitting: false,
  error: null,
  setUserId: (value) => set({ userId: value }),
  setReason: (value) => set({ reason: value }),
  setSubmitting: (value) => set({ submitting: value }),
  setError: (value) => set({ error: value }),
  reset: () =>
    set({
      userId: "",
      reason: "",
      submitting: false,
      error: null,
    }),
}));
