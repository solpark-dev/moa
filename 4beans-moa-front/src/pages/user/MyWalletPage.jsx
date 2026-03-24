import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  CreditCard,
  Building2,
  Wallet,
  Plus,
  ShieldCheck,
  Zap,
  TrendingDown,
  ArrowLeft,
  Sparkles,
  Trash2
} from "lucide-react";
import { useWalletStore } from "../../store/wallet/walletStore";
import { useAuthStore } from "../../store/authStore";
import { requestBillingAuth } from "../../utils/paymentHandler";
import { handleApiError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";
import {
  getBankLogo,
  getCardLogo,
  getBankTheme,
  getCardTheme,
} from "../../utils/logoHelper";
import {
  useTheme,
  themeConfig
} from "../../config/themeConfig";

export default function MyWalletPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();

  // Theme
  const { theme, setTheme, currentTheme } = useTheme("appTheme");

  // Zustand Store - Selector 패턴 사용
  const deposits = useWalletStore((state) => state.deposits);
  const account = useWalletStore((state) => state.account);
  const card = useWalletStore((state) => state.card);
  const loadingWallet = useWalletStore((state) => state.loading.wallet);
  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  const getTotalDeposit = useWalletStore((state) => state.getTotalDeposit);
  const deleteAccountAction = useWalletStore((state) => state.deleteAccount);
  const deleteCardAction = useWalletStore((state) => state.deleteCard);

  useEffect(() => {
    if (!authLoading && !user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user, loadWalletData]);

  // 헬퍼 함수 사용
  const totalDeposit = getTotalDeposit();
  const loading = loadingWallet;

  const goHistory = (tab) => {
    navigate(`/user/financial-history?tab=${tab}`);
  };

  const handleRegisterCard = async () => {
    try {
      if (!user) {
        toast.warning("로그인이 필요합니다");
        navigate("/login");
        return;
      }
      await requestBillingAuth(user.userId);
    } catch (error) {
      const errorMessage = error?.message || "";
      if (errorMessage.includes("취소") || errorMessage.includes("cancel")) return;
      console.error("Card registration failed:", error);
      toast.error(handleApiError(error).message);
    }
  };

  const handleAccountClick = () => {
    if (account) {
      if (window.confirm("계좌를 변경하시겠습니까?")) {
        navigate("/user/account-register");
      }
    } else {
      navigate("/user/account-register");
    }
  };

  const handleCardClick = () => {
    if (card) {
      if (window.confirm("카드를 변경하시겠습니까?")) {
        requestBillingAuth(user.userId);
      }
    } else {
      handleRegisterCard();
    }
  };

  if (authLoading || (loading && !account && !card)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent relative z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#635bff] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300 relative z-10">
      {/* Hero Header */}
      <div className={`relative overflow-hidden bg-transparent ${theme === "dark"
        ? "border-b border-gray-800"
        : ""
        }`}>
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <button
            onClick={() => navigate("/mypage")}
            className={`flex items-center gap-2 mb-6 transition-colors group ${theme === "dark"
              ? "text-gray-400 hover:text-[#635bff]"
              : theme === "pop"
                ? "text-black hover:text-pink-500"
                : theme === "christmas"
                  ? "text-gray-500 hover:text-[#c41e3a]"
                  : "text-gray-400 hover:text-[#635bff]"
              }`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">뒤로가기</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${theme === "pop"
              ? "bg-pink-100 text-pink-600 border border-pink-200"
              : theme === "dark"
                ? "bg-[#635bff]/20 text-[#635bff] border border-[#635bff]/30"
                : theme === "christmas"
                  ? "bg-[#c41e3a]/10 text-[#c41e3a] border border-[#c41e3a]/20"
                  : "bg-[#635bff]/10 text-[#635bff]"
              }`}>
              <Sparkles className="w-4 h-4" />
              금융 관리
            </span>
            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 tracking-tight flex items-center gap-3 ${currentTheme.text}`}>
              <Wallet className={`w-7 h-7 sm:w-8 sm:h-8`} style={{ color: currentTheme.accent }} />
              내 지갑
            </h1>
            <p className={currentTheme.subtext}>나의 금융 정보를 관리하세요</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Total Deposit Card - Theme-aware */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => goHistory("deposit")}
          className={`group relative rounded-2xl p-6 text-white cursor-pointer overflow-hidden hover:scale-[1.02] transition-all duration-300 ${theme === "christmas"
            ? "bg-gradient-to-br from-[#b91c1c] via-[#dc2626] to-[#ef4444] shadow-xl shadow-red-500/30"
            : theme === "pop"
              ? "bg-gradient-to-br from-pink-500 via-pink-600 to-yellow-400 shadow-xl shadow-pink-500/20"
              : theme === "dark"
                ? "bg-gradient-to-br from-[#635bff] via-[#4f46e5] to-[#00d4ff] shadow-xl shadow-[#635bff]/30"
                : "bg-gradient-to-br from-[#635bff] via-[#5851e8] to-[#00d4ff] shadow-xl shadow-[#635bff]/20"
            }`}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              총 보증금
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              {totalDeposit.toLocaleString()}
              <span className="text-lg sm:text-xl font-semibold opacity-90 ml-1">원</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <TrendingDown className="w-4 h-4" />
                <span>안전하게 보관중</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                내역 보기
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
          {/* Background Decoration */}
          <div className={`absolute -right-8 -bottom-12 w-40 h-40 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity ${theme === "christmas" ? "bg-white" : theme === "pop" ? "bg-yellow-300" : "bg-[#00d4ff]"
            }`}></div>
          <div className={`absolute -left-8 -top-12 w-32 h-32 rounded-full opacity-10 blur-3xl ${theme === "christmas" ? "bg-yellow-300" : "bg-white"
            }`}></div>
        </motion.div>

        {/* Account & Card Grid - Side by side on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settlement Account - Variant T Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center px-1">
              <h3 className={`font-bold flex items-center gap-2 ${currentTheme.text}`}>
                <Building2 className="w-5 h-5" style={{ color: currentTheme.accent }} />
                정산 계좌
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goHistory("settlement");
                }}
                className="text-xs font-semibold uppercase tracking-wider transition-colors"
                style={{ color: currentTheme.accent }}
              >
                내역 →
              </button>
            </div>

            <div
              onClick={handleAccountClick}
              className={`group rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg ${theme === "pop"
                ? "bg-white shadow-sm hover:shadow-md hover:bg-pink-50"
                : theme === "dark"
                  ? "bg-[#1E293B] hover:shadow-[#635bff]/10"
                  : theme === "christmas"
                    ? "bg-white shadow-sm hover:shadow-md"
                    : "bg-white shadow-sm hover:shadow-md"
                }`}
            >
              {account ? (
                <div className="flex items-center gap-4">
                  {(() => {
                    const logoPath = getBankLogo(account.bankName);
                    const bankThemeStyle = getBankTheme(account.bankName);
                    return (
                      <div
                        className={`w-14 h-14 rounded-xl ${bankThemeStyle.bg} flex items-center justify-center overflow-hidden shadow-sm`}
                      >
                        {logoPath ? (
                          <img
                            src={logoPath}
                            alt={account.bankName}
                            className="w-full h-full object-contain p-1.5"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        ) : null}
                        <Building2
                          className={`w-6 h-6 ${bankThemeStyle.text} ${logoPath ? "hidden" : ""}`}
                        />
                      </div>
                    );
                  })()}
                  <div className="flex-1">
                    <div className={`font-bold text-lg ${currentTheme.text}`}>
                      {account.bankName}
                    </div>
                    <div className={`text-sm font-mono tracking-wide ${currentTheme.subtext}`}>
                      {account.accountNumber?.replace(/(\d{4})(\d{2})(.*)/, "$1-$2-******")}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("정말 계좌를 삭제하시겠습니까?")) {
                        deleteAccountAction();
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${theme === "dark"
                      ? "hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                      : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                      }`}
                    title="계좌 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className={`w-5 h-5 transition-colors ${theme === "dark"
                    ? "text-gray-400 group-hover:text-[#635bff]"
                    : theme === "pop"
                      ? "text-gray-400 group-hover:text-pink-500"
                      : theme === "christmas"
                        ? "text-gray-400 group-hover:text-[#c41e3a]"
                        : "text-gray-400 group-hover:text-[#635bff]"
                    }`} />
                </div>
              ) : (
                <div className={`flex items-center gap-4 transition-colors ${currentTheme.subtext}`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${theme === "dark"
                    ? "bg-gray-700 group-hover:bg-[#635bff]/20"
                    : theme === "pop"
                      ? "bg-gray-100 group-hover:bg-pink-100"
                      : theme === "christmas"
                        ? "bg-gray-100 group-hover:bg-[#c41e3a]/10"
                        : "bg-gray-100 group-hover:bg-[#635bff]/10"
                    }`}>
                    <Plus className={`w-6 h-6 transition-colors ${theme === "dark"
                      ? "text-gray-400 group-hover:text-[#635bff]"
                      : theme === "pop"
                        ? "text-gray-400 group-hover:text-pink-500"
                        : theme === "christmas"
                          ? "text-gray-400 group-hover:text-[#c41e3a]"
                          : "text-gray-400 group-hover:text-[#635bff]"
                      }`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold text-lg ${currentTheme.text}`}>계좌 등록하기</div>
                    <div className={`text-sm ${currentTheme.subtext}`}>클릭하여 등록</div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-colors ${theme === "dark"
                    ? "text-gray-400 group-hover:text-[#635bff]"
                    : theme === "pop"
                      ? "text-gray-400 group-hover:text-pink-500"
                      : theme === "christmas"
                        ? "text-gray-400 group-hover:text-[#c41e3a]"
                        : "text-gray-400 group-hover:text-[#635bff]"
                    }`} />
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment Method - Variant T Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center px-1">
              <h3 className={`font-bold flex items-center gap-2 ${currentTheme.text}`}>
                <CreditCard className="w-5 h-5" style={{ color: currentTheme.accent }} />
                결제 수단
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goHistory("payment");
                }}
                className="text-xs font-semibold uppercase tracking-wider transition-colors"
                style={{ color: currentTheme.accent }}
              >
                내역 →
              </button>
            </div>

            <div
              onClick={handleCardClick}
              className={`group rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg ${theme === "pop"
                ? "bg-white shadow-sm hover:shadow-md hover:bg-pink-50"
                : theme === "dark"
                  ? "bg-[#1E293B] hover:shadow-[#635bff]/10"
                  : theme === "christmas"
                    ? "bg-white shadow-sm hover:shadow-md"
                    : "bg-white shadow-sm hover:shadow-md"
                }`}
            >
              {card ? (
                <div className="flex items-center gap-4">
                  {(() => {
                    const logoPath = getCardLogo(card.cardCompany);
                    const cardThemeStyle = getCardTheme(card.cardCompany);
                    return (
                      <div
                        className={`w-14 h-14 rounded-xl ${cardThemeStyle.bg} flex items-center justify-center overflow-hidden shadow-sm`}
                      >
                        {logoPath ? (
                          <img
                            src={logoPath}
                            alt={card.cardCompany}
                            className="w-full h-full object-contain p-1.5"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        ) : null}
                        <CreditCard
                          className={`w-6 h-6 ${cardThemeStyle.text} ${logoPath ? "hidden" : ""}`}
                        />
                      </div>
                    );
                  })()}
                  <div className="flex-1">
                    <div className={`font-bold text-lg ${currentTheme.text}`}>
                      {card.cardCompany}
                    </div>
                    <div className={`text-sm font-mono tracking-wide ${currentTheme.subtext}`}>
                      **** **** **** {card.cardNumber?.slice(-4) || "****"}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("정말 카드를 삭제하시겠습니까?")) {
                        deleteCardAction();
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${theme === "dark"
                      ? "hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                      : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                      }`}
                    title="카드 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className={`w-5 h-5 transition-colors ${theme === "dark"
                    ? "text-gray-400 group-hover:text-[#635bff]"
                    : theme === "pop"
                      ? "text-gray-400 group-hover:text-pink-500"
                      : theme === "christmas"
                        ? "text-gray-400 group-hover:text-[#c41e3a]"
                        : "text-gray-400 group-hover:text-[#635bff]"
                    }`} />
                </div>
              ) : (
                <div className={`flex items-center gap-4 transition-colors ${currentTheme.subtext}`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${theme === "dark"
                    ? "bg-gray-700 group-hover:bg-[#635bff]/20"
                    : theme === "pop"
                      ? "bg-gray-100 group-hover:bg-pink-100"
                      : theme === "christmas"
                        ? "bg-gray-100 group-hover:bg-[#c41e3a]/10"
                        : "bg-gray-100 group-hover:bg-[#635bff]/10"
                    }`}>
                    <Plus className={`w-6 h-6 transition-colors ${theme === "dark"
                      ? "text-gray-400 group-hover:text-[#635bff]"
                      : theme === "pop"
                        ? "text-gray-400 group-hover:text-pink-500"
                        : theme === "christmas"
                          ? "text-gray-400 group-hover:text-[#c41e3a]"
                          : "text-gray-400 group-hover:text-[#635bff]"
                      }`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold text-lg ${currentTheme.text}`}>카드 등록하기</div>
                    <div className={`text-sm ${currentTheme.subtext}`}>클릭하여 등록</div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-colors ${theme === "dark"
                    ? "text-gray-400 group-hover:text-[#635bff]"
                    : theme === "pop"
                      ? "text-gray-400 group-hover:text-pink-500"
                      : theme === "christmas"
                        ? "text-gray-400 group-hover:text-[#c41e3a]"
                        : "text-gray-400 group-hover:text-[#635bff]"
                    }`} />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Info Cards - Theme-aware */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3 sm:gap-4 pt-4"
        >
          <div className={`rounded-2xl p-4 ${theme === "dark"
            ? "bg-[#635bff]/10"
            : theme === "pop"
              ? "bg-pink-100"
              : theme === "christmas"
                ? "bg-[#c41e3a]/5"
                : "bg-gradient-to-br from-[#635bff]/5 to-[#635bff]/10"
            }`}>
            <ShieldCheck className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>안전 보증금</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>100% 보호</p>
          </div>
          <div className={`rounded-2xl p-4 ${theme === "dark"
            ? "bg-[#635bff]/10"
            : theme === "pop"
              ? "bg-yellow-100"
              : theme === "christmas"
                ? "bg-[#0a6638]/5"
                : "bg-gradient-to-br from-[#635bff]/5 to-[#635bff]/10"
            }`}>
            <Zap className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>자동 결제</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>편리하게</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
