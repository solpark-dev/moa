import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getMyParties, getMyClosedParties } from "../../api/partyApi";
import { fetchCurrentUser } from "../../api/authApi";
import { useThemeStore } from "../../store/themeStore";
import { themeClasses } from "../../utils/themeUtils";
import {
  Users,
  Crown,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowRight,
  ArrowLeft,
  Activity,
  LayoutGrid,
  Archive,
  Filter,
} from "lucide-react";

// Party 페이지 테마 스타일
const partyThemeStyles = {
  light: {
    accent: 'text-[#635bff]',
    accentBg: 'bg-[#635bff]',
    hoverAccentBg: 'hover:bg-[#5851e8]',
    badge: 'bg-indigo-50 text-[#635bff]',
    buttonShadow: 'shadow-[#635bff]/25',
    accentColor: '#635bff',
  },
  dark: {
    accent: 'text-[#635bff]',
    accentBg: 'bg-[#635bff]',
    hoverAccentBg: 'hover:bg-[#5851e8]',
    badge: 'bg-gray-800 text-[#635bff]',
    buttonShadow: 'shadow-gray-900/25',
    accentColor: '#635bff',
  },
};

export default function MyPartyListPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [closedList, setClosedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showClosed, setShowClosed] = useState(false);

  // Theme
  const { theme } = useThemeStore();
  const themeStyle = partyThemeStyles[theme] || partyThemeStyles.light;

  useEffect(() => {
    loadUserAndParties();
  }, []);

  const loadUserAndParties = async () => {
    try {
      const userResponse = await fetchCurrentUser();
      if (userResponse.success && userResponse.data) {
        setCurrentUserId(userResponse.data.userId);
      }

      await loadMyParties();
    } catch (error) {
      console.error("Failed to load user or parties", error);
      setLoading(false);
    }
  };

  const loadMyParties = async () => {
    try {
      const response = await getMyParties();
      if (response.success && response.data) {
        setList(response.data);
      } else {
        setList([]);
      }
    } catch (error) {
      console.error("Failed to load my parties", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadClosedParties = async () => {
    try {
      const response = await getMyClosedParties();
      if (response.success && response.data) {
        setClosedList(response.data);
      } else {
        setClosedList([]);
      }
    } catch (error) {
      console.error("Failed to load closed parties", error);
      setClosedList([]);
    }
  };

  // 종료된 파티 토글 시 데이터 로드
  useEffect(() => {
    if (showClosed && closedList.length === 0) {
      loadClosedParties();
    }
  }, [showClosed]);

  // Calculate statistics
  const displayList = showClosed ? closedList : list;
  const stats = {
    total: list.length,
    asLeader: displayList.filter((p) => p.partyLeaderId === currentUserId).length,
    asMember: displayList.filter((p) => p.partyLeaderId !== currentUserId).length,
    active: list.filter((p) => p.partyStatus === "ACTIVE").length,
    recruiting: list.filter((p) => p.partyStatus === "RECRUITING").length,
    closed: closedList.length,
  };

  const getStatusBadge = (status) => {
    const badges = {
      RECRUITING: {
        bg: "bg-emerald-500",
        text: "모집중",
        icon: "✨",
      },
      ACTIVE: {
        bg: "bg-blue-500",
        text: "진행중",
        icon: "🚀",
      },
      PENDING_PAYMENT: {
        bg: "bg-amber-500",
        text: "결제대기",
        icon: "⏳",
      },
      CLOSED: {
        bg: "bg-stone-500",
        text: "종료",
        icon: "🔒",
      },
    };
    return badges[status] || badges.RECRUITING;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
    }
  };

  // 테마별 악센트 색상
  const getAccentColor = () => {
    switch (theme) {
      case "dark": return "#635bff";
      default: return "#635bff";
    }
  };
  const accentColor = getAccentColor();

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center relative z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent" style={{ borderColor: accentColor }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300 relative z-10">
      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-6 transition-colors group ${theme === "dark"
            ? "text-gray-400 hover:text-[#635bff]"
            : "text-gray-400 hover:text-[#635bff]"
            }`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">뒤로가기</span>
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${themeClasses.text.primary}`}>
              <LayoutGrid className="w-7 h-7" style={{ color: accentColor }} />
              내 파티
            </h1>
            <p className={`text-sm mt-1 ${themeClasses.text.muted}`}>
              참여 중인 파티를 한눈에 확인하세요
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/party/create")}
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold transition-all shadow-lg ${theme === "dark"
              ? "bg-[#635bff] hover:bg-[#5851e8] text-white rounded-xl"
              : "bg-[#635bff] hover:bg-[#5851e8] text-white rounded-xl"
              }`}
          >
            <Plus className="w-5 h-5" />
            새 파티 만들기
          </motion.button>
        </div>

        {/* Filter Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex items-center gap-3 mt-6"
        >
          <Filter className={`w-4 h-4 ${themeClasses.text.muted}`} />
          <button
            onClick={() => setShowClosed(false)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${!showClosed
              ? theme === "dark"
                ? "bg-[#635bff] text-white"
                : "bg-[#635bff] text-white"
              : theme === "dark"
                ? "bg-[#1E293B] text-gray-400 hover:bg-[#334155]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            진행 중 ({list.length})
          </button>
          <button
            onClick={() => setShowClosed(true)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all flex items-center gap-2 ${showClosed
              ? theme === "dark"
                ? "bg-[#635bff] text-white"
                : "bg-[#635bff] text-white"
              : theme === "dark"
                ? "bg-[#1E293B] text-gray-400 hover:bg-[#334155]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Archive className="w-4 h-4" />
            종료된 파티
          </button>
        </motion.div>
      </div>

      {/* Statistics Cards */}
      {list.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Parties */}
            <div className={`rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 ${theme === "dark"
              ? "bg-[#1E293B] border border-gray-700"
              : "bg-white border border-gray-200"
              }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-[#635bff]/20" : "bg-blue-50"
                  }`}>
                  <Users className="w-5 h-5" style={{ color: accentColor }} />
                </div>
                <span className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {stats.total}
                </span>
              </div>
              <p className={`text-sm font-medium ${themeClasses.text.muted}`}>전체 파티</p>
            </div>

            {/* As Leader */}
            <div className={`rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 ${theme === "dark"
              ? "bg-[#1E293B] border border-gray-700"
              : "bg-white border border-gray-200"
              }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-amber-500/20" : "bg-amber-50"
                  }`}>
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <span className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {stats.asLeader}
                </span>
              </div>
              <p className={`text-sm font-medium ${themeClasses.text.muted}`}>파티장</p>
            </div>

            {/* Active Parties */}
            <div className={`rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 ${theme === "dark"
              ? "bg-[#1E293B] border border-gray-700"
              : "bg-white border border-gray-200"
              }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-emerald-500/20" : "bg-emerald-50"
                  }`}>
                  <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <span className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {stats.active}
                </span>
              </div>
              <p className={`text-sm font-medium ${themeClasses.text.muted}`}>진행 중</p>
            </div>

            {/* Recruiting */}
            <div className={`rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 ${theme === "dark"
              ? "bg-[#1E293B] border border-gray-700"
              : "bg-white border border-gray-200"
              }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-50"
                  }`}>
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <span className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {stats.recruiting}
                </span>
              </div>
              <p className={`text-sm font-medium ${themeClasses.text.muted}`}>모집 중</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Parties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {displayList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className={`inline-block p-8 rounded-xl ${theme === "dark"
              ? "bg-[#1E293B] border border-gray-700"
              : "bg-white border border-gray-200"
              }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === "dark" ? "bg-[#635bff]/20" : "bg-gradient-to-br from-blue-50 to-purple-50"
                }`}>
                <Sparkles className="w-8 h-8" style={{ color: accentColor }} />
              </div>
              <p className={`text-xl font-bold mb-2 ${themeClasses.text.primary}`}>
                {showClosed ? "종료된 파티가 없습니다" : "가입한 파티가 없습니다"}
              </p>
              <p className={`mb-6 ${themeClasses.text.muted}`}>
                {showClosed ? "아직 종료된 파티가 없어요" : "새로운 파티를 만들거나 참여해보세요!"}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate("/party")}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all ${theme === "dark"
                    ? "bg-[#635bff] hover:bg-[#5851e8] text-white"
                    : "bg-[#635bff] hover:bg-[#5851e8] text-white"
                    }`}
                >
                  파티 찾아보기
                </button>
                <button
                  onClick={() => navigate("/party/create")}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all ${theme === "dark"
                    ? "bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  파티 만들기
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Leader Parties Section */}
            {stats.asLeader > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-amber-500/20" : "bg-amber-50"
                    }`}>
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                    내가 파티장인 파티
                  </h2>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                    {stats.asLeader}
                  </span>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {displayList
                    .filter((item) => item.partyLeaderId === currentUserId)
                    .map((item) => {
                      const badge = getStatusBadge(item.partyStatus);
                      const perPersonFee = item.monthlyFee ?? 0;

                      return (
                        <motion.div key={item.partyId} variants={itemVariants}>
                          <Link
                            to={`/party/${item.partyId}`}
                            className="group block"
                          >
                            <div className={`relative h-full rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 ${theme === "dark"
                              ? "bg-[#1E293B] border border-gray-700 hover:border-gray-600"
                              : "bg-white border border-gray-200 hover:border-gray-300"
                              }`}>
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                      <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 ${badge.bg} text-white text-xs font-bold rounded-md`}
                                      >
                                        {badge.text}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-md">
                                        <Crown className="w-3 h-3" /> 파티장
                                      </span>
                                    </div>
                                    <h3 className={`text-lg font-bold transition-colors ${themeClasses.text.primary}`} style={{ "--hover-color": accentColor }}>
                                      {item.productName}
                                    </h3>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mb-4 text-sm">
                                  <div className={`flex items-center gap-2 ${themeClasses.text.muted}`}>
                                    <Users className="w-4 h-4" />
                                    <span>멤버</span>
                                  </div>
                                  <span className={`font-bold ${themeClasses.text.primary}`}>
                                    {item.currentMembers}/{item.maxMembers}
                                  </span>
                                </div>

                                <div className={`rounded-lg p-4 ${theme === "dark"
                                  ? "bg-[#635bff]/10 border border-[#635bff]/20"
                                  : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                                  }`}>
                                  <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>
                                    인당 월 구독료
                                  </p>
                                  <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                    {perPersonFee.toLocaleString()}
                                    <span className={`text-sm font-medium ml-1 ${themeClasses.text.muted}`}>
                                      원
                                    </span>
                                  </p>
                                </div>

                                <div className="mt-4 flex items-center justify-end font-semibold text-sm" style={{ color: accentColor }}>
                                  <span>상세 보기</span>
                                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                </motion.div>
              </div>
            )}

            {/* Member Parties Section */}
            {stats.asMember > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-[#635bff]/20" : "bg-gradient-to-br from-blue-50 to-purple-50"
                    }`}>
                    <Users className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                    참여 중인 파티
                  </h2>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700">
                    {stats.asMember}
                  </span>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {displayList
                    .filter((item) => item.partyLeaderId !== currentUserId)
                    .map((item) => {
                      const badge = getStatusBadge(item.partyStatus);
                      const perPersonFee = item.monthlyFee ?? 0;

                      return (
                        <motion.div key={item.partyId} variants={itemVariants}>
                          <Link
                            to={`/party/${item.partyId}`}
                            className="group block"
                          >
                            <div className={`relative h-full rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 ${theme === "dark"
                              ? "bg-[#1E293B] border border-gray-700 hover:border-gray-600"
                              : "bg-white border border-gray-200 hover:border-gray-300"
                              }`}>
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                      <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 ${badge.bg} text-white text-xs font-bold rounded-md`}
                                      >
                                        {badge.text}
                                      </span>
                                    </div>
                                    <h3 className={`text-lg font-bold transition-colors ${themeClasses.text.primary}`}>
                                      {item.productName}
                                    </h3>
                                    <p className={`text-sm mt-1 ${themeClasses.text.muted}`}>
                                      파티장: {item.leaderNickname}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mb-4 text-sm">
                                  <div className={`flex items-center gap-2 ${themeClasses.text.muted}`}>
                                    <Users className="w-4 h-4" />
                                    <span>멤버</span>
                                  </div>
                                  <span className={`font-bold ${themeClasses.text.primary}`}>
                                    {item.currentMembers}/{item.maxMembers}
                                  </span>
                                </div>

                                <div className={`rounded-lg p-4 ${theme === "dark"
                                  ? "bg-purple-500/10 border border-purple-500/20"
                                  : "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                                  }`}>
                                  <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>
                                    내 월 구독료
                                  </p>
                                  <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                    {perPersonFee.toLocaleString()}
                                    <span className={`text-sm font-medium ml-1 ${themeClasses.text.muted}`}>
                                      원
                                    </span>
                                  </p>
                                </div>

                                <div className="mt-4 flex items-center justify-end font-semibold text-sm" style={{ color: accentColor }}>
                                  <span>상세 보기</span>
                                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
