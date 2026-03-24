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
  Circle,
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageRiso - "Risograph Print Style"
 *
 * Design Direction:
 * - Grainy, noisy texture (like real risograph prints)
 * - Overprint effect (colors overlapping with multiply blend)
 * - Limited color palette: 2-3 spot colors (typically fluorescent/pantone-like)
 * - Indie/art poster aesthetic
 * - Vintage printing vibes
 * - Intentional misregistration effects
 * - Halftone patterns
 */

// Risograph 컬러 팔레트 (실제 리소 잉크 색상 기반)
const RISO_COLORS = {
  blue: "#0078BF",      // Riso Blue
  pink: "#FF6B9D",      // Riso Fluorescent Pink
  yellow: "#FFE800",    // Riso Yellow
  orange: "#FF6C2F",    // Riso Orange
  green: "#00A95C",     // Riso Green
  black: "#1A1A1A",
};

// 노이즈/그레인 텍스처
function GrainTexture({ opacity = 0.15 }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        mixBlendMode: "overlay",
      }}
    />
  );
}

// 하프톤 패턴
function HalftonePattern({ color = RISO_COLORS.blue, opacity = 0.1, size = 4 }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, ${color} ${size * 0.3}px, transparent ${size * 0.3}px)`,
        backgroundSize: `${size * 2}px ${size * 2}px`,
        opacity,
      }}
    />
  );
}

// 오버프린트 효과가 있는 도형
function OverprintShape({
  shape = "circle",
  color1 = RISO_COLORS.blue,
  color2 = RISO_COLORS.pink,
  size = 100,
  offset = 8,
  className = ""
}) {
  const ShapeComponent = shape === "circle" ? "div" : "div";
  const shapeClass = shape === "circle" ? "rounded-full" : "";

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* 뒤쪽 레이어 */}
      <div
        className={`absolute ${shapeClass}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color1,
          top: offset,
          left: offset,
          mixBlendMode: "multiply",
        }}
      />
      {/* 앞쪽 레이어 */}
      <div
        className={`absolute ${shapeClass}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color2,
          top: 0,
          left: 0,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}

// Riso 버튼
function RisoButton({ children, color = RISO_COLORS.blue, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative
        px-8 py-4
        font-bold text-xl text-white
        overflow-hidden
        ${className}
      `}
      style={{ backgroundColor: color }}
      {...props}
    >
      {/* 미세한 오프셋 효과 */}
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundColor: RISO_COLORS.pink,
          mixBlendMode: "multiply",
          transform: "translate(2px, 2px)",
          opacity: 0.5,
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Riso 카드
function RisoCard({ children, accentColor = RISO_COLORS.blue, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`
        relative
        bg-[#F5F0E6]
        ${className}
      `}
    >
      {/* 오프셋 그림자 효과 */}
      <div
        className="absolute inset-0 translate-x-2 translate-y-2"
        style={{ backgroundColor: accentColor, mixBlendMode: "multiply", opacity: 0.3 }}
      />
      <div className="relative bg-[#F5F0E6]">
        {children}
      </div>
    </motion.div>
  );
}

// 큰 타이포그래피 컴포넌트
function RisoTitle({ children, color1 = RISO_COLORS.blue, color2 = RISO_COLORS.pink }) {
  return (
    <div className="relative inline-block">
      {/* 오프셋 레이어 */}
      <span
        className="absolute font-black"
        style={{
          color: color1,
          transform: "translate(4px, 4px)",
          mixBlendMode: "multiply",
        }}
      >
        {children}
      </span>
      {/* 메인 레이어 */}
      <span
        className="relative font-black"
        style={{ color: color2, mixBlendMode: "multiply" }}
      >
        {children}
      </span>
    </div>
  );
}

