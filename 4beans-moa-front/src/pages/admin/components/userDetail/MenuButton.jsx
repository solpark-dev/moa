import { Button } from "@/components/ui/button";

/**
 * 메뉴 버튼 컴포넌트
 * CSS 변수 기반 테마 적용
 */
export default function MenuButton({ icon, label, onClick, active = false }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start h-11 px-4 text-sm font-bold rounded-2xl border-2 transition-colors ${
        active
          ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white'
          : 'border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] hover:bg-[var(--theme-primary-light)]'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
      {active && <span className="ml-auto text-xs">●</span>}
    </Button>
  );
}
