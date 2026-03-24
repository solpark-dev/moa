import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Shield,
  Zap,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageMemphis - "80s Memphis Design"
 *
 * Design Direction:
 * - Inspired by Memphis Group (1980s postmodern design)
 * - Geometric shapes: circles, triangles, zigzags, squiggles
 * - Bold primary colors + pastels (red, blue, yellow, pink, mint)
 * - Patterns: dots, stripes, grids
 * - Asymmetric layouts
 * - Thick black outlines
 * - Retro-funky-hip vibe
 */

// 기하학 도형 컴포넌트들
function Circle({ size = 60, color = "#FF6B6B", className = "", style = {} }) {
  return (
    <motion.div
      className={`rounded-full border border-gray-200 ${className}`}
      style={{ width: size, height: size, backgroundColor: color, ...style }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
  );
}

function Triangle({ size = 60, color = "#4ECDC4", rotation = 0, className = "" }) {
  return (
    <motion.div
      className={`border border-gray-200 ${className}`}
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
        transform: `rotate(${rotation}deg)`,
        borderTopWidth: 0,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
      }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Zigzag({ width = 120, color = "#FFE66D", className = "" }) {
  return (
    <svg width={width} height="30" viewBox="0 0 120 30" className={className}>
      <polyline
        points="0,25 20,5 40,25 60,5 80,25 100,5 120,25"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="0,25 20,5 40,25 60,5 80,25 100,5 120,25"
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Squiggle({ className = "" }) {
  return (
    <svg width="100" height="40" viewBox="0 0 100 40" className={className}>
      <path
        d="M5,20 Q20,5 35,20 T65,20 T95,20"
        fill="none"
        stroke="#FF6B6B"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M5,20 Q20,5 35,20 T65,20 T95,20"
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Cross({ size = 40, color = "#C44DFF", className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 border border-gray-200"
        style={{ width: size, height: size / 4, backgroundColor: color }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 border border-gray-200"
        style={{ width: size / 4, height: size, backgroundColor: color }}
      />
    </div>
  );
}

// 점무늬 패턴 배경
function DotPattern({ color = "#000", opacity = 0.1 }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 3px, transparent 3px)`,
        backgroundSize: "30px 30px",
        opacity,
      }}
    />
  );
}

// 줄무늬 패턴
function StripePattern({ color = "#FFE66D", opacity = 0.3, angle = 45 }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `repeating-linear-gradient(
          ${angle}deg,
          transparent,
          transparent 10px,
          ${color} 10px,
          ${color} 20px
        )`,
        opacity,
      }}
    />
  );
}

// Memphis 버튼
function MemphisButton({ children, color = "bg-[#FF6B6B]", className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${color}
        px-8 py-4
        font-black text-xl text-black
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
       
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Memphis 카드
function MemphisCard({ children, color = "bg-white", rotate = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotate - 5 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      whileHover={{ y: -8, rotate: rotate + 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        ${color}
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPageMemphis() {
  const ottServices = [
    { name: "Netflix", letter: "N", color: "#E50914", savings: "75%" },
    { name: "Disney+", letter: "D+", color: "#113CCF", savings: "70%" },
    { name: "Wavve", letter: "W", color: "#1351F9", savings: "65%" },
  ];

  const features = [
    { icon: "🎉", title: "파티 공유", desc: "최대 4명과 함께!", color: "bg-[#4ECDC4]" },
    { icon: "🛡️", title: "안전 보장", desc: "보증금으로 안심!", color: "bg-[#FFE66D]" },
    { icon: "⚡", title: "즉시 시작", desc: "가입하면 바로!", color: "bg-[#FF6B6B]" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5E6] text-black overflow-hidden">
      {/* 배경 패턴 */}
      <DotPattern color="#000" opacity={0.05} />

      {/* 플로팅 기하학 도형들 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-[5%]"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Circle size={80} color="#FF6B6B" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-[10%]"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        >
          <Triangle size={70} color="#4ECDC4" rotation={15} />
        </motion.div>
        <motion.div
          className="absolute top-[60%] left-[8%]"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Cross size={50} color="#C44DFF" />
        </motion.div>
        <motion.div
          className="absolute top-[30%] right-[5%]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <Circle size={40} color="#FFE66D" />
        </motion.div>
        <div className="absolute bottom-40 right-[15%]">
          <Zigzag width={100} color="#FF6B6B" />
        </div>
        <div className="absolute top-[50%] left-[3%]">
          <Squiggle />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#FF6B6B] border border-gray-200 rounded-full" />
              <div className="w-6 h-6 bg-[#4ECDC4] border border-gray-200 rotate-45" />
              <span className="text-3xl font-black tracking-tight ml-2">MoA</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              to="/party"
              className="hidden md:block px-4 py-2 font-bold hover:bg-[#FFE66D] border border-gray-200 transition-colors"
            >
              파티 찾기
            </Link>
            <Link to="/login">
              <MemphisButton color="bg-[#4ECDC4]" className="text-base px-6 py-2">
                로그인
              </MemphisButton>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              {/* 장식 요소 */}
              <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                <Zigzag width={80} color="#FF6B6B" />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-[#FFE66D] border border-gray-200"
                />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-8"
              >
                <span className="block">OTT</span>
                <span className="block text-[#FF6B6B] relative inline-block">
                  공유의
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12">
                    <path d="M0,6 Q50,12 100,6 T200,6" fill="none" stroke="#4ECDC4" strokeWidth="6" />
                  </svg>
                </span>
                <span className="block">
                  새로운
                  <span className="inline-block ml-3 px-4 py-1 bg-[#FFE66D] border border-gray-200 -rotate-3">
                    시대
                  </span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl font-bold mb-8 flex items-center gap-3 justify-center lg:justify-start flex-wrap"
              >
                구독료
                <span className="inline-block px-3 py-1 bg-[#C44DFF] text-white border border-gray-200">
                  75%
                </span>
                절약하고 함께 즐기자!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/party">
                  <MemphisButton color="bg-[#FF6B6B]">
                    <span className="flex items-center gap-2">
                      파티 시작하기
                      <ArrowRight className="w-6 h-6" />
                    </span>
                  </MemphisButton>
                </Link>
                <Link to="/party/create">
                  <MemphisButton color="bg-[#FFE66D]">
                    <span className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      파티 만들기
                    </span>
                  </MemphisButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative flex justify-center"
            >
              {/* 메인 카드 */}
              <MemphisCard
                color="bg-white"
                rotate={3}
                className="w-full max-w-sm p-6 rounded-none"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#FF6B6B] border border-gray-200 rounded-full" />
                  <div className="w-4 h-4 bg-[#4ECDC4] border border-gray-200" />
                  <span className="font-black text-lg">이번 달 절약</span>
                </div>

                <div className="space-y-3 mb-6">
                  {ottServices.map((ott, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border border-gray-200"
                      style={{ backgroundColor: i % 2 === 0 ? "#FFE66D" : "#4ECDC4" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 flex items-center justify-center text-white font-black border border-gray-200"
                          style={{ backgroundColor: ott.color }}
                        >
                          {ott.letter}
                        </div>
                        <span className="font-bold">{ott.name}</span>
                      </div>
                      <span className="font-black text-xl">-{ott.savings}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-black text-white p-4 border border-gray-200 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FF6B6B] border border-gray-200 rounded-full" />
                  <p className="text-sm mb-1">매달 절약 금액</p>
                  <p className="text-4xl font-black">₩32,500</p>
                </div>
              </MemphisCard>

              {/* 배경 장식 카드들 */}
              <div className="absolute -top-4 -left-4 w-full max-w-sm h-full bg-[#4ECDC4] border border-gray-200 -z-10 -rotate-6" />
              <div className="absolute -top-8 -left-8 w-full max-w-sm h-full bg-[#FFE66D] border border-gray-200 -z-20 -rotate-12" />

              {/* 추가 장식 */}
              <div className="absolute -top-6 right-10">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-12 h-12 text-[#FF6B6B] fill-[#FF6B6B]" strokeWidth={3} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 물결 구분선 */}
      <div className="relative h-16 bg-[#FF6B6B] border-y-4 border-black">
        <StripePattern color="#000" opacity={0.1} angle={-45} />
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              className="text-2xl font-black text-white"
            >
              ★
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="relative px-6 md:px-12 py-20 bg-white border-b-4 border-black">
        <DotPattern color="#4ECDC4" opacity={0.1} />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#FF6B6B] border border-gray-200 rounded-full" />
              <div className="w-6 h-6 bg-[#FFE66D] border border-gray-200 rotate-45" />
              <div className="w-4 h-4 bg-[#4ECDC4] border border-gray-200" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black">
              왜{" "}
              <span className="relative inline-block">
                MoA
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#FFE66D] border border-gray-200 -z-10" />
              </span>
              인가요?
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
                <MemphisCard
                  color={feature.color}
                  rotate={i % 2 === 0 ? -2 : 2}
                  className="p-8 h-full"
                >
                  <div className="w-20 h-20 bg-white border border-gray-200 flex items-center justify-center mb-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
                    <span className="text-5xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                  <p className="text-lg font-bold opacity-80">{feature.desc}</p>
                </MemphisCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 지그재그 구분선 */}
      <div className="bg-[#4ECDC4] border-y-4 border-black py-4 overflow-hidden">
        <motion.div
          animate={{ x: [0, -200] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="flex gap-4"
        >
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-xl font-black whitespace-nowrap flex items-center gap-4">
              <span>NETFLIX</span>
              <span className="text-[#FF6B6B]">●</span>
              <span>DISNEY+</span>
              <span className="text-[#FFE66D]">▲</span>
              <span>WAVVE</span>
              <span className="text-[#C44DFF]">■</span>
              <span>TVING</span>
              <span className="text-[#FF6B6B]">★</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Party Preview Section */}
      <section className="relative px-6 md:px-12 py-20 bg-[#FFE66D] border-b-4 border-black">
        <StripePattern color="#000" opacity={0.03} angle={45} />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <div className="inline-block px-4 py-2 bg-[#FF6B6B] border border-gray-200 mb-4 -rotate-2">
                <span className="font-black text-white">HOT!</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black">지금 뜨는 파티</h2>
            </div>
            <Link to="/party">
              <MemphisButton color="bg-black" className="text-white">
                전체 보기 →
              </MemphisButton>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <MemphisCard
                key={i}
                color="bg-white"
                rotate={i % 2 === 0 ? -1 : 1}
                className="overflow-hidden"
              >
                <div
                  className="h-32 flex items-center justify-center relative border-b-4 border-black"
                  style={{
                    backgroundColor: ["#FF6B6B", "#4ECDC4", "#C44DFF", "#FFE66D"][i % 4],
                  }}
                >
                  <span className="text-6xl font-black text-white/30">{party.platform}</span>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white border border-gray-200 font-bold text-sm">
                    모집중
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-lg mb-2">{party.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{party.members}명</span>
                    </div>
                    <span className="font-black text-[#FF6B6B] text-lg">{party.price}</span>
                  </div>
                </div>
              </MemphisCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-6 md:px-12 py-20 bg-[#C44DFF] border-b-4 border-black">
        <DotPattern color="#fff" opacity={0.1} />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white">
              3단계로 끝!
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "파티 찾기", desc: "원하는 OTT 파티를 검색!", emoji: "🔍", color: "bg-[#FF6B6B]" },
              { num: "02", title: "결제하기", desc: "안전하게 결제 완료!", emoji: "💳", color: "bg-[#4ECDC4]" },
              { num: "03", title: "바로 시청", desc: "즉시 시청 시작!", emoji: "🎬", color: "bg-[#FFE66D]" },
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
                  className={`w-28 h-28 ${step.color} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] mx-auto mb-6 flex items-center justify-center`}
                >
                  <span className="text-5xl">{step.emoji}</span>
                </motion.div>
                <div className="inline-block bg-black text-white px-4 py-1 border border-gray-200 font-black mb-4">
                  STEP {step.num}
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{step.title}</h3>
                <p className="text-lg font-bold text-white/80">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-12 py-20 bg-[#FFF5E6]">
        <DotPattern color="#000" opacity={0.03} />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <MemphisCard
              color="bg-white"
              rotate={0}
              className="p-12 md:p-16 text-center relative overflow-hidden"
            >
              {/* 장식 요소들 */}
              <div className="absolute top-4 left-4">
                <Circle size={30} color="#FF6B6B" />
              </div>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-[#4ECDC4] border border-gray-200 rotate-45" />
              </div>
              <div className="absolute bottom-4 left-4">
                <Cross size={30} color="#FFE66D" />
              </div>
              <div className="absolute bottom-4 right-4">
                <Triangle size={30} color="#C44DFF" rotation={180} />
              </div>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🎊
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                지금 바로
                <br />
                <span className="relative inline-block">
                  <span className="text-[#FF6B6B]">시작</span>
                  <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#FFE66D] border border-gray-200 -z-10" />
                </span>
                해볼까요?
              </h2>
              <p className="text-xl font-bold text-gray-600 mb-10">
                매달 빠져나가는 구독료, 이제 친구들과 나눠요!
              </p>
              <Link to="/party">
                <MemphisButton color="bg-[#FF6B6B]" className="text-xl text-white px-12 py-5">
                  <span className="flex items-center gap-3">
                    무료로 시작하기
                    <Sparkles className="w-7 h-7" />
                  </span>
                </MemphisButton>
              </Link>
            </MemphisCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 md:px-12 py-12 border-t-4 border-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF6B6B] border-3 border-white rounded-full" />
            <div className="w-5 h-5 bg-[#4ECDC4] border-2 border-white rotate-45" />
            <span className="text-2xl font-black">MoA</span>
          </div>
          <div className="flex items-center gap-4">
            <Circle size={20} color="#FF6B6B" />
            <Circle size={16} color="#4ECDC4" />
            <Circle size={12} color="#FFE66D" />
          </div>
          <p className="text-gray-400 font-bold">
            © 2024 MoA. 함께 보면 더 좋아!
          </p>
        </div>
      </footer>
    </div>
  );
}
