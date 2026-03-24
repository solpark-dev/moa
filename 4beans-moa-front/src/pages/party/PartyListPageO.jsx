import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import ServiceTypeFilter from "../../components/party/ServiceTypeFilter";
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
    Star,
    Play,
    ArrowUpRight,
} from "lucide-react";

/**
 * PartyListPageO - Neo-Brutalist Pop Style
 *
 * Design: Bold borders, chunky shadows, vibrant colors (Yellow, Pink, Cyan, Lime)
 * Features: Sticker-like elements, marquee text, bouncy animations
 */

// Sticker Component
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

// Marquee Component
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

// Party Card Component - Neo-Brutalist Style
function PartyCard({ party, badge, isMyParty, isLeader, remainingSlots, onClick, formatDate }) {
    const getServiceColor = (name) => {
        const colors = {
            'Netflix': 'bg-red-500',
            'Disney+': 'bg-blue-600',
            'Wavve': 'bg-indigo-600',
            'TVING': 'bg-red-600',
            'Watcha': 'bg-pink-600',
            'Coupang Play': 'bg-purple-700',
        };
        return colors[name] || 'bg-gray-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={onClick}
            className="cursor-pointer"
        >
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
                {/* Service Banner */}
                <div className={`relative h-36 ${getServiceColor(party.productName)} flex items-center justify-center`}>
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
                            color={badge.bg === "bg-gradient-to-r from-orange-500 to-red-500"
                                ? "bg-orange-400"
                                : badge.bg === "bg-[#635bff]"
                                    ? "bg-cyan-400"
                                    : badge.bg === "bg-emerald-500"
                                        ? "bg-lime-400"
                                        : "bg-gray-300"
                            }
                            rotate={-3}
                            className="px-3 py-1 rounded-lg"
                        >
                            <span className="text-xs font-black">{badge.text} {badge.text === "모집중" ? "🙋" : badge.text === "마감임박" ? "🔥" : ""}</span>
                        </Sticker>
                    </div>

                    {/* My Party Badge */}
                    {(isLeader || isMyParty) && (
                        <div className="absolute top-3 right-3">
                            <Sticker
                                color={isLeader ? "bg-yellow-400" : "bg-white"}
                                rotate={3}
                                className="px-3 py-1 rounded-lg"
                            >
                                <span className="text-xs font-black">
                                    {isLeader ? "파티장 👑" : "참여중 ✨"}
                                </span>
                            </Sticker>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Service Tag */}
                    <div className="inline-block bg-black text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                        {party.productName}
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-lg text-gray-900 mb-3 line-clamp-1">
                        {party.title || `${party.productName} 파티`}
                    </h3>

                    {/* Info Row */}
                    <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center gap-1.5 font-bold text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(party.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{party.currentMembers || 0}/{party.maxMembers || 4}</span>
                        </div>
                    </div>

                    {/* Remaining Slots */}
                    {remainingSlots <= 2 && remainingSlots > 0 && (
                        <div className="bg-orange-100 border-2 border-orange-400 rounded-lg px-3 py-1.5 mb-4">
                            <span className="text-xs font-black text-orange-600">
                                {remainingSlots}자리 남음! 서두르세요! 🏃
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="bg-black text-white p-3 rounded-xl flex items-center justify-between">
                        <span className="text-sm font-bold">월 구독료</span>
                        <span className="text-xl font-black">
                            ₩{party.monthlyFee?.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function PartyListPageO() {
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

    // Page mount effects
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

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Load parties on filter change
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
    }, [debouncedQuery, selectedStatus, selectedProductId, startDate, sortBy]);

    // Load my parties
    useEffect(() => {
        if (user) {
            loadMyParties();
        }
    }, [user]);

    // Infinite scroll observer
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
        const option = { root: null, rootMargin: "20px", threshold: 0 };
        const observer = new IntersectionObserver(handleObserver, option);
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [handleObserver]);

    const getStatusBadge = (party) => {
        const { partyStatus, maxMembers, currentMembers } = party;
        const remainingSlots = (maxMembers || 0) - (currentMembers || 0);

        if (partyStatus === 'RECRUITING' && remainingSlots === 1) {
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

    const formatDate = (dateData) => {
        if (!dateData) return "-";
        if (Array.isArray(dateData)) {
            const [year, month, day] = dateData;
            return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
        }
        const date = new Date(dateData);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-yellow-400 pb-20 overflow-hidden">
            {/* Dot Pattern Background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Hero Section */}
            <section className="relative px-6 md:px-12 pt-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    {/* Floating Decorations */}
                    <motion.div
                        animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-20 right-[10%] hidden lg:block"
                    >
                        <Sticker color="bg-cyan-400" rotate={12} className="px-4 py-2 rounded-xl">
                            <span className="font-black text-lg">75% OFF! 🔥</span>
                        </Sticker>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0], rotate: [-8, -12, -8] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                        className="absolute top-10 left-[5%] hidden lg:block"
                    >
                        <Sticker color="bg-lime-400" rotate={-8} className="px-3 py-1 rounded-lg">
                            <span className="font-bold text-sm">HOT! ✨</span>
                        </Sticker>
                    </motion.div>

                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20, rotate: -3 }}
                            animate={{ opacity: 1, y: 0, rotate: -2 }}
                            className="inline-block mb-6"
                        >
                            <Sticker color="bg-pink-500" rotate={-2} className="px-6 py-2 rounded-xl">
                                <span className="text-white font-black text-lg">파티 찾기 🎉</span>
                            </Sticker>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter mb-6"
                        >
                            <span className="block text-black">함께 나누면</span>
                            <span className="block text-pink-500">
                                더 저렴해!
                            </span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link to="/party/create">
                                <PopButton color="bg-pink-500 text-white">
                                    <span className="flex items-center gap-2">
                                        파티 만들기
                                        <Play className="w-5 h-5" />
                                    </span>
                                </PopButton>
                            </Link>
                            <div className="flex items-center gap-3 text-sm font-bold">
                                <span className="flex items-center gap-1">
                                    <Shield className="w-4 h-4" /> 안전 결제
                                </span>
                                <span className="flex items-center gap-1">
                                    <Zap className="w-4 h-4" /> 즉시 이용
                                </span>
                            </div>
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
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                Netflix
                                <Star className="w-5 h-5 text-pink-400 fill-pink-400" />
                                Disney+
                                <Star className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                                Wavve
                                <Star className="w-5 h-5 text-lime-400 fill-lime-400" />
                                Tving
                            </span>
                        ))}
                    </div>
                </Marquee>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search & Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <Sticker color="bg-white" rotate={0} className="p-6 rounded-3xl">
                        {/* Search Input */}
                        <div className="relative mb-5">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-black" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-14 pr-12 py-4 border border-gray-200 rounded-2xl bg-yellow-100 text-black placeholder-gray-600 font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
                                placeholder="파티 이름, 방장 닉네임 검색 🔍"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                >
                                    <X className="w-6 h-6 text-black hover:text-pink-500 transition-colors" />
                                </button>
                            )}
                        </div>

                        {/* Status Filters */}
                        <div className="flex flex-wrap gap-3 mb-5">
                            {[
                                { value: "", label: "전체", color: "bg-gray-200" },
                                { value: "RECRUITING", label: "모집중 🙋", color: "bg-cyan-400" },
                                { value: "ACTIVE", label: "파티중 🎬", color: "bg-lime-400" },
                                { value: "CLOSED", label: "종료됨", color: "bg-gray-300" },
                            ].map((filter) => (
                                <motion.button
                                    key={filter.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedStatus(filter.value)}
                                    className={`
                                        px-5 py-2.5 rounded-xl font-black text-sm
                                        border border-gray-200
                                        transition-all duration-200
                                        ${selectedStatus === filter.value
                                            ? `${filter.color} shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`
                                            : "bg-white hover:bg-gray-100"
                                        }
                                    `}
                                    style={{ borderWidth: '3px' }}
                                >
                                    {filter.label}
                                </motion.button>
                            ))}
                        </div>

                        {/* Additional Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <ServiceTypeFilter
                                selectedProductId={selectedProductId}
                                onSelect={setSelectedProductId}
                            />

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-yellow-100 border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-sm focus:outline-none focus:bg-yellow-50 cursor-pointer"
                                style={{ borderWidth: '3px' }}
                            />

                            {/* Sort Dropdown */}
                            <div className="relative ml-auto">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-black text-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 font-bold text-sm cursor-pointer"
                                    style={{ borderWidth: '3px' }}
                                >
                                    <option value="latest">최신순</option>
                                    <option value="start_date_asc">시작 빠른순</option>
                                    <option value="popularity">인기순</option>
                                    <option value="price_low">가격 낮은순</option>
                                    <option value="price_high">가격 높은순</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                            </div>
                        </div>
                    </Sticker>
                </motion.div>

                {/* Party Cards Grid */}
                {isInitialLoading ? (
                    // Loading Skeleton - Neo-Brutalist Style
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.08)] animate-pulse"
                            >
                                <div className="h-36 bg-gray-300" />
                                <div className="p-5 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded-full w-1/3" />
                                    <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                                    <div className="h-12 bg-gray-200 rounded-xl mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : list.length === 0 ? (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                    >
                        <Sticker color="bg-white" rotate={0} className="inline-block p-10 rounded-3xl">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-6xl mb-6"
                            >
                                🔍
                            </motion.div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3">
                                파티가 없어요!
                            </h3>
                            <p className="text-gray-600 font-bold mb-6">
                                다른 검색어나 필터를 시도해보세요
                            </p>
                            <PopButton
                                color="bg-cyan-400"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((party, index) => {
                            const badge = getStatusBadge(party);
                            const isMyParty = myPartyIds.includes(party.partyId);
                            const isLeader = user?.userId === party.partyLeaderId;
                            const remainingSlots = (party.maxMembers || 4) - (party.currentMembers || 0);

                            return (
                                <PartyCard
                                    key={party.partyId}
                                    party={party}
                                    badge={badge}
                                    isMyParty={isMyParty}
                                    isLeader={isLeader}
                                    remainingSlots={remainingSlots}
                                    formatDate={formatDate}
                                    onClick={() => {
                                        if (!user) {
                                            if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
                                                navigate("/login");
                                            }
                                            return;
                                        }
                                        navigate(`/party/${party.partyId}`);
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Infinite Scroll Loader */}
                <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
                    {loadingParties && !isInitialLoading && (
                        <Sticker color="bg-white" rotate={0} className="px-6 py-3 rounded-xl">
                            <span className="flex items-center gap-3 font-black">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    🔄
                                </motion.span>
                                더 불러오는 중...
                            </span>
                        </Sticker>
                    )}
                </div>
            </div>

            {/* Bottom CTA Marquee */}
            <div className="bg-pink-500 text-white py-3 border-y-4 border-black mt-12">
                <Marquee direction="right" speed={30}>
                    <div className="flex items-center gap-12 px-4">
                        {[...Array(4)].map((_, i) => (
                            <span key={i} className="flex items-center gap-12 text-lg font-black uppercase">
                                <span>10K+ 사용자 🎉</span>
                                <span>•</span>
                                <span>75% 절약 💰</span>
                                <span>•</span>
                                <span>4.9★ 만족도 ⭐</span>
                                <span>•</span>
                            </span>
                        ))}
                    </div>
                </Marquee>
            </div>
        </div>
    );
}
