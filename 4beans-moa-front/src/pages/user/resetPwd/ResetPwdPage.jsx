import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
  confirmResetPassword,
} from "@/api/authApi";

const STEPS = { EMAIL: 0, OTP: 1, NEW_PASSWORD: 2, DONE: 3 };

export default function ResetPwdPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = () => setError("");

  // Step 1: 이메일 입력 → OTP 발송
  async function handleSendOtp(e) {
    e.preventDefault();
    if (!email.trim()) return setError("이메일을 입력해주세요.");
    setLoading(true);
    clearError();
    try {
      await sendResetPasswordOtp(email.trim());
      setStep(STEPS.OTP);
    } catch {
      setError("이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: OTP 검증
  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (code.length !== 6) return setError("6자리 인증 코드를 입력해주세요.");
    setLoading(true);
    clearError();
    try {
      const res = await verifyResetPasswordOtp(email.trim(), code);
      setResetToken(res.data?.data?.resetToken || res.data?.resetToken);
      setStep(STEPS.NEW_PASSWORD);
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || "인증 코드가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  }

  // Step 3: 새 비밀번호 설정
  async function handleConfirm(e) {
    e.preventDefault();
    if (password.length < 8) return setError("비밀번호는 8자 이상이어야 합니다.");
    if (password !== passwordConfirm) return setError("비밀번호 확인이 일치하지 않습니다.");
    setLoading(true);
    clearError();
    try {
      await confirmResetPassword(resetToken, password, passwordConfirm);
      setStep(STEPS.DONE);
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || "비밀번호 재설정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const stepTitles = ["비밀번호 재설정", "인증 코드 입력", "새 비밀번호 설정", "재설정 완료"];
  const stepDescriptions = [
    "가입 시 사용한 이메일을 입력하면\n인증 코드를 보내드립니다.",
    `${email}로 전송된\n6자리 코드를 입력해주세요.`,
    "새로 사용할 비밀번호를 입력해주세요.",
    "비밀번호가 성공적으로 변경되었습니다.",
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--theme-bg)" }}
    >
      {/* Orb blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
           style={{ background: "var(--orb-1)", opacity: 0.2, filter: "blur(80px)" }} />
      <div className="absolute bottom-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
           style={{ background: "var(--orb-2)", opacity: 0.16, filter: "blur(80px)" }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center pt-12 pb-6"
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5"
             style={{ background: "var(--theme-primary)" }}>
          <span className="text-white text-xl font-black">M</span>
        </div>
        <h1 className="text-[20px] font-bold" style={{ color: "var(--theme-primary)" }}>MOA</h1>
      </motion.div>

      {/* Step indicator */}
      {step < STEPS.DONE && (
        <div className="relative z-10 flex justify-center gap-2 mb-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                background: i <= step ? "var(--theme-primary)" : "var(--glass-border)",
              }}
            />
          ))}
        </div>
      )}

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
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="px-6 pt-7 pb-8"
          >
            <h2 className="text-[20px] font-bold mb-1" style={{ color: "var(--theme-text)" }}>
              {stepTitles[step]}
            </h2>
            <p className="text-[13px] mb-6 whitespace-pre-line" style={{ color: "var(--theme-text-muted)" }}>
              {stepDescriptions[step]}
            </p>

            {/* Step 0: 이메일 입력 */}
            {step === STEPS.EMAIL && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                    이메일
                  </Label>
                  <Input
                    type="email"
                    placeholder="가입한 이메일 주소"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                    className="h-11 rounded-xl text-[14px] border-0 focus-visible:ring-1"
                    style={{ background: "var(--glass-bg-overlay)", border: "1px solid var(--glass-border)", color: "var(--theme-text)", "--tw-ring-color": "var(--theme-primary)" }}
                  />
                </div>
                {error && <p className="text-[12px] text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}
                  className="w-full h-11 text-[14px] font-bold rounded-xl text-white"
                  style={{ background: "var(--theme-primary)" }}>
                  {loading ? "전송 중..." : "인증 코드 받기"}
                </Button>
              </form>
            )}

            {/* Step 1: OTP 입력 */}
            {step === STEPS.OTP && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                    인증 코드 (6자리)
                  </Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    maxLength={6}
                    value={code}
                    onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); clearError(); }}
                    className="h-14 rounded-xl text-[24px] font-bold text-center tracking-[0.3em] border-0 focus-visible:ring-1"
                    style={{ background: "var(--glass-bg-overlay)", border: "1px solid var(--glass-border)", color: "var(--theme-text)", "--tw-ring-color": "var(--theme-primary)" }}
                  />
                  <p className="text-[11px] text-center" style={{ color: "var(--theme-text-muted)" }}>
                    유효시간 10분 · 5회 오입력 시 만료
                  </p>
                </div>
                {error && <p className="text-[12px] text-red-500">{error}</p>}
                <Button type="submit" disabled={loading || code.length !== 6}
                  className="w-full h-11 text-[14px] font-bold rounded-xl text-white"
                  style={{ background: "var(--theme-primary)" }}>
                  {loading ? "확인 중..." : "코드 확인"}
                </Button>
                <button type="button" onClick={() => { setStep(STEPS.EMAIL); setCode(""); clearError(); }}
                  className="w-full text-[12px] text-center" style={{ color: "var(--theme-text-muted)" }}>
                  이메일 다시 입력
                </button>
              </form>
            )}

            {/* Step 2: 새 비밀번호 */}
            {step === STEPS.NEW_PASSWORD && (
              <form onSubmit={handleConfirm} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                    새 비밀번호
                  </Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="8자 이상"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    className="h-11 rounded-xl text-[14px] border-0 focus-visible:ring-1"
                    style={{ background: "var(--glass-bg-overlay)", border: "1px solid var(--glass-border)", color: "var(--theme-text)", "--tw-ring-color": "var(--theme-primary)" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                    비밀번호 확인
                  </Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="비밀번호 재입력"
                    value={passwordConfirm}
                    onChange={(e) => { setPasswordConfirm(e.target.value); clearError(); }}
                    className="h-11 rounded-xl text-[14px] border-0 focus-visible:ring-1"
                    style={{ background: "var(--glass-bg-overlay)", border: "1px solid var(--glass-border)", color: "var(--theme-text)", "--tw-ring-color": "var(--theme-primary)" }}
                  />
                </div>
                {error && <p className="text-[12px] text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}
                  className="w-full h-11 text-[14px] font-bold rounded-xl text-white"
                  style={{ background: "var(--theme-primary)" }}>
                  {loading ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </form>
            )}

            {/* Step 3: 완료 */}
            {step === STEPS.DONE && (
              <div className="space-y-5 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                     style={{ background: "color-mix(in srgb, var(--theme-primary) 15%, transparent)" }}>
                  <span className="text-3xl">✓</span>
                </div>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full h-11 text-[14px] font-bold rounded-xl text-white"
                  style={{ background: "var(--theme-primary)" }}>
                  로그인하러 가기
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="pb-10" />
    </div>
  );
}
