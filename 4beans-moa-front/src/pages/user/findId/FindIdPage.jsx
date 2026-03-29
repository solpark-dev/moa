import { motion } from "framer-motion";
import { useFindIdStore } from "@/store/user/findIdStore";
import { useFindIdLogic } from "@/hooks/auth/useFindId";
import { FindIdForm } from "./components/FindIdForm";
import { FindIdResult } from "./components/FindIdResult";

export default function FindIdPage() {
  const { step, foundEmail, isLoading } = useFindIdStore();
  const { handlePassAuth } = useFindIdLogic();

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
            아이디 찾기
          </h2>
          <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
            가입 시 등록한 휴대폰으로 본인 인증 후 이메일을 확인하세요
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-2">
          {[{ n: 1, label: "본인 인증" }, { n: 2, label: "이메일 확인" }].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-2">
              {i > 0 && (
                <div className="flex-1 h-px w-8" style={{ background: "var(--glass-border)" }} />
              )}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{
                    background: step >= n ? "var(--theme-primary)" : "var(--glass-bg-overlay)",
                    color: step >= n ? "#fff" : "var(--theme-text-muted)",
                  }}
                >
                  {n}
                </div>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: step >= n ? "var(--theme-text)" : "var(--theme-text-muted)" }}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pt-4 pb-7">
          {step === 1 && <FindIdForm onPassAuth={handlePassAuth} isLoading={isLoading} />}
          {step === 2 && <FindIdResult email={foundEmail} />}

          <p className="text-[11px] text-center mt-4" style={{ color: "var(--theme-text-muted)" }}>
            명의자 정보가 다르면 아이디 찾기가 제한될 수 있습니다
          </p>
        </div>
      </motion.div>

      <div className="pb-10" />
    </div>
  );
}
