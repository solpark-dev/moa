import { useEffect } from "react";
import { useLoginPageLogic } from "@/hooks/auth/useLogin";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LoginForm } from "./components/LoginForm";
import { SocialLoginButtons } from "./components/SocialLoginButtons";
import { LoginOtpDialog } from "./components/LoginOtpDialog";
import { useThemeStore } from "@/store/themeStore";
import { themeClasses } from "@/utils/themeUtils";

export default function LoginPage() {
  const {
    email,
    password,
    remember,
    otpModalOpen,
    otpCode,
    otpMode,
    setField,
    handleEmailLogin,
    handleKakaoLogin,
    handleGoogleLogin,
    handleOtpChange,
    handleOtpConfirm,
    closeOtpModal,
    handleUnlockByCertification,
    switchToOtpMode,
    switchToBackupMode,
    loginLoading,
    otpLoading,
    errors,
    handleEmailChange,
    handlePasswordChange,
  } = useLoginPageLogic();

  // Theme
  const { theme } = useThemeStore();

  const isBackupMode = otpMode === "backup";
  const isLoginDisabled = loginLoading || !email.trim() || !password.trim();

  useEffect(() => {
    setField("password", "");
  }, [setField]);

  return (
    <div className={`min-h-screen bg-transparent pb-20 relative z-10`}>
      <section className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <Card className={`${themeClasses.card.elevated} overflow-hidden`}>
            <CardHeader className={`px-6 sm:px-10 pt-8 sm:pt-10 pb-4 border-b border-[var(--theme-border-light)]`}>
              <CardTitle className={`text-xl sm:text-2xl font-black tracking-tight text-[var(--theme-primary)] text-center`}>
                {theme === 'christmas' ? '🎄 로그인' : '로그인'}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 sm:px-10 pt-5 sm:pt-6 pb-5 sm:pb-6 space-y-5 sm:space-y-6">
              <LoginForm
                email={email}
                password={password}
                remember={remember}
                errors={errors}
                onEmailChange={handleEmailChange}
                onPasswordChange={handlePasswordChange}
                onRememberChange={(v) => setField("remember", v)}
                onSubmit={handleEmailLogin}
                onUnlock={handleUnlockByCertification}
                isLoginDisabled={isLoginDisabled}
                loginLoading={loginLoading}
                theme={theme}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-6 sm:px-10 pb-8 sm:pb-10 pt-0">
              <SocialLoginButtons
                onKakao={handleKakaoLogin}
                onGoogle={handleGoogleLogin}
                loginLoading={loginLoading}
                theme={theme}
              />
            </CardFooter>
          </Card>
        </div>
      </section>

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
        theme={theme}
      />
    </div>
  );
}
