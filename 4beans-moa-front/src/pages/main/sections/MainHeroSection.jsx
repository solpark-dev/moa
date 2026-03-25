import React, { useRef, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Sparkles, Users, ArrowRight, Plus, Search } from "lucide-react";
import { NeoCard } from "@/components/common/neo";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import {
  formatCurrency,
  getPartyServiceName,
  getPartyPrice,
  getPartyMembers,
  getProductMaxProfiles,
} from "@/utils/format";
import { getProductIconUrl } from "@/utils/imageUtils";

// ============================================
// 테마별 히어로 섹션 스타일
// ============================================
const heroThemeStyles = {
  light: {
    confettiColors: ["bg-pink-400", "bg-cyan-400", "bg-lime-400", "bg-yellow-400", "bg-pink-500", "bg-blue-400", "bg-purple-400", "bg-cyan-300", "bg-orange-400", "bg-lime-300"],
    badgeBg: "bg-white",
    badgeText: "text-pink-500",
    headlineAccent1: "text-cyan-400",
    headlineAccent2: "text-pink-500",
    primaryBtn: "bg-pink-500 text-white",
    primaryBtnHover: "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]",
    secondaryBtn: "bg-cyan-400 text-black",
    secondaryBtnHover: "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]",
    stickerLeft: "bg-lime-400",
    stickerRight: "bg-cyan-400",
    hotPartyBadge: "bg-lime-400",
    subtext: "text-gray-700",
    searchResultHover: "hover:bg-pink-50",
  },
  dark: {
    confettiColors: ["bg-[#635bff]", "bg-[#00d4ff]", "bg-[#4fd1c5]", "bg-gray-600", "bg-[#635bff]", "bg-[#00d4ff]", "bg-gray-500", "bg-[#4fd1c5]", "bg-gray-600", "bg-[#635bff]"],
    badgeBg: "bg-[#1E293B]",
    badgeText: "text-[#635bff]",
    headlineAccent1: "text-[#00d4ff]",
    headlineAccent2: "text-[#635bff]",
    primaryBtn: "bg-[#635bff] text-white",
    primaryBtnHover: "hover:bg-[#5851e8] hover:shadow-[6px_6px_16px_rgba(99,91,255,0.3)]",
    secondaryBtn: "bg-[#1E293B] text-white border border-gray-600",
    secondaryBtnHover: "hover:bg-[#2D3B4F]",
    stickerLeft: "bg-[#635bff]",
    stickerRight: "bg-[#00d4ff]",
    hotPartyBadge: "bg-[#635bff]",
    subtext: "text-gray-400",
    searchResultHover: "hover:bg-[#2D3B4F]",
  },
};

