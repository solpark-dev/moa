import { Button } from "@/components/ui/button";

// Theme-based button styles
const getButtonStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        base: "h-9 px-4 text-xs font-black border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(196,30,58,0.1)] hover:shadow-[6px_6px_16px_rgba(196,30,58,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
        google: "bg-white text-black hover:bg-red-50",
        kakao: "bg-[#FEE500] text-black hover:bg-[#FDE68A]",
        disconnect: "bg-white text-red-600 hover:bg-red-50",
      };
    case 'dark':
      return {
        base: "h-9 px-4 text-xs font-black border border-gray-700 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.4)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
        google: "bg-gray-800 text-white hover:bg-gray-700",
        kakao: "bg-[#FEE500] text-black hover:bg-[#FDE68A]",
        disconnect: "bg-[#1E293B] text-red-400 hover:bg-red-950",
      };
    case 'portrait':
      return {
        base: "h-9 px-4 text-xs font-black border border-pink-200 rounded-xl shadow-[4px_4px_12px_rgba(255,181,197,0.2)] hover:shadow-[6px_6px_16px_rgba(255,181,197,0.3)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
        google: "bg-white text-black hover:bg-pink-50",
        kakao: "bg-[#FEE500] text-black hover:bg-[#FDE68A]",
        disconnect: "bg-white text-red-600 hover:bg-red-50",
      };
    case 'pop':
      return {
        base: "h-9 px-4 text-xs font-black border border-gray-200 rounded-xl shadow-[0_4px_12px_rgba(236,72,153,0.1)] hover:shadow-[0_8px_24px_rgba(236,72,153,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
        google: "bg-white text-black hover:bg-slate-50",
        kakao: "bg-[#FEE500] text-black hover:bg-[#FDE68A]",
        disconnect: "bg-white text-red-600 hover:bg-red-50",
      };
    case 'classic':
      return {
        base: "h-9 px-4 text-xs font-black border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(99,91,255,0.1)] hover:shadow-[6px_6px_16px_rgba(99,91,255,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
        google: "bg-white text-black hover:bg-slate-50",
        kakao: "bg-[#FEE500] text-black hover:bg-[#FDE68A]",
        disconnect: "bg-white text-red-600 hover:bg-red-50",
      };
    default:
      return {
        base: "h-9 px-4 text-xs font-black border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
        google: "bg-white text-black hover:bg-slate-50",
        kakao: "bg-[#FEE500] text-black hover:bg-[#FDE68A]",
        disconnect: "bg-white text-red-600 hover:bg-red-50",
      };
  }
};

export function SocialButton({ provider, isConnected, onClick, theme = 'default' }) {
  const isGoogle = provider === "google";
  const styles = getButtonStyles(theme);

  return (
    <Button
      type="button"
      onClick={onClick}
      variant="outline"
      className={`${styles.base} ${
        isConnected ? styles.disconnect : isGoogle ? styles.google : styles.kakao
      }`}
    >
      {isConnected
        ? `${provider.toUpperCase()} 해제`
        : `${provider.toUpperCase()} 연동`}
    </Button>
  );
}
