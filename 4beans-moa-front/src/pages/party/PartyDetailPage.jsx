import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import { requestBillingAuth, requestPayment } from "../../utils/paymentHandler";
import { getMyCard, issueBillingKey } from "../../api/userApi";
import { joinParty, processLeaderDeposit } from "../../api/partyApi";
import LeavePartyWarningModal from "../../components/party/LeavePartyWarningModal";
import UpdateOttModal from "../../components/party/UpdateOttModal";
import { fetchPartyMembers, leaveParty } from "../../hooks/party/partyService";
import { getProductIconUrl } from "../../utils/imageUtils";
import {
  Eye, EyeOff, Users, Calendar, Crown,
  Lock, Check, Sparkles, Shield, ArrowRight,
  CreditCard, Clock, AlertCircle, ChevronDown,
  Copy, CheckCircle2, X, Wallet,
} from "lucide-react";

const SERVICE_COLORS = {
  netflix:   "#e50914", 넷플릭스:  "#e50914",
  youtube:   "#ff0000", 유튜브:    "#ff0000",
  spotify:   "#1db954", 스포티파이: "#1db954",
  disney:    "#0063e5", 디즈니:    "#0063e5",
  wavve:     "#0abde3", 웨이브:    "#0abde3",
  watcha:    "#f6ac3f", 왓챠:     "#f6ac3f",
  apple:     "#555555", 애플:     "#555555",
};

