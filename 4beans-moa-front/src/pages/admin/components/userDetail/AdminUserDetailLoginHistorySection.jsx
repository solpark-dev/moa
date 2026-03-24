import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import OutlineCard from "./OutlineCard";

/**
 * 관리자 회원 상세 로그인 이력 섹션
 * CSS 변수 기반 테마 적용
 */
export default function AdminUserDetailLoginHistorySection({
  historyLoading,
  historyItems,
  historyTotalCount,
  historyPage,
  historyPages,
  historyPageCount,
  goHistoryFirst,
  goHistoryPrev,
  goHistoryPage,
  goHistoryNextBlock,
  goHistoryLast,
}) {
  return (
    <OutlineCard>
      <CardHeader className="pb-3 border-b border-[var(--theme-border-light)]">
        <CardTitle className="text-xs font-black tracking-[0.18em] text-[var(--theme-text)] flex items-center gap-2">
          <KeyRound className="w-4 h-4" />
          로그인 이력
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {historyLoading && (
          <div className="py-6 text-center text-sm font-bold text-[var(--theme-text-muted)]">
            불러오는 중..
          </div>
        )}

        {!historyLoading && historyItems.length === 0 && (
          <div className="py-6 text-center text-sm font-bold text-[var(--theme-text-muted)]">
            로그인 이력이 없습니다.
          </div>
        )}

        {!historyLoading && historyItems.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-[var(--theme-text-muted)]">
              <span>최근 로그인 이력 {historyTotalCount}건</span>
            </div>

            <div className="overflow-x-auto border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-2xl">
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
                      유형
                    </th>
                    <th className="py-3 px-3 text-left font-black text-[var(--theme-text)]">
                      User-Agent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyItems.map((item, idx) => (
                    <tr
                      key={`${item.loginAt}-${idx}`}
                      className="border-b border-[var(--theme-border-light)] hover:bg-[var(--theme-primary-light)]"
                    >
                      <td className="py-3 px-3 text-[var(--theme-text)] font-bold whitespace-nowrap">
                        {item.loginAtFormatted}
                      </td>
                      <td
                        className={`py-3 px-3 font-black ${item.success ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {item.successText}
                      </td>
                      <td className="py-3 px-3 text-[var(--theme-text)] font-bold whitespace-nowrap">
                        {item.loginIp || "-"}
                      </td>
                      <td className="py-3 px-3 text-[var(--theme-text)] font-bold whitespace-nowrap">
                        {item.loginType || "-"}
                      </td>
                      <td className="py-3 px-3 text-[var(--theme-text-muted)] font-bold max-w-[220px] truncate">
                        {item.userAgent || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <Button
                type="button"
                className="h-10 w-10 rounded-2xl border-[var(--theme-border-width)] border-[var(--theme-border)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] font-black hover:bg-[var(--theme-primary-light)]"
                onClick={goHistoryFirst}
                disabled={historyPage <= 1}
              >
                {"<<"}
              </Button>
              <Button
                type="button"
                className="h-10 w-10 rounded-2xl border-[var(--theme-border-width)] border-[var(--theme-border)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] font-black hover:bg-[var(--theme-primary-light)]"
                onClick={goHistoryPrev}
                disabled={historyPage <= 1}
              >
                {"<"}
              </Button>

              {historyPages.map((p) => (
                <Button
                  key={p}
                  type="button"
                  className={`h-10 min-w-[2.5rem] rounded-2xl border-[var(--theme-border-width)] border-[var(--theme-border)] shadow-[var(--theme-shadow)] font-black ${
                    p === historyPage
                      ? 'bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-primary-hover)]'
                      : 'bg-[var(--theme-bg-card)] text-[var(--theme-text)] hover:bg-[var(--theme-primary-light)]'
                  }`}
                  onClick={() => goHistoryPage(p)}
                >
                  {p}
                </Button>
              ))}

              <Button
                type="button"
                className="h-10 w-10 rounded-2xl border-[var(--theme-border-width)] border-[var(--theme-border)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] font-black hover:bg-[var(--theme-primary-light)]"
                onClick={goHistoryNextBlock}
                disabled={historyPage >= historyPageCount}
              >
                {">"}
              </Button>
              <Button
                type="button"
                className="h-10 w-10 rounded-2xl border-[var(--theme-border-width)] border-[var(--theme-border)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] font-black hover:bg-[var(--theme-primary-light)]"
                onClick={goHistoryLast}
                disabled={historyPage >= historyPageCount}
              >
                {">>"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </OutlineCard>
  );
}
