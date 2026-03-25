import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import ServiceTypeFilter from "../../components/party/ServiceTypeFilter";
import {
  themeConfig,
  GridPattern,
} from "../../config/themeConfig";
import {
  Sparkles,
  Search,
  Calendar,
  Users,
  X,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
  Filter,
  Home,
} from "lucide-react";

// O3 Sticker Component (Pop theme only)
const Sticker = ({ children, color = "bg-white", rotate = 0, className = "", onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: rotate + 2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${color} transition-all duration-200 ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </motion.div>
);

// Party 페이지 테마 스타일
const partyThemeStyles = {
  light: {
    accent: 'text-[#635bff]',
    accentBg: 'bg-[#635bff]',
    hoverAccentBg: 'hover:bg-[#5851e8]',
    badge: 'bg-[#635bff]/10 text-[#635bff]',
    buttonShadow: 'shadow-[#635bff]/25',
  },
};

export default function PartyListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const observerTarget = useRef(null);
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
  const [selectedStatus, setSelectedStatus] = useState("RECRUITING");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Theme State from Zustand Store
  const { theme, setTheme } = useThemeStore();
  const currentTheme = themeConfig[theme] || themeConfig.light;
  const themeStyle = partyThemeStyles[theme] || partyThemeStyles.light;

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
    // if (!isFirstRender.current) {
    //   window.scrollTo(0, 0);
    // }
    // isFirstRender.current = false;

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
        bg: "bg-gradient-to-r from-orange-500 to-red-500",
        text: "마감임박",
        pulse: true,
      };
    }

    const badges = {
      RECRUITING: {
        bg: theme === "dark" ? "bg-[#635bff]" : "bg-[#635bff]",
        text: "모집중",
      },
      ACTIVE: {
        bg: "bg-emerald-500",
        text: "파티중",
      },
      PENDING_PAYMENT: {
        bg: "bg-amber-500",
        text: "결제대기",
      },
      CLOSED: {
        bg: "bg-gray-400",
        text: "파티종료",
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  // Scroll direction detection for Search Bar
  const [showSearch, setShowSearch] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hero section height buffer (approx 300px-400px)
      // Only trigger hide logic if we've scrolled past the initial view
      if (currentScrollY < 350) {
        setShowSearch(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling DOWN -> Hide
        setShowSearch(false);
      } else {
        // Scrolling UP -> Show
        setShowSearch(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const content = (
    <div className={`min-h-screen pb-20 -mt-20 pt-20 transition-colors duration-300 relative z-10 ${currentTheme.bg}`}>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 md:pt-4 md:pb-12">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${theme === "dark"
                ? "bg-[#635bff]/20 border border-[#635bff]/30"
                : "bg-[#635bff]/10"
                }`}
            >
              <Sparkles className="w-4 h-4" style={{ color: currentTheme.accent }} />
              <span className="text-sm font-semibold" style={{ color: currentTheme.accent }}>
                OTT 구독 비용, 최대 75% 절약
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1] ${currentTheme.text}`}
            >
              <>
                함께 나누면
                <br />
                <span className={`bg-gradient-to-r ${theme === "dark" ? "from-[#635bff] via-[#00d4ff] to-[#00d4ff]" : "from-[#635bff] to-[#00d4ff]"} bg-clip-text text-transparent`}>
                  더 저렴하게
                </span>
              </>
            </motion.h1>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/party/create")}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full shadow-lg transition-colors duration-200 bg-[#635bff] hover:bg-[#5851e8] text-white shadow-[#635bff]/25`}
                >
                  <Sparkles className="w-4 h-4" />
                  파티 만들기
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/my-parties")}
                    className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition-colors duration-200 ${theme === "dark"
                      ? "bg-transparent hover:bg-[#635bff]/10 text-[#635bff] border-2 border-[#635bff]"
                      : "bg-white hover:bg-gray-50 text-[#635bff] border-2 border-[#635bff]"
                      }`}
                  >
                    <Home className="w-4 h-4" />
                    내 파티
                  </motion.button>
                )}
              </>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <motion.div
          className={`z-30 my-6 ${showSearch ? "sticky top-20" : ""}`}
          initial={false}
          animate={{
            y: showSearch ? 0 : 0,
            opacity: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="relative">
            <div className={`backdrop-blur-xl p-5 transition-colors duration-300 relative z-10 ${theme === "dark"
              ? "bg-[#1E293B]/80 rounded-2xl shadow-lg"
              : "bg-white/80 rounded-2xl shadow-lg shadow-gray-200/50"
              }`}>
              {/* Search Input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-10 py-2.5 border-none rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${theme === "dark"
                    ? "bg-[#0F172A] text-white focus:ring-[#635bff]/20"
                    : "bg-gray-50 text-gray-900 focus:ring-[#635bff]/20 focus:bg-white"
                    }`}
                  placeholder="파티 이름, 방장 닉네임 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filters Row */}
              <div className="flex flex-col gap-4">
                {/* Status Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className={`w-4 h-4 mr-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                  {[
                    { value: "", label: "전체" },
                    { value: "RECRUITING", label: "모집중" },
                    { value: "ACTIVE", label: "파티중" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setSelectedStatus(filter.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${theme === "dark"
                        ? selectedStatus === filter.value
                          ? "bg-[#635bff]/10 text-[#635bff] ring-1 ring-[#635bff]/30"
                          : "bg-[#0F172A] text-gray-400 hover:bg-gray-800 border border-gray-700"
                        : selectedStatus === filter.value
                          ? "bg-[#635bff]/10 text-[#635bff] ring-1 ring-[#635bff]/30"
                          : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                        }`}
                    >
                      {filter.label}
                    </button>
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
                      className={`appearance-none text-sm font-bold rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 transition-all cursor-pointer ${theme === "dark"
                        ? "bg-[#0F172A] text-white border border-gray-700 hover:bg-gray-800 focus:ring-[#635bff]/20"
                        : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 focus:ring-[#635bff]/20"
                        }`}
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative ml-auto">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`appearance-none rounded-xl pl-4 pr-10 py-2 text-sm font-bold cursor-pointer transition-all focus:outline-none focus:ring-2 ${theme === "dark"
                        ? "bg-[#0F172A] text-white border border-gray-700 hover:bg-gray-800 focus:ring-[#635bff]/20"
                        : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 focus:ring-[#635bff]/20"
                        }`}
                    >
                      <option value="latest">최신순</option>
                      <option value="start_date_asc">시작 빠른순</option>
                      <option value="popularity">인기순</option>
                      <option value="price_low">가격 낮은순</option>
                      <option value="price_high">가격 높은순</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Parties Grid */}
        {isInitialLoading ? (
          // Shimmer Loading - Theme aware
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden animate-pulse ${theme === "dark" ? "bg-[#1E293B] border border-gray-700" : "bg-white border border-gray-100"}`}
              >
                <div className={`h-40 ${theme === "dark" ? "bg-gradient-to-br from-gray-700 to-gray-800" : "bg-gradient-to-br from-gray-100 to-gray-50"}`} />
                <div className="p-5 space-y-3">
                  <div className={`h-5 rounded-lg w-1/3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`} />
                  <div className={`h-4 rounded-lg w-3/4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`} />
                  <div className={`h-4 rounded-lg w-1/2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`} />
                  <div className={`h-6 rounded-lg w-2/5 mt-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`} />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          // Empty State - Variant T Style
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#635bff]/10">
              <Search className="w-10 h-10 text-[#635bff]" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${currentTheme.text}`}>
              조건에 맞는 파티가 없습니다
            </h3>
            <p className={`mb-6 ${currentTheme.subtext}`}>
              다른 검색어나 필터를 시도해보세요
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("");
                setSelectedProductId(null);
                setStartDate("");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-full transition-colors bg-[#635bff] hover:bg-[#5851e8]"
            >
              필터 초기화
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {list.map((party) => {
              const badge = getStatusBadge(party);
              const isMyParty = myPartyIds.includes(party.partyId);
              const isLeader = user?.userId === party.partyLeaderId;
              const remainingSlots = (party.maxMembers || 4) - (party.currentMembers || 0);

              return (
                <motion.div
                  key={party.partyId}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => {
                    if (!user) {
                      if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
                        navigate("/login");
                      }
                      return;
                    }
                    navigate(`/party/${party.partyId}`);
                  }}
                  className={`group relative overflow-hidden cursor-pointer transition-all duration-300 ${theme === "dark"
                      ? "bg-[#1E293B] border border-gray-700 rounded-2xl hover:shadow-2xl hover:border-gray-600"
                      : "bg-white border border-gray-100 rounded-2xl hover:shadow-2xl hover:border-gray-200"
                    }`}
                >
                  {/* Service Banner */}
                  <div className={`relative h-40 flex items-center justify-center p-4 sm:p-6 ${theme === "dark" ? "bg-gradient-to-br from-gray-700 to-gray-800" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
                    {party.productImage ? (
                      <img
                        src={party.productImage}
                        alt={party.productName}
                        className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg bg-[#635bff]">
                        {party.productName?.[0]}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`${badge.bg} ${badge.pulse ? 'animate-pulse' : ''} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* My Party Badge */}
                    {(isLeader || isMyParty) && (
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${isLeader
                          ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white"
                          : "bg-white text-[#635bff]"
                          }`}>
                          {isLeader ? "파티장" : "참여중"}
                        </span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#635bff]/5" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Service Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme === "dark"
                        ? "text-[#635bff] bg-[#635bff]/20"
                        : "text-[#635bff] bg-[#635bff]/10"
                        }`}>
                        {party.productName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold mb-3 line-clamp-1 transition-colors ${theme === "dark"
                      ? "text-white group-hover:text-[#635bff]"
                      : "text-gray-900 group-hover:text-[#635bff]"
                      }`}>
                      {party.title || `${party.productName} 파티`}
                    </h3>

                    {/* Info Row */}
                    <div className={`flex items-center justify-between text-sm mb-4 ${currentTheme.cardSubtext}`}>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(party.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{party.currentMembers || 0}/{party.maxMembers || 4}</span>
                        {remainingSlots <= 2 && remainingSlots > 0 && (
                          <span className="text-xs text-orange-500 font-semibold">
                            ({remainingSlots}자리)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className={`flex items-center justify-between pt-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-100"
                      }`}>
                      <span className={`text-sm ${currentTheme.cardSubtext}`}>월 구독료</span>
                      <div className="text-right">
                        <span className={`text-xl font-black ${currentTheme.cardText}`}>
                          {party.monthlyFee?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">원</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Infinite Scroll Loader */}
        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
          {loadingParties && !isInitialLoading && (
            <div className={`flex items-center gap-3 ${currentTheme.subtext}`}>
              <div className="w-5 h-5 border-2 border-gray-200 rounded-full animate-spin border-t-[#635bff]" />
              <span className="text-sm font-medium">더 불러오는 중...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return content;
}
