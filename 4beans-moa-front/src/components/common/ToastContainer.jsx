import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/store/toastStore";
import { X } from "lucide-react";

const TOAST_STYLES = {
  error: {
    bg: "linear-gradient(135deg, #ef4444, #dc2626)",
    icon: "❌",
  },
  success: {
    bg: "linear-gradient(135deg, #22c55e, #16a34a)",
    icon: "✅",
  },
  warning: {
    bg: "linear-gradient(135deg, #f59e0b, #d97706)",
    icon: "⚠️",
  },
  info: {
    bg: "linear-gradient(135deg, #635bff, #5a52d5)",
    icon: "ℹ️",
  },
};

/**
 * 토스트 알림 컨테이너.
 * App 최상단에 배치하여 글로벌 토스트 알림을 렌더링합니다.
 *
 * 사용법: App.jsx에서 <ToastContainer /> 추가
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse gap-2 w-full max-w-[360px] px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex items-center gap-3 py-3 px-4 rounded-2xl text-white shadow-xl"
              style={{
                background: style.bg,
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <span className="text-lg flex-shrink-0">{style.icon}</span>
              <p className="text-sm font-medium flex-1 leading-snug">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-0.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
