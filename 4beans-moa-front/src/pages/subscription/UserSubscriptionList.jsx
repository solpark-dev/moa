import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, ChevronRight, AlertCircle, Plus, TrendingUp,
  ExternalLink, ChevronDown, ChevronUp, Clock, History, Zap,
} from "lucide-react";
import httpClient from "../../api/httpClient";
import { useAuthStore } from "../../store/authStore";

// ── 헬퍼 ──────────────────────────────────────────────────────────

function calcNextBillingDate(startDate, endDate) {
  if (endDate) return new Date(endDate);

  const billingDay = new Date(startDate).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let next = new Date(today.getFullYear(), today.getMonth(), billingDay);
  if (next <= today) {
    next = new Date(today.getFullYear(), today.getMonth() + 1, billingDay);
  }
  return next;
}

function getDaysUntil(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });
}

// ── 컴포넌트 ──────────────────────────────────────────────────────

export default function UserSubscriptionList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!user?.userId) { setLoading(false); return; }

    const fetch = async () => {
      try {
        const res = await httpClient.get("/subscription", {
          params: { userId: user.userId },
        });
        setSubscriptions(Array.isArray(res) ? res : res?.data ?? []);
      } catch (e) {
        console.error("구독 목록 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.userId]);

  // 활성 / 해지 분리
  const active = useMemo(
    () => subscriptions.filter((s) => s.subscriptionStatus === "ACTIVE"),
    [subscriptions]
  );
  const cancelled = useMemo(
    () => subscriptions.filter((s) => s.subscriptionStatus !== "ACTIVE"),
    [subscriptions]
  );

  // 활성 구독에 nextBillingDate·daysUntil 주입
  const enriched = useMemo(
    () =>
      active.map((s) => {
        const next = calcNextBillingDate(s.startDate, s.endDate);
        return { ...s, nextBillingDate: next, daysUntil: getDaysUntil(next) };
      }),
    [active]
  );

  // 요약 통계
  const totalMonthly = useMemo(
    () => active.reduce((sum, s) => sum + (s.price || 0), 0),
    [active]
  );

  // 카테고리별 지출
  const categoryBreakdown = useMemo(() => {
    const map = {};
    active.forEach((s) => {
      const cat = s.categoryName || "기타";
      map[cat] = (map[cat] || 0) + s.price;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [active]);

  const maxCatAmount = categoryBreakdown[0]?.[1] ?? 1;

  // D-7 임박 구독
  const urgent = enriched.filter((s) => s.daysUntil >= 0 && s.daysUntil <= 7);

  // ── 로딩 ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--theme-bg)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--theme-primary)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--theme-bg)" }}>
      {/* ── 헤더 ─────────────────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-[20px] font-extrabold" style={{ color: "var(--theme-text)" }}>
          내 구독 현황
        </h2>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--theme-text-muted)" }}>
          구독 서비스·결제일·지출을 한눈에
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* ── 구독 없음 ─────────────────────────────────────────── */}
        {active.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-14 gap-3"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--glass-bg-overlay)" }}>
              <AlertCircle className="w-6 h-6" style={{ color: "var(--theme-primary)" }} />
            </div>
            <p className="text-[14px] font-semibold" style={{ color: "var(--theme-text)" }}>
              구독 중인 서비스가 없어요
            </p>
            <Link
              to="/subscriptions"
              className="flex items-center gap-2 mt-1 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
              style={{ background: "var(--theme-primary)" }}
            >
              구독 상품 보러가기 <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {active.length > 0 && (
          <>
            {/* ── 월 지출 요약 카드 ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5"
              style={{
                background: "var(--glass-bg-card)",
                backdropFilter: "blur(var(--glass-blur))",
                WebkitBackdropFilter: "blur(var(--glass-blur))",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-glass)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
                <span className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                  이달 구독 지출
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[28px] font-black" style={{ color: "var(--theme-text)" }}>
                    ₩{totalMonthly.toLocaleString()}
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--theme-text-muted)" }}>
                    /월 · {active.length}개 서비스 이용 중
                  </p>
                </div>
                {urgent.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(239,68,68,0.12)" }}>
                    <Zap className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
                    <span className="text-[11px] font-bold" style={{ color: "#ef4444" }}>
                      D-7 임박 {urgent.length}건
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── 활성 구독 목록 ────────────────────────────────── */}
            <div className="space-y-3">
              {enriched.map((sub, i) => {
                const isUrgent = sub.daysUntil >= 0 && sub.daysUntil <= 7;
                const isExpiring = sub.endDate && sub.daysUntil >= 0 && sub.daysUntil <= 30;

                return (
                  <motion.div
                    key={sub.subscriptionId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "var(--glass-bg-card)",
                      backdropFilter: "blur(var(--glass-blur))",
                      WebkitBackdropFilter: "blur(var(--glass-blur))",
                      border: isUrgent
                        ? "1px solid rgba(239,68,68,0.35)"
                        : "1px solid var(--glass-border)",
                      boxShadow: "var(--shadow-glass)",
                    }}
                  >
                    {/* 카드 본문 */}
                    <div className="flex items-center gap-3.5 p-4">
                      {/* 로고 */}
                      <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                        style={{ background: "var(--glass-bg-overlay)" }}>
                        {sub.productImage ? (
                          <img src={sub.productImage} alt={sub.productName}
                            className="w-10 h-10 object-contain" />
                        ) : (
                          <span className="text-[22px] font-black"
                            style={{ color: "var(--theme-primary)" }}>
                            {sub.productName?.[0] ?? "?"}
                          </span>
                        )}
                      </div>

                      {/* 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-[15px] font-bold truncate"
                            style={{ color: "var(--theme-text)" }}>
                            {sub.productName}
                          </p>
                          {isUrgent && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                              style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                              D-{sub.daysUntil}
                            </span>
                          )}
                          {isExpiring && !isUrgent && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                              style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                              기간 만료 예정
                            </span>
                          )}
                        </div>

                        {sub.categoryName && (
                          <p className="text-[11px] mb-1" style={{ color: "var(--theme-text-muted)" }}>
                            {sub.categoryName}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[11px]"
                            style={{ color: "var(--theme-text-muted)" }}>
                            <Calendar className="w-3 h-3" />
                            다음 결제 {formatDate(sub.nextBillingDate)}
                          </span>
                          <span className="text-[15px] font-black"
                            style={{ color: "var(--theme-primary)" }}>
                            ₩{sub.price.toLocaleString()}
                            <span className="text-[10px] font-normal ml-0.5"
                              style={{ color: "var(--theme-text-muted)" }}>/월</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex border-t" style={{ borderColor: "var(--glass-border)" }}>
                      <button
                        onClick={() => navigate(`/subscription/${sub.subscriptionId}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold"
                        style={{ color: "var(--theme-text-muted)" }}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        상세 보기
                      </button>
                      <div className="w-px" style={{ background: "var(--glass-border)" }} />
                      {sub.cancelUrl ? (
                        <a
                          href={sub.cancelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold"
                          style={{ color: "#ef4444" }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          해지 페이지
                        </a>
                      ) : (
                        <button
                          onClick={() => navigate(`/subscription/${sub.subscriptionId}/cancel`)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold"
                          style={{ color: "#ef4444" }}
                        >
                          해지하기
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── 카테고리별 지출 분석 ──────────────────────────── */}
            {categoryBreakdown.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl p-4"
                style={{
                  background: "var(--glass-bg-card)",
                  backdropFilter: "blur(var(--glass-blur))",
                  WebkitBackdropFilter: "blur(var(--glass-blur))",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "var(--shadow-glass)",
                }}
              >
                <p className="text-[13px] font-bold mb-3" style={{ color: "var(--theme-text)" }}>
                  카테고리별 지출
                </p>
                <div className="space-y-2.5">
                  {categoryBreakdown.map(([cat, amount]) => (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>
                          {cat}
                        </span>
                        <span className="text-[12px] font-bold" style={{ color: "var(--theme-text)" }}>
                          ₩{amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--glass-bg-overlay)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(amount / maxCatAmount) * 100}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: "var(--theme-primary)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* ── 구독 히스토리 ─────────────────────────────────────── */}
        {cancelled.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--glass-bg-card)",
              backdropFilter: "blur(var(--glass-blur))",
              WebkitBackdropFilter: "blur(var(--glass-blur))",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--shadow-glass)",
            }}
          >
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3.5"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
                <span className="text-[13px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                  해지된 구독 {cancelled.length}건
                </span>
              </div>
              {showHistory
                ? <ChevronUp className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
                : <ChevronDown className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
              }
            </button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t divide-y" style={{ borderColor: "var(--glass-border)" }}>
                    {cancelled.map((sub) => (
                      <div
                        key={sub.subscriptionId}
                        className="flex items-center gap-3 px-4 py-3 opacity-55"
                      >
                        <div className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                          style={{ background: "var(--glass-bg-overlay)" }}>
                          {sub.productImage ? (
                            <img src={sub.productImage} alt={sub.productName}
                              className="w-6 h-6 object-contain grayscale" />
                          ) : (
                            <span className="text-[14px] font-black"
                              style={{ color: "var(--theme-text-muted)" }}>
                              {sub.productName?.[0] ?? "?"}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold truncate"
                            style={{ color: "var(--theme-text)" }}>
                            {sub.productName}
                          </p>
                          {sub.cancelDate && (
                            <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
                              해지일: {formatDate(sub.cancelDate)}
                            </p>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: "rgba(107,114,128,0.12)", color: "#6b7280" }}>
                          해지됨
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── 새 구독 CTA ───────────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          onClick={() => navigate("/product")}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-semibold"
          style={{
            background: "var(--glass-bg-overlay)",
            border: "1px solid var(--glass-border)",
            color: "var(--theme-primary)",
          }}
        >
          <Plus className="w-4 h-4" />
          새 구독 상품 둘러보기
        </motion.button>
      </div>
    </div>
  );
}
