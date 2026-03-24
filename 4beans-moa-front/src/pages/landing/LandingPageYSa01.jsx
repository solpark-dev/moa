import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Plus, Sparkles, Shield, CreditCard, Users, Heart, Star, ArrowRight, Zap, Play } from "lucide-react";
import { NeoCard, NeoButton, BouncyCard } from "@/components/common/neo";

/**
 * LandingPageYSa01 - Portrait Parallax + O3 Neo-Brutalist Style Mix
 *
 * - Portrait.jsx의 패럴랙스 스크롤 메커니즘 (카드가 흩어졌다 모임)
 * - O3.jsx의 네오브루탈리즘 스타일 (검정 테두리, 그림자, 팝 색상)
 * - O3의 띠용띠용 바운시 카드 모션
 * - O3의 마키 롤링 텍스트
 * - 스크롤 시작 시 카드 등장 → 두번째 화면에서 배치 완료
 */


// ============================================
// Marquee Component (O3 Style - 롤링 텍스트)
// ============================================
function Marquee({ children, direction = "left", speed = 20 }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}


// ============================================
// Confetti Component - 둥둥 떠다니는 종이 조각
// ============================================
const Confetti = () => {
  const confettiPieces = [
    { color: "bg-pink-400", size: "w-4 h-4", left: "5%", delay: 0, duration: 8, rotate: 45 },
    { color: "bg-cyan-400", size: "w-3 h-3", left: "15%", delay: 1.2, duration: 10, rotate: -30 },
    { color: "bg-lime-400", size: "w-5 h-2", left: "25%", delay: 0.5, duration: 9, rotate: 60 },
    { color: "bg-yellow-400", size: "w-3 h-3", left: "35%", delay: 2, duration: 11, rotate: -45 },
    { color: "bg-pink-500", size: "w-2 h-5", left: "45%", delay: 0.8, duration: 8.5, rotate: 30 },
    { color: "bg-blue-400", size: "w-4 h-3", left: "55%", delay: 1.5, duration: 10.5, rotate: -60 },
    { color: "bg-purple-400", size: "w-3 h-4", left: "65%", delay: 0.3, duration: 9.5, rotate: 45 },
    { color: "bg-cyan-300", size: "w-2 h-2", left: "75%", delay: 2.5, duration: 8, rotate: -30 },
    { color: "bg-orange-400", size: "w-4 h-2", left: "85%", delay: 1, duration: 11, rotate: 60 },
    { color: "bg-lime-300", size: "w-3 h-3", left: "92%", delay: 0.7, duration: 9, rotate: -45 },
    { color: "bg-pink-300", size: "w-2 h-4", left: "10%", delay: 3, duration: 10, rotate: 30 },
    { color: "bg-yellow-300", size: "w-4 h-2", left: "50%", delay: 2.2, duration: 8.5, rotate: -60 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {confettiPieces.map((piece, index) => (
        <motion.div
          key={index}
          className={`absolute ${piece.color} ${piece.size} rounded-sm border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}
          style={{ left: piece.left, top: -20 }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [piece.rotate, piece.rotate + 360],
            x: [0, Math.sin(index) * 50, 0, Math.sin(index) * -30, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPageYSa01() {
  return (
    <div className="min-h-screen bg-slate-50 text-black font-['Pretendard',-apple-system,BlinkMacSystemFont,system-ui,sans-serif]">
      {/* Subtle Dot Pattern Background (O3 Style) */}
      <div
        className="fixed top-0 left-0 right-0 h-[100vh] pointer-events-none opacity-[0.03] -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Confetti - 둥둥 떠다니는 종이 조각 */}
      <Confetti />

      <ParallaxHero />
      <MarqueeBand />
      <StatementSection />
      <ComparisonSection />
      <StatsMarquee />
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
// Navigation (O3 Style)
// ============================================
const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 backdrop-blur-md border-b-4 border-black">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: -3 }}
        >
          <Link to="/">
            <NeoCard color="bg-white" rotate={-3} className="px-4 py-2 rounded-xl">
              <span className="text-xl font-black tracking-tight">MoA!</span>
            </NeoCard>
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/party" className="px-4 py-2 font-bold text-black hover:bg-black hover:text-white rounded-xl transition-colors border border-gray-200">
            파티 찾기
          </Link>
          <a href="#pricing" className="font-bold text-gray-600 hover:text-black transition-colors">요금</a>
          <a href="#faq" className="font-bold text-gray-600 hover:text-black transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <NeoCard color="bg-cyan-400" rotate={2} className="px-5 py-2 rounded-xl cursor-pointer">
              <span className="font-bold text-black">로그인</span>
            </NeoCard>
          </Link>
          <Link to="/signup" className="hidden sm:block">
            <NeoCard color="bg-pink-500" rotate={-2} className="px-5 py-2 rounded-xl cursor-pointer">
              <span className="font-bold text-white">시작하기</span>
            </NeoCard>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// Parallax Hero - Portrait.jsx 구조 그대로 + O3 스타일
// ============================================
const ParallaxHero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // 서비스 카드 데이터 (O3 Style)
  const cards = [
    { id: 1, name: "넷플릭스", category: "영상", price: "4,250원", members: "3/4", bgColor: "bg-red-500", emoji: "N" },
    { id: 2, name: "디즈니+", category: "영상", price: "2,475원", members: "2/4", bgColor: "bg-blue-500", emoji: "D+" },
    { id: 3, name: "유튜브 프리미엄", category: "영상", price: "2,980원", members: "4/5", bgColor: "bg-pink-500", emoji: "Y" },
    { id: 4, name: "스포티파이", category: "음악", price: "2,725원", members: "3/6", bgColor: "bg-lime-400", emoji: "S" },
    { id: 5, name: "웨이브", category: "영상", price: "3,475원", members: "2/4", bgColor: "bg-cyan-400", emoji: "W" },
    { id: 6, name: "왓챠", category: "영상", price: "3,225원", members: "3/4", bgColor: "bg-yellow-400", emoji: "왓" },
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
    { x: -220, y: 10, rotate: 0, scale: 1 },
    { x: 0, y: 10, rotate: 0, scale: 1 },
    { x: 220, y: 10, rotate: 0, scale: 1 },
    { x: -220, y: 220, rotate: 0, scale: 1 },
    { x: 0, y: 220, rotate: 0, scale: 1 },
    { x: 220, y: 220, rotate: 0, scale: 1 },
  ];

  // 타이밍 조정: 두번째 화면에서 그리드 완성
  const titleOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.5, 0.6], [30, 0]);

  // 플로팅 스티커 애니메이션 (안쪽으로 부드럽게 이동)
  const stickerRightX = useTransform(scrollYProgress, [0, 0.15, 0.35], [0, -50, -200]);
  const stickerRightY = useTransform(scrollYProgress, [0, 0.15, 0.35], [0, 20, 80]);
  const stickerLeftX = useTransform(scrollYProgress, [0, 0.15, 0.35], [0, 50, 200]);
  const stickerLeftY = useTransform(scrollYProgress, [0, 0.15, 0.35], [0, 30, 100]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden -mt-30">

        {/* 첫 화면: 헤드라인 + 흩어진 카드들 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 메인 헤드라인 - 스크롤 25%까지 보이다가 페이드아웃 */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.2, 0.35], [1, 0]),
              y: useTransform(scrollYProgress, [0.2, 0.35], [0, -50])
            }}
            className="text-center z-10 px-6"
          >
            {/* Floating Decoration - 스크롤 시 안쪽+아래로 부드럽게 이동 */}
            <motion.div
              style={{ x: stickerRightX, y: stickerRightY }}
              className="absolute top-20 right-[15%] hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <NeoCard color="bg-cyan-400" rotate={12} className="px-4 py-2 rounded-xl">
                  <span className="font-black text-lg">75% OFF!</span>
                </NeoCard>
              </motion.div>
            </motion.div>

            <motion.div
              style={{ x: stickerLeftX, y: stickerLeftY }}
              className="absolute top-32 left-[10%] hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [-8, -12, -8] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <NeoCard color="bg-lime-400" rotate={-8} className="px-3 py-1 rounded-lg">
                  <span className="font-bold text-sm">NEW!</span>
                </NeoCard>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NeoCard color="bg-white" rotate={1} className="inline-block px-5 py-2 rounded-xl mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-pink-500" />
                  <span className="font-bold">구독료, 이제 똑똑하게 나눠요</span>
                </div>
              </NeoCard>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[48px] md:text-[64px] lg:text-[80px] font-black leading-[0.95] tracking-tighter mb-6"
            >
              <span className="block transform -rotate-1">SHARE</span>
              <span className="block transform rotate-1">
                <span className="text-cyan-400">YOUR</span>
              </span>
              <span className="block transform -rotate-1 text-pink-500">
                OTT!
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <NeoCard color="bg-white" rotate={-1} className="inline-block px-6 py-3 rounded-xl mb-8">
                <p className="text-lg md:text-xl font-bold">
                  넷플릭스, 디즈니+ 함께 나누면 최대 75% 절약!
                </p>
              </NeoCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/signup">
                <NeoButton color="bg-pink-500 text-white">
                  <span className="flex items-center gap-2">
                    무료로 시작하기
                    <ArrowRight className="w-6 h-6" />
                  </span>
                </NeoButton>
              </Link>
              <Link to="/party">
                <NeoButton color="bg-white text-black">
                  <span className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    파티 둘러보기
                  </span>
                </NeoButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* 플로팅 카드들 - 두번째 화면 시작점(25%)에서 등장, 50%에서 그리드 완성 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {cards.map((card, index) => {
              const scatter = scatterPositions[index];
              const grid = gridPositions[index];

              // 25%~50% 구간: 흩어진 위치 → 그리드 위치
              const x = useTransform(scrollYProgress, [0.25, 0.5], [scatter.x, grid.x]);
              const y = useTransform(scrollYProgress, [0.25, 0.5], [scatter.y, grid.y]);
              const rotate = useTransform(scrollYProgress, [0.25, 0.5], [scatter.rotate, grid.rotate]);
              const scale = useTransform(scrollYProgress, [0.25, 0.5], [scatter.scale, grid.scale]);
              // 25%~35% 구간: 카드 등장
              const cardOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);

              return (
                <motion.div
                  key={card.id}
                  style={{ x, y, rotate, scale, opacity: cardOpacity }}
                  className="absolute"
                >
                  {/* O3 스타일 카드 */}
                  <div className="w-[150px] md:w-[170px] bg-white border border-gray-200 rounded-2xl p-4 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
                    <div className={`w-10 h-10 ${card.bgColor} rounded-xl border border-gray-200 flex items-center justify-center mb-3 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
                      <span className="text-white font-black text-lg">{card.emoji}</span>
                    </div>
                    <h3 className="font-black text-black text-sm mb-1">{card.name}</h3>
                    <p className="text-xs text-gray-500 font-bold mb-3">{card.category}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-black text-pink-500">{card.price}</p>
                        <p className="text-[10px] text-gray-400 font-bold">월 비용</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-black bg-lime-400 px-2 py-1 rounded-full border border-gray-200">
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
            <NeoCard color="bg-lime-400" rotate={-2} className="inline-block px-6 py-3 rounded-xl mb-4">
              <span className="text-xl font-black">HOT PARTY!</span>
            </NeoCard>
            <h2 className="text-3xl md:text-4xl font-black text-black">
              지금 인기 있는 파티
            </h2>
            <p className="text-sm text-gray-600 mt-2 font-bold">원하는 서비스를 골라 바로 참여하세요</p>
          </motion.div>

          {/* 스크롤 안내 - 20%까지만 보임 */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center text-gray-500"
            >
              <span className="text-2xl">↓</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Marquee Band (O3 Style - 첫번째 롤링 텍스트)
// ============================================
const MarqueeBand = () => {
  return (
    <div className="bg-black text-white py-4 border-y-4 border-black">
      <Marquee speed={25}>
        <div className="flex items-center gap-8 px-4">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 text-xl font-black uppercase tracking-wider">
              <Star className="w-6 h-6 text-pink-400 fill-pink-400" />
              Netflix
              <Star className="w-6 h-6 text-cyan-400 fill-cyan-400" />
              Disney+
              <Star className="w-6 h-6 text-lime-400 fill-lime-400" />
              Wavve
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              Tving
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

// ============================================
// Stats Marquee (O3 Style - 두번째 롤링 텍스트)
// ============================================
const StatsMarquee = () => {
  return (
    <div className="bg-pink-500 text-white py-4 border-y-4 border-black">
      <Marquee direction="right" speed={30}>
        <div className="flex items-center gap-12 px-4">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-12 text-xl font-black uppercase">
              <span>10K+ 사용자</span>
              <span>•</span>
              <span>75% 절약</span>
              <span>•</span>
              <span>4.9 만족도</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

// ============================================
// Statement Section (O3 Style)
// ============================================
const StatementSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6 bg-white border-b-4 border-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <NeoCard color="bg-cyan-400" rotate={-2} className="inline-block px-6 py-3 rounded-xl mb-8">
          <span className="text-2xl font-black">WHY MoA?</span>
        </NeoCard>
        <p className="text-[28px] md:text-[36px] lg:text-[44px] font-black leading-[1.3]">
          매달 나가는 구독료,
          <br />
          혼자 다 내고 계셨나요?
          <br />
          <span className="text-pink-500">이제 함께 나눠요!</span>
        </p>
      </motion.div>
    </section>
  );
};

// ============================================
// Comparison Section (O3 Style)
// ============================================
const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-slate-100 border-b-4 border-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            얼마나 절약할 수 있을까요?
          </h2>
          <p className="text-gray-600 font-bold">같은 서비스, 다른 가격</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 혼자 결제 */}
          <BouncyCard className="p-8 text-center" delay={0.1}>
            <div className="w-20 h-20 bg-gray-200 rounded-2xl border border-gray-200 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
              <span className="text-4xl">😢</span>
            </div>
            <h3 className="text-xl font-black mb-2">혼자 결제하면</h3>
            <p className="text-gray-500 font-bold mb-6">정가 그대로, 매달 부담</p>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-gray-300 border border-gray-200" />
            </div>
            <p className="text-4xl font-black text-red-500">월 17,000원</p>
            <p className="text-sm text-gray-400 font-bold mt-2">넷플릭스 프리미엄 기준</p>
          </BouncyCard>

          {/* 모아에서 */}
          <BouncyCard className="p-8 text-center bg-gradient-to-br from-pink-50 to-cyan-50" delay={0.2}>
            <div className="w-20 h-20 bg-pink-500 rounded-2xl border border-gray-200 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
              <span className="text-4xl">🎉</span>
            </div>
            <h3 className="text-xl font-black mb-2">모아에서 나누면</h3>
            <p className="text-gray-500 font-bold mb-6">똑같은 서비스, 저렴한 가격</p>
            <div className="flex justify-center -space-x-2 mb-4">
              {['bg-red-500', 'bg-blue-500', 'bg-lime-400', 'bg-cyan-400'].map((color, i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-full ${color} border border-gray-200 shadow-sm`}
                />
              ))}
            </div>
            <p className="text-4xl font-black text-pink-500">월 4,250원</p>
            <p className="text-sm font-bold mt-2">
              <span className="text-lime-500 bg-lime-100 px-2 py-1 rounded-full border border-gray-200">-75% 절약!</span>
            </p>
          </BouncyCard>
        </div>
      </div>
    </section>
  );
};

// ============================================
// How It Works Section (O3 Style)
// ============================================
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    { num: "01", title: "파티 찾기", desc: "원하는 OTT 파티를 검색!", emoji: "🔍", color: "bg-cyan-400" },
    { num: "02", title: "안전 결제", desc: "보증금으로 안심!", emoji: "💳", color: "bg-pink-500" },
    { num: "03", title: "바로 시청", desc: "즉시 시청 시작!", emoji: "🎬", color: "bg-lime-400" },
  ];

  return (
    <section ref={ref} className="py-24 px-6 bg-white border-b-4 border-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            쉽게 시작해요!
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`w-28 h-28 ${step.color} rounded-3xl border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] mx-auto mb-6 flex items-center justify-center`}
              >
                <span className="text-5xl">{step.emoji}</span>
              </motion.div>
              <div className="inline-block bg-black text-white px-4 py-1 rounded-full font-black text-sm mb-4">
                STEP {step.num}
              </div>
              <h3 className="text-2xl font-black mb-2">{step.title}</h3>
              <p className="text-lg font-bold text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// Features Section (O3 Style)
// ============================================
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Shield,
      title: "안전 보장",
      description: "보증금 시스템으로 먹튀 걱정 없어요",
      color: "bg-cyan-400",
      emoji: "🛡️"
    },
    {
      icon: CreditCard,
      title: "자동 정산",
      description: "매달 귀찮은 송금 없이 자동으로!",
      color: "bg-pink-500",
      emoji: "💳"
    },
    {
      icon: Heart,
      title: "수수료 0원",
      description: "플랫폼 수수료 없이 이용하세요",
      color: "bg-lime-400",
      emoji: "💚"
    }
  ];

  return (
    <section ref={ref} className="py-24 px-6 bg-slate-100 border-b-4 border-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <NeoCard color="bg-pink-500" rotate={-2} className="inline-block px-6 py-3 rounded-xl mb-6">
            <span className="text-xl font-black text-white">WHY MoA?</span>
          </NeoCard>
          <h2 className="text-3xl md:text-4xl font-black">
            이래서 <span className="text-pink-500">MoA</span>야!
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <BouncyCard key={feature.title} className="p-6 text-center" delay={index * 0.1}>
              <div className={`w-16 h-16 ${feature.color} rounded-2xl border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
                <span className="text-3xl">{feature.emoji}</span>
              </div>
              <h3 className="text-xl font-black mb-2">{feature.title}</h3>
              <p className="text-gray-600 font-bold">{feature.description}</p>
            </BouncyCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// Pricing Section (O3 Style)
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
    <section ref={ref} id="pricing" className="py-24 px-6 bg-white border-b-4 border-black">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            이만큼 절약돼요
          </h2>
          <p className="text-gray-600 font-bold">프리미엄 서비스를 저렴하게</p>
        </motion.div>

        <BouncyCard className="overflow-hidden" delay={0.1}>
          {services.map((service, index) => (
            <div
              key={service.name}
              className={`flex items-center justify-between p-4 ${
                index !== services.length - 1 ? "border-b-3 border-black" : ""
              }`}
            >
              <span className="font-black text-black">{service.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 line-through text-sm font-bold">₩{service.original}</span>
                <span className="font-black text-lg">₩{service.party}</span>
                <span className="text-xs font-black text-white bg-lime-500 px-2 py-1 rounded-full border border-gray-200">
                  -{service.save}
                </span>
              </div>
            </div>
          ))}
        </BouncyCard>

        <p className="text-center text-sm text-gray-500 font-bold mt-4">
          * 4인 파티 기준 1인당 예상 금액이에요
        </p>
      </div>
    </section>
  );
};

// ============================================
// FAQ Section (O3 Style)
// ============================================
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b-3 border-black">
      <button onClick={onClick} className="w-full py-5 flex items-center justify-between text-left">
        <span className="font-black text-black pr-8">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <div className="w-8 h-8 bg-pink-500 rounded-lg border border-gray-200 flex items-center justify-center shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
            <Plus size={18} className="text-white" />
          </div>
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
            <p className="pb-5 text-gray-600 font-bold leading-relaxed">{answer}</p>
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
    <section ref={ref} id="faq" className="py-24 px-6 bg-slate-100 border-b-4 border-black">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-black">
            자주 묻는 질문
          </h2>
        </motion.div>

        <BouncyCard className="px-6" delay={0.1}>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </BouncyCard>
      </div>
    </section>
  );
};

// ============================================
// CTA Section (O3 Style)
// ============================================
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <NeoCard
            color="bg-white"
            rotate={0}
            className="p-12 md:p-16 rounded-[3rem] text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🎊
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              지금 바로<br />
              <span className="text-pink-500">시작해볼까요?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 font-bold">
              매달 빠져나가는 구독료, 이제 친구들과 나눠요!
            </p>
            <Link to="/signup">
              <NeoButton color="bg-pink-500 text-white" className="text-2xl px-12 py-6">
                <span className="flex items-center gap-3">
                  무료로 시작하기
                  <Sparkles className="w-7 h-7" />
                </span>
              </NeoButton>
            </Link>
          </NeoCard>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// Footer (O3 Style)
// ============================================
const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 md:px-12 py-12 border-t-4 border-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <NeoCard color="bg-pink-500" rotate={-3} className="px-3 py-1 rounded-lg mb-4 inline-block">
              <span className="font-black text-white">MoA!</span>
            </NeoCard>
            <p className="text-sm text-gray-400 font-bold leading-relaxed">
              모든 구독 서비스를
              <br />
              하나로 모아 관리하세요.
            </p>
          </div>

          <div>
            <h4 className="font-black text-white mb-3">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-bold">
              <li><Link to="/party" className="hover:text-white transition-colors">파티 찾기</Link></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">요금 안내</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white mb-3">고객지원</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-bold">
              <li><a href="#faq" className="hover:text-white transition-colors">자주 묻는 질문</a></li>
              <li><Link to="/support" className="hover:text-white transition-colors">문의하기</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white mb-3">법적 고지</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-bold">
              <li><Link to="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 text-center text-sm text-gray-500 font-bold">
          © 2025 MoA. 함께 보면 더 좋아!
        </div>
      </div>
    </footer>
  );
};
