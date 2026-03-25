import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CreditCard, Info } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { requestBillingAuth } from "../../utils/paymentHandler";
import { handleApiError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";
import {
  useTheme,
} from "../../config/themeConfig";

export default function BillingRegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Theme
  const { theme, setTheme, currentTheme } = useTheme("appTheme");

  useEffect(() => {
    if (!user) {
      toast.warning("로그인이 필요합니다");
      navigate("/login");
      return;
    }

    // 자동으로 빌링키 등록 플로우 시작
    const startBillingAuth = async () => {
      try {
        // Toss Payments 빌링 인증 요청
        await requestBillingAuth(user.userId);
      } catch (error) {
        console.error("Billing auth failed:", error);
        const errorInfo = handleApiError(error);
        toast.error(errorInfo.message);

        // 에러 발생 시 원래 예정된 페이지로 이동
        const redirectPath =
          localStorage.getItem("afterBillingRedirect") || "/user/wallet";
        localStorage.removeItem("afterBillingRedirect");
        localStorage.removeItem("billingRegistrationReason");
        navigate(redirectPath);
      }
    };

    startBillingAuth();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center relative transition-colors duration-300 z-10">
      <div className="max-w-md w-full mx-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-lg p-10 ${theme === "dark"
              ? "bg-[#1E293B] border border-gray-700"
              : "bg-white/90 backdrop-blur-sm shadow-[#635bff]/10 border border-gray-100"
            }`}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-6 w-16 h-16 flex items-center justify-center"
            >
              <Loader2 className="w-12 h-12 text-[#635bff]" />
            </motion.div>
            <h2 className={`text-2xl font-bold mb-2 ${currentTheme.text}`}>
              {localStorage.getItem("billingRegistrationReason") === "party_join"
                ? "거의 다 됐어요! 🎉"
                : "자동 결제 설정 중..."}
            </h2>
            <p className={`font-medium mb-6 ${currentTheme.subtext}`}>
              {localStorage.getItem("billingRegistrationReason") === "party_join"
                ? "파티 가입 완료를 위해 카드를 등록해주세요"
                : "월 구독료 자동 결제를 위해 카드를 등록합니다"}
            </p>
            <div className={`rounded-xl p-4 text-left ${theme === "dark"
                ? "bg-[#635bff]/10 border border-[#635bff]/20"
                : "bg-[#635bff]/5 border border-[#635bff]/10"
              }`}>
              <div className="flex items-center gap-2 font-semibold mb-3 text-[#635bff]">
                <Info className="w-4 h-4" />
                안내사항
              </div>
              <ul className={`text-sm space-y-2 ${currentTheme.subtext}`}>
                <li className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00d4ff]" />
                  매월 자동으로 구독료가 결제됩니다
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00d4ff]" />
                  결제일은 파티 설정에 따라 다릅니다
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00d4ff]" />
                  언제든지 카드 변경이 가능합니다
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
