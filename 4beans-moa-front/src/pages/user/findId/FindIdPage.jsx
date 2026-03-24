import { useFindIdStore } from "@/store/user/findIdStore";
import { useFindIdLogic } from "@/hooks/auth/useFindId";
import { FindIdForm } from "./components/FindIdForm";
import { FindIdResult } from "./components/FindIdResult";
import { PageTitle } from "../shared/PageTitle";
import { PageSteps } from "../shared/PageSteps";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

export default function FindIdPage() {
  const { step, foundEmail, isLoading } = useFindIdStore();
  const { handlePassAuth } = useFindIdLogic();
  const { theme, setTheme } = useThemeStore();

  const steps = [
    { number: 1, label: "본인 인증", active: step === 1 },
    { number: 2, label: "이메일 확인", active: step === 2 },
  ];

  return (
    <div className={`min-h-screen ${themeClasses.bg.base} ${themeClasses.text.primary} transition-colors duration-300`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      <div className="flex flex-col items-center pt-28 pb-20">
        <PageTitle
          title={theme === 'christmas' ? '🎄 아이디 찾기' : '아이디 찾기'}
          subtitle="가입 시 등록한 휴대폰 번호로 본인 인증 후 이메일을 확인하세요."
        />

        <div className={`w-full max-w-xl ${themeClasses.card.elevated} rounded-2xl p-10 space-y-8`}>
          <PageSteps steps={steps} />

          {step === 1 && <FindIdForm onPassAuth={handlePassAuth} isLoading={isLoading} />}
          {step === 2 && <FindIdResult email={foundEmail} />}

          <p className={`text-xs ${themeClasses.text.muted} text-center`}>
            명의자 정보가 다르면 아이디 찾기가 제한될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
