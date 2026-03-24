import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  Sparkles, Shield, Zap, ArrowRight, Play, Check,
  CreditCard, ChevronRight, Tv, Film, Music, Gamepad2,
  Users, Star, TrendingUp
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * Variant Z-Parallax - "Liquid Depth"
 *
 * 미니멀 패럴랙스 조합:
 * 1. 배경 오브 depth (미세한 패럴랙스)
 * 2. Hero 텍스트 sticky + fade out
 * 3. OTT 카드 순차 등장 (stagger + y offset)
 * 4. Stats 섹션 진입 시 카운트업
 * 5. CTA 섹션 scale up reveal
 */

// ============================================
// Parallax Background with Depth
// ============================================
const ParallaxBackground = () => {
  const { scrollY } = useScroll();

  // 각 오브가 다른 속도로 움직임
  const blueY = useTransform(scrollY, [0, 1000], [0, -150]);
  const orangeY = useTransform(scrollY, [0, 1000], [0, 200]);
  const greenY = useTransform(scrollY, [0, 1000], [0, -100]);
  const blueX = useTransform(scrollY, [0, 1000], [0, 50]);
  const orangeX = useTransform(scrollY, [0, 1000], [0, -80]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f7] via-[#fbfbfd] to-[#f0f0f2]" />

      {/* Parallax Orbs */}
      <motion.div
        style={{ y: blueY, x: blueX }}
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full will-change-transform"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className="w-full h-full rounded-full animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(147, 197, 253, 0.35) 0%, rgba(196, 181, 253, 0.2) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: orangeY, x: orangeX }}
        className="absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] rounded-full will-change-transform"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(253, 186, 116, 0.3) 0%, rgba(252, 165, 165, 0.15) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: greenY }}
        className="absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full will-change-transform"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(167, 243, 208, 0.3) 0%, rgba(147, 197, 253, 0.15) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </motion.div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

