import { motion } from "framer-motion";

/**
 * 네트워크 에러 페이지.
 * 서버 연결 실패 시 표시됩니다.
 */
export default function NetworkErrorPage() {
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
            background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))",
            border: "1px solid var(--theme-border)",
          }}
        >
          <span className="text-5xl">📡</span>
        </motion.div>

        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--theme-text)" }}
        >
          네트워크에 연결할 수 없습니다
        </h2>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: "var(--theme-text-muted)" }}
        >
          인터넷 연결을 확인하고
          <br />
          다시 시도해주세요.
        </p>

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
      </motion.div>
    </div>
  );
}
