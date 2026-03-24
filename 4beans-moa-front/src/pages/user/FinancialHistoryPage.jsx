import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Receipt, ShieldCheck, TrendingUp } from "lucide-react";
import PaymentHistoryList from "../../components/history/PaymentHistoryList";
import DepositHistoryList from "../../components/history/DepositHistoryList";
import SettlementHistoryList from "../../components/history/SettlementHistoryList";
import {
  useTheme,
  ThemeSwitcher,
} from "../../config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

export default function FinancialHistoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("payment");

  // Theme
  const { theme, setTheme, currentTheme } = useTheme("appTheme");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["payment", "deposit", "settlement"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: "payment", label: "결제 내역", icon: Receipt },
    { id: "deposit", label: "보증금 내역", icon: ShieldCheck },
    { id: "settlement", label: "정산 내역", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300 relative z-10">
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Hero Header */}
      <div className={`relative overflow-hidden bg-transparent border-b ${themeClasses.border.light}`}>
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-6 transition-colors group ${themeClasses.interactive.link}`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">뒤로가기</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={`text-4xl font-bold mb-2 tracking-tight ${currentTheme.text}`}>
              금융 내역
            </h1>
            <p className={currentTheme.subtext}>나의 모든 거래 내역을 확인하세요</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl shadow-sm overflow-hidden ${themeClasses.card.base}`}
        >
          <div className={`flex border-b ${themeClasses.border.light}`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`flex-1 py-4 px-4 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${isActive
                      ? `text-[var(--theme-primary)] border-b-2 border-[var(--theme-primary)] ${themeClasses.bg.accentLight}`
                      : `${themeClasses.text.muted} hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]`
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Content with animation */}
          <div className="p-6 min-h-[400px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "payment" && <PaymentHistoryList theme={theme} currentTheme={currentTheme} />}
              {activeTab === "deposit" && <DepositHistoryList theme={theme} currentTheme={currentTheme} />}
              {activeTab === "settlement" && <SettlementHistoryList theme={theme} currentTheme={currentTheme} />}
            </motion.div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <div className={`rounded-xl p-4 ${themeClasses.card.base}`}>
            <Receipt className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>자동 결제</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>매월 정기 결제</p>
          </div>
          <div className={`rounded-xl p-4 ${themeClasses.card.base}`}>
            <ShieldCheck className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>보증금 보호</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>안전하게 보관</p>
          </div>
          <div className={`rounded-xl p-4 ${themeClasses.card.base}`}>
            <TrendingUp className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>정산 시스템</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>투명한 관리</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
