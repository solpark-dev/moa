import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight,
    Check,
    ChevronRight,
    Shield,
    Sparkles,
    Users,
    Wallet,
    Zap,
    Play,
    Star,
    Globe,
    Lock,
    TrendingUp,
    Heart,
    Clock,
    CreditCard,
} from "lucide-react";

// Mock Data
const MOCK_PARTIES = [
    { id: 1, serviceName: "Netflix", title: "넷플릭스 프리미엄 같이 봐요", hostName: "영화덕후", currentMembers: 3, maxMembers: 4, pricePerMonth: 4500 },
    { id: 2, serviceName: "Disney+", title: "디즈니플러스 파티원 구해요", hostName: "마블팬", currentMembers: 2, maxMembers: 4, pricePerMonth: 3500 },
    { id: 3, serviceName: "Wavve", title: "웨이브 같이 볼 분", hostName: "드라마러버", currentMembers: 1, maxMembers: 4, pricePerMonth: 3200 },
];

const OTT_SERVICES = [
    { name: "Netflix", color: "#E50914", savings: "75%" },
    { name: "Disney+", color: "#113CCF", savings: "75%" },
    { name: "Wavve", color: "#1351F9", savings: "70%" },
    { name: "Watcha", color: "#FF0558", savings: "65%" },
    { name: "TVING", color: "#FF153C", savings: "70%" },
    { name: "Coupang Play", color: "#5F0080", savings: "60%" },
];

// Animated Background Gradient
const AnimatedGradient = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient orbs */}
        <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(99, 91, 255, 0.15) 0%, transparent 70%)",
                top: "-200px",
                right: "-200px",
            }}
            animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(79, 209, 197, 0.1) 0%, transparent 70%)",
                bottom: "100px",
                left: "-100px",
            }}
            animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
                top: "40%",
                left: "50%",
            }}
            animate={{
                scale: [1, 1.2, 1],
                x: ["-50%", "-45%", "-50%"],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

// Grid Pattern Background
const GridPattern = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.1]">
        <svg width="100%" height="100%">
            <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-500" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    </div>
);

// Button Component
const PrimaryButton = ({ children, className = "", ...props }) => (
    <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={`
            inline-flex items-center gap-2 px-6 py-3
            bg-[#635bff] hover:bg-[#5851e8] text-white
            font-semibold rounded-full
            shadow-lg shadow-[#635bff]/25
            transition-colors duration-200
            ${className}
        `}
        {...props}
    >
        {children}
    </motion.button>
);

const SecondaryButton = ({ children, className = "", ...props }) => (
    <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={`
            inline-flex items-center gap-2 px-6 py-3
            bg-[#1E293B] hover:bg-[#334155] text-white
            font-semibold rounded-full
            border border-gray-700
            shadow-sm hover:shadow-md
            transition-all duration-200
            ${className}
        `}
        {...props}
    >
        {children}
    </motion.button>
);

