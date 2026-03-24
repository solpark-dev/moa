import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Heart,
  Star,
  Play,
  Check,
  ArrowUpRight
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageN - "Dreamy Pastel + Floating World"
 *
 * Design Direction:
 * - Bright, soft pastel color palette (cream, pink, mint, lavender)
 * - Gradient mesh backgrounds with organic flow
 * - Floating blob shapes with parallax effect
 * - Playful, rounded typography
 * - Friendly micro-interactions
 * - Whimsical, approachable feel
 */

// Floating Blob Component
function FloatingBlob({ className, delay = 0, duration = 20 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

// Floating Shape Component
function FloatingShape({ children, className, yOffset = 50, delay = 0 }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, yOffset]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ y: springY }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Soft Card Component
function SoftCard({ children, className = "", hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        bg-white/70 backdrop-blur-xl
        rounded-[2rem]
        border border-white/50
        shadow-[0_8px_32px_rgba(0,0,0,0.06)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// Pill Button Component
function PillButton({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg shadow-rose-300/30 hover:shadow-xl hover:shadow-rose-300/40",
    secondary: "bg-white/80 text-slate-700 border border-slate-200 hover:bg-white hover:border-slate-300",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-8 py-4 rounded-full font-semibold text-lg
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

export default function LandingPageN() {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const features = [
    {
      icon: Users,
      title: "함께 공유해요",
      desc: "최대 4명이 하나의 구독을 나눠요",
      color: "from-rose-400 to-pink-400",
      bg: "bg-rose-50"
    },
    {
      icon: Shield,
      title: "안전하게 보호해요",
      desc: "보증금으로 안심하고 이용하세요",
      color: "from-emerald-400 to-teal-400",
      bg: "bg-emerald-50"
    },
    {
      icon: Heart,
      title: "즐겁게 절약해요",
      desc: "최대 75%까지 구독료를 아껴요",
      color: "from-violet-400 to-purple-400",
      bg: "bg-violet-50"
    },
  ];

  const steps = [
    { num: "1", title: "파티 찾기", desc: "원하는 OTT 서비스의 파티를 찾아보세요", emoji: "🔍" },
    { num: "2", title: "결제하기", desc: "보증금과 이용료를 안전하게 결제해요", emoji: "💳" },
    { num: "3", title: "바로 시청", desc: "공유받은 계정으로 즉시 시청하세요", emoji: "🎬" },
  ];

  return (
    <div className="min-h-screen bg-[#fffbf7] text-slate-800 overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main gradient blobs */}
        <FloatingBlob
          className="w-[800px] h-[800px] bg-gradient-to-br from-rose-200/60 to-pink-200/60 -top-[200px] -left-[200px]"
          delay={0}
          duration={25}
        />
        <FloatingBlob
          className="w-[600px] h-[600px] bg-gradient-to-br from-sky-200/50 to-cyan-200/50 top-[20%] -right-[150px]"
          delay={2}
          duration={22}
        />
        <FloatingBlob
          className="w-[500px] h-[500px] bg-gradient-to-br from-violet-200/40 to-purple-200/40 bottom-[10%] left-[10%]"
          delay={4}
          duration={28}
        />
        <FloatingBlob
          className="w-[400px] h-[400px] bg-gradient-to-br from-amber-200/40 to-orange-200/40 top-[50%] right-[20%]"
          delay={1}
          duration={20}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-300/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">MoA</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link
              to="/party"
              className="hidden md:block px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              파티 찾기
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 text-sm font-semibold rounded-full bg-white/80 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all shadow-sm"
            >
              로그인
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative px-6 md:px-12 pt-8 pb-24"
      >
        <div className="max-w-6xl mx-auto">
          {/* Floating decorative shapes */}
          <FloatingShape
            className="absolute top-10 right-[15%] hidden lg:block"
            yOffset={-30}
            delay={0.3}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-300 rotate-12 shadow-lg shadow-amber-200/50" />
          </FloatingShape>

          <FloatingShape
            className="absolute top-40 left-[5%] hidden lg:block"
            yOffset={40}
            delay={0.5}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-300 to-cyan-300 shadow-lg shadow-sky-200/50" />
          </FloatingShape>

          <FloatingShape
            className="absolute bottom-20 right-[10%] hidden lg:block"
            yOffset={-50}
            delay={0.7}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-300 to-purple-300 -rotate-12 shadow-lg shadow-violet-200/50" />
          </FloatingShape>

          {/* Hero Content */}
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-rose-200 shadow-sm mb-8"
            >
              <span className="text-lg">✨</span>
              <span className="text-sm font-medium text-rose-600">구독료 최대 75% 절약</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1] mb-8"
            >
              <span className="block text-slate-800">함께 보면</span>
              <span className="block mt-3 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                더 즐거워요
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto mb-12 leading-relaxed"
            >
              Netflix, Disney+, Wavve 등<br className="md:hidden" />
              프리미엄 OTT를 친구들과 나눠보세요
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/party">
                <PillButton variant="primary" className="w-full sm:w-auto inline-flex items-center justify-center gap-2">
                  파티 구경하기
                  <ArrowRight className="w-5 h-5" />
                </PillButton>
              </Link>
              <Link to="/party/create">
                <PillButton variant="secondary" className="w-full sm:w-auto inline-flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  파티 만들기
                </PillButton>
              </Link>
            </motion.div>
          </div>

          {/* Hero Cards Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="flex justify-center items-end gap-4 md:gap-6">
              {/* Left Card */}
              <motion.div
                initial={{ rotate: -6 }}
                whileHover={{ rotate: 0, y: -10 }}
                className="w-[140px] md:w-[200px] hidden sm:block"
              >
                <SoftCard className="p-4 md:p-5">
                  <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 mb-3 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl">🎬</span>
                  </div>
                  <p className="font-bold text-sm md:text-base text-slate-700">Netflix</p>
                  <p className="text-xs md:text-sm text-slate-400">3,250원/월</p>
                </SoftCard>
              </motion.div>

              {/* Center Card (Featured) */}
              <motion.div
                whileHover={{ y: -10 }}
                className="w-[180px] md:w-[260px] relative z-10"
              >
                <SoftCard className="p-5 md:p-6 border-2 border-rose-200">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 text-white text-xs font-bold shadow-lg">
                    인기 🔥
                  </div>
                  <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 mb-4 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl">🍿</span>
                  </div>
                  <p className="font-bold text-base md:text-lg text-slate-700">Disney+</p>
                  <p className="text-sm text-slate-400 mb-3">2,475원/월</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </SoftCard>
              </motion.div>

              {/* Right Card */}
              <motion.div
                initial={{ rotate: 6 }}
                whileHover={{ rotate: 0, y: -10 }}
                className="w-[140px] md:w-[200px] hidden sm:block"
              >
                <SoftCard className="p-4 md:p-5">
                  <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100 mb-3 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl">📺</span>
                  </div>
                  <p className="font-bold text-sm md:text-base text-slate-700">Wavve</p>
                  <p className="text-xs md:text-sm text-slate-400">3,475원/월</p>
                </SoftCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-4xl mb-4 block">💝</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              왜 MoA인가요?
            </h2>
            <p className="text-slate-500 text-lg">간편하고 안전한 OTT 공유 플랫폼</p>
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
                <SoftCard className="p-8 h-full">
                  <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </SoftCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-4xl mb-4 block">🚀</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              3단계로 시작해요
            </h2>
            <p className="text-slate-500 text-lg">정말 간단해요, 약속!</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white/80 border border-slate-200 shadow-lg flex items-center justify-center"
                >
                  <span className="text-5xl">{step.emoji}</span>
                </motion.div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold text-sm mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">{step.title}</h3>
                <p className="text-slate-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
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
              <span className="text-4xl mb-4 block">🎉</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                지금 모집 중인 파티
              </h2>
              <p className="text-slate-500">바로 참여할 수 있어요</p>
            </div>
            <Link
              to="/party"
              className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-semibold transition-colors"
            >
              전체 보기
              <ArrowUpRight className="w-5 h-5" />
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
                <SoftCard className="overflow-hidden">
                  {/* Image */}
                  <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                    <span className="text-5xl font-black text-slate-200">{party.platform}</span>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                      모집중
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 mb-2">{party.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{party.members}명</span>
                      </div>
                      <span className="font-bold text-rose-500">{party.price}</span>
                    </div>
                  </div>
                </SoftCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Trust Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <SoftCard className="p-10 md:p-14 text-center" hover={false}>
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-medium text-slate-700 mb-8 leading-relaxed">
                "매달 나가는 구독료가 부담됐는데,<br className="hidden md:block" />
                MoA 덕분에 <span className="text-rose-500 font-bold">월 3만원 이상</span> 절약하고 있어요!"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-300 to-pink-300 flex items-center justify-center text-white font-bold">
                  김
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">김민지</p>
                  <p className="text-sm text-slate-400">MoA 사용자</p>
                </div>
              </div>
            </SoftCard>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-rose-400 via-pink-400 to-violet-400 p-12 md:p-16 text-center text-white"
          >
            {/* Background decorations */}
            <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10">
              <span className="text-5xl mb-6 block">🎊</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                지금 바로 시작해볼까요?
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-md mx-auto">
                매달 빠져나가는 구독료, 이제 친구들과 나눠요
              </p>
              <Link to="/party">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-bold text-lg bg-white text-rose-500 shadow-xl shadow-rose-600/20 hover:shadow-2xl transition-all"
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
      <footer className="relative px-6 md:px-12 py-12 border-t border-slate-200/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-slate-800">MoA</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2024 MoA. 함께 보면 더 즐거워요 💕
          </p>
        </div>
      </footer>
    </div>
  );
}
