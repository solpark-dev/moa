import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";
import { getMySettlements } from "../../api/settlementApi";
import SettlementDetailModal from "./SettlementDetailModal";
import { useThemeStore } from "@/store/themeStore";

export default function SettlementHistoryList() {
  const { theme } = useThemeStore();
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState(null);

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
    loadSettlements();
  }, []);

  const loadSettlements = async () => {
    try {
      const data = await getMySettlements();
      setSettlements(data);
    } catch (error) {
      console.error("Failed to load settlements", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500 text-white";
      case "PENDING":
        return "bg-amber-500 text-white";
      case "IN_PROGRESS":
        return `${themeColors.statusAccent} text-white`;
      case "FAILED":
        return "bg-red-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "COMPLETED":
        return "정산완료";
      case "PENDING":
        return "대기중";
      case "IN_PROGRESS":
        return "처리중";
      case "FAILED":
        return "실패";
      default:
        return "알수없음";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`animate-spin rounded-full h-8 w-8 border-2 ${themeColors.spinnerBorder} border-t-transparent`}></div>
      </div>
    );
  }

  if (settlements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 ${themeColors.emptyBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <TrendingUp className={`w-8 h-8 ${themeColors.emptyIcon}`} />
        </div>
        <h3 className={`text-lg font-semibold ${themeColors.textPrimary} mb-2`}>정산 내역이 없습니다</h3>
        <p className={`${themeColors.textMuted} text-sm`}>파티장으로 활동하면 정산 내역이 생성됩니다</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          {settlements.map((settlement, index) => (
            <motion.div
              key={settlement.settlementId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedSettlement(settlement)}
              className={`group ${themeColors.cardBg} border ${themeColors.cardBorder} rounded-xl p-4 ${themeColors.borderHover} hover:shadow-lg transition-all cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${themeColors.iconBg} flex items-center justify-center`}>
                    <TrendingUp className={`w-5 h-5 ${themeColors.accent}`} />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${themeColors.textPrimary} ${themeColors.accentHover} transition-colors`}>
                      {settlement.productName || `파티 #${settlement.partyId}`}
                    </h3>
                    <div className={`flex items-center gap-1.5 text-xs ${themeColors.textMuted} mt-0.5`}>
                      <Calendar className="w-3 h-3" />
                      <span>{settlement.settlementMonth} 정산분</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`${getStatusStyle(
                    settlement.settlementStatus
                  )} px-2.5 py-1 rounded-md text-xs font-bold shadow-sm`}
                >
                  {getStatusLabel(settlement.settlementStatus)}
                </span>
              </div>

              <div className={`flex justify-between items-end pt-3 border-t ${themeColors.borderColor}`}>
                <div className={`text-xs ${themeColors.textMuted}`}>
                  수수료: -{settlement.commissionAmount?.toLocaleString() || 0}원
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-600">
                    +{settlement.netAmount?.toLocaleString() || 0}
                    <span className={`text-sm ${themeColors.textMuted} ml-1`}>원</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <SettlementDetailModal
        isOpen={!!selectedSettlement}
        onClose={() => setSelectedSettlement(null)}
        settlement={selectedSettlement}
      />
    </>
  );
}
