import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Sparkles } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { ThemeSwitcher } from '@/config/themeConfig';
import { getProductIconUrl } from '@/utils/imageUtils';
import { themeClasses } from '@/utils/themeUtils';

const GetSubscriptionList = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        if (!user?.userId) {
            console.warn("User ID missing in authStore, skipping fetch");
            setLoading(false);
            return;
        }

        const fetchSubscriptions = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get('/subscription', {
                    params: { userId: user.userId }
                });

                if (Array.isArray(response)) {
                    setSubscriptions(response);
                } else if (response && response.success) {
                    setSubscriptions(response.data || []);
                } else {
                    console.warn("Unexpected response format:", response);
                    setSubscriptions([]);
                }
            } catch (error) {
                console.error("Failed to fetch subscriptions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, [user]);

    const activeSubscriptions = subscriptions.filter(sub => sub.subscriptionStatus === 'ACTIVE');
    const inactiveSubscriptions = subscriptions.filter(sub => sub.subscriptionStatus !== 'ACTIVE');

    if (loading) return (
        <div className={`min-h-screen ${themeClasses.bg.base} flex justify-center items-center`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--theme-primary)]"></div>
        </div>
    );

    // 테마별 악센트 색상
    const getAccentColor = () => {
        switch (theme) {
            case "dark": return "#635bff";
            default: return "#635bff";
        }
    };
    const accentColor = getAccentColor();

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
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${theme === "dark"
                            ? "bg-[#635bff]/20 text-[#635bff] border border-[#635bff]/30"
                            : "bg-[#635bff]/10 text-[#635bff]"
                            }`}>
                            <Sparkles className="w-4 h-4" />
                            구독 관리
                        </span>
                        <h1 className={`text-3xl sm:text-4xl font-bold mb-2 tracking-tight flex items-center gap-3 ${themeClasses.text.primary}`}>
                            <CreditCard className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: accentColor }} />
                            나의 구독 내역
                        </h1>
                        <p className={themeClasses.text.muted}>구독 중인 상품을 확인하고 관리하세요</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                {subscriptions.length === 0 ? (
                    <div className={`text-center py-20 ${themeClasses.bg.card} bg-opacity-50 border border-dashed border-[var(--theme-border-light)] rounded-2xl`}>
                        <p className={`mb-4 ${themeClasses.text.muted}`}>구독 중인 상품이 없습니다.</p>
                        <button
                            onClick={() => navigate('/product')}
                            className={`px-6 py-2 ${themeClasses.button.primary}`}
                        >
                            구독 상품 보러가기
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeSubscriptions.map(sub => (
                            <div
                                key={sub.subscriptionId}
                                onClick={() => navigate(`/subscription/${sub.subscriptionId}`)}
                                className={`p-5 flex items-center justify-between cursor-pointer relative z-10 ${themeClasses.card.elevated}`}
                            >
                                <div className="flex items-center gap-5">
                                    <img
                                        src={getProductIconUrl(sub.productImage) || '/placeholder.png'}
                                        alt={sub.productName}
                                        className="w-16 h-16 rounded-lg object-contain p-1 bg-[var(--theme-border-light)]"
                                    />
                                    <div>
                                        <h3 className={`font-bold text-lg ${themeClasses.text.primary}`}>{sub.productName}</h3>
                                        <p className={`text-sm ${themeClasses.text.muted}`}>
                                            시작일: <span className={`font-medium ${themeClasses.text.primary}`}>{sub.startDate}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block mb-2 ${themeClasses.badge.secondary}`}>
                                        이용중
                                    </span>
                                    <p className={`font-bold ${themeClasses.text.primary}`}>{sub.price?.toLocaleString()}원</p>
                                </div>
                            </div>
                        ))}

                        {inactiveSubscriptions.length > 0 && (
                            <>
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-[var(--theme-border-light)]"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className={`px-2 text-sm ${themeClasses.bg.base} ${themeClasses.text.muted}`}>
                                            해지된 구독
                                        </span>
                                    </div>
                                </div>

                                {inactiveSubscriptions.map(sub => (
                                    <div
                                        key={sub.subscriptionId}
                                        onClick={() => navigate(`/subscription/${sub.subscriptionId}`)}
                                        className={`p-5 flex items-center justify-between cursor-pointer relative z-10 ${themeClasses.card.base} opacity-70 hover:opacity-100 transition-opacity`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <img
                                                src={getProductIconUrl(sub.productImage) || '/placeholder.png'}
                                                alt={sub.productName}
                                                className="w-16 h-16 rounded-lg object-contain p-1 bg-[var(--theme-border-light)] grayscale"
                                            />
                                            <div>
                                                <h3 className={`font-bold text-lg ${themeClasses.text.primary}`}>{sub.productName}</h3>
                                                <p className={`text-sm ${themeClasses.text.muted}`}>
                                                    시작일: <span className={`font-medium ${themeClasses.text.primary}`}>{sub.startDate}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block mb-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                                                해지됨
                                            </span>
                                            <p className={`font-bold ${themeClasses.text.primary}`}>{sub.price?.toLocaleString()}원</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetSubscriptionList;
