import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Users,
  Shield,
  Zap,
  Play,
  Star,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageP - "Geometric Gradient Flow"
 *
 * Design Direction:
 * - Inspired by MoA logo's gradient colors (peach-pink-coral, orange-peach, mint-lime)
 * - Geometric shapes (M zigzag, O circle, A triangle) as decorative elements
 * - Soft, warm gradient mesh backgrounds
 * - Floating geometric shapes with parallax
 * - Light, airy, optimistic feel
 * - Organic curves mixed with geometric precision
 */

// MoA Logo Colors
const colors = {
  peach: "#F4A574",
  pink: "#E8879B",
  coral: "#E57B85",
  orange: "#F9C89B",
  mint: "#8BC5A7",
  lime: "#C5D465",
  olive: "#A8B858",
};

// Floating Geometric Shape Component
function FloatingShape({ type, size, color, position, delay = 0, duration = 20 }) {
  const shapes = {
    circle: (
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
        }}
      />
    ),
    triangle: (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size * 0.866}px solid transparent`,
          background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            width: size,
            height: size * 0.866,
            background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
        />
      </div>
    ),
    ring: (
      <div
        className="rounded-full border-4"
        style={{
          width: size,
          height: size,
          borderColor: color.from,
          opacity: 0.6,
        }}
      />
    ),
    zigzag: (
      <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
        <path
          d="M0 60 L25 10 L50 60 L75 10 L100 60"
          fill="none"
          stroke={`url(#grad-${delay})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id={`grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color.from} />
            <stop offset="100%" stopColor={color.to} />
          </linearGradient>
        </defs>
      </svg>
    ),
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ ...position }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {shapes[type]}
    </motion.div>
  );
}

