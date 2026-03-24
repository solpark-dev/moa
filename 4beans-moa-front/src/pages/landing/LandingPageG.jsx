import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Users, Shield, Zap, ArrowRight, Play } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageG - "Aurora Glassmorphism"
 *
 * Design Direction:
 * - Dreamy aurora background with animated gradients
 * - Glassmorphism cards with backdrop blur
 * - Floating elements and subtle parallax
 * - Soft, ethereal color palette (cyan, purple, pink)
 */
export default function LandingPageG() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    { icon: Users, title: "함께 공유", desc: "최대 4명이 하나의 구독을 나눠요" },
    { icon: Shield, title: "안전 보장", desc: "보증금으로 안심하고 이용하세요" },
    { icon: Zap, title: "즉시 시작", desc: "가입 후 바로 시청 가능해요" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Animated Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Aurora layers */}
        <motion.div
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          className="absolute -top-1/2 -left-1/2 w-full h-full"
        >
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-500/30 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/25 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-500/20 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: "2s" }} />
        </motion.div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">최대 75% 절약하세요</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95] tracking-tight"
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300">
              함께 보면
            </span>
            <span className="block mt-2 text-white">
              더 좋아지는 것들
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Netflix, Disney+, Wavve 등 프리미엄 OTT를
            <br className="hidden sm:block" />
            스마트하게 공유하세요
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/party"
              className="group relative px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden"
            >
              {/* Glass button background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-90" />
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                파티 찾아보기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              to="/party/create"
              className="group px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                파티 만들기
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              왜 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">MoA</span>인가요?
            </h2>
            <p className="text-xl text-slate-400">간편하고 안전한 OTT 공유 플랫폼</p>
          </motion.div>

          {/* Glass cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-6 border border-white/10">
                    <feature.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Parties */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">인기 파티</h2>
              <p className="text-xl text-slate-400">지금 가장 핫한 공유 파티</p>
            </div>
            <Link
              to="/party"
              className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
            >
              전체 보기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Party cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/10">{party.platform}</span>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                  {/* Status badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-500/80 backdrop-blur-sm text-xs font-bold">
                    모집중
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                    {party.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{party.members}명 참여중</span>
                    <span className="text-cyan-400 font-bold">{party.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Large glass card */}
          <div className="relative p-12 md:p-16 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                지금 시작하세요
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-lg mx-auto">
                매달 불필요하게 나가는 구독료,
                <br />
                MoA와 함께 현명하게 절약하세요
              </p>
              <Link
                to="/party"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg shadow-cyan-500/25"
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            MoA
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 MoA. 함께 보면 더 좋아지는 것들.
          </p>
        </div>
      </footer>
    </div>
  );
}
