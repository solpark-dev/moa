import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, CreditCard, AlertCircle, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

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
  const { theme, setTheme } = useThemeStore();
  const user = MOCK_USER;

  const subscriptions = MOCK_USER_SUBSCRIPTIONS.filter(
    (s) => s.userId === user?.id
  );

  return (
    <div className={`min-h-screen bg-transparent pb-20`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Hero Header */}
      <div className={`relative overflow-hidden bg-transparent border-b border-[var(--theme-border-light)]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] rounded-full text-sm font-medium mb-4`}>
              <Sparkles className="w-4 h-4" />
              구독 관리
            </span>
            <h1 className={`text-4xl font-bold ${themeClasses.text.primary} mb-3 tracking-tight`}>내 구독 목록</h1>
            <p className={themeClasses.text.muted}>현재 이용 중인 구독 서비스입니다.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {subscriptions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeClasses.card.base} p-10 text-center`}
          >
            <div className={`w-16 h-16 bg-[var(--theme-border-light)] rounded-full flex items-center justify-center mx-auto mb-4`}>
              <AlertCircle className={`w-8 h-8 text-[var(--theme-text-muted)]`} />
            </div>
            <h3 className={`font-bold ${themeClasses.text.primary} mb-2`}>
              구독 중인 서비스가 없습니다.
            </h3>
            <p className={`${themeClasses.text.muted} mb-6`}>새로운 구독을 시작해보세요.</p>

            <Link
              to="/subscriptions"
              className={`inline-flex items-center gap-2 px-6 py-3 ${themeClasses.button.primary} rounded-full font-semibold shadow-lg transition-all`}
            >
              구독 상품 보러가기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        <div className="space-y-4">
          {subscriptions.map((sub, index) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className={`${themeClasses.card.base} p-6 cursor-pointer transition-all hover:shadow-[var(--theme-shadow-hover)]`}
              onClick={() => navigate(`/my/subscriptions/${sub.id}`)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={sub.product.iconUrl}
                    className={`w-14 h-14 rounded-xl bg-white p-1 object-contain border border-[var(--theme-border-light)]`}
                    alt={sub.product.name}
                  />

                  <div>
                    <h3 className={`font-bold ${themeClasses.text.primary} text-lg`}>
                      {sub.product.name}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${sub.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-red-50 text-red-600"
                        }`}
                    >
                      {sub.status === "ACTIVE" ? "이용중" : "해지됨"}
                    </span>
                  </div>
                </div>

                <ChevronRight className={`w-5 h-5 ${themeClasses.text.muted}`} />
              </div>

              <div className={`mt-4 pt-4 border-t border-[var(--theme-border-light)] flex justify-between text-sm ${themeClasses.text.muted}`}>
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 text-[var(--theme-primary)]`} />
                  다음 결제일:{" "}
                  <span className={`font-semibold ${themeClasses.text.primary}`}>
                    {sub.nextBillingDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className={`w-4 h-4 text-[var(--theme-primary-light)]`} />월{" "}
                  <span className={`font-bold text-[var(--theme-primary)]`}>
                    ₩{sub.product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
