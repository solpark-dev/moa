import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLoginPageLogic } from "@/hooks/auth/useLogin";
import { usePasskey } from "@/hooks/auth/usePasskey";
import { LoginForm } from "./components/LoginForm";
import { SocialLoginButtons } from "./components/SocialLoginButtons";
import { LoginOtpDialog } from "./components/LoginOtpDialog";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    email, password, remember, otpModalOpen, otpCode, otpMode,
    setField, handleEmailLogin, handleKakaoLogin, handleGoogleLogin,
    handleOtpChange, handleOtpConfirm, closeOtpModal,
    handleUnlockByCertification, switchToOtpMode, switchToBackupMode,
    loginLoading, otpLoading, errors,
    handleEmailChange, handlePasswordChange,
  } = useLoginPageLogic();

  const isBackupMode  = otpMode === "backup";
  const isLoginDisabled = loginLoading || !email.trim() || !password.trim();

  const { authenticate: passkeyAuth, loading: passkeyLoading } = usePasskey();
  const [passkeyError, setPasskeyError] = useState(null);

  const handlePasskeyLogin = async () => {
    setPasskeyError(null);
    const result = await passkeyAuth();
    if (result.success) {
      navigate("/");
    } else if (!result.cancelled) {
      setPasskeyError(result.message);
    }
  };

  useEffect(() => { setField("password", ""); }, [setField]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden"
         style={{ background: "var(--theme-bg)" }}>

      {/* Orb blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
           style={{ background: "var(--orb-1)", opacity: 0.22, filter: "blur(80px)" }} />
      <div className="absolute bottom-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
           style={{ background: "var(--orb-2)", opacity: 0.18, filter: "blur(80px)" }} />

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center pt-14 pb-8"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
          style={{ background: "var(--theme-primary)" }}
        >
          <span className="text-white text-2xl font-black">M</span>
        </div>
        <h1 className="text-[22px] font-bold" style={{ color: "var(--theme-primary)" }}>MOA</h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--theme-text-muted)" }}>
          구독을 함께, 더 스마트하게
        </p>
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
            로그인
          </h2>
          <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
            계정에 로그인하세요
          </p>
        </div>

        <div className="px-6 pt-5 pb-6">
          <LoginForm
            email={email}
            password={password}
            remember={remember}
            errors={errors}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onRememberChange={(v) => setField("remember", v)}
            onSubmit={handleEmailLogin}
            isLoginDisabled={isLoginDisabled}
            loginLoading={loginLoading}
          />
        </div>

        {/* Magic Link + Passkey */}
        <div className="px-6 pb-4 flex flex-col gap-2">
          <Button
            type="button"
            onClick={() => navigate("/login/magic")}
            className="w-full h-11 text-[14px] font-semibold rounded-xl"
            style={{
              background: "var(--glass-bg-overlay)",
              border: "1px solid var(--glass-border)",
              color: "var(--theme-text)",
            }}
          >
            ✉️ &nbsp;이메일 링크로 로그인
          </Button>
          <Button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading}
            className="w-full h-11 text-[14px] font-semibold rounded-xl"
            style={{
              background: "var(--glass-bg-overlay)",
              border: "1px solid var(--glass-border)",
              color: "var(--theme-text)",
            }}
          >
            {passkeyLoading ? "인증 중..." : "🔑 패스키로 로그인"}
          </Button>
          {passkeyError && (
            <p className="text-[12px] text-red-500 text-center">{passkeyError}</p>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-6 mb-5">
          <div className="flex-1 h-px" style={{ background: "var(--glass-border)" }} />
          <span className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
            또는 소셜 로그인
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--glass-border)" }} />
        </div>

        <div className="px-6 pb-7">
          <SocialLoginButtons
            onKakao={handleKakaoLogin}
            onGoogle={handleGoogleLogin}
            loginLoading={loginLoading}
          />
        </div>
      </motion.div>

      {/* Sign up link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 flex items-center justify-center gap-1 mt-6 pb-10"
      >
        <span className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
          계정이 없으신가요?
        </span>
        <button
          onClick={() => navigate("/signup")}
          className="text-[13px] font-semibold"
          style={{ color: "var(--theme-primary)" }}
        >
          회원가입
        </button>
      </motion.div>

      {/* OTP Dialog — unchanged */}
      <LoginOtpDialog
        open={otpModalOpen}
        isBackupMode={isBackupMode}
        otpCode={otpCode}
        errors={errors}
        onOpenChange={closeOtpModal}
        onSwitchOtp={switchToOtpMode}
        onSwitchBackup={switchToBackupMode}
        onChangeCode={handleOtpChange}
        onConfirm={handleOtpConfirm}
        loading={otpLoading}
      />
    </div>
  );
}
