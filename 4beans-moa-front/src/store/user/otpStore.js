import { create } from "zustand";

export const useOtpStore = create((set) => ({
  enabled: false,
  modalOpen: false,
  qrUrl: null,
  secret: null,
  code: "",
  loading: false,
  mode: "enable",

  setEnabled: (enabled) => set({ enabled }),

  setModal: (open) =>
    set({
      modalOpen: open,
      ...(open ? { code: "" } : {}),
    }),

  setField: (field, value) => set({ [field]: value }),

  reset: (options = {}) =>
    set((state) => ({
      enabled: options.resetEnabled ? false : state.enabled,
      modalOpen: false,
      qrUrl: null,
      secret: null,
      code: "",
      loading: false,
      mode: "enable",
    })),
}));
