import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ListChecks, CreditCard, Wallet } from "lucide-react";
import OutlineCard from "./OutlineCard";
import MenuButton from "./MenuButton";

export default function AdminUserDetailSidebar({ userEmail, goLoginHistory }) {
  return (
    <OutlineCard>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-black tracking-[0.18em] text-slate-900 flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          계정 메뉴
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-4 flex flex-col gap-3">
        <MenuButton
          icon={<ListChecks className="w-4 h-4" />}
          label="로그인 이력"
          onClick={goLoginHistory}
          active
        />
        <MenuButton
          icon={<CreditCard className="w-4 h-4" />}
          label="구독·약정 관리"
          onClick={() =>
            window.location.assign(
              `/admin/subscription?user=${encodeURIComponent(userEmail)}`
            )
          }
        />
        <MenuButton
          icon={<Wallet className="w-4 h-4" />}
          label="결제/정산 내역"
          onClick={() =>
            window.location.assign(
              `/admin/financial-history?user=${encodeURIComponent(userEmail)}`
            )
          }
        />
      </CardContent>
    </OutlineCard>
  );
}
