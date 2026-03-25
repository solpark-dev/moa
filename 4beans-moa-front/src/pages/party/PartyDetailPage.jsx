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
import RippleButton from "../../components/party/RippleButton";
import { fetchPartyMembers, leaveParty } from "../../hooks/party/partyService";
import {
  themeConfig
} from "../../config/themeConfig";
import { useThemeStore } from "../../store/themeStore";
import { getProductIconUrl } from "../../utils/imageUtils";
import {
  Eye,
  EyeOff,
  Users,
  Calendar,
  Crown,
  ArrowLeft,
  Lock,
  Check,
  Sparkles,
  TrendingDown,
  Shield,
  ArrowRight,
  CreditCard,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  X,
  Wallet,
  Zap
} from "lucide-react";

// Party 페이지 테마 스타일 (PartyListPage와 통일)
const partyThemeStyles = {
  light: {
    accent: 'text-[#635bff]',
    accentBg: 'bg-[#635bff]',
    hoverAccentBg: 'hover:bg-[#5851e8]',
    badge: 'bg-indigo-50 text-[#635bff]',
    buttonShadow: 'shadow-[#635bff]/25',
    accentColor: '#635bff',
    gradientFrom: 'from-[#635bff]',
    gradientTo: 'to-[#00d4ff]',
  },
  dark: {
    accent: 'text-[#635bff]',
    accentBg: 'bg-[#635bff]',
    hoverAccentBg: 'hover:bg-[#5851e8]',
    badge: 'bg-gray-800 text-[#635bff]',
    buttonShadow: 'shadow-gray-900/25',
    accentColor: '#635bff',
    gradientFrom: 'from-[#635bff]',
    gradientTo: 'to-[#00d4ff]',
  },
};

