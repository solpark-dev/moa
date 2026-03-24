// src/store/user/updatePwdStore.js
import { create } from "zustand";

const defaultFields = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

const defaultErrors = { current: "", rule: "", confirm: "" };

export const useUpdatePwdStore = create((set) => ({
  ...defaultFields,
  modalOpen: false,
  stepVerified: false,
  error: { ...defaultErrors },

  setField: (key, value) => set({ [key]: value }),

  setError: (field, msg) =>
    set((s) => ({
      error: {
        ...s.error,
        [field]: msg,
      },
    })),

  clearErrors: () => set({ error: { ...defaultErrors } }),
  setModal: (v) => set({ modalOpen: v }),
  setVerified: (v) => set({ stepVerified: v }),
  openModal: () =>
    set({
      ...defaultFields,
      error: { ...defaultErrors },
      modalOpen: true,
      stepVerified: false,
    }),
  resetAll: () =>
    set({
      ...defaultFields,
      error: { ...defaultErrors },
      modalOpen: false,
      stepVerified: false,
    }),
}));
