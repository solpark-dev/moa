import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KeyRound } from "lucide-react";

/**
 * 관리자 로그인 이력 카드
 * CSS 변수 기반 테마 적용
 */
export default function AdminLoginHistoryCard({ loginHistory }) {
  const {
    state: { items, page, pages, pageCount, loading, totalCount },
    actions: { goFirst, goPrev, goPage, goNextBlock, goLast },
  } = loginHistory;

  return (
    <Card className="bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-3xl overflow-hidden">
      <CardHeader className="pb-6 border-b border-[var(--theme-border-light)] bg-[var(--theme-primary-light)]">
        <CardTitle className="text-sm font-black uppercase tracking-[0.18em] flex items-center gap-3 text-[var(--theme-text)]">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--theme-primary)] border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)]">
            <KeyRound className="w-4 h-4 text-white" />
          </span>
          로그인 이력
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-[var(--theme-text-muted)]">
            로그인 이력 {totalCount}건
          </span>
        </div>

        {loading && (
          <div className="py-10 text-center text-sm font-bold text-[var(--theme-text-muted)]">
            불러오는 중...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="py-10 text-center text-sm font-bold text-[var(--theme-text-muted)]">
            로그인 이력이 없습니다.
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-2xl border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)]">
              <table className="w-full text-sm bg-[var(--theme-bg-card)]">
                <thead>
                  <tr className="border-b border-[var(--theme-border-light)] bg-[var(--theme-primary-light)]">
                    <th className="py-3 px-3 text-left font-black text-[var(--theme-text)]">
                      일시
                    </th>
                    <th className="py-3 px-3 text-left font-black text-[var(--theme-text)]">
                      결과
                    </th>
                    <th className="py-3 px-3 text-left font-black text-[var(--theme-text)]">
                      IP
                    </th>
                    <th className="py-3 px-3 text-left font-black text-[var(--theme-text)]">
                      타입
                    </th>
                    <th className="py-3 px-3 text-left font-black text-[var(--theme-text)]">
                      User-Agent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={`${item.loginAt}-${idx}`}
                      className="border-b border-[var(--theme-border-light)] hover:bg-[var(--theme-primary-light)] transition-colors"
                    >
                      <td className="py-3 px-3 font-bold text-[var(--theme-text)] whitespace-nowrap">
                        {item.loginAtFormatted}
                      </td>
                      <td
                        className={`py-3 px-3 font-black whitespace-nowrap ${item.success ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {item.successText}
                      </td>
                      <td className="py-3 px-3 font-bold text-[var(--theme-text)] whitespace-nowrap">
                        {item.loginIp || "-"}
                      </td>
                      <td className="py-3 px-3 font-bold text-[var(--theme-text)] whitespace-nowrap">
                        {item.loginType || "-"}
                      </td>
                      <td className="py-3 px-3 font-bold text-[var(--theme-text-muted)] max-w-[220px] truncate">
                        {item.userAgent || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-xl hover:bg-[var(--theme-primary-light)]"
                onClick={goFirst}
                disabled={page <= 1}
              >
                {"<<"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-xl hover:bg-[var(--theme-primary-light)]"
                onClick={goPrev}
                disabled={page <= 1}
              >
                {"<"}
              </Button>

              {pages.map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  className={`h-10 min-w-[2.5rem] text-xs font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-xl ${
                    p === page
                      ? 'bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-primary-hover)]'
                      : 'bg-[var(--theme-bg-card)] text-[var(--theme-text)] hover:bg-[var(--theme-primary-light)]'
                  }`}
                  onClick={() => goPage(p)}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-xl hover:bg-[var(--theme-primary-light)]"
                onClick={goNextBlock}
                disabled={page >= pageCount}
              >
                {">"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-xl hover:bg-[var(--theme-primary-light)]"
                onClick={goLast}
                disabled={page >= pageCount}
              >
                {">>"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
