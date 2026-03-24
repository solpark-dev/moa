import { create } from "zustand";

export const useLoginStore = create((set) => ({
  email: "",
  password: "",
  remember: false,
  otpRequired: false,
  otpModalOpen: false,
  otpCode: "",
  otpToken: null,

  setField: (key, value) => set({ [key]: value }),

  resetOtp: () =>
    set({
      otpRequired: false,
      otpModalOpen: false,
      otpCode: "",
      otpToken: null,
    }),
}));
