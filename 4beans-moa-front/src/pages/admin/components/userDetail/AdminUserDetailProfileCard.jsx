import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OutlineCard from "./OutlineCard";
import { resolveProfileImageUrl } from "@/utils/profileImage";

/**
 * 관리자 회원 상세 프로필 카드
 * CSS 변수 기반 테마 적용
 */
export default function AdminUserDetailProfileCard({
  user,
  statusDotClass,
  isAdmin,
  isBlacklisted,
  goBackList,
  goLoginHistory,
  goBlacklistAdd,
}) {
  return (
    <OutlineCard>
      <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="w-20 h-20 border-[var(--theme-border-width)] border-[var(--theme-border)] bg-[var(--theme-primary-light)]">
              <AvatarImage
                src={resolveProfileImageUrl(user.profileImage)}
                className="object-cover"
              />
              <AvatarFallback className="bg-[var(--theme-primary-light)] text-2xl font-black text-[var(--theme-text)]">
                {user.nickname?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-[var(--theme-bg-card)] p-1.5 rounded-full border-[var(--theme-border-width)] border-[var(--theme-border)]">
              <div className={`w-3 h-3 rounded-full ${statusDotClass}`} />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-black text-[var(--theme-text)]">
                {user.nickname}
              </p>
              {isAdmin && (
                <Badge className="bg-[var(--theme-bg-card)] text-[var(--theme-text)] border-[var(--theme-border-width)] border-[var(--theme-border)] text-[10px] font-black">
                  ADMINISTRATOR
                </Badge>
              )}
              <Badge className="bg-[var(--theme-bg-card)] text-[var(--theme-text)] border-[var(--theme-border-width)] border-[var(--theme-border)] text-[10px] font-black">
                MEMBER
              </Badge>
              {isBlacklisted && (
                <Badge className="bg-red-500 text-white border-[var(--theme-border-width)] border-[var(--theme-border)] text-[10px] font-black">
                  BLACKLIST
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-[var(--theme-text-muted)] font-semibold">
              {user.userId}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:ml-auto">
          <Button
            type="button"
            onClick={goBackList}
            className="h-10 px-4 rounded-2xl border-[var(--theme-border-width)] border-[var(--theme-border)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] font-black hover:bg-[var(--theme-primary-light)]"
          >
            회원 목록
          </Button>

          <Button
            type="button"
            onClick={goLoginHistory}
            className="h-10 px-4 rounded-2xl border-[var(--theme-border-width)] border-[var(--theme-border)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] font-black hover:bg-[var(--theme-primary-light)]"
          >
            로그인 이력
          </Button>

          <Button
            type="button"
            onClick={goBlacklistAdd}
            className={`h-10 px-4 rounded-2xl border-[var(--theme-border-width)] border-[var(--theme-border)] font-black ${
              isBlacklisted
                ? 'bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-primary-hover)]'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isBlacklisted ? "블랙리스트 해제" : "블랙리스트 등록"}
          </Button>
        </div>
      </div>
    </OutlineCard>
  );
}
