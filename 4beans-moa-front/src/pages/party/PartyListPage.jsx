import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import {
  Search,
  Calendar,
  Users,
  X,
  ChevronDown,
  Plus,
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

function getStatusBadge(party) {
  const { partyStatus, maxMembers, currentMembers } = party;
  const remaining = (maxMembers || 0) - (currentMembers || 0);
  if (partyStatus === "RECRUITING" && remaining === 1) {
    return { label: "마감임박", color: "#ef4444", bg: "rgba(239,68,68,0.12)" };
  }
  const map = {
    RECRUITING:      { label: "모집중",   color: "#635bff", bg: "rgba(99,91,255,0.12)" },
    ACTIVE:          { label: "파티중",   color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    PENDING_PAYMENT: { label: "결제대기", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    CLOSED:          { label: "파티종료", color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
  };
  return map[partyStatus] || map.RECRUITING;
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

// Skeleton card
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden flex animate-pulse"
      style={{ background: "var(--glass-bg-card)", border: "1px solid var(--glass-border)", height: 80 }}
    >
      <div className="w-1.5 flex-shrink-0" style={{ background: "var(--glass-border)" }} />
      <div className="flex items-center gap-3 flex-1 px-4">
        <div className="w-10 h-10 rounded-xl flex-shrink-0"
             style={{ background: "var(--glass-bg-overlay)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-3 rounded w-20" style={{ background: "var(--glass-bg-overlay)" }} />
          <div className="h-2.5 rounded w-32" style={{ background: "var(--glass-bg-overlay)" }} />
        </div>
        <div className="w-14 h-4 rounded" style={{ background: "var(--glass-bg-overlay)" }} />
      </div>
    </div>
  );
}

export default function PartyListPage() {
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const { user }  = useAuthStore();
  const observerTarget  = useRef(null);
  const observerEnabled = useRef(false);

  const {
    parties: list,
    myParties,
    loading: { parties: loadingParties },
    hasMore,
    loadParties,
    loadMyParties,
  } = usePartyStore();

  const [searchQuery,       setSearchQuery]       = useState(searchParams.get("q") || "");
  const [debouncedQuery,    setDebouncedQuery]     = useState(searchParams.get("q") || "");
  const [selectedStatus,    setSelectedStatus]     = useState("RECRUITING");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [startDate,         setStartDate]          = useState("");
  const [sortBy,            setSortBy]             = useState("latest");
  const [showFilters,       setShowFilters]        = useState(false);

  const myPartyIds       = Array.isArray(myParties) ? myParties.map((p) => p.partyId) : [];
  const isInitialLoading = loadingParties && list.length === 0;

  // Mount init
  useEffect(() => {
    const timer = setTimeout(() => { observerEnabled.current = true; }, 500);
    return () => { clearTimeout(timer); observerEnabled.current = false; };
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Load on filter change
  useEffect(() => {
    loadParties({
      keyword: debouncedQuery,
      partyStatus: selectedStatus || null,
      productId: selectedProductId || null,
      startDate: startDate || null,
      sort: sortBy,
    }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, selectedStatus, selectedProductId, startDate, sortBy]);

  useEffect(() => {
    if (user) loadMyParties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Infinite scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (observerEnabled.current && target.isIntersecting && hasMore && !loadingParties) {
      loadParties({
        keyword: debouncedQuery,
        partyStatus: selectedStatus || null,
        productId: selectedProductId || null,
        startDate: startDate || null,
        sort: sortBy,
      }, false);
    }
  }, [hasMore, loadingParties, debouncedQuery, selectedStatus, selectedProductId, startDate, sortBy, loadParties]);

  useEffect(() => {
    const obs = new IntersectionObserver(handleObserver, { root: null, rootMargin: "20px", threshold: 0 });
    if (observerTarget.current) obs.observe(observerTarget.current);
    return () => obs.disconnect();
  }, [handleObserver]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setSelectedProductId(null);
    setStartDate("");
  };

  return (
    <div className="min-h-screen pb-4" style={{ background: "var(--theme-bg)" }}>
      {/* Search bar */}
      <div className="sticky top-14 z-20 px-4 pt-3 pb-2" style={{ background: "var(--theme-bg)" }}>
        <div className="relative">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="파티 이름, 방장 닉네임 검색"
            className="w-full h-10 pl-9 pr-9 rounded-xl text-[14px] outline-none"
            style={{
              background: "var(--glass-bg-card)",
              border: "1px solid var(--glass-border)",
              color: "var(--theme-text)",
            }}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--theme-text-muted)" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
            </button>
          )}
        </div>

        {/* Filter toggle row */}
        <div className="flex items-center gap-2 mt-2 overflow-x-auto scrollbar-hide pb-1">
          {/* Status chips */}
          {[
            { value: "",           label: "전체" },
            { value: "RECRUITING", label: "모집중" },
            { value: "ACTIVE",     label: "파티중" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedStatus(value)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
              style={{
                background: selectedStatus === value
                  ? "var(--theme-primary)"
                  : "var(--glass-bg-card)",
                border: "1px solid var(--glass-border)",
                color: selectedStatus === value ? "#fff" : "var(--theme-text-muted)",
              }}
            >
              {label}
            </button>
          ))}

          {/* Sort */}
          <div className="relative flex-shrink-0 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 rounded-full text-[12px] font-semibold outline-none"
              style={{
                background: "var(--glass-bg-card)",
                border: "1px solid var(--glass-border)",
                color: "var(--theme-text-muted)",
              }}
            >
              <option value="latest">최신순</option>
              <option value="start_date_asc">시작 빠른순</option>
              <option value="popularity">인기순</option>
              <option value="price_low">가격 낮은순</option>
              <option value="price_high">가격 높은순</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
              style={{ color: "var(--theme-text-muted)" }} />
          </div>
        </div>
      </div>

      {/* Party list */}
      <div className="px-4 pt-2 space-y-3">
        {isInitialLoading ? (
          Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)
        ) : list.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-3"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--glass-bg-overlay)" }}
            >
              <Search className="w-6 h-6" style={{ color: "var(--theme-primary)" }} />
            </div>
            <p className="text-[14px] font-semibold" style={{ color: "var(--theme-text)" }}>
              조건에 맞는 파티가 없어요
            </p>
            <button
              onClick={resetFilters}
              className="text-[13px] font-semibold px-4 py-2 rounded-xl"
              style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-primary)" }}
            >
              필터 초기화
            </button>
          </motion.div>
        ) : (
          list.map((party, i) => {
            const badge        = getStatusBadge(party);
            const isMyParty    = myPartyIds.includes(party.partyId);
            const isLeader     = user?.userId === party.partyLeaderId;
            const remaining    = (party.maxMembers || 4) - (party.currentMembers || 0);
            const serviceColor = getServiceColor(party.productName || "");

            return (
              <motion.button
                key={party.partyId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.3 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  if (!user) {
                    if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
                      navigate("/login");
                    }
                    return;
                  }
                  navigate(`/party/${party.partyId}`);
                }}
                className="w-full text-left rounded-2xl overflow-hidden flex"
                style={{
                  background: "var(--glass-bg-card)",
                  backdropFilter: "blur(var(--glass-blur))",
                  WebkitBackdropFilter: "blur(var(--glass-blur))",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "var(--shadow-glass)",
                }}
              >
                {/* Service accent left bar */}
                <div className="w-1.5 flex-shrink-0 rounded-l-2xl"
                     style={{ background: serviceColor }} />

                {/* Content area */}
                <div className="flex items-center gap-3 flex-1 px-4 py-3.5 min-w-0">
                  {/* Icon — small, inline */}
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: `${serviceColor}15` }}
                  >
                    {party.productImage ? (
                      <img src={party.productImage} alt={party.productName}
                           className="w-7 h-7 object-contain" />
                    ) : (
                      <span className="font-black text-sm" style={{ color: serviceColor }}>
                        {party.productName?.[0]}
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    {/* Status + membership badges */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                      {isLeader && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                          파티장
                        </span>
                      )}
                      {!isLeader && isMyParty && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: "rgba(99,91,255,0.12)", color: "var(--theme-primary)" }}>
                          참여중
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <p className="text-[14px] font-bold truncate leading-tight"
                       style={{ color: "var(--theme-text)" }}>
                      {party.title || `${party.productName} 파티`}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-2.5 mt-1">
                      <span className="flex items-center gap-1 text-[11px]"
                            style={{ color: "var(--theme-text-muted)" }}>
                        <Calendar className="w-3 h-3" />
                        {formatDate(party.startDate)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]"
                            style={{ color: remaining <= 1 ? "#ef4444" : "var(--theme-text-muted)" }}>
                        <Users className="w-3 h-3" />
                        {party.currentMembers || 0}/{party.maxMembers || 4}
                        {remaining <= 1 && <span className="font-bold">마감임박</span>}
                      </span>
                    </div>
                  </div>

                  {/* Price — right, dominant */}
                  <div className="flex-shrink-0 text-right">
                    <p className="price text-[17px] font-black leading-none" style={{ color: serviceColor }}>
                      {party.monthlyFee?.toLocaleString()}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--theme-text-muted)" }}>원/월</p>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}

        {/* Infinite scroll sentinel */}
        <div ref={observerTarget} className="h-10 flex items-center justify-center">
          {loadingParties && !isInitialLoading && (
            <div className="w-5 h-5 border-2 rounded-full animate-spin"
              style={{ borderColor: "var(--glass-border)", borderTopColor: "var(--theme-primary)" }} />
          )}
        </div>
      </div>

      {/* FAB: create party */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate(user ? "/party/create" : "/login")}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg z-30"
        style={{ background: "var(--theme-primary)" }}
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}
