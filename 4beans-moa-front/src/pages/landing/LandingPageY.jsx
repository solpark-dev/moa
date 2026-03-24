import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
    ArrowRight,
    Shield,
    CreditCard,
    Users,
    Play,
    ChevronDown,
} from "lucide-react";

// Apple Style - Premium Minimalism
// Key: Giant typography, scroll animations, product-focused, refined whitespace

const OTT_SERVICES = [
    { name: "Netflix", color: "#E50914" },
    { name: "Disney+", color: "#113CCF" },
    { name: "Wavve", color: "#1351F9" },
    { name: "Watcha", color: "#FF0558" },
    { name: "TVING", color: "#FF153C" },
    { name: "Coupang", color: "#5F0080" },
];

// Scroll-based Section Component
const ScrollSection = ({ children, className = "" }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

    return (
        <motion.section
            ref={ref}
            style={{ opacity, y }}
            className={`min-h-screen flex items-center justify-center px-6 ${className}`}
        >
            {children}
        </motion.section>
    );
};

// Fade In Component
const FadeIn = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 1,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Giant Text Component
const GiantText = ({ children, className = "" }) => (
    <h2 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-tight leading-[0.95] ${className}`}>
        {children}
    </h2>
);

// Apple-style Button
const AppleButton = ({ children, variant = "primary", className = "", ...props }) => {
    const styles = {
        primary: "bg-[#0071e3] hover:bg-[#0077ED] text-white",
        secondary: "bg-transparent text-[#0071e3] hover:text-[#0077ED]",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                inline-flex items-center gap-2 px-7 py-3.5
                text-lg font-medium rounded-full
                transition-colors duration-200
                ${styles[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// Feature Block
const FeatureBlock = ({ icon: Icon, title, description, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center"
        >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon className="w-7 h-7 text-gray-900" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xs mx-auto">{description}</p>
        </motion.div>
    );
};

// OTT Visual Grid
const OTTVisualGrid = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-2xl mx-auto aspect-square"
        >
            {/* Center Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gray-900 flex items-center justify-center z-10 shadow-2xl">
                <span className="text-white text-4xl md:text-5xl font-semibold">M</span>
            </div>

            {/* Orbiting OTT Icons */}
            {OTT_SERVICES.map((service, i) => {
                const angle = (i * 360) / OTT_SERVICES.length - 90;
                const radius = 42; // percentage

                return (
                    <motion.div
                        key={service.name}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                            duration: 0.6,
                            delay: 0.3 + i * 0.1,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className="absolute w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-white font-semibold text-xl md:text-2xl shadow-xl"
                        style={{
                            backgroundColor: service.color,
                            top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
                            left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {service.name[0]}
                    </motion.div>
                );
            })}

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <circle
                    cx="50%"
                    cy="50%"
                    r="38%"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                />
            </svg>
        </motion.div>
    );
};

// Pricing Visual
const PricingVisual = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const prices = [
        { service: "Netflix", original: 17000, moa: 4500 },
        { service: "Disney+", original: 13900, moa: 3500 },
        { service: "Wavve", original: 13900, moa: 3200 },
    ];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-xl mx-auto"
        >
            <div className="space-y-4">
                {prices.map((item, i) => (
                    <motion.div
                        key={item.service}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                        className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold"
                                style={{ backgroundColor: OTT_SERVICES.find(s => s.name === item.service)?.color }}
                            >
                                {item.service[0]}
                            </div>
                            <span className="text-lg font-medium text-gray-900">{item.service}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-400 line-through">{item.original.toLocaleString()}원</div>
                            <div className="text-2xl font-semibold text-gray-900">{item.moa.toLocaleString()}원</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 p-6 bg-[#0071e3] rounded-2xl text-center text-white"
            >
                <div className="text-sm font-medium opacity-80 mb-1">연간 절약 금액</div>
                <div className="text-4xl font-semibold">약 360,000원</div>
            </motion.div>
        </motion.div>
    );
};

// Main Component
export default function LandingPageY() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const headerBg = useTransform(
        scrollYProgress,
        [0, 0.02],
        ["rgba(255,255,255,0)", "rgba(255,255,255,0.8)"]
    );

    return (
        <div ref={containerRef} className="bg-white text-gray-900">
            {/* Fixed Header - Apple Style */}
            <motion.header
                style={{ backgroundColor: headerBg }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
            >
                <div className="max-w-[980px] mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-xl font-semibold text-gray-900">
                            MoA
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {['기능', '가격', '시작하기'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item}`}
                                    className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        <Link to="/signup">
                            <AppleButton className="text-sm py-2 px-5">
                                시작하기
                            </AppleButton>
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
                <div className="max-w-[980px] mx-auto text-center">
                    <FadeIn>
                        <GiantText className="text-gray-900 mb-6">
                            OTT,
                            <br />
                            나누면 더 좋다.
                        </GiantText>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium">
                            넷플릭스, 디즈니+, 웨이브.
                            <br />
                            함께 보면 최대 75% 절약할 수 있어요.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/party">
                                <AppleButton>
                                    파티 찾기
                                    <ArrowRight className="w-5 h-5" />
                                </AppleButton>
                            </Link>
                            <AppleButton variant="secondary">
                                <Play className="w-5 h-5" />
                                서비스 소개
                            </AppleButton>
                        </div>
                    </FadeIn>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ChevronDown className="w-6 h-6 text-gray-300" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Visual Section */}
            <section className="py-32 px-6">
                <div className="max-w-[980px] mx-auto">
                    <FadeIn className="text-center mb-20">
                        <GiantText className="text-gray-900">
                            모든 OTT를
                            <br />
                            한 곳에서.
                        </GiantText>
                    </FadeIn>

                    <OTTVisualGrid />
                </div>
            </section>

            {/* Features Section */}
            <section id="기능" className="py-32 px-6 bg-[#f5f5f7]">
                <div className="max-w-[980px] mx-auto">
                    <FadeIn className="text-center mb-20">
                        <GiantText className="text-gray-900">
                            안전하게.
                            <br />
                            간편하게.
                        </GiantText>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        <FeatureBlock
                            icon={Shield}
                            title="보증금 시스템"
                            description="무단 이탈 걱정 없이, 안심하고 파티에 참여하세요."
                            index={0}
                        />
                        <FeatureBlock
                            icon={CreditCard}
                            title="자동 정산"
                            description="매달 자동으로 분할 정산. 번거로운 송금은 이제 그만."
                            index={1}
                        />
                        <FeatureBlock
                            icon={Users}
                            title="신뢰 검증"
                            description="활동 점수와 리뷰로 믿을 수 있는 파티원을 찾으세요."
                            index={2}
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="가격" className="py-32 px-6">
                <div className="max-w-[980px] mx-auto">
                    <FadeIn className="text-center mb-20">
                        <GiantText className="text-gray-900">
                            매달 이만큼
                            <br />
                            아낄 수 있어요.
                        </GiantText>
                    </FadeIn>

                    <PricingVisual />
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-32 px-6 bg-gray-900 text-white">
                <div className="max-w-[980px] mx-auto">
                    <FadeIn className="text-center mb-20">
                        <GiantText className="text-white">
                            시작은
                            <br />
                            간단해요.
                        </GiantText>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                        {[
                            { num: "1", title: "가입", desc: "이메일 하나면 충분해요" },
                            { num: "2", title: "선택", desc: "원하는 OTT 파티를 고르세요" },
                            { num: "3", title: "시청", desc: "바로 이용을 시작하세요" },
                        ].map((step, i) => (
                            <FadeIn key={step.num} delay={i * 0.15} className="text-center">
                                <div className="text-8xl font-semibold text-white/10 mb-4">
                                    {step.num}
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-lg">{step.desc}</p>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="시작하기" className="py-32 px-6">
                <div className="max-w-[980px] mx-auto text-center">
                    <FadeIn>
                        <GiantText className="text-gray-900 mb-8">
                            지금 시작하세요.
                        </GiantText>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-xl mx-auto">
                            10,000명 이상이 MoA와 함께
                            <br />
                            OTT 비용을 절약하고 있어요.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <Link to="/signup">
                            <AppleButton className="text-xl px-10 py-4">
                                무료로 시작하기
                                <ArrowRight className="w-6 h-6" />
                            </AppleButton>
                        </Link>
                    </FadeIn>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-[#f5f5f7]">
                <div className="max-w-[980px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <span className="text-sm font-medium text-gray-900">MoA</span>

                        <nav className="flex items-center gap-6 text-xs text-gray-500">
                            <Link to="/community/notice" className="hover:text-gray-900 transition-colors">공지사항</Link>
                            <Link to="/community/faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
                            <Link to="/community/inquiry" className="hover:text-gray-900 transition-colors">문의하기</Link>
                        </nav>

                        <span className="text-xs text-gray-400">
                            Copyright © 2025 MoA. All rights reserved.
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
