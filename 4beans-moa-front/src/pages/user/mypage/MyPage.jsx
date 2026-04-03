import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMyPage } from "@/hooks/user/useMyPage";
import { useLoginHistory } from "@/hooks/user/useLoginHistory";
import { useBackupCodeModal } from "@/hooks/user/useBackupCodeModal";
import { useOtpStore } from "@/store/user/otpStore";
import { getMyParties } from "@/api/partyApi";
import httpClient from "@/api/httpClient";
import {
  KeyRound, Clock, CreditCard, Users, Wallet,
  UserMinus, UserPen, ChevronRight, LogOut, Shield,
  Bell, HelpCircle, MessageSquare, BellRing,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";

import { AccountInfoCard } from "./components/AccountInfoCard";
import { ConnectionStatusCard } from "./components/ConnectionStatusCard";
import { LoginHistoryCard } from "./components/LoginHistoryCard";
import { AdminMenu } from "./components/AdminMenu";
import { OtpDialog } from "./components/OtpDialog";
import { BackupCodeDialog } from "./components/BackupCodeDialog";
import { UpdateUserDialog } from "./components/UpdateUserDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";

// Glass card wrapper
function Section({ children, title, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--glass-bg-card)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-glass)",
      }}
    >
      {title && (
        <div className="px-5 pt-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--theme-text-muted)" }}>{title}</p>
        </div>
      )}
      {children}
    </motion.div>
  );
}

// Menu item row
function MenuItem({ icon: Icon, label, onClick, danger, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-3.5 transition-opacity active:opacity-70"
      style={{ borderBottom: "1px solid var(--glass-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: danger ? "rgba(239,68,68,0.1)" : active ? "var(--theme-primary)" : "var(--glass-bg-overlay)",
          }}
        >
          <Icon className="w-4 h-4"
            style={{ color: danger ? "#ef4444" : active ? "#fff" : "var(--theme-primary)" }} />
        </div>
        <span
          className="text-[14px] font-semibold"
          style={{ color: danger ? "#ef4444" : "var(--theme-text)" }}
        >
          {label}
        </span>
      </div>
      <ChevronRight className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
    </button>
  );
}

