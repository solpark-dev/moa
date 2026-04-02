import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * 404 Not Found 에러 페이지.
 * 잘못된 URL 접근 시 표시됩니다.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

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
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(99,91,255,0.15), rgba(0,212,255,0.1))",
            border: "1px solid var(--theme-border)",
          }}
        >
          <span className="text-5xl">🔍</span>
        </motion.div>

        <h1
          className="text-6xl font-black mb-2"
          style={{ color: "var(--theme-primary)" }}
        >
          404
        </h1>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--theme-text)" }}
        >
          페이지를 찾을 수 없습니다
        </h2>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: "var(--theme-text-muted)" }}
        >
          요청하신 페이지가 존재하지 않거나,
          <br />
          주소가 변경되었을 수 있습니다.
        </p>

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "var(--theme-primary)",
              boxShadow: "var(--theme-primary-shadow)",
            }}
          >
            홈으로 돌아가기
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{
              background: "transparent",
              border: "1px solid var(--theme-border)",
              color: "var(--theme-text)",
            }}
          >
            이전 페이지로
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
