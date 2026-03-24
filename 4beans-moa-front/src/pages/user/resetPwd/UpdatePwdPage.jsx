// src/pages/user/UpdatePwdPage.jsx

import { useEffect } from "react";
import { useUpdatePwdStore } from "@/store/user/updatePwdStore";
import { useUpdatePwdLogic } from "@/hooks/user/useUpdatePassword";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export default function UpdatePwdPage() {
  const { currentPassword, newPassword, newPasswordConfirm, modalOpen, stepVerified, error, setModal, resetAll, openModal } =
    useUpdatePwdStore();
  const { verify, update, handleChange, loading } = useUpdatePwdLogic();
  const { theme, setTheme } = useThemeStore();

  const isVerifyDisabled = loading || !currentPassword.trim();
  const isUpdateDisabled =
    loading || !newPassword.trim() || !newPasswordConfirm.trim();

  const closeAndExit = () => {
    resetAll();
    window.history.back();
  };

  useEffect(() => {
    openModal();
    return () => resetAll();
  }, [openModal, resetAll]);

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key !== "Enter") return;

      if (!stepVerified) {
        verify();
      } else {
        update();
      }
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [stepVerified, update, verify]);

  const handleDialogChange = (open) => {
    if (open) {
      openModal();
      return;
    }

    if (stepVerified) {
      setModal(false);
      return;
    }

    closeAndExit();
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg.base} ${themeClasses.text.primary} transition-colors duration-300`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-16">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          <div className={`${themeClasses.card.elevated} p-8 space-y-4`}>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1 rounded-xl border border-[var(--theme-border-light)] bg-[var(--theme-bg-secondary)] text-xs font-black tracking-wide`}>
                MoA 계정 보안 · 비밀번호 재설정
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-black leading-tight flex items-center gap-3 ${themeClasses.text.primary}`}>
              <KeyRound className={`w-7 h-7 text-[var(--theme-primary)]`} />
              {theme === 'christmas' ? '🎄 비밀번호 변경' : '비밀번호 변경'}
            </h2>
            <p className={`text-sm sm:text-base ${themeClasses.text.muted} leading-relaxed`}>
              안전하게 사용하려면 현재 비밀번호를 확인하고 새 비밀번호를 설정해 주세요.
            </p>
          </div>

          <div className={`${themeClasses.card.elevated} p-8 space-y-6`}>
            <div className={`flex items-center justify-between text-xs font-semibold border border-[var(--theme-border-light)] bg-[var(--theme-bg-secondary)] rounded-2xl px-4 py-3 shadow-[var(--theme-shadow-soft)]`}>
              <span className="flex items-center gap-2">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--theme-primary)] text-white font-bold`}>
                  1
                </span>
                현재 비밀번호 확인
              </span>
              <span
                className={`text-xs font-black ${stepVerified ? "text-emerald-600" : themeClasses.text.muted
                  }`}
              >
                {stepVerified ? "완료" : "진행 중"}
              </span>
            </div>

            {!stepVerified && (
              <div className={`bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-light)] rounded-2xl p-6 text-center text-sm ${themeClasses.text.muted} shadow-[var(--theme-shadow-soft)]`}>
                먼저 입력란에 현재 비밀번호를 입력해 본인 인증을 해주세요.
                <br className="hidden sm:block" />
                인증이 끝나면 새 비밀번호를 변경할 수 있습니다.
              </div>
            )}

            {stepVerified && (
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  update();
                }}
              >
                <div className={`bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-light)] rounded-2xl p-6 space-y-4 shadow-[var(--theme-shadow-soft)]`}>
                  <div className="space-y-1.5">
                    <Label className={`text-sm ${themeClasses.text.primary}`}>새 비밀번호</Label>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) =>
                        handleChange("newPassword", e.target.value)
                      }
                      className={`${themeClasses.input.base} mt-1`}
                      placeholder="영문·숫자·특수문자 조합 8~20자"
                    />
                    {error.rule && (
                      <p className="text-red-500 text-xs mt-1">{error.rule}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className={`text-sm ${themeClasses.text.primary}`}>
                      새 비밀번호 확인
                    </Label>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      value={newPasswordConfirm}
                      onChange={(e) =>
                        handleChange("newPasswordConfirm", e.target.value)
                      }
                      className={`${themeClasses.input.base} mt-1`}
                      placeholder="같은 비밀번호를 입력해 주세요"
                    />
                    {error.confirm && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.confirm}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  className={`w-full ${themeClasses.button.primary} rounded-2xl font-black h-11`}
                  type="submit"
                  disabled={isUpdateDisabled}
                >
                  비밀번호 변경
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className={`max-w-sm ${themeClasses.modal.content}`}>
          <DialogHeader>
            <DialogTitle className={`${themeClasses.text.primary} flex items-center gap-2`}>
              <KeyRound className={`w-5 h-5 text-[var(--theme-primary)]`} />
              현재 비밀번호 확인
            </DialogTitle>
            <DialogDescription className={`${themeClasses.text.muted} text-sm`}>
              본인 인증을 위해 현재 비밀번호를 입력해 주세요.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-3 mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              verify();
            }}
          >
            <Label className={`text-xs ${themeClasses.text.muted}`}>현재 비밀번호</Label>
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              className={themeClasses.input.base}
            />
            {error.current && (
              <p className="text-red-500 text-xs">{error.current}</p>
            )}

            <Button
              className={`w-full ${themeClasses.button.primary} rounded-2xl font-black h-11`}
              type="submit"
              disabled={isVerifyDisabled}
            >
              확인
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
