import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Users,
  Shield,
  Zap,
  Command,
  Sparkles,
  ChevronRight,
  Play,
  Star
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageR - "Linear + Raycast Style"
 *
 * Design References:
 * - Linear: Dark theme, gradient text, clean typography, enterprise feel
 * - Raycast: 3D cube animation, glass effects, vibrant gradients, developer-focused
 *
 * Features:
 * - Deep dark background (#08090a)
 * - Gradient text headings
 * - Interactive 3D cube
 * - Glass morphism cards
 * - Pink/Cyan/Purple accents
 */

// 3D Rotating Cube Component (Raycast inspired)
function RotatingCube() {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState({ x: -20, y: 45 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / rect.width) * 30;
      const rotateX = -((e.clientY - centerY) / rect.height) * 30;
      setRotation({ x: rotateX - 20, y: rotateY + 45 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-48 h-48 mx-auto" style={{ perspective: "1000px" }}>
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {/* Cube faces */}
        {[
          { transform: "translateZ(96px)", bg: "from-pink-500/20 to-purple-500/20" },
          { transform: "rotateY(180deg) translateZ(96px)", bg: "from-cyan-500/20 to-blue-500/20" },
          { transform: "rotateY(90deg) translateZ(96px)", bg: "from-purple-500/20 to-pink-500/20" },
          { transform: "rotateY(-90deg) translateZ(96px)", bg: "from-blue-500/20 to-cyan-500/20" },
          { transform: "rotateX(90deg) translateZ(96px)", bg: "from-pink-500/20 to-cyan-500/20" },
          { transform: "rotateX(-90deg) translateZ(96px)", bg: "from-cyan-500/20 to-purple-500/20" },
        ].map((face, i) => (
          <div
            key={i}
            className={`absolute w-48 h-48 bg-gradient-to-br ${face.bg} backdrop-blur-sm border border-white/10 rounded-2xl`}
            style={{ transform: face.transform, backfaceVisibility: "hidden" }}
          />
        ))}
      </motion.div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl -z-10" />
    </div>
  );
}

// Gradient Text Component (Linear inspired)
function GradientText({ children, className = "" }) {
  return (
    <span
      className={`bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}

// Feature Card (Linear + Raycast hybrid)
function FeatureCard({ icon: Icon, title, description, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Hover gradient */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4 group-hover:bg-white/[0.1] transition-colors">
          <Icon className="w-5 h-5 text-white/70" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/50 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Command Palette Style Input (Raycast inspired)
function CommandInput() {
  return (
    <div className="relative max-w-md mx-auto">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm">
        <Command className="w-4 h-4 text-white/40" />
        <span className="text-white/40 text-sm">파티 검색...</span>
        <div className="ml-auto flex items-center gap-1">
          <kbd className="px-2 py-0.5 text-xs rounded bg-white/[0.1] text-white/50 font-mono">⌘</kbd>
          <kbd className="px-2 py-0.5 text-xs rounded bg-white/[0.1] text-white/50 font-mono">K</kbd>
        </div>
      </div>
    </div>
  );
}

export default function LandingPageR() {
  const features = [
    {
      icon: Users,
      title: "파티 공유",
      description: "최대 4명이 하나의 구독을 나눠 사용하세요",
      gradient: "from-pink-500/5 to-transparent",
    },
    {
      icon: Shield,
      title: "안전한 거래",
      description: "보증금 시스템으로 안심하고 이용하세요",
      gradient: "from-cyan-500/5 to-transparent",
    },
    {
      icon: Zap,
      title: "빠른 시작",
      description: "가입 즉시 OTT 서비스를 시청할 수 있어요",
      gradient: "from-purple-500/5 to-transparent",
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090a] text-white overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-bold">M</span>
            </div>
            <span className="text-lg font-semibold">MoA</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-6"
          >
            <Link to="/party" className="text-sm text-white/60 hover:text-white transition-colors hidden md:block">
              파티
            </Link>
            <Link to="/product" className="text-sm text-white/60 hover:text-white transition-colors hidden md:block">
              서비스
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white/[0.08] hover:bg-white/[0.12] transition-colors"
            >
              로그인
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-20 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-xs text-white/70">최대 75% 구독료 절약</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              <GradientText>OTT 구독의</GradientText>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                새로운 방식
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/40 max-w-lg mx-auto mb-10"
            >
              Netflix, Disney+, Wavve 등 프리미엄 OTT를
              <br />
              스마트하게 공유하세요
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
            >
              <Link
                to="/party"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors"
              >
                시작하기
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/party/create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/[0.08] text-white font-medium text-sm hover:bg-white/[0.12] transition-colors"
              >
                <Play className="w-4 h-4" />
                파티 만들기
              </Link>
            </motion.div>

            {/* Command Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CommandInput />
            </motion.div>
          </div>

          {/* 3D Cube */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20"
          >
            <RotatingCube />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText>왜 MoA인가요?</GradientText>
            </h2>
            <p className="text-white/40">효율적인 OTT 공유 플랫폼</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Party Preview */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <GradientText>인기 파티</GradientText>
              </h2>
              <p className="text-white/40 text-sm">지금 바로 참여할 수 있어요</p>
            </div>
            <Link
              to="/party"
              className="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors"
            >
              전체 보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-white/70">
                    {party.serviceName?.[0] || "O"}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{party.serviceName || "OTT"}</div>
                    <div className="text-xs text-white/40">{party.currentMembers || 0}명 참여중</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">월 이용료</span>
                  <span className="text-sm font-semibold text-pink-400">₩{(party.pricePerMonth || 0).toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06]"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                지금 시작하세요
              </span>
            </h2>
            <p className="text-white/40 mb-8">
              매달 빠져나가는 구독료를 현명하게 관리하세요
            </p>
            <Link
              to="/party"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              무료로 시작하기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 md:px-12 py-12 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-medium">MoA</span>
          </div>
          <p className="text-xs text-white/30">© 2024 MoA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
