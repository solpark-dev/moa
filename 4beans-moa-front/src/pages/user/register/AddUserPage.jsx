import { useSignup } from "@/hooks/auth/useSignup";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

/* LandingPageO3 스타일 컴포넌트 재사용 - 테마 적용 */
function Sticker({ children, rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: rotate + 3 }}
      className={`
        bg-[var(--theme-bg-card)]
        border border-[var(--theme-border-light)]
        shadow-[var(--theme-shadow)]
        rounded-2xl
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

export default function AddUserPage({ socialInfo }) {
  const isSocialSignup = !!socialInfo;
  const socialEmail = socialInfo?.email;
  const shouldShowEmailInput = !isSocialSignup || !socialEmail;
  const shouldShowPasswordInputs = !isSocialSignup;

  // Theme
  const { theme, setTheme } = useThemeStore();

  const {
    form,
    errors,
    handleChange,
    handleBlur,
    handleImageChange,
    handlePassAuth,
    handleSubmit,
  } = useSignup({
    mode: isSocialSignup ? "social" : "normal",
    socialInfo,
  });

  return (
    <div className={`min-h-screen bg-transparent ${themeClasses.text.primary} px-6 py-16 transition-colors duration-300`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* 좌측 설명 영역 */}
        <div>
          <Sticker rotate={-2} className="inline-block px-5 py-2 mb-6">
            <span className="font-black text-lg">
              MoA 회원가입 ✨
            </span>
          </Sticker>

          <h1 className={`text-5xl font-black leading-tight mb-6 ${themeClasses.text.primary}`}>
            구독을<br />
            <span className="text-[var(--theme-primary)]">함께</span> 시작해요
          </h1>

          <p className={`text-lg ${themeClasses.text.muted} font-medium mb-10`}>
            혼자 쓰기 비싼 OTT 구독,<br />
            이제 MoA에서 친구들과 나눠보세요.
          </p>

          {isSocialSignup && (
            <Sticker rotate={1} className="px-4 py-3 bg-amber-100 border-amber-200">
              <span className="font-bold text-amber-900">
                카카오 계정으로 간편가입 진행 중입니다
              </span>
            </Sticker>
          )}
        </div>

        {/* 우측 폼 영역 */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`${themeClasses.card.elevated} rounded-3xl`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-black ${themeClasses.text.primary}`}>
                기본 정보 입력
              </CardTitle>
              <CardDescription className={themeClasses.text.muted}>
                필수 정보만 입력하면 바로 시작할 수 있어요
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 이메일 */}
              {isSocialSignup && socialEmail && (
                <div>
                  <Label className={themeClasses.text.primary}>이메일 아이디</Label>
                  <Input
                    value={socialEmail}
                    readOnly
                    className={`bg-[var(--theme-bg-secondary)] border-[var(--theme-border-light)] ${themeClasses.text.muted}`}
                  />
                </div>
              )}

              {shouldShowEmailInput && (
                <div>
                  <Label className={themeClasses.text.primary}>이메일 아이디</Label>
                  <Input
                    name="email"
                    placeholder="예: moa@email.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`border-[var(--theme-border-light)] bg-[var(--theme-bg)] focus:border-[var(--theme-primary)]`}
                  />
                  <p className={`text-xs mt-1 ${errors.email.isError ? "text-red-500" : "text-green-600"}`}>
                    {errors.email.message}
                  </p>
                </div>
              )}

              {/* 비밀번호 (일반 가입만) */}
              {shouldShowPasswordInputs && (
                <>
                  <div>
                    <Label className={themeClasses.text.primary}>비밀번호</Label>
                    <Input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={`border-[var(--theme-border-light)] bg-[var(--theme-bg)] focus:border-[var(--theme-primary)]`}
                    />
                    <p className={`text-xs mt-1 ${errors.password.isError ? "text-red-500" : "text-green-600"}`}>
                      {errors.password.message}
                    </p>
                  </div>

                  <div>
                    <Label className={themeClasses.text.primary}>비밀번호 확인</Label>
                    <Input
                      type="password"
                      name="passwordCheck"
                      value={form.passwordCheck}
                      onChange={handleChange}
                      className={`border-[var(--theme-border-light)] bg-[var(--theme-bg)] focus:border-[var(--theme-primary)]`}
                    />
                    <p className={`text-xs mt-1 ${errors.passwordCheck.isError ? "text-red-500" : "text-green-600"}`}>
                      {errors.passwordCheck.message}
                    </p>
                  </div>
                </>
              )}

              {/* 닉네임 */}
              <div>
                <Label className={themeClasses.text.primary}>닉네임</Label>
                <Input
                  name="nickname"
                  placeholder="2~10자 영문/숫자/한글"
                  value={form.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`border-[var(--theme-border-light)] bg-[var(--theme-bg)] focus:border-[var(--theme-primary)]`}
                />
                <p className={`text-xs mt-1 ${errors.nickname.isError ? "text-red-500" : "text-green-600"}`}>
                  {errors.nickname.message}
                </p>
              </div>

              {/* 휴대폰 */}
              <div>
                <Label className={themeClasses.text.primary}>휴대폰번호</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={form.phone}
                    placeholder="본인인증 후 자동 입력"
                    className={`flex-1 bg-[var(--theme-bg-secondary)] border-[var(--theme-border-light)] ${themeClasses.text.muted}`}
                  />
                  <Button type="button" onClick={handlePassAuth} className={`${themeClasses.button.primary}`}>
                    본인인증
                  </Button>
                </div>
                <p className={`text-xs mt-1 ${errors.phone.isError ? "text-red-500" : "text-green-600"}`}>
                  {errors.phone.message}
                </p>
              </div>

              {/* 프로필 이미지 */}
              <div>
                <Label className={themeClasses.text.primary}>프로필 이미지</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} className={`border-[var(--theme-border-light)] bg-[var(--theme-bg)]`} />
              </div>

              {/* 마케팅 */}
              <div className="flex gap-2 items-start">
                <input
                  type="checkbox"
                  name="agreeMarketing"
                  checked={form.agreeMarketing}
                  onChange={handleChange}
                  className="mt-1"
                />
                <span className={`text-sm ${themeClasses.text.muted}`}>
                  마케팅 정보 수신 동의 (선택)
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className={`w-full text-lg font-black ${themeClasses.button.primary}`}>
                {isSocialSignup ? "간편가입 완료하기" : "회원가입 완료하기"}
              </Button>
            </CardFooter>
          </Card>
        </motion.form>
      </div>
    </div>
  );
}
