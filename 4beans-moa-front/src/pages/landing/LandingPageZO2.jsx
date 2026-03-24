import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Shield,
  Zap,
  Sparkles,
  Play,
  ArrowUpRight
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageO2 - "Soft Brutalism"
 *
 * Design Direction:
 * - Toned-down version of Variant O (Neo-Brutalist Pop)
 * - Warm cream/ivory background instead of bright yellow
 * - Muted color palette: soft coral, sage, dusty blue, warm gray
 * - Softer shadows with blur instead of hard offset
 * - Thinner borders (2px instead of 4px)
 * - Minimal emoji usage
 * - Reduced/removed rotations
 * - No marquee text
 * - Playful but sophisticated and mature tone
 */

// Soft Card Component
function SoftCard({ children, accent = false, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`
        bg-white
        border-2 border-stone-200
        shadow-lg shadow-stone-200/50
        hover:shadow-xl hover:shadow-stone-300/50
        hover:border-stone-300
        rounded-2xl
        overflow-hidden
        transition-all duration-300
        ${accent ? 'ring-2 ring-rose-300/50' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// Soft Button Component
function SoftButton({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: `
      bg-stone-900 text-white
      hover:bg-stone-800
      shadow-lg shadow-stone-900/25
      hover:shadow-xl hover:shadow-stone-900/30
    `,
    secondary: `
      bg-white text-stone-900
      border-2 border-stone-200
      hover:border-stone-300 hover:bg-stone-50
      shadow-md shadow-stone-200/50
    `,
    accent: `
      bg-rose-400 text-white
      hover:bg-rose-500
      shadow-lg shadow-rose-400/30
      hover:shadow-xl hover:shadow-rose-400/40
    `,
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-7 py-3.5
        font-semibold text-sm
        rounded-xl
        transition-all duration-300
        flex items-center gap-2
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Tag Component
function Tag({ children, color = "stone" }) {
  const colors = {
    stone: "bg-stone-100 text-stone-600 border-stone-200",
    rose: "bg-rose-50 text-rose-600 border-rose-200",
    sage: "bg-emerald-50 text-emerald-600 border-emerald-200",
    sky: "bg-sky-50 text-sky-600 border-sky-200",
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5
      px-3 py-1.5
      text-xs font-medium
      rounded-full
      border
      ${colors[color]}
    `}>
      {children}
    </span>
  );
}

