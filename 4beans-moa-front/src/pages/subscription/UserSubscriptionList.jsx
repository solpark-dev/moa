import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, CreditCard, AlertCircle, Plus } from "lucide-react";

// This page currently uses mock data - real API integration pending
const MOCK_USER = { id: "user-001", nickname: "테스트사용자" };
const MOCK_USER_SUBSCRIPTIONS = [
  {
    id: "sub-1",
    userId: "user-001",
    nextBillingDate: "2023-12-01",
    status: "ACTIVE",
    product: {
      name: "Netflix",
      price: 17000,
      iconUrl: "https://picsum.photos/50",
    },
  },
];

export default function UserSubscriptionList() {
  const navigate = useNavigate();
  const user = MOCK_USER;

  const subscriptions = MOCK_USER_SUBSCRIPTIONS.filter((s) => s.userId === user?.id);

  return (
    <div className="min-h-screen pb-4" style={{ background: "var(--theme-bg)" }}>
      {/* Section header */}
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-[18px] font-bold" style={{ color: "var(--theme-text)" }}>
          내 구독
        </h2>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--theme-text-muted)" }}>
          현재 이용 중인 구독 서비스
        </p>
      </div>

      <div className="px-4 space-y-3">
        {subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-16 gap-3"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--glass-bg-overlay)" }}
            >
              <AlertCircle className="w-6 h-6" style={{ color: "var(--theme-primary)" }} />
            </div>
            <p className="text-[14px] font-semibold" style={{ color: "var(--theme-text)" }}>
              구독 중인 서비스가 없어요
            </p>
            <p className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>
              새로운 구독을 시작해보세요
            </p>
            <Link
              to="/subscriptions"
              className="flex items-center gap-2 mt-1 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
              style={{ background: "var(--theme-primary)" }}
            >
              구독 상품 보러가기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          subscriptions.map((sub, i) => (
            <motion.button
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/my/subscriptions/${sub.id}`)}
              className="w-full text-left rounded-2xl overflow-hidden"
              style={{
                background: "var(--glass-bg-card)",
                backdropFilter: "blur(var(--glass-blur))",
                WebkitBackdropFilter: "blur(var(--glass-blur))",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-glass)",
              }}
            >
              <div className="flex items-center gap-4 p-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: "var(--glass-bg-overlay)" }}
                >
                  <img
                    src={sub.product.iconUrl}
                    className="w-10 h-10 object-contain"
                    alt={sub.product.name}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[15px] font-bold truncate" style={{ color: "var(--theme-text)" }}>
                      {sub.product.name}
                    </p>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={sub.status === "ACTIVE"
                        ? { background: "rgba(16,185,129,0.12)", color: "#10b981" }
                        : { background: "rgba(239,68,68,0.1)", color: "#ef4444" }
                      }
                    >
                      {sub.status === "ACTIVE" ? "이용중" : "해지됨"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px]"
                      style={{ color: "var(--theme-text-muted)" }}>
                      <Calendar className="w-3 h-3" />
                      다음 결제: {sub.nextBillingDate}
                    </span>
                    <span className="price text-[14px] font-black" style={{ color: "var(--theme-primary)" }}>
                      ₩{sub.product.price.toLocaleString()}
                      <span className="text-[10px] font-normal ml-0.5"
                        style={{ color: "var(--theme-text-muted)" }}>/월</span>
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--theme-text-muted)" }} />
              </div>
            </motion.button>
          ))
        )}

        {/* Browse products CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
