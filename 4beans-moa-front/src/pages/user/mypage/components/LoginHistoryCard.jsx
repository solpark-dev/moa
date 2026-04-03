import React from "react";

export function LoginHistoryCard({ loginHistory, onBack }) {
  const items =
    loginHistory?.items ||
    loginHistory?.data?.items ||
    loginHistory?.list ||
    loginHistory?.data ||
    [];

  const total =
    loginHistory?.total ||
    loginHistory?.data?.total ||
    loginHistory?.pagination?.total ||
    items.length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] font-bold" style={{ color: "var(--theme-text)" }}>
          로그인 이력
        </p>
        {onBack && (
          <button
            type="button"
            className="text-[13px] font-medium"
            style={{ color: "var(--theme-primary)" }}
            onClick={onBack}
          >
            ← 돌아가기
          </button>
        )}
      </div>

      <p className="text-[12px] mb-3" style={{ color: "var(--theme-text-muted)" }}>
        최근 로그인 이력 {total ?? 0}건
      </p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--glass-border)" }}
      >
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ background: "var(--glass-bg-overlay)", borderBottom: "1px solid var(--glass-border)" }}>
              {["일시", "결과", "IP", "유형", "User-Agent"].map((h) => (
                <th key={h} className="text-left p-3 font-bold" style={{ color: "var(--theme-text)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) && items.length > 0 ? (
              items.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--theme-text)" }}>
                    {row?.createdAt || row?.dateTime || row?.loginAt || "-"}
                  </td>
                  <td className="p-3 font-bold" style={{ color: row?.success === false || row?.result === "FAIL" ? "#ef4444" : "#10b981" }}>
                    {row?.success === false || row?.result === "FAIL" ? "실패" : "성공"}
                  </td>
                  <td className="p-3" style={{ color: "var(--theme-text-muted)" }}>{row?.loginIp ?? "-"}</td>
                  <td className="p-3" style={{ color: "var(--theme-text-muted)" }}>
                    {row?.provider || row?.type || "-"}
                  </td>
                  <td className="p-3 truncate max-w-[200px]" style={{ color: "var(--theme-text-muted)" }}>
                    {row?.userAgent || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center" colSpan={5} style={{ color: "var(--theme-text-muted)" }}>
                  로그인 이력이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
