import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Theme-based styles
const getDialogStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        container: "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(196,30,58,0.15)]",
        title: "text-[#c41e3a]",
        desc: "text-gray-600",
        tabActive: "bg-white text-[#c41e3a] border-[#c41e3a]",
        tabInactive: "text-gray-500 border-gray-200",
        input: "border border-gray-200 shadow-[4px_4px_12px_rgba(196,30,58,0.08)]",
        button: "bg-[#c41e3a] hover:bg-[#a51830]",
      };
    case 'dark':
      return {
        container: "bg-[#1E293B] border border-gray-700 shadow-[4px_4px_12px_rgba(0,0,0,0.3)]",
        title: "text-white",
        desc: "text-gray-400",
        tabActive: "bg-[#0F172A] text-white border-[#635bff]",
        tabInactive: "text-gray-500 border-gray-700",
        input: "border border-gray-700 bg-[#0F172A] text-white shadow-[4px_4px_12px_rgba(0,0,0,0.2)]",
        button: "bg-[#635bff] hover:bg-[#5851e8]",
      };
    case 'pop':
      return {
        container: "bg-white border border-gray-200 shadow-[0_4px_12px_rgba(236,72,153,0.1)]",
        title: "text-black",
        desc: "text-gray-600",
        tabActive: "bg-pink-500 text-white border-pink-500",
        tabInactive: "text-gray-500 border-gray-200",
        input: "border border-gray-200 shadow-[0_4px_12px_rgba(236,72,153,0.08)]",
        button: "bg-pink-500 hover:bg-pink-600 border border-gray-200",
      };
    case 'classic':
      return {
        container: "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(99,91,255,0.1)]",
        title: "text-[#635bff]",
        desc: "text-gray-500",
        tabActive: "bg-white text-[#635bff] border-[#635bff]",
        tabInactive: "text-gray-500 border-gray-200",
        input: "border border-gray-200 shadow-[4px_4px_12px_rgba(99,91,255,0.08)]",
        button: "bg-[#635bff] hover:bg-[#5851e8]",
      };
    default:
      return {
        container: "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
        title: "text-slate-900",
        desc: "text-slate-500",
        tabActive: "bg-white text-slate-900 border-indigo-600",
        tabInactive: "text-slate-500 border-gray-200",
        input: "border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
        button: "bg-indigo-600 hover:bg-indigo-700",
      };
  }
};

export function LoginOtpDialog({
  open,
  isBackupMode,
  otpCode,
  errors,
  onOpenChange,
  onSwitchOtp,
  onSwitchBackup,
  onChangeCode,
  onConfirm,
  loading,
  theme = 'default',
}) {
  const styles = getDialogStyles(theme);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onOpenChange();
      }}
    >
      <DialogContent className="max-w-sm p-0">
        <div className={`rounded-[28px] ${styles.container}`}>
          <DialogHeader className="px-8 pt-8 pb-2">
            <DialogTitle className={`text-lg font-black ${styles.title}`}>
              {isBackupMode
                ? "백업 코드로 인증을 진행해주세요"
                : "Google OTP 인증"}
            </DialogTitle>
            <DialogDescription className={`text-sm ${styles.desc}`}>
              보안을 위해 추가 인증이 필요합니다. 인증 코드 또는 백업 코드를
              사용해 본인 인증을 완료해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center gap-3 px-6 pb-4">
            <button
              type="button"
              onClick={onSwitchOtp}
              className={`flex-1 py-2 rounded-2xl border font-black text-[11px] uppercase tracking-[0.3em] ${isBackupMode ? styles.tabInactive : styles.tabActive
                }`}
            >
              OTP 코드
            </button>
            <button
              type="button"
              onClick={onSwitchBackup}
              className={`flex-1 py-2 rounded-2xl border font-black text-[11px] uppercase tracking-[0.3em] ${isBackupMode ? styles.tabActive : styles.tabInactive
                }`}
            >
              백업 코드
            </button>
          </div>

          <div className="space-y-4 px-8 pb-6">
            <p className={`text-sm text-center ${styles.desc}`}>
              {isBackupMode
                ? "OTP 앱을 사용할 수 없는 경우 백업 코드를 입력해주세요."
                : "Google Authenticator 앱에 표시된 6자리 코드를 입력해주세요."}
            </p>

            <Input
              value={otpCode}
              maxLength={isBackupMode ? 16 : 6}
              inputMode={isBackupMode ? "text" : "numeric"}
              placeholder={
                isBackupMode
                  ? "백업 코드 입력 (예: X7K9-AB12)"
                  : "6자리 인증 코드 입력"
              }
              className={`text-center tracking-[0.4em] text-lg rounded-2xl ${styles.input}`}
              onChange={(e) => onChangeCode(e.target.value)}
            />

            {errors.otp && (
              <p className="text-xs text-red-500 text-center">{errors.otp}</p>
            )}

            <Button
              className={`w-full h-12 text-white font-black rounded-2xl ${styles.button}`}
              onClick={onConfirm}
              disabled={loading || !otpCode.trim()}
            >
              {loading ? "인증 중..." : "인증 완료"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
