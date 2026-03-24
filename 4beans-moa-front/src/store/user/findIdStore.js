import { create } from "zustand";

export const useFindIdStore = create((set) => ({
  step: 1,
  foundEmail: "",
  isLoading: false,

  setField: (key, value) => set({ [key]: value }),

  reset: () =>
    set({
      step: 1,
      foundEmail: "",
      isLoading: false,
    }),
}));
