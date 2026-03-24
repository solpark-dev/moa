import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import {
    ArrowRight,
    Shield,
    Zap,
    Users,
    Sparkles,
    Play,
    CheckCircle2,
    TrendingUp
} from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageQ - "Kinetic Brand Flow"
 *
 * Design Direction:
 * - Evolution of Variant P with trendier "Bento Grid" and "Aurora Gradients"
 * - High-end "Apple/Linear-like" Light Mode aesthetic
 * - Advanced SVG path animations for the MoA logo
 * - Soft, dreamy, yet precise UI
 */

// --- Components ---

// 1. Aurora Background
const AuroraBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FDFBF9]">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 45, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#F4A574]/30 via-[#E8879B]/20 to-transparent blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -30, 0],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-[#8BC5A7]/30 via-[#C5D465]/20 to-transparent blur-[100px]"
            />
            <motion.div
                animate={{
                    x: [-50, 50, -50],
                    y: [-20, 20, -20],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-t from-[#E8879B]/20 to-transparent blur-[80px]"
            />
        </div>
    );
};

// 2. Advanced Animated Logo (The Core Request)
const MoALogo = ({ width = 100, height = 40, strokeWidth = 5, animated = false, delay = 0 }) => {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: delay + i * 0.3, type: "spring", duration: 2, bounce: 0 },
                opacity: { delay: delay + i * 0.3, duration: 0.01 },
            },
        }),
    };

    return (
        <motion.svg
            width={width}
            height={height}
            viewBox="0 0 120 50"
            initial={animated ? "hidden" : "visible"}
            animate="visible"
            className="overflow-visible"
        >
            <defs>
                <linearGradient id="grad-m" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F4A574" />
                    <stop offset="100%" stopColor="#E8879B" />
                </linearGradient>
                <linearGradient id="grad-o" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F4A574" />
                    <stop offset="100%" stopColor="#F9C89B" />
                </linearGradient>
                <linearGradient id="grad-a" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C5D465" />
                    <stop offset="100%" stopColor="#8BC5A7" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* M - Zigzag */}
            <motion.path
                d="M10 40 L10 10 L25 30 L40 10 L40 40"
                fill="none"
                stroke="url(#grad-m)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={draw}
                custom={0}
                filter="url(#glow)"
            />

            {/* O - Circle */}
            <motion.circle
                cx="65"
                cy="25"
                r="15"
                fill="none"
                stroke="url(#grad-o)"
                strokeWidth={strokeWidth}
                variants={draw}
                custom={1}
                filter="url(#glow)"
            />

            {/* A - Triangle */}
            <motion.path
                d="M90 40 L105 10 L120 40"
                fill="none"
                stroke="url(#grad-a)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={draw}
                custom={2}
                filter="url(#glow)"
            />

            {/* A - Crossbar (Optional detail) */}
            <motion.path
                d="M98 28 L112 28"
                fill="none"
                stroke="url(#grad-a)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                variants={draw}
                custom={2.5}
            />
        </motion.svg>
    );
};

// 3. Bento Grid Card
const BentoCard = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
        className={`bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden relative ${className}`}
    >
        {children}
    </motion.div>
);

