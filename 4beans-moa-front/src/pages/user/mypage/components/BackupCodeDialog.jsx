import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BackupCodeDialog({ backup }) {
  return (
    <Dialog open={backup.open} onOpenChange={(open) => { if (!open) backup.close(); }}>
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
            Google OTP 백업 코드
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>
            OTP 기기를 분실했을 때만 사용할 일회용 로그인 코드입니다. 잃어버리지
            않도록 안전한 곳에 보관해주세요.
          </p>

          <div
            className="rounded-xl p-3 max-h-64 overflow-y-auto space-y-1"
            style={{
              background: "var(--glass-bg-overlay)",
              border: "1px solid var(--glass-border)",
            }}
          >
            {backup.codes.length > 0 ? (
              backup.codes.map((code, index) => (
                <div key={`${code}-${index}`} className="flex items-center justify-between text-sm">
                  <span className="font-mono tracking-widest" style={{ color: "var(--theme-text)" }}>
                    {code}
                  </span>
                  <span className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm" style={{ color: "var(--theme-text-muted)" }}>
                아직 발급된 백업 코드가 없습니다.
              </div>
            )}
          </div>

          <div className="flex justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={backup.copyAll}
              disabled={!backup.codes.length}
              className="rounded-xl"
              style={{
                background: "var(--glass-bg-overlay)",
                border: "1px solid var(--glass-border)",
                color: "var(--theme-text)",
              }}
            >
              전체 복사
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={backup.downloadTxt}
                disabled={!backup.codes.length}
                className="rounded-xl"
                style={{
                  background: "var(--glass-bg-overlay)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--theme-text)",
                }}
              >
                TXT 저장
              </Button>
              <Button
                type="button"
                className="text-white rounded-xl"
                style={{ background: "var(--theme-primary)" }}
                onClick={backup.close}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
