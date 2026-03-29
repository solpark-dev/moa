import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";
import httpClient from "@/api/httpClient";

export default function EmailVerifiedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const result = searchParams.get("result");
  const message = searchParams.get("message");

  const isSuccess = result === "success";

  const decodedMessage = useMemo(() => {
    if (!message) return "";
    try {
      return decodeURIComponent(message);
    } catch {
      return message;
    }
  }, [message]);

  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);

  const handleResend = async () => {
    if (!resendEmail.trim()) return alert("이메일을 입력해 주세요.");
    setResendLoading(true);
    try {
      const res = await httpClient.post(
        "/auth/resend-verification",
        { email: resendEmail },
        { skipAuth: true }
      );
      if (res?.success) {
        setResendStatus("sent");
      } else {
        setResendStatus(res?.error?.message || "재발송에 실패했습니다.");
      }
    } catch (err) {
      setResendStatus(
        err?.response?.data?.error?.message || "재발송에 실패했습니다."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const { theme, setTheme } = useThemeStore();

  return (
    <div className={`min-h-screen ${themeClasses.bg.base}`}>
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      <div className="flex justify-center items-center min-h-screen">
        <Card className={`w-[400px] rounded-2xl ${themeClasses.card.elevated}`}>
          <CardHeader>
            <CardTitle
              className={`text-center text-xl font-bold ${themeClasses.text.primary}`}
            >
              {isSuccess ? "이메일 인증 성공" : "인증 실패"}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            {isSuccess && (
              <>
                <p className={themeClasses.text.muted}>
                  회원가입이 성공적으로 완료되었습니다.
                  <br />
                  이제 로그인하여 서비스를 이용하실 수 있습니다.
                </p>
                <Button
                  onClick={() => navigate("/login")}
                  className={`w-full text-white ${themeClasses.button.primary}`}
                >
                  로그인 페이지로 이동
                </Button>
              </>
            )}

            {!isSuccess && (
              <>
                <p className="text-red-500">
                  {decodedMessage || "유효하지 않거나 만료된 인증 링크입니다."}
                </p>

                {resendStatus === "sent" ? (
                  <p className="text-emerald-500 text-sm">
                    인증 메일이 재발송되었습니다. 이메일을 확인해 주세요.
                  </p>
                ) : (
                  <div className="space-y-2 text-left">
                    <p className={`text-sm ${themeClasses.text.muted}`}>
                      인증 메일을 다시 받으려면 이메일을 입력해 주세요.
                    </p>
                    <Input
                      type="email"
                      placeholder="가입한 이메일 주소"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="h-10 rounded-xl text-sm"
                    />
                    {resendStatus && resendStatus !== "sent" && (
                      <p className="text-red-500 text-xs">{resendStatus}</p>
                    )}
                    <Button
                      onClick={handleResend}
                      disabled={resendLoading}
                      className={`w-full text-white ${themeClasses.button.primary}`}
                    >
                      {resendLoading ? "발송 중..." : "인증 메일 재발송"}
                    </Button>
                  </div>
                )}

                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className={`w-full ${themeClasses.button.secondary}`}
                >
                  메인으로 돌아가기
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