export default function LandingPageRiso() {
  const ottServices = [
    { name: "Netflix", letter: "N", color: "#E50914", savings: "75%" },
    { name: "Disney+", letter: "D+", color: "#113CCF", savings: "70%" },
    { name: "Wavve", letter: "W", color: "#1351F9", savings: "65%" },
  ];

  const features = [
    { icon: Users, title: "파티 공유", desc: "최대 4명과 함께 구독을 나눠요", color: RISO_COLORS.blue },
    { icon: Shield, title: "안전 보장", desc: "보증금 시스템으로 안심 거래", color: RISO_COLORS.green },
    { icon: Zap, title: "즉시 시작", desc: "가입 즉시 바로 이용 가능", color: RISO_COLORS.orange },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#1A1A1A] overflow-hidden">
      {/* 그레인 텍스처 (전체 화면) */}
      <GrainTexture opacity={0.12} />

      {/* 배경 하프톤 */}
      <div className="fixed inset-0 pointer-events-none">
        <HalftonePattern color={RISO_COLORS.blue} opacity={0.03} size={6} />
      </div>

      {/* 배경 장식 도형들 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-[10%]"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <OverprintShape
            shape="circle"
            color1={RISO_COLORS.blue}
            color2={RISO_COLORS.pink}
            size={120}
            offset={10}
          />
        </motion.div>
        <motion.div
          className="absolute top-[50%] left-[5%]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <OverprintShape
            shape="square"
            color1={RISO_COLORS.yellow}
            color2={RISO_COLORS.orange}
            size={80}
            offset={6}
          />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] right-[15%]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <OverprintShape
            shape="circle"
            color1={RISO_COLORS.green}
            color2={RISO_COLORS.blue}
            size={60}
            offset={5}
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="relative z-40 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: RISO_COLORS.blue, mixBlendMode: "multiply" }}
                />
                <div
                  className="absolute inset-0 rounded-full translate-x-1 translate-y-1"
                  style={{ backgroundColor: RISO_COLORS.pink, mixBlendMode: "multiply" }}
                />
              </div>
              <span className="text-2xl font-black tracking-tight">MoA</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              to="/party"
              className="hidden md:block px-4 py-2 font-bold hover:underline underline-offset-4"
            >
              파티 찾기
            </Link>
            <Link to="/login">
              <RisoButton color={RISO_COLORS.blue} className="text-base px-6 py-2">
                로그인
              </RisoButton>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-6 px-4 py-2 font-bold text-white"
                style={{ backgroundColor: RISO_COLORS.pink }}
              >
                구독료 최대 75% 절약
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8"
              >
                <span className="block">
                  <RisoTitle color1={RISO_COLORS.blue} color2={RISO_COLORS.pink}>
                    OTT
                  </RisoTitle>
                </span>
                <span className="block font-black">구독을</span>
                <span className="block">
                  <RisoTitle color1={RISO_COLORS.orange} color2={RISO_COLORS.yellow}>
                    나누다
                  </RisoTitle>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl mb-8 max-w-lg"
                style={{ color: RISO_COLORS.black }}
              >
                넷플릭스, 디즈니+ 등 OTT 구독을
                <br />
                친구들과 나누고 비용을 절약하세요
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/party">
                  <RisoButton color={RISO_COLORS.blue}>
                    <span className="flex items-center gap-2">
                      파티 둘러보기
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </RisoButton>
                </Link>
                <Link to="/party/create">
                  <RisoButton color={RISO_COLORS.pink}>
                    <span className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      파티 만들기
                    </span>
                  </RisoButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative flex justify-center"
            >
              <RisoCard accentColor={RISO_COLORS.blue} className="w-full max-w-sm p-6">
                <div
                  className="text-sm font-bold mb-4 px-3 py-1 inline-block text-white"
                  style={{ backgroundColor: RISO_COLORS.pink }}
                >
                  이번 달 예상 절약
                </div>

                <div className="space-y-3 mb-6">
                  {ottServices.map((ott, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 flex items-center justify-center text-white font-bold relative"
                        >
                          <div
                            className="absolute inset-0"
                            style={{ backgroundColor: ott.color }}
                          />
                          <div
                            className="absolute inset-0 translate-x-0.5 translate-y-0.5"
                            style={{ backgroundColor: RISO_COLORS.blue, mixBlendMode: "multiply", opacity: 0.3 }}
                          />
                          <span className="relative z-10">{ott.letter}</span>
                        </div>
                        <span className="font-bold">{ott.name}</span>
                      </div>
                      <span
                        className="font-black text-xl"
                        style={{ color: RISO_COLORS.pink }}
                      >
                        -{ott.savings}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="p-4 text-white relative overflow-hidden"
                  style={{ backgroundColor: RISO_COLORS.blue }}
                >
                  <div
                    className="absolute inset-0 translate-x-1 translate-y-1"
                    style={{ backgroundColor: RISO_COLORS.pink, mixBlendMode: "multiply", opacity: 0.5 }}
                  />
                  <div className="relative z-10 text-center">
                    <p className="text-sm opacity-80 mb-1">매달 절약 금액</p>
                    <p className="text-4xl font-black">₩32,500</p>
                  </div>
                </div>
              </RisoCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 구분선 - 하프톤 밴드 */}
      <div className="relative h-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: RISO_COLORS.blue, mixBlendMode: "multiply" }}
        />
        <div
          className="absolute inset-0 translate-y-2"
          style={{ backgroundColor: RISO_COLORS.pink, mixBlendMode: "multiply" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ x: [0, -100] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 text-white font-black text-xl whitespace-nowrap"
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="flex items-center gap-8">
                <span>NETFLIX</span>
                <span className="text-2xl">●</span>
                <span>DISNEY+</span>
                <span className="text-2xl">●</span>
                <span>WAVVE</span>
                <span className="text-2xl">●</span>
                <span>TVING</span>
                <span className="text-2xl">●</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black">
              <RisoTitle color1={RISO_COLORS.blue} color2={RISO_COLORS.pink}>
                Why MoA?
              </RisoTitle>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <RisoCard accentColor={feature.color} className="p-8 h-full">
                  <div
                    className="w-16 h-16 flex items-center justify-center mb-6 relative"
                  >
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: feature.color }}
                    />
                    <div
                      className="absolute inset-0 translate-x-1 translate-y-1"
                      style={{ backgroundColor: RISO_COLORS.pink, mixBlendMode: "multiply", opacity: 0.4 }}
                    />
                    <feature.icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </RisoCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Party Preview Section */}
      <section
        className="relative z-10 px-6 md:px-12 py-20"
        style={{ backgroundColor: `${RISO_COLORS.yellow}20` }}
      >
        <HalftonePattern color={RISO_COLORS.orange} opacity={0.05} size={8} />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <div
                className="inline-block px-4 py-2 font-bold text-white mb-4"
                style={{ backgroundColor: RISO_COLORS.orange }}
              >
                HOT
              </div>
              <h2 className="text-4xl md:text-5xl font-black">지금 인기 파티</h2>
            </div>
            <Link to="/party">
              <RisoButton color={RISO_COLORS.blue}>
                전체 보기 →
              </RisoButton>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <RisoCard
                key={i}
                accentColor={[RISO_COLORS.blue, RISO_COLORS.pink, RISO_COLORS.orange, RISO_COLORS.green][i % 4]}
              >
                <div
                  className="h-32 flex items-center justify-center relative"
                  style={{
                    backgroundColor: ["#E50914", "#113CCF", "#6366F1", "#EC4899"][i % 4],
                  }}
                >
                  <span className="text-5xl font-black text-white/30">{party.platform}</span>
                  <div
                    className="absolute top-3 left-3 px-2 py-1 text-white text-xs font-bold"
                    style={{ backgroundColor: RISO_COLORS.pink }}
                  >
                    모집중
                  </div>
                </div>
                <div className="p-4 bg-[#F5F0E6]">
                  <h3 className="font-bold text-lg mb-2">{party.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {party.members}명
                    </span>
                    <span
                      className="font-black text-lg"
                      style={{ color: RISO_COLORS.blue }}
                    >
                      {party.price}
                    </span>
                  </div>
                </div>
              </RisoCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black">
              <RisoTitle color1={RISO_COLORS.orange} color2={RISO_COLORS.pink}>
                3단계로 시작
              </RisoTitle>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "파티 찾기", desc: "원하는 OTT 파티를 검색하세요", color: RISO_COLORS.blue },
              { num: "02", title: "결제하기", desc: "안전하게 결제를 완료하세요", color: RISO_COLORS.pink },
              { num: "03", title: "바로 시청", desc: "즉시 OTT를 시청하세요", color: RISO_COLORS.orange },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: step.color }}
                  />
                  <div
                    className="absolute inset-0 rounded-full translate-x-2 translate-y-2"
                    style={{ backgroundColor: RISO_COLORS.pink, mixBlendMode: "multiply", opacity: 0.5 }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-3xl font-black">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <RisoCard accentColor={RISO_COLORS.blue} className="p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <RisoTitle color1={RISO_COLORS.blue} color2={RISO_COLORS.pink}>
                  지금 시작하세요
                </RisoTitle>
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto">
                매달 나가는 구독료, 친구들과 나누면 최대 75%까지 절약할 수 있어요
              </p>
              <Link to="/party">
                <RisoButton color={RISO_COLORS.blue} className="text-xl px-12 py-5">
                  <span className="flex items-center gap-3">
                    무료로 시작하기
                    <Sparkles className="w-6 h-6" />
                  </span>
                </RisoButton>
              </Link>
            </RisoCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 px-6 md:px-12 py-12"
        style={{ backgroundColor: RISO_COLORS.black }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: RISO_COLORS.blue }}
              />
              <div
                className="absolute inset-0 rounded-full translate-x-0.5 translate-y-0.5"
                style={{ backgroundColor: RISO_COLORS.pink, mixBlendMode: "screen" }}
              />
            </div>
            <span className="text-white text-xl font-black">MoA</span>
          </div>
          <div className="flex gap-4">
            <OverprintShape shape="circle" color1={RISO_COLORS.blue} color2={RISO_COLORS.pink} size={20} offset={3} />
            <OverprintShape shape="circle" color1={RISO_COLORS.yellow} color2={RISO_COLORS.orange} size={16} offset={2} />
            <OverprintShape shape="circle" color1={RISO_COLORS.green} color2={RISO_COLORS.blue} size={12} offset={2} />
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 MoA. 함께 보면 더 좋아
          </p>
        </div>
      </footer>
    </div>
  );
}
