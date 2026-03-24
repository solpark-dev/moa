import { create } from "zustand";

export const useMyPageStore = create((set) => ({
  user: null,
  isAdmin: false,

  setUser: (user) => set({ user, isAdmin: user?.role === "ADMIN" }),
}));
