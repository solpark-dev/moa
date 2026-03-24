import { create } from "zustand";

const initialForm = {
    email: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    phone: "",
    agreeMarketing: false,
    profileImage: null,
    previewUrl: "",
};

const initialErrors = {
    email: { message: "", isError: false },
    nickname: { message: "", isError: false },
    phone: { message: "", isError: false },
    password: { message: "", isError: false },
    passwordCheck: { message: "", isError: false },
};

export const useSignupStore = create((set) => ({
    form: initialForm,
    errors: initialErrors,

    setField: (name, value) =>
        set((state) => ({
            form: { ...state.form, [name]: value },
        })),

    setErrorMessage: (name, message, isError) =>
        set((state) => ({
            errors: {
                ...state.errors,
                [name]: { message, isError },
            },
        })),

    reset: () => set({ form: initialForm, errors: initialErrors }),
}));