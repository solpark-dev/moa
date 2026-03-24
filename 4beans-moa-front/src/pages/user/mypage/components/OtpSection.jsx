import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const otpThemeStyles = {
  pop: {
    buttonBg: "bg-indigo-600",
    buttonText: "text-indigo-700",
    buttonHover: "hover:bg-indigo-50",
  },
  christmas: {
    buttonBg: "bg-[#c41e3a]",
    buttonText: "text-[#c41e3a]",
    buttonHover: "hover:bg-red-50",
  },
};

export function OtpSection({ otp, backup, actions }) {
  const { theme } = useThemeStore();
  const themeStyle = otpThemeStyles[theme] || otpThemeStyles.pop;
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
        보안 설정
      </p>

      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-bold ${otp.enabled ? "text-emerald-600" : "text-slate-400"
            }`}
        >
          {otp.enabled ? "OTP 사용중" : "OTP 미사용"}
        </span>

        <div className="flex gap-1.5">
          {!otp.enabled && (
            <Button
              type="button"
              onClick={actions.otp.openSetup}
              className={`
                h-7 px-3 text-[11px] font-black
                ${themeStyle.buttonBg} text-white
                border border-gray-200 rounded-lg
                shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
                hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
              `}
            >
              OTP 설정
            </Button>
          )}

          {otp.enabled && (
            <>
              <Button
                type="button"
                disabled={backup.issued || backup.loading}
                onClick={backup.issued ? undefined : backup.issueBackupCodes}
                className={`
                  h-7 px-3 text-[11px] font-black
                  border border-gray-200 rounded-lg
                  ${backup.issued
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : `bg-white ${themeStyle.buttonText} ${themeStyle.buttonHover}`
                  }
                `}
              >
                {backup.issued ? "발급완료" : "백업코드"}
              </Button>

              <Button
                type="button"
                onClick={actions.otp.prepareDisable}
                className="
                  h-7 px-3 text-[11px] font-black
                  border border-gray-200 rounded-lg
                  bg-white text-red-600 hover:bg-red-50
                "
              >
                해제
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
