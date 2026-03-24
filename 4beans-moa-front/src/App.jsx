import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import RequireAuth from "@/routes/RequireAuth";
import { useGlobalLinkHandler } from "@/hooks/common/useGlobalLinkHandler";

import ProtectedRoute from "@/routes/ProtectedRoute";
import OAuthCallbackPage from "./pages/oauth/OAuthCallbackPage";
import PhoneConnectPage from "./pages/oauth/PhoneConnectPage";
import SocialRegisterPage from "@/pages/user/register/SocialRegisterPage";
import MainPage from "./pages/main/MainPage";
import PartyListPage from "./pages/party/PartyListPage";
import PartyCreatePage from "./pages/party/PartyCreatePage";
import PartyDetailPage from "./pages/party/PartyDetailPage";
import PartyListPageO from "./pages/party/PartyListPageO";
import PartyListPageZO3 from "./pages/party/PartyListPageZO3";

import AddUserPage from "./pages/user/register/AddUserPage";
import LoginPage from "./pages/user/login/LoginPage";
import FindIdPage from "./pages/user/findId/FindIdPage";
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
import AdminAuthGuard from "@/pages/admin/components/AdminAuthGuard";

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

import ScrollToTop from "./components/common/ScrollToTop";
import PineappleEasterEgg from "./components/common/PineappleEasterEgg";
import FloatingButtonsContainer from "./components/common/FloatingButtonsContainer";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { themeConfig } from "./config/themeConfig";
import { NeoBackground } from "./components/common/neo";
import { SnowPlowProvider } from "./components/christmas/SnowPlow";

