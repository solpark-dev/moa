import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const depositModalThemeStyles = {
  pop: {
    gradientBg: 'bg-gradient-to-br from-pink-50 to-cyan-50',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    iconColorSecondary: 'text-cyan-600',
    border: 'border border-gray-200',
    shadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
    hoverBg: 'hover:bg-pink-50',
  },
  classic: {
    gradientBg: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-[#635bff]',
    iconColorSecondary: 'text-purple-600',
    border: 'border border-gray-200',
    shadow: 'shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
    hoverBg: 'hover:bg-indigo-50',
  },
  dark: {
    gradientBg: 'bg-gradient-to-br from-gray-800 to-gray-900',
    iconBg: 'bg-gray-700',
    iconColor: 'text-[#635bff]',
    iconColorSecondary: 'text-purple-400',
    border: 'border border-gray-700',
    shadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
    hoverBg: 'hover:bg-gray-700',
  },
  christmas: {
    gradientBg: 'bg-gradient-to-br from-red-50 to-green-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-[#c41e3a]',
    iconColorSecondary: 'text-green-800',
    border: 'border border-gray-200',
    shadow: 'shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
    hoverBg: 'hover:bg-red-50',
  },
};

export default function DepositDetailModal({ isOpen, onClose, deposit }) {
  const { theme } = useThemeStore();
  const themeStyle = depositModalThemeStyles[theme] || depositModalThemeStyles.pop;
  if (!deposit) return null;

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

  const getStatusStyle = (status, currentTheme) => {
    const themeAccent = currentTheme === 'pop' ? 'bg-pink-500' : currentTheme === 'christmas' ? 'bg-[#c41e3a]' : 'bg-[#635bff]';
    switch (status) {
      case "PAID":
        return `${themeAccent} text-white`;
      case "REFUNDED":
        return "bg-slate-500 text-white";
      case "FORFEITED":
        return "bg-red-500 text-white";
      default:
        return "bg-amber-500 text-white";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-white rounded-2xl ${themeStyle.shadow} max-w-md w-full max-h-[90vh] overflow-y-auto`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-6 ${themeStyle.border} border-b`}>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">보증금 상세</h2>
                  <p className="text-sm text-slate-500 mt-1">보증금 내역의 상세 정보입니다</p>
                </div>
                <button
                  onClick={onClose}
                  className={`w-8 h-8 rounded-lg ${themeStyle.hoverBg} flex items-center justify-center transition-colors`}
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Amount */}
                <div className={`text-center py-6 ${themeStyle.gradientBg} rounded-xl`}>
                  <div className={`w-12 h-12 rounded-full ${themeStyle.iconBg} flex items-center justify-center mx-auto mb-3`}>
                    <ShieldCheck className={`w-6 h-6 ${themeStyle.iconColor}`} />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">보증금 금액</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {(deposit.depositAmount || deposit.amount || 0).toLocaleString()}
                    <span className="text-lg text-slate-500 ml-1">원</span>
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <ShieldCheck className={`w-5 h-5 ${themeStyle.iconColor} mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">상품명</p>
                      <p className="font-semibold text-slate-900">
                        {deposit.productName || deposit.partyTitle || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Calendar className={`w-5 h-5 ${themeStyle.iconColorSecondary} mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">처리일자</p>
                      <p className="font-semibold text-slate-900">
                        {deposit.paymentDate || deposit.createdAt || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600 font-medium">상태</span>
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-sm ${getStatusStyle(
                        deposit.depositStatus || deposit.status, theme
                      )}`}
                    >
                      {(deposit.depositStatus || deposit.status) === "PAID" && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {getStatusLabel(deposit.depositStatus || deposit.status)}
                    </span>
                  </div>

                  {deposit.refundDate && (
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-slate-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">환불일자</p>
                        <p className="font-semibold text-slate-900">{deposit.refundDate}</p>
                      </div>
                    </div>
                  )}

                  {deposit.refundAmount && (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-slate-600 font-medium">환불금액</span>
                      <span className="font-bold text-emerald-600">
                        {deposit.refundAmount.toLocaleString()}원
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Messages */}
                {(deposit.depositStatus === "REFUNDED" || deposit.status === "REFUNDED") && (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-700">
                      환불이 완료된 보증금입니다. 등록된 정산 계좌로 입금되었습니다.
                    </p>
                  </div>
                )}

                {(deposit.depositStatus === "FORFEITED" || deposit.status === "FORFEITED") && (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">
                      몰수된 보증금입니다. 파티 시작 후 탈퇴로 인해 방장에게 정산됩니다.
                    </p>
                  </div>
                )}

                {(deposit.depositStatus === "PAID" || deposit.status === "PAID") && (
                  <div className={`bg-${theme === 'christmas' ? 'red' : 'blue'}-50 p-4 rounded-xl border border-${theme === 'christmas' ? 'red' : 'blue'}-100 flex items-start gap-3`}>
                    <ShieldCheck className={`w-5 h-5 ${themeStyle.iconColor} flex-shrink-0 mt-0.5`} />
                    <p className={`text-sm text-${theme === 'christmas' ? 'red' : 'blue'}-700`}>
                      안전하게 보관중인 보증금입니다. 파티 종료 시 전액 환불됩니다.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