// Feature Card
const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group p-6 bg-[#1E293B] rounded-2xl border border-gray-700 shadow-sm hover:shadow-xl hover:border-gray-600 transition-all duration-300"
    >
        <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${color}20` }}
        >
            <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

// Party Card
const PartyCard = ({ party, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="group relative bg-[#1E293B] rounded-2xl border border-gray-700 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
    >
        {/* Service Banner */}
        <div className="relative h-32 bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
                style={{
                    background: OTT_SERVICES.find(s => s.name === party.serviceName)?.color || "#635bff",
                }}
            >
                {party.serviceName?.[0]}
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold rounded-full">
                모집중
            </div>
        </div>

        {/* Content */}
        <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-[#635bff] bg-[#635bff]/10 px-2 py-1 rounded-full">
                    {party.serviceName}
                </span>
            </div>

            <h3 className="font-bold text-white mb-3 line-clamp-1">{party.title}</h3>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{party.currentMembers}/{party.maxMembers || 4}</span>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-white">
                        {party.pricePerMonth?.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 ml-1">원/월</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#635bff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
);

// Pricing Card
const PricingCard = ({ title, price, features, popular, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`
            relative p-8 rounded-3xl
            ${popular
                ? "bg-[#635bff] text-white shadow-2xl scale-105"
                : "bg-[#1E293B] text-white border border-gray-700 shadow-lg"
            }
        `}
    >
        {popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-[#635bff] text-sm font-semibold rounded-full shadow-lg">
                Most Popular
            </div>
        )}

        <div className="text-center mb-8">
            <h3 className={`text-lg font-semibold mb-2 ${popular ? "text-white/90" : "text-gray-400"}`}>
                {title}
            </h3>
            <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black">{price}</span>
                <span className={`text-sm ${popular ? "text-white/80" : "text-gray-500"}`}>원/월</span>
            </div>
        </div>

        <ul className="space-y-4 mb-8">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${popular ? "bg-white/20" : "bg-green-500/20"}`}>
                        <Check className={`w-3 h-3 ${popular ? "text-white" : "text-green-400"}`} />
                    </div>
                    <span className={`text-sm ${popular ? "text-white/90" : "text-gray-300"}`}>{feature}</span>
                </li>
            ))}
        </ul>

        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                w-full py-3 rounded-xl font-semibold transition-all duration-200
                ${popular
                    ? "bg-white text-[#635bff] hover:bg-gray-100"
                    : "bg-[#635bff] text-white hover:bg-[#5851e8]"
                }
            `}
        >
            시작하기
        </motion.button>
    </motion.div>
);

// Stat Card
const StatCard = ({ value, label, icon: Icon, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="text-center p-6"
    >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#635bff]/20 mb-4">
            <Icon className="w-6 h-6 text-[#635bff]" />
        </div>
        <div className="text-4xl font-black text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400 font-medium">{label}</div>
    </motion.div>
);

// Testimonial Card
const TestimonialCard = ({ quote, author, role, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-[#1E293B] p-8 rounded-2xl border border-gray-700 shadow-sm"
    >
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
        <p className="text-gray-300 mb-6 leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center text-white font-bold text-sm">
                {author[0]}
            </div>
            <div>
                <div className="font-semibold text-white">{author}</div>
                <div className="text-sm text-gray-500">{role}</div>
            </div>
        </div>
    </motion.div>
);

// Main Component
export default function LandingPageW() {
    const { scrollYProgress } = useScroll();
    const headerBg = useTransform(scrollYProgress, [0, 0.1], ["rgba(11, 17, 32, 0)", "rgba(11, 17, 32, 0.9)"]);

    return (
        <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden font-sans">
            {/* Floating Header */}
            <motion.header
                style={{ backgroundColor: headerBg }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-800/50"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center">
                                <span className="text-white font-black text-sm">M</span>
                            </div>
                            <span className="text-xl font-black text-white">MoA</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                기능
                            </a>
                            <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                요금
                            </a>
                            <a href="#testimonials" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                후기
                            </a>
                        </nav>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                로그인
                            </Link>
                            <Link to="/signup">
                                <PrimaryButton className="text-sm py-2">
                                    무료로 시작하기
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
                <AnimatedGradient />
                <GridPattern />

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#635bff]/20 rounded-full mb-8 border border-[#635bff]/30"
                        >
                            <Sparkles className="w-4 h-4 text-[#635bff]" />
                            <span className="text-sm font-semibold text-[#635bff]">
                                OTT 구독 비용, 최대 75% 절약
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
                        >
                            <span className="text-white">스마트하게 공유하고</span>
                            <br />
                            <span className="bg-gradient-to-r from-[#635bff] via-[#00d4ff] to-[#00d4ff] bg-clip-text text-transparent">
                                더 적게 지불하세요
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            MoA와 함께라면 넷플릭스, 디즈니+, 웨이브 등<br className="hidden md:block" />
                            모든 OTT 서비스를 안전하고 저렴하게 이용할 수 있어요.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/party">
                                <PrimaryButton className="text-base px-8 py-4">
                                    파티 둘러보기
                                    <ArrowRight className="w-5 h-5" />
                                </PrimaryButton>
                            </Link>
                            <SecondaryButton className="text-base px-8 py-4">
                                <Play className="w-5 h-5" />
                                서비스 소개 보기
                            </SecondaryButton>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
                        >
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span>안전한 결제</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span>10,000+ 사용자</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>4.9/5 평점</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="mt-16 relative"
                    >
                        {/* Browser Mockup */}
                        <div className="relative mx-auto max-w-5xl">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#635bff]/20 via-[#00d4ff]/20 to-[#635bff]/20 rounded-3xl blur-2xl opacity-50" />
                            <div className="relative bg-[#1E293B] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
                                {/* Browser Chrome */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-[#0F172A] border-b border-gray-800">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="px-4 py-1 bg-[#1E293B] rounded-full text-sm text-gray-400 border border-gray-700">
                                            moa.app/party
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {MOCK_PARTIES.map((party, i) => (
                                            <PartyCard key={party.id} party={party} index={i} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* OTT Logos Section */}
            <section className="py-16 border-y border-gray-800 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm text-gray-400 mb-8 font-medium">
                        주요 OTT 서비스를 모두 지원해요
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        {OTT_SERVICES.map((service, i) => (
                            <motion.div
                                key={service.name}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-2 group"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: service.color }}
                                >
                                    {service.name[0]}
                                </div>
                                <span className="text-gray-400 font-medium hidden sm:block group-hover:text-white transition-colors">{service.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 relative bg-[#0B1120]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1 bg-[#635bff]/20 rounded-full text-sm font-semibold text-[#635bff] mb-4"
                        >
                            Features
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-black text-white mb-4"
                        >
                            왜 MoA를 선택해야 할까요?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-gray-400 max-w-2xl mx-auto"
                        >
                            안전하고 편리한 OTT 공유 플랫폼, MoA의 특별한 기능들을 만나보세요.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Shield}
                            title="안전한 보증금 시스템"
                            description="모든 파티원은 보증금을 예치하여 무단 이탈을 방지해요. 정상 탈퇴 시 100% 환불됩니다."
                            color="#635bff"
                            delay={0}
                        />
                        <FeatureCard
                            icon={CreditCard}
                            title="자동 정산"
                            description="매월 구독료가 자동으로 분할되어 파티장에게 정산됩니다. 번거로운 송금 없이 편하게!"
                            color="#00d4ff"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Lock}
                            title="계정 정보 보호"
                            description="OTT 계정 정보는 암호화되어 안전하게 보관됩니다. 파티원도 비밀번호를 볼 수 없어요."
                            color="#ec4899"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Users}
                            title="신뢰 검증 시스템"
                            description="활동 점수와 리뷰로 신뢰할 수 있는 파티원을 찾을 수 있어요."
                            color="#10b981"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Clock}
                            title="실시간 알림"
                            description="파티 상태 변화, 결제 알림, 새 파티원 가입 등을 실시간으로 알려드려요."
                            color="#f59e0b"
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="절약 리포트"
                            description="매월 얼마나 절약했는지 한눈에 확인하세요. 연간 절약 금액도 계산해드려요."
                            color="#8b5cf6"
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatCard value="10K+" label="활성 사용자" icon={Users} delay={0} />
                        <StatCard value="75%" label="평균 절약률" icon={TrendingUp} delay={0.1} />
                        <StatCard value="4.9" label="사용자 평점" icon={Star} delay={0.2} />
                        <StatCard value="24/7" label="고객 지원" icon={Heart} delay={0.3} />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 relative overflow-hidden bg-[#0B1120]">
                <AnimatedGradient />

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1 bg-[#635bff]/20 rounded-full text-sm font-semibold text-[#635bff] mb-4"
                        >
                            How It Works
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-black text-white mb-4"
                        >
                            3단계로 시작하세요
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-24 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-[#635bff] via-[#00d4ff] to-[#635bff] opacity-50" />

                        {[
                            { step: 1, title: "회원가입", desc: "간편하게 가입하고 프로필을 완성하세요" },
                            { step: 2, title: "파티 선택", desc: "원하는 OTT 서비스의 파티를 찾거나 직접 만드세요" },
                            { step: 3, title: "함께 시청", desc: "보증금 예치 후 바로 서비스를 이용하세요" },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative text-center"
                            >
                                <div className="relative z-10 w-12 h-12 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#635bff]/30">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1 bg-[#635bff]/20 rounded-full text-sm font-semibold text-[#635bff] mb-4"
                        >
                            Pricing
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-black text-white mb-4"
                        >
                            합리적인 가격
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-gray-400"
                        >
                            플랫폼 수수료는 무료! 순수 구독료만 분담하세요.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <PricingCard
                            title="Netflix 프리미엄"
                            price="4,500"
                            features={[
                                "4K Ultra HD 지원",
                                "4명까지 동시 시청",
                                "광고 없는 시청",
                                "모든 기기에서 이용",
                            ]}
                            delay={0}
                        />
                        <PricingCard
                            title="Disney+ 스탠다드"
                            price="3,500"
                            features={[
                                "Full HD 지원",
                                "2명까지 동시 시청",
                                "독점 콘텐츠 접근",
                                "다운로드 지원",
                                "IMAX Enhanced",
                            ]}
                            popular
                            delay={0.1}
                        />
                        <PricingCard
                            title="Wavve 프리미엄"
                            price="3,200"
                            features={[
                                "4K 지원",
                                "4명까지 동시 시청",
                                "실시간 TV 채널",
                                "KBS, MBC, SBS 포함",
                            ]}
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-[#0B1120]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1 bg-[#635bff]/20 rounded-full text-sm font-semibold text-[#635bff] mb-4"
                        >
                            Testimonials
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-black text-white mb-4"
                        >
                            사용자들의 이야기
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TestimonialCard
                            quote="매달 OTT 비용으로 5만원 넘게 썼는데, MoA 덕분에 2만원도 안 써요. 진짜 꿀팁!"
                            author="김지수"
                            role="대학생"
                            delay={0}
                        />
                        <TestimonialCard
                            quote="보증금 시스템이 있어서 안심하고 파티에 가입했어요. 자동 정산도 너무 편해요."
                            author="이민호"
                            role="직장인"
                            delay={0.1}
                        />
                        <TestimonialCard
                            quote="넷플릭스, 디즈니+ 다 보고 싶었는데 비용이 부담됐거든요. 이제 부담 없이 다 봐요!"
                            author="박서연"
                            role="프리랜서"
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a2540] via-[#0f2e4e] to-[#0a2540]" />

                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute w-[600px] h-[600px] rounded-full"
                        style={{
                            background: "radial-gradient(circle, rgba(99, 91, 255, 0.15) 0%, transparent 70%)",
                            top: "-200px",
                            right: "-100px",
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                            지금 바로 시작하세요
                        </h2>
                        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                            10,000명 이상의 사용자가 MoA와 함께 OTT 비용을 절약하고 있어요.
                            <br />
                            첫 달 무료 체험으로 시작해보세요.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a2540] font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    무료로 시작하기
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <Link to="/party">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-200"
                                >
                                    파티 둘러보기
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-800 bg-[#0B1120]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center">
                                <span className="text-white font-black text-sm">M</span>
                            </div>
                            <span className="text-xl font-black text-white">MoA</span>
                        </div>

                        <nav className="flex items-center gap-6 text-sm text-gray-400">
                            <Link to="/community/notice" className="hover:text-white transition-colors">공지사항</Link>
                            <Link to="/community/faq" className="hover:text-white transition-colors">자주 묻는 질문</Link>
                            <Link to="/community/inquiry" className="hover:text-white transition-colors">문의하기</Link>
                        </nav>

                        <p className="text-sm text-gray-600">
                            © 2025 MoA. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
