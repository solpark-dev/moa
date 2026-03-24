import { create } from "zustand";

export const useBackupCodeStore = create((set) => ({
  open: false,
  codes: [],
  loading: false,
  issued: false,

  setOpen: (v) => set({ open: v }),

  setCodes: (codes) =>
    set({
      codes,
      issued: true,
    }),

  setLoading: (v) => set({ loading: v }),

  setIssued: (v) => set({ issued: v }),

  reset: () =>
    set({
      open: false,
      codes: [],
      loading: false,
    }),
}));
