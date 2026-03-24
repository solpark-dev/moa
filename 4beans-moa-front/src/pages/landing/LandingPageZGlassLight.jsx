import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring, useScroll, useInView, AnimatePresence } from "framer-motion";
import {
  Sparkles, Shield, Zap, ArrowRight, Play, Check,
  Users, CreditCard, Bell, ChevronRight, Star,
  Tv, Film, Music, Gamepad2
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * iOS 26 Style - "Liquid Glass"
 *
 * Design Philosophy:
 * - Apple's signature restraint with purposeful details
 * - Liquid glass morphism with crystalline clarity
 * - Breathing backgrounds with organic movement
 * - Dynamic Island-inspired interactive elements
 * - SF Pro typography aesthetics
 */

// ============================================
// Breathing Mesh Background
// ============================================
const LiquidGlassBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f7] via-[#fbfbfd] to-[#f0f0f2]" />

      {/* Animated mesh orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(147, 197, 253, 0.3) 0%, rgba(196, 181, 253, 0.2) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(253, 186, 116, 0.25) 0%, rgba(252, 165, 165, 0.15) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(167, 243, 208, 0.25) 0%, rgba(147, 197, 253, 0.15) 50%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

// ============================================
// Glass Card Component (iOS Style)
// ============================================
const GlassCard = ({ children, className = "", hover = true, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e) => {
    if (!hover) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: hover ? rotateX : 0,
        rotateY: hover ? rotateY : 0,
        transformStyle: "preserve-3d"
      }}
      className={`
        relative
        bg-white/70
        backdrop-blur-2xl
        rounded-[28px]
        border border-white/80
        shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]
        transition-shadow duration-500
        hover:shadow-[0_8px_60px_-12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.6)_inset]
        ${className}
      `}
    >
      {/* Inner highlight */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// ============================================
// Dynamic Island Navigation
// ============================================
const DynamicIslandNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        animate={{
          width: scrolled ? "auto" : "auto",
          paddingLeft: scrolled ? 8 : 20,
          paddingRight: scrolled ? 8 : 8,
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`
          flex items-center gap-2
          bg-[#1d1d1f]/90
          backdrop-blur-2xl
          rounded-full
          py-2
          shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2)]
          border border-white/10
        `}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] flex items-center justify-center shadow-lg"
          >
            <span className="text-white font-bold text-sm">M</span>
          </motion.div>
          <AnimatePresence>
            {!scrolled && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-white font-semibold text-[15px] tracking-tight overflow-hidden"
              >
                MoA
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Nav Items */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden md:flex items-center gap-1 ml-4 overflow-hidden"
            >
              {['파티', '가격', '소개'].map((item) => (
                <button
                  key={item}
                  className="px-4 py-1.5 text-white/70 hover:text-white text-[14px] font-medium rounded-full hover:bg-white/10 transition-all duration-200"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="ml-2 px-5 py-2 bg-white text-[#1d1d1f] rounded-full text-[14px] font-semibold hover:bg-white/90 transition-colors"
          >
            시작하기
          </motion.button>
        </Link>
      </motion.div>
    </motion.nav>
  );
};

// ============================================
// Feature Pill Component
// ============================================
const FeaturePill = ({ icon: Icon, text, color, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        inline-flex items-center gap-2 px-4 py-2
        rounded-full bg-white/60 backdrop-blur-xl
        border border-white/60
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]
        ${color}
      `}
    >
      <Icon size={16} strokeWidth={2.5} />
      <span className="text-[13px] font-semibold">{text}</span>
    </motion.div>
  );
};

// ============================================
// OTT Service Card
// ============================================
const OTTCard = ({ name, color, icon: Icon, price, members, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
    >
      <div className="relative bg-white/60 backdrop-blur-xl rounded-[24px] p-5 border border-white/70 shadow-[0_2px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] transition-all duration-300">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${color}`}
        >
          <Icon size={28} className="text-white" strokeWidth={2} />
        </div>

        {/* Content */}
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-1">{name}</h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-[22px] font-bold text-[#1d1d1f]">{price}</span>
          <span className="text-[13px] text-[#86868b]">/월</span>
        </div>

        {/* Members indicator */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white"
              />
            ))}
          </div>
          <span className="text-[12px] text-[#86868b] font-medium">
            +{members}명 이용 중
          </span>
        </div>

        {/* Hover arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ArrowRight size={14} className="text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================
// Stats Counter
// ============================================
const StatCounter = ({ value, label, suffix = "", delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="text-center"
    >
      <div className="text-[40px] md:text-[56px] font-bold text-[#1d1d1f] tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[14px] text-[#86868b] font-medium mt-1">{label}</div>
    </motion.div>
  );
};

// ============================================
// Live Party Card
// ============================================
const LivePartyCard = ({ party, index }) => {
  const colors = {
    'Netflix': 'from-[#E50914] to-[#B81D24]',
    'Disney+': 'from-[#0063E5] to-[#0039A6]',
    'Wavve': 'from-[#1451F8] to-[#0D3DB8]',
    'Watcha': 'from-[#FF0558] to-[#D10447]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/60 cursor-pointer hover:bg-white/70 transition-colors duration-200"
    >
      {/* Service Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[party.serviceName] || 'from-gray-500 to-gray-600'} flex items-center justify-center shadow-lg`}>
        <span className="text-white font-bold text-lg">{party.serviceName[0]}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-semibold text-[#1d1d1f] truncate">{party.title}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[13px] text-[#86868b]">{party.members}/4명</span>
          <span className="w-1 h-1 rounded-full bg-[#86868b]" />
          <span className="text-[13px] text-[#86868b]">방금 업데이트</span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <div className="text-[17px] font-bold text-[#1d1d1f]">{party.price}</div>
        <div className="text-[11px] text-[#34C759] font-medium">75% 절약</div>
      </div>
    </motion.div>
  );
};

// ============================================
// Main Component
// ============================================
export default function LandingPageGlassLight() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen text-[#1d1d1f] font-['Pretendard',-apple-system,BlinkMacSystemFont,system-ui,sans-serif] selection:bg-blue-100 selection:text-blue-900 antialiased">
      <LiquidGlassBackground />
      <DynamicIslandNav />

      {/* ========== Hero Section ========== */}
      <section ref={heroRef} className="relative pt-32 md:pt-40 pb-20 px-6">
        <div className="max-w-[1120px] mx-auto">
          {/* Announcement Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34C759]" />
              </span>
              <span className="text-[14px] font-medium text-[#1d1d1f]">
                현재 <span className="font-bold text-[#007AFF]">4,231</span>개의 파티가 모집 중
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-8"
          >
            <h1 className="text-[44px] md:text-[64px] lg:text-[80px] font-bold tracking-[-0.03em] leading-[1.1] text-[#1d1d1f]">
              OTT 구독료,
              <br />
              <span className="bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#AF52DE] bg-clip-text text-transparent">
                함께 나누면 더 가벼워요
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-[18px] md:text-[21px] text-[#86868b] max-w-[600px] mx-auto mb-12 leading-relaxed font-medium"
          >
            넷플릭스, 디즈니+ 프리미엄 요금제를
            <br className="hidden md:block" />
            안전하게 공유하고 <span className="text-[#1d1d1f] font-semibold">최대 75%</span> 절약하세요.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/party">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-full text-[17px] font-semibold shadow-[0_4px_24px_-4px_rgba(0,122,255,0.4)] transition-colors duration-200 flex items-center gap-2"
              >
                파티 둘러보기
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/party/create">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/70 backdrop-blur-xl hover:bg-white/90 text-[#1d1d1f] rounded-full text-[17px] font-semibold border border-white/60 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] transition-all duration-200 flex items-center gap-2"
              >
                <Play size={18} fill="currentColor" />
                파티 만들기
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <FeaturePill icon={Shield} text="안전 보증금 시스템" color="text-[#34C759]" delay={0.8} />
            <FeaturePill icon={Zap} text="5초 이내 자동 매칭" color="text-[#FF9500]" delay={0.9} />
            <FeaturePill icon={CreditCard} text="수수료 무료" color="text-[#5856D6]" delay={1.0} />
          </motion.div>
        </div>
      </section>

      {/* ========== OTT Services Section ========== */}
      <section className="py-20 px-6">
        <div className="max-w-[1120px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight mb-4"
            >
              인기 OTT 서비스
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[17px] text-[#86868b]"
            >
              원하는 서비스를 선택하고 바로 시작하세요
            </motion.p>
          </div>

          {/* OTT Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <OTTCard
              name="Netflix"
              color="bg-gradient-to-br from-[#E50914] to-[#B81D24]"
              icon={Tv}
              price="4,250원"
              members={1243}
              delay={0}
            />
            <OTTCard
              name="Disney+"
              color="bg-gradient-to-br from-[#0063E5] to-[#0039A6]"
              icon={Film}
              price="3,475원"
              members={892}
              delay={0.1}
            />
            <OTTCard
              name="Wavve"
              color="bg-gradient-to-br from-[#1451F8] to-[#0D3DB8]"
              icon={Music}
              price="3,325원"
              members={567}
              delay={0.2}
            />
            <OTTCard
              name="Watcha"
              color="bg-gradient-to-br from-[#FF0558] to-[#D10447]"
              icon={Gamepad2}
              price="3,225원"
              members={423}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ========== Features Section ========== */}
      <section className="py-20 px-6">
        <div className="max-w-[1120px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <GlassCard className="p-8" delay={0}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Sparkles size={26} className="text-white" />
              </div>
              <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-3">자동 매칭</h3>
              <p className="text-[15px] text-[#86868b] leading-relaxed mb-6">
                결제와 동시에 파티원을 찾아드려요.
                <br />평균 5초 이내 즉시 매칭됩니다.
              </p>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#007AFF]">
                <Check size={16} strokeWidth={3} />
                실시간 매칭 시스템
              </div>
            </GlassCard>

            {/* Feature 2 */}
            <GlassCard className="p-8 md:-translate-y-6" delay={0.1}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#34C759] to-[#248A3D] flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                <Shield size={26} className="text-white" />
              </div>
              <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-3">안전 보증금</h3>
              <p className="text-[15px] text-[#86868b] leading-relaxed mb-6">
                파티가 끝날 때까지 보증금을
                <br />에스크로 방식으로 안전하게 보관해요.
              </p>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#34C759]">
                <Check size={16} strokeWidth={3} />
                먹튀 100% 보장
              </div>
            </GlassCard>

            {/* Feature 3 */}
            <GlassCard className="p-8" delay={0.2}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                <Zap size={26} className="text-white" />
              </div>
              <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-3">간편 정산</h3>
              <p className="text-[15px] text-[#86868b] leading-relaxed mb-6">
                매달 귀찮은 송금 없이
                <br />카드로 자동 결제됩니다.
              </p>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#FF9500]">
                <Check size={16} strokeWidth={3} />
                수수료 0원
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ========== Stats Section ========== */}
      <section className="py-20 px-6">
        <div className="max-w-[1120px] mx-auto">
          <GlassCard hover={false} className="p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCounter value={52847} label="누적 사용자" suffix="+" delay={0} />
              <StatCounter value={4231} label="활성 파티" suffix="" delay={0.1} />
              <StatCounter value={75} label="평균 절약률" suffix="%" delay={0.2} />
              <StatCounter value={99} label="매칭 성공률" suffix="%" delay={0.3} />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ========== Live Parties Section ========== */}
      <section className="py-20 px-6">
        <div className="max-w-[720px] mx-auto">
          <GlassCard hover={false} className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[22px] font-bold text-[#1d1d1f] mb-1">실시간 인기 파티</h2>
                <p className="text-[14px] text-[#86868b]">지금 바로 합류할 수 있어요</p>
              </div>
              <Link
                to="/party"
                className="flex items-center gap-1 text-[14px] font-semibold text-[#007AFF] hover:text-[#0066CC] transition-colors"
              >
                전체 보기 <ChevronRight size={16} />
              </Link>
            </div>

            {/* Party List */}
            <div className="space-y-3">
              {MOCK_PARTIES.slice(0, 4).map((party, i) => (
                <LivePartyCard key={i} party={party} index={i} />
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="py-20 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="text-[32px] md:text-[44px] font-bold text-[#1d1d1f] tracking-tight mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-[17px] md:text-[19px] text-[#86868b] mb-10 leading-relaxed">
              복잡한 가입 절차 없이 30초 만에 완료됩니다.
              <br />
              첫 달은 <span className="text-[#1d1d1f] font-semibold">무료</span>로 체험해 보세요.
            </p>
            <Link to="/party">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group px-10 py-5 bg-[#1d1d1f] hover:bg-[#000] text-white rounded-full text-[18px] font-semibold shadow-[0_4px_32px_-8px_rgba(0,0,0,0.3)] transition-colors duration-200 flex items-center gap-3 mx-auto"
              >
                무료로 시작하기
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="py-12 px-6 border-t border-[#d2d2d7]/30">
        <div className="max-w-[1120px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="text-[#86868b] text-[14px]">
                &copy; 2025 MoA. All rights reserved.
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-[14px] text-[#86868b]">
              <Link to="/terms" className="hover:text-[#1d1d1f] transition-colors">이용약관</Link>
              <Link to="/privacy" className="hover:text-[#1d1d1f] transition-colors">개인정보처리방침</Link>
              <Link to="/support" className="hover:text-[#1d1d1f] transition-colors">고객센터</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
