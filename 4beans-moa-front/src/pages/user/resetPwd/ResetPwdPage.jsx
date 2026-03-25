// src/pages/user/ResetPwdPage.jsx
import { useEffect } from "react";
import { initResetPwdPage } from "@/hooks/auth/useResetPassword";
import { ResetPwdGuide } from "./components/ResetPwdGuide";
import { ResetPwdForm } from "./components/ResetPwdForm";
import { PageTitle } from "../shared/PageTitle";
import { PageSteps } from "../shared/PageSteps";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

export default function ResetPwdPage() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    initResetPwdPage();
  }, []);

  const steps = [
    { number: 1, label: "본인 인증", active: true },
    { number: 2, label: "새 비밀번호 설정", active: false },
  ];

  return (
    <div className={`min-h-screen ${themeClasses.bg.base} ${themeClasses.text.primary} transition-colors duration-300`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-20 space-y-8">
        <div className="text-center">
          <PageTitle
            title="비밀번호 재설정"
            subtitle="PASS 본인 인증 후 새 비밀번호를 설정해 주세요"
          />
        </div>

        <div className={`p-10 space-y-8 ${themeClasses.card.elevated} rounded-3xl`}>
          <PageSteps steps={steps} />

          <div className="grid md:grid-cols-2 gap-6">
            <ResetPwdGuide />
            <ResetPwdForm />
          </div>

          <p className={`text-xs ${themeClasses.text.muted} text-center`}>
            본인 확인이 완료된 경우 비밀번호 재설정이 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