// Gradient Card Component
function GradientCard({ children, className = "", gradient = "from-white to-white" }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden
        bg-white/80 backdrop-blur-xl
        rounded-3xl
        border border-white/50
        shadow-[0_8px_40px_rgba(244,165,116,0.15)]
        ${className}
      `}
    >
      {/* Gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      {children}
    </motion.div>
  );
}

// Gradient Button Component
function GradientButton({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-[#E8879B] via-[#F4A574] to-[#F9C89B] text-white shadow-lg shadow-[#E8879B]/25 hover:shadow-xl hover:shadow-[#E8879B]/30",
    secondary: "bg-white/90 text-gray-700 border border-[#E8879B]/30 hover:border-[#E8879B]/50 hover:bg-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-8 py-4 rounded-2xl font-semibold text-lg
        transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default function LandingPageP() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const features = [
    {
      icon: Users,
      title: "함께 공유",
      desc: "최대 4명이 하나의 구독을 나눠요",
      gradient: "from-[#E8879B] to-[#F4A574]",
      iconBg: "bg-gradient-to-br from-[#E8879B] to-[#F4A574]"
    },
    {
      icon: Shield,
      title: "안전 보장",
      desc: "보증금으로 안심하고 이용하세요",
      gradient: "from-[#F4A574] to-[#F9C89B]",
      iconBg: "bg-gradient-to-br from-[#F4A574] to-[#F9C89B]"
    },
    {
      icon: Zap,
      title: "즉시 시작",
      desc: "가입 후 바로 시청 가능해요",
      gradient: "from-[#8BC5A7] to-[#C5D465]",
      iconBg: "bg-gradient-to-br from-[#8BC5A7] to-[#C5D465]"
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-gray-800 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large gradient blobs */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute -top-[300px] -left-[200px] w-[800px] h-[800px] rounded-full opacity-40"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#F4A574]/60 via-[#E8879B]/40 to-transparent blur-3xl" />
        </motion.div>

        <motion.div
          className="absolute top-[20%] -right-[200px] w-[600px] h-[600px] rounded-full opacity-30"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -15, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-bl from-[#8BC5A7]/50 via-[#C5D465]/30 to-transparent blur-3xl" />
        </motion.div>

        <motion.div
          className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-25"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 4 }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#E8879B]/40 via-[#F9C89B]/30 to-transparent blur-3xl" />
        </motion.div>

        {/* Floating geometric shapes */}
        <FloatingShape
          type="circle"
          size={60}
          color={{ from: colors.peach, to: colors.pink }}
          position={{ top: "15%", left: "10%" }}
          delay={0}
          duration={15}
        />
        <FloatingShape
          type="ring"
          size={80}
          color={{ from: colors.mint, to: colors.lime }}
          position={{ top: "25%", right: "15%" }}
          delay={2}
          duration={18}
        />
        <FloatingShape
          type="circle"
          size={40}
          color={{ from: colors.coral, to: colors.orange }}
          position={{ top: "60%", left: "8%" }}
          delay={4}
          duration={20}
        />
        <FloatingShape
          type="ring"
          size={100}
          color={{ from: colors.pink, to: colors.peach }}
          position={{ bottom: "20%", right: "10%" }}
          delay={1}
          duration={22}
        />
        <FloatingShape
          type="circle"
          size={30}
          color={{ from: colors.lime, to: colors.mint }}
          position={{ top: "40%", left: "25%" }}
          delay={3}
          duration={16}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1"
          >
            {/* Logo inspired by the image */}
            <svg width="100" height="40" viewBox="0 0 100 40">
              {/* M */}
              <path
                d="M5 35 L5 10 L15 25 L25 10 L25 35"
                fill="none"
                stroke="url(#logo-grad-m)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* O */}
              <circle
                cx="50"
                cy="22"
                r="13"
                fill="none"
                stroke="url(#logo-grad-o)"
                strokeWidth="5"
              />
              {/* A (Triangle) */}
              <path
                d="M70 35 L82 8 L94 35"
                fill="none"
                stroke="url(#logo-grad-a)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="logo-grad-m" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F4A574" />
                  <stop offset="100%" stopColor="#E8879B" />
                </linearGradient>
                <linearGradient id="logo-grad-o" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F4A574" />
                  <stop offset="100%" stopColor="#F9C89B" />
                </linearGradient>
                <linearGradient id="logo-grad-a" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C5D465" />
                  <stop offset="100%" stopColor="#8BC5A7" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              to="/party"
              className="hidden md:block px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-[#E8879B] transition-colors"
            >
              파티 찾기
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#E8879B] to-[#F4A574] text-white shadow-md shadow-[#E8879B]/20 hover:shadow-lg transition-all"
            >
              로그인
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-12 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8879B]/20 shadow-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#E8879B]" />
              <span className="text-sm font-medium text-[#E8879B]">구독료 최대 75% 절약</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1] mb-8"
            >
              <span className="block text-gray-800">모여서</span>
              <span className="block mt-3 bg-gradient-to-r from-[#E8879B] via-[#F4A574] to-[#8BC5A7] bg-clip-text text-transparent">
                함께 즐겨요
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed"
            >
              Netflix, Disney+, Wavve 등 프리미엄 OTT를
              <br className="hidden sm:block" />
              친구들과 스마트하게 공유하세요
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/party">
                <GradientButton variant="primary" className="w-full sm:w-auto inline-flex items-center justify-center gap-2">
                  파티 둘러보기
                  <ArrowRight className="w-5 h-5" />
                </GradientButton>
              </Link>
              <Link to="/party/create">
                <GradientButton variant="secondary" className="w-full sm:w-auto inline-flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  파티 만들기
                </GradientButton>
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual - Geometric Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 flex justify-center"
          >
            <div className="relative">
              {/* Large decorative logo */}
              <svg width="400" height="160" viewBox="0 0 400 160" className="w-full max-w-md">
                {/* M */}
                <motion.path
                  d="M20 140 L20 40 L60 100 L100 40 L100 140"
                  fill="none"
                  stroke="url(#hero-grad-m)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
                {/* O */}
                <motion.circle
                  cx="200"
                  cy="90"
                  r="50"
                  fill="none"
                  stroke="url(#hero-grad-o)"
                  strokeWidth="20"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
                {/* A (Triangle) */}
                <motion.path
                  d="M280 140 L330 30 L380 140"
                  fill="none"
                  stroke="url(#hero-grad-a)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                />
                <defs>
                  <linearGradient id="hero-grad-m" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F4A574" />
                    <stop offset="100%" stopColor="#E8879B" />
                  </linearGradient>
                  <linearGradient id="hero-grad-o" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F4A574" />
                    <stop offset="100%" stopColor="#F9C89B" />
                  </linearGradient>
                  <linearGradient id="hero-grad-a" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C5D465" />
                    <stop offset="100%" stopColor="#8BC5A7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating accent circles */}
              <motion.div
                animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#8BC5A7] to-[#C5D465] shadow-lg"
              />
              <motion.div
                animate={{ y: [0, 10, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-2 -left-6 w-6 h-6 rounded-full bg-gradient-to-br from-[#E8879B] to-[#F4A574] shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              왜 <span className="bg-gradient-to-r from-[#E8879B] to-[#F4A574] bg-clip-text text-transparent">MoA</span>인가요?
            </h2>
            <p className="text-gray-500 text-lg">간편하고 안전한 OTT 공유 플랫폼</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GradientCard className="p-8 h-full" gradient={feature.gradient}>
                  <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              간단한 <span className="bg-gradient-to-r from-[#8BC5A7] to-[#C5D465] bg-clip-text text-transparent">3단계</span>
            </h2>
            <p className="text-gray-500 text-lg">쉽고 빠르게 시작하세요</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "파티 찾기", desc: "원하는 OTT 서비스의 파티를 검색하세요", color: "from-[#E8879B] to-[#F4A574]" },
              { num: "02", title: "결제하기", desc: "보증금과 이용료를 안전하게 결제하세요", color: "from-[#F4A574] to-[#F9C89B]" },
              { num: "03", title: "바로 시청", desc: "공유받은 계정으로 즉시 시청하세요", color: "from-[#8BC5A7] to-[#C5D465]" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-2xl font-black text-white">{step.num}</span>
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Party Preview Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                인기 파티
              </h2>
              <p className="text-gray-500">지금 바로 참여할 수 있어요</p>
            </div>
            <Link
              to="/party"
              className="inline-flex items-center gap-2 text-[#E8879B] hover:text-[#d6768a] font-semibold transition-colors"
            >
              전체 보기
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GradientCard
                  className="overflow-hidden"
                  gradient={i % 3 === 0 ? "from-[#E8879B] to-[#F4A574]" : i % 3 === 1 ? "from-[#F4A574] to-[#F9C89B]" : "from-[#8BC5A7] to-[#C5D465]"}
                >
                  {/* Image */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <span className="text-4xl font-black text-gray-200">{party.platform}</span>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#8BC5A7]/90 text-white text-xs font-bold">
                      모집중
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 mb-2">{party.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{party.members}명</span>
                      </div>
                      <span className="font-bold text-[#E8879B]">{party.price}</span>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#E8879B] via-[#F4A574] to-[#8BC5A7] p-12 md:p-16 text-center text-white"
          >
            {/* Background shapes */}
            <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] rounded-full bg-white/10 blur-2xl" />

            {/* Geometric accents */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-16 h-16 border-4 border-white/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-10 left-10 w-12 h-12 border-4 border-white/20"
              style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                지금 바로 시작하세요
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-md mx-auto">
                매달 빠져나가는 구독료, MoA와 함께 현명하게 절약하세요
              </p>
              <Link to="/party">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-lg bg-white text-[#E8879B] shadow-xl hover:shadow-2xl transition-all"
                >
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 md:px-12 py-12 border-t border-[#E8879B]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <svg width="80" height="32" viewBox="0 0 100 40">
            <path
              d="M5 35 L5 10 L15 25 L25 10 L25 35"
              fill="none"
              stroke="url(#footer-grad-m)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="50"
              cy="22"
              r="13"
              fill="none"
              stroke="url(#footer-grad-o)"
              strokeWidth="5"
            />
            <path
              d="M70 35 L82 8 L94 35"
              fill="none"
              stroke="url(#footer-grad-a)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="footer-grad-m" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F4A574" />
                <stop offset="100%" stopColor="#E8879B" />
              </linearGradient>
              <linearGradient id="footer-grad-o" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4A574" />
                <stop offset="100%" stopColor="#F9C89B" />
              </linearGradient>
              <linearGradient id="footer-grad-a" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C5D465" />
                <stop offset="100%" stopColor="#8BC5A7" />
              </linearGradient>
            </defs>
          </svg>
          <p className="text-gray-400 text-sm">
            © 2024 MoA. 모여서 함께 즐겨요.
          </p>
        </div>
      </footer>
    </div>
  );
}
