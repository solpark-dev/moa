/**
 * 소셜 로그인 버튼 컴포넌트
 * CSS 변수 기반 테마 적용
 */
export default function SocialButton({ provider, isConnected }) {
  const isGoogle = provider === "google";
  const providerLabel = isGoogle ? "GOOGLE" : "KAKAO";
  const providerStyle = isGoogle ? "bg-white" : "bg-[#FEE500]";
  const statusText = isConnected ? "연동됨" : "미연동";
  const statusClass = isConnected ? "text-emerald-600" : "text-slate-700";

  return (
    <div className={`w-full h-10 rounded-2xl border-[var(--theme-border-width)] border-[var(--theme-border)] text-xs font-black flex items-center justify-between px-4 ${providerStyle}`}>
      <span className="text-[11px] text-slate-900 uppercase tracking-[0.16em]">
        {providerLabel}
      </span>
      <span className={`text-xs ${statusClass}`}>{statusText}</span>
    </div>
  );
}
