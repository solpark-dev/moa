import { Card } from "@/components/ui/card";

/**
 * 아웃라인 카드 컴포넌트
 * CSS 변수 기반 테마 적용
 */
export default function OutlineCard({ className = "", children }) {
  return (
    <Card
      className={`bg-[var(--theme-bg-card)] border-[var(--theme-border-width)] border-[var(--theme-border)] rounded-3xl shadow-[var(--theme-shadow)] ${className}`}
    >
      {children}
    </Card>
  );
}
