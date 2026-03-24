import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { ThemeSwitcher } from '@/config/themeConfig';
import { getProductIconUrl } from '@/utils/imageUtils';
import { themeClasses } from '@/utils/themeUtils';

const UpdateSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const [subscription, setSubscription] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch current subscription
                const subResponse = await httpClient.get(`/subscription/${id}`);
                let currentSub = null;
                if (subResponse && subResponse.subscriptionId) {
                    currentSub = subResponse;
                } else if (subResponse.success) {
                    currentSub = subResponse.data;
                }

                if (currentSub) {
                    setSubscription(currentSub);
                    setSelectedProductId(currentSub.productId);
                }

                // 2. Fetch all products
                const prodResponse = await httpClient.get('/product');
                if (prodResponse.success) {
                    setProducts(prodResponse.data);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
                alert("데이터를 불러오는데 실패했습니다.");
                navigate(`/subscription/${id}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleUpdate = async () => {
        if (!selectedProductId) return;

        // Validation: Cannot change to same product
        if (selectedProductId === subscription.productId) {
            alert("이미 이용 중인 상품입니다.");
            return;
        }

        if (window.confirm("선택한 상품으로 구독을 변경하시겠습니까?")) {
            try {
                const updateData = {
                    ...subscription,
                    productId: selectedProductId,
                    subscriptionStatus: 'ACTIVE' // Ensure status is active
                };

                await httpClient.put('/subscription', updateData);
                alert("구독 상품이 변경되었습니다.");
                navigate(`/subscription/${id}`);
            } catch (error) {
                console.error("Failed to update subscription", error);
                alert("구독 변경에 실패했습니다.");
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-transparent">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--theme-primary)]"></div>
        </div>
    );
    if (!subscription) return null;

    return (
        <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300 relative z-10">
            {/* Theme Switcher */}
            <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

            {/* Hero Header */}
            <div className={`relative overflow-hidden bg-transparent ${theme === "dark" ? "border-b border-gray-800" : ""}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
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
                            구독 옵션
                        </span>
                        <h1 className={`text-3xl sm:text-4xl font-bold mb-2 tracking-tight flex items-center gap-3 ${themeClasses.text.primary}`}>
                            <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--theme-primary)]" />
                            구독 상품 변경
                        </h1>
                        <p className={themeClasses.text.muted}>더 나은 요금제로 변경해보세요</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-4 py-8 relative z-10">

                <div className={`p-6 mb-6 relative z-10 ${themeClasses.card.base}`}>
                    <h2 className={`font-bold mb-4 ${themeClasses.text.primary}`}>현재 이용 중인 상품</h2>
                    <div className={`flex items-center gap-4 p-4 rounded-xl bg-[var(--theme-border-light)]/30`}>
                        <img
                            src={getProductIconUrl(subscription.productImage) || '/placeholder.png'}
                            alt={subscription.productName}
                            className="w-16 h-16 rounded-lg object-contain p-1 bg-white"
                        />
                        <div>
                            <p className={`font-bold ${themeClasses.text.primary}`}>{subscription.productName}</p>
                            <p className={`text-sm text-[var(--theme-primary)]`}>
                                {subscription.price?.toLocaleString()}원/월
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`p-6 mb-8 relative z-10 ${themeClasses.card.base}`}>
                    <h2 className={`font-bold mb-4 ${themeClasses.text.primary}`}>변경할 상품 선택</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {products.map(product => {
                            const isSelected = selectedProductId === product.productId;
                            return (
                                <div
                                    key={product.productId}
                                    onClick={() => setSelectedProductId(product.productId)}
                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                        ? 'border-[var(--theme-primary)] bg-[var(--theme-primary-light)]/10 ring-1 ring-[var(--theme-primary)]'
                                        : 'border-[var(--theme-border-light)] hover:bg-[var(--theme-border-light)]/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={getProductIconUrl(product.image) || '/placeholder.png'}
                                            alt={product.productName}
                                            className="w-12 h-12 rounded-lg object-contain p-1 bg-white"
                                        />
                                        <div>
                                            <p className={`font-bold text-sm ${themeClasses.text.primary}`}>{product.productName}</p>
                                            <p className={`text-xs text-[var(--theme-primary)]`}>
                                                {product.price?.toLocaleString()}원
                                            </p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--theme-primary)]">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-3 relative z-10">
                    <button
                        onClick={() => navigate(`/subscription/${id}`)}
                        className={`flex-1 py-3 rounded-xl font-bold transition-colors ${themeClasses.button.secondary}`}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={!selectedProductId || selectedProductId === subscription.productId}
                        className={`flex-1 py-3 rounded-xl font-bold transition-colors ${!selectedProductId || selectedProductId === subscription.productId
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : themeClasses.button.primary
                            }`}
                    >
                        변경 완료
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateSubscription;
