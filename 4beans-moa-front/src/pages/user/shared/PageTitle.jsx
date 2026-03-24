/**
 * 페이지 타이틀 컴포넌트
 * CSS 변수 기반 테마 적용
 */
export function PageTitle({ title, subtitle }) {
  return (
    <>
      <h2 className="text-3xl font-bold mb-4 text-[var(--theme-text)]">{title}</h2>
      {subtitle && <p className="text-[var(--theme-text-muted)] mb-6 text-sm text-center">{subtitle}</p>}
    </>
  );
}
