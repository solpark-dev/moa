import { motion } from "framer-motion";

/**
 * ErrorBoundary에서 에러 발생 시 보여줄 대체 UI.
 * 사용자에게 에러 정보와 복구 옵션을 제공합니다.
 */
export default function ErrorFallback({ error, onReset }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--theme-bg, #ffffff)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.1))",
            border: "1px solid var(--theme-border, #e5e7eb)",
          }}
        >
          <span className="text-5xl">💥</span>
        </motion.div>

        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--theme-text, #111827)" }}
        >
          문제가 발생했습니다
        </h2>
        <p
          className="text-sm mb-4 leading-relaxed"
          style={{ color: "var(--theme-text-muted, #4b5563)" }}
        >
          예상치 못한 오류가 발생했습니다.
          <br />
          아래 버튼을 눌러 다시 시도해주세요.
        </p>

        {/* 에러 상세 (개발자용) */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 py-2.5 px-4 rounded-xl text-xs text-left"
            style={{
              background: "var(--theme-bg-input, #f9fafb)",
              border: "1px solid var(--theme-border, #e5e7eb)",
              color: "var(--theme-text-muted, #6b7280)",
            }}
          >
            <span
              className="font-medium block mb-1"
              style={{ color: "var(--theme-text, #111827)" }}
            >
              오류 정보:
            </span>
            <code className="font-mono text-[11px] break-all">
              {error.message || "Unknown error"}
            </code>
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "var(--theme-primary, #635bff)",
              boxShadow: "var(--theme-primary-shadow, none)",
            }}
          >
            다시 시도
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/")}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{
              background: "transparent",
              border: "1px solid var(--theme-border, #e5e7eb)",
              color: "var(--theme-text, #111827)",
            }}
          >
            홈으로 돌아가기
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