// ============================================
// Dynamic Island Navigation
// ============================================
const DynamicNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        layout
        className={`
          flex items-center gap-2
          bg-[#1d1d1f]/90 backdrop-blur-2xl
          rounded-full py-2 px-3
          shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2)]
          border border-white/10
        `}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <AnimatePresence>
            {!scrolled && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-white font-semibold text-[15px] tracking-tight overflow-hidden whitespace-nowrap"
              >
                MoA
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden md:flex items-center gap-1 ml-2 overflow-hidden"
            >
              {['파티', '가격', '소개'].map((item) => (
                <button
                  key={item}
                  className="px-4 py-1.5 text-white/70 hover:text-white text-[14px] font-medium rounded-full hover:bg-white/10 transition-all"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="ml-1 px-5 py-2 bg-white text-[#1d1d1f] rounded-full text-[14px] font-semibold"
          >
            시작하기
          </motion.button>
        </Link>
      </motion.div>
    </motion.nav>
  );
};

// ============================================
// Sticky Hero with Fade Out
// ============================================
const StickyHero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Hero 요소들의 fade out & 이동
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Badge와 버튼은 다른 속도로 사라짐
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const buttonsOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const pillsOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[200vh]">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="text-center px-6 max-w-[1120px] mx-auto"
        >
          {/* Announcement Badge */}
          <motion.div
            style={{ opacity: badgeOpacity }}
            className="flex justify-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34C759]" />
              </span>
              <span className="text-[14px] font-medium text-[#1d1d1f]">
                현재 <span className="font-bold text-[#007AFF]">4,231</span>개의 파티가 모집 중
              </span>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-[48px] md:text-[72px] lg:text-[88px] font-bold tracking-[-0.03em] leading-[1.05] text-[#1d1d1f] mb-8"
          >
            OTT 구독료,
            <br />
            <span className="bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#AF52DE] bg-clip-text text-transparent">
              함께 나누면
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#AF52DE] via-[#FF2D55] to-[#FF9500] bg-clip-text text-transparent">
              더 가벼워요
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-[18px] md:text-[21px] text-[#86868b] max-w-[600px] mx-auto mb-12 leading-relaxed font-medium"
          >
            넷플릭스, 디즈니+ 프리미엄 요금제를
            <br className="hidden md:block" />
            안전하게 공유하고 <span className="text-[#1d1d1f] font-semibold">최대 75%</span> 절약하세요.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            style={{ opacity: buttonsOpacity }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Link to="/party">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-full text-[17px] font-semibold shadow-[0_4px_24px_-4px_rgba(0,122,255,0.4)] transition-colors flex items-center gap-2"
                >
                  파티 둘러보기
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Link to="/party/create">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/70 backdrop-blur-xl hover:bg-white/90 text-[#1d1d1f] rounded-full text-[17px] font-semibold border border-white/60 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] flex items-center gap-2"
                >
                  <Play size={18} fill="currentColor" />
                  파티 만들기
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Pills */}
          <motion.div
            style={{ opacity: pillsOpacity }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: Shield, text: "안전 보증금", color: "text-[#34C759]", delay: 1.1 },
              { icon: Zap, text: "5초 매칭", color: "text-[#FF9500]", delay: 1.2 },
              { icon: CreditCard, text: "수수료 0원", color: "text-[#5856D6]", delay: 1.3 },
            ].map((pill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: pill.delay }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm ${pill.color}`}
              >
                <pill.icon size={16} strokeWidth={2.5} />
                <span className="text-[13px] font-semibold">{pill.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-[#86868b]/30 flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-[#86868b]/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// OTT Cards with Staggered Parallax
// ============================================
const OTTCard = ({ name, color, icon: Icon, price, originalPrice, members, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // 각 카드마다 다른 패럴랙스 오프셋
  const yOffset = useTransform(scrollYProgress, [0, 1], [50 + index * 20, -30 - index * 10]);
  const springY = useSpring(yOffset, { stiffness: 100, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{ y: springY }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
    >
      <div className="relative bg-white/70 backdrop-blur-2xl rounded-[28px] p-6 border border-white/80 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500">
        {/* Discount Badge */}
        <div className="absolute -top-3 -right-2 px-3 py-1 bg-gradient-to-r from-[#FF2D55] to-[#FF9500] text-white text-[11px] font-bold rounded-full shadow-lg">
          75% OFF
        </div>

        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg ${color}`}>
          <Icon size={32} className="text-white" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2">{name}</h3>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-[28px] font-bold text-[#1d1d1f]">{price}</span>
          <span className="text-[14px] text-[#86868b]">/월</span>
          <span className="text-[14px] text-[#86868b] line-through ml-1">{originalPrice}</span>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm"
              />
            ))}
          </div>
          <span className="text-[13px] text-[#86868b] font-medium">
            +{members.toLocaleString()}명 이용 중
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-[13px] text-[#34C759] font-semibold flex items-center gap-1">
            <TrendingUp size={14} />
            인기 상승 중
          </span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowRight size={14} className="text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const OTTSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    { name: "Netflix", color: "bg-gradient-to-br from-[#E50914] to-[#B81D24]", icon: Tv, price: "4,250원", originalPrice: "17,000원", members: 1243 },
    { name: "Disney+", color: "bg-gradient-to-br from-[#0063E5] to-[#0039A6]", icon: Film, price: "3,475원", originalPrice: "13,900원", members: 892 },
    { name: "Wavve", color: "bg-gradient-to-br from-[#1451F8] to-[#0D3DB8]", icon: Music, price: "3,325원", originalPrice: "13,900원", members: 567 },
    { name: "Watcha", color: "bg-gradient-to-br from-[#FF0558] to-[#D10447]", icon: Gamepad2, price: "3,225원", originalPrice: "12,900원", members: 423 },
  ];

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[36px] md:text-[48px] font-bold text-[#1d1d1f] tracking-tight mb-4">
            인기 OTT 서비스
          </h2>
          <p className="text-[18px] text-[#86868b] max-w-lg mx-auto">
            매달 수만 명이 MoA에서 구독료를 절약하고 있어요
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <OTTCard key={service.name} {...service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// Features Section with Glass Cards
// ============================================
const FeatureCard = ({ icon: Icon, title, description, color, gradient, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <div className="relative h-full bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 border border-white/80 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden">
        {/* Background Glow */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40 ${gradient}`} />

        {/* Icon */}
        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${gradient}`}>
          <Icon size={28} className="text-white" />
        </div>

        {/* Content */}
        <h3 className="text-[24px] font-bold text-[#1d1d1f] mb-3">{title}</h3>
        <p className="text-[15px] text-[#86868b] leading-relaxed mb-6">{description}</p>

        {/* Badge */}
        <div className={`inline-flex items-center gap-2 text-[13px] font-semibold ${color}`}>
          <Check size={16} strokeWidth={3} />
          <span>활성화됨</span>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Sparkles,
      title: "자동 매칭",
      description: "결제와 동시에 파티원을 찾아드려요. 평균 5초 이내 즉시 매칭됩니다.",
      color: "text-[#007AFF]",
      gradient: "bg-gradient-to-br from-[#007AFF] to-[#5856D6]",
    },
    {
      icon: Shield,
      title: "안전 보증금",
      description: "파티가 끝날 때까지 보증금을 에스크로 방식으로 안전하게 보관해요.",
      color: "text-[#34C759]",
      gradient: "bg-gradient-to-br from-[#34C759] to-[#248A3D]",
    },
    {
      icon: Zap,
      title: "간편 정산",
      description: "매달 귀찮은 송금 없이 카드로 자동 결제됩니다. 수수료는 0원이에요.",
      color: "text-[#FF9500]",
      gradient: "bg-gradient-to-br from-[#FF9500] to-[#FF6B00]",
    },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// Stats Section with Count-up Animation
// ============================================
const StatItem = ({ value, label, suffix = "", delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-[48px] md:text-[64px] font-bold text-[#1d1d1f] tracking-tight leading-none">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[15px] text-[#86868b] font-medium mt-2">{label}</div>
    </motion.div>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[40px] p-10 md:p-16 border border-white/80 shadow-[0_2px_60px_-20px_rgba(0,0,0,0.1)]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <StatItem value={52847} label="누적 사용자" suffix="+" delay={0} />
            <StatItem value={4231} label="활성 파티" delay={0.1} />
            <StatItem value={75} label="평균 절약률" suffix="%" delay={0.2} />
            <StatItem value={99} label="매칭 성공률" suffix="%" delay={0.3} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// Live Parties Section
// ============================================
const LivePartyItem = ({ party, index }) => {
  const colors = {
    'Netflix': 'from-[#E50914] to-[#B81D24]',
    'Disney+': 'from-[#0063E5] to-[#0039A6]',
    'Wavve': 'from-[#1451F8] to-[#0D3DB8]',
    'Watcha': 'from-[#FF0558] to-[#D10447]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 4 }}
      className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/60 cursor-pointer hover:bg-white/70 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[party.serviceName] || 'from-gray-500 to-gray-600'} flex items-center justify-center shadow-lg`}>
        <span className="text-white font-bold text-lg">{party.serviceName[0]}</span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-semibold text-[#1d1d1f] truncate">{party.title}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[13px] text-[#86868b]">{party.members}/4명</span>
          <span className="w-1 h-1 rounded-full bg-[#34C759]" />
          <span className="text-[12px] text-[#34C759] font-medium">모집중</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-[17px] font-bold text-[#1d1d1f]">{party.price}</div>
        <div className="text-[11px] text-[#34C759] font-medium">75% 절약</div>
      </div>
    </motion.div>
  );
};

const LivePartiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 border border-white/80 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[24px] font-bold text-[#1d1d1f] mb-1">실시간 인기 파티</h2>
              <p className="text-[14px] text-[#86868b]">지금 바로 합류할 수 있어요</p>
            </div>
            <Link to="/party" className="flex items-center gap-1 text-[14px] font-semibold text-[#007AFF] hover:text-[#0066CC] transition-colors">
              전체 보기 <ChevronRight size={16} />
            </Link>
          </div>

          {/* Party List */}
          <div className="space-y-3">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <LivePartyItem key={i} party={party} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// CTA Section with Scale Reveal
// ============================================
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        style={{ scale, opacity }}
        className="max-w-[900px] mx-auto"
      >
        <div className="relative bg-gradient-to-br from-[#1d1d1f] to-[#3d3d3f] rounded-[40px] p-12 md:p-20 text-center overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#007AFF] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#AF52DE] rounded-full blur-[120px]" />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <h2 className="text-[36px] md:text-[52px] font-bold text-white tracking-tight mb-6 leading-tight">
              지금 바로
              <br />
              시작하세요
            </h2>
            <p className="text-[17px] md:text-[19px] text-white/70 mb-10 leading-relaxed max-w-md mx-auto">
              복잡한 가입 절차 없이 30초 만에 완료됩니다.
              <br />
              첫 달은 <span className="text-white font-semibold">무료</span>로 체험해 보세요.
            </p>
            <Link to="/party">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group px-10 py-5 bg-white hover:bg-gray-100 text-[#1d1d1f] rounded-full text-[18px] font-semibold shadow-[0_4px_32px_-8px_rgba(255,255,255,0.3)] transition-colors flex items-center gap-3 mx-auto"
              >
                무료로 시작하기
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// ============================================
// Footer
// ============================================
const Footer = () => (
  <footer className="py-12 px-6 border-t border-[#d2d2d7]/30">
    <div className="max-w-[1120px] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] flex items-center justify-center">
            <span className="text-white font-bold text-xs">M</span>
          </div>
          <span className="text-[#86868b] text-[14px]">
            &copy; 2025 MoA. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-[14px] text-[#86868b]">
          <Link to="/terms" className="hover:text-[#1d1d1f] transition-colors">이용약관</Link>
          <Link to="/privacy" className="hover:text-[#1d1d1f] transition-colors">개인정보처리방침</Link>
          <Link to="/support" className="hover:text-[#1d1d1f] transition-colors">고객센터</Link>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================
// Main Component
// ============================================
export default function LandingPageZParallax() {
  return (
    <div className="min-h-screen text-[#1d1d1f] font-['Pretendard',-apple-system,BlinkMacSystemFont,system-ui,sans-serif] selection:bg-blue-100 selection:text-blue-900 antialiased overflow-x-hidden">
      <ParallaxBackground />
      <DynamicNav />

      <StickyHero />
      <OTTSection />
      <FeaturesSection />
      <StatsSection />
      <LivePartiesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
