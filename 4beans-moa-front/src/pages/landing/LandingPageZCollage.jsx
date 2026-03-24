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
  Heart,
  Star,
  Check,
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageCollage - "Collage / Scrapbook Style"
 *
 * Design Direction:
 * - Stickers, tape, post-it notes aesthetic
 * - Mixed fonts including handwritten styles
 * - Doodles, scribbles, hand-drawn elements
 * - Spontaneous, free-form layouts
 * - Diary/Instagram aesthetic, Y2K vibes
 * - Polaroid-style images
 * - Washi tape, paper textures
 */

// 테이프 컴포넌트
function Tape({ color = "bg-yellow-200", rotation = -3, className = "" }) {
  return (
    <div
      className={`${color} h-6 w-20 opacity-70 ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        background: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.3) 2px,
          rgba(255,255,255,0.3) 4px
        ), ${color.includes('bg-') ? '' : color}`,
      }}
    />
  );
}

// 스티커 컴포넌트
function Sticker({ children, color = "bg-pink-400", rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: rotate + 5 }}
      className={`
        ${color}
        inline-flex items-center justify-center
        px-3 py-1.5
        rounded-full
        font-bold text-sm
        shadow-md
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

// 포스트잇 컴포넌트
function PostIt({ children, color = "bg-yellow-300", rotate = 2, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -5, rotate: rotate + 2 }}
      className={`
        ${color}
        p-4
        shadow-lg
        ${className}
      `}
      style={{
        transform: `rotate(${rotate}deg)`,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)",
      }}
    >
      {children}
    </motion.div>
  );
}

// 폴라로이드 카드
function Polaroid({ children, caption = "", rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -10, rotate: rotate + 3 }}
      className={`
        bg-white
        p-2 pb-12
        shadow-xl
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="bg-gray-100 aspect-square overflow-hidden">
        {children}
      </div>
      {caption && (
        <p className="absolute bottom-3 left-0 right-0 text-center font-handwriting text-gray-600 text-sm">
          {caption}
        </p>
      )}
    </motion.div>
  );
}

// 손글씨 텍스트
function Handwriting({ children, className = "" }) {
  return (
    <span
      className={`font-serif italic ${className}`}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {children}
    </span>
  );
}

