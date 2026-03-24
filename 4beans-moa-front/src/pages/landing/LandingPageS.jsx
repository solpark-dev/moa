import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Shield,
  Zap,
  Check,
  ChevronRight,
  Play,
  Moon,
  Sun,
  Globe,
  Clock,
  CreditCard
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageS - "Cal.com + Vercel Style"
 *
 * Design References:
 * - Cal.com: Clean scheduling UI, purple accents, professional feel
 * - Vercel: Minimal dark/light theme, functional design, developer-focused
 *
 * Features:
 * - Clean light theme with dark mode support
 * - Purple gradient accents
 * - Functional, no-nonsense UI
 * - Grid-based layout
 * - Skeleton loading states aesthetic
 */

// Theme Toggle (Vercel inspired)
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`
        p-2 rounded-lg transition-colors
        ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}
      `}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// Clean Card Component (Vercel style)
function Card({ children, className = "", hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={`
        rounded-xl border transition-all duration-200
        bg-white dark:bg-[#111]
        border-gray-200 dark:border-gray-800
        hover:border-gray-300 dark:hover:border-gray-700
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// Feature Item (Cal.com style)
function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

// Pricing Card (Cal.com inspired)
function PricingCard({ name, price, features, popular = false }) {
  return (
    <Card className={`p-6 ${popular ? "ring-2 ring-purple-500" : ""}`}>
      {popular && (
        <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
          인기
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{price}</span>
        <span className="text-gray-500 dark:text-gray-400">/월</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Check className="w-4 h-4 text-purple-500" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`
          w-full py-2.5 rounded-lg font-medium text-sm transition-colors
          ${popular
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          }
        `}
      >
        시작하기
      </button>
    </Card>
  );
}

// Stat Card (Vercel style)
function StatCard({ value, label }) {
  return (
    <div className="text-center p-6">
      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

export default function LandingPageS() {
  const [isDark, setIsDark] = useState(false);

  const features = [
    {
      icon: Users,
      title: "파티 매칭",
      description: "AI가 최적의 파티원을 자동으로 매칭해드려요",
    },
    {
      icon: Shield,
      title: "보증금 시스템",
      description: "안전한 거래를 위한 보증금 에스크로 제공",
    },
    {
      icon: Clock,
      title: "자동 결제",
      description: "매월 자동으로 구독료가 정산됩니다",
    },
    {
      icon: Globe,
      title: "다양한 서비스",
      description: "Netflix, Disney+, Wavve 등 모든 OTT 지원",
    },
    {
      icon: CreditCard,
      title: "간편 결제",
      description: "카드, 계좌이체 등 다양한 결제 수단",
    },
    {
      icon: Zap,
      title: "즉시 시작",
      description: "결제 완료 후 바로 시청 가능",
    },
  ];

  const pricing = [
    {
      name: "Basic",
      price: "무료",
      features: ["파티 참여", "기본 매칭", "이메일 지원"],
      popular: false,
    },
    {
      name: "Pro",
      price: "₩2,900",
      features: ["파티 생성", "우선 매칭", "24시간 지원", "파티장 혜택"],
      popular: true,
    },
    {
      name: "Team",
      price: "₩9,900",
      features: ["무제한 파티", "API 접근", "전담 매니저", "맞춤 기능"],
      popular: false,
    },
  ];

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="font-semibold">MoA</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/party" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                파티
              </Link>
              <Link to="/product" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                서비스
              </Link>
              <Link to="/community/notice" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                공지사항
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                로그인
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-32">
          <div className="max-w-6xl mx-auto">
            {/* Announcement banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-8"
            >
              <a
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-medium">NEW</span>
                <span className="text-purple-700 dark:text-purple-300">MoA 2.0 출시 — 새로운 기능 확인하기</span>
                <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </a>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                OTT 구독을
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  더 스마트하게
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
                복잡한 구독 관리는 그만. MoA로 OTT 서비스를 공유하고
                최대 75%까지 구독료를 절약하세요.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/party"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  무료로 시작하기
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/party/create"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  데모 보기
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-20"
            >
              <Card className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-800" hover={false}>
                <StatCard value="10K+" label="활성 사용자" />
                <StatCard value="75%" label="평균 절약률" />
                <StatCard value="4.9" label="만족도" />
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-gray-50 dark:bg-[#111]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">모든 것을 한 곳에서</h2>
              <p className="text-gray-600 dark:text-gray-400">OTT 공유에 필요한 모든 기능을 제공합니다</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <FeatureItem {...feature} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Party Preview */}
        <section className="px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">인기 파티</h2>
                <p className="text-gray-600 dark:text-gray-400">지금 바로 참여할 수 있어요</p>
              </div>
              <Link
                to="/party"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
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
                >
                  <Card className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {party.serviceName?.[0] || "O"}
                      </div>
                      <div>
                        <div className="font-medium">{party.serviceName || "OTT"}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{party.currentMembers || 0}명 참여중</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-sm text-gray-500 dark:text-gray-400">월 이용료</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">₩{(party.pricePerMonth || 0).toLocaleString()}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-6 py-24 bg-gray-50 dark:bg-[#111]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">합리적인 가격</h2>
              <p className="text-gray-600 dark:text-gray-400">필요에 맞는 플랜을 선택하세요</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricing.map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PricingCard {...plan} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                복잡한 설정 없이 바로 OTT 공유를 시작할 수 있습니다
              </p>
              <Link
                to="/party"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                무료로 시작하기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">M</span>
                </div>
                <span className="text-sm font-medium">MoA</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <Link to="/community/notice" className="hover:text-gray-900 dark:hover:text-white">공지사항</Link>
                <Link to="/community/faq" className="hover:text-gray-900 dark:hover:text-white">FAQ</Link>
                <Link to="/community/inquiry" className="hover:text-gray-900 dark:hover:text-white">문의하기</Link>
              </div>

              <p className="text-sm text-gray-400">© 2024 MoA. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
