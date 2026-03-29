import { useSignup } from "@/hooks/auth/useSignup";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const inputStyle = {
  background: "var(--glass-bg-overlay)",
  border: "1px solid var(--glass-border)",
  color: "var(--theme-text)",
};

function FieldMessage({ message, isError }) {
  if (!message) return null;
  return (
    <p className={`text-[11px] mt-1 ${isError ? "text-red-500" : "text-emerald-500"}`}>
      {message}
    </p>
  );
}

export default function AddUserPage({ socialInfo }) {
  const isSocialSignup = !!socialInfo;
  const socialEmail = socialInfo?.email;
  const shouldShowEmailInput = !isSocialSignup || !socialEmail;
  const shouldShowPasswordInputs = !isSocialSignup;

  const {
    form,
    errors,
    handleChange,
    handleBlur,
    handleImageChange,
    handleSubmit,
  } = useSignup({
    mode: isSocialSignup ? "social" : "normal",
    socialInfo,
  });

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--theme-bg)" }}
    >
      {/* Orb blobs */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "var(--orb-1)", opacity: 0.2, filter: "blur(80px)" }}
      />
      <div
        className="absolute bottom-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "var(--orb-2)", opacity: 0.16, filter: "blur(80px)" }}
      />

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center pt-12 pb-6"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5"
          style={{ background: "var(--theme-primary)" }}
        >
          <span className="text-white text-xl font-black">M</span>
        </div>
        <h1 className="text-[20px] font-bold" style={{ color: "var(--theme-primary)" }}>
          MOA
        </h1>
        {isSocialSignup && (
          <p className="text-[12px] mt-1" style={{ color: "var(--theme-text-muted)" }}>
            소셜 계정으로 간편가입
          </p>
        )}
      </motion.div>

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
        className="relative z-10 mx-5 rounded-3xl overflow-hidden"
        style={{
          background: "var(--glass-bg-card)",
          backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <div className="px-6 pt-7 pb-2">
          <h2 className="text-[20px] font-bold mb-1" style={{ color: "var(--theme-text)" }}>
            {isSocialSignup ? "간편가입" : "회원가입"}
          </h2>
          <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
            필수 정보만 입력하면 바로 시작할 수 있어요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-7 space-y-4">
          {/* Social email (readonly) */}
          {isSocialSignup && socialEmail && (
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                이메일 아이디
              </Label>
              <Input
                value={socialEmail}
                readOnly
                className="h-11 rounded-xl text-[14px] border-0"
                style={{ ...inputStyle, opacity: 0.6 }}
              />
            </div>
          )}

          {/* Email input */}
          {shouldShowEmailInput && (
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                이메일 아이디
              </Label>
              <Input
                name="email"
                placeholder="예: moa@email.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-11 rounded-xl text-[14px] border-0"
                style={inputStyle}
              />
              <FieldMessage message={errors.email?.message} isError={errors.email?.isError} />
            </div>
          )}

          {/* Password fields */}
          {shouldShowPasswordInputs && (
            <>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                  비밀번호
                </Label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="h-11 rounded-xl text-[14px] border-0"
                  style={inputStyle}
                />
                <FieldMessage message={errors.password?.message} isError={errors.password?.isError} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                  비밀번호 확인
                </Label>
                <Input
                  type="password"
                  name="passwordCheck"
                  value={form.passwordCheck}
                  onChange={handleChange}
                  className="h-11 rounded-xl text-[14px] border-0"
                  style={inputStyle}
                />
                <FieldMessage message={errors.passwordCheck?.message} isError={errors.passwordCheck?.isError} />
              </div>
            </>
          )}

          {/* Nickname */}
          <div className="space-y-1.5">
            <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
              닉네임
            </Label>
            <Input
              name="nickname"
              placeholder="2~10자 영문/숫자/한글"
              value={form.nickname}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 rounded-xl text-[14px] border-0"
              style={inputStyle}
            />
            <FieldMessage message={errors.nickname?.message} isError={errors.nickname?.isError} />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
              휴대폰번호 <span className="font-normal">(선택)</span>
            </Label>
            <Input
              name="phone"
              placeholder="01012345678"
              value={form.phone}
              onChange={handleChange}
              className="h-11 rounded-xl text-[14px] border-0"
              style={inputStyle}
            />
            <FieldMessage message={errors.phone?.message} isError={errors.phone?.isError} />
          </div>

          {/* Profile image */}
          <div className="space-y-1.5">
            <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
              프로필 이미지 <span className="font-normal">(선택)</span>
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="h-11 rounded-xl text-[13px] border-0 file:mr-3 file:text-[12px] file:font-semibold"
              style={inputStyle}
            />
          </div>

          {/* Marketing consent */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              name="agreeMarketing"
              checked={form.agreeMarketing}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded"
              style={{ accentColor: "var(--theme-primary)" }}
            />
            <span className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>
              마케팅 정보 수신 동의 <span className="font-medium">(선택)</span>
            </span>
          </label>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 text-[14px] font-bold rounded-xl text-white mt-2"
            style={{ background: "var(--theme-primary)" }}
          >
            {isSocialSignup ? "간편가입 완료하기" : "회원가입 완료하기"}
          </Button>
        </form>
      </motion.div>

      {/* Bottom spacing */}
      <div className="pb-10" />
    </div>
  );
}
