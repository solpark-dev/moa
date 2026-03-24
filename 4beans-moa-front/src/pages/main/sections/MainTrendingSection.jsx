import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Users, Calendar } from "lucide-react";
import { useMainStore } from "@/store/main/mainStore";
import { useThemeStore } from "@/store/themeStore";
import {
  formatCurrency,
  getPartyId,
  getPartyTitle,
  getPartyDescription,
  getPartyPrice,
  getPartyServiceName,
  getPartyHostName,
  getPartyStatus,
  getPartyMembers,
  getPartyMaxMembers,
} from "@/utils/format";
import { getProductIconUrl } from "@/utils/imageUtils";

// 테마별 Trending 섹션 스타일
const trendingThemeStyles = {
  pop: {
    stickerBg: "bg-pink-500",
    recruitingBg: "bg-cyan-400",
    priceColor: "text-pink-500",
    progressGradient: "bg-gradient-to-r from-orange-400 to-pink-500",
    percentColor: "text-orange-500",
    emoji: "⏰",
    cardBgColors: ["bg-red-500", "bg-blue-500", "bg-indigo-500"],
  },
  dark: {
    stickerBg: "bg-[#635bff]",
    recruitingBg: "bg-[#00d4ff]",
    recruitingText: "text-black",
    priceColor: "text-[#635bff]",
    progressGradient: "bg-gradient-to-r from-[#635bff] to-[#00d4ff]",
    percentColor: "text-[#00d4ff]",
    emoji: "⏰",
    cardBgColors: ["bg-[#635bff]", "bg-[#00d4ff]", "bg-[#4fd1c5]"],
  },
  christmas: {
    stickerBg: "bg-[#c41e3a]",
    recruitingBg: "bg-[#1a5f2a]",
    recruitingText: "text-white",
    priceColor: "text-[#c41e3a]",
    progressGradient: "bg-gradient-to-r from-[#1a5f2a] to-[#c41e3a]",
    percentColor: "text-[#c41e3a]",
    emoji: "🎅",
    cardBgColors: ["bg-[#c41e3a]", "bg-[#1a5f2a]", "bg-[#c41e3a]"],
  },
};

