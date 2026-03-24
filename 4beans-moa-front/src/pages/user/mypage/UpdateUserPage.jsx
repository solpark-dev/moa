import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { formatPhone } from "@/utils/phoneUtils";
import {
  KeyRound,
  Mail,
  User,
  Phone,
  Upload,
  BellRing,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import useUpdateUser from "@/hooks/user/useUpdateUser";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const updateUserThemeStyles = {
  pop: {
    sticker: {
      border: "border border-gray-200",
      shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    },
    button: {
      primaryBg: "bg-pink-500",
      primaryText: "text-white",
      secondaryBg: "bg-white",
      secondaryText: "text-black",
      border: "border border-gray-200",
      shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
      hover: "hover:bg-slate-50",
    },
    input: {
      border: "border border-gray-200",
      shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
      focusRing: "focus-visible:ring-0",
    },
    accent: {
      cyan: "bg-cyan-400",
      pink: "bg-pink-500",
      lime: "bg-lime-400",
    },
    titleAccent: {
      cyan: "text-cyan-400",
      pink: "text-pink-500",
    },
  },
  christmas: {
    sticker: {
      border: "border border-gray-200",
      shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    },
    button: {
      primaryBg: "bg-[#c41e3a]",
      primaryText: "text-white",
      secondaryBg: "bg-white",
      secondaryText: "text-black",
      border: "border border-gray-200",
      shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
      hover: "hover:bg-red-50",
    },
    input: {
      border: "border border-gray-200",
      shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
      focusRing: "focus-visible:ring-0",
    },
    accent: {
      cyan: "bg-[#1a5f2a]",
      pink: "bg-[#c41e3a]",
      lime: "bg-[#1a5f2a]",
    },
    titleAccent: {
      cyan: "text-[#1a5f2a]",
      pink: "text-[#c41e3a]",
    },
  },
};

function Sticker({
  children,
  color = "bg-white",
  rotate = 0,
  className = "",
  withShadow = true,
  theme,
}) {
  const themeStyle = updateUserThemeStyles[theme] || updateUserThemeStyles.pop;
  return (
    <motion.div
      whileHover={withShadow ? { scale: 1.01 } : undefined}
      whileTap={withShadow ? { scale: 0.98, x: 0, y: 0 } : undefined}
      style={{ rotate }}
      className={`
        ${color}
        ${themeStyle.sticker.border}
        ${withShadow ? themeStyle.sticker.shadow : ""}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

function PopButton({
  children,
  color = "bg-pink-500 text-white",
  className = "",
  theme,
  variant = "primary",
  ...props
}) {
  const themeStyle = updateUserThemeStyles[theme] || updateUserThemeStyles.pop;
  const colorClass = variant === "primary"
    ? `${themeStyle.button.primaryBg} ${themeStyle.button.primaryText}`
    : variant === "secondary"
      ? `${themeStyle.button.secondaryBg} ${themeStyle.button.secondaryText}`
      : color;

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2, y: 2 }}
      whileTap={{ scale: 0.98, x: 0, y: 0 }}
      className={`
        ${colorClass}
        font-black
        ${themeStyle.button.border}
        ${themeStyle.button.shadow}
        transition-all duration-200
        rounded-2xl
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default function UpdateUserPage() {
  const { theme } = useThemeStore();
  const themeStyle = updateUserThemeStyles[theme] || updateUserThemeStyles.pop;

  const {
    fileRef,
    email,
    nickname,
    phone,
    agreeMarketing,
    displayImage,
    nickMsg,
    openFilePicker,
    onImageSelect,
    onNicknameChange,
    onNicknameBlur,
    onAgreeMarketingChange,
    onPassVerify,
    onSave,
    goMypage,
  } = useUpdateUser();

  return (
    <div className="min-h-screen bg-slate-50 text-black overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <Sticker
              color="bg-white"
              rotate={0}
              className="px-4 py-2 rounded-xl"
              theme={theme}
            >
              <span className="text-2xl font-black tracking-tight">MoA!</span>
            </Sticker>
          </motion.div>
          <div />
        </div>
      </nav>

      <section className="relative px-6 md:px-12 pt-6 pb-16">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.4 }}
          className="absolute top-44 left-[6%] hidden lg:block"
        >
          <Sticker
            color={themeStyle.accent.lime}
            rotate={-6}
            className="px-3 py-1 rounded-lg"
            theme={theme}
          >
            <span className="font-bold text-sm">SAFE ✅</span>
          </Sticker>
        </motion.div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <Sticker
              color="bg-white"
              rotate={0}
              className="inline-block px-5 py-3 rounded-2xl mb-6"
              theme={theme}
            >
              <span className="inline-flex items-center gap-2 font-black">
                <KeyRound className="w-5 h-5" />
                회원정보 수정
              </span>
            </Sticker>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter mb-6"
            >
              <span className="block">UPDATE</span>
              <span className="block">
                <span className={themeStyle.titleAccent.cyan}>
                  YOUR
                </span>
              </span>
              <span className={`block ${themeStyle.titleAccent.pink}`}>
                PROFILE!
              </span>
            </motion.h1>

            <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
              <Sticker
                color="bg-white"
                rotate={0}
                className="px-5 py-3 rounded-2xl"
                theme={theme}
              >
                <p className="text-lg md:text-xl font-bold">
                  닉네임 · 휴대폰 · 이미지 · 마케팅 수신까지 한 번에 🎯
                </p>
              </Sticker>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Sticker
                  color={themeStyle.accent.lime}
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                  theme={theme}
                >
                  <span className="font-black">빠르게</span>
                </Sticker>
                <Sticker
                  color={themeStyle.accent.cyan}
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                  theme={theme}
                >
                  <span className="font-black">깔끔하게</span>
                </Sticker>
                <Sticker
                  color={themeStyle.accent.pink}
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                  theme={theme}
                >
                  <span className="font-black text-white">안전하게</span>
                </Sticker>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <Sticker
              color="bg-white"
              rotate={0}
              withShadow={false}
              className="rounded-[2.5rem] p-6 md:p-8"
              theme={theme}
            >
              <div className="space-y-7">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative group cursor-pointer"
                    onClick={openFilePicker}
                  >
                    <div className={`rounded-full ${themeStyle.sticker.border} ${themeStyle.sticker.shadow}`}>
                      <Avatar className="w-24 h-24 bg-slate-100">
                        <AvatarImage
                          src={displayImage}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-slate-200 text-slate-700">
                          <User className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={`w-24 h-24 rounded-full bg-black/35 flex items-center justify-center ${themeStyle.sticker.border}`}>
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <PopButton
                    type="button"
                    variant="secondary"
                    className="text-sm px-5 py-2 rounded-xl"
                    onClick={openFilePicker}
                    theme={theme}
                  >
                    <span className="inline-flex items-center gap-2">
                      이미지 변경 <ArrowRight className="w-4 h-4" />
                    </span>
                  </PopButton>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={onImageSelect}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase flex items-center gap-2">
                    <Sticker
                      withShadow={false}
                      color={themeStyle.accent.cyan}
                      rotate={0}
                      className="px-2 py-1 rounded-lg"
                      theme={theme}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </Sticker>
                    이메일 (ID)
                  </Label>
                  <Input
                    readOnly
                    value={email || ""}
                    className={`bg-slate-100 ${themeStyle.input.border} rounded-2xl font-bold text-gray-700 ${themeStyle.input.focusRing} cursor-not-allowed ${themeStyle.input.shadow}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase flex items-center gap-2">
                    <Sticker
                      withShadow={false}
                      color={themeStyle.accent.pink}
                      rotate={0}
                      className="px-2 py-1 rounded-lg"
                      theme={theme}
                    >
                      <User className="w-3.5 h-3.5 text-white" />
                    </Sticker>
                    닉네임
                  </Label>
                  <Input
                    value={nickname || ""}
                    onChange={(e) => onNicknameChange(e.target.value)}
                    onBlur={onNicknameBlur}
                    placeholder="변경할 닉네임 입력"
                    className={`bg-white ${themeStyle.input.border} rounded-2xl font-bold placeholder:text-gray-400 ${themeStyle.input.focusRing} ${themeStyle.input.shadow}`}
                  />
                  {nickMsg.text && (
                    <Sticker
                      color={nickMsg.isError ? "bg-white" : themeStyle.accent.lime}
                      rotate={0}
                      className="px-3 py-2 rounded-xl inline-block"
                      withShadow={false}
                      theme={theme}
                    >
                      <p
                        className={`text-sm font-black ${nickMsg.isError ? "text-red-600" : "text-black"
                          }`}
                      >
                        {nickMsg.text}
                      </p>
                    </Sticker>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase flex items-center gap-2">
                    <Sticker
                      withShadow={false}
                      color={themeStyle.accent.lime}
                      rotate={0}
                      className="px-2 py-1 rounded-lg"
                      theme={theme}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </Sticker>
                    휴대폰 번호
                  </Label>

                  <div className="flex gap-3 items-stretch">
                    <Input
                      value={formatPhone(phone) || ""}
                      readOnly
                      className={`flex-1 bg-slate-100 ${themeStyle.input.border} rounded-2xl font-bold text-gray-800 ${themeStyle.input.focusRing} ${themeStyle.input.shadow}`}
                    />
                    <PopButton
                      type="button"
                      onClick={onPassVerify}
                      color="bg-black text-white"
                      className="px-5 py-3 text-sm rounded-2xl"
                      theme={theme}
                    >
                      본인인증
                    </PopButton>
                  </div>
                </div>

                <div className={`${themeStyle.sticker.border} rounded-3xl p-5 bg-slate-100 ${themeStyle.sticker.shadow}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sticker
                          withShadow={false}
                          color={themeStyle.accent.cyan}
                          rotate={0}
                          className="px-2 py-1 rounded-lg"
                          theme={theme}
                        >
                          <BellRing className="w-4 h-4" />
                        </Sticker>
                        <span className="text-sm md:text-base font-black">
                          마케팅 정보 수신 동의
                        </span>
                      </div>
                      <p className="text-xs md:text-sm font-bold text-gray-600">
                        이벤트 및 혜택 정보를 이메일·문자로 받아보시겠습니까?
                      </p>
                    </div>

                    <Switch
                      checked={agreeMarketing}
                      onCheckedChange={onAgreeMarketingChange}
                      className={`data-[state=checked]:${themeStyle.button.primaryBg} data-[state=unchecked]:bg-black/40`}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-stretch gap-4">
                  <PopButton
                    type="button"
                    onClick={goMypage}
                    variant="secondary"
                    className="flex-1 text-lg py-4 rounded-2xl"
                    theme={theme}
                  >
                    마이페이지
                  </PopButton>

                  <PopButton
                    type="button"
                    onClick={onSave}
                    variant="primary"
                    className="flex-1 text-lg py-4 rounded-2xl"
                    theme={theme}
                  >
                    <span className="inline-flex items-center justify-center gap-3">
                      저장하기 <Sparkles className="w-6 h-6" />
                    </span>
                  </PopButton>
                </div>
              </div>
            </Sticker>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
