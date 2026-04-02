import { create } from "zustand";

let toastId = 0;

/**
 * 토스트 알림 상태 관리 스토어.
 *
 * 사용법:
 *   const { addToast } = useToastStore();
 *   addToast({ type: "error", message: "요청 실패" });
 *   addToast({ type: "success", message: "저장 완료" });
 *   addToast({ type: "warning", message: "주의 필요" });
 */
export const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ type = "info", message, duration = 3000 }) => {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));

    // 자동 제거
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
