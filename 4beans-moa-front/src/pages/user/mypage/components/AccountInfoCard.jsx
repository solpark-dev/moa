import { InfoRow } from "./InfoCard";

export function AccountInfoCard({ user, marketingAgreed, formatDate }) {
  if (!user) return null;
  return (
    <div className="px-5 pb-4">
      <InfoRow label="이메일" value={user.userId} />
      <InfoRow label="닉네임" value={user.nickname} />
      <InfoRow label="가입일" value={formatDate(user.regDate)} />
      <InfoRow
        label="마케팅 동의"
        value={marketingAgreed ? "동의함" : "미동의"}
        valueClass={marketingAgreed ? "text-emerald-500" : undefined}
      />
    </div>
  );
}
