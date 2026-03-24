import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import { requestPayment } from "../../utils/paymentHandler";
import { calculateEndDate, getTodayString } from "../../utils/dateUtils";
import { updateOttAccount, fetchPartyDetail } from "../../hooks/party/partyService";
import { getMyCard } from "../../api/userApi";
import { processLeaderDeposit } from "../../api/partyApi";
import RippleButton from "../../components/party/RippleButton";
import { getProductIconUrl } from "../../utils/imageUtils";
import {
  useTheme,
  themeConfig
} from "../../config/themeConfig";
import {
  Check,
  Calendar,
  CreditCard,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  Users,
  ChevronRight,
  AlertCircle
} from "lucide-react";

// Party 페이지 테마 스타일
const partyThemeStyles = {
  pop: {
    accent: 'text-pink-500',
    accentBg: 'bg-pink-500',
    hoverAccentBg: 'hover:bg-pink-600',
    badge: 'bg-pink-50 text-pink-600',
    buttonShadow: 'shadow-pink-500/25',
    accentColor: '#ec4899',
  },
  classic: {
    accent: 'text-[#635bff]',
    accentBg: 'bg-[#635bff]',
    hoverAccentBg: 'hover:bg-[#5851e8]',
    badge: 'bg-indigo-50 text-[#635bff]',
    buttonShadow: 'shadow-[#635bff]/25',
    accentColor: '#635bff',
  },
  dark: {
    accent: 'text-[#635bff]',
    accentBg: 'bg-[#635bff]',
    hoverAccentBg: 'hover:bg-[#5851e8]',
    badge: 'bg-gray-800 text-[#635bff]',
    buttonShadow: 'shadow-gray-900/25',
    accentColor: '#635bff',
  },
  christmas: {
    accent: 'text-[#c41e3a]',
    accentBg: 'bg-[#c41e3a]',
    hoverAccentBg: 'hover:bg-red-700',
    greenAccent: 'text-[#1a5f2a]',
    greenBg: 'bg-[#1a5f2a]',
    badge: 'bg-red-50 text-[#c41e3a]',
    greenBadge: 'bg-green-50 text-[#1a5f2a]',
    buttonShadow: 'shadow-[#c41e3a]/25',
    cardShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
    accentColor: '#c41e3a',
  },
};