function Sticker({ children, color = "bg-white", rotate = 0, className = "", isDark = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${color}
        border ${isDark ? 'border-gray-600' : 'border-gray-200'}
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
        transition-all duration-200
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

function BouncyCard({ children, className = "", delay = 0, onClick, isDark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 16 }}
      whileHover={{ y: -8, rotate: 1 }}
      onClick={onClick}
      className={`
        ${isDark ? 'bg-[#1E293B]' : 'bg-white'}
        ${isDark ? 'border-gray-600' : 'border-gray-200'}
        border
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        rounded-3xl
        overflow-hidden
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default function MainTrendingSection() {
  const navigate = useNavigate();
  const parties = useMainStore((s) => s.parties);
  const partiesLoading = useMainStore((s) => s.partiesLoading);
  const partiesError = useMainStore((s) => s.partiesError);
  const { theme } = useThemeStore();
  const themeStyle = trendingThemeStyles[theme] || trendingThemeStyles.pop;
  const isDark = theme === "dark";

  // 마감 임박 파티 6개 선택 (모집률 높은 순) - 실제 마감임박 파티만 표시
  const visible = useMemo(() => {
    const list = Array.isArray(parties) ? [...parties] : [];

    const sorted = list
      .map((party) => {
        const members = party.currentMembers || 0;
        const maxMembers = party.maxMembers || 4;
        const fillRatio = members / maxMembers;
        return { party, fillRatio };
      })
      .sort((a, b) => b.fillRatio - a.fillRatio)
      .map((item) => item.party);
    return sorted.slice(0, 6);
  }, [parties]);

  const goParty = (party) => {
    if (!party.partyId) return;
    navigate(`/party/${party.partyId}`);
  };

  const formatDate = (dateData) => {
    if (!dateData) return "-";
    if (Array.isArray(dateData)) {
      const [year, month, day] = dateData;
      return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
    }
    const date = new Date(dateData);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const getStatusBadge = (party) => {
    const { partyStatus, maxMembers, currentMembers } = party;
    const remainingSlots = (maxMembers || 0) - (currentMembers || 0);
    if (partyStatus === "RECRUITING" && remainingSlots === 1) {
      return { bg: "bg-gradient-to-r from-orange-500 to-red-500", text: "마감임박", pulse: true };
    }
    const badges = {
      RECRUITING: { bg: "bg-[#635bff]", text: "모집중" },
      ACTIVE: { bg: "bg-emerald-500", text: "파티중" },
      PENDING_PAYMENT: { bg: "bg-amber-500", text: "결제대기" },
      CLOSED: { bg: "bg-gray-400", text: "파티종료" },
    };
    return badges[partyStatus] || badges.RECRUITING;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] } },
  };

  return (
    <section className={`relative px-6 md:px-12 py-20 ${isDark ? "bg-slate-800" : "bg-transparent"} border-b ${isDark ? "border-gray-600" : "border-gray-200"}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <Sticker color={themeStyle.stickerBg} rotate={-1} className="inline-block px-4 py-2 rounded-xl mb-4">
              <span className="font-black text-white">
                {theme === "christmas" ? "🎅 마감 임박 🎄" : `마감 임박 ${themeStyle.emoji}`}
              </span>
            </Sticker>
            <h2 className={`text-4xl md:text-5xl font-black ${isDark ? 'text-white' : ''}`}>서두르세요!</h2>
            <p className={`font-medium mt-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>곧 마감되는 파티에 지금 바로 참여하세요.</p>
          </div>
          <Link to="/party">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-5 py-3 rounded-xl cursor-pointer bg-black">
              <span className="flex items-center gap-2 text-white font-black">전체 보기 <ArrowUpRight className="w-5 h-5" /></span>
            </motion.div>
          </Link>
        </motion.div>

        {partiesError?.status === 401 && (
          <div className="mb-10">
            <div className={`${isDark ? "bg-[#1E293B]" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-200"} rounded-2xl p-6 font-bold`}>
              파티 목록은 로그인 후 확인할 수 있어요.
            </div>
          </div>
        )}

        {partiesLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`${isDark ? "bg-[#1E293B] border-gray-700" : "bg-white border-gray-100"} border rounded-2xl overflow-hidden animate-pulse`}>
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-1/3" />
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                  <div className="h-6 bg-gray-200 rounded-lg w-2/5 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}


        {!partiesLoading && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((party, i) => {
                const service = getPartyServiceName(party);
                const host = getPartyHostName(party);
                const title = getPartyTitle(party);
                const desc = getPartyDescription(party);
                const price = getPartyPrice(party);
                const members = getPartyMembers(party) || 0;
                const maxMembers = getPartyMaxMembers(party) || 4;
                const fillPercent = Math.round((members / maxMembers) * 100);
                const status = String(getPartyStatus(party) || "");
                const isRecruiting =
                  status.toUpperCase() === "RECRUITING" ||
                  status.toUpperCase() === "OPEN" ||
                  status.toUpperCase() === "ACTIVE";

                const bg = themeStyle.cardBgColors[i % 3];

                return (
                  <motion.div
                    key={party.partyId}
                    variants={itemVariants}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    onClick={() => goParty(party)}
                    className="cursor-pointer"
                  >
                    <div className={`h-28 ${bg} border-b border-gray-200 flex items-center justify-center p-4 rounded-t-2xl relative`}>
                      {/* 상품 아이콘 이미지 */}
                      {party.productImage ? (
                        <img
                          src={getProductIconUrl(party.productImage)}
                          alt={party.productName}
                          className="max-w-[50%] max-h-[70%] object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                          <span className="text-white text-2xl font-black">
                            {party.productName?.[0] || "P"}
                          </span>
                        </div>
                      )}

                      {/* 모집중 뱃지 */}
                      <div className="absolute top-3 right-3">
                        <Sticker
                          color={isRecruiting ? themeStyle.recruitingBg : "bg-slate-200"}
                          rotate={-2}
                          className="px-2 py-1 rounded-lg"
                        >
                          <span className={`text-xs font-black ${isRecruiting && themeStyle.recruitingText ? themeStyle.recruitingText : ""}`}>
                            {isRecruiting ? (theme === "christmas" ? "🎄 모집중" : "모집중 🙋") : "마감"}
                          </span>
                        </Sticker>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`p-5 ${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-b-2xl border border-t-0 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                      {/* Service Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDark ? "text-[#635bff] bg-[#635bff]/20" : "text-[#635bff] bg-[#635bff]/10"}`}>
                          {party.productName}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-1 text-sm font-black ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            <Users className="w-4 h-4" />
                            <span>{members}/{maxMembers}명</span>
                          </div>
                          <span className={`font-black ${themeStyle.priceColor}`}>
                            {formatCurrency(price, { fallback: "0원" })}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${themeStyle.progressGradient} rounded-full transition-all duration-500`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                        <div className={`text-xs font-bold ${themeStyle.percentColor} text-right`}>
                          {fillPercent}% 모집 완료
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {visible.length === 0 && (
              <div className="py-16 text-center">
                <div className={`inline-block ${isDark ? "bg-[#1E293B]" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-200"} rounded-2xl px-8 py-6 font-black ${isDark ? "text-white" : "text-black"}`}>
                  표시할 파티가 없습니다.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
