/**
 * 블랙리스트 등록 히어로 섹션
 * CSS 변수 기반 테마 적용
 */
export default function AddBlacklistHero() {
  return (
    <section className="relative px-6 md:px-12 pt-10 pb-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center mb-6 px-4 py-2 rounded-xl bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] font-black text-sm text-[var(--theme-text)]">
            <span className="flex h-2 w-2 rounded-full bg-[var(--theme-primary)] mr-2" />
            MoA 관리자 · 블랙리스트 관리
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-[var(--theme-text)]">
            블랙리스트 등록
          </h1>
        </div>
      </div>
    </section>
  );
}
