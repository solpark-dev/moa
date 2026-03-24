import { useParams } from "react-router-dom";
import { useAdminUserDetailLogic } from "@/hooks/admin/useAdminUserDetail";
import { useAdminLoginHistory } from "@/hooks/admin/useAdminLoginHistory";
import { useMyPageStore } from "@/store/user/myPageStore";
import AdminAuthGuard from "./components/AdminAuthGuard";

import AdminUserDetailHeader from "./components/userDetail/AdminUserDetailHeader";
import AdminUserDetailSidebar from "./components/userDetail/AdminUserDetailSidebar";
import AdminUserDetailProfileCard from "./components/userDetail/AdminUserDetailProfileCard";
import AdminUserDetailInfoSection from "./components/userDetail/AdminUserDetailInfoSection";
import AdminUserDetailLoginHistorySection from "./components/userDetail/AdminUserDetailLoginHistorySection";

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const {
    user,
    loading,
    error,
    formatDate,
    goBackList,
    goBlacklistAdd,
    goLoginHistory,
  } = useAdminUserDetailLogic(userId);

  const loginHistory = useAdminLoginHistory(userId);
  const {
    state: {
      items: historyItems,
      page: historyPage,
      pages: historyPages,
      pageCount: historyPageCount,
      loading: historyLoading,
      totalCount: historyTotalCount,
    },
    actions: {
      goFirst: goHistoryFirst,
      goPrev: goHistoryPrev,
      goPage: goHistoryPage,
      goNextBlock: goHistoryNextBlock,
      goLast: goHistoryLast,
    },
  } = loginHistory;

  const { isAdmin } = useMyPageStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent relative z-10">
        <p className="text-sm font-bold text-slate-600">
          회원 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent relative z-10">
        <p className="text-sm font-bold text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  const googleConn = user.oauthConnections?.find(
    (c) => c.provider === "google" && !c.releaseDate
  );
  const kakaoConn = user.oauthConnections?.find(
    (c) => c.provider === "kakao" && !c.releaseDate
  );

  const shortId = user.userId?.split("@")[0] || user.userId;
  const isBlacklisted = !!user.blacklisted;

  const statusDotClass = (() => {
    if (isBlacklisted) return "bg-red-500";
    if (user.status === "PENDING" || user.status === "WITHDRAW")
      return "bg-slate-400";
    return "bg-emerald-500";
  })();

  const emailValueClass = isBlacklisted ? "text-red-500" : "text-slate-900";

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-transparent text-slate-900 relative z-10">
        <AdminUserDetailHeader shortId={shortId} />

        <div className="bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid lg:grid-cols-[minmax(0,280px)_1fr] gap-8">
              <aside className="w-full">
                <AdminUserDetailSidebar
                  userEmail={user.userId}
                  goLoginHistory={goLoginHistory}
                />
              </aside>

              <main className="w-full space-y-6">
                <AdminUserDetailProfileCard
                  user={user}
                  statusDotClass={statusDotClass}
                  isAdmin={isAdmin}
                  isBlacklisted={isBlacklisted}
                  goBackList={goBackList}
                  goLoginHistory={goLoginHistory}
                  goBlacklistAdd={goBlacklistAdd}
                />

                <AdminUserDetailInfoSection
                  user={user}
                  formatDate={formatDate}
                  emailValueClass={emailValueClass}
                  isGoogleConnected={!!googleConn}
                  isKakaoConnected={!!kakaoConn}
                />

                <AdminUserDetailLoginHistorySection
                  historyLoading={historyLoading}
                  historyItems={historyItems}
                  historyTotalCount={historyTotalCount}
                  historyPage={historyPage}
                  historyPages={historyPages}
                  historyPageCount={historyPageCount}
                  goHistoryFirst={goHistoryFirst}
                  goHistoryPrev={goHistoryPrev}
                  goHistoryPage={goHistoryPage}
                  goHistoryNextBlock={goHistoryNextBlock}
                  goHistoryLast={goHistoryLast}
                />
              </main>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
