import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
    ArrowRight,
    Play,
    Users,
    Shield,
    CreditCard,
    Sparkles,
    ChevronDown,
} from "lucide-react";

// Dropbox-style Extreme Minimalism
// Key: Maximum whitespace, minimal text, single focus point, large animations

// OTT Service Icons for Animation
const OTT_COLORS = ["#E50914", "#113CCF", "#1351F9", "#FF0558", "#FF153C", "#5F0080"];

// Floating OTT Circles Animation (Hero Visual)
const FloatingCircles = () => {
    return (
        <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
            {/* Center Circle */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full bg-black flex items-center justify-center z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="text-white text-3xl md:text-4xl font-black">M</span>
            </motion.div>

            {/* Orbiting Circles */}
            {OTT_COLORS.map((color, i) => {
                const angle = (i * 360) / OTT_COLORS.length;
                const radius = 140;
                const mdRadius = 180;

                return (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{
                            x: "-50%",
                            y: "-50%",
                            scale: 0,
                            opacity: 0
                        }}
                        animate={{
                            x: `calc(-50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`,
                            y: `calc(-50% + ${Math.sin((angle * Math.PI) / 180) * radius}px)`,
                            scale: 1,
                            opacity: 1,
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.3 + i * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={{ scale: 1.2 }}
                    />
                );
            })}

            {/* Rotating Ring */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full border border-gray-200"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Pulsing Ring */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full border border-gray-100"
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
};

// Minimal Section Component
const Section = ({ children, className = "" }) => (
    <section className={`min-h-screen flex items-center justify-center px-6 ${className}`}>
        {children}
    </section>
);

// Animated Text Reveal
const RevealText = ({ children, className = "", delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Feature Item (Minimal)
const FeatureItem = ({ icon: Icon, text, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4"
        >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-lg md:text-xl text-gray-600">{text}</span>
        </motion.div>
    );
};

// Stat Item
const StatItem = ({ value, label, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
        >
            <div className="text-5xl md:text-7xl font-black text-gray-900 mb-2">{value}</div>
            <div className="text-sm md:text-base text-gray-400 uppercase tracking-widest">{label}</div>
        </motion.div>
    );
};

// Main Component
export default function LandingPageV() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
    const headerBlur = useTransform(scrollYProgress, [0, 0.1], [0, 10]);

    return (
        <div ref={containerRef} className="bg-white text-gray-900">
            {/* Minimal Fixed Header */}
            <motion.header
                style={{
                    opacity: headerOpacity,
                    backdropFilter: `blur(${headerBlur}px)`,
                }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/80"
            >
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-xl font-black">MoA</Link>
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full"
                            >
                                시작하기
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section - Maximum Whitespace */}
            <Section>
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
                        {/* Left: Minimal Text */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8"
                            >
                                Share.
                                <br />
                                Save.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="text-xl md:text-2xl text-gray-400 mb-10 max-w-md mx-auto lg:mx-0"
                            >
                                OTT 구독을 나누고
                                <br />
                                비용을 아끼세요.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Link to="/party">
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "#1a1a1a" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-lg font-semibold rounded-full"
                                    >
                                        파티 찾기
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right: Animation */}
                        <div className="flex-1 flex justify-center">
                            <FloatingCircles />
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ChevronDown className="w-6 h-6 text-gray-300" />
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* Stats Section - Clean Numbers */}
            <Section className="bg-gray-50">
                <div className="max-w-4xl mx-auto w-full">
                    <RevealText className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            이미 많은 분들이 함께하고 있어요
                        </h2>
                    </RevealText>

                    <div className="grid grid-cols-3 gap-8 md:gap-16">
                        <StatItem value="10K+" label="사용자" delay={0} />
                        <StatItem value="75%" label="절약" delay={0.1} />
                        <StatItem value="4.9" label="평점" delay={0.2} />
                    </div>
                </div>
            </Section>

            {/* Features Section - Minimal List */}
            <Section>
                <div className="max-w-2xl mx-auto w-full">
                    <RevealText className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            안전하게, 간편하게
                        </h2>
                        <p className="text-gray-400 text-lg">
                            복잡한 건 저희가 다 처리해요
                        </p>
                    </RevealText>

                    <div className="space-y-6">
                        <FeatureItem icon={Shield} text="보증금으로 신뢰를 보장해요" delay={0} />
                        <FeatureItem icon={CreditCard} text="매월 자동으로 정산해요" delay={0.1} />
                        <FeatureItem icon={Users} text="검증된 파티원만 연결해요" delay={0.2} />
                        <FeatureItem icon={Sparkles} text="절약 금액을 한눈에 확인해요" delay={0.3} />
                    </div>
                </div>
            </Section>

            {/* How It Works - 3 Simple Steps */}
            <Section className="bg-gray-50">
                <div className="max-w-4xl mx-auto w-full">
                    <RevealText className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            3단계면 끝
                        </h2>
                    </RevealText>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        {[
                            { num: "1", title: "가입", desc: "30초면 충분해요" },
                            { num: "2", title: "선택", desc: "원하는 OTT를 고르세요" },
                            { num: "3", title: "시청", desc: "바로 이용 시작" },
                        ].map((step, i) => (
                            <RevealText key={step.num} delay={i * 0.15} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black text-white flex items-center justify-center text-2xl font-black">
                                    {step.num}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-400">{step.desc}</p>
                            </RevealText>
                        ))}
                    </div>
                </div>
            </Section>

            {/* CTA Section - Single Focus */}
            <Section>
                <div className="max-w-3xl mx-auto w-full text-center">
                    <RevealText>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
                            매달 아끼는 돈으로
                            <br />
                            <span className="text-gray-300">뭘 할 수 있을까요?</span>
                        </h2>
                    </RevealText>

                    <RevealText delay={0.2}>
                        <p className="text-xl text-gray-400 mb-12">
                            지금 시작하면, 이번 달부터 절약할 수 있어요.
                        </p>
                    </RevealText>

                    <RevealText delay={0.4}>
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white text-xl font-semibold rounded-full"
                            >
                                무료로 시작하기
                                <ArrowRight className="w-6 h-6" />
                            </motion.button>
                        </Link>
                    </RevealText>
                </div>
            </Section>

            {/* Footer - Ultra Minimal */}
            <footer className="py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <span className="text-xl font-black">MoA</span>

                        <nav className="flex items-center gap-8 text-sm text-gray-400">
                            <Link to="/community/notice" className="hover:text-gray-900 transition-colors">공지사항</Link>
                            <Link to="/community/faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
                            <Link to="/community/inquiry" className="hover:text-gray-900 transition-colors">문의</Link>
                        </nav>

                        <span className="text-sm text-gray-300">© 2025 MoA</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
