import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, CalendarPlus, Sparkles, LayoutGrid, Bell, Users, Lightbulb } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import UpdateProductModal from '../../components/product/UpdateProductModal';
import { useThemeStore } from '@/store/themeStore';
import { getProductIconUrl } from '@/utils/imageUtils';

// 테마별 스타일
const getProductThemeStyles = {
    default: {
        spinnerBorder: 'border-indigo-600',
        cardShadow: 'shadow-2xl',
        sparklesIcon: 'text-indigo-500',
        benefitIcon1: 'bg-indigo-50 text-indigo-600',
        focusRing: 'focus:ring-indigo-500',
        headerBg: 'bg-purple-50',
        blurCircle1: 'bg-purple-200',
        blurCircle2: 'bg-pink-200',
    },
    christmas: {
        spinnerBorder: 'border-[#c41e3a]',
        cardShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        sparklesIcon: 'text-[#c41e3a]',
        benefitIcon1: 'bg-red-50 text-[#c41e3a]',
        focusRing: 'focus:ring-[#c41e3a]',
        headerBg: 'bg-red-50',
        blurCircle1: 'bg-red-200',
        blurCircle2: 'bg-green-200',
    },
    pop: {
        spinnerBorder: 'border-pink-500',
        cardShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        sparklesIcon: 'text-pink-500',
        benefitIcon1: 'bg-pink-50 text-pink-500',
        focusRing: 'focus:ring-pink-500',
        headerBg: 'bg-pink-50',
        blurCircle1: 'bg-pink-200',
        blurCircle2: 'bg-cyan-200',
    },
};