export default function MyPage() {
  const { state, actions } = useMyPage();
  const { user, isAdmin, marketingAgreed, googleConn, kakaoConn, loginProvider } = state;

  const otp = {
    enabled:   useOtpStore((s) => s.enabled),
    modalOpen: useOtpStore((s) => s.modalOpen),
    mode:      useOtpStore((s) => s.mode),
    qrUrl:     useOtpStore((s) => s.qrUrl),
    code:      useOtpStore((s) => s.code),
    loading:   useOtpStore((s) => s.loading),
  };

  const backup = useBackupCodeModal();
  const showUserUI = !isAdmin;

  const [activeView,        setActiveView]        = useState("main");
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [partyCount,        setPartyCount]        = useState(0);
  const [updateUserOpen,    setUpdateUserOpen]     = useState(false);
  const [deleteUserOpen,    setDeleteUserOpen]     = useState(false);

  const loginHistory      = useLoginHistory({ size: 10, enabled: activeView === "history" && !!user });
  const loginHistoryState = loginHistory?.state;

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.userId) return;
      try {
        const subResponse = await httpClient.get("/subscription", { params: { userId: user.userId } });
        const subs = Array.isArray(subResponse) ? subResponse : (subResponse?.data || []);
        setSubscriptionCount(subs.filter((s) => s.subscriptionStatus === "ACTIVE").length);

        const partyResponse = await getMyParties();
        const parties = partyResponse?.data ?? (Array.isArray(partyResponse) ? partyResponse : []);
        setPartyCount(parties.length);
      } catch (err) { console.error(err); }
    };
    fetchCounts();
  }, [user?.userId]);

  useEffect(() => {
    if (otp.enabled) backup.fetchExistingCodes();
  }, [otp.enabled]);

  useEffect(() => {
    if (user) useOtpStore.getState().setEnabled(!!user.otpEnabled);
  }, [user]);

  const handleOtpConfirm = async () => {
    const result = await actions.otp.confirmOtp?.();
    if (result?.success && result.mode === "enable") {
      if (backup.issued) await backup.openExistingCodes();
      else await backup.issueBackupCodes();
    }
  };

  if (!user) return null;

  // Menu items config
  const menuItems = [
    { icon: UserPen,  label: "회원정보 수정",  onClick: () => setUpdateUserOpen(true) },
    { icon: KeyRound, label: "비밀번호 변경",  onClick: () => actions.goChangePwd?.() || actions.goUpdatePassword?.() },
    { icon: CreditCard, label: "구독·결제 관리", onClick: () => actions.goSubscription?.() },
    { icon: Users,    label: "내 파티 목록",   onClick: () => actions.goMyParties?.() },
    { icon: Wallet,   label: "내 지갑",        onClick: () => actions.goWallet?.() },
    { icon: Shield,   label: "보안 설정",      onClick: () => setActiveView("security") },
    { icon: Clock,    label: "로그인 기록",    onClick: () => setActiveView("history"), active: activeView === "history" },
    { icon: UserMinus, label: "회원 탈퇴",     onClick: () => setDeleteUserOpen(true), danger: true },
  ];

  return (
    <div className="min-h-screen pb-8" style={{ background: "var(--theme-bg)" }}>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-5 pt-6 pb-5"
      >
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0"
            style={{ background: "var(--theme-primary)" }}
          >
            {user.nickname?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-[20px] font-bold" style={{ color: "var(--theme-text)" }}>
              {user.nickname}
            </h1>
            <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: CreditCard, label: "구독 상품", count: subscriptionCount, color: "var(--theme-primary)" },
            { icon: Users,      label: "가입 파티", count: partyCount,         color: "#10b981" },
          ].map(({ icon: Icon, label, count, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                background: "var(--glass-bg-card)",
                backdropFilter: "blur(var(--glass-blur))",
                WebkitBackdropFilter: "blur(var(--glass-blur))",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-glass)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}1a` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-[22px] font-black leading-none" style={{ color }}>{count}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--theme-text-muted)" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main view */}
      <div className="px-4 space-y-3">
        {showUserUI && activeView === "main" && (
          <>
            {/* Menu */}
            <Section delay={0.1}>
              {menuItems.map(({ icon, label, onClick, danger, active }) => (
                <MenuItem key={label} icon={icon} label={label} onClick={onClick} danger={danger} active={active} />
              ))}
              {/* Last item without border-bottom */}
              <div style={{ marginTop: -1 }} />
            </Section>

            {/* Account info */}
            <Section title="계정 정보" delay={0.15}>
              <AccountInfoCard
                user={user}
                marketingAgreed={marketingAgreed}
                formatDate={actions.formatDate}
              />
            </Section>

            {/* Connection & security */}
            <Section title="보안 · 연결" delay={0.2}>
              <div className="px-5 pb-5">
                <ConnectionStatusCard
                  user={user}
                  loginProvider={loginProvider}
                  googleConn={googleConn}
                  kakaoConn={kakaoConn}
                  otp={otp}
                  backup={backup}
                  actions={actions}
                />
              </div>
            </Section>

            {/* 알림 및 앱 환경 */}
            <Section title="알림 및 환경 설정" delay={0.22}>
              <div className="px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--glass-bg-overlay)" }}
                    >
                      <BellRing className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: "var(--theme-text)" }}>마케팅 정보 수신 동의</p>
                      <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>이벤트 및 혜택 정보를 받아보세요</p>
                    </div>
                  </div>
                  <Switch
                    checked={marketingAgreed}
                    onCheckedChange={() => actions.handleMarketingToggle?.(marketingAgreed)}
                    className="data-[state=checked]:bg-[var(--theme-primary)]"
                  />
                </div>
              </div>
            </Section>

            {/* Customer center */}
            <Section title="고객센터" delay={0.25}>
              <MenuItem
                icon={Bell}
                label="공지사항"
                onClick={() => actions.navigate("/community/notice")}
              />
              <MenuItem
                icon={HelpCircle}
                label="자주 묻는 질문"
                onClick={() => actions.navigate("/community/faq")}
              />
              <MenuItem
                icon={MessageSquare}
                label="문의하기"
                onClick={() => actions.navigate("/community/inquiry")}
              />
            </Section>
          </>
        )}

        {/* Login history view */}
        {showUserUI && activeView === "history" && (
          <Section delay={0}>
            <div className="p-5">
              <LoginHistoryCard
                loginHistory={loginHistoryState}
                onBack={() => setActiveView("main")}
              />
            </div>
          </Section>
        )}

        {/* Security view */}
        {showUserUI && activeView === "security" && (
          <Section delay={0}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setActiveView("main")}
                  className="text-[13px] font-medium" style={{ color: "var(--theme-primary)" }}>
                  ← 돌아가기
                </button>
              </div>
              <ConnectionStatusCard
                user={user}
                loginProvider={loginProvider}
                googleConn={googleConn}
                kakaoConn={kakaoConn}
                otp={otp}
                backup={backup}
                actions={actions}
              />
            </div>
          </Section>
        )}

        {/* Admin menu */}
        {isAdmin && (
          <Section title="관리자" delay={0.1}>
            <div className="px-5 pb-5">
              <AdminMenu actions={actions} />
            </div>
          </Section>
        )}
      </div>

      {/* Dialogs */}
      {showUserUI && (
        <>
          <OtpDialog
            open={otp.modalOpen}
            onOpenChange={actions.handleOtpModalChange}
            otp={otp}
            actions={actions}
            handleOtpConfirm={handleOtpConfirm}
          />
          <BackupCodeDialog backup={backup} />
          <UpdateUserDialog open={updateUserOpen} onOpenChange={setUpdateUserOpen} />
          <DeleteUserDialog open={deleteUserOpen} onOpenChange={setDeleteUserOpen} />
        </>
      )}
    </div>
  );
}
