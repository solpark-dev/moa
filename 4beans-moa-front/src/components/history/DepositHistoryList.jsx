import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Calendar } from "lucide-react";
import { getMyDeposits } from "../../api/depositApi";
import DepositDetailModal from "./DepositDetailModal";
import { useThemeStore } from "@/store/themeStore";

export default function DepositHistoryList() {
  const { theme } = useThemeStore();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  const getThemeColors = () => {
    switch (theme) {
      case 'pop':
        return {
          accent: 'text-pink-600',
          accentHover: 'group-hover:text-pink-600',
          borderHover: 'hover:border-pink-300',
          iconBg: 'bg-gradient-to-br from-pink-50 to-cyan-50',
          spinnerBorder: 'border-pink-500',
          statusAccent: 'bg-pink-500',
          cardBg: 'bg-white',
          cardBorder: 'border-slate-200',
          textPrimary: 'text-slate-900',
          textSecondary: 'text-slate-600',
          textMuted: 'text-slate-500',
          borderColor: 'border-slate-100',
          emptyBg: 'bg-slate-100',
          emptyIcon: 'text-slate-400',
        };
      case 'christmas':
        return {
          accent: 'text-[#c41e3a]',
          accentHover: 'group-hover:text-[#c41e3a]',
          borderHover: 'hover:border-[#c41e3a]/30',
          iconBg: 'bg-gradient-to-br from-red-50 to-green-50',
          spinnerBorder: 'border-[#c41e3a]',
          statusAccent: 'bg-[#c41e3a]',
          cardBg: 'bg-white',
          cardBorder: 'border-slate-200',
          textPrimary: 'text-slate-900',
          textSecondary: 'text-slate-600',
          textMuted: 'text-slate-500',
          borderColor: 'border-slate-100',
          emptyBg: 'bg-slate-100',
          emptyIcon: 'text-slate-400',
        };
      case 'dark':
        return {
          accent: 'text-[#635bff]',
          accentHover: 'group-hover:text-[#635bff]',
          borderHover: 'hover:border-[#635bff]/30',
          iconBg: 'bg-gradient-to-br from-slate-700 to-slate-800',
          spinnerBorder: 'border-[#635bff]',
          statusAccent: 'bg-[#635bff]',
          cardBg: 'bg-[#1E293B]',
          cardBorder: 'border-gray-700',
          textPrimary: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          borderColor: 'border-gray-700',
          emptyBg: 'bg-gray-800',
          emptyIcon: 'text-gray-500',
        };
      default:
        return {
          accent: 'text-[#635bff]',
          accentHover: 'group-hover:text-[#635bff]',
          borderHover: 'hover:border-[#635bff]/30',
          iconBg: 'bg-gradient-to-br from-indigo-50 to-purple-50',
          spinnerBorder: 'border-[#635bff]',
          statusAccent: 'bg-[#635bff]',
          cardBg: 'bg-white',
          cardBorder: 'border-slate-200',
          textPrimary: 'text-slate-900',
          textSecondary: 'text-slate-600',
          textMuted: 'text-slate-500',
          borderColor: 'border-slate-100',
          emptyBg: 'bg-slate-100',
          emptyIcon: 'text-slate-400',
        };
    }
  };

  const themeColors = getThemeColors();

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {
    try {
      const data = await getMyDeposits();
      setDeposits(data);
    } catch (error) {
      console.error("Failed to load deposits", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return `${themeColors.statusAccent} text-white`;
      case "REFUNDED":
        return "bg-slate-500 text-white";
      case "FORFEITED":
        return "bg-red-500 text-white";
      default:
        return "bg-amber-500 text-white";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PAID":
        return "보관중";
      case "REFUNDED":
        return "환불완료";
      case "FORFEITED":
        return "몰수";
      default:
        return "처리중";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`animate-spin rounded-full h-8 w-8 border-2 ${themeColors.spinnerBorder} border-t-transparent`}></div>
      </div>
    );
  }

  if (deposits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 ${themeColors.emptyBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <ShieldCheck className={`w-8 h-8 ${themeColors.emptyIcon}`} />
        </div>
        <h3 className={`text-lg font-semibold ${themeColors.textPrimary} mb-2`}>보증금 내역이 없습니다</h3>
        <p className={`${themeColors.textMuted} text-sm`}>파티를 만들거나 가입하면 보증금이 생성됩니다</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          {deposits.map((deposit, index) => (
            <motion.div
              key={deposit.depositId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedDeposit(deposit)}
              className={`group ${themeColors.cardBg} border ${themeColors.cardBorder} rounded-xl p-4 ${themeColors.borderHover} hover:shadow-lg transition-all cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${themeColors.iconBg} flex items-center justify-center`}>
                    <ShieldCheck className={`w-5 h-5 ${themeColors.accent}`} />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${themeColors.textPrimary} ${themeColors.accentHover} transition-colors`}>
                      {deposit.productName || "파티"}
                    </h3>
                    <div className={`flex items-center gap-1.5 text-xs ${themeColors.textMuted} mt-0.5`}>
                      <Calendar className="w-3 h-3" />
                      <span>
                        {deposit.paymentDate
                          ? new Date(deposit.paymentDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`${getStatusStyle(
                    deposit.depositStatus
                  )} px-2.5 py-1 rounded-md text-xs font-bold shadow-sm`}
                >
                  {getStatusLabel(deposit.depositStatus)}
                </span>
              </div>

              <div className={`flex justify-between items-end pt-3 border-t ${themeColors.borderColor}`}>
                <div className={`text-sm ${themeColors.textSecondary}`}>
                  {deposit.depositStatus === "PAID" && "안전하게 보관중"}
                  {deposit.depositStatus === "REFUNDED" && "환불 완료됨"}
                  {deposit.depositStatus === "FORFEITED" && "몰수됨"}
                </div>
                <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                  {deposit.depositAmount?.toLocaleString() || 0}
                  <span className={`text-sm ${themeColors.textMuted} ml-1`}>원</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <DepositDetailModal
        isOpen={!!selectedDeposit}
        onClose={() => setSelectedDeposit(null)}
        deposit={selectedDeposit}
      />
    </>
  );
}
