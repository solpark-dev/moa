import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

export function OtpDialog({ open, onOpenChange, otp, actions, handleOtpConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md rounded-2xl"
        style={{
          background: "var(--glass-bg-card)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "var(--theme-text)" }}>
            {otp.mode === "disable" ? "Google OTP 해제" : "Google OTP 설정"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>
            {otp.mode === "disable"
              ? "등록된 Google OTP를 해제하려면 아래에 인증용 6자리 코드를 입력해주세요."
              : "Google Authenticator 앱을 켜고 QR 코드를 스캔한 뒤 인증용 6자리 코드를 입력해주세요."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {otp.mode === "enable" && otp.qrUrl && (
            <div className="flex justify-center">
              <div
                className="p-3 rounded-2xl"
                style={{
                  background: "#fff",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <QRCodeSVG value={otp.qrUrl} size={180} />
              </div>
            </div>
          )}

          <Input
            type="text"
            value={otp.code}
            maxLength={6}
            inputMode="numeric"
            className="text-center tracking-[0.4em] text-lg rounded-xl"
            style={{
              background: "var(--glass-bg-overlay)",
              border: "1px solid var(--glass-border)",
              color: "var(--theme-text)",
            }}
            onChange={(e) => actions.otp.changeCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleOtpConfirm(); }}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={actions.otp.closeModal}
              className="rounded-xl"
              style={{
                background: "var(--glass-bg-overlay)",
                border: "1px solid var(--glass-border)",
                color: "var(--theme-text)",
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleOtpConfirm}
              disabled={otp.loading || otp.code.length !== 6}
              className="text-white rounded-xl"
              style={{ background: "var(--theme-primary)" }}
            >
              인증 완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
