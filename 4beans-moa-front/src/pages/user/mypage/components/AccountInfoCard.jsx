import { User } from "lucide-react";
import { InfoCard, InfoRow } from "./InfoCard";

export function AccountInfoCard({ user, marketingAgreed, formatDate }) {
  if (!user) return null;
  return (
    <InfoCard title="계정 정보" icon={<User className="w-4 h-4" />}>
      <InfoRow label="이메일" value={user.userId} />
      <InfoRow label="닉네임" value={user.nickname} />
      <InfoRow label="가입일" value={formatDate(user.regDate)} />
      <InfoRow
        label="마케팅 동의"
        value={marketingAgreed ? "동의함" : "미동의"}
        valueClass={marketingAgreed ? "text-emerald-600" : "text-slate-400"}
      />
    </InfoCard>
  );
}
