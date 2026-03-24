import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Play } from "lucide-react";

/**
 * LandingPageHyundai - "Modern White Minimal"
 *
 * Design Direction (현대카드 스타일):
 * - 흰색 배경 베이스, 여백의 미
 * - 둥글둥글한 버튼 (pill shape)
 * - 검은색으로 텍스트/강조
 * - 색깔로 포인트 (카드별 다른 컬러)
 * - 부드럽고 깔끔한 이미지
 * - 넓은 여백, 시원한 레이아웃
 */

// Pill Button Component - 둥글둥글한 버튼
function PillButton({ children, variant = "primary", size = "md", className = "", ...props }) {
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-white text-black border border-gray-200 hover:border-gray-400 hover:bg-gray-50",
    ghost: "bg-transparent text-black hover:bg-gray-100",
    color: "bg-[#E4002B] text-white hover:bg-[#c70025]",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-10 py-4.5 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        font-medium rounded-full
        transition-all duration-300
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Card Visual Component - 현대카드 스타일 카드
function ServiceCard({ name, color, gradientFrom, gradientTo, price, sharedPrice, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group cursor-pointer"
    >
      {/* Card */}
      <div
        className="relative aspect-[1.6/1] rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-500"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
        }}
      >
        {/* Glossy Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />

        {/* Chip */}
        <div className="absolute top-6 left-6">
          <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-500" />
        </div>

        {/* Logo */}
        <div className="absolute top-6 right-6">
          <span className="text-white/70 text-xs font-semibold tracking-wider">MoA</span>
        </div>

        {/* Service Name */}
        <div className="absolute bottom-6 left-6">
          <p className="text-white/60 text-xs tracking-wider mb-1">STREAMING</p>
          <p className="text-white text-xl font-bold">{name}</p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-5 px-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm line-through">₩{price}/월</p>
            <p className="text-black text-xl font-bold">₩{sharedPrice}<span className="text-gray-400 text-sm font-normal">/월</span></p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Animated Counter
function Counter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPageHyundai() {
  const services = [
    {
      name: "Netflix",
      gradientFrom: "#E50914",
      gradientTo: "#831010",
      price: "17,000",
      sharedPrice: "4,250"
    },
    {
      name: "Disney+",
      gradientFrom: "#0063E5",
      gradientTo: "#0E3B69",
      price: "13,900",
      sharedPrice: "3,475"
    },
    {
      name: "Wavve",
      gradientFrom: "#1E3A8A",
      gradientTo: "#1E1B4B",
      price: "13,900",
      sharedPrice: "3,475"
    },
    {
      name: "Tving",
      gradientFrom: "#FF0050",
      gradientTo: "#B91C47",
      price: "17,000",
      sharedPrice: "4,250"
    },
  ];

  const features = [
    { title: "자동 결제", desc: "매월 자동으로 결제되어 편리하게 이용하세요", color: "#E4002B" },
    { title: "안전 보증금", desc: "보증금 시스템으로 안심하고 거래하세요", color: "#1428A0" },
    { title: "즉시 이용", desc: "가입과 동시에 바로 서비스를 이용하세요", color: "#00A67E" },
    { title: "자유로운 해지", desc: "언제든 위약금 없이 해지할 수 있어요", color: "#F5A623" },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span className="text-xl font-bold">MoA</span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <Link to="/party" className="text-gray-600 hover:text-black transition-colors text-sm">
                파티
              </Link>
              <Link to="/product" className="text-gray-600 hover:text-black transition-colors text-sm">
                서비스
              </Link>
              <Link to="/community/notice" className="text-gray-600 hover:text-black transition-colors text-sm">
                고객센터
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <PillButton variant="ghost" size="sm">
                  로그인
                </PillButton>
              </Link>
              <Link to="/signup">
                <PillButton variant="primary" size="sm">
                  시작하기
                </PillButton>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - 넓은 여백 */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-8"
              >
                <span className="w-2 h-2 bg-[#E4002B] rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">최대 75% 절약</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
                구독의 새로운<br />
                <span className="text-gray-300">기준을 만나다</span>
              </h1>

              <p className="text-xl text-gray-500 mb-12 max-w-xl leading-relaxed">
                프리미엄 OTT 서비스를 합리적인 가격으로.
                MoA와 함께 스마트한 구독 생활을 시작하세요.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/party">
                  <PillButton variant="primary" size="lg">
                    파티 둘러보기
                    <ArrowRight className="w-5 h-5" />
                  </PillButton>
                </Link>
                <Link to="/party/create">
                  <PillButton variant="secondary" size="lg">
                    <Play className="w-4 h-4" />
                    파티 만들기
                  </PillButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats - 심플하게 */}
      <section className="py-16 px-6 lg:px-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: 75, suffix: "%", label: "평균 절약률" },
              { value: 10000, suffix: "+", label: "누적 사용자" },
              { value: 4.9, suffix: "", label: "만족도" },
              { value: 32500, suffix: "", prefix: "₩", label: "월 평균 절약" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center lg:text-left"
              >
                <p className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.prefix}<Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Cards - 여백 충분히 */}
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-gray-500 text-lg">
              다양한 OTT 서비스를 합리적인 가격에
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <ServiceCard
                key={service.name}
                {...service}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features - 깔끔한 그리드 */}
      <section className="py-24 lg:py-32 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              왜 MoA인가요?
            </h2>
            <p className="text-gray-500 text-lg">
              안전하고 편리한 구독 공유 서비스
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Check className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              간단한 3단계
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { num: "01", title: "파티 찾기", desc: "원하는 OTT 서비스의 파티를 검색하세요" },
              { num: "02", title: "간편 결제", desc: "안전한 결제 시스템으로 가입하세요" },
              { num: "03", title: "바로 시청", desc: "가입 즉시 서비스를 이용하세요" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl lg:text-7xl font-bold text-gray-100 mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - 색상 포인트 */}
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-black rounded-[2.5rem] p-12 lg:p-16 text-center text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              지금 시작하세요
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
              매달 빠져나가는 구독료, MoA와 함께 스마트하게 절약하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <PillButton variant="color" size="lg" className="w-full sm:w-auto">
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5" />
                </PillButton>
              </Link>
              <Link to="/party">
                <PillButton variant="secondary" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                  파티 둘러보기
                </PillButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <span className="font-bold">MoA</span>
            </div>

            <div className="flex items-center gap-8">
              <Link to="/community/notice" className="text-sm text-gray-400 hover:text-black transition-colors">
                공지사항
              </Link>
              <Link to="/community/faq" className="text-sm text-gray-400 hover:text-black transition-colors">
                FAQ
              </Link>
              <Link to="/community/inquiry" className="text-sm text-gray-400 hover:text-black transition-colors">
                문의
              </Link>
            </div>

            <p className="text-sm text-gray-400">
              © 2024 MoA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
