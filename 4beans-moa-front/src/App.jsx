import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { useGlobalLinkHandler } from "@/hooks/common/useGlobalLinkHandler";
import ScrollToTop from "./components/common/ScrollToTop";
import MobileNavBar from "./components/common/MobileNavBar";
import BottomNavigation from "./components/common/BottomNavigation";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ToastContainer from "./components/common/ToastContainer";

// Admin layout components (kept full-width)
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import PineappleEasterEgg from "./components/common/PineappleEasterEgg";
import FloatingButtonsContainer from "./components/common/FloatingButtonsContainer";
import { NeoBackground } from "./components/common/neo";

import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminAuthGuard from "@/pages/admin/components/AdminAuthGuard";

// Pages
import OAuthCallbackPage from "./pages/oauth/OAuthCallbackPage";
import PhoneConnectPage from "./pages/oauth/PhoneConnectPage";
import SocialRegisterPage from "@/pages/user/register/SocialRegisterPage";
import MainPage from "./pages/main/MainPage";
import PartyListPage from "./pages/party/PartyListPage";
import PartyCreatePage from "./pages/party/PartyCreatePage";
import PartyDetailPage from "./pages/party/PartyDetailPage";
import AddUserPage from "./pages/user/register/AddUserPage";
import LoginPage from "./pages/user/login/LoginPage";
import MagicLinkPage from "./pages/user/login/MagicLinkPage";
import MagicLinkCallbackPage from "./pages/user/login/MagicLinkCallbackPage";
import ResetPwdPage from "./pages/user/resetPwd/ResetPwdPage";
import UpdatePwdPage from "./pages/user/resetPwd/UpdatePwdPage";
import DeleteUserPage from "./pages/user/register/DeleteUserPage";
import MyPage from "./pages/user/mypage/MyPage";
import EmailVerifiedPage from "./pages/user/register/EmailVerifiedPage";
import UpdateUserPage from "./pages/user/mypage/UpdateUserPage";
import FinancialHistoryPage from "./pages/user/FinancialHistoryPage";
import MyWalletPage from "./pages/user/MyWalletPage";
import BankVerificationPage from "./pages/account/BankVerificationPage";
import MyPartyListPage from "./pages/party/MyPartyListPage";
import AddBlacklistPage from "./pages/admin/AddBlacklistPage";
import AdminUserListPage from "@/pages/admin/AdminUserListPage";
import AdminUserDetailPage from "@/pages/admin/AdminUserDetailPage";
import AdminBlacklistDeletePage from "@/pages/admin/RemoveBlacklistPage";
import AdminLoginHistoryPage from "@/pages/admin/AdminLoginHistoryPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import ChartComparisonPage from "@/pages/admin/ChartComparisonPage";
import GetProductList from "./pages/product/GetProductList";
import GetProduct from "./pages/product/GetProduct";
import DeleteProduct from "./pages/product/DeleteProduct";
import AddSubscription from "./pages/subscription/AddSubscription";
import GetSubscriptionList from "./pages/subscription/GetSubscriptionList";
import GetSubscription from "./pages/subscription/GetSubscription";
import UpdateSubscription from "./pages/subscription/UpdateSubscription";
import CancelSubscription from "./pages/subscription/CancelSubscription";
import UserSubscriptionList from "./pages/subscription/UserSubscriptionList";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import BillingSuccessPage from "./pages/payment/BillingSuccessPage";
import BillingRegisterPage from "./pages/payment/BillingRegisterPage";
import BillingFailPage from "./pages/payment/BillingFailPage";
import ListNotice from "./pages/community/ListNotice";
import GetNotice from "./pages/community/GetNotice";
import AddNotice from "./pages/community/AddNotice";
import UpdateNotice from "./pages/community/UpdateNotice";
import ListFaq from "./pages/community/ListFaq";
import AddFaq from "./pages/community/AddFaq";
import Inquiry from "./pages/community/Inquiry";
import InquiryAdmin from "./pages/community/InquiryAdmin";
import NotFoundPage from "./pages/error/NotFoundPage";

import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { themeConfig } from "./config/themeConfig";

