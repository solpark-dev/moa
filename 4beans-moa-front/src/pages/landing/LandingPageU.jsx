import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight,
    Check,
    ChevronRight,
    Shield,
    Sparkles,
    Users,
    Zap,
    Play,
    Star,
    Lock,
    TrendingUp,
    CreditCard,
    Eye,
    Heart,
    Clock,
    MessageCircle,
    Send,
    ChevronDown,
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

// Floating Pastel Blobs Background (KWANGYA Style)
const PastelBlobs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main large blob - top right */}
        <motion.div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-40"
            style={{
                background: "radial-gradient(circle, rgba(167, 139, 250, 0.4) 0%, rgba(167, 139, 250, 0) 70%)",
            }}
            animate={{
                scale: [1, 1.1, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Secondary blob - bottom left */}
        <motion.div
            className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full opacity-30"
            style={{
                background: "radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0) 70%)",
            }}
            animate={{
                scale: [1, 1.15, 1],
                x: [0, -15, 0],
                y: [0, 15, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Accent blob - center */}
        <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
            style={{
                background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 60%)",
            }}
            animate={{
                scale: [1, 1.05, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Small floating blob - top left */}
        <motion.div
            className="absolute top-20 left-20 w-[200px] h-[200px] rounded-full opacity-30"
            style={{
                background: "radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, transparent 70%)",
            }}
            animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Small floating blob - bottom right */}
        <motion.div
            className="absolute bottom-40 right-20 w-[150px] h-[150px] rounded-full opacity-25"
            style={{
                background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
            }}
            animate={{
                y: [0, 20, 0],
                x: [0, -10, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

// Subtle Grid Pattern
const SubtleGrid = () => (
    <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
            backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
        }}
    />
);

// Primary Button - Rounded with gradient
const PrimaryButton = ({ children, className = "", ...props }) => (
    <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
            inline-flex items-center gap-2 px-8 py-4
            bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500
            hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600
            text-white font-bold rounded-full
            shadow-lg shadow-purple-500/25
            transition-all duration-300
            ${className}
        `}
        {...props}
    >
        {children}
    </motion.button>
);

// Secondary Button - Outline style
const SecondaryButton = ({ children, className = "", ...props }) => (
    <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
            inline-flex items-center gap-2 px-8 py-4
            bg-white/80 backdrop-blur-sm
            text-gray-800 font-bold rounded-full
            border-2 border-gray-200 hover:border-purple-300
            shadow-sm hover:shadow-md
            transition-all duration-300
            ${className}
        `}
        {...props}
    >
        {children}
    </motion.button>
);

// Clean Card Component (KWANGYA Style - minimal, soft shadows)
const CleanCard = ({ children, className = "", hover = true }) => (
    <motion.div
        whileHover={hover ? { y: -8, scale: 1.02 } : {}}
        className={`
            relative bg-white/80 backdrop-blur-xl
            rounded-3xl border border-gray-100
            shadow-xl shadow-gray-200/50
            transition-all duration-500
            ${className}
        `}
    >
        {children}
    </motion.div>
);

// Party Card Component
const PartyCard = ({ party, index }) => {
    const serviceColor = OTT_SERVICES.find(s => s.name === party.serviceName)?.color || "#8b5cf6";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <CleanCard className="overflow-hidden">
                {/* Service Header */}
                <div
                    className="relative h-32 flex items-center justify-center"
                    style={{
                        background: `linear-gradient(135deg, ${serviceColor}15, ${serviceColor}05)`,
                    }}
                >
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
                        style={{
                            backgroundColor: serviceColor,
                            boxShadow: `0 10px 30px ${serviceColor}40`,
                        }}
                    >
                        {party.serviceName?.[0]}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">
                        모집중
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-2">
                        <span
                            className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                            style={{
                                color: serviceColor,
                                backgroundColor: `${serviceColor}15`,
                            }}
                        >
                            {party.serviceName}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-1">{party.title}</h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{party.currentMembers}/{party.maxMembers}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-gray-900">
                                {party.pricePerMonth?.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-400 ml-1">원/월</span>
                        </div>
                    </div>
                </div>
            </CleanCard>
        </motion.div>
    );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color = "#8b5cf6", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
    >
        <CleanCard className="p-8 h-full">
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{
                    background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                }}
            >
                <Icon className="w-7 h-7" style={{ color }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{description}</p>
        </CleanCard>
    </motion.div>
);

// Stat Component
const StatItem = ({ value, label, icon: Icon, color = "#8b5cf6", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="text-center p-6"
    >
        <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
                background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            }}
        >
            <Icon className="w-8 h-8" style={{ color }} />
        </div>
        <div className="text-4xl font-black text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
    </motion.div>
);

// Testimonial Card
const TestimonialCard = ({ quote, author, role, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
    >
        <CleanCard className="p-8">
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">"{quote}"</p>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                    {author[0]}
                </div>
                <div>
                    <div className="font-bold text-gray-900">{author}</div>
                    <div className="text-sm text-gray-500">{role}</div>
                </div>
            </div>
        </CleanCard>
    </motion.div>
);

// Main Component
export default function LandingPageU() {
    const { scrollYProgress } = useScroll();
    const headerBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(255,255,255,0)", "rgba(255,255,255,0.9)"]);

    return (
        <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
            {/* Floating Header */}
            <motion.header
                style={{ backgroundColor: headerBg }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-gray-100/50"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <span className="text-white font-black text-lg">M</span>
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                MoA
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {['기능', '요금', '후기'].map((item, i) => (
                                <a
                                    key={item}
                                    href={`#${['features', 'pricing', 'testimonials'][i]}`}
                                    className="text-sm font-semibold text-gray-600 hover:text-purple-600 transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-600 hover:text-purple-600 transition-colors"
                            >
                                로그인
                            </Link>
                            <Link to="/signup">
                                <PrimaryButton className="text-sm py-2.5 px-6">
                                    시작하기
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                <PastelBlobs />
                <SubtleGrid />

                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-50 border border-purple-100 rounded-full mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-semibold text-purple-700">
                                OTT 구독 비용, 최대 75% 절약
                            </span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
                        >
                            <span className="text-gray-900">함께 보면</span>
                            <br />
                            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                                더 좋은 가격
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
                        >
                            MoA와 함께 넷플릭스, 디즈니+, 웨이브를
                            <br className="hidden md:block" />
                            안전하고 저렴하게 공유하세요.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/party">
                                <PrimaryButton>
                                    파티 둘러보기
                                    <ArrowRight className="w-5 h-5" />
                                </PrimaryButton>
                            </Link>
                            <SecondaryButton>
                                <Play className="w-5 h-5 text-purple-500" />
                                서비스 소개
                            </SecondaryButton>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
                        >
                            {[
                                { icon: Shield, text: "안전한 결제", color: "#10b981" },
                                { icon: Users, text: "10,000+ 사용자", color: "#8b5cf6" },
                                { icon: Star, text: "4.9/5 평점", color: "#f59e0b" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                    <span className="font-medium">{item.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Hero Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mt-20 relative"
                    >
                        <div className="relative mx-auto max-w-5xl">
                            {/* Glow */}
                            <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 rounded-full" />

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                                {MOCK_PARTIES.map((party, i) => (
                                    <PartyCard key={party.id} party={party} index={i} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-xs text-gray-400 font-medium">스크롤</span>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                </motion.div>
            </section>

            {/* OTT Services Section */}
            <section className="py-20 relative bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-sm text-gray-400 mb-10 font-medium"
                    >
                        지원하는 OTT 서비스
                    </motion.p>

                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        {OTT_SERVICES.map((service, i) => (
                            <motion.div
                                key={service.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.1 }}
                                className="flex items-center gap-3 group cursor-pointer"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300"
                                    style={{
                                        backgroundColor: service.color,
                                        boxShadow: `0 8px 24px ${service.color}30`,
                                    }}
                                >
                                    {service.name[0]}
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-gray-900 font-semibold">{service.name}</div>
                                    <div className="text-xs font-medium" style={{ color: service.color }}>
                                        ~{service.savings} 절약
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 relative">
                <PastelBlobs />

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-2 bg-purple-50 border border-purple-100 rounded-full text-sm font-semibold text-purple-600 mb-4"
                        >
                            Features
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
                        >
                            왜 MoA를 선택할까요?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-gray-500 max-w-2xl mx-auto"
                        >
                            안전하고 편리한 OTT 공유 플랫폼의 특별한 기능들
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Shield}
                            title="보증금 시스템"
                            description="모든 파티원은 보증금을 예치하여 무단 이탈을 방지해요. 정상 탈퇴 시 100% 환불됩니다."
                            color="#8b5cf6"
                            delay={0}
                        />
                        <FeatureCard
                            icon={CreditCard}
                            title="자동 정산"
                            description="매월 구독료가 자동으로 분할되어 파티장에게 정산됩니다. 번거로운 송금 없이 편하게!"
                            color="#ec4899"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Lock}
                            title="계정 암호화"
                            description="OTT 계정 정보는 암호화되어 안전하게 보관됩니다. 파티원도 비밀번호를 볼 수 없어요."
                            color="#f59e0b"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Users}
                            title="신뢰 시스템"
                            description="활동 점수와 리뷰로 신뢰할 수 있는 파티원을 찾을 수 있어요."
                            color="#10b981"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="실시간 알림"
                            description="파티 상태 변화, 결제 알림, 새 파티원 가입 등을 실시간으로 알려드려요."
                            color="#3b82f6"
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="절약 리포트"
                            description="매월 얼마나 절약했는지 한눈에 확인하세요. 연간 절약 금액도 계산해드려요."
                            color="#6366f1"
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 relative bg-gradient-to-b from-purple-50/50 to-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatItem value="10K+" label="활성 사용자" icon={Users} color="#8b5cf6" delay={0} />
                        <StatItem value="75%" label="평균 절약률" icon={TrendingUp} color="#ec4899" delay={0.1} />
                        <StatItem value="4.9" label="사용자 평점" icon={Star} color="#f59e0b" delay={0.2} />
                        <StatItem value="24/7" label="고객 지원" icon={Heart} color="#10b981" delay={0.3} />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 relative">
                <SubtleGrid />

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-2 bg-fuchsia-50 border border-fuchsia-100 rounded-full text-sm font-semibold text-fuchsia-600 mb-4"
                        >
                            How It Works
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-gray-900"
                        >
                            3단계로 시작하세요
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 rounded-full" />

                        {[
                            { step: '01', title: '회원가입', desc: '간편하게 가입하고 프로필을 완성하세요', color: '#8b5cf6' },
                            { step: '02', title: '파티 선택', desc: '원하는 OTT 서비스의 파티를 찾거나 직접 만드세요', color: '#a855f7' },
                            { step: '03', title: '함께 시청', desc: '보증금 예치 후 바로 서비스를 이용하세요', color: '#d946ef' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative text-center"
                            >
                                <div
                                    className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
                                    style={{
                                        backgroundColor: item.color,
                                        boxShadow: `0 10px 30px ${item.color}40`,
                                    }}
                                >
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-2 bg-amber-50 border border-amber-100 rounded-full text-sm font-semibold text-amber-600 mb-4"
                        >
                            Reviews
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-gray-900"
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
                <PastelBlobs />

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <CleanCard className="p-12 md:p-16" hover={false}>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                                지금 바로 시작하세요
                            </h2>
                            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
                                10,000명 이상의 사용자가 MoA와 함께 OTT 비용을 절약하고 있어요.
                                <br />
                                첫 달 무료 체험으로 시작해보세요.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/signup">
                                    <PrimaryButton className="text-lg">
                                        무료로 시작하기
                                        <ArrowRight className="w-5 h-5" />
                                    </PrimaryButton>
                                </Link>
                                <Link to="/party">
                                    <SecondaryButton className="text-lg">
                                        파티 둘러보기
                                        <ChevronRight className="w-5 h-5" />
                                    </SecondaryButton>
                                </Link>
                            </div>
                        </CleanCard>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <span className="text-white font-black">M</span>
                            </div>
                            <span className="text-xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                MoA
                            </span>
                        </div>

                        <nav className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                            <Link to="/community/notice" className="hover:text-purple-600 transition-colors">공지사항</Link>
                            <Link to="/community/faq" className="hover:text-purple-600 transition-colors">FAQ</Link>
                            <Link to="/community/inquiry" className="hover:text-purple-600 transition-colors">문의</Link>
                        </nav>

                        <p className="text-sm text-gray-400">
                            © 2025 MoA. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