// Inner App component that uses SnowPlow context
function AppContent() {
  useGlobalLinkHandler();
  const location = useLocation();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const currentTheme = themeConfig[theme] || themeConfig.pop;

  // Pineapple easter egg state
  const [pineappleEnabled, setPineappleEnabled] = useState(false);

  // Check if current route is admin page (kept for reference, but no longer hides header)
  const isAdminPage = location.pathname.startsWith("/admin");

  // CSS Variables Injection
  useEffect(() => {
    const currentThemeConfig = themeConfig[theme] || themeConfig.pop;
    const cssVars = currentThemeConfig.cssVars;
    if (cssVars) {
      Object.entries(cssVars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [theme]);

  // Theme Keyboard Shortcuts: Ctrl+Shift+1~4
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        // e.code를 사용하여 Shift 키 조합에서도 정확히 감지
        const themeMap = {
          'Digit1': 'pop',
          'Digit2': 'classic',
          'Digit3': 'dark',
          'Digit4': 'christmas',
        };
        const newTheme = themeMap[e.code];
        if (newTheme) {
          e.preventDefault();
          setTheme(newTheme);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setTheme]);

  // Easter egg for specific test accounts
  const showEasterEgg =
    user && (user.userId === "usertest1" || user.userId === "admintest");

  // 테마별 배경색 설정 (NeoBackground가 보이도록 투명)
  const getBgClass = () => {
    switch (theme) {
      case "dark":
        return "bg-[#0B1120] text-white";
      case "christmas":
        return "bg-transparent text-black";
      case "pop":
        return "bg-transparent text-black";
      default:
        return "bg-transparent text-black";
    }
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col transition-colors duration-300 ${getBgClass()}`}
    >
      <NeoBackground />
      <ScrollToTop />
      {showEasterEgg && pineappleEnabled && <PineappleEasterEgg showToggle={false} />}
      <FloatingButtonsContainer
        showPineapple={showEasterEgg}
        pineappleEnabled={pineappleEnabled}
        setPineappleEnabled={setPineappleEnabled}
      />

      {/* Header - Always visible */}
      <Header />

      <main
        className="flex-1 transition-all duration-500 ease-out"
        style={{ paddingTop: "5rem" }}
      >
        <Routes>
          {/* Main/Party */}
          <Route path="/" element={<MainPage />} />
          <Route path="/party" element={<PartyListPage />} />
          <Route path="/party/create" element={<PartyCreatePage />} />
          <Route path="/party/:id" element={<PartyDetailPage />} />
          <Route path="/party-test/o" element={<PartyListPageO />} />
          <Route path="/party-test/zo3" element={<PartyListPageZO3 />} />

          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/oauth/phone-connect" element={<PhoneConnectPage />} />
          {/* User pages (Public) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<AddUserPage />} />
          <Route path="/find-email" element={<FindIdPage />} />
          <Route path="/register/social" element={<SocialRegisterPage />} />
          <Route path="/reset-password" element={<ResetPwdPage />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route
            path="/mypage"
            element={
              <RequireAuth>
                <MyPage />
              </RequireAuth>
            }
          />
          <Route
            path="/user/register/social"
            element={<SocialRegisterPage />}
          />

          {/* User pages (Private - ProtectedRoute) */}
          <Route
            path="/mypage"
            element={<ProtectedRoute element={<MyPage />} />}
          />
          <Route
            path="/mypage/password"
            element={<ProtectedRoute element={<UpdatePwdPage />} />}
          />
          <Route
            path="/mypage/delete"
            element={<ProtectedRoute element={<DeleteUserPage />} />}
          />
          <Route
            path="/user/financial-history"
            element={<ProtectedRoute element={<FinancialHistoryPage />} />}
          />
          <Route
            path="/user/wallet"
            element={<ProtectedRoute element={<MyWalletPage />} />}
          />
          <Route
            path="/user/my-wallet"
            element={<ProtectedRoute element={<MyWalletPage />} />}
          />
          <Route
            path="/mypage/wallet"
            element={<ProtectedRoute element={<MyWalletPage />} />}
          />
          <Route
            path="/user/account-register"
            element={<ProtectedRoute element={<BankVerificationPage />} />}
          />
          <Route
            path="/user/account-verify"
            element={<ProtectedRoute element={<BankVerificationPage />} />}
          />
          <Route
            path="/account/verify"
            element={<ProtectedRoute element={<BankVerificationPage />} />}
          />
          <Route
            path="/my-parties"
            element={<ProtectedRoute element={<MyPartyListPage />} />}
          />
          {/* Complex conditional rendering handled by ProtectedRoute */}
          <Route
            path="/mypage/edit"
            element={<ProtectedRoute element={<UpdateUserPage />} />}
          />
          <Route
            path="/admin/blacklist/add"
            element={
              <AdminAuthGuard>
                <AddBlacklistPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminAuthGuard>
                <AdminUserListPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminAuthGuard>
                <AdminDashboardPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/chart-comparison"
            element={
              <AdminAuthGuard>
                <ChartComparisonPage />
              </AdminAuthGuard>
            }
          />
          <Route path="/admin/users" element={<AdminUserListPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route
            path="/admin/chart-comparison"
            element={<ChartComparisonPage />}
          />
          <Route
            path="/admin/users/:userId"
            element={
              <AdminAuthGuard>
                <AdminUserDetailPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/blacklist/delete"
            element={
              <AdminAuthGuard>
                <AdminBlacklistDeletePage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/users/:userId/login-history"
            element={
              <AdminAuthGuard>
                <AdminLoginHistoryPage />
              </AdminAuthGuard>
            }
          />
          <Route path="/product" element={<GetProductList />} />
          <Route path="/product/:id" element={<GetProduct />} />

          <Route
            path="/product/:id/delete"
            element={<ProtectedRoute element={<DeleteProduct />} />}
          // TODO: Add role check for ADMIN
          />
          <Route
            path="/subscription/add/:productId"
            element={<ProtectedRoute element={<AddSubscription />} />}
          />
          <Route
            path="/subscription"
            element={<ProtectedRoute element={<GetSubscriptionList />} />}
          />
          <Route
            path="/subscription/:id"
            element={<ProtectedRoute element={<GetSubscription />} />}
          />
          <Route
            path="/subscription/:id/edit"
            element={<ProtectedRoute element={<UpdateSubscription />} />}
          />
          <Route
            path="/subscription/:id/cancel"
            element={<ProtectedRoute element={<CancelSubscription />} />}
          />
          {/* Support/Community & payments */}
          <Route path="/subscriptions" element={<GetProductList />} />
          <Route path="/my/subscriptions" element={<UserSubscriptionList />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route
            path="/payment/billing/register"
            element={<BillingRegisterPage />}
          />
          <Route
            path="/payment/billing/success"
            element={<BillingSuccessPage />}
          />
          <Route
            path="/payment/billing/fail"
            element={<BillingFailPage />}
          />

          <Route path="/community/notice" element={<ListNotice />} />
          <Route
            path="/community/notice/:communityId"
            element={<GetNotice />}
          />
          <Route path="/community/notice/add" element={<AddNotice />} />
          <Route
            path="/community/notice/update/:communityId"
            element={<UpdateNotice />}
          />

          <Route path="/community/faq" element={<ListFaq />} />
          <Route path="/community/faq/add" element={<AddFaq />} />

          <Route path="/community/inquiry" element={<Inquiry />} />
          <Route path="/community/inquiry/admin" element={<InquiryAdmin />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// Main App wrapper with SnowPlowProvider
export default function App() {
  return (
    <SnowPlowProvider>
      <AppContent />
    </SnowPlowProvider>
  );
}


