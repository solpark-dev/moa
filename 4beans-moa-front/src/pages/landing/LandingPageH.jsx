import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown, Circle } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageH - "Editorial / Magazine Style"
 *
 * Design Direction:
 * - High-end fashion magazine aesthetic
 * - Bold, oversized typography with dramatic contrast
 * - Asymmetric layouts with intentional white space
 * - Monochrome base with single accent color (electric blue)
 * - Sophisticated micro-interactions
 * - Scroll-driven animations
 */
export default function LandingPageH() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const stats = [
    { number: "75%", label: "평균 절약" },
    { number: "10K+", label: "활성 사용자" },
    { number: "4.9", label: "만족도" },
  ];

  return (
    <div className="bg-[#fafafa] text-[#0a0a0a] overflow-x-hidden">
      {/* Fixed navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-white text-2xl font-black tracking-tighter"
          >
            MOA®
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:flex items-center gap-12 text-white text-sm font-medium tracking-wide"
          >
            <Link to="/party" className="hover:opacity-60 transition-opacity">DISCOVER</Link>
            <Link to="/party/create" className="hover:opacity-60 transition-opacity">CREATE</Link>
            <Link to="/login" className="hover:opacity-60 transition-opacity">SIGN IN</Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section - Full viewport, editorial style */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex items-center bg-[#0a0a0a] text-white overflow-hidden"
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            {/* Left: Main headline */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <p className="text-[#00d4ff] text-sm font-bold tracking-[0.3em] uppercase mb-8">
                  OTT Subscription Sharing Platform
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="text-[clamp(3rem,12vw,12rem)] font-black leading-[0.85] tracking-[-0.04em]"
              >
                SHARE
                <br />
                <span className="text-[#00d4ff]">SMART</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-12 text-xl md:text-2xl text-white/60 max-w-xl leading-relaxed font-light"
              >
                프리미엄 구독 서비스를 나누는 가장 세련된 방법.
                <br />
                불필요한 지출은 줄이고, 즐거움은 그대로.
              </motion.p>
            </div>

            {/* Right: CTA */}
            <div className="lg:col-span-4 lg:text-right">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <Link
                  to="/party"
                  className="group inline-flex items-center gap-4 text-lg font-medium"
                >
                  <span className="relative">
                    시작하기
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
                  </span>
                  <span className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-[#00d4ff] group-hover:border-[#00d4ff] transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 group-hover:text-black transition-colors" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-6 md:left-12 flex items-center gap-4 text-sm text-white/40"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="w-4 h-4" />
            </motion.div>
            <span className="tracking-widest uppercase">Scroll</span>
          </motion.div>
        </div>

        {/* Large decorative number */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[40rem] font-black text-white/[0.02] leading-none pointer-events-none select-none hidden xl:block">
          01
        </div>
      </motion.section>

      {/* Stats Section - Horizontal layout */}
      <section className="py-24 border-b border-black/10">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center md:text-left"
              >
                <div className="text-5xl md:text-7xl font-black tracking-tight text-[#0a0a0a]">
                  {stat.number}
                </div>
                <div className="mt-2 text-sm text-black/40 tracking-widest uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Content Section */}
      <section className="py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-black/40 mb-4">
              How it works
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl leading-[1.1]">
              세 단계로 시작하는
              <br />
              <span className="text-[#00d4ff]">스마트한 공유</span>
            </h2>
          </motion.div>

          {/* Steps - Asymmetric layout */}
          <div className="space-y-32">
            {[
              {
                num: "01",
                title: "파티 선택",
                desc: "원하는 OTT 서비스의 파티를 검색하세요. Netflix, Disney+, Wavve 등 다양한 서비스가 준비되어 있습니다.",
                align: "left",
              },
              {
                num: "02",
                title: "안전한 결제",
                desc: "보증금과 첫 달 이용료를 결제하면 바로 시작됩니다. 모든 거래는 안전하게 보호됩니다.",
                align: "right",
              },
              {
                num: "03",
                title: "즉시 이용",
                desc: "파티장이 공유한 계정 정보로 바로 시청을 시작하세요. 더 이상 혼자 비싼 돈 내지 마세요.",
                align: "left",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`grid lg:grid-cols-12 gap-8 items-start ${step.align === "right" ? "lg:text-right" : ""}`}
              >
                <div className={`lg:col-span-2 ${step.align === "right" ? "lg:order-3" : ""}`}>
                  <span className="text-8xl md:text-9xl font-black text-black/5">
                    {step.num}
                  </span>
                </div>
                <div className={`lg:col-span-5 ${step.align === "right" ? "lg:order-2 lg:col-start-6" : "lg:col-start-4"}`}>
                  <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-lg text-black/50 leading-relaxed max-w-md">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Parties - Magazine grid */}
      <section className="py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16"
          >
            <div>
              <p className="text-sm font-bold tracking-[0.3em] uppercase text-white/40 mb-4">
                Featured
              </p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                이번 주 인기
              </h2>
            </div>
            <Link
              to="/party"
              className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide uppercase text-white/60 hover:text-white transition-colors"
            >
              View All
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Magazine-style grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-[#0a0a0a] p-8 min-h-[400px] flex flex-col justify-between cursor-pointer"
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Circle className="w-2 h-2 fill-[#00d4ff] text-[#00d4ff] group-hover:fill-black group-hover:text-black transition-colors" />
                    <span className="text-xs font-bold tracking-widest uppercase text-white/40 group-hover:text-black/60 transition-colors">
                      {party.platform}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-black transition-colors">
                    {party.title}
                  </h3>
                </div>

                <div className="relative z-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-white/40 group-hover:text-black/60 transition-colors mb-1">
                        {party.members}명 참여중
                      </p>
                      <p className="text-xl font-black group-hover:text-black transition-colors">
                        {party.price}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-black/20 flex items-center justify-center group-hover:bg-black transition-all">
                      <ArrowUpRight className="w-5 h-5 group-hover:text-[#00d4ff] transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Full bleed */}
      <section className="relative py-48 overflow-hidden">
        {/* Background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[20vw] font-black text-black/[0.02] whitespace-nowrap">
            JOIN NOW
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            구독료는 줄이고
            <br />
            <span className="text-[#00d4ff]">즐거움은 나누세요</span>
          </h2>
          <p className="text-xl text-black/50 mb-12 max-w-lg mx-auto">
            매달 빠져나가는 구독료, 이제 스마트하게 관리하세요.
          </p>
          <Link
            to="/party"
            className="inline-flex items-center gap-4 px-12 py-5 bg-[#0a0a0a] text-white font-bold text-lg tracking-wide hover:bg-[#00d4ff] hover:text-black transition-all duration-300"
          >
            GET STARTED
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 border-t border-black/10">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-black tracking-tighter">MOA®</div>
          <div className="flex items-center gap-8 text-sm text-black/40">
            <span>© 2024</span>
            <span className="hidden md:inline">Seoul, Korea</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