// Routes where the mobile nav bars are hidden (auth / payment flows)
const NO_NAV_PATHS = [
  "/login",
  "/signup",
  "/reset-password",
  "/login/magic",
  "/auth/magic",
  "/email-verified",
  "/register/social",
  "/user/register/social",
  "/oauth/callback",
  "/oauth/phone-connect",
  "/payment/billing",
];

function shouldHideNav(pathname) {
  return NO_NAV_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function AppRoutes() {
  return (
    <Routes>
      {/* Main / Party */}
      <Route path="/" element={<MainPage />} />
      <Route path="/party" element={<PartyListPage />} />
      <Route path="/party/create" element={<PartyCreatePage />} />
      <Route path="/party/:id" element={<PartyDetailPage />} />

      {/* OAuth */}
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      <Route path="/oauth/phone-connect" element={<PhoneConnectPage />} />

      {/* Auth (public) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/magic" element={<MagicLinkPage />} />
      <Route path="/auth/magic" element={<MagicLinkCallbackPage />} />
      <Route path="/signup" element={<AddUserPage />} />
      <Route path="/register/social" element={<SocialRegisterPage />} />
      <Route path="/reset-password" element={<ResetPwdPage />} />
      <Route path="/email-verified" element={<EmailVerifiedPage />} />
      <Route path="/user/register/social" element={<SocialRegisterPage />} />

      {/* User (protected) */}
      <Route path="/mypage" element={<ProtectedRoute element={<MyPage />} />} />
      <Route path="/mypage/password" element={<ProtectedRoute element={<UpdatePwdPage />} />} />
      <Route path="/mypage/delete" element={<ProtectedRoute element={<DeleteUserPage />} />} />
      <Route path="/mypage/edit" element={<ProtectedRoute element={<UpdateUserPage />} />} />
      <Route path="/user/financial-history" element={<ProtectedRoute element={<FinancialHistoryPage />} />} />
      <Route path="/user/wallet" element={<ProtectedRoute element={<MyWalletPage />} />} />
      <Route path="/user/my-wallet" element={<ProtectedRoute element={<MyWalletPage />} />} />
      <Route path="/mypage/wallet" element={<ProtectedRoute element={<MyWalletPage />} />} />
      <Route path="/user/account-register" element={<ProtectedRoute element={<BankVerificationPage />} />} />
      <Route path="/user/account-verify" element={<ProtectedRoute element={<BankVerificationPage />} />} />
      <Route path="/account/verify" element={<ProtectedRoute element={<BankVerificationPage />} />} />
      <Route path="/my-parties" element={<ProtectedRoute element={<MyPartyListPage />} />} />

      {/* Product */}
      <Route path="/product" element={<GetProductList />} />
      <Route path="/product/:id" element={<GetProduct />} />
      <Route path="/product/:id/delete" element={<ProtectedRoute element={<DeleteProduct />} />} />
      <Route path="/subscriptions" element={<GetProductList />} />

      {/* Subscription */}
      <Route path="/subscription/add/:productId" element={<ProtectedRoute element={<AddSubscription />} />} />
      <Route path="/subscription" element={<ProtectedRoute element={<GetSubscriptionList />} />} />
      <Route path="/subscription/:id" element={<ProtectedRoute element={<GetSubscription />} />} />
      <Route path="/subscription/:id/edit" element={<ProtectedRoute element={<UpdateSubscription />} />} />
      <Route path="/subscription/:id/cancel" element={<ProtectedRoute element={<CancelSubscription />} />} />
      <Route path="/my/subscriptions" element={<ProtectedRoute element={<UserSubscriptionList />} />} />

      {/* Payment */}
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/billing/register" element={<BillingRegisterPage />} />
      <Route path="/payment/billing/success" element={<BillingSuccessPage />} />
      <Route path="/payment/billing/fail" element={<BillingFailPage />} />

      {/* Community */}
      <Route path="/community/notice" element={<ListNotice />} />
      <Route path="/community/notice/:communityId" element={<GetNotice />} />
      <Route path="/community/notice/add" element={<AddNotice />} />
      <Route path="/community/notice/update/:communityId" element={<UpdateNotice />} />
      <Route path="/community/faq" element={<ListFaq />} />
      <Route path="/community/faq/add" element={<AddFaq />} />
      <Route path="/community/inquiry" element={<Inquiry />} />
      <Route path="/community/inquiry/admin" element={<InquiryAdmin />} />

      {/* Admin */}
      <Route path="/admin/blacklist/add" element={<AdminAuthGuard><AddBlacklistPage /></AdminAuthGuard>} />
      <Route path="/admin/users" element={<AdminAuthGuard><AdminUserListPage /></AdminAuthGuard>} />
      <Route path="/admin/dashboard" element={<AdminAuthGuard><AdminDashboardPage /></AdminAuthGuard>} />
      <Route path="/admin/chart-comparison" element={<AdminAuthGuard><ChartComparisonPage /></AdminAuthGuard>} />
      <Route path="/admin/users/:userId" element={<AdminAuthGuard><AdminUserDetailPage /></AdminAuthGuard>} />
      <Route path="/admin/blacklist/delete" element={<AdminAuthGuard><AdminBlacklistDeletePage /></AdminAuthGuard>} />
      <Route path="/admin/users/:userId/login-history" element={<AdminAuthGuard><AdminLoginHistoryPage /></AdminAuthGuard>} />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function AppContent() {
  useGlobalLinkHandler();
  const location = useLocation();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const isAdminPage = location.pathname.startsWith("/admin");
  const hideNav = shouldHideNav(location.pathname);
  const showNav = !isAdminPage && !hideNav;

  const [pineappleEnabled, setPineappleEnabled] = useState(false);
  const showEasterEgg = user && (user.userId === "usertest1" || user.userId === "admintest");

  // CSS variable injection on theme change
  useEffect(() => {
    const currentThemeConfig = themeConfig[theme] || themeConfig.light;
    const cssVars = currentThemeConfig.cssVars;
    if (cssVars) {
      Object.entries(cssVars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [theme]);

  // Theme keyboard shortcuts: Ctrl+Shift+1 (light) / Ctrl+Shift+2 (dark)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        const themeMap = { Digit1: "light", Digit2: "dark" };
        const newTheme = themeMap[e.code];
        if (newTheme) {
          e.preventDefault();
          setTheme(newTheme);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setTheme]);

  // ── Admin layout (full-width, keeps original Header/Footer) ──────────
  if (isAdminPage) {
    return (
      <div
        data-theme={theme}
        className={`min-h-screen flex flex-col transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0B1120] text-white" : "bg-transparent text-black"
        }`}
      >
        <NeoBackground />
        <ScrollToTop />
        {showEasterEgg && pineappleEnabled && <PineappleEasterEgg showToggle={false} />}
        <FloatingButtonsContainer
          showPineapple={showEasterEgg}
          pineappleEnabled={pineappleEnabled}
          setPineappleEnabled={setPineappleEnabled}
        />
        <Header />
        <main className="flex-1 transition-all duration-500 ease-out" style={{ paddingTop: "5rem" }}>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    );
  }

  // ── Mobile layout (390px centered) ───────────────────────────────────
  const orbBg =
    theme === "dark"
      ? "radial-gradient(ellipse 600px 500px at 15% 30%, rgba(37,99,235,0.10) 0%, transparent 70%), radial-gradient(ellipse 500px 400px at 85% 70%, rgba(14,165,233,0.08) 0%, transparent 70%), #0B1120"
      : "radial-gradient(ellipse 600px 500px at 15% 30%, rgba(37,99,235,0.07) 0%, transparent 70%), radial-gradient(ellipse 500px 400px at 85% 70%, rgba(14,165,233,0.05) 0%, transparent 70%), #f0f4f8";

  return (
    <div
      data-theme={theme}
      className="min-h-screen flex justify-center"
      style={{ background: orbBg }}
    >
      <ScrollToTop />
      <div
        className="relative w-full max-w-[390px] min-h-screen flex flex-col overflow-x-hidden"
        style={{
          background: "var(--theme-bg)",
          boxShadow: "0 0 60px rgba(0,0,0,0.12)",
        }}
      >
        {showNav && <MobileNavBar />}
        <main className={`flex-1 ${showNav ? "pt-14 pb-20" : ""}`}>
          <AppRoutes />
        </main>
        {showNav && <BottomNavigation />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
      <ToastContainer />
    </ErrorBoundary>
  );
}