// ============================================
// Confetti Component - 둥둥 떠다니는 종이 조각
// ============================================
const Confetti = ({ themeStyle }) => {
  const colors = themeStyle?.confettiColors || heroThemeStyles.light.confettiColors;

  const confettiPieces = [
    { color: colors[0], size: "w-4 h-4", left: "5%", delay: 0, duration: 8, rotate: 45 },
    { color: colors[1], size: "w-3 h-3", left: "15%", delay: 1.2, duration: 10, rotate: -30 },
    { color: colors[2], size: "w-5 h-2", left: "25%", delay: 0.5, duration: 9, rotate: 60 },
    { color: colors[3], size: "w-3 h-3", left: "35%", delay: 2, duration: 11, rotate: -45 },
    { color: colors[4], size: "w-2 h-5", left: "45%", delay: 0.8, duration: 8.5, rotate: 30 },
    { color: colors[5], size: "w-4 h-3", left: "55%", delay: 1.5, duration: 10.5, rotate: -60 },
    { color: colors[6], size: "w-3 h-4", left: "65%", delay: 0.3, duration: 9.5, rotate: 45 },
    { color: colors[7], size: "w-2 h-2", left: "75%", delay: 2.5, duration: 8, rotate: -30 },
    { color: colors[8], size: "w-4 h-2", left: "85%", delay: 1, duration: 11, rotate: 60 },
    { color: colors[9], size: "w-3 h-3", left: "92%", delay: 0.7, duration: 9, rotate: -45 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {confettiPieces.map((piece, index) => (
        <motion.div
          key={index}
          className={`absolute ${piece.color} ${piece.size} rounded-sm border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}
          style={{ left: piece.left, top: -20 }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [piece.rotate, piece.rotate + 360],
            x: [0, Math.sin(index) * 50, 0, Math.sin(index) * -30, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function MainHeroSection({ parties, products = [] }) {
  const navigate = useNavigate();

  // 테마 설정
  const { theme } = useThemeStore();
  const themeStyle = heroThemeStyles[theme] || heroThemeStyles.light;
  const isDark = theme === "dark";

  // 로그인 상태 확인
  const { user } = useAuthStore();

  // portrait-v2 스타일: useInView로 섹션 감지
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const desktopCardsRef = useRef(null);
  const mobileCardsRef = useRef(null);

  // 히어로 섹션이 보일 때 감지
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  // 카드 섹션 타이틀 감지
  const isCardsInView = useInView(cardsRef, { once: false, amount: 0.3 });
  // 데스크탑 카드 감지
  const isDesktopCardsInView = useInView(desktopCardsRef, { once: false, amount: 0.4 });
  // 모바일 카드 감지
  const isMobileCardsInView = useInView(mobileCardsRef, { once: false, amount: 0.4 });

  // 흩어진 위치 (초기)
  const scatterPositions = [
    { x: -320, y: -180, rotate: -12, scale: 0.9 },
    { x: 320, y: -160, rotate: 15, scale: 0.85 },
    { x: -380, y: 80, rotate: 8, scale: 0.88 },
    { x: 360, y: 100, rotate: -10, scale: 0.92 },
    { x: -200, y: 220, rotate: 18, scale: 0.86 },
    { x: 200, y: 240, rotate: -15, scale: 0.9 },
  ];

  // 모인 그리드 위치 (최종) - 카드 간격 넓힘
  const gridPositions = [
    { x: -230, y: -110, rotate: 0, scale: 1 },
    { x: 0, y: -110, rotate: 0, scale: 1 },
    { x: 230, y: -110, rotate: 0, scale: 1 },
    { x: -230, y: 120, rotate: 0, scale: 1 },
    { x: 0, y: 120, rotate: 0, scale: 1 },
    { x: 230, y: 120, rotate: 0, scale: 1 },
  ];

  // 서비스별 색상 매핑
  const serviceColors = {
    "넷플릭스": { bg: "bg-red-500", emoji: "N" },
    "netflix": { bg: "bg-red-500", emoji: "N" },
    "디즈니+": { bg: "bg-blue-500", emoji: "D+" },
    "disney": { bg: "bg-blue-500", emoji: "D+" },
    "유튜브": { bg: "bg-red-600", emoji: "Y" },
    "youtube": { bg: "bg-red-600", emoji: "Y" },
    "스포티파이": { bg: "bg-lime-400", emoji: "S" },
    "spotify": { bg: "bg-lime-400", emoji: "S" },
    "웨이브": { bg: "bg-cyan-400", emoji: "W" },
    "wavve": { bg: "bg-cyan-400", emoji: "W" },
    "왓챠": { bg: "bg-yellow-400", emoji: "왓" },
    "watcha": { bg: "bg-yellow-400", emoji: "왓" },
  };

  const defaultColors = ["bg-red-500", "bg-blue-500", "bg-pink-500", "bg-lime-400", "bg-cyan-400", "bg-yellow-400"];

  // 파티가 없을 때 표시할 빈 카드 데이터 (고유한 문자열 id 사용)
  const emptyCards = [
    { id: "empty-netflix", isEmpty: true, bgColor: "bg-red-500", emoji: "N", serviceName: "넷플릭스" },
    { id: "empty-disney", isEmpty: true, bgColor: "bg-blue-500", emoji: "D+", serviceName: "디즈니+" },
    { id: "empty-youtube", isEmpty: true, bgColor: "bg-pink-500", emoji: "Y", serviceName: "유튜브" },
    { id: "empty-spotify", isEmpty: true, bgColor: "bg-lime-400", emoji: "S", serviceName: "스포티파이" },
    { id: "empty-wavve", isEmpty: true, bgColor: "bg-cyan-400", emoji: "W", serviceName: "웨이브" },
    { id: "empty-watcha", isEmpty: true, bgColor: "bg-yellow-400", emoji: "왓", serviceName: "왓챠" },
  ];

  // 카드 데이터 - 항상 6개 표시 (부족하면 빈 카드로 채움)
  const cards = useMemo(() => {
    if (!Array.isArray(parties) || parties.length === 0) {
      return emptyCards;
    }

    const partyCards = parties.slice(0, 6).map((party, i) => {
      const serviceName = getPartyServiceName(party) || "OTT";
      const serviceNameLower = serviceName.toLowerCase();

      let colorInfo = null;
      for (const [key, value] of Object.entries(serviceColors)) {
        if (serviceNameLower.includes(key.toLowerCase())) {
          colorInfo = value;
          break;
        }
      }

      const currentMembers = getPartyMembers(party);
      const maxMembers = getProductMaxProfiles(party) || party?.maxMembers || 4;
      const membersText = currentMembers !== null ? `${currentMembers}/${maxMembers}` : "0/4";

      return {
        id: party?.partyId || party?.id || i + 1,
        isEmpty: false,
        name: serviceName,
        category: party?.category || "영상",
        price: formatCurrency(getPartyPrice(party), { fallback: "-" }),
        members: membersText,
        bgColor: colorInfo?.bg || defaultColors[i % defaultColors.length],
        emoji: colorInfo?.emoji || serviceName.charAt(0).toUpperCase(),
        productImage: party?.productImage || null,
      };
    });

    // 6개 미만이면 빈 카드로 채움
    if (partyCards.length < 6) {
      const remainingCount = 6 - partyCards.length;
      const remainingEmptyCards = emptyCards.slice(partyCards.length, partyCards.length + remainingCount);
      return [...partyCards, ...remainingEmptyCards];
    }

    return partyCards;
  }, [parties]);

  return (
    <>
      {/* 히어로 섹션 */}
      <section ref={heroRef} className="relative pt-12 pb-10 flex flex-col items-center justify-center px-6">
        <Confetti themeStyle={themeStyle} />

        {/* 플로팅 스티커 - 좌측 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute top-4 left-[5%] md:left-[10%] hidden md:block z-20"
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [-8, -12, -8] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <NeoCard color={themeStyle.stickerLeft} rotate={-8} className="px-2 py-1 md:px-3 rounded-lg">
              <span className="font-bold text-xs md:text-sm">NEW!</span>
            </NeoCard>
          </motion.div>
        </motion.div>

        {/* 플로팅 스티커 - 우측 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute top-0 right-[5%] md:right-[15%] hidden md:block z-20"
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <NeoCard color={themeStyle.stickerRight} rotate={12} className="px-3 py-1 md:px-4 md:py-2 rounded-xl">
              <span className="font-black text-sm md:text-lg">75% OFF!</span>
            </NeoCard>
          </motion.div>
        </motion.div>

        {/* 메인 헤드라인 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <NeoCard color={themeStyle.badgeBg} rotate={1} className="inline-block px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl mb-4 sm:mb-8">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sparkles size={14} className={`${themeStyle.badgeText} sm:w-4 sm:h-4`} />
                <span className="font-bold text-xs sm:text-sm md:text-base">구독료, 이제 똑똑하게 나눠요</span>
              </div>
            </NeoCard>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[40px] sm:text-[56px] md:text-[80px] lg:text-[100px] font-black leading-[0.95] tracking-tighter mb-6 md:mb-8"
          >
            <span className="block transform -rotate-1">SHARE</span>
            <span
              className="block transform rotate-1 [text-shadow:2px_2px_0px_rgba(0,0,0,1)] sm:[text-shadow:3px_3px_0px_rgba(0,0,0,1)] md:[text-shadow:4px_4px_0px_rgba(0,0,0,1)]"
              style={{ textShadow: 'none' }}
            >
              <span className={themeStyle.headlineAccent1}>YOUR</span>
            </span>
            <span
              className={`block transform -rotate-1 ${themeStyle.headlineAccent2} [text-shadow:2px_2px_0px_rgba(0,0,0,1)] sm:[text-shadow:3px_3px_0px_rgba(0,0,0,1)] md:[text-shadow:4px_4px_0px_rgba(0,0,0,1)]`}
              style={{ textShadow: 'none' }}
            >
              OTT!
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-6 md:mb-10 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            넷플릭스, 디즈니+, 유튜브 프리미엄까지 함께 나누면 최대 75% 절약!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col gap-3 sm:gap-5 items-center"
          >
            {/* 버튼 그룹 - 항상 나란히 */}
            <div className="flex flex-row gap-2 sm:gap-3">
              {!user && (
                <Link to="/signup">
                  <button className={`px-3 py-2 sm:px-4 sm:py-3 font-bold ${themeStyle.primaryBtn} border border-gray-200 rounded-lg sm:rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] ${themeStyle.primaryBtnHover} transition-all text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2`}>
                    회원가입
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </Link>
              )}
              <Link to="/party/create">
                <button className={`px-3 py-2 sm:px-4 sm:py-3 font-bold ${themeStyle.secondaryBtn} border border-gray-200 rounded-lg sm:rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] ${themeStyle.secondaryBtnHover} transition-all text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2`}>
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  파티 만들기
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* 스크롤 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-400 text-sm flex flex-col items-center gap-2"
          >
            <span className="text-3xl md:text-4xl font-light">↓</span>
          </motion.div>
        </motion.div>
      </section>

      {/* 카드 그리드 섹션 - portrait-v2 스타일 */}
      <section ref={cardsRef} className="relative flex flex-col items-center overflow-hidden px-6 pt-10 pb-20">
        {/* 섹션 타이틀 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 z-20"
        >
          <NeoCard color={themeStyle.hotPartyBadge} rotate={-2} className="inline-block px-6 py-3 rounded-xl mb-4">
            <span className="text-xl font-black">HOT PARTY! 🔥</span>
          </NeoCard>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black ${isDark ? 'text-white' : ''}`}>
            지금 인기 있는 파티
          </h2>
          <p className={`text-sm md:text-base mt-3 font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>원하는 서비스를 골라 바로 참여하세요</p>
        </motion.div>

        {/* 데스크탑 버전 - 카드가 날아와서 모임 */}
        <div ref={desktopCardsRef} className="hidden md:flex relative w-full max-w-5xl h-[450px] items-center justify-center">
          {cards.map((card, index) => {
            const scatter = scatterPositions[index];
            const grid = gridPositions[index];

            return (
              <motion.div
                key={card.id}
                initial={{
                  x: scatter.x,
                  y: scatter.y,
                  rotate: scatter.rotate,
                  scale: scatter.scale,
                  opacity: 0
                }}
                animate={isDesktopCardsInView ? {
                  x: grid.x,
                  y: grid.y,
                  rotate: grid.rotate,
                  scale: grid.scale,
                  opacity: 1
                } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + index * 0.1,
                  ease: [0.4, 0.0, 0.2, 1]
                }}
                className="absolute"
              >
                <ServiceCard card={card} theme={theme} themeStyle={themeStyle} user={user} navigate={navigate} />
              </motion.div>
            );
          })}
        </div>

        {/* 모바일 버전 - 2열 3행 그리드 */}
        <div ref={mobileCardsRef} className="md:hidden grid grid-cols-2 gap-6 w-full max-w-[380px] mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isMobileCardsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.1,
                ease: [0.4, 0.0, 0.2, 1]
              }}
            >
              <ServiceCard card={card} theme={theme} themeStyle={themeStyle} user={user} navigate={navigate} />
            </motion.div>
          ))}
        </div>

        {/* 파티 전체보기 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 z-20"
        >
          <Link to="/party">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 ${themeStyle.primaryBtn} font-black rounded-full border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] ${themeStyle.primaryBtnHover} transition-all`}
            >
              🍿 파티 전체보기
            </motion.div>
          </Link>
        </motion.div>
      </section>
    </>
  );
}

// 서비스 카드 컴포넌트
function ServiceCard({ card, theme, themeStyle, user, navigate }) {
  const accentColor = themeStyle?.headlineAccent2 || "text-pink-500";
  const badgeBg = "bg-lime-400";
  const badgeText = "text-black";
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#1E293B]" : "bg-white";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const textColor = isDark ? "text-white" : "text-black";

  // 빈 카드 클릭 핸들러 - 로그인 여부에 따라 이동
  const handleEmptyCardClick = () => {
    if (user) {
      navigate("/party/create");
    } else {
      navigate("/login");
    }
  };

  // 아이콘 URL 생성
  const iconUrl = card.productImage ? getProductIconUrl(card.productImage) : null;

  // 파티가 없는 빈 카드 - 실제 파티 카드와 동일한 높이
  if (card.isEmpty) {
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleEmptyCardClick}
        className={`w-[130px] sm:w-[150px] md:w-[170px] h-[160px] sm:h-[180px] md:h-[190px] ${cardBg} border rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-all flex flex-col`}
      >
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${card.bgColor} rounded-lg sm:rounded-xl ${isDark ? 'border-gray-600' : 'border-gray-200'} border flex items-center justify-center mb-2 sm:mb-3`}>
          <span className="text-white font-black text-sm sm:text-lg">{card.emoji}</span>
        </div>
        <h3 className={`font-black ${textColor} text-xs sm:text-sm mb-1 truncate`}>{card.serviceName}</h3>
        <p className={`text-[10px] sm:text-xs ${subTextColor} font-bold mb-2 sm:mb-3`}>구독 서비스</p>
        <div className="flex items-center justify-between mt-auto">
          <div className={`flex items-center gap-1 ${accentColor}`}>
            <Plus size={12} className="stroke-[3] sm:w-[14px] sm:h-[14px]" />
            <span className="text-[10px] sm:text-xs font-black">파티 만들기</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // 파티 카드 클릭 핸들러
  const handlePartyCardClick = () => {
    if (card.id) {
      navigate(`/party/${card.id}`);
    }
  };

  // 파티가 있는 일반 카드
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePartyCardClick}
      className={`w-[130px] sm:w-[150px] md:w-[170px] h-[160px] sm:h-[180px] md:h-[190px] ${cardBg} border rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-shadow flex flex-col`}
    >
      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${card.bgColor} rounded-lg sm:rounded-xl ${isDark ? 'border-gray-600' : 'border-gray-200'} border flex items-center justify-center mb-2 sm:mb-3 overflow-hidden`}>
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={card.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-black text-sm sm:text-lg">{card.emoji}</span>
        )}
      </div>
      <h3 className={`font-black ${textColor} text-xs sm:text-sm mb-1 truncate`}>{card.name}</h3>
      <p className={`text-[10px] sm:text-xs ${subTextColor} font-bold mb-2 sm:mb-3 truncate`}>{card.category}</p>
      <div className="flex items-center justify-between mt-auto gap-1">
        <div className="min-w-0 flex-shrink">
          <p className={`text-sm sm:text-lg font-black ${accentColor} truncate`}>{card.price}</p>
          <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold">월 비용</p>
        </div>
        <div className={`flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-bold ${badgeText} ${badgeBg} px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-gray-200 flex-shrink-0`}>
          <Users size={10} className="sm:w-3 sm:h-3" />
          <span>{card.members}</span>
        </div>
      </div>
    </motion.div>
  );
}
