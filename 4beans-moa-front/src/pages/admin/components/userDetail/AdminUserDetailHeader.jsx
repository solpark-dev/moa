import OutlineCard from "./OutlineCard";

/**
 * 관리자 회원 상세 헤더
 * CSS 변수 기반 테마 적용
 */
export default function AdminUserDetailHeader({ shortId }) {
  return (
    <section className="bg-[var(--theme-bg-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border-[var(--theme-border-width)] border-[var(--theme-border)] shadow-[var(--theme-shadow)] rounded-full px-4 py-2 text-xs font-extrabold text-[var(--theme-text)]">
              <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)]" />
              MoA 관리자 · 회원 상세 · ID: {shortId}
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-[1.05] text-[var(--theme-text)]">
              MOA 회원 목록
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