function getServiceColor(name = "") {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(SERVICE_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return "#635bff";
}

function formatDate(d) {
  if (!d) return "-";
  if (Array.isArray(d)) {
    const [y, m, day] = d;
    return `${y}.${String(m).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  }
  const dt = new Date(d);
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
}

const STATUS_MAP = {
  RECRUITING:      { label: "모집중",   color: "#635bff", bg: "rgba(99,91,255,0.12)" },
  ACTIVE:          { label: "파티중",   color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  PENDING_PAYMENT: { label: "결제대기", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  CLOSED:          { label: "파티종료", color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};

// Glass section wrapper
function GlassCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: "var(--glass-bg-card)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-glass)",
      }}
    >
      {children}
    </motion.div>
  );
}

export default function PartyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, fetchSession } = useAuthStore();

  const {
    currentParty: party,
    loading,
    loadPartyDetail,
  } = usePartyStore();

  const [members,         setMembers]         = useState([]);
  const [isLeaveModalOpen,  setIsLeaveModalOpen]  = useState(false);
  const [isOttModalOpen,    setIsOttModalOpen]    = useState(false);
  const [isJoinModalOpen,   setIsJoinModalOpen]   = useState(false);
  const [showOttInfo,       setShowOttInfo]       = useState(false);
  const [showRules,         setShowRules]         = useState(false);
  const [copiedField,       setCopiedField]       = useState(null);
  const [savedCard,         setSavedCard]         = useState(null);
  const [cardLoading,       setCardLoading]       = useState(true);
  const [joinLoading,       setJoinLoading]       = useState(false);

  useEffect(() => {
    loadPartyDetail(id);
    loadMembers();
    if (user) {
      fetchSession();
      setCardLoading(true);
      getMyCard()
        .then((res) => setSavedCard(res?.success && res.data ? res.data : null))
        .catch(() => setSavedCard(null))
        .finally(() => setCardLoading(false));
    } else {
      setCardLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadMembers = async () => {
    try {
      const data = await fetchPartyMembers(id);
      setMembers(data || []);
    } catch (err) { console.error(err); }
  };

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) { console.error(err); }
  };

  const handleJoinWithNewCard = async () => {
    if (!user) { alert("로그인이 필요합니다."); return; }
    try {
      localStorage.setItem("afterBillingRedirect", `/party/${id}`);
      localStorage.setItem("billingRegistrationReason", "party_join_new_flow");
      localStorage.setItem("pendingPartyJoin", JSON.stringify({ partyId: id, amount: party.monthlyFee * 2 }));
      await requestBillingAuth(user.userId);
    } catch (error) {
      localStorage.removeItem("afterBillingRedirect");
      localStorage.removeItem("billingRegistrationReason");
      localStorage.removeItem("pendingPartyJoin");
      const msg = error?.message || "";
      if (!msg.includes("취소") && !msg.includes("cancel")) alert(error.message || "카드 등록에 실패했습니다.");
    }
  };

  const handleJoinWithSavedCard = async () => {
    if (!user) { alert("로그인이 필요합니다."); return; }
    setJoinLoading(true);
    try {
      await joinParty(id, { useExistingCard: true, amount: party.monthlyFee * 2, paymentMethod: "CARD" });
      alert("파티 가입이 완료되었습니다! 🎉");
      await loadPartyDetail(id);
      await loadMembers();
      setIsJoinModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.error?.message || error.message || "가입에 실패했습니다.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveConfirm = async () => {
    try {
      await leaveParty(id);
      alert("파티에서 탈퇴했습니다.");
      navigate("/my-parties");
    } catch (error) {
      alert("탈퇴 처리에 실패했습니다.");
    } finally {
      setIsLeaveModalOpen(false);
    }
  };

  const handleDepositRetry = async () => {
    if (!user) return;
    const depositAmount = party.monthlyFee * party.maxMembers;
    if (savedCard) {
      try {
        await processLeaderDeposit(id, { amount: depositAmount, paymentMethod: "CARD", useExistingCard: true });
        const goToOttInput = window.confirm("🎉 보증금 결제가 완료되었습니다!\n\nOTT 계정 정보를 입력하시겠습니까?");
        if (goToOttInput) navigate(`/party/create?step=4&partyId=${id}`);
        else await loadPartyDetail(id);
      } catch (error) {
        alert(error.response?.data?.error?.message || error.message || "결제에 실패했습니다.");
      }
    } else {
      try {
        localStorage.setItem("pendingPayment", JSON.stringify({ type: "LEADER_DEPOSIT_RETRY", partyId: id }));
        await requestPayment(`${party.productName} 보증금`, depositAmount, "파티장");
      } catch (error) {
        alert(error.response?.data?.error?.message || error.message || "결제 처리에 실패했습니다.");
      }
    }
  };

  if (loading.detail || !party) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--theme-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 rounded-full animate-spin"
            style={{ borderColor: "var(--glass-border)", borderTopColor: "var(--theme-primary)" }} />
          <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>파티 정보 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const isMember = members.some((m) => m.userId === user?.userId);
  const isLeader = party.partyLeaderId === user?.userId;
  const isFull   = party.currentMembers >= party.maxMembers;
  const perPersonFee   = party.monthlyFee ?? 0;
  const availableSlots = party.maxMembers - party.currentMembers;
  const memberProgress = (party.currentMembers / party.maxMembers) * 100;
  const status       = STATUS_MAP[party.partyStatus] || STATUS_MAP.RECRUITING;
  const serviceColor = getServiceColor(party.productName || "");

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--theme-bg)" }}>

      {/* ── Hero ── */}
      <div
        className="px-4 pt-5 pb-6 flex items-start gap-4"
        style={{ borderBottom: "1px solid var(--glass-border)" }}
      >
        {/* Product image — service color background */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ background: `${serviceColor}18`, border: `1.5px solid ${serviceColor}30` }}
        >
          {party.productImage ? (
            <img src={getProductIconUrl(party.productImage)} alt={party.productName}
              className="w-14 h-14 object-contain" />
          ) : (
            <span className="text-3xl font-black" style={{ color: serviceColor }}>
              {party.productName?.[0]}
            </span>
          )}
        </div>

        {/* Title & badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
            {isLeader && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                파티장
              </span>
            )}
            {isMember && !isLeader && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: `${serviceColor}18`, color: serviceColor }}>
                참여중
              </span>
            )}
          </div>

          <h1 className="text-[24px] font-black leading-tight truncate"
              style={{ color: "var(--theme-text)" }}>
            {party.productName}
          </h1>
          <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--theme-text-muted)" }}>
            {party.title || `${party.productName} 파티`}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
              <Calendar className="w-3 h-3" />
              {formatDate(party.startDate)}
            </span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
              <Users className="w-3 h-3" />
              {party.currentMembers}/{party.maxMembers}명
            </span>
          </div>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="px-4 pt-4 space-y-3">

        {/* Price & Progress card */}
        <GlassCard delay={0.1}>
          <div className="p-5">
            {/* Price */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--theme-text-muted)" }}>
                  월 분담금
                </p>
                <p className="price text-[40px] font-black leading-none" style={{ color: serviceColor }}>
                  {perPersonFee.toLocaleString()}
                  <span className="price text-[14px] font-normal ml-1" style={{ color: "var(--theme-text-muted)" }}>원/월</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>첫 결제</p>
                <p className="text-[16px] font-bold" style={{ color: "var(--theme-text)" }}>
                  {(perPersonFee * 2).toLocaleString()}원
                </p>
              </div>
            </div>

            {/* Member progress */}
            <div className="mb-3">
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>파티원 모집</span>
                <span className="text-[11px] font-semibold" style={{ color: "var(--theme-text)" }}>
                  {party.currentMembers}/{party.maxMembers}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--glass-bg-overlay)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${memberProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: serviceColor }}
                />
              </div>
            </div>

            {/* Slot avatars */}
            <div className="flex gap-2">
              {[...Array(party.maxMembers)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={i < party.currentMembers
                    ? { background: serviceColor, color: "#fff" }
                    : { background: "var(--glass-bg-overlay)", border: "1.5px dashed var(--glass-border)", color: "var(--theme-text-muted)" }
                  }
                >
                  {i < party.currentMembers
                    ? (members[i]?.nickname?.[0]?.toUpperCase() || <Check className="w-3.5 h-3.5" />)
                    : "?"}
                </div>
              ))}
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="px-5 pb-5">
            <div
              className="rounded-xl p-4 grid grid-cols-3 gap-3"
              style={{ background: "var(--glass-bg-overlay)" }}
            >
              {[
                { icon: Wallet,     label: "보증금",     value: perPersonFee },
                { icon: CreditCard, label: "첫달 구독료", value: perPersonFee },
                { icon: Sparkles,   label: "첫 결제",    value: perPersonFee * 2, highlight: true },
              ].map(({ icon: Icon, label, value, highlight }) => (
                <div key={label} className="text-center">
                  <Icon className="w-4 h-4 mx-auto mb-1"
                    style={{ color: highlight ? "var(--theme-primary)" : "var(--theme-text-muted)" }} />
                  <p className="text-[10px] mb-0.5" style={{ color: "var(--theme-text-muted)" }}>{label}</p>
                  <p className="text-[13px] font-bold"
                    style={{ color: highlight ? "var(--theme-primary)" : "var(--theme-text)" }}>
                    {value.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* OTT Account (members/leader only) */}
        {(isMember || isLeader) && (
          <GlassCard delay={0.15}>
            <div className="px-5 pt-4 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
                <span className="text-[15px] font-bold" style={{ color: "var(--theme-text)" }}>OTT 계정 정보</span>
              </div>
              {isLeader && (
                <button
                  onClick={() => setIsOttModalOpen(true)}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-primary)" }}
                >
                  수정
                </button>
              )}
            </div>

            <div className="p-5">
              {isMember && !isLeader && !user?.hasBillingKey ? (
                <div className="text-center py-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: "var(--glass-bg-overlay)" }}
                  >
                    <CreditCard className="w-7 h-7" style={{ color: "var(--theme-primary)" }} />
                  </div>
                  <p className="text-[14px] font-bold mb-1" style={{ color: "var(--theme-text)" }}>
                    카드 등록 후 확인 가능
                  </p>
                  <p className="text-[12px] mb-4" style={{ color: "var(--theme-text-muted)" }}>
                    정기결제를 위해 카드를 등록하면<br />OTT 계정 정보를 확인할 수 있어요
                  </p>
                  <button
                    onClick={() => {
                      localStorage.setItem("afterBillingRedirect", `/party/${id}`);
                      localStorage.setItem("billingRegistrationReason", "party_join");
                      navigate("/payment/billing/register");
                    }}
                    className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                    style={{ background: "var(--theme-primary)" }}
                  >
                    <CreditCard className="w-4 h-4" />
                    카드 등록하기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* ID */}
                  <div
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "var(--glass-bg-overlay)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">👤</span>
                      <div>
                        <p className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>아이디</p>
                        <p className="font-mono text-[13px] font-semibold" style={{ color: "var(--theme-text)" }}>
                          {showOttInfo ? (party.ottId || "미등록") : "••••••••••••"}
                        </p>
                      </div>
                    </div>
                    {showOttInfo && party.ottId && (
                      <button onClick={() => handleCopy(party.ottId, "id")}
                        className="p-2 rounded-lg"
                        style={{ color: copiedField === "id" ? "#10b981" : "var(--theme-text-muted)" }}>
                        {copiedField === "id" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                  {/* Password */}
                  <div
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "var(--glass-bg-overlay)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🔑</span>
                      <div>
                        <p className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>비밀번호</p>
                        <p className="font-mono text-[13px] font-semibold" style={{ color: "var(--theme-text)" }}>
                          {showOttInfo ? (party.ottPassword || "미등록") : "••••••••••••"}
                        </p>
                      </div>
                    </div>
                    {showOttInfo && party.ottPassword && (
                      <button onClick={() => handleCopy(party.ottPassword, "pw")}
                        className="p-2 rounded-lg"
                        style={{ color: copiedField === "pw" ? "#10b981" : "var(--theme-text-muted)" }}>
                        {copiedField === "pw" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => setShowOttInfo(!showOttInfo)}
                    className="w-full py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2"
                    style={showOttInfo
                      ? { background: "var(--glass-bg-overlay)", color: "var(--theme-text-muted)" }
                      : { background: "var(--theme-primary)", color: "#fff" }
                    }
                  >
                    {showOttInfo ? <><EyeOff className="w-4 h-4" />정보 숨기기</> : <><Eye className="w-4 h-4" />계정 정보 보기</>}
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Party Rules */}
        <GlassCard delay={0.2}>
          <button
            onClick={() => setShowRules(!showRules)}
            className="w-full px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
              <span className="text-[14px] font-bold" style={{ color: "var(--theme-text)" }}>파티 이용 안내</span>
            </div>
            <motion.div animate={{ rotate: showRules ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
            </motion.div>
          </button>

          <AnimatePresence>
            {showRules && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <div className="pt-4 space-y-2.5">
                    {[
                      { icon: Check, color: "#10b981", bg: "rgba(16,185,129,0.12)", text: "보증금은 파티 정상 종료 시 전액 환불됩니다" },
                      { icon: Check, color: "#635bff", bg: "rgba(99,91,255,0.12)", text: "매월 자동 결제로 편리하게 이용하세요" },
                      { icon: AlertCircle, color: "#ef4444", bg: "rgba(239,68,68,0.12)", text: "탈퇴 시 즉시 이용이 중단되며, 보증금은 환불되지 않습니다" },
                    ].map(({ icon: Icon, color, bg, text }) => (
                      <div key={text} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: bg }}>
                          <Icon className="w-3 h-3" style={{ color }} />
                        </div>
                        <p className="text-[12px]" style={{ color: color === "#ef4444" ? color : "var(--theme-text-muted)" }}>
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Members list (leader only) */}
        {isLeader && members.length > 0 && (
          <GlassCard delay={0.25}>
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--glass-border)" }}>
              <Users className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
              <span className="text-[14px] font-bold" style={{ color: "var(--theme-text)" }}>파티 멤버</span>
              <span className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>{members.length}명</span>
            </div>
            <div className="p-4 grid grid-cols-4 gap-2">
              {members.map((m, i) => (
                <motion.div
                  key={m.partyMemberId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.08 * i }}
                  className="flex flex-col items-center p-3 rounded-xl"
                  style={{ background: "var(--glass-bg-overlay)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold mb-2"
                    style={{ background: "var(--theme-primary)" }}
                  >
                    {m.nickname?.[0]?.toUpperCase()}
                  </div>
                  <p className="text-[11px] font-semibold truncate w-full text-center"
                    style={{ color: "var(--theme-text)" }}>
                    {m.nickname}
                  </p>
                  {m.role === "LEADER" && (
                    <span className="flex items-center gap-0.5 text-[10px] mt-0.5" style={{ color: "#f59e0b" }}>
                      <Crown className="w-2.5 h-2.5" />파티장
                    </span>
                  )}
                </motion.div>
              ))}
              {[...Array(availableSlots)].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex flex-col items-center p-3 rounded-xl"
                  style={{ border: "1.5px dashed var(--glass-border)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                    style={{ background: "var(--glass-bg-overlay)" }}
                  >
                    <Users className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>대기중</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>

      {/* ── Floating Action Bar ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
        className="fixed bottom-16 left-0 right-0 z-40 px-4"
      >
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: "var(--glass-bg-card)",
            backdropFilter: "blur(var(--glass-blur))",
            WebkitBackdropFilter: "blur(var(--glass-blur))",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--shadow-glass)",
          }}
        >
          {/* Price */}
          <div className="flex-shrink-0">
            <p className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>월 분담금</p>
            <p className="text-[17px] font-black" style={{ color: "var(--theme-text)" }}>
              {perPersonFee.toLocaleString()}<span className="text-[11px] font-normal">원</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex-1 flex justify-end gap-2">
            {isLeader && party.partyStatus === "PENDING_PAYMENT" && (
              <button
                onClick={handleDepositRetry}
                className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ background: "#f59e0b" }}
              >
                보증금 재결제
              </button>
            )}

            {party.memberStatus === "INACTIVE" ? (
              <div className="px-4 py-2.5 rounded-xl text-[13px] font-semibold"
                style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-text-muted)" }}>
                재가입 불가
              </div>
            ) : !isMember && !isLeader && !isFull ? (
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ background: "var(--theme-primary)" }}
              >
                <Sparkles className="w-4 h-4" />
                파티 가입하기
              </button>
            ) : null}

            {isMember && !isLeader && (
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-[13px] font-semibold"
                style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                파티 탈퇴
              </button>
            )}

            {isFull && !isMember && !isLeader && (
              <div className="px-4 py-2.5 rounded-xl text-[13px] font-semibold"
                style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-text-muted)" }}>
                모집 마감
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Modals ── */}
      <LeavePartyWarningModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
      />

      <UpdateOttModal
        isOpen={isOttModalOpen}
        onClose={(success) => { setIsOttModalOpen(false); if (success) loadPartyDetail(id); }}
        partyId={id}
        currentOttId={party.ottId}
      />

      {/* Join modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50"
            onClick={() => !joinLoading && setIsJoinModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[390px] rounded-t-3xl p-6 pb-10"
              style={{
                background: "var(--glass-bg-card)",
                backdropFilter: "blur(var(--glass-blur))",
                WebkitBackdropFilter: "blur(var(--glass-blur))",
                border: "1px solid var(--glass-border)",
              }}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full mx-auto mb-5"
                style={{ background: "var(--glass-border)" }} />

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold" style={{ color: "var(--theme-text)" }}>파티 가입</h3>
                <button onClick={() => !joinLoading && setIsJoinModalOpen(false)}>
                  <X className="w-5 h-5" style={{ color: "var(--theme-text-muted)" }} />
                </button>
              </div>

              {cardLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-2 rounded-full animate-spin"
                    style={{ borderColor: "var(--glass-border)", borderTopColor: "var(--theme-primary)" }} />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Saved card */}
                  {savedCard && (
                    <div className="flex items-center gap-3 p-4 rounded-xl"
                      style={{ background: "var(--glass-bg-overlay)" }}>
                      <CreditCard className="w-5 h-5 flex-shrink-0" style={{ color: "var(--theme-primary)" }} />
                      <div>
                        <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>저장된 카드</p>
                        <p className="text-[13px] font-semibold" style={{ color: "var(--theme-text)" }}>
                          {savedCard.cardCompany} {savedCard.cardNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Payment breakdown */}
                  <div className="rounded-xl p-4 space-y-2.5"
                    style={{ background: "var(--glass-bg-overlay)" }}>
                    <p className="text-[11px] font-semibold mb-1" style={{ color: "var(--theme-text-muted)" }}>결제 금액</p>
                    {[
                      { label: "보증금", value: perPersonFee, tag: "환불가능" },
                      { label: "첫달 구독료", value: perPersonFee },
                    ].map(({ label, value, tag }) => (
                      <div key={label} className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>{label}</span>
                          {tag && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                              style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>{tag}</span>
                          )}
                        </div>
                        <span className="text-[13px] font-semibold" style={{ color: "var(--theme-text)" }}>
                          {value.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                    <div className="pt-2.5 flex justify-between" style={{ borderTop: "1px solid var(--glass-border)" }}>
                      <span className="text-[14px] font-bold" style={{ color: "var(--theme-text)" }}>합계</span>
                      <span className="text-[18px] font-black" style={{ color: "var(--theme-primary)" }}>
                        {(perPersonFee * 2).toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  {/* Recurring note */}
                  <div className="rounded-xl p-3"
                    style={{ background: "var(--glass-bg-overlay)", border: "1px solid var(--glass-border)" }}>
                    <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
                      📅 매월 <strong>{perPersonFee.toLocaleString()}원</strong> 자동결제 · 파티 정상 종료 시 보증금 전액 환불
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setIsJoinModalOpen(false)}
                      disabled={joinLoading}
                      className="flex-1 py-3 rounded-xl text-[13px] font-semibold"
                      style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-text-muted)" }}
                    >
                      취소
                    </button>
                    {savedCard ? (
                      <button
                        onClick={handleJoinWithSavedCard}
                        disabled={joinLoading}
                        className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white"
                        style={{ background: "var(--theme-primary)", opacity: joinLoading ? 0.7 : 1 }}
                      >
                        {joinLoading ? "결제 중..." : "결제하기"}
                      </button>
                    ) : (
                      <button
                        onClick={() => { setIsJoinModalOpen(false); handleJoinWithNewCard(); }}
                        className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white"
                        style={{ background: "var(--theme-primary)" }}
                      >
                        카드 등록하기
                      </button>
                    )}
                  </div>

                  {savedCard && !joinLoading && (
                    <button
                      onClick={() => { setIsJoinModalOpen(false); handleJoinWithNewCard(); }}
                      className="w-full text-[12px] text-center pt-1"
                      style={{ color: "var(--theme-text-muted)" }}
                    >
                      다른 카드로 결제하기
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
