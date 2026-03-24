/**
 * 페이지 단계 표시 컴포넌트
 * CSS 변수 기반 테마 적용
 */
export function PageSteps({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 text-sm font-medium">
      {steps.map((step, idx) => {
        const isActive = step.active;
        const isLast = idx === steps.length - 1;
        return (
          <div key={step.label} className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                isActive
                  ? 'bg-[var(--theme-primary)] text-white'
                  : 'bg-[var(--theme-border-light)] text-[var(--theme-text-muted)]'
              }`}
            >
              {step.number}
            </span>
            <span className={isActive ? 'text-[var(--theme-primary)]' : 'text-[var(--theme-text-muted)]'}>
              {step.label}
            </span>
            {!isLast && <div className="w-8 h-px bg-[var(--theme-border-light)] ml-4" />}
          </div>
        );
      })}
    </div>
  );
}
