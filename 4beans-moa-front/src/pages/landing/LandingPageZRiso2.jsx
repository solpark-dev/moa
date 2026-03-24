import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Star, Heart, Sparkles, Users, Shield, Zap } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * Variant R - "Digital Risograph"
 * * Design Direction:
 * - Blend Modes (Multiply) utilizing CSS
 * - Grainy Texture overlays
 * - Offset layers simulating print misalignment
 * - Spot colors: Fluorescent Pink, Cyan Blue, Sunflower Yellow
 */

// --- Design Tokens & Assets ---
const COLORS = {
  bg: "bg-[#F5F0E6]", // Warm Paper
  blue: "text-[#0078BF]", // Riso Blue
  pink: "text-[#FF48B0]", // Riso Fluorescent Pink
  yellow: "text-[#FFE800]", // Riso Yellow
  black: "text-[#111111]", // Riso Black ink
  blueBg: "bg-[#0078BF]",
  pinkBg: "bg-[#FF48B0]",
  yellowBg: "bg-[#FFE800]",
};

// --- Grain Texture Component ---
const GrainOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[9999] opacity-40 mix-blend-multiply">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.85" 
          numOctaves="3" 
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

// --- Riso Offset Text Component ---
const RisoText = ({ children, className = "", offset = 3, type = "heading" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Cyan Layer */}
      <motion.span 
        className={`absolute inset-0 text-[#0078BF]/80 mix-blend-multiply select-none`}
        animate={{ x: -offset, y: -offset }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        {children}
      </motion.span>
      {/* Pink Layer */}
      <motion.span 
        className={`absolute inset-0 text-[#FF48B0]/80 mix-blend-multiply select-none`}
        animate={{ x: offset, y: offset }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
      >
        {children}
      </motion.span>
      {/* Main Layer */}
      <span className="relative z-10 text-[#111111] mix-blend-multiply">
        {children}
      </span>
    </div>
  );
};

// --- Riso Card Component ---
const RisoCard = ({ children, className = "", color = "blue" }) => {
  const bgClass = color === "pink" ? COLORS.pinkBg : color === "yellow" ? COLORS.yellowBg : COLORS.blueBg;
  
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.01 }}
      className={`relative group ${className}`}
    >
      {/* Shadow Layer (Misaligned) */}
      <div className={`absolute top-2 left-2 w-full h-full ${bgClass} opacity-30 rounded-xl transition-all duration-300 group-hover:top-3 group-hover:left-3 mix-blend-multiply`} />
      
      {/* Main Content */}
      <div className="relative bg-[#F5F0E6] border-2 border-[#111111] rounded-xl p-6 h-full overflow-hidden">
        {/* Halftone Pattern Decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '6px 6px' }} 
        />
        {children}
      </div>
    </motion.div>
  );
};

// --- CTA Button ---
const RisoButton = ({ children, className = "" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex group ${className}`}
    >
      <div className="absolute inset-0 bg-[#FF48B0] translate-x-1 translate-y-1 rounded-full mix-blend-multiply transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
      <div className="absolute inset-0 bg-[#0078BF] -translate-x-1 -translate-y-1 rounded-full mix-blend-multiply transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2" />
      <div className="relative bg-[#111111] text-[#F5F0E6] px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 border-2 border-transparent">
        {children}
      </div>
    </motion.button>
  );
};

export default function LandingPageRiso() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  const ottServices = [
    { name: "Netflix", price: "4,250", color: "bg-red-500" },
    { name: "Disney+", price: "2,400", color: "bg-blue-600" },
    { name: "Wavve", price: "3,000", color: "bg-indigo-500" },
    { name: "Tving", price: "3,200", color: "bg-red-400" },
  ];

  return (
    <div className={`min-h-screen ${COLORS.bg} text-[#111111] overflow-x-hidden selection:bg-[#FF48B0] selection:text-white`}>
      <GrainOverlay />

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 border-b-2 border-[#111111]/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-3xl font-black tracking-tighter mix-blend-multiply">
            MoA<span className="text-[#FF48B0]">.</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 font-bold border-2 border-[#111111] rounded-full hover:bg-[#111111] hover:text-white transition-colors">
              로그인
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#111111] bg-white font-mono text-sm">
                ● LIVE : 4,231 Parties
              </div>
              
              <h1 className="text-7xl md:text-9xl font-black leading-[0.9] tracking-tight mb-8">
                <div className="flex flex-col">
                  <span>SAVE</span>
                  <span className="flex items-center gap-4">
                    MONEY
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Star className="w-16 h-16 text-[#FFE800] fill-[#FFE800] mix-blend-multiply" />
                    </motion.div>
                  </span>
                  <RisoText offset={4}>TOGETHER</RisoText>
                </div>
              </h1>
              
              <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-lg mb-12 opacity-80 mix-blend-multiply text-balance">
                혼자 내기엔 부담스러운 구독료. <br/>
                <span className="bg-[#FF48B0]/20 px-1">가장 안전한 방법</span>으로 나눠 내세요.
                MoA와 함께라면 매달 <span className="font-bold underline decoration-[#0078BF] decoration-4">75% 절약</span>됩니다.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/party">
                  <RisoButton>
                    파티 시작하기 <ArrowRight className="w-5 h-5" />
                  </RisoButton>
                </Link>
                <Link to="/party/create" className="px-8 py-4 rounded-full font-bold text-lg border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-colors">
                  파티 만들기
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right: Visual Art */}
          <motion.div 
            className="relative h-[600px] hidden lg:block"
            style={{ y, rotate }}
          >
            {/* Abstract Shapes resembling print layers */}
            <motion.div 
              className="absolute top-10 right-10 w-64 h-80 bg-[#0078BF] rounded-full mix-blend-multiply opacity-80 blur-sm"
              animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-20 left-20 w-72 h-72 bg-[#FF48B0] rounded-full mix-blend-multiply opacity-80 blur-sm" 
              animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FFE800] rounded-full mix-blend-multiply opacity-80 blur-sm"
              animate={{ scale: [1, 0.9, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            {/* Overlaid UI Mockup */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-[#F5F0E6] border-2 border-[#111111] p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] max-w-sm w-full rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-6 border-b-2 border-[#111111] pb-4 border-dashed">
                  <span className="font-bold text-lg">이번 달 절약</span>
                  <span className="font-black text-3xl text-[#FF48B0]">₩32,500</span>
                </div>
                <div className="space-y-3">
                  {ottServices.map((ott, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-[#111111]/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${ott.color}`} />
                        <span className="font-bold">{ott.name}</span>
                      </div>
                      <span className="font-mono text-sm opacity-60">₩{ott.price}/월</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Divider */}
      <div className="border-y-2 border-[#111111] bg-[#FFE800] overflow-hidden py-3">
        <motion.div 
          className="whitespace-nowrap flex gap-8 font-black text-2xl tracking-tighter text-[#111111]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(20)].map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              NETFLIX <span className="text-[#FF48B0]">/</span> DISNEY+ <span className="text-[#0078BF]">/</span> WAVVE <span className="text-[#111111]">★</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-[#111111] text-[#F5F0E6] px-2">WHY</span> CHOOSE US?
          </h2>
          <p className="text-xl opacity-70 max-w-2xl mx-auto">
            단순한 매칭이 아닙니다. 우리는 가장 안전하고 합리적인<br/>
            OTT 공유 문화를 만들어갑니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <RisoCard color="blue" className="rotate-1">
            <div className="w-16 h-16 rounded-full bg-[#0078BF] flex items-center justify-center mb-6 text-[#F5F0E6] border-2 border-[#111111]">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-black mb-3">Community First</h3>
            <p className="font-medium opacity-80">
              최대 4명의 파티원과 함께.<br/>
              자동 매칭 시스템으로 기다림 없이<br/>
              즉시 파티를 시작할 수 있습니다.
            </p>
          </RisoCard>

          <RisoCard color="pink" className="-rotate-1 mt-8 md:mt-0">
            <div className="w-16 h-16 rounded-full bg-[#FF48B0] flex items-center justify-center mb-6 text-[#F5F0E6] border-2 border-[#111111]">
              <Shield size={32} />
            </div>
            <h3 className="text-2xl font-black mb-3">Safe & Secure</h3>
            <p className="font-medium opacity-80">
              보증금 시스템으로 먹튀 걱정 끝.<br/>
              문제가 발생하면 100% 환불해드려요.<br/>
              신뢰할 수 있는 파티장만 모았습니다.
            </p>
          </RisoCard>

          <RisoCard color="yellow" className="rotate-2">
            <div className="w-16 h-16 rounded-full bg-[#FFE800] flex items-center justify-center mb-6 text-[#111111] border-2 border-[#111111]">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-black mb-3">Instant Watch</h3>
            <p className="font-medium opacity-80">
              결제 즉시 계정 정보 확인.<br/>
              복잡한 절차 없이 지금 바로<br/>
              좋아하는 콘텐츠를 즐기세요.
            </p>
          </RisoCard>
        </div>
      </section>

      {/* Party List Preview */}
      <section className="py-24 px-6 bg-[#111111] text-[#F5F0E6] relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0078BF] rounded-full blur-[100px] opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF48B0] rounded-full blur-[100px] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-[#FFE800] font-bold tracking-widest text-sm mb-2 block">NOW TRENDING</span>
              <h2 className="text-4xl md:text-5xl font-black">실시간 인기 파티</h2>
            </div>
            <Link to="/party" className="text-white border-b-2 border-white pb-1 hover:text-[#FF48B0] hover:border-[#FF48B0] transition-colors font-bold">
              전체 파티 보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-[#222] border border-[#333] p-0 rounded-xl overflow-hidden group hover:border-[#FF48B0] transition-colors"
              >
                <div className="h-32 bg-[#333] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                  <span className="text-4xl font-black text-white/20 group-hover:text-white/40 transition-colors">{party.platform}</span>
                  <div className="absolute top-3 right-3 bg-[#FFE800] text-[#111111] text-xs font-bold px-2 py-1 rounded">
                    모집중
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold mb-1">{party.title}</h4>
                  <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                    <span className="flex items-center gap-1"><Users size={14}/> {party.members}명</span>
                    <span className="text-[#FF48B0] font-bold text-base">{party.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decoration Elements */}
            <Sparkles className="absolute -top-12 left-0 w-12 h-12 text-[#FFE800] animate-pulse" />
            <Heart className="absolute -bottom-8 right-0 w-12 h-12 text-[#FF48B0] animate-bounce" />
            
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Ready to <span className="text-[#0078BF] mix-blend-multiply">Join?</span>
            </h2>
            <p className="text-xl text-[#111111]/70 mb-10 max-w-xl mx-auto">
              지금 바로 가입하고 첫 달 구독료를 절약하세요.<br/>
              커피 한 잔 값으로 모든 OTT를 즐길 수 있습니다.
            </p>
            <Link to="/party">
              <RisoButton className="text-xl px-12 py-6">
                무료로 시작하기
              </RisoButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#111111]/10 py-12 px-6 bg-white text-[#111111]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl">MoA.</span>
            <span className="text-xs font-mono bg-[#111111] text-white px-2 py-1 rounded">EST. 2024</span>
          </div>
          <p className="font-mono text-sm opacity-60">
            © 2024 MoA Inc. Risograph Edition.
          </p>
        </div>
      </footer>
    </div>
  );
}