import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Phone, AlertCircle, CreditCard, Calendar, CheckCircle } from "lucide-react";
import { retryPayment } from "../../api/paymentApi";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const paymentModalThemeStyles = {
  pop: {
    gradientBg: 'bg-gradient-to-br from-pink-50 to-cyan-50',
    buttonBg: 'bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600',
    iconColorPrimary: 'text-pink-600',
    iconColorSecondary: 'text-cyan-600',
    border: 'border border-gray-200',
    shadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
    hoverBg: 'hover:bg-pink-50',
  },
  classic: {
    gradientBg: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    buttonBg: 'bg-gradient-to-r from-[#635bff] to-purple-600 hover:from-indigo-700 hover:to-purple-700',
    iconColorPrimary: 'text-[#635bff]',
    iconColorSecondary: 'text-purple-600',
    border: 'border border-gray-200',
    shadow: 'shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
    hoverBg: 'hover:bg-indigo-50',
  },
  dark: {
    gradientBg: 'bg-gradient-to-br from-gray-800 to-gray-900',
    buttonBg: 'bg-gradient-to-r from-[#635bff] to-purple-600 hover:from-indigo-700 hover:to-purple-700',
    iconColorPrimary: 'text-[#635bff]',
    iconColorSecondary: 'text-purple-400',
    border: 'border border-gray-700',
    shadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
    hoverBg: 'hover:bg-gray-700',
  },
  christmas: {
    gradientBg: 'bg-gradient-to-br from-red-50 to-green-50',
    buttonBg: 'bg-gradient-to-r from-[#c41e3a] to-green-800 hover:from-red-700 hover:to-green-900',
    iconColorPrimary: 'text-[#c41e3a]',
    iconColorSecondary: 'text-green-800',
    border: 'border border-gray-200',
    shadow: 'shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
    hoverBg: 'hover:bg-red-50',
  },
};

export default function PaymentDetailModal({ isOpen, onClose, payment, onRetrySuccess }) {
  const { theme } = useThemeStore();
  const themeStyle = paymentModalThemeStyles[theme] || paymentModalThemeStyles.pop;
  const [isRetrying, setIsRetrying] = useState(false);

  if (!payment) return null;

  const handleRetry = async () => {
    if (!payment.paymentId) return;

    setIsRetrying(true);
    try {
      await retryPayment(payment.paymentId);
      alert("결제가 성공적으로 완료되었습니다!");
      if (onRetrySuccess) {
        onRetrySuccess();
      }
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "결제 재시도에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setIsRetrying(false);
    }
  };

  // 재시도 가능 여부 확인
  const canRetry =
    payment.paymentStatus === "FAILED" &&
    (payment.canRetry === true || payment.attemptNumber === undefined || payment.attemptNumber < 4);

  // 최대 재시도 횟수 초과 여부
  const maxRetryExceeded = payment.paymentStatus === "FAILED" && payment.attemptNumber >= 4;

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
                  <h2 className="text-xl font-bold text-slate-900">결제 상세</h2>
                  <p className="text-sm text-slate-500 mt-1">결제 내역의 상세 정보입니다</p>
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
                  <p className="text-sm text-slate-600 mb-2">결제 금액</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {payment.paymentAmount?.toLocaleString()}
                    <span className="text-lg text-slate-500 ml-1">원</span>
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <CreditCard className={`w-5 h-5 ${themeStyle.iconColorPrimary} mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">상품명</p>
                      <p className="font-semibold text-slate-900">{payment.productName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Calendar className={`w-5 h-5 ${themeStyle.iconColorSecondary} mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">결제일시</p>
                      <p className="font-semibold text-slate-900">
                        {payment.paymentDate?.replace("T", " ").split(".")[0] || payment.paymentDate}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">결제수단</p>
                      <p className="font-semibold text-slate-900 text-sm">{payment.paymentMethod}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">카드정보</p>
                      <p className="font-semibold text-slate-900 text-sm">
                        {payment.cardCompany} {payment.cardNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600 font-medium">상태</span>
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-sm ${payment.paymentStatus === "COMPLETED"
                          ? "bg-emerald-500 text-white"
                          : payment.paymentStatus === "FAILED"
                            ? "bg-red-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                    >
                      {payment.paymentStatus === "COMPLETED" && <CheckCircle className="w-4 h-4" />}
                      {payment.paymentStatus === "COMPLETED"
                        ? "결제완료"
                        : payment.paymentStatus === "FAILED"
                          ? "결제실패"
                          : "처리중"}
                    </span>
                  </div>
                </div>

                {/* 재시도 정보가 있다면 표시 */}
                {payment.retryStatus && (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <h4 className="text-red-700 font-bold text-sm">재시도 정보</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-red-600">
                        <span>시도 횟수</span>
                        <span className="font-semibold">
                          {payment.attemptNumber}회 / 4회
                        </span>
                      </div>
                      {payment.nextRetryDate && (
                        <div className="flex justify-between text-red-600">
                          <span>다음 예정일</span>
                          <span className="font-semibold">{payment.nextRetryDate}</span>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-red-200 text-red-700">
                        <span className="block text-xs mb-1 font-semibold">실패 사유:</span>
                        <span className="text-xs">{payment.retryReason || payment.errorMessage}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 결제 재시도 버튼 */}
                {canRetry && (
                  <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className={`w-full flex items-center justify-center gap-2 py-3 ${themeStyle.buttonBg} text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <RefreshCw className={`w-5 h-5 ${isRetrying ? "animate-spin" : ""}`} />
                    {isRetrying ? "결제 처리 중..." : "결제 재시도"}
                  </button>
                )}

                {/* 최대 재시도 횟수 초과 시 고객센터 안내 */}
                {maxRetryExceeded && (
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-amber-800 mb-1">
                          최대 재시도 횟수를 초과했습니다
                        </p>
                        <p className="text-xs text-amber-700 mb-3">
                          결제 문제가 지속되면 고객센터로 문의해주세요.
                        </p>
                        <a
                          href="tel:1588-0000"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          고객센터 연결
                        </a>
                      </div>
                    </div>
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
