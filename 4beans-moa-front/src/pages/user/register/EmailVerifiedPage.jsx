import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

export default function EmailVerifiedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const result = searchParams.get("result");
  const message = searchParams.get("message");

  const status =
    result === "success" ? "success" : result === "fail" ? "error" : "error";

  const decodedMessage = useMemo(() => {
    if (!message) return "";
    try {
      return decodeURIComponent(message);
    } catch {
      return message;
    }
  }, [message]);

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
              {status === "success" && "이메일 인증 성공 🎉"}
              {status === "error" && "인증 실패 ⚠️"}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            {status === "success" && (
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

            {status === "error" && (
              <>
                <p className="text-red-500">
                  {decodedMessage ? (
                    decodedMessage
                  ) : (
                    <>
                      유효하지 않거나 만료된 인증 링크입니다.
                      <br />
                      다시 시도하거나 관리자에게 문의하세요.
                    </>
                  )}
                </p>
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
