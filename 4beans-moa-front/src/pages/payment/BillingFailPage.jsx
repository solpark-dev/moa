import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { themeConfig } from "@/config/themeConfig";

export default function BillingFailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { theme } = useThemeStore();
    const currentTheme = themeConfig[theme] || themeConfig.pop;

    const [errorInfo, setErrorInfo] = useState({
        code: "",
        message: ""
    });

    useEffect(() => {
        const code = searchParams.get("code") || "UNKNOWN_ERROR";
        const message = searchParams.get("message") || "알 수 없는 오류가 발생했습니다.";

        setErrorInfo({
            code,
            message: decodeURIComponent(message)
        });

        // localStorage 정리
        localStorage.removeItem("billingRegistrationReason");
        localStorage.removeItem("afterBillingRedirect");
        localStorage.removeItem("pendingPartyJoin");
    }, [searchParams]);

    const handleRetry = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme === "dark" ? "bg-[#0B1120]" : "bg-gray-50"}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-md w-full rounded-2xl p-8 text-center ${theme === "dark" ? "bg-[#1E293B]" : "bg-white shadow-xl"}`}
            >
                {/* Error Icon */}
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${theme === "dark" ? "bg-red-900/30" : "bg-red-100"}`}>
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>

                {/* Title */}
                <h1 className={`text-2xl font-bold mb-2 ${currentTheme.text}`}>
                    카드 등록 실패
                </h1>

                {/* Error Message */}
                <p className={`text-sm mb-4 ${currentTheme.subtext}`}>
                    {errorInfo.message}
                </p>

                {/* Error Code */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs mb-6 ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                    오류 코드: {errorInfo.code}
                </div>

                {/* Hint */}
                <div className={`rounded-xl p-4 mb-6 text-left ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                    <p className={`text-xs font-semibold mb-2 ${currentTheme.subtext}`}>💡 해결 방법</p>
                    <ul className={`text-xs space-y-1 ${currentTheme.subtext}`}>
                        <li>• 다른 카드로 다시 시도해 주세요</li>
                        <li>• 카드사 앱에서 온라인 결제 설정을 확인해 주세요</li>
                        <li>• 문제가 지속되면 고객센터에 문의해 주세요</li>
                    </ul>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleGoHome}
                        className={`flex-1 py-3 font-semibold rounded-full flex items-center justify-center gap-2 transition-all ${theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        홈으로
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRetry}
                        className={`flex-1 py-3 text-white rounded-full font-semibold flex items-center justify-center gap-2 ${currentTheme.accentBg}`}
                    >
                        <RefreshCw className="w-4 h-4" />
                        다시 시도
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