export default function PartyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, fetchSession } = useAuthStore();

  // Theme (PartyListPage와 동일한 방식 사용)
  const { theme, setTheme } = useThemeStore();
  const currentTheme = themeConfig[theme] || themeConfig.light;
  const themeStyle = partyThemeStyles[theme] || partyThemeStyles.light;

  // 테마별 악센트 색상
  const accentColor = "#635bff";

  // Zustand Store
  const {
    currentParty: party,
    loading,
    loadPartyDetail,
  } = usePartyStore();

  const [members, setMembers] = useState([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOttModalOpen, setIsOttModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [showOttInfo, setShowOttInfo] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // 카드 상태 관리
  const [savedCard, setSavedCard] = useState(null);
  const [cardLoading, setCardLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    loadPartyDetail(id);
    loadMembers();
    // 사용자 정보 갱신 (빌링키 등록 여부 최신 상태 반영)
    if (user) {
      fetchSession();
      // 사용자 카드 정보 조회
      setCardLoading(true);
      getMyCard()
        .then(res => {
          if (res?.success && res.data) {
            setSavedCard(res.data);
          } else {
            setSavedCard(null);
          }
        })
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
    } catch (err) {
      console.error(err);
    }
  };

  // 복사 기능
  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // 새 카드 등록 후 가입 플로우
  const handleJoinWithNewCard = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      // 빌링키 등록 성공 후 리다이렉트될 때 파티 가입을 위한 정보 저장
      localStorage.setItem("afterBillingRedirect", `/party/${id}`);
      localStorage.setItem("billingRegistrationReason", "party_join_new_flow");
      localStorage.setItem("pendingPartyJoin", JSON.stringify({
        partyId: id,
        amount: party.monthlyFee * 2
      }));
      // 토스페이먼츠 빌링 인증 창 호출 (customerKey = userId)
      await requestBillingAuth(user.userId);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("afterBillingRedirect");
      localStorage.removeItem("billingRegistrationReason");
      localStorage.removeItem("pendingPartyJoin");
      const errorMessage = error?.message || "";
      if (!errorMessage.includes("취소") && !errorMessage.includes("cancel")) {
        alert(error.message || "카드 등록에 실패했습니다.");
      }
    }
  };

  // 저장된 카드로 바로 가입 플로우
  const handleJoinWithSavedCard = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setJoinLoading(true);
    try {
      const totalAmount = party.monthlyFee * 2;
      await joinParty(id, {
        useExistingCard: true,
        amount: totalAmount,
        paymentMethod: "CARD"
      });
      alert("파티 가입이 완료되었습니다! 🎉");
      // 파티 상세 및 멤버 목록 새로고침
      await loadPartyDetail(id);
      await loadMembers();
      setIsJoinModalOpen(false);
    } catch (error) {
      console.error(error);
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
      console.error(error);
      alert("탈퇴 처리에 실패했습니다.");
    } finally {
      setIsLeaveModalOpen(false);
    }
  };

  const handleDepositRetry = async () => {
    if (!user) return;

    const depositAmount = party.monthlyFee * party.maxMembers;

    // 등록된 카드가 있으면 빌링키로 바로 결제
    if (savedCard) {
      try {
        await processLeaderDeposit(id, {
          amount: depositAmount,
          paymentMethod: "CARD",
          useExistingCard: true
        });
        // 결제 성공 시 파티 생성 완료 안내 후 OTT 계정 입력 페이지로 이동
        const goToOttInput = window.confirm(
          "🎉 보증금 결제가 완료되었습니다!\n\n파티가 성공적으로 생성되었습니다.\nOTT 계정 정보를 입력하시겠습니까?\n\n(확인: 계정 입력 페이지로 이동 / 취소: 현재 페이지에서 계속)"
        );
        if (goToOttInput) {
          navigate(`/party/create?step=4&partyId=${id}`);
        } else {
          await loadPartyDetail(id);
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.error?.message || error.message || "결제에 실패했습니다.");
      }
    } else {
      // 등록된 카드가 없으면 토스페이먼츠 일반 결제창 호출
      try {
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            type: "LEADER_DEPOSIT_RETRY",
            partyId: id,
          })
        );

        await requestPayment(
          `${party.productName} 보증금`,
          depositAmount,
          "파티장"
        );
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.error?.message || error.message || "결제 처리에 실패했습니다.");
      }
    }
  };

  if (loading.detail || !party) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative z-10 ${theme === "dark" ? "bg-[#0B1120]" : "bg-transparent"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className={`w-12 h-12 border-3 rounded-full animate-spin ${theme === "dark" ? "border-gray-700 border-t-[#635bff]" : "border-gray-200 border-t-[#635bff]"}`}></div>
          <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>파티 정보 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const isMember = members.some((m) => m.userId === user?.userId);
  const isLeader = party.partyLeaderId === user?.userId;
  const isFull = party.currentMembers >= party.maxMembers;
  const perPersonFee = party.monthlyFee ?? 0;
  const availableSlots = party.maxMembers - party.currentMembers;

  const getStatusConfig = (status) => {
    const configs = {
      RECRUITING: {
        bg: `bg-gradient-to-r ${themeStyle.gradientFrom} ${themeStyle.gradientTo}`,
        text: "모집중",
        icon: Sparkles
      },
      ACTIVE: {
        bg: "bg-gradient-to-r from-emerald-400 to-teal-500",
        text: "파티중",
        icon: Zap
      },
      PENDING_PAYMENT: {
        bg: "bg-gradient-to-r from-amber-400 to-orange-500",
        text: "결제대기",
        icon: Clock
      },
      CLOSED: {
        bg: "bg-gradient-to-r from-gray-400 to-gray-500",
        text: "파티종료",
        icon: CheckCircle2
      },
    };
    return configs[status] || configs.RECRUITING;
  };

  const statusConfig = getStatusConfig(party.partyStatus);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateData) => {
    if (!dateData) return "-";
    if (Array.isArray(dateData)) {
      const [year, month, day] = dateData;
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    }
    const date = new Date(dateData);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 멤버 진행률
  const memberProgress = (party.currentMembers / party.maxMembers) * 100;

  return (
    <div className={`min-h-screen transition-colors duration-300 relative z-10 ${currentTheme.bg}`}>

      {/* ===== HERO BANNER ===== */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${themeStyle.gradientFrom}/10 ${themeStyle.gradientTo}/5`} />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: accentColor }} />
        <div className="absolute bottom-0 left-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: accentColor }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/party")}
            className={`flex items-center gap-2 mb-10 transition-all group ${theme === "dark"
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            <div className={`p-2 rounded-full transition-all ${theme === "dark"
              ? "bg-gray-800 group-hover:bg-gray-700"
              : "bg-white/80 group-hover:bg-white shadow-sm"
              }`}>
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">파티 목록</span>
          </motion.button>

          {/* Main Hero Content */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* OTT Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative"
            >
              <div className={`w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden shadow-2xl ring-4 ${theme === "dark" ? "ring-gray-800" : "ring-white"
                }`}>
                {party.productImage ? (
                  <img
                    src={getProductIconUrl(party.productImage)}
                    alt={party.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${themeStyle.gradientFrom} ${themeStyle.gradientTo}`}>
                    <span className="text-5xl md:text-6xl font-black text-white">
                      {party.productName?.[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Badge on Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`absolute -bottom-2 -right-2 ${statusConfig.bg} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.text}
              </motion.div>
            </motion.div>

            {/* Party Info */}
            <div className="flex-1">
              {/* Badges Row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 flex-wrap mb-4"
              >
                {isLeader && (
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    파티장
                  </span>
                )}
                {isMember && !isLeader && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 ${theme === "dark"
                    ? "bg-gray-800 text-emerald-400"
                    : "bg-white text-emerald-600"
                    }`}>
                    <Check className="w-3.5 h-3.5" />
                    참여중
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
              >
                {party.productName}
              </motion.h1>

              {/* Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-4 md:gap-6"
              >
                {/* Leader Info */}
                {(isMember || isLeader) && (
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${themeStyle.gradientFrom} ${themeStyle.gradientTo} flex items-center justify-center shadow-md`}>
                      <span className="text-xs font-bold text-white">
                        {party.leaderNickname?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>파티장</p>
                      <p className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{party.leaderNickname}</p>
                    </div>
                  </div>
                )}

                {/* Member Count */}
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-white/80"}`}>
                    <Users className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <span className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {party.currentMembers}/{party.maxMembers}명
                  </span>
                </div>

                {/* Period */}
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-white/80"}`}>
                    <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    {formatDate(party.startDate)} ~ {formatDate(party.endDate)}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-32">

        {/* Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`rounded-3xl overflow-hidden shadow-xl mb-6 ${theme === "dark"
            ? "bg-[#1E293B] border border-gray-700"
            : "bg-white border border-gray-100"
            }`}
        >
          <div className="p-6 md:p-8">
            {/* Price & Stats Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              {/* Price Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5" style={{ color: accentColor }} />
                  <span className="text-sm font-semibold" style={{ color: accentColor }}>최대 75% 할인</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl md:text-5xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {perPersonFee.toLocaleString()}
                  </span>
                  <span className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>원/월</span>
                </div>
              </div>

              {/* Member Progress */}
              <div className="flex-1 max-w-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    파티원 모집 현황
                  </span>
                  <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {party.currentMembers} / {party.maxMembers}
                  </span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${memberProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    className={`h-full rounded-full bg-gradient-to-r ${themeStyle.gradientFrom} ${themeStyle.gradientTo}`}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {[...Array(party.maxMembers)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < party.currentMembers
                        ? `bg-gradient-to-br ${themeStyle.gradientFrom} ${themeStyle.gradientTo} text-white shadow-md`
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-500 border-2 border-dashed border-gray-600"
                          : "bg-gray-50 text-gray-300 border-2 border-dashed border-gray-200"
                        }`}
                    >
                      {i < party.currentMembers ? (
                        members[i]?.nickname?.[0]?.toUpperCase() || <Check className="w-4 h-4" />
                      ) : (
                        "?"
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className={`rounded-2xl p-5 ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-white shadow-sm"}`}>
                    <Wallet className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>보증금</p>
                    <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {perPersonFee.toLocaleString()}원
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-white shadow-sm"}`}>
                    <CreditCard className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>첫달 구독료</p>
                    <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {perPersonFee.toLocaleString()}원
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${themeStyle.gradientFrom} ${themeStyle.gradientTo} shadow-lg`}>
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>첫 결제 총액</p>
                    <p className="text-lg font-bold" style={{ color: accentColor }}>
                      {(perPersonFee * 2).toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* OTT Account Info - Members Only */}
        {(isMember || isLeader) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-3xl overflow-hidden shadow-xl mb-6 ${theme === "dark"
              ? "bg-[#1E293B] border border-gray-700"
              : "bg-white border border-gray-100"
              }`}
          >
            <div className={`px-6 py-4 border-b flex justify-between items-center ${theme === "dark" ? "border-gray-700" : "border-gray-100"
              }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${themeStyle.gradientFrom}/20 ${themeStyle.gradientTo}/20`}>
                  <Lock className="w-5 h-5" style={{ color: accentColor }} />
                </div>
                <h2 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  OTT 계정 정보
                </h2>
              </div>
              {isLeader && (
                <button
                  onClick={() => setIsOttModalOpen(true)}
                  className={`text-sm px-4 py-2 rounded-full font-semibold transition-all ${theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                  수정
                </button>
              )}
            </div>

            <div className="p-6">
              {/* 빌링키 미등록 멤버(비방장)에게 카드 등록 안내 */}
              {isMember && !isLeader && !user?.hasBillingKey ? (
                <div className="text-center py-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 bg-gradient-to-br ${themeStyle.gradientFrom}/10 ${themeStyle.gradientTo}/10`}>
                    <CreditCard className="w-10 h-10" style={{ color: accentColor }} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    카드 등록 후 확인 가능
                  </h3>
                  <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    정기결제를 위해 카드를 등록하면<br />
                    OTT 계정 정보를 확인할 수 있어요
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      localStorage.setItem("afterBillingRedirect", `/party/${id}`);
                      localStorage.setItem("billingRegistrationReason", "party_join");
                      navigate("/payment/billing/register");
                    }}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all shadow-lg bg-gradient-to-r ${themeStyle.gradientFrom} ${themeStyle.gradientTo}`}
                    style={{ boxShadow: `0 8px 20px ${accentColor}40` }}
                  >
                    <CreditCard className="w-5 h-5" />
                    카드 등록하기
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                /* 방장 또는 빌링키 등록된 멤버 - 정상 OTT 정보 표시 */
                <div className="space-y-4">
                  {/* ID Field */}
                  <div className={`rounded-2xl p-4 flex items-center justify-between ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-white shadow-sm"
                        }`}>
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>아이디</p>
                        <p className={`font-mono font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {showOttInfo ? (
                            party.ottId || <span className="text-gray-400 italic">미등록</span>
                          ) : (
                            "••••••••••••"
                          )}
                        </p>
                      </div>
                    </div>
                    {showOttInfo && party.ottId && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(party.ottId, 'id')}
                        className={`p-2 rounded-xl transition-all ${copiedField === 'id'
                          ? "bg-emerald-100 text-emerald-600"
                          : theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                            : "bg-white hover:bg-gray-100 text-gray-600 shadow-sm"
                          }`}
                      >
                        {copiedField === 'id' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </motion.button>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className={`rounded-2xl p-4 flex items-center justify-between ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-white shadow-sm"
                        }`}>
                        <span className="text-lg">🔑</span>
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>비밀번호</p>
                        <p className={`font-mono font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {showOttInfo ? (
                            party.ottPassword || <span className="text-gray-400 italic">미등록</span>
                          ) : (
                            "••••••••••••"
                          )}
                        </p>
                      </div>
                    </div>
                    {showOttInfo && party.ottPassword && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(party.ottPassword, 'pw')}
                        className={`p-2 rounded-xl transition-all ${copiedField === 'pw'
                          ? "bg-emerald-100 text-emerald-600"
                          : theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                            : "bg-white hover:bg-gray-100 text-gray-600 shadow-sm"
                          }`}
                      >
                        {copiedField === 'pw' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </motion.button>
                    )}
                  </div>

                  {/* Toggle Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowOttInfo(!showOttInfo)}
                    className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${showOttInfo
                      ? theme === "dark"
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : `bg-gradient-to-r ${themeStyle.gradientFrom} ${themeStyle.gradientTo} text-white`
                      }`}
                    style={!showOttInfo ? { boxShadow: `0 8px 20px ${accentColor}30` } : {}}
                  >
                    {showOttInfo ? (
                      <>
                        <EyeOff className="w-5 h-5" />
                        정보 숨기기
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        계정 정보 보기
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Party Rules - Collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`rounded-3xl overflow-hidden shadow-xl mb-6 ${theme === "dark"
            ? "bg-[#1E293B] border border-gray-700"
            : "bg-white border border-gray-100"
            }`}
        >
          <button
            onClick={() => setShowRules(!showRules)}
            className={`w-full px-6 py-5 flex items-center justify-between transition-colors ${theme === "dark" ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
              }`}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5" style={{ color: accentColor }} />
              <span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                파티 이용 안내
              </span>
            </div>
            <motion.div
              animate={{ rotate: showRules ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
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
                <div className={`px-6 pb-6 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                  <ul className={`space-y-4 pt-5 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <li className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-100`}>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span>보증금은 <strong className={theme === "dark" ? "text-white" : "text-gray-900"}>파티 정상 종료</strong> 시 전액 환불됩니다</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100`}>
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span>매월 자동 결제로 편리하게 이용하세요</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <span className="text-red-500 font-medium">탈퇴 시 즉시 이용이 중단되며, 보증금은 환불되지 않습니다</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Members List - Leader Only */}
        {isLeader && members.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-3xl overflow-hidden shadow-xl ${theme === "dark"
              ? "bg-[#1E293B] border border-gray-700"
              : "bg-white border border-gray-100"
              }`}
          >
            <div className={`px-6 py-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" style={{ color: accentColor }} />
                <h2 className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  파티 멤버
                </h2>
                <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  {members.length}명
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {members.map((m, i) => (
                  <motion.div
                    key={m.partyMemberId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    className={`p-4 rounded-2xl text-center ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                      }`}
                  >
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg mb-3 bg-gradient-to-br ${themeStyle.gradientFrom} ${themeStyle.gradientTo}`}>
                      {m.nickname?.[0]?.toUpperCase()}
                    </div>
                    <p className={`text-sm font-semibold truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {m.nickname}
                    </p>
                    {m.role === 'LEADER' && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-semibold mt-1">
                        <Crown className="w-3 h-3" />
                        파티장
                      </span>
                    )}
                  </motion.div>
                ))}

                {/* Empty Slots */}
                {[...Array(availableSlots)].map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className={`p-4 rounded-2xl text-center border-2 border-dashed ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                  >
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}>
                      <Users className={`w-5 h-5 ${theme === "dark" ? "text-gray-600" : "text-gray-300"}`} />
                    </div>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                      대기중
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ===== FLOATING ACTION BAR ===== */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className={`mx-auto max-w-5xl px-4 pb-4`}>
          <div className={`rounded-2xl p-4 shadow-2xl backdrop-blur-xl ${theme === "dark"
            ? "bg-gray-900/95 border border-gray-700"
            : "bg-white/95 border border-gray-200"
            }`}>
            <div className="flex items-center justify-between gap-4">
              {/* Left: Price Summary */}
              <div className="hidden sm:block">
                <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>월 분담금</p>
                <p className={`text-xl font-black ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {perPersonFee.toLocaleString()}<span className="text-sm font-normal">원</span>
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3 flex-1 sm:flex-none">
                {/* Leader - Pending Payment */}
                {isLeader && party.partyStatus === "PENDING_PAYMENT" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDepositRetry}
                    className="flex-1 sm:flex-none px-6 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    보증금 재결제
                  </motion.button>
                )}

                {/* Non-member - Can join */}
                {party.memberStatus === 'INACTIVE' ? (
                  <div className="flex-1 py-3.5 bg-gray-100 text-gray-400 rounded-xl font-semibold text-center">
                    재가입 불가
                  </div>
                ) : !isMember && !isLeader && !isFull && (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsJoinModalOpen(true)}
                    className={`flex-1 sm:flex-none px-8 py-3.5 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${themeStyle.gradientFrom} ${themeStyle.gradientTo}`}
                    style={{ boxShadow: `0 10px 25px -5px ${accentColor}50` }}
                  >
                    <Sparkles className="w-5 h-5" />
                    파티 가입하기
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}

                {/* Member - Can leave */}
                {isMember && !isLeader && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsLeaveModalOpen(true)}
                    className="flex-1 sm:flex-none px-6 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-semibold transition-all"
                  >
                    파티 탈퇴
                  </motion.button>
                )}

                {/* Full Party */}
                {isFull && !isMember && (
                  <div className="flex-1 py-3.5 bg-gray-100 text-gray-400 rounded-xl font-semibold text-center">
                    모집 마감
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== MODALS ===== */}
      <LeavePartyWarningModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
      />

      <UpdateOttModal
        isOpen={isOttModalOpen}
        onClose={(success) => {
          setIsOttModalOpen(false);
          if (success) loadPartyDetail(id);
        }}
        partyId={id}
        currentOttId={party.ottId}
      />

      {/* Join Confirmation Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !joinLoading && setIsJoinModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl p-6 max-w-md w-full shadow-2xl ${theme === "dark" ? "bg-[#1E293B]" : "bg-white"}`}
            >
              {/* Close Button */}
              <button
                onClick={() => !joinLoading && setIsJoinModalOpen(false)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${theme === "dark" ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
              >
                <X className="w-5 h-5" />
              </button>

              {/* 카드 상태에 따른 표시 */}
              {cardLoading ? (
                <div className="text-center py-12">
                  <div className={`w-10 h-10 border-3 rounded-full animate-spin mx-auto mb-4 ${theme === "dark" ? "border-gray-700 border-t-[#635bff]" : "border-gray-200 border-t-[#635bff]"}`}></div>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>카드 정보 확인 중...</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br ${themeStyle.gradientFrom}/10 ${themeStyle.gradientTo}/10`}>
                      <Sparkles className="w-8 h-8" style={{ color: accentColor }} />
                    </div>
                    <h3 className={`text-2xl font-black mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      파티 가입
                    </h3>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {savedCard ? "저장된 카드로 바로 결제됩니다" : "카드 등록 후 첫 결제가 진행됩니다"}
                    </p>
                  </div>

                  {/* Saved Card Info */}
                  {savedCard && (
                    <div className={`flex items-center gap-3 p-4 rounded-2xl mb-5 ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${themeStyle.gradientFrom}/10 ${themeStyle.gradientTo}/10`}>
                        <CreditCard className="w-6 h-6" style={{ color: accentColor }} />
                      </div>
                      <div>
                        <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>저장된 카드</p>
                        <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {savedCard.cardCompany} {savedCard.cardNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Payment Breakdown */}
                  <div className={`rounded-2xl p-5 mb-5 ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                    <p className={`text-xs font-bold mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      결제 금액
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>보증금</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
                            환불가능
                          </span>
                        </div>
                        <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{perPersonFee.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>첫달 구독료</span>
                        <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{perPersonFee.toLocaleString()}원</span>
                      </div>
                      <div className={`border-t pt-3 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>합계</span>
                          <span className="text-2xl font-black" style={{ color: accentColor }}>
                            {(perPersonFee * 2).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recurring Info */}
                  <div className={`rounded-2xl p-4 mb-6 border ${theme === "dark" ? "bg-[#635bff]/5 border-[#635bff]/20" : "bg-blue-50/50 border-blue-100"}`}>
                    <p className={`text-xs font-bold mb-2 ${theme === "dark" ? "text-[#635bff]" : "text-blue-600"}`}>
                      📅 정기결제 안내
                    </p>
                    <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <li>• 매월 자동결제: <strong>{perPersonFee.toLocaleString()}원</strong></li>
                      <li>• 파티 정상 종료 시 보증금 전액 환불</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsJoinModalOpen(false)}
                      disabled={joinLoading}
                      className={`flex-1 py-4 font-semibold rounded-xl transition-all ${theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } ${joinLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      취소
                    </button>
                    {savedCard ? (
                      <motion.button
                        whileHover={{ scale: joinLoading ? 1 : 1.02 }}
                        whileTap={{ scale: joinLoading ? 1 : 0.98 }}
                        onClick={handleJoinWithSavedCard}
                        disabled={joinLoading}
                        className={`flex-1 py-4 text-white rounded-xl font-bold transition-all bg-gradient-to-r ${themeStyle.gradientFrom} ${themeStyle.gradientTo} ${joinLoading ? "opacity-70" : ""}`}
                        style={{ boxShadow: `0 8px 20px ${accentColor}40` }}
                      >
                        {joinLoading ? "결제 중..." : "결제하기"}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsJoinModalOpen(false);
                          handleJoinWithNewCard();
                        }}
                        className={`flex-1 py-4 text-white rounded-xl font-bold transition-all bg-gradient-to-r ${themeStyle.gradientFrom} ${themeStyle.gradientTo}`}
                        style={{ boxShadow: `0 8px 20px ${accentColor}40` }}
                      >
                        카드 등록하기
                      </motion.button>
                    )}
                  </div>

                  {/* Other Card Option */}
                  {savedCard && !joinLoading && (
                    <button
                      onClick={() => {
                        setIsJoinModalOpen(false);
                        handleJoinWithNewCard();
                      }}
                      className={`w-full mt-3 py-2 text-sm font-medium transition-colors ${theme === "dark" ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      다른 카드로 결제하기
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
