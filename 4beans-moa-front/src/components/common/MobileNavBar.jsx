import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import NotificationPopover from "@/components/push/NotificationPopover";

const ROUTE_TITLES = {
  "/party": "파티 찾기",
  "/party/create": "파티 만들기",
  "/my/subscriptions": "내 구독",
  "/mypage": "마이페이지",
  "/mypage/edit": "정보 수정",
  "/mypage/password": "비밀번호 변경",
  "/mypage/delete": "회원 탈퇴",
  "/mypage/wallet": "내 지갑",
  "/user/wallet": "내 지갑",
  "/user/financial-history": "거래 내역",
  "/user/account-register": "계좌 등록",
  "/user/account-verify": "계좌 인증",
  "/account/verify": "계좌 인증",
  "/my-parties": "내 파티",
  "/community/notice": "공지사항",
  "/community/faq": "자주 묻는 질문",
  "/community/inquiry": "문의하기",
  "/product": "구독 상품",
  "/subscription": "구독 관리",
  "/payment/success": "결제 완료",
};

function getTitle(pathname) {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  if (pathname.startsWith("/party/")) return "파티 상세";
  if (pathname.startsWith("/product/")) return "상품 상세";
  if (pathname.startsWith("/subscription/")) return "구독 상세";
  if (pathname.startsWith("/community/notice/")) return "공지사항";
  return "";
}

export default function MobileNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const isHome = location.pathname === "/";
  const title = getTitle(location.pathname);

  const initial = user?.nickname?.[0]?.toUpperCase()
    || user?.userId?.[0]?.toUpperCase()
    || "U";

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full max-w-[390px] h-14 flex items-center"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div className="flex items-center justify-between w-full px-5">
        {/* Left: logo or back button */}
        {isHome ? (
          <span
            className="display text-[22px]"
            style={{ color: "var(--theme-primary)" }}
          >
            moa
          </span>
        ) : (
          <button
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-opacity active:opacity-60"
            style={{
              background: "var(--glass-bg-overlay)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <ChevronLeft
              className="w-5 h-5"
              style={{ color: "var(--theme-text)" }}
              strokeWidth={2.5}
            />
          </button>
        )}

        {/* Center: page title (non-home) */}
        {!isHome && title && (
          <span
            className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold pointer-events-none"
            style={{ color: "var(--theme-text)" }}
          >
            {title}
          </span>
        )}

        {/* Right: notifications + avatar */}
        <div className="flex items-center gap-2">
          <NotificationPopover />

          {user ? (
            <button
              onClick={() => navigate("/mypage")}
              aria-label="마이페이지"
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-opacity active:opacity-60"
              style={{
                background: "var(--glass-bg-overlay)",
                color: "var(--theme-primary)",
                border: "1.5px solid var(--glass-border)",
              }}
            >
              {initial}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity active:opacity-60"
              style={{
                background: "var(--theme-primary)",
                color: "#fff",
              }}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
