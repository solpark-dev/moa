import { Badge } from "@/components/ui/badge";

/**
 * 상태 배지 컴포넌트
 * 시맨틱 상태 색상 사용 (테마 무관)
 */

// 상태별 고정 스타일 (시맨틱 컬러)
const statusStyles = {
  blacklist: "bg-red-500 hover:bg-red-500 text-white",
  BLOCK: "bg-orange-500 hover:bg-orange-500 text-white",
  WITHDRAW: "bg-slate-400 hover:bg-slate-400 text-white",
  PENDING: "bg-yellow-400 hover:bg-yellow-400 text-slate-900",
  ACTIVE: "bg-emerald-500 hover:bg-emerald-500 text-white",
};

export default function StatusBadge({ status, blacklisted }) {
  if (blacklisted) {
    return (
      <Badge className={`${statusStyles.blacklist} text-xs font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-full`}>
        블랙리스트
      </Badge>
    );
  }

  const labels = {
    BLOCK: "이용제한",
    WITHDRAW: "탈퇴",
    PENDING: "미인증",
    ACTIVE: "정상",
  };
  const key = status === "ACTIVE" || !statusStyles[status] ? "ACTIVE" : status;

  return (
    <Badge
      className={`${statusStyles[key]} text-xs font-black border border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] rounded-full`}
    >
      {labels[key]}
    </Badge>
  );
}
