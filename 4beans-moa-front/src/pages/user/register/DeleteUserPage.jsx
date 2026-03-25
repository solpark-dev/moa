import { motion } from "framer-motion";
import { AlertTriangle, UserX, ArrowRight } from "lucide-react";
import useDeleteUser from "@/hooks/user/useDeleteUser";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

function Sticker({
  children,
  color,
  rotate = 0,
  className = "",
  withShadow = true,
}) {
  return (
    <motion.div
      whileHover={withShadow ? { scale: 1.02, x: 2, y: 2 } : undefined}
      whileTap={withShadow ? { scale: 0.98, x: 0, y: 0 } : undefined}
      style={{ rotate }}
      className={`
        ${color || 'bg-[var(--theme-bg-card)]'}
        border border-[var(--theme-border-light)]
        ${withShadow ? "shadow-[var(--theme-shadow)]" : ""}
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
  color,
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2, y: 2 }}
      whileTap={{ scale: 0.98, x: 0, y: 0 }}
      className={`
        font-black
        border border-[var(--theme-border-light)]
        shadow-[var(--theme-shadow)]
        transition-all duration-200
        rounded-2xl
        ${color || themeClasses.button.secondary}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function ReasonRow({ checked, onChange, value, title }) {
  return (
    <label
      className={`
        flex items-center gap-3 cursor-pointer
        border border-[var(--theme-border-light)] rounded-2xl px-4 py-3
        bg-[var(--theme-bg-card)]
        ${checked ? `outline outline-2 outline-[var(--theme-primary)]` : ""}
      `}
    >
      <input
        type="radio"
        name="deleteReason"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className={`h-4 w-4 accent-[var(--theme-primary)] cursor-pointer`}
      />
      <span className={`font-bold ${themeClasses.text.primary}`}>{title}</span>
    </label>
  );
}

export default function DeleteUserPage() {
  const {
    deleteReason,
    deleteDetail,
    showDetail,
    goMypage,
    onSelectReason,
    onChangeDetail,
    onSubmitDelete,
  } = useDeleteUser();

  // Theme
  const { theme, setTheme } = useThemeStore();

  return (
    <div className={`min-h-screen ${themeClasses.bg.base} ${themeClasses.text.primary} overflow-hidden transition-colors duration-300`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Grid Pattern (non-dark themes) */}
      {theme !== 'dark' && (
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
      )}

      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Sticker
              rotate={0}
              className="px-4 py-2 rounded-xl"
            >
              <span className={`text-2xl font-black tracking-tight ${themeClasses.text.primary}`}>MoA!</span>
            </Sticker>
          </motion.div>
          <div />
        </div>
      </nav>

      <section className="relative px-6 md:px-12 pt-6 pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <Sticker
              rotate={0}
              className="inline-block px-5 py-3 rounded-2xl mb-6"
            >
              <span className={`inline-flex items-center gap-2 font-black ${themeClasses.text.primary}`}>
                <AlertTriangle className="w-5 h-5" />
                회원 탈퇴
              </span>
            </Sticker>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter mb-6 ${themeClasses.text.primary}`}
            >
              <span className="block">DELETE</span>
              <span className="block">
                <span className={`text-[var(--theme-primary)] `}>
                  YOUR
                </span>
              </span>
              <span className={`block text-[var(--theme-primary)] `}>
                ACCOUNT!
              </span>
            </motion.h1>

            <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
              <Sticker
                rotate={0}
                className="px-5 py-3 rounded-2xl"
              >
                <p className={`text-lg md:text-xl font-bold ${themeClasses.text.primary}`}>
                  마지막까지 솔직한 의견을 들려주세요.
                </p>
              </Sticker>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Sticker
                  withShadow={false}
                  color="bg-lime-400"
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                >
                  <span className="font-black text-black">사유 선택</span>
                </Sticker>
                <Sticker
                  withShadow={false}
                  color="bg-cyan-400"
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                >
                  <span className="font-black text-black">확인</span>
                </Sticker>
                <Sticker
                  withShadow={false}
                  color="bg-[var(--theme-primary)]"
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                >
                  <span className="font-black text-white">탈퇴</span>
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
              rotate={0}
              className="rounded-[2.5rem] p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <Sticker
                      withShadow={false}
                      color="bg-black"
                      rotate={0}
                      className="px-3 py-1 rounded-lg"
                    >
                      <span className="text-sm font-black text-white">
                        WARNING
                      </span>
                    </Sticker>
                    <Sticker
                      withShadow={false}
                      color="bg-lime-400"
                      rotate={0}
                      className="px-3 py-1 rounded-lg"
                    >
                      <span className="text-sm font-black text-black">CHECK</span>
                    </Sticker>
                  </div>
                  <p className={`text-sm md:text-base font-bold ${themeClasses.text.muted}`}>
                    계정 삭제 전, 꼭 한 번 더 확인해 주세요.
                  </p>
                </div>
                <Sticker
                  withShadow={false}
                  rotate={0}
                  className="px-3 py-2 rounded-xl"
                >
                  <UserX className={`w-6 h-6 ${themeClasses.text.primary}`} />
                </Sticker>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sticker
                      withShadow={false}
                      color="bg-cyan-400"
                      rotate={0}
                      className="px-2 py-1 rounded-lg"
                    >
                      <span className="text-xs font-black text-black">Q</span>
                    </Sticker>
                    <p className={`font-black ${themeClasses.text.primary}`}>탈퇴 사유</p>
                  </div>

                  <div className="space-y-3">
                    <ReasonRow
                      value="NOT_USED"
                      title="서비스를 더 이상 사용하지 않음"
                      checked={deleteReason === "NOT_USED"}
                      onChange={onSelectReason}
                    />
                    <ReasonRow
                      value="PRICE"
                      title="가격이 부담됨"
                      checked={deleteReason === "PRICE"}
                      onChange={onSelectReason}
                    />
                    <ReasonRow
                      value="FUNCTION"
                      title="원하는 기능이 부족함"
                      checked={deleteReason === "FUNCTION"}
                      onChange={onSelectReason}
                    />
                    <ReasonRow
                      value="OTHER"
                      title="기타(상세내용 입력)"
                      checked={deleteReason === "OTHER"}
                      onChange={onSelectReason}
                    />
                  </div>
                </div>

                {showDetail && (
                  <div className="space-y-2">
                    <p className={`text-sm font-black ${themeClasses.text.primary}`}>상세 사유 (선택)</p>
                    <textarea
                      value={deleteDetail}
                      onChange={(e) => onChangeDetail(e.target.value)}
                      className={`
                        w-full border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] rounded-2xl p-3 text-sm h-28 resize-none
                        focus:outline-none ${themeClasses.text.primary}
                      `}
                      placeholder="기타 사유 또는 추가 의견이 있다면 입력해 주세요."
                    />
                  </div>
                )}

                <div className={`border border-[var(--theme-border-light)] rounded-3xl p-5 bg-[var(--theme-bg-secondary)]`}>
                  <p className={`text-xs md:text-sm font-bold ${themeClasses.text.muted} leading-relaxed`}>
                    탈퇴 시 계정 정보 및 서비스 이용 이력은 관련 법령에 따라
                    일정 기간 보관 후 안전하게 파기됩니다.
                  </p>
                  <p className={`mt-2 text-xs md:text-sm font-bold ${themeClasses.text.muted} leading-relaxed`}>
                    탈퇴 후에는 동일 이메일로 재가입이 제한되거나, 일부 데이터는
                    복구가 불가능할 수 있습니다.
                  </p>
                </div>

                <div className="pt-2 flex items-stretch gap-4">
                  <PopButton
                    type="button"
                    onClick={goMypage}
                    color={themeClasses.button.secondary}
                    className="flex-1 text-lg py-4 rounded-2xl"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      마이페이지 <ArrowRight className="w-5 h-5" />
                    </span>
                  </PopButton>

                  <PopButton
                    type="button"
                    onClick={onSubmitDelete}
                    color={themeClasses.button.primary}
                    className="flex-1 text-lg py-4 rounded-2xl"
                  >
                    정말 탈퇴할게요
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
