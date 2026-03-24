import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, User, UserX, LayoutDashboard } from "lucide-react";
import { MenuButton } from "./MenuButton";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const adminMenuThemeStyles = {
  pop: {
    cardShadow: "shadow-2xl",
  },
  christmas: {
    cardShadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
  },
};

export function AdminMenu({ actions }) {
  const { theme } = useThemeStore();
  const themeStyle = adminMenuThemeStyles[theme] || adminMenuThemeStyles.pop;

  return (
    <Card className={`bg-white border border-gray-200 ${themeStyle.cardShadow} rounded-3xl`}>
      <CardHeader className="pb-2 pt-6 px-6">
        <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          Admin Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col gap-2">
        <MenuButton
          icon={<User className="w-4 h-4" />}
          label="회원 관리"
          onClick={actions.goAdminUserList}
        />
        <MenuButton
          icon={<UserX className="w-4 h-4" />}
          label="블랙리스트 관리"
          variant="destructive"
          onClick={actions.goAdminBlacklist}
        />
        <MenuButton
          icon={<LayoutDashboard className="w-4 h-4" />}
          label="관리자 홈"
          onClick={actions.goAdminHome}
        />
      </CardContent>
    </Card>
  );
}
