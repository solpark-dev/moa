import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Shield,
  Zap,
  Play,
  Star,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageQ - "Dark Glassmorphism"
 *
 * Design Direction:
 * - Dark background with purple/pink gradient blobs
 * - Glassmorphism cards with backdrop-blur
 * - Floating 3D spheres (pink, purple, fuchsia)
 * - Color palette: Black + Purple + Pink + Fuchsia
 * - Elegant, modern, premium feel
 */

// Floating Sphere Component - 3D 느낌의 떠다니는 구체
function FloatingSphere({ size, color, position, delay = 0, duration = 15 }) {
  const gradients = {
    pink: "radial-gradient(circle at 30% 30%, #FDA4AF, #EC4899, #BE185D)",
    purple: "radial-gradient(circle at 30% 30%, #C4B5FD, #8B5CF6, #5B21B6)",
    fuchsia: "radial-gradient(circle at 30% 30%, #F0ABFC, #D946EF, #A21CAF)",
    white: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
  };

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: gradients[color],
        boxShadow: `
          0 0 60px rgba(236, 72, 153, 0.3),
          inset 0 0 60px rgba(255, 255, 255, 0.1)
        `,
        ...position,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.05, 1],
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

// Glass Card Component
function GlassCard({ children, className = "", hover = true, intensity = "medium" }) {
  const intensities = {
    light: "bg-white/5 border-white/10",
    medium: "bg-white/10 border-white/20",
    strong: "bg-white/15 border-white/30",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden
        ${intensities[intensity]}
        backdrop-blur-xl
        rounded-3xl
        border
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        ${className}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}

// Glass Button Component
function GlassButton({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: `
      bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500
      text-white
      shadow-lg shadow-purple-500/25
      hover:shadow-xl hover:shadow-purple-500/40
      hover:from-purple-400 hover:via-fuchsia-400 hover:to-pink-400
    `,
    glass: `
      bg-white/10 backdrop-blur-md
      border border-white/20
      text-white
      hover:bg-white/20
    `,
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

// Numbered Step Button (from reference image 1)
function StepButton({ number, active = false }) {
  return (
    <div
      className={`
        w-12 h-12 rounded-full
        flex items-center justify-center
        font-bold text-sm
        transition-all duration-300
        ${active
          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
          : "bg-white/10 backdrop-blur-md border border-white/20 text-white/60"
        }
      `}
    >
      {number.toString().padStart(2, "0")}
    </div>
  );
}

export default function LandingPageQ() {
  const features = [
    {
      icon: Users,
      title: "파티 공유",
      desc: "최대 4명이 하나의 구독을 나눠요",
      number: "01",
    },
    {
      icon: Shield,
      title: "안전 보장",
      desc: "보증금으로 안심하고 이용하세요",
      number: "02",
    },
    {
      icon: Zap,
      title: "즉시 시작",
      desc: "가입 후 바로 시청 가능해요",
      number: "03",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Background with gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large gradient blobs - inspired by reference image 2 */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(139,92,246,0) 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-[10%] right-[-15%] w-[700px] h-[700px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0) 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <motion.div
          className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(217,70,239,0.4) 0%, rgba(217,70,239,0) 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        {/* Floating 3D spheres - inspired by reference image 3 */}
        <FloatingSphere
          size={120}
          color="pink"
          position={{ top: "15%", right: "10%" }}
          delay={0}
          duration={12}
        />
        <FloatingSphere
          size={80}
          color="purple"
          position={{ top: "60%", left: "5%" }}
          delay={2}
          duration={15}
        />
        <FloatingSphere
          size={60}
          color="fuchsia"
          position={{ top: "30%", left: "15%" }}
          delay={1}
          duration={18}
        />
        <FloatingSphere
          size={100}
          color="pink"
          position={{ bottom: "20%", right: "15%" }}
          delay={3}
          duration={14}
        />
        <FloatingSphere
          size={40}
          color="white"
          position={{ top: "45%", right: "25%" }}
          delay={2}
          duration={10}
        />
        <FloatingSphere
          size={50}
          color="purple"
          position={{ bottom: "30%", left: "25%" }}
          delay={4}
          duration={16}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
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
            className="text-2xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              MoA
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              to="/party"
              className="hidden md:block px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              파티 찾기
            </Link>
            <Link to="/login">
              <GlassButton variant="glass" className="!px-6 !py-2.5 !text-sm">
                로그인
              </GlassButton>
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
            >
              <GlassCard
                className="inline-flex items-center gap-2 !rounded-full px-5 py-2.5 mb-8"
                hover={false}
                intensity="light"
              >
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                <span className="text-sm font-medium text-white/80">구독료 최대 75% 절약</span>
              </GlassCard>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1] mb-8"
            >
              <span className="block text-white">스마트하게</span>
              <span className="block mt-3 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                공유하세요
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-12 leading-relaxed"
            >
              Netflix, Disney+, Wavve 등 프리미엄 OTT를
              <br className="hidden sm:block" />
              친구들과 함께 나눠보세요
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/party">
                <GlassButton variant="primary" className="w-full sm:w-auto inline-flex items-center justify-center gap-2">
                  파티 둘러보기
                  <ArrowRight className="w-5 h-5" />
                </GlassButton>
              </Link>
              <Link to="/party/create">
                <GlassButton variant="glass" className="w-full sm:w-auto inline-flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  파티 만들기
                </GlassButton>
              </Link>
            </motion.div>
          </div>

          {/* Hero Glass Card - Credit card style inspired by reference 3 */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 flex justify-center"
          >
            <GlassCard className="w-full max-w-lg p-8" intensity="medium">
              {/* Card header */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-xs font-bold tracking-widest text-white/40 uppercase">
                  Monthly Savings
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-fuchsia-400 text-fuchsia-400" />
                  ))}
                </div>
              </div>

              {/* Savings amount */}
              <div className="mb-8">
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  ₩32,500
                </div>
                <div className="text-white/40 mt-2">예상 월 절약 금액</div>
              </div>

              {/* OTT List */}
              <div className="space-y-3">
                {[
                  { name: "Netflix", price: "4,250원", color: "bg-red-500" },
                  { name: "Disney+", price: "2,475원", color: "bg-blue-600" },
                  { name: "Wavve", price: "3,475원", color: "bg-indigo-500" },
                ].map((ott, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${ott.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                        {ott.name[0]}
                      </div>
                      <span className="font-medium">{ott.name}</span>
                    </div>
                    <span className="text-fuchsia-400 font-bold">{ott.price}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Inspired by reference image 1 */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              왜 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">MoA</span>인가요?
            </h2>
            <p className="text-white/50 text-lg">간편하고 안전한 OTT 공유 플랫폼</p>
          </motion.div>

          {/* Feature cards - glassmorphism style from reference 1 */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-8 h-full text-center" intensity="light">
                  {/* Numbered button */}
                  <div className="flex justify-center mb-6">
                    <StepButton number={i + 1} active={true} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed">{feature.desc}</p>
                </GlassCard>
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
              <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">3단계</span>로 시작
            </h2>
            <p className="text-white/50 text-lg">쉽고 빠르게 시작하세요</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "파티 찾기", desc: "원하는 OTT 서비스의 파티를 검색하세요", icon: "🔍" },
              { num: "02", title: "결제하기", desc: "보증금과 이용료를 안전하게 결제하세요", icon: "💳" },
              { num: "03", title: "바로 시청", desc: "공유받은 계정으로 즉시 시청하세요", icon: "🎬" },
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
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
                >
                  <span className="text-3xl">{step.icon}</span>
                </motion.div>
                <div className="text-xs font-bold text-fuchsia-400 tracking-widest mb-2">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/50">{step.desc}</p>
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
              <p className="text-white/50">지금 바로 참여할 수 있어요</p>
            </div>
            <Link
              to="/party"
              className="inline-flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors"
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
                <GlassCard className="overflow-hidden" intensity="light">
                  {/* Image */}
                  <div className="relative h-32 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                    <span className="text-4xl font-black text-white/10">{party.platform}</span>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-fuchsia-500/80 backdrop-blur-sm text-white text-xs font-bold">
                      모집중
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold mb-2">{party.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-white/40">
                        <Users className="w-4 h-4" />
                        <span>{party.members}명</span>
                      </div>
                      <span className="font-bold text-fuchsia-400">{party.price}</span>
                    </div>
                  </div>
                </GlassCard>
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
          >
            <GlassCard className="p-12 md:p-16 text-center" intensity="medium">
              {/* Background gradient accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 rounded-3xl" />

              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-6xl mb-6"
                >
                  ✨
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                  지금 바로 시작하세요
                </h2>
                <p className="text-lg text-white/50 mb-10 max-w-md mx-auto">
                  매달 빠져나가는 구독료, MoA와 함께 현명하게 절약하세요
                </p>
                <Link to="/party">
                  <GlassButton variant="primary" className="text-lg px-10 py-5">
                    <span className="flex items-center gap-2">
                      무료로 시작하기
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 md:px-12 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-black bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            MoA
          </div>
          <p className="text-white/30 text-sm">
            © 2024 MoA. 스마트하게 공유하세요.
          </p>
        </div>
      </footer>
    </div>
  );
}
