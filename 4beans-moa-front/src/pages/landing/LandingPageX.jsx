import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
    ArrowRight,
    Shield,
    CreditCard,
    Users,
    Zap,
    Star,
    TrendingUp,
    Lock,
    ChevronRight,
    Sparkles,
    Check,
} from "lucide-react";

// Linear/Cursor Style - Dark + Vibrant
// Key: Dark background, neon accents, glow effects, tech-focused

const OTT_SERVICES = [
    { name: "Netflix", color: "#E50914" },
    { name: "Disney+", color: "#113CCF" },
    { name: "Wavve", color: "#1351F9" },
    { name: "Watcha", color: "#FF0558" },
    { name: "TVING", color: "#FF153C" },
    { name: "Coupang", color: "#5F0080" },
];

// Dot Grid Background
const DotGrid = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
            }}
        />
    </div>
);

// Gradient Glow Orbs
const GlowOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
            className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
            style={{ background: 'linear-gradient(180deg, #7c3aed 0%, transparent 70%)' }}
        />
        <div
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
            style={{ background: 'linear-gradient(180deg, #06b6d4 0%, transparent 70%)' }}
        />
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-[150px]"
            style={{ background: 'linear-gradient(180deg, #ec4899 0%, transparent 70%)' }}
        />
    </div>
);

