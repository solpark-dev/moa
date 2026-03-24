import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Coffee, X, Calendar, CalendarPlus, Sparkles, LayoutGrid, Bell, Users, Lightbulb, AlertTriangle, ArrowRight, List } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import AddSubscriptionModal from '../../components/subscription/AddSubscriptionModal';
import AddProductModal from '../../components/product/AddProductModal';
import UpdateProductModal from '../../components/product/UpdateProductModal';
import { useThemeStore } from '@/store/themeStore';
import { ChristmasBackground } from '@/config/themeConfig';
import { getProductIconUrl } from '@/utils/imageUtils';

// Theme-based styles
const getThemeStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        bg: 'bg-transparent',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-[2rem] shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
        cardHover: 'hover:border-[#c41e3a]/30 hover:shadow-[0_25px_50px_-12px_rgba(196,30,58,0.2)]',
        searchBg: 'bg-white/90 backdrop-blur-sm border border-gray-200',
        inputBg: 'bg-gray-50/80',
        inputFocus: 'focus:ring-[#c41e3a]/20 focus:bg-white',
        filterActive: 'bg-[#c41e3a]/10 text-[#c41e3a] ring-1 ring-[#c41e3a]/30',
        filterInactive: 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200',
        buttonPrimary: 'bg-[#c41e3a] hover:bg-[#a51830] text-white',
        buttonSecondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
        modalBg: 'bg-stone-200 backdrop-blur-sm',
        highlight: 'text-[#c41e3a]',
        priceBox: 'bg-gray-50/80 border-gray-100',
      };
    case 'dark':
      return {
        bg: 'bg-transparent',
        text: 'text-white',
        subtext: 'text-gray-400',
        cardBg: 'bg-[#1E293B]/90 backdrop-blur-sm border border-gray-700 rounded-[2rem] shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
        cardHover: 'hover:border-[#635bff]/30 hover:shadow-[0_25px_50px_-12px_rgba(99,91,255,0.2)]',
        searchBg: 'bg-[#1E293B]/90 backdrop-blur-sm border border-gray-700',
        inputBg: 'bg-[#0F172A]',
        inputFocus: 'focus:ring-[#635bff]/20 focus:bg-[#0F172A]',
        filterActive: 'bg-[#635bff]/10 text-[#635bff] ring-1 ring-[#635bff]/30',
        filterInactive: 'bg-[#0F172A] text-gray-400 hover:bg-gray-800 border border-gray-700',
        buttonPrimary: 'bg-[#635bff] hover:bg-[#5851e8] text-white',
        buttonSecondary: 'bg-[#1E293B] border border-gray-700 text-white hover:bg-gray-700',
        modalBg: 'bg-[#1E293B]',
        highlight: 'text-[#635bff]',
        priceBox: 'bg-[#0F172A]/80 border-gray-700',
      };
    case 'pop':
      return {
        bg: 'bg-transparent',
        text: 'text-black',
        subtext: 'text-gray-600',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-[2rem] shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        cardHover: 'hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]',
        searchBg: 'bg-white/90 backdrop-blur-sm border border-gray-200',
        inputBg: 'bg-gray-50',
        inputFocus: 'focus:ring-pink-500/20 focus:bg-white',
        filterActive: 'bg-pink-500 text-white border border-gray-200',
        filterInactive: 'bg-white text-black hover:bg-gray-50 border border-gray-200',
        buttonPrimary: 'bg-pink-500 hover:bg-pink-600 text-white border border-gray-200',
        buttonSecondary: 'bg-white border border-gray-200 text-black hover:bg-gray-50',
        modalBg: 'bg-white',
        highlight: 'text-pink-500',
        priceBox: 'bg-gray-50 border border-gray-200',
      };
    case 'classic':
      return {
        bg: 'bg-transparent',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-[2rem] shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
        cardHover: 'hover:border-[#635bff]/30 hover:shadow-[0_25px_50px_-12px_rgba(99,91,255,0.15)]',
        searchBg: 'bg-white/90 backdrop-blur-sm border border-gray-200',
        inputBg: 'bg-gray-50',
        inputFocus: 'focus:ring-[#635bff]/20 focus:bg-white',
        filterActive: 'bg-[#635bff]/10 text-[#635bff] ring-1 ring-[#635bff]/30',
        filterInactive: 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200',
        buttonPrimary: 'bg-[#635bff] hover:bg-[#5851e8] text-white',
        buttonSecondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
        modalBg: 'bg-white',
        highlight: 'text-[#635bff]',
        priceBox: 'bg-gray-50 border-gray-100',
      };
    default:
      return {
        bg: 'bg-transparent',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-stone-200 rounded-[2rem]',
        cardHover: 'hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10',
        searchBg: 'bg-white/90 backdrop-blur-sm border border-gray-200',
        inputBg: 'bg-gray-50',
        inputFocus: 'focus:ring-indigo-500/20 focus:bg-white',
        filterActive: 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200',
        filterInactive: 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200',
        buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        buttonSecondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
        modalBg: 'bg-white',
        highlight: 'text-indigo-600',
        priceBox: 'bg-stone-50/80 border-stone-100',
      };
  }
};

