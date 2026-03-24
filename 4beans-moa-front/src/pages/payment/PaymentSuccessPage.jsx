import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Home, Sparkles } from "lucide-react";
import { processLeaderDeposit, joinParty, createParty } from "../../api/partyApi";
import { useTheme } from "../../config/themeConfig";

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("processing"); // processing, success, fail
    const { theme, currentTheme } = useTheme("appTheme");

    const isProcessed = useRef(false); // 중복 실행 방지 플래그 (useRef 사용)

    // 테마별 악센트 색상
    const getAccentColor = () => {
        switch (theme) {
            case "christmas": return "#c41e3a";
            case "pop": return "#ec4899";
            case "dark": return "#635bff";
            default: return "#635bff";
        }
    };
    const accentColor = getAccentColor();

    useEffect(() => {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = Number(searchParams.get("amount"));

        if (!paymentKey || !orderId || !amount) {
            setStatus("fail");
            alert("잘못된 접근입니다.");
            navigate("/");
            return;
        }

        if (isProcessed.current) return; // 이미 처리되었으면 리턴
        isProcessed.current = true; // 처리 시작 표시

        const processPayment = async () => {
            try {
                const pendingPayment = JSON.parse(localStorage.getItem("pendingPayment"));

                if (!pendingPayment) {
                    throw new Error("결제 정보를 찾을 수 없습니다.");
                }

                let { type, partyId, partyData } = pendingPayment;

                const paymentData = {
                    tossPaymentKey: paymentKey,
                    orderId: orderId,
                    amount: amount,
                    paymentMethod: "CARD",
                };

                if (type === "CREATE_PARTY") {
                    try {
                        await processLeaderDeposit(partyId, paymentData);
                    } catch (error) {
                        // 404 Party Not Found 발생 시 (서버 재시작 등으로 DB 초기화된 경우)
                        // 저장된 partyData로 파티를 다시 생성하고 결제 처리 시도
                        if (error.message && (error.message.includes("404") || error.message.includes("Not Found")) && partyData) {
                            console.warn("Party not found, re-creating...", partyId);
                            const newParty = await createParty(partyData);
                            partyId = newParty.partyId;
                            await processLeaderDeposit(partyId, paymentData);
                        } else {
                            throw error;
                        }
                    }

                    // 성공 시 로컬 스토리지 정리
                    localStorage.removeItem("pendingPayment");
                    // 파티 생성 4단계(계정 정보 입력)로 이동
                    navigate(`/party/create?step=4&partyId=${partyId}`);
                } else if (type === "JOIN_PARTY") {
                    // 파티 가입은 빌링키 기반 결제로 처리됨 (BillingSuccessPage에서 처리)
                    // 이 코드는 레거시 호환성을 위해 유지
                    // 저장된 카드가 있는 경우에만 가입 시도
                    const joinPaymentData = {
                        useExistingCard: true,
                        amount: amount,
                        paymentMethod: "CARD"
                    };
                    await joinParty(partyId, joinPaymentData);
                    localStorage.removeItem("pendingPayment");

                    // 파티 상세로 이동
                    navigate(`/party/${partyId}`);
                } else if (type === "RETRY_DEPOSIT" || type === "LEADER_DEPOSIT_RETRY") {
                    try {
                        await processLeaderDeposit(partyId, paymentData);
                        localStorage.removeItem("pendingPayment");
                        // 보증금 재결제 성공 시 OTT 계정 입력 페이지로 이동 (파티 생성 완료)
                        navigate(`/party/create?step=4&partyId=${partyId}`);
                    } catch (retryError) {
                        // 파티가 존재하지 않는 경우
                        if (retryError.response?.status === 404) {
                            throw new Error("파티를 찾을 수 없습니다. 파티가 삭제되었거나 존재하지 않습니다.");
                        }
                        throw retryError;
                    }
                } else {
                    throw new Error("알 수 없는 결제 유형입니다.");
                }
            } catch (error) {
                console.error(error);

                // 이미 처리된 결제인 경우 성공으로 간주하고 진행
                if (error.response && error.response.data && error.response.data.code === "ALREADY_PROCESSED_PAYMENT") {
                    console.warn("Already processed payment, proceeding as success.");
                    localStorage.removeItem("pendingPayment");

                    const storedPayment = JSON.parse(localStorage.getItem("pendingPayment"));
                    if (storedPayment) {
                        const { type, partyId } = storedPayment;
                        localStorage.removeItem("pendingPayment");
                        if (type === "CREATE_PARTY") {
                            navigate(`/party/create?step=4&partyId=${partyId}`);
                        } else if (type === "JOIN_PARTY") {
                            navigate(`/party/${partyId}`);
                        }
                        return;
                    }
                }

                setStatus("fail");
                alert(error.message || "결제 처리에 실패했습니다.");
                navigate("/");
            }
        };

        processPayment();
    }, [navigate, searchParams]);

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center relative transition-colors duration-300 ${currentTheme.bg}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-10 rounded-2xl text-center relative z-10 max-w-md w-full mx-4 ${theme === "pop"
                    ? "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
                    : theme === "dark"
                        ? "bg-[#1E293B] border border-gray-700 shadow-lg"
                        : theme === "christmas"
                            ? "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
                            : "bg-white/90 backdrop-blur-sm shadow-lg shadow-[#635bff]/10 border border-gray-100"
                    }`}
            >
                {status === "processing" && (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mx-auto mb-6"
                        >
                            <Loader2 className="w-12 h-12" style={{ color: accentColor }} />
                        </motion.div>
                        <h2 className={`text-2xl font-bold mb-2 ${currentTheme.text}`}>결제 확인 중입니다...</h2>
                        <p className={`font-medium ${currentTheme.subtext}`}>잠시만 기다려주세요.</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </motion.div>
                        <h2 className={`text-2xl font-bold mb-2 ${currentTheme.text}`}>결제가 완료되었습니다!</h2>
                        <p className={`font-medium ${currentTheme.subtext}`}>다음 단계로 이동합니다...</p>
                    </>
                )}
                {status === "fail" && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </motion.div>
                        <h2 className={`text-2xl font-bold mb-2 ${currentTheme.text}`}>결제 처리에 실패했습니다</h2>
                        <p className={`font-medium mb-6 ${currentTheme.subtext}`}>다시 시도해주세요.</p>
                        <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/")}
                            className={`inline-flex items-center gap-2 px-6 py-3 text-white rounded-full font-semibold shadow-lg transition-colors duration-200 ${theme === "pop"
                                ? "bg-pink-500 hover:bg-pink-600 shadow-pink-500/25"
                                : theme === "christmas"
                                    ? "bg-[#c41e3a] hover:bg-[#a51830] shadow-[#c41e3a]/25"
                                    : "bg-[#635bff] hover:bg-[#5851e8] shadow-[#635bff]/25"
                                }`}
                        >
                            <Home className="w-5 h-5" />
                            메인으로 돌아가기
                        </motion.button>
                    </>
                )}
            </motion.div>
        </div>
    );
}
