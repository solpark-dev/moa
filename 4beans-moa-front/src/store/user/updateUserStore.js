import { create } from "zustand";

export const useUpdateUserStore = create((set) => ({
  email: "",
  nickname: "",
  phone: "",
  profileImage: "",
  previewImage: null,
  agreeMarketing: false,

  setUserData: (user) =>
    set({
      email: user.userId,
      nickname: user.nickname,
      phone: user.phone,
      profileImage: user.profileImage,
      previewImage: user.profileImage,
      agreeMarketing: user.agreeMarketing ?? user.marketing ?? false,
    }),

  setField: (field, value) => set({ [field]: value }),
}));