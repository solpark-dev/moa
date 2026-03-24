import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

/**
 * 블랙리스트 해제 히어로 섹션
 * CSS 변수 기반 테마 적용
 */
export default function RemoveBlacklistHero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)] via-[var(--theme-primary-hover)] to-[var(--theme-primary)]" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div className="max-w-xl text-center md:text-left text-white">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-5 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA 관리자 · 블랙리스트 해제
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              블랙리스트 상태를 해제하고
              <br />
              <span className="text-white/80">
                회원의 이용 제한을 풀 수 있습니다
              </span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-md mx-auto md:mx-0">
              해제 사유를 남겨 두면 이후 감사·이력 확인 시 도움을 줄 수
              있습니다. 신중하게 확인한 뒤 해제해 주세요.
            </p>
          </div>

          <Card className="bg-[var(--theme-bg-card)]/95 border-[var(--theme-border-light)] shadow-xl rounded-3xl w-full max-w-md hover:brightness-[1.03] transition">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--theme-primary-light)] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[var(--theme-primary)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--theme-text-muted)] uppercase tracking-[0.16em]">
                    BLACKLIST RELEASE
                  </p>
                  <p className="text-sm font-semibold text-[var(--theme-text)]">
                    블랙리스트 해제 후에는 해당 계정의 서비스 이용이 다시
                    허용됩니다.
                  </p>
                </div>
              </div>
              <p className="text-xs text-[var(--theme-text-muted)]">
                계정 상태와 해제 사유를 다시 한 번 검토한 뒤 진행해 주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
