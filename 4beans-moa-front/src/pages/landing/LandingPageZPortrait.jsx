import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Plus, Sparkles, Shield, CreditCard, Users, Heart, Star } from "lucide-react";

/**
 * Portrait.so Style Landing Page for MOA
 *
 * - 한국어 구독 서비스 통합 관리 시스템
 * - 아기자기한 파스텔 색감
 * - 패럴렉스 스크롤: 흩어진 카드 → 모여서 섹션 구성
 */

export default function LandingPageZPortrait() {
  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#3d3d3d] font-['Pretendard',-apple-system,BlinkMacSystemFont,system-ui,sans-serif]">
      {/* Soft gradient background */}
      <div
        className="fixed top-0 left-0 right-0 h-[100vh] pointer-events-none -z-10"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% -20%, rgba(255, 218, 225, 0.5) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255, 243, 207, 0.4) 0%, transparent 40%),
            radial-gradient(ellipse 80% 60% at 80% 10%, rgba(212, 230, 255, 0.4) 0%, transparent 40%),
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(230, 215, 255, 0.35) 0%, transparent 35%)
          `
        }}
      />

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
// Navigation
// ============================================
const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#f0e6dc]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFB5C5] to-[#B5D4FF] flex items-center justify-center shadow-sm">
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
            <button className="text-sm font-medium text-white bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90 px-5 py-2.5 rounded-full transition-opacity shadow-sm">
              시작하기
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// Parallax Hero - 카드들이 모여서 섹션 구성
// ============================================
const ParallaxHero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // 서비스 카드 데이터 (파스텔 색상)
  const cards = [
    {
      id: 1,
      name: "넷플릭스",
      category: "영상",
      price: "4,250원",
      members: "3/4",
      bgColor: "from-[#FFD4DC] to-[#FFBDC9]",
      iconBg: "bg-[#FF9AAD]"
    },
    {
      id: 2,
      name: "디즈니+",
      category: "영상",
      price: "2,475원",
      members: "2/4",
      bgColor: "from-[#D4E4FF] to-[#B5D4FF]",
      iconBg: "bg-[#8BB8FF]"
    },
    {
      id: 3,
      name: "유튜브 프리미엄",
      category: "영상",
      price: "2,980원",
      members: "4/5",
      bgColor: "from-[#FFE4D4] to-[#FFD4BD]",
      iconBg: "bg-[#FFB899]"
    },
    {
      id: 4,
      name: "스포티파이",
      category: "음악",
      price: "2,725원",
      members: "3/6",
      bgColor: "from-[#D4FFE4] to-[#B5FFCD]",
      iconBg: "bg-[#7DDFAA]"
    },
    {
      id: 5,
      name: "웨이브",
      category: "영상",
      price: "3,475원",
      members: "2/4",
      bgColor: "from-[#E4D4FF] to-[#D4BDFF]",
      iconBg: "bg-[#B899FF]"
    },
    {
      id: 6,
      name: "왓챠",
      category: "영상",
      price: "3,225원",
      members: "3/4",
      bgColor: "from-[#FFF4D4] to-[#FFE9B5]",
      iconBg: "bg-[#FFD666]"
    },
  ];

  // 흩어진 위치 (처음) -> 그리드 위치 (스크롤 후)
  const scatterPositions = [
    { x: -320, y: -180, rotate: -12, scale: 0.9 },
    { x: 320, y: -160, rotate: 15, scale: 0.85 },
    { x: -380, y: 80, rotate: 8, scale: 0.88 },
    { x: 360, y: 100, rotate: -10, scale: 0.92 },
    { x: -200, y: 220, rotate: 18, scale: 0.86 },
    { x: 200, y: 240, rotate: -15, scale: 0.9 },
  ];

  // 모인 그리드 위치 (3x2)
  const gridPositions = [
    { x: -200, y: -90, rotate: 0, scale: 1 },
    { x: 0, y: -90, rotate: 0, scale: 1 },
    { x: 200, y: -90, rotate: 0, scale: 1 },
    { x: -200, y: 100, rotate: 0, scale: 1 },
    { x: 0, y: 100, rotate: 0, scale: 1 },
    { x: 200, y: 100, rotate: 0, scale: 1 },
  ];

  // 전체 섹션 opacity
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 1, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.35, 0.5], [30, 0]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* 첫 화면: 헤드라인 + 흩어진 카드들 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 메인 헤드라인 - 스크롤 시 페이드아웃 */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
              y: useTransform(scrollYProgress, [0, 0.15], [0, -50])
            }}
            className="text-center z-10 px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#f0e6dc] text-sm text-[#888] mb-6"
            >
              <Sparkles size={14} className="text-[#FFB5C5]" />
              <span>구독료, 이제 똑똑하게 나눠요</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-base md:text-lg text-[#888] max-w-md mx-auto mb-8"
            >
              넷플릭스, 디즈니+, 유튜브 프리미엄까지
              <br />
              함께 나누면 최대 75% 절약할 수 있어요
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/signup">
                <button className="px-8 py-3.5 bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90 text-white rounded-full text-base font-medium transition-opacity shadow-lg shadow-pink-200/50">
                  무료로 시작하기
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* 플로팅 카드들 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {cards.map((card, index) => {
              const scatter = scatterPositions[index];
              const grid = gridPositions[index];

              const x = useTransform(scrollYProgress, [0.1, 0.5], [scatter.x, grid.x]);
              const y = useTransform(scrollYProgress, [0.1, 0.5], [scatter.y, grid.y]);
              const rotate = useTransform(scrollYProgress, [0.1, 0.5], [scatter.rotate, grid.rotate]);
              const scale = useTransform(scrollYProgress, [0.1, 0.5], [scatter.scale, grid.scale]);
              const cardOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

              return (
                <motion.div
                  key={card.id}
                  style={{ x, y, rotate, scale, opacity: cardOpacity }}
                  className="absolute"
                >
                  <div className={`w-[160px] md:w-[180px] rounded-2xl bg-gradient-to-br ${card.bgColor} p-4 shadow-lg border border-white/50`}>
                    {/* 아이콘 */}
                    <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                      <span className="text-white text-lg">
                        {card.category === "영상" ? "📺" : "🎵"}
                      </span>
                    </div>

                    {/* 서비스명 */}
                    <h3 className="font-semibold text-[#4a4a4a] text-sm mb-1">{card.name}</h3>
                    <p className="text-xs text-[#888] mb-3">{card.category} 스트리밍</p>

                    {/* 가격 & 인원 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-[#4a4a4a]">{card.price}</p>
                        <p className="text-[10px] text-[#aaa]">월 예상 비용</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#888] bg-white/50 px-2 py-1 rounded-full">
                        <Users size={12} />
                        <span>{card.members}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 카드 섹션 타이틀 (스크롤 후 나타남) */}
          <motion.div
            style={{ opacity: titleOpacity, y: titleY }}
            className="absolute top-24 left-0 right-0 text-center z-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#4a4a4a]">
              지금 인기 있는 파티
            </h2>
            <p className="text-sm text-[#888] mt-2">원하는 서비스를 골라 바로 참여하세요</p>
          </motion.div>

          {/* 스크롤 안내 */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[#aaa] text-sm flex flex-col items-center gap-2"
            >
              <span>스크롤해서 둘러보기</span>
              <span>↓</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Statement Section
// ============================================
const StatementSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="text-[24px] md:text-[32px] lg:text-[40px] font-bold leading-[1.4] text-[#4a4a4a]">
          매달 나가는 구독료,
          <br />
          혼자 다 내고 계셨나요?
          <br />
          <span className="text-[#aaa]">이제 함께 나눠요.</span>
        </p>
      </motion.div>
    </section>
  );
};

// ============================================
// Comparison Section
// ============================================
const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6">
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
            className="bg-[#F8F8F8] rounded-3xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-[#FFE4E4] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">😢</span>
            </div>
            <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">혼자 결제하면</h3>
            <p className="text-sm text-[#888] mb-6">정가 그대로, 매달 부담</p>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#ddd]" />
            </div>
            <p className="text-3xl font-bold text-[#FF8A8A]">월 17,000원</p>
            <p className="text-xs text-[#aaa] mt-2">넷플릭스 프리미엄 기준</p>
          </motion.div>

          {/* 모아에서 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-[#FFF5F7] to-[#F5F0FF] rounded-3xl p-8 text-center border-2 border-[#FFD4DC]"
          >
            <div className="w-16 h-16 bg-[#FFD4DC] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">모아에서 나누면</h3>
            <p className="text-sm text-[#888] mb-6">똑같은 서비스, 저렴한 가격</p>
            <div className="flex justify-center -space-x-2 mb-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-3 border-white shadow-sm"
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
// How It Works Section
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
      color: "from-[#FFD4DC] to-[#FFBDC9]"
    },
    {
      number: "2",
      title: "안전하게 가입",
      description: "보증금 시스템으로 안심하고 가입해요",
      emoji: "🛡️",
      color: "from-[#D4E4FF] to-[#B5D4FF]"
    },
    {
      number: "3",
      title: "바로 이용",
      description: "가입 즉시 프리미엄 서비스를 이용하세요",
      emoji: "✨",
      color: "from-[#E4D4FF] to-[#D4BDFF]"
    }
  ];

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
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
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 text-3xl shadow-sm`}>
                {step.emoji}
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F5F5F5] text-xs font-medium text-[#888] mb-3">
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
// Features Section
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
      bg: "bg-[#FFF5F7]"
    },
    {
      icon: CreditCard,
      title: "자동 정산",
      description: "매달 귀찮은 송금 없이 자동으로!",
      color: "text-[#B5D4FF]",
      bg: "bg-[#F5F8FF]"
    },
    {
      icon: Heart,
      title: "수수료 0원",
      description: "플랫폼 수수료 없이 이용하세요",
      color: "text-[#C5B5FF]",
      bg: "bg-[#F8F5FF]"
    }
  ];

  return (
    <section ref={ref} className="py-24 px-6">
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
              className={`${feature.bg} rounded-2xl p-6 text-center`}
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
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
// Pricing Section
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
    <section ref={ref} id="pricing" className="py-24 px-6 bg-white">
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
          className="bg-[#FAFAFA] rounded-2xl border border-[#f0e6dc] overflow-hidden"
        >
          {services.map((service, index) => (
            <div
              key={service.name}
              className={`flex items-center justify-between p-4 ${
                index !== services.length - 1 ? "border-b border-[#f0e6dc]" : ""
              }`}
            >
              <span className="font-medium text-[#4a4a4a] text-sm">{service.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#bbb] line-through text-xs">₩{service.original}</span>
                <span className="font-semibold text-[#4a4a4a]">₩{service.party}</span>
                <span className="text-xs font-medium text-[#7DDFAA] bg-[#E8FFF0] px-2 py-1 rounded-full">
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
// FAQ Section
// ============================================
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-[#f0e6dc]">
      <button onClick={onClick} className="w-full py-5 flex items-center justify-between text-left">
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
            <p className="pb-5 text-[#888] text-sm leading-relaxed">{answer}</p>
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
    <section ref={ref} id="faq" className="py-24 px-6">
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
          className="bg-white rounded-2xl border border-[#f0e6dc] px-6"
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
// CTA Section
// ============================================
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-[#FFD4DC] to-[#D4E4FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
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
          <button className="px-10 py-4 bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90 text-white rounded-full text-base font-medium transition-opacity shadow-lg shadow-pink-200/50">
            무료로 시작하기
          </button>
        </Link>
      </motion.div>
    </section>
  );
};

// ============================================
// Footer
// ============================================
const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-[#f0e6dc]">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFB5C5] to-[#B5D4FF] flex items-center justify-center">
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

        <div className="pt-6 border-t border-[#f0e6dc] text-center text-xs text-[#aaa]">
          © 2025 MoA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
