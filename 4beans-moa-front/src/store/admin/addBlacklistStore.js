import { create } from "zustand";

export const useAddBlacklistStore = create((set) => ({
  userId: "",
  reasonType: "",
  reasonDetail: "",
  submitting: false,
  error: null,

  setUserId: (value) => set({ userId: value }),
  setReasonType: (value) => set({ reasonType: value }),
  setReasonDetail: (value) => set({ reasonDetail: value }),
  setSubmitting: (value) => set({ submitting: value }),
  setError: (value) => set({ error: value }),

  reset: () =>
    set({
      userId: "",
      reasonType: "",
      reasonDetail: "",
      submitting: false,
      error: null,
    }),
}));
