import { Link } from "react-router-dom";

/**
 * Footer component using CSS variables for theming
 * Theme styles are automatically applied via data-theme attribute on root element
 */
export default function Footer() {
  return (
    <footer className="relative z-10 bg-[var(--theme-bg-card)] border-t border-[var(--theme-border-light)] mt-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-xl font-semibold text-[var(--theme-text)]">MoA</h2>
          <p className="mt-3 text-sm text-[var(--theme-text-muted)] leading-6">
            현명한 구독 생활의 시작. 넷플릭스, 디즈니+, <br />
            유튜브 등 좋아하는 OTT 서비스와 함께하세요.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--theme-text)] mb-3">서비스</h3>
          <ul className="space-y-2 text-sm text-[var(--theme-text-muted)]">
            <li>넷플릭스 파티</li>
            <li>디즈니+ 파티</li>
            <li>유튜브 프리미엄</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--theme-text)] mb-3">고객지원</h3>
          <ul className="space-y-2 text-sm text-[var(--theme-text-muted)]">
            <li>
              <Link to="/community/notice" className="transition-colors hover:text-[var(--theme-primary)]">
                고객센터
              </Link>
            </li>

            <li>이용약관</li>
            <li>개인정보처리방침</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