// ProductDetailModal 컴포넌트
const ProductDetailModal = ({ product, onClose, user, navigate, onSubscribe, onEdit, themeStyles, theme }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  if (!product) return null;

  const handleSubscribe = () => {
    onClose();
    onSubscribe({ productId: product.productId, startDate, endDate });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] overflow-y-auto animate-in fade-in duration-200">
      <div className="min-h-full flex items-start justify-center p-4 pt-24 pb-8">
        <div className={`${themeStyles.modalBg} w-full max-w-xl rounded-2xl relative flex flex-col animate-in zoom-in-95 duration-200 ${theme === 'pop' ? 'border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]' : 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'}`}>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full z-[50] ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-stone-100 hover:bg-stone-200'} transition-colors`}
          >
            <X className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-stone-500'}`} />
          </button>

          {/* Header Section */}
          <div className={`py-9 px-6 flex flex-row items-center gap-6 ${theme === 'dark' ? 'bg-[#1E293B]' : theme === 'christmas' ? 'bg-transparent' : 'bg-white'}`}>
            <div className="flex-shrink-0">
              {product.image ? (
                <img
                  src={getProductIconUrl(product.image)}
                  alt={product.productName}
                  className={`w-20 h-20 rounded-3xl shadow-lg object-cover ${theme === 'dark' ? 'bg-gray-700' : theme === 'christmas' ? 'bg-stone-100' : 'bg-white'}`}
                />
              ) : (
                <div className={`w-20 h-20 rounded-3xl shadow-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : theme === 'christmas' ? 'bg-stone-100 text-gray-400' : 'bg-white text-gray-400'}`}>
                  No Img
                </div>
              )}
            </div>

            <div>
              <h2 className={`text-2xl font-extrabold leading-tight ${themeStyles.text}`}>
                {product.productName}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${theme === 'christmas' ? 'bg-[#c41e3a]/10 text-[#c41e3a]' :
                    theme === 'dark' ? 'bg-[#635bff]/10 text-[#635bff]' :
                      theme === 'pop' ? 'bg-pink-100 text-pink-500' :
                        theme === 'classic' ? 'bg-[#635bff]/10 text-[#635bff]' :
                          'bg-indigo-100 text-indigo-600'
                  }`}>
                  {product.categoryName || '구독'}
                </span>
                {product.productStatus === 'INACTIVE' && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    판매중지
                  </span>
                )}
                <span className={`font-extrabold text-lg ${themeStyles.text}`}>
                  ₩{product.price?.toLocaleString()}
                  <span className={`text-xs font-normal ml-0.5 ${themeStyles.subtext}`}>/월</span>
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Description */}
            {product.description && (
              <div>
                <p className={`leading-relaxed ${themeStyles.subtext}`}>{product.description}</p>
              </div>
            )}

            {/* MoA 혜택 */}
            <div>
              <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${themeStyles.text}`}>
                <Sparkles className={`w-4 h-4 ${themeStyles.highlight}`} /> MoA 구독 관리 혜택
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: LayoutGrid,
                    title: "1. 모든 구독을 한눈에 정리하세요",
                    desc: "흩어진 구독을 한 곳에서 확인하고 더 쉽고 편하게 관리할 수 있어요."
                  },
                  {
                    icon: Bell,
                    title: "2. 매달 빠져나가는 구독비, 미리 대비하세요",
                    desc: "결제일을 자동으로 알려주어 불필요한 지출을 막아줘요."
                  },
                  {
                    icon: Users,
                    title: "3. 가족의 구독도 함께 관리하는 패밀리 센터",
                    desc: "가족이 어떤 서비스에 가입했는지 쉽고 투명하게 관리하세요."
                  },
                  {
                    icon: Lightbulb,
                    title: "4. 꼭 필요한 구독만 남기는 똑똑한 소비 도우미",
                    desc: "활용도가 낮은 구독을 알려줘서 해지·유지 판단을 도와줘요."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${theme === 'christmas' ? 'bg-[#c41e3a]/10 text-[#c41e3a]' :
                        theme === 'dark' ? 'bg-[#635bff]/10 text-[#635bff]' :
                          theme === 'pop' ? 'bg-pink-100 text-pink-500' :
                            theme === 'classic' ? 'bg-[#635bff]/10 text-[#635bff]' :
                              'bg-indigo-100 text-indigo-600'
                      }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold leading-tight ${themeStyles.text}`}>{item.title}</h4>
                      <p className={`text-xs leading-relaxed mt-1 ${themeStyles.subtext}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 구독 시작일 & 종료일 선택 (일반 사용자만) */}
            {user?.role !== 'ADMIN' && (
              <div className={`pt-4 border-t space-y-4 ${theme === 'dark' ? 'border-gray-700' : 'border-stone-100'}`}>
                {/* 시작일 */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${themeStyles.text}`}>
                    구독 시작일 (결제일) 지정
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${themeStyles.highlight}`} />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 border-none rounded-xl font-medium focus:ring-2 outline-none ${theme === 'christmas' ? 'bg-stone-100 text-gray-900 focus:ring-[#c41e3a]/30' :
                          theme === 'dark' ? 'bg-[#0F172A] text-white focus:ring-[#635bff]/30' :
                            theme === 'pop' ? 'bg-gray-50 text-gray-900 focus:ring-pink-300' :
                              theme === 'classic' ? 'bg-gray-50 text-gray-900 focus:ring-[#635bff]/30' :
                                'bg-gray-50 text-gray-900 focus:ring-indigo-300'
                        }`}
                    />
                  </div>
                </div>

                {/* 종료일 */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${themeStyles.text}`}>
                    구독 종료일 (선택사항)
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${themeStyles.highlight}`} />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      placeholder="종료일 미지정 시 계속 유지"
                      className={`w-full pl-11 pr-4 py-3 border-none rounded-xl font-medium focus:ring-2 outline-none ${theme === 'christmas' ? 'bg-stone-100 text-gray-900 focus:ring-[#c41e3a]/30' :
                          theme === 'dark' ? 'bg-[#0F172A] text-white focus:ring-[#635bff]/30' :
                            theme === 'pop' ? 'bg-gray-50 text-gray-900 focus:ring-pink-300' :
                              theme === 'classic' ? 'bg-gray-50 text-gray-900 focus:ring-[#635bff]/30' :
                                'bg-gray-50 text-gray-900 focus:ring-indigo-300'
                        }`}
                    />
                  </div>
                  <p className={`text-xs mt-1 ml-1 ${themeStyles.subtext}`}>미지정 시 자동 갱신으로 계속 유지됩니다</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className={`p-4 flex gap-3 ${theme === 'dark' ? 'bg-[#1E293B]' : theme === 'christmas' ? 'bg-transparent' : 'bg-white'}`}>
            {user?.role === 'ADMIN' ? (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit(product);
                  }}
                  className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${theme === 'christmas' ? 'bg-[#c41e3a]/10 text-[#c41e3a] hover:bg-[#c41e3a]/20' :
                      theme === 'dark' ? 'bg-[#635bff]/10 text-[#635bff] hover:bg-[#635bff]/20' :
                        theme === 'pop' ? 'bg-pink-100 text-pink-500 hover:bg-pink-200' :
                          theme === 'classic' ? 'bg-[#635bff]/10 text-[#635bff] hover:bg-[#635bff]/20' :
                            'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                    }`}
                >
                  수정하기
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/product/${product.productId}/delete`);
                  }}
                  className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${theme === 'dark' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' :
                      'bg-red-50 text-red-500 hover:bg-red-100'
                    }`}
                >
                  삭제하기
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${theme === 'christmas' ? 'bg-[#c41e3a]/10 text-[#c41e3a] hover:bg-[#c41e3a]/20' :
                      theme === 'dark' ? 'bg-[#635bff]/10 text-[#635bff] hover:bg-[#635bff]/20' :
                        theme === 'pop' ? 'bg-pink-100 text-pink-500 hover:bg-pink-200' :
                          theme === 'classic' ? 'bg-[#635bff]/10 text-[#635bff] hover:bg-[#635bff]/20' :
                            'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                    }`}
                >
                  취소
                </button>
                <button
                  onClick={handleSubscribe}
                  className={`flex-[2] py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${theme === 'christmas' ? 'bg-[#c41e3a] text-white hover:bg-[#a51830]' :
                      theme === 'dark' ? 'bg-[#635bff] text-white hover:bg-[#5851e8]' :
                        theme === 'pop' ? 'bg-pink-500 text-white hover:bg-pink-600' :
                          theme === 'classic' ? 'bg-[#635bff] text-white hover:bg-[#5851e8]' :
                            'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  <CalendarPlus className="w-5 h-5" />
                  구독 일정에 등록
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GetProductList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const themeStyles = getThemeStyles(theme);

  // Data States
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // Modal State
  const [viewingProduct, setViewingProduct] = useState(null);
  const [subscribingData, setSubscribingData] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productRes, categoryRes] = await Promise.all([
        httpClient.get('/product'),
        httpClient.get('/product/categorie')
      ]);

      if (productRes.success) {
        setAllProducts(productRes.data || []);
      }

      if (categoryRes.success) {
        setCategories(categoryRes.data || []);
      }

    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Initial Data
  useEffect(() => {
    fetchData();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = allProducts;

    if (selectedCategory !== '전체') {
      result = result.filter(p => p.categoryName === selectedCategory);
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(p =>
        p.productName?.toLowerCase().includes(keyword)
      );
    }

    setFilteredProducts(result);
  }, [searchKeyword, selectedCategory, allProducts]);




  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center relative z-10 ${themeStyles.bg}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-[#635bff]' : theme === 'christmas' ? 'border-[#c41e3a]' : theme === 'pop' ? 'border-pink-500' : 'border-[#635bff]'}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${themeStyles.bg}`}>
      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 md:pt-4 md:pb-12">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge with Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: -5 }}
              transition={{ duration: 0.5 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 shadow-md ${theme === 'dark' ? 'bg-[#635bff]/20 text-[#635bff] border border-[#635bff]/30' :
                  theme === 'christmas' ? 'bg-[#c41e3a]/10 text-[#c41e3a] border border-[#c41e3a]/20' :
                    theme === 'pop' ? 'bg-pink-100 text-pink-600 border border-pink-200' :
                      'bg-[#635bff]/10 text-[#635bff] border border-[#635bff]/20'
                }`}
            >
              <span className="text-base">✨</span>
              <span className="text-sm font-bold">
                {theme === 'christmas' ? '🎄 구독은 복잡하지 않게, 관리는 더 편하게' : '구독은 복잡하지 않게, 관리는 더 편하게'}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-4xl sm:text-5xl md:text-6xl font-black mb-8 tracking-tight leading-[1.1] ${themeStyles.text}`}
            >
              모든 구독을
              <br />
              <span className={`${theme === 'pop' ? 'text-pink-500' :
                  theme === 'christmas' ? 'bg-gradient-to-r from-[#c41e3a] to-[#1a5f2a] bg-clip-text text-transparent' :
                    theme === 'dark' ? 'bg-gradient-to-r from-[#635bff] via-[#00d4ff] to-[#00d4ff] bg-clip-text text-transparent' :
                      'bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent'
                }`}>
                한눈에!
              </span>
            </motion.h1>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Admin: 상품 등록 버튼 */}
              {user?.role === 'ADMIN' && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAddProductModalOpen(true)}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full shadow-lg transition-colors ${theme === 'christmas' ? 'bg-[#c41e3a] hover:bg-[#a51830] text-white shadow-[#c41e3a]/25' :
                      theme === 'dark' ? 'bg-[#635bff] hover:bg-[#5851e8] text-white shadow-[#635bff]/25' :
                        theme === 'pop' ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/25' :
                          'bg-[#635bff] hover:bg-[#5851e8] text-white shadow-[#635bff]/25'
                    }`}
                >
                  <Sparkles className="w-4 h-4" />
                  상품 등록
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}

              {/* User: 내 구독 목록 버튼 */}
              {user && user?.role !== 'ADMIN' && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/subscription')}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full shadow-lg transition-colors ${theme === 'christmas' ? 'bg-[#c41e3a] hover:bg-[#a51830] text-white shadow-[#c41e3a]/25' :
                      theme === 'dark' ? 'bg-[#635bff] hover:bg-[#5851e8] text-white shadow-[#635bff]/25' :
                        theme === 'pop' ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/25' :
                          'bg-[#635bff] hover:bg-[#5851e8] text-white shadow-[#635bff]/25'
                    }`}
                >
                  <List className="w-4 h-4" />
                  내 구독 목록
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Section */}
        <div className={`p-2 rounded-2xl shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between ${themeStyles.searchBg}`}>
          <div className="relative w-full flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${themeStyles.subtext}`} />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-3 py-2.5 border-none rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${themeStyles.inputBg} ${themeStyles.inputFocus} ${themeStyles.text}`}
              placeholder="서비스명 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto px-2 md:px-0 scrollbar-hide flex-shrink-0">
            <button
              onClick={() => setSelectedCategory('전체')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === '전체' ? themeStyles.filterActive : themeStyles.filterInactive
                }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() => setSelectedCategory(cat.categoryName)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.categoryName ? themeStyles.filterActive : themeStyles.filterInactive
                  }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-20 rounded-3xl ${theme === 'dark' ? 'bg-[#1E293B]' : 'bg-gray-50'}`}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${theme === 'christmas' ? 'bg-[#c41e3a]/10' :
                theme === 'pop' ? 'bg-pink-100' :
                  theme === 'dark' ? 'bg-[#635bff]/10' :
                    'bg-[#635bff]/10'
              }`}>
              <Search className={`w-10 h-10 ${themeStyles.highlight}`} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${themeStyles.text}`}>
              {searchKeyword ? `'${searchKeyword}' 검색 결과가 없습니다` : '등록된 구독 상품이 없습니다'}
            </h3>
            <p className={`${themeStyles.subtext}`}>
              다른 검색어나 카테고리를 시도해보세요
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative flex flex-col h-full p-6 overflow-hidden cursor-pointer ${themeStyles.cardBg} ${themeStyles.cardHover}`}
              >
                <div className="relative z-10 flex flex-col gap-4 h-full">
                  <div className="flex items-start gap-3">
                    <div className="relative w-[60px] h-[60px] flex-shrink-0">
                      {product.image ? (
                        <img
                          src={getProductIconUrl(product.image)}
                          alt={product.productName}
                          className={`w-full h-full rounded-xl object-cover shadow-sm ${theme === 'dark' ? 'border border-gray-700' : 'border border-stone-200'}`}
                        />
                      ) : (
                        <div className={`w-full h-full rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-stone-100 border border-stone-200'}`}>
                          <span className={`text-xs ${themeStyles.subtext}`}>No Img</span>
                        </div>
                      )}

                      {product.productStatus === 'INACTIVE' && (
                        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                          <span className="text-white text-xs font-bold">중지</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold mb-1 truncate ${themeStyles.text}`}>
                        {product.productName}
                      </h3>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-stone-100 text-stone-600'
                        }`}>
                        {product.categoryName || '구독'}
                      </span>
                    </div>
                  </div>

                  <div className={`rounded-2xl p-5 flex-1 border transition-colors backdrop-blur-sm ${themeStyles.priceBox} ${theme === 'dark' ? 'group-hover:bg-[#1E293B] group-hover:border-gray-600' : 'group-hover:bg-white group-hover:border-stone-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${themeStyles.subtext}`}>월 공식 구독료</span>
                      <span className={`text-xl font-bold ${themeStyles.text}`}>
                        ₩{product.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
                          navigate('/login');
                          return;
                        }
                        setViewingProduct(product);
                      }}
                      className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${themeStyles.buttonSecondary}`}
                    >
                      상세보기
                    </button>
                    {user?.role === 'ADMIN' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(product);
                        }}
                        className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${themeStyles.buttonPrimary}`}
                      >
                        상품관리
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) {
                            alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
                            navigate('/login');
                            return;
                          }
                          const today = new Date().toISOString().split('T')[0];
                          setSubscribingData({ productId: product.productId, startDate: today, endDate: '' });
                        }}
                        className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${themeStyles.buttonPrimary}`}
                      >
                        구독신청
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          user={user}
          navigate={navigate}
          onSubscribe={(data) => setSubscribingData(data)}
          onEdit={(product) => setEditingProduct(product)}
          themeStyles={themeStyles}
          theme={theme}
        />
      )}

      {/* Add Subscription Modal */}
      {subscribingData && (
        <AddSubscriptionModal
          productId={subscribingData.productId}
          startDate={subscribingData.startDate}
          endDate={subscribingData.endDate}
          onClose={() => setSubscribingData(null)}
          user={user}
          onSuccess={() => {
            // 구독 목록으로 이동할 수도 있음
            // navigate('/subscriptions');
          }}
        />
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSuccess={() => {
          fetchData(); // 목록 갱신
        }}
      />

      {/* Update Product Modal */}
      <UpdateProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        productId={editingProduct?.productId}
        initialData={editingProduct}
        onSuccess={() => {
          fetchData(); // 목록 갱신
        }}
      />
    </div>
  );
};

export default GetProductList;
