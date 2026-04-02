import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * 500 서버 에러 페이지.
 * traceId를 표시하여 개발자가 로그 추적이 가능합니다.
 * 사용자는 traceId로 문제를 신고할 수 있습니다.
 */
export default function ServerErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const traceId = location.state?.traceId || null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--theme-bg)" }}
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
            border: "1px solid var(--theme-border)",
          }}
        >
          <span className="text-5xl">⚠️</span>
        </motion.div>

        <h1
          className="text-6xl font-black mb-2"
          style={{ color: "#ef4444" }}
        >
          500
        </h1>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--theme-text)" }}
        >
          서버 오류가 발생했습니다
        </h2>
        <p
          className="text-sm mb-4 leading-relaxed"
          style={{ color: "var(--theme-text-muted)" }}
        >
          일시적인 문제가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        {/* TraceId — 개발자 추적용 */}
        {traceId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 py-2.5 px-4 rounded-xl text-xs"
            style={{
              background: "var(--theme-bg-input)",
              border: "1px solid var(--theme-border)",
              color: "var(--theme-text-muted)",
            }}
          >
            <span className="font-medium" style={{ color: "var(--theme-text)" }}>
              오류 추적 ID:
            </span>{" "}
            <code className="font-mono">{traceId}</code>
            <p className="mt-1 text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
              문의 시 이 ID를 함께 알려주세요
            </p>
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "var(--theme-primary)",
              boxShadow: "var(--theme-primary-shadow)",
            }}
          >
            다시 시도
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{
              background: "transparent",
              border: "1px solid var(--theme-border)",
              color: "var(--theme-text)",
            }}
          >
            홈으로 돌아가기
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