// 낙서/스크리블 효과
function Scribble({ type = "underline", color = "#FF6B9D" }) {
  if (type === "underline") {
    return (
      <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 10">
        <path
          d="M0,5 Q10,0 20,5 T40,5 T60,5 T80,5 T100,5"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "circle") {
    return (
      <svg className="absolute -inset-3" viewBox="0 0 100 50">
        <ellipse
          cx="50"
          cy="25"
          rx="48"
          ry="22"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5,5"
        />
      </svg>
    );
  }
  return null;
}

// 메인 버튼
function ScrapbookButton({ children, color = "bg-pink-500", className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${color}
        px-8 py-4
        font-bold text-lg text-white
        rounded-full
        shadow-lg
        relative
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {/* 글리터 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
      {children}
    </motion.button>
  );
}

// 종이 텍스처 배경
function PaperTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

export default function LandingPageCollage() {
  const ottServices = [
    { name: "Netflix", letter: "N", color: "#E50914", savings: "75%" },
    { name: "Disney+", letter: "D+", color: "#113CCF", savings: "70%" },
    { name: "Wavve", letter: "W", color: "#1351F9", savings: "65%" },
  ];

  const features = [
    { icon: "🎉", title: "파티 공유", desc: "최대 4명과 함께 나눠요!", color: "bg-blue-200" },
    { icon: "🛡️", title: "안전 보장", desc: "보증금으로 안심 거래!", color: "bg-green-200" },
    { icon: "⚡", title: "즉시 시작", desc: "가입 즉시 이용 가능!", color: "bg-orange-200" },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6E3] text-gray-800 overflow-hidden">
      {/* 종이 텍스처 */}
      <PaperTexture />

      {/* 떠다니는 장식들 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 스티커들 */}
        <motion.div
          className="absolute top-24 left-[8%]"
          animate={{ y: [0, -10, 0], rotate: [12, 15, 12] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sticker color="bg-pink-400 text-white" rotate={12}>cute! ♡</Sticker>
        </motion.div>
        <motion.div
          className="absolute top-40 right-[12%]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          <Sticker color="bg-yellow-400 text-black" rotate={-8}>WOW!</Sticker>
        </motion.div>
        <motion.div
          className="absolute top-[55%] left-[5%]"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sticker color="bg-purple-400 text-white" rotate={5}>♪ music ♪</Sticker>
        </motion.div>
        <motion.div
          className="absolute top-[70%] right-[8%]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sticker color="bg-green-400 text-white" rotate={-3}>best ★</Sticker>
        </motion.div>

        {/* 하트들 */}
        <motion.div
          className="absolute top-32 right-[25%] text-4xl"
          animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          💕
        </motion.div>
        <motion.div
          className="absolute top-[60%] right-[20%] text-3xl"
          animate={{ rotate: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ✨
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            {/* 테이프 효과 */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-200/70 -rotate-2" />
            <div className="bg-white px-4 py-2 shadow-md">
              <span className="text-2xl font-black">MoA</span>
              <span className="text-pink-500 ml-1">♥</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              to="/party"
              className="hidden md:block px-4 py-2 font-bold text-gray-700 hover:text-pink-500 transition-colors"
            >
              파티 찾기
            </Link>
            <Link to="/login">
              <ScrapbookButton color="bg-pink-500">
                로그인 →
              </ScrapbookButton>
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
              className="text-center lg:text-left relative"
            >
              {/* 테이프 장식 */}
              <div className="absolute -top-6 left-10 w-16 h-5 bg-pink-200/70 rotate-12" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <Sticker color="bg-yellow-400 text-black" rotate={-5} className="text-base px-4 py-2">
                  ✨ 구독료 75% 절약! ✨
                </Sticker>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
              >
                <span className="block">OTT 구독,</span>
                <span className="block relative inline-block">
                  <span className="text-pink-500">같이</span>
                  <Scribble type="underline" color="#FF6B9D" />
                </span>{" "}
                보면
                <span className="block">
                  <span className="relative inline-block mx-2">
                    <span className="bg-yellow-300 px-3">반값!</span>
                    <motion.span
                      className="absolute -top-2 -right-2 text-2xl"
                      animate={{ rotate: [0, 20, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ⭐
                    </motion.span>
                  </span>
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <PostIt color="bg-blue-100" rotate={-2} className="inline-block max-w-xs">
                  <p className="text-lg">
                    <Handwriting>넷플릭스, 디즈니+ 혼자 보기 아깝지 않아요? 🤔</Handwriting>
                  </p>
                </PostIt>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/party">
                  <ScrapbookButton color="bg-pink-500">
                    <span className="flex items-center gap-2">
                      파티 구경하기 💕
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </ScrapbookButton>
                </Link>
                <Link to="/party/create">
                  <ScrapbookButton color="bg-purple-500">
                    <span className="flex items-center gap-2">
                      내 파티 만들기 ✨
                    </span>
                  </ScrapbookButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Collage Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative flex justify-center min-h-[400px]"
            >
              {/* 메인 폴라로이드 */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <div className="bg-white p-3 pb-16 shadow-xl" style={{ transform: "rotate(3deg)" }}>
                  {/* 테이프 */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-5 bg-pink-200/80 rotate-2" />
                  <div className="w-56 h-40 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-6xl font-black">MoA</span>
                  </div>
                  <p className="absolute bottom-4 left-0 right-0 text-center text-gray-500">
                    <Handwriting>우리의 OTT 파티 ♡</Handwriting>
                  </p>
                </div>
              </motion.div>

              {/* 절약 카드 */}
              <motion.div
                className="absolute top-20 -left-4 z-10"
                whileHover={{ rotate: -2 }}
              >
                <PostIt color="bg-yellow-200" rotate={-8} className="w-48">
                  <p className="font-bold text-lg mb-2">💰 이번 달 절약</p>
                  <div className="space-y-2">
                    {ottServices.map((ott, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{ott.name}</span>
                        <span className="font-bold text-pink-600">-{ott.savings}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-yellow-400">
                    <p className="text-right font-black text-xl text-pink-600">₩32,500</p>
                  </div>
                </PostIt>
              </motion.div>

              {/* 작은 폴라로이드들 */}
              <motion.div
                className="absolute bottom-10 right-0 z-10"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <div className="bg-white p-2 pb-8 shadow-lg w-28" style={{ transform: "rotate(8deg)" }}>
                  <div className="w-full aspect-square bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
                    N
                  </div>
                  <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-400">
                    <Handwriting>netflix ♡</Handwriting>
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-10 z-10"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <div className="bg-white p-2 pb-8 shadow-lg w-24" style={{ transform: "rotate(-12deg)" }}>
                  <div className="w-full aspect-square bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    D+
                  </div>
                  <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-400">
                    <Handwriting>disney</Handwriting>
                  </p>
                </div>
              </motion.div>

              {/* 스티커 장식 */}
              <motion.div
                className="absolute top-10 right-10"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sticker color="bg-green-400 text-white" rotate={15}>SAVE!</Sticker>
              </motion.div>

              <motion.div
                className="absolute bottom-32 right-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl">💖</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 구분선 - 와시 테이프 */}
      <div className="relative h-8">
        <div className="absolute inset-0 flex">
          <div className="flex-1 h-full bg-pink-300/60" />
          <div className="flex-1 h-full bg-yellow-300/60" />
          <div className="flex-1 h-full bg-blue-300/60" />
          <div className="flex-1 h-full bg-green-300/60" />
          <div className="flex-1 h-full bg-purple-300/60" />
        </div>
      </div>

      {/* Features Section */}
      <section className="relative px-6 md:px-12 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Sticker color="bg-purple-400 text-white" rotate={-3} className="text-lg px-6 py-2 mb-6">
              Why MoA? 🤔
            </Sticker>
            <h2 className="text-4xl md:text-5xl font-black">
              <Handwriting>왜 모아를 써야 할까요?</Handwriting>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -3 : 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PostIt
                  color={feature.color}
                  rotate={i % 2 === 0 ? -3 : 3}
                  className="p-6 h-full"
                >
                  {/* 테이프 */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/50 rotate-3" />
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-black mb-2">{feature.title}</h3>
                  <p className="text-gray-600">
                    <Handwriting>{feature.desc}</Handwriting>
                  </p>
                </PostIt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Party Preview Section */}
      <section className="relative px-6 md:px-12 py-20 bg-pink-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div className="relative">
              <div className="absolute -top-3 left-0 w-20 h-5 bg-yellow-200/70 -rotate-3" />
              <Sticker color="bg-pink-500 text-white" rotate={-5} className="mb-3">
                HOT! 🔥
              </Sticker>
              <h2 className="text-4xl md:text-5xl font-black">
                <Handwriting>지금 인기 있는 파티</Handwriting>
              </h2>
            </div>
            <Link to="/party">
              <ScrapbookButton color="bg-gray-800">
                전체 보기 →
              </ScrapbookButton>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -2 : 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                whileHover={{ y: -10, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* 폴라로이드 스타일 카드 */}
                <div className="bg-white p-3 pb-6 shadow-xl">
                  {/* 테이프 */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 opacity-70"
                    style={{
                      backgroundColor: ["#FBBF24", "#F472B6", "#60A5FA", "#34D399"][i % 4],
                    }}
                  />

                  {/* 이미지 영역 */}
                  <div
                    className="h-32 flex items-center justify-center relative"
                    style={{
                      backgroundColor: ["#EF4444", "#3B82F6", "#6366F1", "#EC4899"][i % 4],
                    }}
                  >
                    <span className="text-5xl font-black text-white/30">{party.platform}</span>
                    <Sticker
                      color="bg-yellow-400 text-black"
                      rotate={-5}
                      className="absolute top-2 left-2 text-xs"
                    >
                      모집중 ✋
                    </Sticker>
                  </div>

                  {/* 내용 */}
                  <div className="pt-3">
                    <h3 className="font-bold text-base mb-1 truncate">{party.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {party.members}명
                      </span>
                      <span className="font-black text-pink-500">{party.price}</span>
                    </div>
                  </div>

                  {/* 손글씨 메모 */}
                  <p className="mt-2 text-xs text-gray-400 text-center">
                    <Handwriting>join us! ♡</Handwriting>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-6 md:px-12 py-20 bg-gradient-to-b from-purple-100/50 to-pink-100/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black">
              <Handwriting>이렇게 쉬워요! ✨</Handwriting>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "파티 찾기", desc: "마음에 드는 파티를 골라요", emoji: "🔍", color: "bg-pink-200" },
              { num: "2", title: "결제하기", desc: "안전하게 결제해요", emoji: "💳", color: "bg-yellow-200" },
              { num: "3", title: "함께 시청", desc: "바로 시청 시작!", emoji: "🎬", color: "bg-blue-200" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                {/* 점선 연결 */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] border-t-2 border-dashed border-gray-300" />
                )}

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-32 h-32 ${step.color} rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg relative`}
                >
                  {/* 테이프 */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/50 rotate-6" />
                  <span className="text-5xl">{step.emoji}</span>
                </motion.div>

                <Sticker color="bg-gray-800 text-white" className="mb-4">
                  Step {step.num}
                </Sticker>
                <h3 className="text-xl font-black mb-2">{step.title}</h3>
                <p className="text-gray-600">
                  <Handwriting>{step.desc}</Handwriting>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-12 py-20 bg-[#FDF6E3]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* 테이프들 */}
            <div className="absolute -top-4 left-10 w-20 h-6 bg-pink-300/70 rotate-12" />
            <div className="absolute -top-4 right-10 w-16 h-5 bg-yellow-300/70 -rotate-6" />

            <div className="bg-white p-12 md:p-16 shadow-2xl text-center relative">
              {/* 장식 스티커들 */}
              <motion.div
                className="absolute top-4 left-4"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sticker color="bg-yellow-400 text-black" rotate={-10}>♪</Sticker>
              </motion.div>
              <motion.div
                className="absolute top-4 right-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sticker color="bg-pink-400 text-white" rotate={10}>♡</Sticker>
              </motion.div>
              <motion.div
                className="absolute bottom-4 left-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sticker color="bg-blue-400 text-white" rotate={-5}>★</Sticker>
              </motion.div>
              <motion.div
                className="absolute bottom-4 right-4"
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Sticker color="bg-green-400 text-white" rotate={8}>✨</Sticker>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <Handwriting>지금 바로 시작해볼까요?</Handwriting>
              </h2>

              <PostIt color="bg-yellow-100" rotate={-1} className="inline-block mb-8">
                <p className="text-lg text-gray-600">
                  <Handwriting>매달 나가는 구독료, 친구들과 나누면 반값! 💕</Handwriting>
                </p>
              </PostIt>

              <div className="flex justify-center">
                <Link to="/party">
                  <ScrapbookButton color="bg-gradient-to-r from-pink-500 to-purple-500" className="text-xl px-10 py-5">
                    <span className="flex items-center gap-3">
                      무료로 시작하기 💖
                      <Sparkles className="w-6 h-6" />
                    </span>
                  </ScrapbookButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">MoA</span>
            <span className="text-pink-400">♥</span>
          </div>
          <div className="flex gap-3">
            <Sticker color="bg-pink-500 text-white" className="text-xs">cute</Sticker>
            <Sticker color="bg-yellow-400 text-black" className="text-xs">fun</Sticker>
            <Sticker color="bg-blue-400 text-white" className="text-xs">easy</Sticker>
          </div>
          <p className="text-gray-400">
            <Handwriting>© 2024 MoA. 함께 보면 더 좋아! 💕</Handwriting>
          </p>
        </div>
      </footer>
    </div>
  );
}
