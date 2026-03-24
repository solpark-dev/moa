import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Plus, Sparkles, Shield, CreditCard, Heart, Star } from "lucide-react";
import httpClient from "../../api/httpClient";
import { getProductIconUrl } from "@/utils/imageUtils";

/**
 * Portrait.so Style Landing Page v2 - Glassmorphism Edition
 *
 * - 글래스모피즘 디자인 (반투명 배경 + 블러 효과)
 * - 한국어 구독 서비스 통합 관리 시스템
 * - 아기자기한 파스텔 색감 + 유리 질감
 * - 패럴렉스 스크롤: 흩어진 카드 → 모여서 섹션 구성
 */

export default function LandingPageZPortraitV2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF] text-[#3d3d3d] font-['Pretendard',-apple-system,BlinkMacSystemFont,system-ui,sans-serif]">
      {/* Enhanced gradient background with animated orbs */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none -z-10 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(255, 181, 197, 0.6) 0%, transparent 70%)",
            top: "-20%",
            left: "10%",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(197, 181, 255, 0.5) 0%, transparent 70%)",
            top: "30%",
            right: "5%",
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(181, 212, 255, 0.4) 0%, transparent 70%)",
            bottom: "-10%",
            left: "20%",
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 60, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Navigation />
      <ParallaxHero />
      <StatementSection />
      <ComparisonSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}

