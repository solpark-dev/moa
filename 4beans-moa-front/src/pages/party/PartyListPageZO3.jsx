import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import ServiceTypeFilter from "../../components/party/ServiceTypeFilter";
import {
  Search,
  Calendar,
  Users,
  X,
  ChevronDown,
  ArrowRight,
  Star,
  Filter,
  Sparkles,
  Play,
  ArrowUpRight,
  Crown,
  Zap,
} from "lucide-react";

/**
 * PartyListPageZO3 - "Neo-Brutalist Pop (Calm Edition)" Party List
 *
 * Design Direction:
 * - Same Pop & Vibrant feel as LandingPageZO3
 * - Neo-brutalist aesthetic with bold borders and shadows
 * - Vibrant color palette: Hot Pink, Lime, Cyan
 * - Calm, neutral backgrounds (white/gray instead of yellow)
 * - Sticker-like elements with random rotations
 * - Marquee scrolling text bands
 * - Playful, energetic vibe with cleaner backdrop
 */

// Sticker Component - 스티커처럼 보이는 요소
function Sticker({ children, color = "bg-white", rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: rotate + 3 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${color}
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
       
        transition-all duration-200
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

// Pop Button Component
function PopButton({ children, color = "bg-pink-500", className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${color}
        px-6 py-3
        font-black text-lg
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
       
        transition-all duration-200
        rounded-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Marquee Component - 흐르는 텍스트
function Marquee({ children, direction = "left", speed = 20 }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Bouncy Card Component
function BouncyCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ y: -8, rotate: 1 }}
      className={`
        bg-white
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:translate-x-[4px] hover:translate-y-[4px]
        rounded-2xl
        overflow-hidden
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// Dot Pattern Background
const DotPattern = () => (
  <div
    className="fixed inset-0 pointer-events-none opacity-[0.03]"
    style={{
      backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
      backgroundSize: '20px 20px'
    }}
  />
);

// OTT Service Colors
const getServiceColor = (serviceName) => {
  const colors = {
    'Netflix': { bg: 'bg-red-500', text: 'text-red-500' },
    'Disney+': { bg: 'bg-blue-600', text: 'text-blue-600' },
    'Wavve': { bg: 'bg-indigo-600', text: 'text-indigo-600' },
    'Tving': { bg: 'bg-red-600', text: 'text-red-600' },
    'Watcha': { bg: 'bg-pink-600', text: 'text-pink-600' },
    'Youtube Premium': { bg: 'bg-red-500', text: 'text-red-500' },
    'Spotify': { bg: 'bg-green-500', text: 'text-green-500' },
  };
  return colors[serviceName] || { bg: 'bg-pink-500', text: 'text-pink-500' };
};

export default function PartyListPageZO3() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const observerTarget = useRef(null);
  const isFirstRender = useRef(true);
  const observerEnabled = useRef(false);

  // Zustand Store
  const {
    parties: list,
    myParties,
    loading: { parties: loadingParties, myParties: loadingMyParties },
    hasMore,
    loadParties,
    loadMyParties
  } = usePartyStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const myPartyIds = Array.isArray(myParties) ? myParties.map(p => p.partyId) : [];
  const isInitialLoading = loadingParties && list.length === 0;

  // 페이지 마운트 시 스크롤 위치 초기화 및 Observer 지연 활성화
  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      observerEnabled.current = true;
    }, 500);

    return () => {
      clearTimeout(timer);
      observerEnabled.current = false;
    };
  }, []);

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 필터 변경 시 리스트 초기화 및 재검색
  useEffect(() => {
    if (!isFirstRender.current) {
      window.scrollTo(0, 0);
    }
    isFirstRender.current = false;

    const params = {
      keyword: debouncedQuery,
      partyStatus: selectedStatus || null,
      productId: selectedProductId || null,
      startDate: startDate || null,
      sort: sortBy
    };
    loadParties(params, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, selectedStatus, selectedProductId, startDate, sortBy]);

  // 내 파티 로드
  useEffect(() => {
    if (user) {
      loadMyParties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 무한 스크롤 Observer
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (observerEnabled.current && target.isIntersecting && hasMore && !loadingParties) {
      const params = {
        keyword: debouncedQuery,
        partyStatus: selectedStatus || null,
        productId: selectedProductId || null,
        startDate: startDate || null,
        sort: sortBy
      };
      loadParties(params, false);
    }
  }, [hasMore, loadingParties, debouncedQuery, selectedStatus, selectedProductId, startDate, sortBy, loadParties]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  const getStatusBadge = (party) => {
    const { partyStatus, maxMembers, currentMembers } = party;
    const remainingSlots = (maxMembers || 0) - (currentMembers || 0);

    if (partyStatus === 'RECRUITING' && remainingSlots === 1) {
      return {
        color: "bg-pink-500",
        text: "마감임박 🔥",
        rotate: -3,
      };
    }

    const badges = {
      RECRUITING: {
        color: "bg-cyan-400",
        text: "모집중 🙋",
        rotate: -2,
      },
      ACTIVE: {
        color: "bg-lime-400",
        text: "파티중 🎉",
        rotate: 2,
      },
      PENDING_PAYMENT: {
        color: "bg-amber-400",
        text: "결제대기 💳",
        rotate: -1,
      },
      CLOSED: {
        color: "bg-gray-300",
        text: "종료됨",
        rotate: 0,
      },
    };
    return badges[partyStatus] || badges.RECRUITING;
  };

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

  return (
    <div className="min-h-screen bg-slate-50 text-black overflow-hidden">
      <DotPattern />

      {/* Hero Section */}
      <section className="relative px-4 md:px-8 pt-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Floating Decorations */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-16 right-[10%] hidden lg:block"
          >
            <Sticker color="bg-cyan-400" rotate={12} className="px-4 py-2 rounded-xl">
              <span className="font-black text-lg">75% OFF! 🔥</span>
            </Sticker>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0], rotate: [-8, -12, -8] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            className="absolute top-32 left-[5%] hidden lg:block"
          >
            <Sticker color="bg-lime-400" rotate={-8} className="px-3 py-1 rounded-lg">
              <span className="font-bold text-sm">NEW! ✨</span>
            </Sticker>
          </motion.div>

          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sticker color="bg-pink-500" rotate={-2} className="inline-block px-6 py-3 rounded-xl mb-6">
                <span className="text-xl font-black text-white">파티 찾기 🎊</span>
              </Sticker>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-6"
            >
              <span className="block text-black">함께 보면</span>
              <span className="block text-cyan-400">
                더 저렴해!
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-8"
            >
              원하는 OTT 파티에 참여하고, 매달 구독료를 아껴보세요!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <PopButton
                color="bg-pink-500 text-white"
                onClick={() => navigate("/party/create")}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  파티 만들기
                </span>
              </PopButton>
              <PopButton color="bg-white text-black">
                <span className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  둘러보기
                </span>
              </PopButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Band */}
      <div className="bg-black text-white py-3 border-y-4 border-black mb-8">
        <Marquee speed={25}>
          <div className="flex items-center gap-8 px-4">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-4 text-lg font-black uppercase tracking-wider">
                <Star className="w-5 h-5 text-pink-400 fill-pink-400" />
                Netflix
                <Star className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                Disney+
                <Star className="w-5 h-5 text-lime-400 fill-lime-400" />
                Wavve
                <Star className="w-5 h-5 text-pink-400 fill-pink-400" />
                Tving
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Search & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Sticker
            color="bg-white"
            rotate={0}
            className="p-6 rounded-2xl mb-8"
          >
            {/* Search Input */}
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-12 py-4 border border-gray-200 rounded-xl bg-slate-50 text-black placeholder-gray-400 focus:outline-none focus:bg-white font-semibold text-lg transition-colors"
                placeholder="파티 이름, 방장 닉네임 검색 🔍"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-col gap-4">
              {/* Status Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-gray-500 mr-2" />
                {[
                  { value: "", label: "전체", emoji: "📋" },
                  { value: "RECRUITING", label: "모집중", emoji: "🙋" },
                  { value: "ACTIVE", label: "파티중", emoji: "🎉" },
                  { value: "CLOSED", label: "종료", emoji: "🔒" },
                ].map((filter) => (
                  <motion.button
                    key={filter.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStatus(filter.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 transition-all duration-200 ${
                      selectedStatus === filter.value
                        ? "bg-pink-500 text-white shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
                        : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                    }`}
                  >
                    {filter.emoji} {filter.label}
                  </motion.button>
                ))}
              </div>

              {/* Additional Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <ServiceTypeFilter
                  selectedProductId={selectedProductId}
                  onSelect={setSelectedProductId}
                />

                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="appearance-none bg-slate-100 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl pl-4 pr-4 py-2.5 focus:outline-none focus:bg-white transition-colors cursor-pointer"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative ml-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-gray-700 hover:bg-slate-50 focus:outline-none cursor-pointer transition-colors"
                  >
                    <option value="latest">최신순</option>
                    <option value="start_date_asc">시작 빠른순</option>
                    <option value="popularity">인기순</option>
                    <option value="price_low">가격 낮은순</option>
                    <option value="price_high">가격 높은순</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </Sticker>
        </motion.div>

        {/* Parties Grid */}
        {isInitialLoading ? (
          // Shimmer Loading - Neo-Brutalist Style
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="h-36 bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded-lg w-2/3 animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded-lg w-full animate-pulse" />
                  <div className="flex justify-between items-center pt-3">
                    <div className="h-4 bg-slate-200 rounded-lg w-1/3 animate-pulse" />
                    <div className="h-6 bg-slate-200 rounded-lg w-1/4 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          // Empty State - Neo-Brutalist Style
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Sticker color="bg-white" rotate={-2} className="inline-block px-12 py-10 rounded-3xl">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                앗, 파티가 없어요!
              </h3>
              <p className="text-gray-500 mb-6 font-medium">
                다른 검색어나 필터를 시도해보세요
              </p>
              <PopButton
                color="bg-pink-500 text-white"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus("");
                  setSelectedProductId(null);
                  setStartDate("");
                }}
              >
                필터 초기화 🔄
              </PopButton>
            </Sticker>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((party, index) => {
              const badge = getStatusBadge(party);
              const isMyParty = myPartyIds.includes(party.partyId);
              const isLeader = user?.userId === party.partyLeaderId;
              const remainingSlots = (party.maxMembers || 4) - (party.currentMembers || 0);
              const serviceColor = getServiceColor(party.productName);

              return (
                <BouncyCard
                  key={party.partyId}
                  delay={index * 0.05}
                  className="cursor-pointer"
                >
                  <div
                    onClick={() => {
                      if (!user) {
                        if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
                          navigate("/login");
                        }
                        return;
                      }
                      navigate(`/party/${party.partyId}`);
                    }}
                  >
                    {/* Service Banner */}
                    <div className={`relative h-36 ${serviceColor.bg} flex items-center justify-center`}>
                      {party.productImage ? (
                        <img
                          src={party.productImage}
                          alt={party.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl font-black text-white/30">
                          {party.productName?.[0]}
                        </span>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <Sticker
                          color={badge.color}
                          rotate={badge.rotate}
                          className="px-3 py-1 rounded-lg"
                        >
                          <span className="text-xs font-bold text-black">
                            {badge.text}
                          </span>
                        </Sticker>
                      </div>

                      {/* My Party / Leader Badge */}
                      {(isLeader || isMyParty) && (
                        <div className="absolute top-3 right-3">
                          <Sticker
                            color={isLeader ? "bg-amber-400" : "bg-white"}
                            rotate={3}
                            className="px-2 py-1 rounded-lg"
                          >
                            <span className="flex items-center gap-1 text-xs font-bold">
                              {isLeader ? (
                                <>
                                  <Crown className="w-3 h-3" /> 파티장
                                </>
                              ) : (
                                "참여중"
                              )}
                            </span>
                          </Sticker>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Service Tag */}
                      <div className="inline-block bg-slate-100 border border-gray-200 px-3 py-1 rounded-lg mb-3">
                        <span className="text-xs font-bold">{party.productName}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-black text-lg mb-3 line-clamp-1">
                        {party.title || `${party.productName} 파티`}
                      </h3>

                      {/* Info Row */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(party.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <Users className="w-4 h-4" />
                          <span>{party.currentMembers || 0}/{party.maxMembers || 4}</span>
                        </div>
                      </div>

                      {/* Remaining Slots Warning */}
                      {remainingSlots <= 2 && remainingSlots > 0 && party.partyStatus === 'RECRUITING' && (
                        <div className="bg-pink-100 border-2 border-pink-400 rounded-lg px-3 py-2 mb-4">
                          <span className="text-xs font-bold text-pink-600 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {remainingSlots}자리 남았어요!
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="bg-black text-white rounded-xl px-4 py-3 flex items-center justify-between">
                        <span className="text-sm font-medium">월 구독료</span>
                        <span className="text-xl font-black">
                          ₩{party.monthlyFee?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </BouncyCard>
              );
            })}
          </div>
        )}

        {/* Infinite Scroll Loader */}
        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
          {loadingParties && !isInitialLoading && (
            <Sticker color="bg-cyan-400" rotate={-2} className="px-6 py-3 rounded-xl">
              <span className="flex items-center gap-3 font-bold">
                <div className="w-5 h-5 border border-gray-200 border-t-transparent rounded-full animate-spin" />
                더 불러오는 중...
              </span>
            </Sticker>
          )}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <section className="px-4 md:px-8 py-16 bg-white border-t-4 border-black mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <Sticker
            color="bg-slate-100"
            rotate={0}
            className="p-10 md:p-14 rounded-3xl"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🎊
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              원하는 파티가 없다면?<br />
              <span className="text-pink-500">직접 만들어보세요!</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-medium">
              파티장이 되어 구독료를 더 많이 아껴보세요!
            </p>
            <PopButton
              color="bg-pink-500 text-white"
              className="text-xl px-10 py-5"
              onClick={() => navigate("/party/create")}
            >
              <span className="flex items-center gap-3">
                파티 만들러 가기
                <ArrowRight className="w-6 h-6" />
              </span>
            </PopButton>
          </Sticker>
        </div>
      </section>
    </div>
  );
}
