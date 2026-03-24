import React from "react";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const loginHistoryThemeStyles = {
  pop: {
    titleText: "text-black",
    titleBar: "h-[2px] bg-black",
    subtitleText: "text-slate-700",
    tableBorder: "border border-gray-200",
    headerBg: "bg-white",
    headerBorder: "border-b-2 border-black",
    headerText: "text-black",
    rowBorder: "border-b border-black/10",
    cellText: "text-slate-800",
    emptyText: "text-slate-700",
  },
  christmas: {
    titleText: "text-black",
    titleBar: "h-[2px] bg-gray-200",
    subtitleText: "text-slate-700",
    tableBorder: "border border-gray-200",
    headerBg: "bg-white",
    headerBorder: "border-b border-gray-200",
    headerText: "text-black",
    rowBorder: "border-b border-gray-200",
    cellText: "text-slate-800",
    emptyText: "text-slate-700",
  },
  dark: {
    titleText: "text-gray-200",
    titleBar: "h-[2px] bg-gray-700",
    subtitleText: "text-gray-400",
    tableBorder: "border border-gray-700",
    headerBg: "bg-[#0F172A]",
    headerBorder: "border-b border-gray-700",
    headerText: "text-gray-200",
    rowBorder: "border-b border-gray-700",
    cellText: "text-gray-300",
    emptyText: "text-gray-400",
  },
  classic: {
    titleText: "text-black",
    titleBar: "h-[2px] bg-gray-200",
    subtitleText: "text-slate-700",
    tableBorder: "border border-gray-200",
    headerBg: "bg-white",
    headerBorder: "border-b border-gray-200",
    headerText: "text-black",
    rowBorder: "border-b border-gray-200",
    cellText: "text-slate-800",
    emptyText: "text-slate-700",
  },
};

export function LoginHistoryCard({ loginHistory, onBack }) {
  const { theme } = useThemeStore();
  const themeStyle =
    loginHistoryThemeStyles[theme] || loginHistoryThemeStyles.pop;
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`font-black tracking-widest text-sm ${themeStyle.titleText}`}>로그인 이력</p>
          <div className={`mt-4 ${themeStyle.titleBar} w-full`} />
        </div>
      </div>

      <p className={`mt-6 text-sm font-bold ${themeStyle.subtitleText}`}>
        최근 로그인 이력 {total ?? 0}건
      </p>

      <div className={`mt-4 ${themeStyle.tableBorder} rounded-2xl overflow-hidden`}>
        <table className="w-full text-sm">
          <thead className={themeStyle.headerBg}>
            <tr className={themeStyle.headerBorder}>
              <th className={`text-left p-3 font-black ${themeStyle.headerText}`}>일시</th>
              <th className={`text-left p-3 font-black ${themeStyle.headerText}`}>결과</th>
              <th className={`text-left p-3 font-black ${themeStyle.headerText}`}>IP</th>
              <th className={`text-left p-3 font-black ${themeStyle.headerText}`}>유형</th>
              <th className={`text-left p-3 font-black ${themeStyle.headerText}`}>User-Agent</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) && items.length > 0 ? (
              items.map((row, idx) => (
                <tr key={idx} className={themeStyle.rowBorder}>
                  <td className={`p-3 font-bold ${themeStyle.cellText}`}>
                    {row?.createdAt || row?.dateTime || row?.loginAt || "-"}
                  </td>
                  <td className={`p-3 font-black ${themeStyle.cellText}`}>
                    {row?.success === false || row?.result === "FAIL"
                      ? "실패"
                      : "성공"}
                  </td>
                  <td className={`p-3 font-bold ${themeStyle.cellText}`}>{row?.loginIp ?? "-"}</td>
                  <td className={`p-3 font-bold ${themeStyle.cellText}`}>
                    {row?.provider || row?.type || "-"}
                  </td>
                  <td className={`p-3 font-bold truncate max-w-[220px] ${themeStyle.cellText}`}>
                    {row?.userAgent || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={`p-4 font-bold ${themeStyle.emptyText}`} colSpan={5}>
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
