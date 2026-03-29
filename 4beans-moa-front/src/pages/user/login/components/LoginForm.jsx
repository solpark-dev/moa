import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function LoginForm({
  email,
  password,
  remember,
  errors,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  onUnlock,
  isLoginDisabled,
  loginLoading,
}) {
  const navigate = useNavigate();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {/* Email */}
      <div className="space-y-1.5">
        <Label
          htmlFor="loginEmail"
          className="text-[12px] font-semibold"
          style={{ color: "var(--theme-text-muted)" }}
        >
          이메일
        </Label>
        <Input
          id="loginEmail"
          placeholder="이메일 주소 입력"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="h-11 rounded-xl text-[14px] border-0 outline-none focus-visible:ring-1"
          style={{
            background: "var(--glass-bg-overlay)",
            border: "1px solid var(--glass-border)",
            color: "var(--theme-text)",
            "--tw-ring-color": "var(--theme-primary)",
          }}
        />
        {errors.email && (
          <p className="text-[11px] text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="loginPassword"
          className="text-[12px] font-semibold"
          style={{ color: "var(--theme-text-muted)" }}
        >
          비밀번호
        </Label>
        <Input
          id="loginPassword"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="h-11 rounded-xl text-[14px] border-0 outline-none focus-visible:ring-1"
          style={{
            background: "var(--glass-bg-overlay)",
            border: "1px solid var(--glass-border)",
            color: "var(--theme-text)",
            "--tw-ring-color": "var(--theme-primary)",
          }}
        />
        {errors.password && (
          <p className="text-[11px] text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Remember + links */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => onRememberChange(e.target.checked)}
            className="h-3.5 w-3.5 rounded"
            style={{ accentColor: "var(--theme-primary)" }}
          />
          <span className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
            로그인 정보 저장
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/find-email")}
            className="text-[11px] font-medium"
            style={{ color: "var(--theme-text-muted)" }}
          >
            이메일 찾기
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button
        id="btnLogin"
        type="submit"
        className="w-full h-11 text-[14px] font-bold rounded-xl text-white mt-2"
        style={{ background: "var(--theme-primary)" }}
        disabled={isLoginDisabled}
      >
        {loginLoading ? "로그인 중..." : "로그인"}
      </Button>

      {/* Unlock */}
      <button
        type="button"
        onClick={onUnlock}
        className="w-full text-[11px] text-center pt-1"
        style={{ color: "var(--theme-text-muted)" }}
      >
        잠금 계정 풀기
      </button>
    </form>
  );
}
