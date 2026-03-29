import { useEffect } from "react";
import { motion } from "framer-motion";
import { initResetPwdPage } from "@/hooks/auth/useResetPassword";
import { ResetPwdGuide } from "./components/ResetPwdGuide";
import { ResetPwdForm } from "./components/ResetPwdForm";

export default function ResetPwdPage() {
  useEffect(() => {
    initResetPwdPage();
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--theme-bg)" }}
    >
      {/* Orb blobs */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "var(--orb-1)", opacity: 0.2, filter: "blur(80px)" }}
      />
      <div
        className="absolute bottom-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "var(--orb-2)", opacity: 0.16, filter: "blur(80px)" }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center pt-12 pb-6"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5"
          style={{ background: "var(--theme-primary)" }}
        >
          <span className="text-white text-xl font-black">M</span>
        </div>
        <h1 className="text-[20px] font-bold" style={{ color: "var(--theme-primary)" }}>
          MOA
        </h1>
      </motion.div>

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
        className="relative z-10 mx-5 rounded-3xl overflow-hidden"
        style={{
          background: "var(--glass-bg-card)",
          backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <div className="px-6 pt-7 pb-2">
          <h2 className="text-[20px] font-bold mb-1" style={{ color: "var(--theme-text)" }}>
            비밀번호 재설정
          </h2>
          <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
            PASS 본인 인증 후 새 비밀번호를 설정해 주세요
          </p>
        </div>

        <div className="px-6 pt-5 pb-7 space-y-4">
          <ResetPwdGuide />
          <ResetPwdForm />

          <p className="text-[11px] text-center" style={{ color: "var(--theme-text-muted)" }}>
            본인 확인이 완료된 경우 비밀번호 재설정이 가능합니다
          </p>
        </div>
      </motion.div>

      <div className="pb-10" />
    </div>
  );
}
