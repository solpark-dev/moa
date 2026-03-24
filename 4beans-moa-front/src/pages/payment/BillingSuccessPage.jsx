import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Wallet } from "lucide-react";
import httpClient from "../../api/httpClient";
import { handlePaymentError, handleNetworkError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";

// Animated gradient background component
function AnimatedGradient() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-30"
                style={{
                    background: "radial-gradient(circle, rgba(99,91,255,0.15) 0%, transparent 70%)",
                }}
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <motion.div
                className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full opacity-30"
                style={{
                    background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
                }}
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
}

export default function BillingSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing");
    const [message, setMessage] = useState("카드 등록 중...");

    useEffect(() => {
        registerBillingKey();
    }, []);

    const registerBillingKey = async () => {
        // Show warning toast if processing takes too long
        const timeoutId = setTimeout(() => {
            toast.warning('처리가 지연되고 있습니다. 잠시만 기다려주세요...');
        }, 5000);

        try {
            // Toss Payments에서 전달하는 파라미터
            const authKey = searchParams.get("authKey");

            if (!authKey) {
                throw new Error("빌링키 정보가 없습니다.");
            }

            // 백엔드를 통해 안전하게 빌링키 발급 (카드 저장까지 백엔드에서 처리)
            await httpClient.post("/users/me/billing-key/issue", {
                authKey
            });

            clearTimeout(timeoutId);

            // 파티 가입 플로우인지 확인
            const reason = localStorage.getItem("billingRegistrationReason");
            const redirectPath = localStorage.getItem("afterBillingRedirect");
            const pendingPartyJoin = localStorage.getItem("pendingPartyJoin");

            if (reason === "party_join_new_flow" && pendingPartyJoin) {
                // 파티 가입 자동 처리
                setMessage("결제 진행 중...");
                try {
                    const { partyId, amount } = JSON.parse(pendingPartyJoin);
                    await httpClient.post(`/parties/${partyId}/join`, {
                        useExistingCard: true,
                        amount,
                        paymentMethod: "CARD"
                    });

                    setStatus("success");
                    setMessage("파티 가입이 완료되었습니다! 🎉");
                    toast.success("파티 가입 완료! 파티 페이지로 이동합니다.");

                    // localStorage 정리
                    localStorage.removeItem("billingRegistrationReason");
                    localStorage.removeItem("afterBillingRedirect");
                    localStorage.removeItem("pendingPartyJoin");

                    setTimeout(() => {
                        navigate(`/party/${partyId}`);
                    }, 1500);
                } catch (joinError) {
                    console.error("Party join failed:", joinError);
                    setStatus("error");
                    setMessage(joinError.response?.data?.error?.message || "파티 가입에 실패했습니다.");
                    toast.error("카드는 등록되었지만 파티 가입에 실패했습니다. 다시 시도해주세요.");

                    // localStorage 정리
                    localStorage.removeItem("billingRegistrationReason");
                    localStorage.removeItem("afterBillingRedirect");
                    localStorage.removeItem("pendingPartyJoin");

                    setTimeout(() => {
                        navigate(redirectPath || "/party");
                    }, 2000);
                }
            } else if (reason === "party_join") {
                // 기존 플로우 (OTT 정보 확인 후 빌링키 등록)
                setStatus("success");
                setMessage("월 구독료 자동 결제가 설정되었습니다!");
                toast.success("자동 결제 설정 완료! 파티에 참여했습니다.");

                localStorage.removeItem("billingRegistrationReason");
                localStorage.removeItem("afterBillingRedirect");

                setTimeout(() => {
                    navigate(redirectPath || "/user/wallet");
                }, 2000);
            } else {
                // 일반 카드 등록
                setStatus("success");
                setMessage("카드가 성공적으로 등록되었습니다!");
                toast.success("카드가 성공적으로 등록되었습니다!");

                localStorage.removeItem("billingRegistrationReason");
                localStorage.removeItem("afterBillingRedirect");

                setTimeout(() => {
                    navigate(redirectPath || "/user/wallet");
                }, 2000);
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Billing key registration failed:", error);

            // Handle different error types
            const errorInfo = error.response
                ? handlePaymentError(error)
                : handleNetworkError(error);

            setStatus("error");
            setMessage(errorInfo.message);

            // Show error toast with action if available
            if (errorInfo.canRetry) {
                toast.errorWithAction(
                    errorInfo.message,
                    '다시 시도',
                    () => {
                        setStatus("processing");
                        setMessage("카드 등록 중...");
                        registerBillingKey();
                    }
                );
            } else if (errorInfo.actionUrl) {
                toast.errorWithAction(
                    errorInfo.message,
                    errorInfo.action,
                    () => navigate(errorInfo.actionUrl)
                );
            } else {
                toast.error(errorInfo.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center relative">
            <AnimatedGradient />
            <div className="max-w-md w-full mx-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg shadow-[#635bff]/10 p-10 border border-gray-100"
                >
                    {status === "processing" && (
                        <div className="text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mx-auto mb-6 w-16 h-16 flex items-center justify-center"
                            >
                                <Loader2 className="w-12 h-12 text-[#635bff]" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {message}
                            </h2>
                            <p className="text-gray-500 font-medium">잠시만 기다려주세요...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {message}
                            </h2>
                            <p className="text-gray-500 font-medium">페이지로 이동합니다...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <XCircle className="w-10 h-10 text-red-500" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                카드 등록 실패
                            </h2>
                            <p className="text-gray-500 font-medium mb-6">{message}</p>
                            <motion.button
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/user/wallet")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#635bff] hover:bg-[#5851e8] text-white rounded-full font-semibold shadow-lg shadow-[#635bff]/25 transition-all"
                            >
                                <Wallet className="w-5 h-5" />
                                지갑으로 돌아가기
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