const GetProduct = () => {
    const { theme } = useThemeStore();
    const themeStyle = getProductThemeStyles[theme] || getProductThemeStyles.default;

    // 테마별 accent 색상
    const accent = theme === 'christmas' ? '#c41e3a'
        : theme === 'pop' ? '#ec4899'
        : theme === 'dark' ? '#635bff'
        : '#635bff';

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await httpClient.get(`/product/${id}`);
            if (response.success) {
                setProduct(response.data);
            } else {
                throw new Error(response.error?.message || "Failed to fetch product");
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
            alert("상품 정보를 불러오는데 실패했습니다.");
            navigate('/product');
        } finally {
            setLoading(false);
        }
    };

    // 비로그인 사용자 접근 차단
    useEffect(() => {
        if (!user) {
            alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user) {
            fetchProduct();
        }
    }, [id, navigate, user]);

    const handleSubscribe = () => {
        // 구독 등록 로직 (추후 구현)
        navigate(`/subscription/add/${id}?startDate=${startDate}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-transparent relative z-10">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-theme overflow-hidden border border-theme-border">
                {/* Header Section (Horizontal Layout with Gradient) */}
                <div className={`${themeStyle.headerBg} p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden`}>
                    {/* Blur Circles */}
                    <div className={`absolute top-0 left-0 w-32 h-32 ${themeStyle.blurCircle1} rounded-full filter blur-3xl opacity-50 -ml-10 -mt-10`}></div>
                    <div className={`absolute bottom-0 right-0 w-32 h-32 ${themeStyle.blurCircle2} rounded-full filter blur-3xl opacity-50 -mr-10 -mb-10`}></div>

                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0">
                        {product.image ? (
                            <img
                                src={getProductIconUrl(product.image)}
                                alt={product.productName}
                                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl shadow-lg object-cover bg-white"
                            />
                        ) : (
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white shadow-lg flex items-center justify-center text-gray-400">
                                No Img
                            </div>
                        )}
                    </div>

                        {/* Title + Category + Price */}
                        <div className="relative z-10 text-center md:text-left flex-1">
                            <h1 className={`text-2xl md:text-3xl font-extrabold leading-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                {product.productName}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{
                                    color: accent,
                                    backgroundColor: `${accent}20`
                                }}>
                                    {product.categoryName || '구독'}
                                </span>
                                {product.productStatus === 'INACTIVE' && (
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${theme === 'dark'
                                            ? 'text-gray-400 bg-gray-700'
                                            : 'text-gray-600 bg-gray-100'
                                        }`}>
                                        판매중지
                                    </span>
                                )}
                                <span className={`font-extrabold text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                    ₩{product.price?.toLocaleString()}
                                    <span className={`text-sm font-normal ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>/월</span>
                                </span>
                            </div>
                        </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                        {/* Description */}
                        {product.description && (
                            <div className="mb-8">
                                <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-stone-600'}`}>
                                    {product.description}
                                </p>
                            </div>
                        )}

                    {/* MoA 구독 관리 혜택 */}
                    <div className="mb-8">
                        <h3 className="font-bold text-theme-text mb-6 flex items-center gap-2 text-base">
                            <Sparkles className="w-5 h-5 text-theme-primary" /> MoA 구독 관리 혜택
                        </h3>
                        <div className="space-y-5">
                            {[
                                {
                                    icon: LayoutGrid,
                                    color: 'bg-theme-primary-light text-theme-primary',
                                    title: "1. 모든 구독을 한눈에 정리하세요",
                                    desc: "흩어진 구독을 한 곳에서 확인하고 더 쉽고 편하게 관리할 수 있어요."
                                },
                                {
                                    icon: Bell,
                                    color: 'bg-rose-50 text-rose-600',
                                    title: "2. 매달 빠져나가는 구독비, 미리 대비하세요",
                                    desc: "결제일을 자동으로 알려주어 불필요한 지출을 막아줘요."
                                },
                                {
                                    icon: Users,
                                    color: 'bg-orange-50 text-orange-600',
                                    title: "3. 가족의 구독도 함께 관리하는 패밀리 센터",
                                    desc: "가족이 어떤 서비스에 가입했는지 쉽고 투명하게 관리하세요."
                                },
                                {
                                    icon: Lightbulb,
                                    color: 'bg-yellow-50 text-yellow-600',
                                    title: "4. 꼭 필요한 구독만 남기는 똑똑한 소비 도우미",
                                    desc: "활용도가 낮은 구독을 알려줘서 해지·유지 판단을 도와줘요."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-theme-text leading-tight mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-theme-text-muted leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 구독 시작일 선택 (일반 사용자만) */}
                    {user?.role !== 'ADMIN' && (
                        <div className="mb-8 pt-6 border-t border-theme-border">
                            <label className="block text-sm font-bold text-theme-text mb-3">
                                구독 시작일 (결제일) 지정
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-theme-bg-input border border-theme-border rounded-xl focus:ring-2 focus:ring-theme-focus-ring focus:border-transparent font-medium text-theme-text"
                                />
                            </div>
                        </div>
                    )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            {user?.role === 'ADMIN' ? (
                                <>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className={`flex-1 py-3.5 rounded-xl font-bold transition-colors ${theme === 'dark'
                                                ? 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700'
                                                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                                            }`}
                                    >
                                        수정하기
                                    </button>
                                    <button
                                        onClick={() => navigate(`/product/${id}/delete`)}
                                        className={`flex-1 py-3.5 rounded-xl font-bold transition-colors ${theme === 'dark'
                                                ? 'bg-red-900/30 border border-red-700 text-red-400 hover:bg-red-900/50'
                                                : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                                            }`}
                                    >
                                        삭제하기
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/product')}
                                        className={`flex-1 py-3.5 rounded-xl font-bold transition-colors ${theme === 'dark'
                                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        뒤로가기
                                    </button>
                                    <button
                                        onClick={handleSubscribe}
                                        className="flex-[2] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                        style={{
                                            backgroundColor: accent,
                                            boxShadow: `0 10px 15px -3px ${accent}33`
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
                                        onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                                    >
                                        <CalendarPlus className="w-5 h-5" />
                                        구독 일정에 등록
                                    </button>
                                </>
                            )}
                        </div>
                </div>
            </div>

            {/* Update Product Modal */}
            <UpdateProductModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                productId={id}
                initialData={product}
                onSuccess={() => {
                    navigate('/product');
                }}
            />
          </div>
        </div>
    );
};

export default GetProduct;