// Glow Button
const GlowButton = ({ children, className = "", variant = "primary", ...props }) => {
    const styles = {
        primary: {
            bg: "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
            glow: "shadow-[0_0_30px_rgba(139,92,246,0.5)]",
            hoverGlow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.7)]",
        },
        secondary: {
            bg: "bg-white/5 border border-white/10",
            glow: "",
            hoverGlow: "hover:bg-white/10 hover:border-white/20",
        },
    };
    const style = styles[variant];

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
                inline-flex items-center gap-2 px-7 py-3.5
                ${style.bg} text-white font-semibold rounded-full
                ${style.glow} ${style.hoverGlow}
                transition-all duration-300
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// Glow Card
const GlowCard = ({ children, className = "", glowColor = "rgba(139,92,246,0.15)" }) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className={`
            relative bg-white/[0.03] backdrop-blur-sm
            border border-white/[0.08] rounded-2xl
            transition-all duration-300
            hover:border-white/[0.15]
            ${className}
        `}
        style={{
            boxShadow: `0 0 40px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
    >
        {children}
    </motion.div>
);

// Feature Card
const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            <GlowCard className="p-6 h-full" glowColor={`${color}20`}>
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                        boxShadow: `0 0 20px ${color}30`,
                    }}
                >
                    <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </GlowCard>
        </motion.div>
    );
};

// Stat Card
const StatCard = ({ value, label, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
        >
            <div
                className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
                style={{ textShadow: '0 0 40px rgba(139,92,246,0.5)' }}
            >
                {value}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">{label}</div>
        </motion.div>
    );
};

// Pricing Card
const PricingCard = ({ name, price, color, features, popular = false, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            <GlowCard
                className={`p-6 ${popular ? 'border-purple-500/30' : ''}`}
                glowColor={popular ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)'}
            >
                {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold rounded-full">
                        인기
                    </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: color }}
                    >
                        {name[0]}
                    </div>
                    <span className="text-white font-semibold">{name}</span>
                </div>

                <div className="mb-6">
                    <span className="text-3xl font-black text-white">{price.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">원/월</span>
                </div>

                <ul className="space-y-3 mb-6">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                            <Check className="w-4 h-4 text-purple-400" />
                            {feature}
                        </li>
                    ))}
                </ul>

                <GlowButton variant={popular ? "primary" : "secondary"} className="w-full justify-center">
                    시작하기
                </GlowButton>
            </GlowCard>
        </motion.div>
    );
};

// Reveal Animation Wrapper
const Reveal = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Main Component
export default function LandingPageX() {
    const { scrollYProgress } = useScroll();
    const headerBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(10,10,11,0)", "rgba(10,10,11,0.9)"]);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white overflow-hidden">
            {/* Fixed Header */}
            <motion.header
                style={{ backgroundColor: headerBg }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/[0.05]"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                                <span className="text-white font-black text-sm">M</span>
                            </div>
                            <span className="text-xl font-black">MoA</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {['기능', '요금', '후기'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item}`}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link to="/login" className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors">
                                로그인
                            </Link>
                            <Link to="/signup">
                                <GlowButton className="text-sm py-2.5 px-5">
                                    시작하기
                                </GlowButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                <DotGrid />
                <GlowOrbs />

                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">OTT 비용 최대 75% 절약</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05]"
                        >
                            <span className="text-white">스마트하게</span>
                            <br />
                            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                                공유하세요
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto"
                        >
                            넷플릭스, 디즈니+, 웨이브 등
                            <br className="hidden md:block" />
                            모든 OTT를 안전하게 나누고 비용을 줄이세요.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/party">
                                <GlowButton>
                                    파티 찾기
                                    <ArrowRight className="w-5 h-5" />
                                </GlowButton>
                            </Link>
                            <GlowButton variant="secondary">
                                <Zap className="w-5 h-5 text-purple-400" />
                                둘러보기
                            </GlowButton>
                        </motion.div>

                        {/* OTT Logos */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="mt-20 flex flex-wrap items-center justify-center gap-4"
                        >
                            {OTT_SERVICES.map((service, i) => (
                                <motion.div
                                    key={service.name}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + i * 0.1 }}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300"
                                    style={{
                                        backgroundColor: service.color,
                                        boxShadow: `0 0 20px ${service.color}40`,
                                    }}
                                >
                                    {service.name[0]}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 relative">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-3 gap-8 md:gap-16">
                        <StatCard value="10K+" label="사용자" delay={0} />
                        <StatCard value="75%" label="평균 절약" delay={0.1} />
                        <StatCard value="4.9" label="평점" delay={0.2} />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="기능" className="py-24 relative">
                <DotGrid />

                <div className="relative max-w-7xl mx-auto px-6">
                    <Reveal className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400 mb-4">
                            Features
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            왜 <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">MoA</span>인가요?
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            안전하고 편리한 OTT 공유의 새로운 기준
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Shield}
                            title="보증금 시스템"
                            description="모든 파티원은 보증금을 예치해요. 무단 이탈 시 보증금으로 보상받을 수 있어요."
                            color="#8b5cf6"
                            delay={0}
                        />
                        <FeatureCard
                            icon={CreditCard}
                            title="자동 정산"
                            description="매월 구독료가 자동으로 분할 정산돼요. 귀찮은 송금은 이제 그만!"
                            color="#ec4899"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Lock}
                            title="계정 암호화"
                            description="OTT 계정 정보는 암호화되어 저장돼요. 파티원도 비밀번호를 볼 수 없어요."
                            color="#06b6d4"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Users}
                            title="신뢰 점수"
                            description="활동 점수와 리뷰로 믿을 수 있는 파티원을 찾을 수 있어요."
                            color="#10b981"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="실시간 알림"
                            description="파티 상태, 결제 알림, 새 파티원 가입 등을 실시간으로 받아보세요."
                            color="#f59e0b"
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="절약 리포트"
                            description="매월 얼마나 절약했는지 한눈에! 연간 절약 금액도 확인할 수 있어요."
                            color="#6366f1"
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="요금" className="py-24 relative">
                <GlowOrbs />

                <div className="relative max-w-7xl mx-auto px-6">
                    <Reveal className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-sm text-fuchsia-400 mb-4">
                            Pricing
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            합리적인 가격
                        </h2>
                        <p className="text-gray-400 text-lg">
                            플랫폼 수수료 0%. 순수 구독료만 나눠요.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <PricingCard
                            name="Netflix"
                            price={4500}
                            color="#E50914"
                            features={["4K Ultra HD", "4명 동시 시청", "광고 없음"]}
                            delay={0}
                        />
                        <PricingCard
                            name="Disney+"
                            price={3500}
                            color="#113CCF"
                            features={["Full HD", "2명 동시 시청", "독점 콘텐츠"]}
                            popular
                            delay={0.1}
                        />
                        <PricingCard
                            name="Wavve"
                            price={3200}
                            color="#1351F9"
                            features={["4K 지원", "4명 동시 시청", "실시간 TV"]}
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 relative">
                <DotGrid />

                <div className="relative max-w-5xl mx-auto px-6">
                    <Reveal className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-4">
                            How It Works
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black">
                            3단계면 충분해요
                        </h2>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { num: "01", title: "가입", desc: "30초면 가입 완료" },
                            { num: "02", title: "선택", desc: "원하는 OTT 파티 선택" },
                            { num: "03", title: "시청", desc: "보증금 예치 후 바로 이용" },
                        ].map((step, i) => (
                            <Reveal key={step.num} delay={i * 0.15} className="text-center">
                                <div
                                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-2xl font-black bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-purple-500/20 text-purple-400"
                                    style={{ boxShadow: '0 0 30px rgba(139,92,246,0.2)' }}
                                >
                                    {step.num}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-gray-500">{step.desc}</p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="후기" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <Reveal className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-sm text-amber-400 mb-4">
                            Reviews
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black">
                            사용자 후기
                        </h2>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { quote: "매달 OTT 비용 5만원 쓰던 게 2만원으로 줄었어요. 진짜 꿀팁!", author: "김지수", role: "대학생" },
                            { quote: "보증금 시스템 덕분에 안심하고 파티에 가입했어요.", author: "이민호", role: "직장인" },
                            { quote: "자동 정산이 너무 편해요. 귀찮게 송금할 필요가 없어요!", author: "박서연", role: "프리랜서" },
                        ].map((review, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <GlowCard className="p-6">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-6 leading-relaxed">"{review.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm">
                                            {review.author[0]}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">{review.author}</div>
                                            <div className="text-gray-500 text-sm">{review.role}</div>
                                        </div>
                                    </div>
                                </GlowCard>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <GlowOrbs />

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <Reveal>
                        <h2 className="text-4xl md:text-6xl font-black mb-6">
                            지금 바로
                            <br />
                            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                                시작하세요
                            </span>
                        </h2>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <p className="text-xl text-gray-400 mb-10">
                            10,000명 이상이 MoA와 함께 절약하고 있어요.
                        </p>
                    </Reveal>

                    <Reveal delay={0.4}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup">
                                <GlowButton className="text-lg px-10 py-4">
                                    무료로 시작하기
                                    <ArrowRight className="w-5 h-5" />
                                </GlowButton>
                            </Link>
                            <Link to="/party">
                                <GlowButton variant="secondary" className="text-lg px-10 py-4">
                                    파티 둘러보기
                                    <ChevronRight className="w-5 h-5" />
                                </GlowButton>
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/[0.05]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                                <span className="text-white font-black text-sm">M</span>
                            </div>
                            <span className="text-xl font-black">MoA</span>
                        </div>

                        <nav className="flex items-center gap-6 text-sm text-gray-500">
                            <Link to="/community/notice" className="hover:text-white transition-colors">공지사항</Link>
                            <Link to="/community/faq" className="hover:text-white transition-colors">FAQ</Link>
                            <Link to="/community/inquiry" className="hover:text-white transition-colors">문의</Link>
                        </nav>

                        <span className="text-sm text-gray-600">© 2025 MoA</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
