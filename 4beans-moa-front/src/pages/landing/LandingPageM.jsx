import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Zap,
  Play,
  ChevronRight,
  Star,
  TrendingUp
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageM - "Bento Grid + 3D Spatial"
 *
 * Design Direction:
 * - Apple-style bento grid layout with varied card sizes
 * - 3D perspective and depth effects
 * - Luminous gradients inspired by Microsoft.ai
 * - Interactive tilt effect on cards
 * - Dark theme with vibrant accents
 * - Modern, spatial, premium feel
 */

// 3D Tilt Card Component
function TiltCard({ children, className = "", glowColor = "rgba(59, 130, 246, 0.5)" }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-px rounded-[inherit] opacity-0 blur-xl transition-opacity duration-500 pointer-events-none"
        style={{
          background: glowColor,
          opacity: isHovered ? 0.4 : 0
        }}
      />
      {children}
    </motion.div>
  );
}

// Animated Counter Component
function AnimatedNumber({ value, suffix = "" }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="tabular-nums"
    >
      {value}{suffix}
    </motion.span>
  );
}

export default function LandingPageM() {
  const features = [
    {
      icon: Users,
      title: "파티 공유",
      desc: "최대 4명과 함께",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Shield,
      title: "안전 보장",
      desc: "보증금 시스템",
      color: "from-emerald-500 to-teal-400"
    },
    {
      icon: Zap,
      title: "즉시 시작",
      desc: "가입 후 바로 이용",
      color: "from-amber-500 to-orange-400"
    },
  ];

  const stats = [
    { value: "75", suffix: "%", label: "평균 절약률" },
    { value: "10K", suffix: "+", label: "활성 사용자" },
    { value: "4.9", suffix: "", label: "평점" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[80px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              MoA
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-8"
          >
            <Link to="/party" className="text-sm text-white/60 hover:text-white transition-colors hidden md:block">
              파티 찾기
            </Link>
            <Link to="/party/create" className="text-sm text-white/60 hover:text-white transition-colors hidden md:block">
              파티 만들기
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all"
            >
              로그인
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white/70">스마트한 구독 공유 플랫폼</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8"
            >
              <span className="block">OTT 구독료</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                최대 75% 절약
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12"
            >
              Netflix, Disney+, Wavve 등 프리미엄 OTT 서비스를
              <br className="hidden sm:block" />
              안전하게 공유하고 구독료를 나누세요
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/party"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all shadow-lg shadow-blue-500/25"
              >
                파티 둘러보기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/party/create"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <Play className="w-5 h-5" />
                파티 만들기
              </Link>
            </motion.div>
          </div>

          {/* Bento Grid */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[140px] md:auto-rows-[160px]"
            style={{ perspective: "1000px" }}
          >
            {/* Large Feature Card */}
            <TiltCard
              className="col-span-2 row-span-2 rounded-3xl"
              glowColor="rgba(59, 130, 246, 0.4)"
            >
              <div className="w-full h-full p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-sm flex flex-col justify-between overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-[-50%] right-[-30%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">파티 공유</h3>
                  <p className="text-white/50">최대 4명과 함께 구독료를 나누세요</p>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-sm text-blue-400">
                  <span>자세히 보기</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </TiltCard>

            {/* Stats Cards */}
            {stats.map((stat, i) => (
              <TiltCard
                key={i}
                className="col-span-1 row-span-1 rounded-2xl"
                glowColor={i === 0 ? "rgba(34, 197, 94, 0.4)" : i === 1 ? "rgba(168, 85, 247, 0.4)" : "rgba(251, 191, 36, 0.4)"}
              >
                <div className="w-full h-full p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between">
                  <span className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</span>
                  <div className="text-3xl md:text-4xl font-black">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                </div>
              </TiltCard>
            ))}

            {/* OTT Showcase Card */}
            <TiltCard
              className="col-span-2 md:col-span-2 row-span-1 rounded-2xl"
              glowColor="rgba(236, 72, 153, 0.4)"
            >
              <div className="w-full h-full p-5 rounded-2xl bg-gradient-to-r from-pink-600/20 to-red-600/20 border border-white/10 backdrop-blur-sm flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["N", "D+", "W", "T"].map((logo, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-sm font-bold"
                    >
                      {logo}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-white/50">지원 서비스</p>
                  <p className="font-semibold">Netflix, Disney+ 등 10+</p>
                </div>
              </div>
            </TiltCard>

            {/* Feature Cards */}
            {features.slice(1).map((feature, i) => (
              <TiltCard
                key={i}
                className="col-span-1 row-span-1 rounded-2xl"
                glowColor={i === 0 ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)"}
              >
                <div className="w-full h-full p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{feature.title}</p>
                    <p className="text-xs text-white/40">{feature.desc}</p>
                  </div>
                </div>
              </TiltCard>
            ))}

            {/* Trending Card */}
            <TiltCard
              className="col-span-2 row-span-1 rounded-2xl"
              glowColor="rgba(99, 102, 241, 0.4)"
            >
              <div className="w-full h-full p-5 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-white/10 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">이번 주 인기</p>
                    <p className="font-semibold">넷플릭스 프리미엄</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                  <Star className="w-3 h-3 fill-current" />
                  <span>HOT</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Party Preview Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                지금 모집 중인 파티
              </h2>
              <p className="text-white/50 text-lg">바로 참여 가능한 인기 파티를 확인하세요</p>
            </div>
            <Link
              to="/party"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              전체 보기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Party Cards Grid */}
          <div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
            style={{ perspective: "1000px" }}
          >
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard
                  className="rounded-2xl"
                  glowColor="rgba(99, 102, 241, 0.3)"
                >
                  <div className="group w-full h-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors">
                    {/* Image Area */}
                    <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-black text-white/5">{party.platform}</span>
                      </div>

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

                      {/* Status badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-500/80 backdrop-blur-sm text-xs font-bold">
                        모집중
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-3 group-hover:text-blue-400 transition-colors">
                        {party.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/40">{party.members}명 참여중</span>
                        <span className="text-blue-400 font-bold">{party.price}</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              3단계로 시작하세요
            </h2>
            <p className="text-white/50 text-lg">간단한 과정으로 바로 이용 가능해요</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "파티 선택", desc: "원하는 OTT 서비스의 파티를 검색하고 선택하세요", color: "from-blue-500 to-cyan-500" },
              { step: "02", title: "결제 완료", desc: "보증금과 첫 달 이용료를 안전하게 결제하세요", color: "from-purple-500 to-pink-500" },
              { step: "03", title: "바로 시청", desc: "파티장이 공유한 계정으로 즉시 시청하세요", color: "from-amber-500 to-orange-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <TiltCard
                  className="h-full rounded-3xl"
                  glowColor={i === 0 ? "rgba(59, 130, 246, 0.3)" : i === 1 ? "rgba(168, 85, 247, 0.3)" : "rgba(245, 158, 11, 0.3)"}
                >
                  <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} mb-6`}>
                      <span className="text-xl font-black">{item.step}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <TiltCard
            className="rounded-[2.5rem]"
            glowColor="rgba(99, 102, 241, 0.4)"
          >
            <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-sm text-center overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                  지금 바로 시작하세요
                </h2>
                <p className="text-xl text-white/50 mb-10 max-w-lg mx-auto">
                  매달 빠져나가는 구독료, MoA와 함께 현명하게 절약하세요
                </p>
                <Link
                  to="/party"
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all shadow-lg shadow-blue-500/25"
                >
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 md:px-12 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            MoA
          </div>
          <p className="text-white/30 text-sm">
            © 2024 MoA. 함께 보면 더 좋아지는 것들.
          </p>
        </div>
      </footer>
    </div>
  );
}
