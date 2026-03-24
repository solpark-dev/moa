import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Users,
  Shield,
  Star,
  Sparkles,
  Play,
  Check,
  ArrowUpRight
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageO - "Neo-Brutalist Pop"
 *
 * Design Direction:
 * - Enhanced version of Variant D's Pop & Vibrant style
 * - Neo-brutalist aesthetic with bold borders and shadows
 * - Vibrant color palette: Yellow, Hot Pink, Lime, Cyan
 * - Sticker-like elements with random rotations
 * - Marquee scrolling text bands
 * - Playful, energetic, Gen-Z friendly vibe
 * - Heavy black borders, chunky shadows
 */

// Sticker Component - 스티커처럼 보이는 요소
function Sticker({ children, color = "bg-white", rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: rotate + 5 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${color}
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
       
        transition-all duration-200
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

// Pop Button Component
function PopButton({ children, color = "bg-pink-500", className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${color}
        px-8 py-4
        font-black text-xl
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:translate-x-[4px] hover:translate-y-[4px]
        transition-all duration-200
        rounded-2xl
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Marquee Component - 흐르는 텍스트
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

// Bouncy Card Component
function BouncyCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ y: -10, rotate: 2 }}
      className={`
        bg-white
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        rounded-3xl
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPageO() {
  const features = [
    {
      icon: Users,
      title: "파티 공유",
      desc: "최대 4명과 함께!",
      color: "bg-cyan-400",
      emoji: "🎉"
    },
    {
      icon: Shield,
      title: "안전 보장",
      desc: "보증금으로 안심!",
      color: "bg-lime-400",
      emoji: "🛡️"
    },
    {
      icon: Zap,
      title: "즉시 시작",
      desc: "가입하면 바로!",
      color: "bg-pink-400",
      emoji: "⚡"
    },
  ];

  const ottLogos = [
    { name: "Netflix", letter: "N", color: "bg-red-600" },
    { name: "Disney+", letter: "D+", color: "bg-blue-600" },
    { name: "Wavve", letter: "W", color: "bg-indigo-600" },
    { name: "Tving", letter: "T", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-yellow-400 text-black overflow-hidden">
      {/* Dot Pattern Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            className="relative"
          >
            <Sticker color="bg-white" rotate={-3} className="px-4 py-2 rounded-xl">
              <span className="text-2xl font-black tracking-tight">MoA!</span>
            </Sticker>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              to="/party"
              className="hidden md:block px-4 py-2 font-bold text-black hover:bg-black hover:text-yellow-400 rounded-xl transition-colors border border-gray-200"
            >
              파티 찾기
            </Link>
            <Sticker color="bg-pink-500" rotate={2} className="px-5 py-2 rounded-xl cursor-pointer">
              <Link to="/login" className="font-bold text-white">로그인</Link>
            </Sticker>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Floating Decorations */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-20 right-[10%] hidden lg:block"
          >
            <Sticker color="bg-cyan-400" rotate={12} className="px-4 py-2 rounded-xl">
              <span className="font-black text-lg">75% OFF! 🔥</span>
            </Sticker>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0], rotate: [-8, -12, -8] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            className="absolute top-40 left-[5%] hidden lg:block"
          >
            <Sticker color="bg-lime-400" rotate={-8} className="px-3 py-1 rounded-lg">
              <span className="font-bold text-sm">NEW! ✨</span>
            </Sticker>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter mb-8"
              >
                <span className="block transform -rotate-2 text-black">SHARE</span>
                <span className="block transform rotate-1">
                  <span className="text-white">YOUR</span>
                </span>
                <span className="block transform -rotate-1 text-pink-500">
                  OTT!
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Sticker color="bg-white" rotate={1} className="inline-block px-6 py-3 rounded-xl mb-8">
                  <p className="text-xl md:text-2xl font-bold">
                    구독료 걱정? 이제 끝! 🍿
                  </p>
                </Sticker>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/party">
                  <PopButton color="bg-pink-500 text-white">
                    <span className="flex items-center gap-2">
                      파티 시작하기
                      <ArrowRight className="w-6 h-6" />
                    </span>
                  </PopButton>
                </Link>
                <Link to="/party/create">
                  <PopButton color="bg-white text-black">
                    <span className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      파티 만들기
                    </span>
                  </PopButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Hero Card Stack */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Main Card */}
              <Sticker
                color="bg-white"
                rotate={3}
                className="w-full max-w-sm p-6 rounded-3xl"
              >
                <div className="text-center mb-4">
                  <span className="text-sm font-bold text-pink-500 uppercase tracking-wider">이번 달 예상 절약</span>
                </div>

                <div className="space-y-4 mb-6">
                  {ottLogos.slice(0, 3).map((ott, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${ott.color} rounded-lg flex items-center justify-center text-white font-bold text-sm border border-gray-200`}>
                          {ott.letter}
                        </div>
                        <span className="font-bold">{ott.name}</span>
                      </div>
                      <span className="font-black text-lg">-75%</span>
                    </div>
                  ))}
                </div>

                <div className="bg-black text-white p-4 rounded-2xl text-center">
                  <p className="text-sm mb-1">매달 절약하는 금액</p>
                  <p className="text-3xl font-black">₩32,500 💰</p>
                </div>
              </Sticker>

              {/* Background decorative cards */}
              <div className="absolute -top-4 -left-4 w-full max-w-sm h-full bg-cyan-400 rounded-3xl border border-gray-200 -z-10 transform -rotate-6" />
              <div className="absolute -top-8 -left-8 w-full max-w-sm h-full bg-pink-400 rounded-3xl border border-gray-200 -z-20 transform -rotate-12" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Band */}
      <div className="bg-black text-white py-4 border-y-4 border-black">
        <Marquee speed={25}>
          <div className="flex items-center gap-8 px-4">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-4 text-xl font-black uppercase tracking-wider">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                Netflix
                <Star className="w-6 h-6 text-pink-400 fill-pink-400" />
                Disney+
                <Star className="w-6 h-6 text-cyan-400 fill-cyan-400" />
                Wavve
                <Star className="w-6 h-6 text-lime-400 fill-lime-400" />
                Tving
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Features Section */}
      <section className="relative px-6 md:px-12 py-24 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Sticker color="bg-yellow-400" rotate={-2} className="inline-block px-6 py-3 rounded-xl mb-6">
              <span className="text-2xl font-black">WHY MoA? 🤔</span>
            </Sticker>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              이래서 <span className="text-pink-500">MoA</span>야!
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -3 : 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
              >
                <BouncyCard className="p-8 h-full" delay={i * 0.1}>
                  <div className={`w-20 h-20 ${feature.color} rounded-2xl border border-gray-200 flex items-center justify-center mb-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
                    <span className="text-4xl">{feature.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                  <p className="text-lg text-gray-600 font-medium">{feature.desc}</p>
                </BouncyCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Marquee */}
      <div className="bg-pink-500 text-white py-4 border-y-4 border-black">
        <Marquee direction="right" speed={30}>
          <div className="flex items-center gap-12 px-4">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="flex items-center gap-12 text-xl font-black uppercase">
                <span>10K+ 사용자 🎉</span>
                <span>•</span>
                <span>75% 절약 💰</span>
                <span>•</span>
                <span>4.9★ 만족도 ⭐</span>
                <span>•</span>
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Party Preview Section */}
      <section className="relative px-6 md:px-12 py-24 bg-lime-400 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <Sticker color="bg-white" rotate={-1} className="inline-block px-4 py-2 rounded-xl mb-4">
                <span className="font-bold text-pink-500">HOT! 🔥</span>
              </Sticker>
              <h2 className="text-4xl md:text-5xl font-black">지금 뜨는 파티</h2>
            </div>
            <Link to="/party">
              <Sticker color="bg-black" rotate={2} className="px-5 py-3 rounded-xl cursor-pointer">
                <span className="flex items-center gap-2 text-white font-bold">
                  전체 보기 <ArrowUpRight className="w-5 h-5" />
                </span>
              </Sticker>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <BouncyCard key={i} delay={i * 0.1}>
                {/* Image */}
                <div className={`h-36 ${i % 4 === 0 ? 'bg-red-500' : i % 4 === 1 ? 'bg-blue-500' : i % 4 === 2 ? 'bg-indigo-500' : 'bg-pink-500'} flex items-center justify-center relative`}>
                  <span className="text-6xl font-black text-white/20">{party.platform}</span>
                  <div className="absolute top-3 left-3">
                    <Sticker color="bg-yellow-400" rotate={-3} className="px-2 py-1 rounded-lg">
                      <span className="text-xs font-bold">모집중 🙋</span>
                    </Sticker>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-black text-lg mb-2">{party.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{party.members}명</span>
                    </div>
                    <span className="font-black text-pink-500 text-lg">{party.price}</span>
                  </div>
                </div>
              </BouncyCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-6 md:px-12 py-24 bg-cyan-400 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              쉽게 시작해요! 👇
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "파티 찾기", desc: "원하는 OTT 파티를 검색!", emoji: "🔍", color: "bg-yellow-400" },
              { num: "02", title: "결제하기", desc: "안전하게 결제 완료!", emoji: "💳", color: "bg-pink-500" },
              { num: "03", title: "바로 시청", desc: "즉시 시청 시작!", emoji: "🎬", color: "bg-lime-400" },
            ].map((step, i) => (
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
                  className={`w-28 h-28 ${step.color} rounded-3xl border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] mx-auto mb-6 flex items-center justify-center`}
                >
                  <span className="text-5xl">{step.emoji}</span>
                </motion.div>
                <div className="inline-block bg-black text-white px-4 py-1 rounded-full font-black text-sm mb-4">
                  STEP {step.num}
                </div>
                <h3 className="text-2xl font-black mb-2">{step.title}</h3>
                <p className="text-lg font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-12 py-24 bg-yellow-400">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sticker
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
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                지금 바로<br />
                <span className="text-pink-500">시작해볼까요?</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 font-medium">
                매달 빠져나가는 구독료, 이제 친구들과 나눠요!
              </p>
              <Link to="/party">
                <PopButton color="bg-pink-500 text-white" className="text-2xl px-12 py-6">
                  <span className="flex items-center gap-3">
                    무료로 시작하기
                    <Sparkles className="w-7 h-7" />
                  </span>
                </PopButton>
              </Link>
            </Sticker>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sticker color="bg-yellow-400" rotate={-3} className="px-3 py-1 rounded-lg">
              <span className="font-black text-black">MoA!</span>
            </Sticker>
          </div>
          <p className="text-gray-400 font-medium">
            © 2024 MoA. 함께 보면 더 좋아! 🍿
          </p>
        </div>
      </footer>
    </div>
  );
}
