import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getMyParties, getMyClosedParties } from "../../api/partyApi";
import { fetchCurrentUser } from "../../api/authApi";
import { Users, Crown, Calendar, Plus, Archive } from "lucide-react";

const STATUS_MAP = {
  RECRUITING:      { label: "모집중",   color: "#635bff", bg: "rgba(99,91,255,0.12)" },
  ACTIVE:          { label: "진행중",   color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  PENDING_PAYMENT: { label: "결제대기", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  CLOSED:          { label: "종료",     color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};

function formatDate(d) {
  if (!d) return "-";
  if (Array.isArray(d)) {
    const [y, m, day] = d;
    return `${y}.${String(m).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  }
  const dt = new Date(d);
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
}

export default function MyPartyListPage() {
  const navigate = useNavigate();
  const [list,          setList]          = useState([]);
  const [closedList,    setClosedList]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showClosed,    setShowClosed]    = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const userRes = await fetchCurrentUser();
        if (userRes.success && userRes.data) setCurrentUserId(userRes.data.userId);

        const res = await getMyParties();
        setList(res.success && res.data ? res.data : []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (showClosed && closedList.length === 0) {
      getMyClosedParties()
        .then((res) => setClosedList(res.success && res.data ? res.data : []))
        .catch(() => setClosedList([]));
    }
  }, [showClosed, closedList.length]);

  const displayList = showClosed ? closedList : list;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--glass-border)", borderTopColor: "var(--theme-primary)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-4" style={{ background: "var(--theme-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[18px] font-bold" style={{ color: "var(--theme-text)" }}>내 파티</h2>
          <button
            onClick={() => navigate("/party/create")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-white"
            style={{ background: "var(--theme-primary)" }}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            새 파티
          </button>
        </div>
        <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
          참여 중인 파티를 한눈에 확인하세요
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-3">
        {[
          { key: false, label: `진행 중 (${list.length})` },
          { key: true,  label: "종료된 파티", icon: Archive },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={String(key)}
            onClick={() => setShowClosed(key)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={{
              background: showClosed === key ? "var(--theme-primary)" : "var(--glass-bg-card)",
              border: "1px solid var(--glass-border)",
              color: showClosed === key ? "#fff" : "var(--theme-text-muted)",
            }}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {displayList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-16 gap-3"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--glass-bg-overlay)" }}
            >
              <Users className="w-6 h-6" style={{ color: "var(--theme-primary)" }} />
            </div>
            <p className="text-[14px] font-semibold" style={{ color: "var(--theme-text)" }}>
              {showClosed ? "종료된 파티가 없어요" : "참여 중인 파티가 없어요"}
            </p>
            {!showClosed && (
              <button
                onClick={() => navigate("/party")}
                className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ background: "var(--theme-primary)" }}
              >
                파티 찾아보기
              </button>
            )}
          </motion.div>
        ) : (
          displayList.map((party, i) => {
            const status    = STATUS_MAP[party.partyStatus] || STATUS_MAP.RECRUITING;
            const isLeader  = party.partyLeaderId === currentUserId;

            return (
              <motion.button
                key={party.partyId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/party/${party.partyId}`)}
                className="w-full text-left rounded-2xl overflow-hidden flex"
                style={{
                  background: "var(--glass-bg-card)",
                  backdropFilter: "blur(var(--glass-blur))",
                  WebkitBackdropFilter: "blur(var(--glass-blur))",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "var(--shadow-glass)",
                }}
              >
                {/* Icon strip */}
                <div
                  className="w-16 flex-shrink-0 flex items-center justify-center"
                  style={{ background: "var(--glass-bg-overlay)" }}
                >
                  {party.productImage ? (
                    <img src={party.productImage} alt={party.productName}
                      className="w-10 h-10 object-contain" />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-black"
                      style={{ background: "var(--theme-primary)" }}
                    >
                      {party.productName?.[0]}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 px-4 py-3 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                    {isLeader && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                        <Crown className="w-2.5 h-2.5" />파티장
                      </span>
                    )}
                  </div>

                  <p className="text-[14px] font-bold truncate mb-1" style={{ color: "var(--theme-text)" }}>
                    {party.title || `${party.productName} 파티`}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px]"
                      style={{ color: "var(--theme-text-muted)" }}>
                      <Calendar className="w-3 h-3" />
                      {formatDate(party.startDate)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]"
                      style={{ color: "var(--theme-text-muted)" }}>
                      <Users className="w-3 h-3" />
                      {party.currentMembers}/{party.maxMembers}명
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
