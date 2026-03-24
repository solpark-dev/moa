import { Button } from "@/components/ui/button";

// Theme-based button styles
const getButtonStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return "border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(196,30,58,0.1)]";
    case 'dark':
      return "border border-gray-700 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.3)]";
    case 'pop':
      return "border border-gray-200 rounded-2xl shadow-[0_4px_12px_rgba(236,72,153,0.1)]";
    case 'classic':
      return "border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(99,91,255,0.1)]";
    default:
      return "border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]";
  }
};

export function SocialLoginButtons({ onKakao, onGoogle, loginLoading, theme = 'default' }) {
  const buttonStyle = getButtonStyles(theme);
  const baseClass = `w-full h-12 flex items-center justify-center gap-3 text-[13px] font-black uppercase tracking-[0.2em] ${buttonStyle}`;

  return (
    <div className="space-y-3">
      <Button
        id="btnKakaoLogin"
        type="button"
        onClick={onKakao}
        className={`${baseClass} bg-[#FEE500] text-black hover:bg-[#FEE500] hover:text-black hover:brightness-95 transition`}
      >
        <span className="w-4 h-4 bg-black/20 rounded-full" />
        카카오로 로그인
      </Button>

      <Button
        id="btnGoogleLogin"
        type="button"
        onClick={onGoogle}
        className={`${baseClass} ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-slate-900 hover:bg-white hover:brightness-95'} transition`}
        disabled={loginLoading}
      >
        <span className={`w-4 h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-slate-300'} rounded-full`} />
        Google 계정으로 로그인
      </Button>
    </div>
  );
}