// ============================================
// Navigation - Glassmorphism
// ============================================
const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-pink-100/20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFB5C5] to-[#B5D4FF] flex items-center justify-center shadow-lg shadow-pink-200/50">
            <span className="text-white font-bold text-sm">모아</span>
          </div>
          <span className="font-bold text-lg text-[#5a5a5a]">MoA</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm text-[#888] hover:text-[#5a5a5a] transition-colors">홈</a>
          <Link to="/party" className="text-sm text-[#888] hover:text-[#5a5a5a] transition-colors">파티 찾기</Link>
          <a href="#pricing" className="text-sm text-[#888] hover:text-[#5a5a5a] transition-colors">요금</a>
          <a href="#faq" className="text-sm text-[#888] hover:text-[#5a5a5a] transition-colors">자주 묻는 질문</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-[#888] hover:text-[#5a5a5a] transition-colors px-3 py-2">
            로그인
          </Link>
          <Link to="/signup">
            <button className="text-sm font-medium text-white bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90 px-5 py-2.5 rounded-full transition-all shadow-lg shadow-pink-300/40 hover:shadow-xl hover:shadow-pink-300/50">
              시작하기
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// Parallax Hero - 카드들이 자동으로 날아와서 모임 (Glassmorphism)
// ============================================
const ParallaxHero = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const desktopCardsRef = useRef(null);
  const mobileCardsRef = useRef(null);

  // 히어로 섹션이 보일 때 감지
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  // 섹션(타이틀) 감지: 30% (먼저 뜸)
  const isCardsInView = useInView(cardsRef, { once: false, amount: 0.3 });
  // 카드 감지: 60% (나중에 뜸)
  const isDesktopCardsInView = useInView(desktopCardsRef, { once: false, amount: 0.6 });
  const isMobileCardsInView = useInView(mobileCardsRef, { once: false, amount: 0.6 });

  // 파스텔 색상 배열
  const pastelColors = [
    { bgColor: "from-[#FFD4DC]/80 to-[#FFBDC9]/80", iconBg: "bg-[#FF9AAD]" },
    { bgColor: "from-[#D4E4FF]/80 to-[#B5D4FF]/80", iconBg: "bg-[#8BB8FF]" },
    { bgColor: "from-[#FFE4D4]/80 to-[#FFD4BD]/80", iconBg: "bg-[#FFB899]" },
    { bgColor: "from-[#D4FFE4]/80 to-[#B5FFCD]/80", iconBg: "bg-[#7DDFAA]" },
    { bgColor: "from-[#E4D4FF]/80 to-[#D4BDFF]/80", iconBg: "bg-[#B899FF]" },
    { bgColor: "from-[#FFF4D4]/80 to-[#FFE9B5]/80", iconBg: "bg-[#FFD666]" },
    { bgColor: "from-[#D4FFF4]/80 to-[#B5FFE9]/80", iconBg: "bg-[#66D6AA]" },
    { bgColor: "from-[#FFD4F4]/80 to-[#FFBDE9]/80", iconBg: "bg-[#FF99DD]" },
  ];

  // API에서 상품 데이터 가져오기
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await httpClient.get('/product');
        if (response.success && response.data) {
          // ACTIVE 상품만 필터링 후 랜덤으로 6개 선택
          const activeProducts = response.data.filter(p => p.productStatus === 'ACTIVE');
          const shuffled = [...activeProducts].sort(() => Math.random() - 0.5);
          const selected = shuffled.slice(0, 6);

          // 카드 데이터로 변환
          const cardData = selected.map((product, index) => ({
            id: product.productId,
            name: product.productName,
            category: product.categoryName || '구독',
            price: `${product.price?.toLocaleString()}원`,
            image: product.image,
            ...pastelColors[index % pastelColors.length]
          }));

          setCards(cardData);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // 흩어진 위치 (초기)
  const scatterPositions = [
    { x: -320, y: -180, rotate: -12, scale: 0.9 },
    { x: 320, y: -160, rotate: 15, scale: 0.85 },
    { x: -380, y: 80, rotate: 8, scale: 0.88 },
    { x: 360, y: 100, rotate: -10, scale: 0.92 },
    { x: -200, y: 220, rotate: 18, scale: 0.86 },
    { x: 200, y: 240, rotate: -15, scale: 0.9 },
  ];

  // 모인 그리드 위치 (최종)
  const gridPositions = [
    { x: -200, y: -90, rotate: 0, scale: 1 },
    { x: 0, y: -90, rotate: 0, scale: 1 },
    { x: 200, y: -90, rotate: 0, scale: 1 },
    { x: -200, y: 100, rotate: 0, scale: 1 },
    { x: 0, y: 100, rotate: 0, scale: 1 },
    { x: 200, y: 100, rotate: 0, scale: 1 },
  ];

  return (
    <>
      {/* 히어로 섹션 */}
      <section ref={heroRef} className="relative pt-40 pb-10 flex flex-col items-center justify-center overflow-hidden px-6">
        {/* 메인 헤드라인 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/80 text-sm text-[#888] mb-6 shadow-lg shadow-pink-100/30"
          >
            <Sparkles size={14} className="text-[#FFB5C5]" />
            <span>구독료, 이제 똑똑하게 나눠요</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.2] tracking-tight mb-6"
          >
            모든 구독을
            <br />
            <span className="bg-gradient-to-r from-[#FFB5C5] via-[#C5B5FF] to-[#B5D4FF] bg-clip-text text-transparent">
              하나로 모아
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base md:text-lg text-[#888] max-w-md mx-auto mb-8"
          >
            넷플릭스, 디즈니+, 유튜브 프리미엄까지
            <br />
            함께 나누면 최대 75% 절약할 수 있어요
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/signup">
              <button className="px-8 py-3.5 bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90 text-white rounded-full text-base font-medium transition-all shadow-2xl shadow-pink-300/50 hover:shadow-pink-400/60 hover:scale-105 duration-300">
                무료로 시작하기
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* 스크롤 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          // [수정 전]: className="absolute bottom-0 left-1/2 -translate-x-1/2"
          // [수정 후]: absolute 등을 지우고 mt-24 (약 96px) 정도로 여백을 줍니다.
          className="mt-24 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[#aaa] text-sm flex flex-col items-center gap-2"
          >
            <span className="text-3xl md:text-4xl font-light">↓</span>
          </motion.div>
        </motion.div>
      </section>

      {/* 카드 그리드 섹션 */}
      {/* min-h-screen, justify-center 제거해서 위로 붙임 */}
      <section ref={cardsRef} className="relative flex flex-col items-center overflow-hidden px-6 pt-10 pb-20">
        {/* 섹션 타이틀 - 카드보다 먼저 나타남 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 md:mb-32 z-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a4a4a]">
            지금 인기 있는 파티
          </h2>
          <p className="text-sm md:text-base text-[#888] mt-3">원하는 서비스를 골라 바로 참여하세요</p>
        </motion.div>

        {/* 날아오는 카드들 - 데스크탑: 절대 위치, 모바일: 그리드 */}
        {/* 데스크탑 버전 (md 이상) */}
        <div ref={desktopCardsRef} className="hidden md:flex relative w-full max-w-5xl h-[500px] items-center justify-center">
          {cards.map((card, index) => {
            const scatter = scatterPositions[index];
            const grid = gridPositions[index];

            return (
              <motion.div
                key={card.id}
                initial={{
                  x: scatter.x,
                  y: scatter.y,
                  rotate: scatter.rotate,
                  scale: scatter.scale,
                  opacity: 0
                }}
                animate={isDesktopCardsInView ? {
                  x: grid.x,
                  y: grid.y,
                  rotate: grid.rotate,
                  scale: grid.scale,
                  opacity: 1
                } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + index * 0.1,
                  ease: [0.4, 0.0, 0.2, 1]
                }}
                className="absolute"
              >
                <div className={`w-[180px] rounded-2xl bg-gradient-to-br ${card.bgColor} backdrop-blur-lg shadow-xl border border-white/60 hover:border-white/80 transition-all duration-300 hover:shadow-2xl overflow-hidden`}>
                  {/* 상단 로고 이미지 */}
                  <div className="w-full h-20 bg-white/40 flex items-center justify-center">
                    {card.image ? (
                      <img
                        src={getProductIconUrl(card.image)}
                        alt={card.name}
                        className="max-w-[70%] max-h-[70%] object-contain"
                      />
                    ) : (
                      <span className="text-3xl">
                        {card.category === "영상" ? "📺" : card.category === "음악" ? "🎵" : "📦"}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    {/* 아이콘 + 서비스명 */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center shadow-md overflow-hidden flex-shrink-0`}>
                        {card.image ? (
                          <img
                            src={getProductIconUrl(card.image)}
                            alt={card.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm">📦</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-[#4a4a4a] text-sm truncate">{card.name}</h3>
                    </div>

                    {/* 요금제 */}
                    <div>
                      <p className="text-lg font-bold text-[#4a4a4a]">{card.price}</p>
                      <p className="text-[10px] text-[#aaa]">요금제</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 모바일 버전 (md 미만) - 2열 3행 그리드 */}
        <div ref={mobileCardsRef} className="md:hidden grid grid-cols-2 gap-4 w-full max-w-[360px] mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isMobileCardsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.1,
                ease: [0.4, 0.0, 0.2, 1]
              }}
            >
              <div className={`w-full rounded-2xl bg-gradient-to-br ${card.bgColor} backdrop-blur-lg shadow-xl border border-white/60 hover:border-white/80 transition-all duration-300 hover:shadow-2xl overflow-hidden`}>
                {/* 상단 로고 이미지 */}
                <div className="w-full h-20 bg-white/40 flex items-center justify-center">
                  {card.image ? (
                    <img
                      src={getProductIconUrl(card.image)}
                      alt={card.name}
                      className="max-w-[70%] max-h-[70%] object-contain"
                    />
                  ) : (
                    <span className="text-3xl">
                      {card.category === "영상" ? "📺" : card.category === "음악" ? "🎵" : "📦"}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  {/* 아이콘 + 서비스명 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center shadow-md overflow-hidden flex-shrink-0`}>
                      {card.image ? (
                        <img
                          src={getProductIconUrl(card.image)}
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm">📦</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[#4a4a4a] text-sm truncate">{card.name}</h3>
                  </div>

                  {/* 요금제 */}
                  <div>
                    <p className="text-lg font-bold text-[#4a4a4a]">{card.price}</p>
                    <p className="text-[10px] text-[#aaa]">요금제</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

// ============================================
// Statement Section - Glassmorphism
// ============================================
const StatementSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-2xl">
          <p className="text-[24px] md:text-[32px] lg:text-[40px] font-bold leading-[1.4] text-[#4a4a4a]">
            매달 나가는 구독료,
            <br />
            혼자 다 내고 계셨나요?
            <br />
            <span className="text-[#aaa]">이제 함께 나눠요.</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

// ============================================
// Comparison Section - Glassmorphism
// ============================================
const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#4a4a4a] mb-3">
            얼마나 절약할 수 있을까요?
          </h2>
          <p className="text-[#888]">같은 서비스, 다른 가격</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 혼자 결제 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/30 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/50 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="w-16 h-16 bg-[#FFE4E4]/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/40">
              <span className="text-2xl">😢</span>
            </div>
            <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">혼자 결제하면</h3>
            <p className="text-sm text-[#888] mb-6">정가 그대로, 매달 부담</p>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ddd] to-[#ccc] shadow-inner" />
            </div>
            <p className="text-3xl font-bold text-[#FF8A8A]">월 17,000원</p>
            <p className="text-xs text-[#aaa] mt-2">넷플릭스 프리미엄 기준</p>
          </motion.div>

          {/* 모아에서 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-[#FFF5F7]/60 to-[#F5F0FF]/60 backdrop-blur-xl rounded-3xl p-8 text-center border-2 border-white/70 shadow-2xl hover:shadow-pink-200/50 transition-shadow duration-300"
          >
            <div className="w-16 h-16 bg-[#FFD4DC]/70 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/60 shadow-lg">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">모아에서 나누면</h3>
            <p className="text-sm text-[#888] mb-6">똑같은 서비스, 저렴한 가격</p>
            <div className="flex justify-center -space-x-2 mb-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-3 border-white shadow-lg backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${['#FFD4DC', '#D4E4FF', '#FFE4D4', '#D4FFE4'][i]} 0%, ${['#FFBDC9', '#B5D4FF', '#FFD4BD', '#B5FFCD'][i]} 100%)`
                  }}
                />
              ))}
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] bg-clip-text text-transparent">
              월 4,250원
            </p>
            <p className="text-xs text-[#aaa] mt-2">
              <span className="text-[#7DDFAA] font-medium">75% 절약!</span> 4명이서 나누기
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// How It Works Section - Glassmorphism
// ============================================
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "1",
      title: "파티 찾기",
      description: "원하는 구독 서비스의 파티를 찾아보세요",
      emoji: "🔍",
      color: "from-[#FFD4DC]/70 to-[#FFBDC9]/70"
    },
    {
      number: "2",
      title: "안전하게 가입",
      description: "보증금 시스템으로 안심하고 가입해요",
      emoji: "🛡️",
      color: "from-[#D4E4FF]/70 to-[#B5D4FF]/70"
    },
    {
      number: "3",
      title: "바로 이용",
      description: "가입 즉시 프리미엄 서비스를 이용하세요",
      emoji: "✨",
      color: "from-[#E4D4FF]/70 to-[#D4BDFF]/70"
    }
  ];

  return (
    <section ref={ref} className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#4a4a4a] mb-3">
            시작은 간단해요
          </h2>
          <p className="text-[#888]">3단계면 끝!</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} backdrop-blur-lg flex items-center justify-center mx-auto mb-5 text-3xl shadow-xl border border-white/50`}>
                {step.emoji}
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/50 backdrop-blur-sm text-xs font-medium text-[#888] mb-3 border border-white/40">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">{step.title}</h3>
              <p className="text-sm text-[#888]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// Features Section - Glassmorphism
// ============================================
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Shield,
      title: "안전한 보증금",
      description: "에스크로 방식으로 먹튀 걱정 없어요",
      color: "text-[#FFB5C5]",
      bg: "from-[#FFF5F7]/50 to-[#FFF5F7]/30"
    },
    {
      icon: CreditCard,
      title: "자동 정산",
      description: "매달 귀찮은 송금 없이 자동으로!",
      color: "text-[#B5D4FF]",
      bg: "from-[#F5F8FF]/50 to-[#F5F8FF]/30"
    },
    {
      icon: Heart,
      title: "수수료 0원",
      description: "플랫폼 수수료 없이 이용하세요",
      color: "text-[#C5B5FF]",
      bg: "from-[#F8F5FF]/50 to-[#F8F5FF]/30"
    }
  ];

  return (
    <section ref={ref} className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#4a4a4a] mb-3">
            왜 모아일까요?
          </h2>
          <p className="text-[#888]">안전하고 편리한 구독 공유</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${feature.bg} backdrop-blur-xl rounded-2xl p-6 text-center border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <div className={`w-12 h-12 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/40 shadow-lg`}>
                <feature.icon className={feature.color} size={24} />
              </div>
              <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#888]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// Pricing Section - Glassmorphism
// ============================================
const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    { name: "넷플릭스 프리미엄", original: "17,000", party: "4,250", save: "75%" },
    { name: "디즈니+", original: "9,900", party: "2,475", save: "75%" },
    { name: "유튜브 프리미엄", original: "14,900", party: "2,980", save: "80%" },
    { name: "스포티파이 패밀리", original: "16,350", party: "2,725", save: "83%" },
    { name: "웨이브 프리미엄", original: "13,900", party: "3,475", save: "75%" },
  ];

  return (
    <section ref={ref} id="pricing" className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#4a4a4a] mb-3">
            이만큼 절약돼요
          </h2>
          <p className="text-[#888]">프리미엄 서비스를 저렴하게</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden shadow-2xl"
        >
          {services.map((service, index) => (
            <div
              key={service.name}
              className={`flex items-center justify-between p-4 hover:bg-white/30 transition-colors ${index !== services.length - 1 ? "border-b border-white/30" : ""
                }`}
            >
              <span className="font-medium text-[#4a4a4a] text-sm">{service.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#bbb] line-through text-xs">₩{service.original}</span>
                <span className="font-semibold text-[#4a4a4a]">₩{service.party}</span>
                <span className="text-xs font-medium text-[#7DDFAA] bg-[#E8FFF0]/80 backdrop-blur-sm px-2 py-1 rounded-full border border-white/40">
                  -{service.save}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        <p className="text-center text-xs text-[#aaa] mt-4">
          * 4인 파티 기준 1인당 예상 금액이에요
        </p>
      </div>
    </section>
  );
};

// ============================================
// FAQ Section - Glassmorphism
// ============================================
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/30">
      <button onClick={onClick} className="w-full py-5 flex items-center justify-between text-left hover:bg-white/10 px-2 rounded-lg transition-colors">
        <span className="font-medium text-[#4a4a4a] pr-8 text-sm">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <Plus size={18} className="text-[#aaa]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 px-2 text-[#888] text-sm leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "파티에 가입하면 어떻게 서비스를 이용하나요?",
      answer: "파티에 가입하시면 파티장이 공유한 계정 정보를 통해 서비스를 이용하실 수 있어요. 대부분의 서비스는 가족 요금제나 프로필 공유 기능을 제공하므로, 각자의 프로필로 독립적으로 이용 가능합니다."
    },
    {
      question: "먹튀가 걱정되는데 안전한가요?",
      answer: "네! 모아는 에스크로 방식의 보증금 시스템을 운영해요. 파티장과 파티원 모두 보증금을 예치하며, 문제 발생 시 즉시 보상 처리됩니다."
    },
    {
      question: "결제는 어떻게 이루어지나요?",
      answer: "매월 설정한 결제일에 자동으로 결제돼요. 파티원은 분담금이 결제되고, 파티장은 수수료 없이 정산받습니다."
    },
    {
      question: "파티를 중간에 나갈 수 있나요?",
      answer: "네, 언제든 파티를 탈퇴할 수 있어요. 다음 결제일 7일 전까지 탈퇴 신청하시면 보증금은 전액 환불됩니다."
    },
  ];

  return (
    <section ref={ref} id="faq" className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#4a4a4a]">
            자주 묻는 질문
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 px-6 shadow-2xl"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// CTA Section - Glassmorphism
// ============================================
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto text-center"
      >
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFD4DC] to-[#D4E4FF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Star className="text-white" size={28} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#4a4a4a] mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-[#888] mb-8">
            가입은 30초면 끝나요.
            <br />
            첫 달은 무료로 체험해보세요!
          </p>
          <Link to="/signup">
            <button className="px-10 py-4 bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90 text-white rounded-full text-base font-medium transition-all shadow-2xl shadow-pink-300/50 hover:shadow-pink-400/60 hover:scale-105 duration-300">
              무료로 시작하기
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

// ============================================
// Footer - Glassmorphism
// ============================================
const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/40">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFB5C5] to-[#B5D4FF] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs">모아</span>
              </div>
              <span className="font-semibold text-[#5a5a5a]">MoA</span>
            </div>
            <p className="text-xs text-[#aaa] leading-relaxed">
              모든 구독 서비스를
              <br />
              하나로 모아 관리하세요.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-[#5a5a5a] mb-3 text-sm">서비스</h4>
            <ul className="space-y-2 text-xs text-[#888]">
              <li><Link to="/party" className="hover:text-[#5a5a5a]">파티 찾기</Link></li>
              <li><a href="#pricing" className="hover:text-[#5a5a5a]">요금 안내</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[#5a5a5a] mb-3 text-sm">고객지원</h4>
            <ul className="space-y-2 text-xs text-[#888]">
              <li><a href="#faq" className="hover:text-[#5a5a5a]">자주 묻는 질문</a></li>
              <li><Link to="/support" className="hover:text-[#5a5a5a]">문의하기</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[#5a5a5a] mb-3 text-sm">법적 고지</h4>
            <ul className="space-y-2 text-xs text-[#888]">
              <li><Link to="/terms" className="hover:text-[#5a5a5a]">이용약관</Link></li>
              <li><Link to="/privacy" className="hover:text-[#5a5a5a]">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/30 text-center text-xs text-[#aaa]">
          © 2025 MoA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
