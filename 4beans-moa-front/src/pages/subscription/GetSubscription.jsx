import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Calendar, CreditCard, Settings, XCircle } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useThemeStore } from '@/store/themeStore';
import { ThemeSwitcher } from '@/config/themeConfig';
import { getProductIconUrl } from '@/utils/imageUtils';
import { themeClasses } from '@/utils/themeUtils';

const GetSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme, setTheme } = useThemeStore();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get(`/subscription/${id}`);
                // Fix: Handle direct DTO response (backend default)
                if (response && response.subscriptionId) {
                    setSubscription(response);
                } else if (response.success) {
                    setSubscription(response.data);
                } else {
                    throw new Error(response.error?.message || "Failed to fetch subscription");
                }
            } catch (error) {
                console.error("Failed to fetch subscription", error);
                alert("구독 정보를 불러오는데 실패했습니다.");
                navigate('/subscription');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-transparent`}>
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-[var(--theme-primary)] border-t-transparent"></div>
            </div>
        );
    }

    if (!subscription) return null;

    return (
        <div className="min-h-screen bg-transparent pb-20">
            {/* Theme Switcher */}
            <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

            {/* Hero Header */}
            <div className="relative overflow-hidden bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <button
                        onClick={() => navigate('/subscription')}
                        className={`flex items-center gap-2 ${themeClasses.text.muted} hover:text-[var(--theme-primary)] mb-6 transition-colors group`}
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">내 구독 목록</span>
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <img
                            src={getProductIconUrl(subscription.productImage) || '/placeholder.png'}
                            alt={subscription.productName}
                            className={`w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-lg border border-[var(--theme-border-light)]`}
                        />
                        <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-3`}>{subscription.productName}</h1>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${subscription.subscriptionStatus === 'ACTIVE'
                            ? themeClasses.badge.secondary
                            : 'bg-red-50 text-red-600'
                            }`}>
                            <Sparkles className="w-4 h-4" />
                            {subscription.subscriptionStatus === 'ACTIVE' ? '이용중' : '해지됨'}
                        </span>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${themeClasses.card.elevated} overflow-hidden relative z-10 transition-all`}
                >
                    <div className="p-8">
                        <div className="space-y-6">
                            <div className={`flex justify-between items-center py-4 border-b border-[var(--theme-border-light)]`}>
                                <div className={`flex items-center gap-3 ${themeClasses.text.muted}`}>
                                    <Calendar className="w-5 h-5 text-[var(--theme-primary)]" />
                                    시작일
                                </div>
                                <span className={`font-semibold ${themeClasses.text.primary}`}>{subscription.startDate}</span>
                            </div>
                            <div className={`flex justify-between items-center py-4 border-b border-[var(--theme-border-light)]`}>
                                <div className={`flex items-center gap-3 ${themeClasses.text.muted}`}>
                                    <Calendar className="w-5 h-5 text-[var(--theme-secondary)]" />
                                    다음 결제일 (종료일)
                                </div>
                                <span className={`font-semibold ${themeClasses.text.primary}`}>{subscription.endDate}</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <div className={`flex items-center gap-3 ${themeClasses.text.muted}`}>
                                    <CreditCard className="w-5 h-5 text-[var(--theme-primary)]" />
                                    결제 금액
                                </div>
                                <span className={`font-bold text-2xl text-[var(--theme-primary)]`}>{subscription.price?.toLocaleString()}원</span>
                            </div>
                        </div>

                        {subscription.subscriptionStatus === 'ACTIVE' && (
                            <div className="mt-10 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/subscription/${id}/edit`)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-bold transition-colors ${themeClasses.button.secondary}`}
                                >
                                    <Settings className="w-5 h-5" />
                                    옵션 변경
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/subscription/${id}/cancel`)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3.5 rounded-full font-bold hover:bg-red-100 transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                    구독 해지
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GetSubscription;