export default function PartyCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuthStore();

  // Theme
  const { theme, setTheme, currentTheme } = useTheme("appTheme");
  const themeStyle = partyThemeStyles[theme] || partyThemeStyles.pop;

  // Zustand Store
  const {
    products,
    loadProducts,
    createNewParty
  } = usePartyStore();

  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "", months: 3 });
  const [maxMembers, setMaxMembers] = useState(4);
  const [createdPartyId, setCreatedPartyId] = useState(null);
  const [ottInfo, setOttInfo] = useState({ ottId: "", ottPassword: "" });
  const [localLoading, setLocalLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(!!searchParams.get("step"));
  const [errors, setErrors] = useState({});
  const [savedCard, setSavedCard] = useState(null);
  const [cardLoading, setCardLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProducts();
      checkRedirectReturn();
      // 사용자 카드 정보 조회
      setCardLoading(true);
      getMyCard()
        .then(res => {
          if (res?.success && res.data) {
            setSavedCard(res.data);
          } else {
            setSavedCard(null);
          }
        })
        .catch(() => setSavedCard(null))
        .finally(() => setCardLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkRedirectReturn = async () => {
    const stepParam = searchParams.get("step");
    const partyIdParam = searchParams.get("partyId");

    if (stepParam && partyIdParam) {
      try {
        const party = await fetchPartyDetail(partyIdParam);
        if (party) {
          setSelectedProduct({
            productId: party.productId,
            productName: party.productName || "Unknown Product",
            price: party.monthlyFee || 0,
            maxUserCount: party.maxMembers
          });
          setCreatedPartyId(Number(partyIdParam));
          setStep(Number(stepParam));
          setMaxMembers(party.maxMembers || 4);
        }
      } catch (error) {
        console.error("Failed to restore", error);
        alert("세션 복구에 실패했습니다.");
        setStep(1);
      } finally {
        setIsRestoring(false);
      }
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setMaxMembers(product.maxUserCount || 4);
    setStep(2);
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!maxMembers || maxMembers < 2) {
      newErrors.maxMembers = "파티 인원을 선택해주세요";
    }

    if (!dates.startDate) {
      newErrors.startDate = "시작일을 선택해주세요";
    }

    if (!dates.months || dates.months < 1) {
      newErrors.months = "이용 기간을 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      // 스크롤을 첫 번째 에러로 이동
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setStep(3);
  };

  const handlePayment = async () => {
    if (!selectedProduct) return;
    setLocalLoading(true);

    try {
      const partyData = {
        productId: selectedProduct.productId,
        maxMembers: maxMembers,
        startDate: dates.startDate,
        endDate: dates.endDate,
        ottId: "",
        ottPassword: "",
      };

      let partyId = createdPartyId;

      if (!partyId) {
        const result = await createNewParty(partyData);
        partyId = result.partyId;
        setCreatedPartyId(partyId);
      }

      // 보증금 = 원래 구독료 (백엔드에서 monthlyFee * maxMembers로 계산)
      const depositAmount = selectedProduct.price;

      // 등록된 카드가 있으면 빌링키로 바로 결제
      if (savedCard) {
        await processLeaderDeposit(partyId, {
          amount: depositAmount,
          paymentMethod: "CARD",
          useExistingCard: true
        });
        // 결제 성공 시 OTT 계정 입력 단계로 이동
        setStep(4);
        setLocalLoading(false);
      } else {
        // 등록된 카드가 없으면 토스페이먼츠 일반 결제창 호출
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            type: "CREATE_PARTY",
            partyId: partyId,
            partyData: partyData,
          })
        );

        await requestPayment(
          `${selectedProduct.productName} 보증금`,
          depositAmount,
          "파티장"
        );
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error?.message || error.message || "결제 처리에 실패했습니다.");
      setLocalLoading(false);
    }
  };

  const handleOttChange = (e) => {
    const { name, value } = e.target;
    setOttInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOttSubmit = async (e) => {
    e.preventDefault();
    if (!ottInfo.ottId || !ottInfo.ottPassword) return alert("계정 정보를 입력해주세요.");

    try {
      await updateOttAccount(createdPartyId, ottInfo);
      setTimeout(() => {
        alert("파티가 생성되었습니다!");
        navigate(`/party/${createdPartyId}`);
      }, 500);
    } catch (error) {
      console.error(error);
      alert("계정 정보 저장에 실패했습니다.");
    }
  };

  const steps = [
    { number: 1, label: "서비스 선택", icon: Sparkles },
    { number: 2, label: "설정", icon: Calendar },
    { number: 3, label: "보증금", icon: CreditCard },
    { number: 4, label: "계정 정보", icon: Lock },
  ];


  if (isRestoring || authLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center relative z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#635bff] border-t-transparent"></div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300 relative z-10">


      {/* Hero Header */}
      <div className={`relative overflow-hidden border-b ${theme === "dark" ? "bg-transparent border-gray-800"
        : theme === "pop" ? "bg-transparent border-gray-200"
          : theme === "christmas" ? "bg-transparent border-gray-100"
            : "bg-transparent border-gray-100"
        }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              theme === "pop"
                ? "bg-pink-500 text-white border border-gray-200"
                : theme === "dark"
                  ? "bg-[#635bff]/20 text-[#635bff]"
                  : theme === "christmas"
                    ? "bg-red-800/10 text-red-800"
                    : "bg-[#635bff]/10 text-[#635bff]"
              }`}>
              <Sparkles className="w-4 h-4" />
              파티장 혜택
            </span>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${currentTheme.text}`}>
              새 파티 만들기
            </h1>
            <p className={`text-lg ${currentTheme.subtext}`}>
              몇 분 만에 구독료 절약을 시작해보세요
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Stepper - Theme-aware */}
      <div className={`${theme === "dark" ? "bg-[#1E293B] border-b border-gray-700"
          : theme === "pop" ? "bg-transparent"
            : theme === "christmas" ? "bg-white border-b border-gray-100"
              : "bg-white border-b border-gray-100"
        }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted ? accentColor : isActive ? (theme === "dark" ? "#1E293B" : "#ffffff") : (theme === "dark" ? "#334155" : "#f5f5f5")
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2`}
                      style={{
                        borderColor: isCompleted || isActive ? accentColor : (theme === "dark" ? "#4B5563" : "#e5e7eb"),
                        color: isCompleted ? "#ffffff" : isActive ? accentColor : (theme === "dark" ? "#9CA3AF" : "#9ca3af"),
                        boxShadow: isCompleted ? `0 10px 15px -3px ${accentColor}40` : "none"
                      }}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </motion.div>
                    <p
                      className={`mt-2 text-xs font-semibold`}
                      style={{ color: isActive ? accentColor : (theme === "dark" ? "#9CA3AF" : "#9ca3af") }}
                    >
                      {s.label}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-all duration-500`}
                      style={{ backgroundColor: step > s.number ? accentColor : (theme === "dark" ? "#4B5563" : "#e5e7eb") }}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${currentTheme.text}`}>서비스 선택</h2>
                <p className={currentTheme.subtext}>공유하고 싶은 구독 서비스를 선택해주세요</p>
              </div>

              {products.length === 0 ? (
                <div className={`text-center py-20 rounded-2xl border border-dashed ${currentTheme.card}`}>
                  <p className={currentTheme.subtext}>사용 가능한 상품이 없습니다</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.productId}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProductSelect(product)}
                      className={`group rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg ${currentTheme.card}`}
                      style={{ '--hover-shadow': `${accentColor}20` }}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100"
                          style={{ background: `linear-gradient(to bottom right, ${accentColor}15, ${accentColor}05)` }}
                        >
                          {product.image ? (
                            <img
                              src={getProductIconUrl(product.image)}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Sparkles className="w-6 h-6" style={{ color: accentColor }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg transition-colors ${currentTheme.cardText}`} style={{ '--hover-color': accentColor }}>
                            {product.productName}
                          </h3>
                          <p className={`text-sm font-semibold ${currentTheme.cardSubtext}`}>
                            월 {product.price.toLocaleString()}원
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-all" style={{ color: accentColor }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Date & Size */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleDateSubmit}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${currentTheme.text}`}>파티 설정</h2>
                <p className={currentTheme.subtext}>인원과 기간을 설정해주세요</p>
              </div>

              {/* Selected Product Display */}
              <div className={`flex items-center gap-4 p-5 rounded-2xl border ${
                theme === "pop"
                  ? "bg-gradient-to-br from-pink-50 to-pink-100/50 border-gray-200"
                  : theme === "christmas"
                    ? "bg-gradient-to-br from-red-50 to-green-50 border-gray-200"
                    : "bg-gradient-to-br from-[#635bff]/5 to-[#00d4ff]/5 border-[#635bff]/10"
              }`}>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Sparkles className={`w-6 h-6 ${theme === "pop" ? "text-pink-500" : theme === "christmas" ? "text-red-800" : "text-[#635bff]"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg">{selectedProduct.productName}</p>
                  <p className={`font-semibold ${theme === "pop" ? "text-pink-500" : theme === "christmas" ? "text-red-800" : "text-[#635bff]"}`}>
                    월 {selectedProduct.price.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className={`space-y-8 rounded-2xl p-6 border ${theme === "dark" ? "bg-[#1E293B] border-gray-700" : theme === "christmas" ? "bg-white border-gray-200" : "bg-white border-gray-100"
                }`}>
                {/* Max Members - 2, 3, 4 Button Selection */}
                <div id="maxMembers">
                  <label className={`block text-sm font-bold mb-4 ${currentTheme.text}`}>
                    <span className="flex items-center gap-2">
                      <Users className={`w-5 h-5 ${theme === "pop" ? "text-pink-500" : theme === "christmas" ? "text-red-800" : "text-[#635bff]"}`} />
                      파티 인원
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[2, 3, 4].map((count) => {
                      const isSelected = maxMembers === count;
                      const perPersonFee = Math.floor(selectedProduct.price / count);
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => {
                            setMaxMembers(count);
                            setErrors({ ...errors, maxMembers: "" });
                          }}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? theme === "pop"
                                ? "border-pink-500 bg-pink-50 shadow-md shadow-pink-500/10"
                                : theme === "christmas"
                                  ? "border-red-800 bg-red-50 shadow-md shadow-red-800/10"
                                  : "border-[#635bff] bg-[#635bff]/5 shadow-md shadow-[#635bff]/10"
                              : theme === "pop"
                                ? "border-gray-200 bg-white hover:border-pink-500/30 hover:bg-pink-50"
                                : theme === "christmas"
                                  ? "border-gray-200 bg-white hover:border-red-800/30 hover:bg-red-50"
                                  : "border-gray-100 bg-white hover:border-[#635bff]/30 hover:bg-gray-50"
                            }`}
                        >
                          <div className="text-center">
                            <div className={`text-2xl font-bold mb-1 ${
                              isSelected
                                ? theme === "pop" ? "text-pink-500" : theme === "christmas" ? "text-red-800" : "text-[#635bff]"
                                : "text-gray-900"
                            }`}>
                              {count}명
                            </div>
                            <div className={`text-sm ${
                              isSelected
                                ? theme === "pop" ? "text-pink-500/70" : theme === "christmas" ? "text-red-800/70" : "text-[#635bff]/70"
                                : "text-gray-500"
                            }`}>
                              월 {perPersonFee.toLocaleString()}원
                            </div>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                                theme === "pop"
                                  ? "bg-pink-500 shadow-pink-500/25"
                                  : theme === "christmas"
                                    ? "bg-red-800 shadow-red-800/25"
                                    : "bg-[#635bff] shadow-[#635bff]/25"
                              }`}
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {errors.maxMembers && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-red-500 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.maxMembers}</span>
                    </motion.div>
                  )}
                </div>

                <div id="startDate">
                  <label className={`block text-sm font-bold mb-3 ${currentTheme.text}`}>
                    <span className="flex items-center gap-2">
                      <Calendar className={`w-5 h-5 ${theme === "pop" ? "text-pink-400" : theme === "christmas" ? "text-green-800" : "text-[#00d4ff]"}`} />
                      시작일
                    </span>
                  </label>

                  <div className="relative">
                    <input
                      type="date"
                      min={getTodayString()}
                      value={dates.startDate || ""}
                      onChange={(e) => {
                        const start = e.target.value;
                        const end = dates.months ? calculateEndDate(start, dates.months) : "";
                        setDates({ ...dates, startDate: start, endDate: end });
                        setErrors({ ...errors, startDate: "" });
                      }}
                      className={`w-full bg-gray-50 border-2 p-4 rounded-xl focus:ring-2 outline-none text-gray-900 transition-all font-semibold ${
                        errors.startDate
                          ? "border-red-300"
                          : theme === "pop"
                            ? "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
                            : theme === "christmas"
                              ? "border-gray-200 focus:border-red-800 focus:ring-red-800/20"
                              : "border-gray-100 focus:border-[#635bff] focus:ring-[#635bff]/20"
                        }`}
                    />
                    {!dates.startDate && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-gray-400 text-sm font-medium">날짜를 선택하세요</span>
                      </div>
                    )}
                  </div>

                  {errors.startDate && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-red-500 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.startDate}</span>
                    </motion.div>
                  )}
                </div>

                <div id="months">
                  <label className={`block text-sm font-bold mb-4 ${currentTheme.text}`}>
                    <span className="flex items-center gap-2">
                      <Calendar className={`w-5 h-5 ${theme === "pop" ? "text-pink-400" : theme === "christmas" ? "text-green-800" : "text-[#00d4ff]"}`} />
                      이용 기간
                    </span>
                  </label>

                  {/* Current Selection Display */}
                  <div className="text-center mb-6">
                    <motion.div
                      key={dates.months}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-baseline gap-1"
                    >
                      <span className={`text-5xl font-bold ${theme === "pop" ? "text-pink-500" : theme === "christmas" ? "text-red-800" : "text-[#635bff]"}`}>{dates.months}</span>
                      <span className="text-xl text-gray-400">개월</span>
                    </motion.div>
                  </div>

                  {/* Slider */}
                  <div className="px-2 mb-4">
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={dates.months}
                      onChange={(e) => {
                        const newMonths = parseInt(e.target.value);
                        const end = dates.startDate ? calculateEndDate(dates.startDate, newMonths) : "";
                        setDates({ ...dates, months: newMonths, endDate: end });
                        setErrors({ ...errors, months: "" });
                      }}
                      className={`w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all
                        [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg
                        ${theme === "pop"
                          ? "accent-pink-500 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:hover:bg-pink-600 [&::-moz-range-thumb]:bg-pink-500"
                          : theme === "christmas"
                            ? "accent-red-800 [&::-webkit-slider-thumb]:bg-red-800 [&::-webkit-slider-thumb]:hover:bg-red-900 [&::-moz-range-thumb]:bg-red-800"
                            : "accent-[#635bff] [&::-webkit-slider-thumb]:bg-[#635bff] [&::-webkit-slider-thumb]:hover:bg-[#5851e8] [&::-moz-range-thumb]:bg-[#635bff]"
                        }`}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                      <span>1개월</span>
                      <span>6개월</span>
                      <span>12개월</span>
                    </div>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="flex gap-2 justify-center">
                    {[3, 6, 9, 12].map((month) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => {
                          const end = dates.startDate ? calculateEndDate(dates.startDate, month) : "";
                          setDates({ ...dates, months: month, endDate: end });
                          setErrors({ ...errors, months: "" });
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                          dates.months === month
                            ? theme === "pop"
                              ? "bg-pink-500 text-white shadow-md shadow-pink-500/25"
                              : theme === "christmas"
                                ? "bg-red-800 text-white shadow-md shadow-red-800/25"
                                : "bg-[#635bff] text-white shadow-md shadow-[#635bff]/25"
                            : theme === "pop"
                              ? "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                              : theme === "christmas"
                                ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-800"
                                : "bg-gray-100 text-gray-600 hover:bg-[#635bff]/10 hover:text-[#635bff]"
                          }`}
                      >
                        {month === 3 && "3개월"}
                        {month === 6 && "6개월"}
                        {month === 9 && "9개월"}
                        {month === 12 && "1년"}
                      </button>
                    ))}
                  </div>

                  {errors.months && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-red-500 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.months}</span>
                    </motion.div>
                  )}

                  {/* Savings Calculation */}
                  {(() => {
                    const monthlyPrice = selectedProduct.price;
                    const perPersonFee = Math.floor(monthlyPrice / maxMembers);
                    const monthlySavings = monthlyPrice - perPersonFee;
                    const totalSavings = monthlySavings * dates.months;

                    return (
                      <motion.div
                        key={`${maxMembers}-${dates.months}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 p-4 rounded-xl border ${theme === "dark" ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-800" : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100"}`}
                      >
                        <div className="flex items-center gap-2 text-emerald-700 font-bold mb-3">
                          <Sparkles className="w-5 h-5" />
                          파티장 절약 혜택
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>원래 구독료</span>
                            <span className={currentTheme.text}>월 {monthlyPrice.toLocaleString()}원</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>파티 공유 후</span>
                            <span className={currentTheme.text}>월 {perPersonFee.toLocaleString()}원</span>
                          </div>
                          <div className="flex justify-between text-emerald-600 font-semibold">
                            <span>매월 절약</span>
                            <span>-{monthlySavings.toLocaleString()}원</span>
                          </div>
                          <div className={`pt-2 mt-2 border-t ${theme === "dark" ? "border-emerald-700" : "border-emerald-200"}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700 font-semibold">{dates.months}개월 총 절약</span>
                              <motion.span
                                key={totalSavings}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-xl font-bold text-emerald-600"
                              >
                                -{totalSavings.toLocaleString()}원
                              </motion.span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>

                {/* Result Preview */}
                {dates.startDate && dates.endDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-xl border ${
                      theme === "pop"
                        ? "bg-gradient-to-r from-pink-50 to-pink-100/50 border-gray-200"
                        : theme === "christmas"
                          ? "bg-gradient-to-r from-red-50 to-green-50 border-gray-200"
                          : "bg-gradient-to-r from-[#635bff]/5 to-[#00d4ff]/5 border-[#635bff]/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">계약 기간</span>
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-center flex-1">
                        <span className="block text-xs text-gray-500 mb-1">시작</span>
                        <span className="block font-bold text-gray-900">{dates.startDate}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                      <div className="text-center flex-1">
                        <span className="block text-xs text-gray-500 mb-1">종료</span>
                        <span className="block font-bold text-gray-900">{dates.endDate}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`font-semibold px-6 py-3 transition-colors ${currentTheme.subtext} hover:opacity-80`}
                >
                  이전
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-3 text-white rounded-full font-semibold transition-all flex items-center gap-2 ${currentTheme.accentBg}`}
                  style={{ boxShadow: `0 10px 15px -3px ${accentColor}40` }}
                >
                  다음
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${currentTheme.text}`}>보증금 결제</h2>
                <p className={currentTheme.subtext}>파티 생성을 위해 보증금을 결제해주세요</p>
              </div>

              <div className={`rounded-2xl p-6 space-y-4 ${currentTheme.card}`}>
                <div className="flex justify-between items-center text-sm">
                  <span className={currentTheme.cardSubtext}>서비스</span>
                  <span className={`font-bold ${currentTheme.cardText}`}>{selectedProduct.productName}</span>
                </div>
                <div className={`flex justify-between items-center text-sm border-b pb-4 ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                  <span className={currentTheme.cardSubtext}>이용 기간</span>
                  <span className={`font-bold ${currentTheme.cardText}`}>
                    {dates.startDate} ~ {dates.endDate}
                  </span>
                </div>
                <div className={`flex justify-between items-center text-sm border-b pb-4 ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                  <span className={currentTheme.cardSubtext}>파티 인원</span>
                  <span className={`font-bold ${currentTheme.cardText}`}>
                    {maxMembers}명
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className={`font-bold text-lg ${currentTheme.cardText}`}>총 보증금</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color: accentColor }}>
                      {selectedProduct.price.toLocaleString()}
                      <span className={`text-lg ml-1 ${currentTheme.cardSubtext}`}>원</span>
                    </div>
                    <p className={`text-xs mt-1 ${currentTheme.cardSubtext}`}>
                      (월 구독료 기준)
                    </p>
                  </div>
                </div>
              </div>

              {/* 등록된 카드 정보 표시 */}
              {cardLoading ? (
                <div className={`rounded-2xl p-6 ${currentTheme.card}`}>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    <span className={currentTheme.cardSubtext}>카드 정보 확인 중...</span>
                  </div>
                </div>
              ) : savedCard ? (
                <div className={`rounded-2xl p-6 ${currentTheme.card}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}>
                      <CreditCard className="w-5 h-5" style={{ color: accentColor }} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${currentTheme.cardText}`}>등록된 카드로 결제</p>
                      <p className={`text-sm ${currentTheme.cardSubtext}`}>
                        {savedCard.cardCompany} {savedCard.cardNumber}
                      </p>
                    </div>
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className={`text-xs ${currentTheme.cardSubtext}`}>
                    등록된 카드로 바로 결제됩니다. 새 카드로 결제하려면 마이페이지에서 카드를 변경해주세요.
                  </p>
                </div>
              ) : (
                <div className={`rounded-2xl p-6 ${currentTheme.card}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}>
                      <CreditCard className="w-5 h-5" style={{ color: accentColor }} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${currentTheme.cardText}`}>새 카드로 결제</p>
                      <p className={`text-sm ${currentTheme.cardSubtext}`}>
                        토스페이먼츠 결제창에서 카드를 등록합니다
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex gap-3">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p>보증금은 파티가 성공적으로 종료되면 전액 환불됩니다</p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className={`font-semibold px-6 py-3 transition-colors ${currentTheme.subtext} hover:opacity-80`}
                >
                  이전
                </button>
                <RippleButton
                  onClick={handlePayment}
                  disabled={localLoading || cardLoading}
                  className={`px-8 py-3 text-white rounded-full font-semibold flex items-center gap-2 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${currentTheme.accentBg}`}
                  style={{ boxShadow: `0 10px 15px -3px ${accentColor}40` }}
                >
                  {localLoading ? (
                    "처리중..."
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      결제하기
                    </>
                  )}
                </RippleButton>
              </div>
            </motion.div>
          )}

          {/* Step 4: OTT Info */}
          {step === 4 && (
            <motion.form
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleOttSubmit}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                  theme === "pop"
                    ? "bg-pink-50 border-pink-100"
                    : theme === "christmas"
                      ? "bg-red-50 border-red-100"
                      : "bg-emerald-50 border-emerald-100"
                }`}>
                  <Check className={`w-8 h-8 ${
                    theme === "pop" ? "text-pink-500" : theme === "christmas" ? "text-red-800" : "text-emerald-500"
                  }`} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">결제 완료!</h2>
                <p className="text-gray-500">공유할 계정 정보를 입력해주세요</p>
              </div>

              <div className={`bg-white border rounded-2xl p-6 space-y-4 ${
                theme === "pop" ? "border-gray-200" : theme === "christmas" ? "border-gray-200" : "border-gray-100"
              }`}>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    아이디 (이메일)
                  </label>
                  <input
                    type="text"
                    name="ottId"
                    value={ottInfo.ottId}
                    onChange={handleOttChange}
                    placeholder="user@example.com"
                    className={`w-full bg-gray-50 border p-4 rounded-xl focus:ring-2 outline-none text-gray-900 ${
                      theme === "pop"
                        ? "border-gray-200 focus:ring-pink-500/20 focus:border-pink-500"
                        : theme === "christmas"
                          ? "border-gray-200 focus:ring-red-800/20 focus:border-red-800"
                          : "border-gray-200 focus:ring-[#635bff]/20 focus:border-[#635bff]"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">비밀번호</label>
                  <input
                    type="text"
                    name="ottPassword"
                    value={ottInfo.ottPassword}
                    onChange={handleOttChange}
                    placeholder="비밀번호 입력"
                    className={`w-full bg-gray-50 border p-4 rounded-xl focus:ring-2 outline-none text-gray-900 ${
                      theme === "pop"
                        ? "border-gray-200 focus:ring-pink-500/20 focus:border-pink-500"
                        : theme === "christmas"
                          ? "border-gray-200 focus:ring-red-800/20 focus:border-red-800"
                          : "border-gray-200 focus:ring-[#635bff]/20 focus:border-[#635bff]"
                    }`}
                    required
                  />
                </div>
              </div>

              <RippleButton
                type="submit"
                className={`w-full py-4 text-white rounded-full font-bold shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  theme === "pop"
                    ? "bg-pink-500 hover:bg-pink-600 shadow-pink-500/25"
                    : theme === "christmas"
                      ? "bg-red-800 hover:bg-red-900 shadow-red-800/25"
                      : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
                }`}
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                파티 생성 완료
              </RippleButton>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
