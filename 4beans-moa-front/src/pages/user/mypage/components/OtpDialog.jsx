import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const otpDialogThemeStyles = {
  pop: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    description: "text-slate-600",
    qrBorder: "bg-white border-slate-200",
    input: "bg-white border-gray-200 text-black",
    primaryButton: "bg-pink-500 hover:bg-pink-600",
    secondaryButton: "bg-white border-gray-200 text-black hover:bg-slate-50",
  },
  classic: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    description: "text-slate-600",
    qrBorder: "bg-white border-slate-200",
    input: "bg-white border-gray-200 text-black",
    primaryButton: "bg-[#635bff] hover:bg-[#5851e8]",
    secondaryButton: "bg-white border-gray-200 text-black hover:bg-slate-50",
  },
  dark: {
    content: "bg-[#1E293B] border border-gray-700",
    title: "text-gray-100",
    description: "text-gray-400",
    qrBorder: "bg-white border-gray-300",
    input: "bg-[#0F172A] border-gray-700 text-gray-100",
    primaryButton: "bg-[#635bff] hover:bg-[#5851e8]",
    secondaryButton: "bg-[#0F172A] border-gray-700 text-gray-200 hover:bg-gray-800",
  },
  christmas: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    description: "text-slate-600",
    qrBorder: "bg-white border-slate-200",
    input: "bg-white border-gray-200 text-black",
    primaryButton: "bg-[#c41e3a] hover:bg-red-700",
    secondaryButton: "bg-white border-gray-200 text-black hover:bg-red-50",
  },
};

export function OtpDialog({
  open,
  onOpenChange,
  otp,
  actions,
  handleOtpConfirm,
}) {
  const { theme } = useThemeStore();
  const themeStyle = otpDialogThemeStyles[theme] || otpDialogThemeStyles.pop;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-md ${themeStyle.content}`}>
        <DialogHeader>
          <DialogTitle className={themeStyle.title}>
            {otp.mode === "disable" ? "Google OTP 해제" : "Google OTP 설정"}
          </DialogTitle>
          <DialogDescription className={`mt-2 text-sm leading-relaxed ${themeStyle.description}`}>
            {otp.mode === "disable"
              ? "등록된 Google OTP를 해제하려면 아래에 인증용 6자리 코드를 입력해주세요."
              : "Google Authenticator 앱을 켜고 QR 코드를 스캔한 뒤 인증용 6자리 코드를 입력해주세요."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          {otp.mode === "enable" && otp.qrUrl && (
            <div className="flex justify-center">
              <div className={`p-3 border rounded-2xl ${themeStyle.qrBorder}`}>
                <QRCodeSVG value={otp.qrUrl} size={180} />
              </div>
            </div>
          )}
          <Input
            type="text"
            value={otp.code}
            maxLength={6}
            inputMode="numeric"
            className={`text-center tracking-[0.4em] text-lg rounded-xl ${themeStyle.input}`}
            onChange={(e) => actions.otp.changeCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOtpConfirm();
              }
            }}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={actions.otp.closeModal}
              className={`rounded-xl ${themeStyle.secondaryButton}`}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleOtpConfirm}
              disabled={otp.loading || otp.code.length !== 6}
              className={`${themeStyle.primaryButton} text-white rounded-xl`}
            >
              인증 완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
