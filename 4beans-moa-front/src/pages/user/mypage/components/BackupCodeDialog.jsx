import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const backupCodeThemeStyles = {
  pop: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    description: "text-slate-600",
    codeBg: "bg-slate-50 border-slate-200",
    codeText: "text-slate-800",
    codeIndex: "text-slate-400",
    emptyText: "text-slate-400",
    primaryButton: "bg-pink-500 hover:bg-pink-600",
    secondaryButton: "bg-white border-gray-200 text-black hover:bg-slate-50",
  },
  classic: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    description: "text-slate-600",
    codeBg: "bg-slate-50 border-slate-200",
    codeText: "text-slate-800",
    codeIndex: "text-slate-400",
    emptyText: "text-slate-400",
    primaryButton: "bg-[#635bff] hover:bg-[#5851e8]",
    secondaryButton: "bg-white border-gray-200 text-black hover:bg-slate-50",
  },
  dark: {
    content: "bg-[#1E293B] border border-gray-700",
    title: "text-gray-100",
    description: "text-gray-400",
    codeBg: "bg-[#0F172A] border-gray-700",
    codeText: "text-gray-200",
    codeIndex: "text-gray-500",
    emptyText: "text-gray-500",
    primaryButton: "bg-[#635bff] hover:bg-[#5851e8]",
    secondaryButton: "bg-[#0F172A] border-gray-700 text-gray-200 hover:bg-gray-800",
  },
  christmas: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    description: "text-slate-600",
    codeBg: "bg-slate-50 border-slate-200",
    codeText: "text-slate-800",
    codeIndex: "text-slate-400",
    emptyText: "text-slate-400",
    primaryButton: "bg-[#c41e3a] hover:bg-red-700",
    secondaryButton: "bg-white border-gray-200 text-black hover:bg-red-50",
  },
};

export function BackupCodeDialog({ backup }) {
  const { theme } = useThemeStore();
  const themeStyle = backupCodeThemeStyles[theme] || backupCodeThemeStyles.pop;
  return (
    <Dialog
      open={backup.open}
      onOpenChange={(open) => {
        if (!open) backup.close();
      }}
    >
      <DialogContent className={`max-w-md ${themeStyle.content}`}>
        <DialogHeader>
          <DialogTitle className={themeStyle.title}>Google OTP 백업 코드</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className={`text-sm leading-relaxed ${themeStyle.description}`}>
            OTP 기기를 분실했을 때만 사용할 일회용 로그인 코드입니다. 잃어버리지
            않도록 안전한 곳에 보관해주세요.
          </p>

          <div className={`border rounded-xl p-3 max-h-64 overflow-y-auto space-y-1 ${themeStyle.codeBg}`}>
            {backup.codes.length > 0 ? (
              backup.codes.map((code, index) => (
                <div
                  key={`${code}-${index}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span className={`font-mono tracking-widest ${themeStyle.codeText}`}>
                    {code}
                  </span>
                  <span className={`text-xs ${themeStyle.codeIndex}`}>
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))
            ) : (
              <div className={`py-6 text-center text-sm ${themeStyle.emptyText}`}>
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
              className={`rounded-xl ${themeStyle.secondaryButton}`}
            >
              전체 복사
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={backup.downloadTxt}
                disabled={!backup.codes.length}
                className={`rounded-xl ${themeStyle.secondaryButton}`}
              >
                TXT 저장
              </Button>
              <Button
                type="button"
                className={`${themeStyle.primaryButton} text-white rounded-xl`}
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
