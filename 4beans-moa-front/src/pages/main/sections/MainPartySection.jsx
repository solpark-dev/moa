import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useMainStore } from "@/store/main/mainStore";
import { useAuthStore } from "@/store/authStore";
import {
  formatCurrency,
  getPartyServiceName,
  getPartyPrice,
  getPartyMembers,
  getProductMaxProfiles,
} from "@/utils/format";
import { getProductIconUrl } from "@/utils/imageUtils";

const SERVICE_COLORS = {
  netflix:    "#e50914", 넷플릭스:   "#e50914",
  youtube:    "#ff0000", 유튜브:     "#ff0000",
  spotify:    "#1db954", 스포티파이:  "#1db954",
  disney:     "#0063e5", 디즈니:     "#0063e5",
  wavve:      "#0abde3", 웨이브:     "#0abde3",
  watcha:     "#f6ac3f", 왓챠:      "#f6ac3f",
  apple:      "#555555", 애플:      "#555555",
};

function getServiceColor(name = "") {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(SERVICE_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return "#2563EB";
}

function getStatusBadge(party) {
  const { partyStatus, maxMembers, currentMembers } = party;
  const remaining = (maxMembers || 0) - (currentMembers || 0);
  if (partyStatus === "RECRUITING" && remaining === 1) {
    return { label: "마감임박", color: "#ef4444" };
  }
  const map = {
    RECRUITING:      { label: "모집중",   color: "#2563EB" },
    ACTIVE:          { label: "파티중",   color: "#10b981" },
    PENDING_PAYMENT: { label: "결제대기", color: "#f59e0b" },
    CLOSED:          { label: "종료",     color: "#94a3b8" },
  };
  return map[partyStatus] || map.RECRUITING;
}

function PartyRow({ party, index, isLast }) {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();

  const name    = getPartyServiceName(party) || "OTT";
  const price   = getPartyPrice(party);
  const current = getPartyMembers(party) ?? 0;
  const max     = getProductMaxProfiles(party) || party?.maxMembers || 4;
  const id      = party?.partyId ?? party?.id;
  const iconUrl = party?.productImage ? getProductIconUrl(party.productImage) : null;
  const color   = getServiceColor(name);
  const badge   = getStatusBadge(party);

  const handleClick = () => {
    if (!user) {
      if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
        navigate("/login");
      }
      return;
    }
    navigate(`/party/${id}`);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className="w-full flex items-center gap-3.5 px-4 py-4 text-left"
      style={isLast ? {} : { borderBottom: "1px solid var(--glass-border)" }}
    >
      {/* Service icon */}
      <div
        className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: `${color}18` }}
      >
        {iconUrl ? (
          <img src={iconUrl} alt={name} className="w-8 h-8 object-contain" />
        ) : (
          <span className="font-black text-base" style={{ color }}>
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[15px] font-semibold truncate" style={{ color: "var(--theme-text)" }}>
            {party.title || `${name} 파티`}
          </p>
          <span
            className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${badge.color}15`, color: badge.color }}
          >
            {badge.label}
          </span>
        </div>
        <p className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>
          {current}/{max}명 참여 중
        </p>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <p className="price text-[16px] font-black" style={{ color: "var(--theme-text)" }}>
          {formatCurrency(price, { fallback: "—" })}
        </p>
        <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>/월</p>
      </div>

      <ChevronRight className="w-4 h-4 flex-shrink-0 ml-0.5" style={{ color: "var(--theme-text-muted)" }} />
    </motion.button>
  );
}

function SkeletonRow({ isLast }) {
  return (
    <div
      className="flex items-center gap-3.5 px-4 py-4 animate-pulse"
      style={isLast ? {} : { borderBottom: "1px solid var(--glass-border)" }}
    >
      <div className="w-11 h-11 rounded-xl flex-shrink-0" style={{ background: "var(--glass-bg-overlay)" }} />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 rounded-md w-28" style={{ background: "var(--glass-bg-overlay)" }} />
        <div className="h-2.5 rounded-md w-16" style={{ background: "var(--glass-bg-overlay)" }} />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 rounded-md w-14" style={{ background: "var(--glass-bg-overlay)" }} />
        <div className="h-2.5 rounded-md w-8 ml-auto" style={{ background: "var(--glass-bg-overlay)" }} />
      </div>
    </div>
  );
}

export default function MainPartySection() {
  const navigate = useNavigate();
  const parties  = useMainStore((s) => s.parties);

  const list      = Array.isArray(parties) && parties.length > 0 ? parties.slice(0, 4) : [];
  const isLoading = !Array.isArray(parties);

  return (
    <section className="px-5 pb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[16px] font-bold" style={{ color: "var(--theme-text)" }}>
          인기 파티
        </p>
        <button
          onClick={() => navigate("/party")}
          className="text-[13px] font-semibold"
          style={{ color: "var(--theme-primary)" }}
        >
          전체보기
        </button>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--glass-bg-card)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => (
            <SkeletonRow key={i} isLast={i === 2} />
          ))
        ) : list.length > 0 ? (
          list.map((party, i) => (
            <PartyRow
              key={party?.partyId ?? i}
              party={party}
              index={i}
              isLast={i === list.length - 1}
            />
          ))
        ) : (
          <div className="flex flex-col items-center py-10">
            <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
              아직 파티가 없어요
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
