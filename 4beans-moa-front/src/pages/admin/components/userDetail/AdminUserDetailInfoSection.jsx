import { Separator } from "@/components/ui/separator";
import { User, Zap } from "lucide-react";
import InfoCard from "./InfoCard";
import InfoRow from "./InfoRow";
import SocialButton from "./SocialButton";

export default function AdminUserDetailInfoSection({
  user,
  formatDate,
  emailValueClass,
  isGoogleConnected,
  isKakaoConnected,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoCard title="사용자 정보" icon={<User className="w-4 h-4" />}>
        <InfoRow
          label="이메일"
          value={user.userId}
          valueClass={emailValueClass}
        />
        <InfoRow label="닉네임" value={user.nickname} />
        <InfoRow label="가입일" value={formatDate(user.regDate)} />
        <InfoRow
          label="마케팅 동의"
          value={user.agreeMarketing ? "수신 동의됨" : "미동의"}
          valueClass={
            user.agreeMarketing ? "text-emerald-600" : "text-slate-500"
          }
        />
      </InfoCard>

      <InfoCard title="연결 정보" icon={<Zap className="w-4 h-4" />}>
        <InfoRow label="휴대폰" value={user.phone} />
        <InfoRow
          label="로그인 방식"
          value={user.loginProvider || "EMAIL"}
          valueClass="uppercase text-slate-900"
        />

        <Separator className="my-4 bg-slate-200" />

        <div className="space-y-3">
          <p className="text-xs font-black tracking-[0.18em] text-slate-900">
            연동 계정
          </p>
          <div className="flex flex-col gap-3">
            <SocialButton provider="google" isConnected={isGoogleConnected} />
            <SocialButton provider="kakao" isConnected={isKakaoConnected} />
          </div>
        </div>
      </InfoCard>
    </div>
  );
}
