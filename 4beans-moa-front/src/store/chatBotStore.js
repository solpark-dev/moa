import { create } from "zustand";

export const useChatBotStore = create((set) => ({
  isOpen: false,
  messages: [],
  input: "",
  loading: false,
  toggleOpen: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
  setInput: (value) =>
    set(() => ({
      input: value,
    })),
  pushMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setLoading: (loading) =>
    set(() => ({
      loading,
    })),
  reset: () =>
    set(() => ({
      isOpen: false,
      messages: [],
      input: "",
      loading: false,
    })),
}));