// 4. Kinetic Button
const PrimaryButton = ({ children, className = "" }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
      relative overflow-hidden group
      px-8 py-4 rounded-full
      bg-[#111] text-white font-bold text-lg
      shadow-lg hover:shadow-xl transition-all
      ${className}
    `}
    >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8879B] via-[#F4A574] to-[#8BC5A7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
);

export default function LandingPageQ() {
    const { scrollY } = useScroll();
    const rotateLogo = useTransform(scrollY, [0, 1000], [0, 360]);

    return (
        <div className="min-h-screen text-gray-900 font-sans selection:bg-[#E8879B] selection:text-white">
            <AuroraBackground />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="opacity-100 hover:opacity-80 transition-opacity">
                        <MoALogo width={80} height={32} strokeWidth={4} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/party" className="hidden md:block font-semibold text-gray-600 hover:text-black transition-colors">
                            파티 찾기
                        </Link>
                        <Link to="/login" className="px-5 py-2 bg-white/80 hover:bg-white border border-gray-200 rounded-full font-bold shadow-sm transition-all text-sm">
                            로그인
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center">
                <div className="max-w-4xl mx-auto relative z-10">

                    {/* Animated Logo Container - The "Hero" of the Hero */}
                    <div className="mb-12 flex justify-center">
                        <div className="relative p-12 rounded-[3rem] bg-white/30 backdrop-blur-md border border-white/50 shadow-2xl">
                            <MoALogo width={240} height={100} strokeWidth={8} animated={true} delay={0.2} />

                            {/* Floating decorators */}
                            <motion.div
                                animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-tr from-[#F4A574] to-[#E8879B] rounded-full blur-xl opacity-60"
                            />
                            <motion.div
                                animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-[#8BC5A7] to-[#C5D465] rounded-full blur-xl opacity-60"
                            />
                        </div>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8"
                    >
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                            구독, 이제
                        </span>
                        <span className="block mt-2">
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-[#E8879B] via-[#F4A574] to-[#8BC5A7] bg-clip-text text-transparent">
                                    모아(MoA)
                                </span>
                                {/* Underline svg */}
                                <motion.svg
                                    viewBox="0 0 100 10"
                                    className="absolute -bottom-2 left-0 w-full h-4 text-[#F4A574] opacity-40 z-0"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 2, duration: 1 }}
                                >
                                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                                </motion.svg>
                            </span>
                            서 가볍게.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed"
                    >
                        넷플릭스, 디즈니+, 유튜브 프리미엄까지.<br />
                        안전한 파티 매칭으로 구독료를 최대 75% 절약하세요.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link to="/party">
                            <PrimaryButton>
                                무료로 시작하기 <ArrowRight className="w-5 h-5" />
                            </PrimaryButton>
                        </Link>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                            <span className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                                    </div>
                                ))}
                            </span>
                            <span>4,000+ 파티 진행 중</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bento Grid Features Section */}
            <section className="relative py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-black mb-4">Why MoA?</h2>
                        <p className="text-gray-500">가장 스마트한 구독 생활의 시작</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-rows-[auto_auto]">
                        {/* 1. Large Feature - Savings (Span 2 cols) */}
                        <BentoCard className="md:col-span-2 min-h-[300px] flex flex-col justify-between group">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-[#E8879B]/10 rounded-lg text-[#E8879B]">
                                        <TrendingUp size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold">압도적인 절약 효과</h3>
                                </div>
                                <p className="text-gray-500 text-lg max-w-md">
                                    매달 커피 한 잔 값으로 프리미엄 OTT를 즐기세요.<br />
                                    연간 최대 40만원까지 아낄 수 있습니다.
                                </p>
                            </div>

                            {/* Visual Graph */}
                            <div className="mt-8 relative h-32 w-full flex items-end gap-4 px-4">
                                {/* Bars */}
                                <motion.div
                                    initial={{ height: "20%" }}
                                    whileInView={{ height: "40%" }}
                                    transition={{ duration: 1 }}
                                    className="w-full bg-gray-200 rounded-t-xl relative group-hover:bg-gray-300 transition-colors"
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-bold">SOLO</span>
                                </motion.div>
                                <motion.div
                                    initial={{ height: "20%" }}
                                    whileInView={{ height: "100%" }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="w-full bg-gradient-to-t from-[#F4A574] to-[#E8879B] rounded-t-xl relative shadow-lg"
                                >
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-[#E8879B] font-bold">MoA</span>
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#E8879B] shadow-sm">
                                        -75%
                                    </div>
                                </motion.div>
                            </div>
                        </BentoCard>

                        {/* 2. Feature - Security */}
                        <BentoCard className="bg-gradient-to-br from-white/60 to-[#8BC5A7]/10">
                            <div className="h-full flex flex-col">
                                <div className="p-3 bg-[#8BC5A7]/20 rounded-2xl w-fit mb-6 text-[#6FA88C]">
                                    <Shield size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">먹튀 ZERO</h3>
                                <p className="text-gray-500 mb-6 flex-grow">
                                    MoA만의 에스크로 시스템으로<br />
                                    파티 종료 시까지 보증금을<br />
                                    안전하게 보관합니다.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-[#6FA88C]">
                                    <CheckCircle2 size={16} /> 안전 거래 보장
                                </div>
                            </div>
                        </BentoCard>

                        {/* 3. Feature - Speed */}
                        <BentoCard delay={0.2} className="bg-gradient-to-br from-white/60 to-[#C5D465]/10">
                            <div className="h-full flex flex-col">
                                <div className="p-3 bg-[#C5D465]/20 rounded-2xl w-fit mb-6 text-[#A0B040]">
                                    <Zap size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">5초 매칭</h3>
                                <p className="text-gray-500 flex-grow">
                                    기다릴 필요 없어요.<br />
                                    결제하는 즉시 계정 정보가<br />
                                    공유됩니다.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-[#A0B040]">
                                    <CheckCircle2 size={16} /> 즉시 시청 가능
                                </div>
                            </div>
                        </BentoCard>

                        {/* 4. Feature - Party (Span 2 cols) */}
                        <BentoCard delay={0.3} className="md:col-span-2 flex items-center justify-between gap-8 group">
                            <div className="flex-1">
                                <div className="p-2 bg-[#F4A574]/10 rounded-lg text-[#F4A574] w-fit mb-4">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">함께하면 더 즐거워요</h3>
                                <p className="text-gray-500 mb-6">
                                    이미 10만 명의 사용자가 MoA에서<br />
                                    새로운 구독 라이프를 경험하고 있습니다.
                                </p>
                                <Link to="/party" className="text-[#F4A574] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    파티 찾아보기 <ArrowRight size={18} />
                                </Link>
                            </div>

                            {/* Decorative User Bubbles */}
                            <div className="hidden sm:grid grid-cols-2 gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                {[1, 2, 3, 4].map(i => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.1 }}
                                        className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl"
                                    >
                                        {['😊', '😎', '🥳', '🥰'][i - 1]}
                                    </motion.div>
                                ))}
                            </div>
                        </BentoCard>
                    </div>
                </div>
            </section>

            {/* Live Party Ticker */}
            <section className="py-20 bg-white/50 backdrop-blur-sm border-y border-white/50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black mb-2">실시간 인기 파티</h2>
                        <p className="text-gray-500">지금 가장 핫한 OTT 모임</p>
                    </div>
                    <Link to="/party" className="flex items-center gap-2 font-bold text-gray-400 hover:text-black transition-colors">
                        더 보기 <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Horizontal Scroll Cards */}
                <div className="flex gap-6 overflow-x-auto pb-10 px-6 no-scrollbar snap-x">
                    {MOCK_PARTIES.map((party, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex-shrink-0 w-80 snap-center"
                        >
                            <div className="group bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="h-40 rounded-2xl bg-gray-100 mb-4 relative overflow-hidden">
                                    <div className={`absolute inset-0 opacity-20 transition-transform duration-500 group-hover:scale-110
                    ${party.platform === 'Netflix' ? 'bg-red-500' :
                                            party.platform === 'Disney+' ? 'bg-blue-600' : 'bg-pink-500'}`}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-black text-gray-800">{party.platform}</span>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                                        {party.members}명 모집
                                    </div>
                                </div>

                                <div className="px-2">
                                    <h4 className="font-bold text-lg mb-1 truncate">{party.title}</h4>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-sm text-gray-400 font-medium">월 예상 구독료</span>
                                        <span className="text-lg font-black text-[#E8879B]">{party.price}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-gray-100 bg-white/40">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
                        <MoALogo width={60} height={24} strokeWidth={6} />
                        <span className="text-sm font-medium">© 2025 MoA Inc.</span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500 font-medium">
                        <a href="#" className="hover:text-black">이용약관</a>
                        <a href="#" className="hover:text-black">개인정보처리방침</a>
                        <a href="#" className="hover:text-black">고객센터</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}