export default function LandingPageO2() {
  const features = [
    {
      icon: Users,
      title: "파티 공유",
      desc: "최대 4명과 함께 OTT 요금을 나눠요",
      color: "bg-rose-100",
      iconColor: "text-rose-500",
    },
    {
      icon: Shield,
      title: "안전 보장",
      desc: "보증금 시스템으로 안심하고 이용해요",
      color: "bg-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      icon: Zap,
      title: "즉시 시작",
      desc: "가입하면 바로 서비스를 이용할 수 있어요",
      color: "bg-amber-100",
      iconColor: "text-amber-500",
    },
  ];

  const ottServices = [
    { name: "Netflix", letter: "N", color: "bg-rose-500" },
    { name: "Disney+", letter: "D+", color: "bg-indigo-500" },
    { name: "Wavve", letter: "W", color: "bg-sky-500" },
    { name: "Tving", letter: "T", color: "bg-red-500" },
  ];

  const steps = [
    { num: "01", title: "파티 찾기", desc: "원하는 OTT 서비스의 파티를 검색하세요" },
    { num: "02", title: "간편 결제", desc: "안전한 결제 시스템으로 가입하세요" },
    { num: "03", title: "바로 시청", desc: "가입 즉시 서비스 이용이 가능해요" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900">
      {/* Subtle Dot Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #78716c 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight">MoA</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link
              to="/party"
              className="hidden md:block px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              파티 찾기
            </Link>
            <Link to="/login">
              <SoftButton variant="secondary" className="text-sm px-5 py-2.5">
                로그인
              </SoftButton>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <Tag color="rose">
                  <Sparkles className="w-3.5 h-3.5" />
                  최대 75% 절약
                </Tag>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
              >
                <span className="block text-stone-900">OTT 구독료,</span>
                <span className="block text-rose-400">함께 나눠요</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-stone-500 mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed"
              >
                넷플릭스, 디즈니+, 웨이브 등 프리미엄 OTT 서비스를
                합리적인 가격으로 이용하세요.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <Link to="/party">
                  <SoftButton variant="primary">
                    파티 둘러보기
                    <ArrowRight className="w-4 h-4" />
                  </SoftButton>
                </Link>
                <Link to="/party/create">
                  <SoftButton variant="secondary">
                    <Play className="w-4 h-4" />
                    파티 만들기
                  </SoftButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Savings Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative flex justify-center"
            >
              <SoftCard className="w-full max-w-sm p-6" delay={0.2}>
                <div className="text-center mb-5">
                  <Tag color="sage">이번 달 예상 절약</Tag>
                </div>

                <div className="space-y-3 mb-6">
                  {ottServices.slice(0, 3).map((ott, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 ${ott.color} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
                          {ott.letter}
                        </div>
                        <span className="font-medium text-stone-700">{ott.name}</span>
                      </div>
                      <span className="font-bold text-emerald-600">-75%</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-stone-900 text-white p-5 rounded-xl text-center">
                  <p className="text-stone-400 text-sm mb-1">매달 절약하는 금액</p>
                  <p className="text-3xl font-bold">₩32,500</p>
                </div>
              </SoftCard>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-100 rounded-full -z-10 blur-2xl opacity-60" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-100 rounded-full -z-10 blur-2xl opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* OTT Logos */}
      <section className="px-6 md:px-12 py-12 border-y border-stone-200 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {ottServices.map((ott, i) => (
              <motion.div
                key={ott.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-stone-400"
              >
                <div className={`w-8 h-8 ${ott.color} rounded-lg flex items-center justify-center text-white font-semibold text-xs`}>
                  {ott.letter}
                </div>
                <span className="font-medium text-sm">{ott.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Tag color="sky" className="mb-4">왜 MoA인가요?</Tag>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              스마트한 구독 생활의 시작
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <SoftCard key={i} className="p-8" delay={i * 0.1}>
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed">{feature.desc}</p>
              </SoftCard>
            ))}
          </div>
        </div>
      </section>

      {/* Party Preview Section */}
      <section className="px-6 md:px-12 py-24 bg-stone-100/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
          >
            <div>
              <Tag color="rose" className="mb-3">인기 파티</Tag>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">
                지금 모집 중인 파티
              </h2>
            </div>
            <Link to="/party">
              <SoftButton variant="secondary" className="text-sm">
                전체 보기
                <ArrowUpRight className="w-4 h-4" />
              </SoftButton>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_PARTIES.slice(0, 4).map((party, i) => (
              <SoftCard key={i} delay={i * 0.1}>
                {/* Image */}
                <div className={`h-32 ${
                  i % 4 === 0 ? 'bg-rose-400' :
                  i % 4 === 1 ? 'bg-indigo-400' :
                  i % 4 === 2 ? 'bg-sky-400' : 'bg-amber-400'
                } flex items-center justify-center relative`}>
                  <span className="text-4xl font-bold text-white/30">{party.platform}</span>
                  <div className="absolute top-3 left-3">
                    <Tag color="stone">모집중</Tag>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-base mb-3 line-clamp-1">{party.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-stone-500">
                      <Users className="w-4 h-4" />
                      <span>{party.members}명</span>
                    </div>
                    <span className="font-bold text-rose-500">{party.price}</span>
                  </div>
                </div>
              </SoftCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              간단한 3단계로 시작하세요
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`
                    w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center
                    ${i === 0 ? 'bg-rose-100' : i === 1 ? 'bg-amber-100' : 'bg-emerald-100'}
                    shadow-lg
                  `}
                >
                  <span className={`text-2xl font-bold ${
                    i === 0 ? 'text-rose-500' : i === 1 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {step.num}
                  </span>
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-stone-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-3xl mx-auto">
          <SoftCard className="p-10 md:p-14 text-center" delay={0}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-rose-500" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                지금 바로 시작해볼까요?
              </h2>
              <p className="text-lg text-stone-500 mb-10 max-w-md mx-auto">
                매달 빠져나가는 구독료, 이제 합리적으로 나눠요.
                가입 후 바로 파티에 참여할 수 있어요.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/party">
                  <SoftButton variant="accent" className="px-8">
                    무료로 시작하기
                    <ArrowRight className="w-4 h-4" />
                  </SoftButton>
                </Link>
              </div>
            </motion.div>
          </SoftCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 border-t border-stone-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold">MoA</span>
          </div>
          <p className="text-stone-400 text-sm">
            © 2024 MoA. 함께 보면 더 좋아요.
          </p>
        </div>
      </footer>
    </div>
  );
}
