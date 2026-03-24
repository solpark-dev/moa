import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Users, Shield, ChevronRight, Tv, Headphones, Film, Gamepad2 } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageI - "Neon Cyberpunk"
 *
 * Design Direction:
 * - Futuristic neon aesthetic with electric colors
 * - Glitch effects and scanlines
 * - High-tech grid patterns
 * - Vibrant cyan, magenta, and yellow accents on dark background
 * - Geometric shapes with hard edges
 */
export default function LandingPageI() {
    const [glitchActive, setGlitchActive] = useState(false);

    // Random glitch effect
    useEffect(() => {
        const interval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 150);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const services = [
        { icon: Tv, name: "Netflix", color: "from-red-500 to-red-600" },
        { icon: Film, name: "Disney+", color: "from-blue-400 to-blue-600" },
        { icon: Headphones, name: "Spotify", color: "from-green-400 to-green-600" },
        { icon: Gamepad2, name: "Game Pass", color: "from-lime-400 to-lime-600" },
    ];

    const features = [
        { icon: Zap, title: "초고속 매칭", desc: "AI가 최적의 파티를 찾아드려요" },
        { icon: Users, title: "신뢰할 수 있는 파티", desc: "검증된 사용자들과 함께해요" },
        { icon: Shield, title: "100% 환불 보장", desc: "문제 발생 시 전액 환불" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
            {/* Scanlines overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
                style={{
                    backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.1) 2px,
            rgba(255,255,255,0.1) 4px
          )`,
                }}
            />

            {/* Animated grid background */}
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: "80px 80px",
                    }}
                />
                {/* Gradient overlays */}
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-fuchsia-500/20 via-transparent to-transparent" />
            </div>

            {/* Navigation */}
            <nav className="relative z-40 px-6 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-black tracking-tighter"
                    >
                        <span className="text-cyan-400">M</span>
                        <span className="text-fuchsia-400">O</span>
                        <span className="text-yellow-400">A</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <Link to="/login" className="text-sm font-medium hover:text-cyan-400 transition-colors">
                            로그인
                        </Link>
                        <Link
                            to="/party"
                            className="px-4 py-2 bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition-colors"
                        >
                            시작하기
                        </Link>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center px-6 py-20">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Text */}
                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block mb-6"
                            >
                                <span className="px-4 py-1 border border-cyan-500/50 text-cyan-400 text-xs font-mono tracking-widest uppercase bg-cyan-500/10">
                                    NEXT_GEN SHARING
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className={`text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-8 ${glitchActive ? "animate-pulse" : ""}`}
                            >
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400">
                                    STREAM
                                </span>
                                <span className="block text-white mt-2">
                                    TOGETHER
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-lg md:text-xl text-gray-400 max-w-md mb-10 leading-relaxed"
                            >
                                구독 경제의 미래. 프리미엄 서비스를 합리적인 가격으로 함께 즐기세요.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Link
                                    to="/party"
                                    className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-fuchsia-500 font-bold text-lg overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2 text-black">
                                        파티 탐색
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <Link
                                    to="/party/create"
                                    className="px-8 py-4 border-2 border-white/20 font-bold text-lg hover:border-cyan-400 hover:text-cyan-400 transition-all"
                                >
                                    파티 생성
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right: Animated services grid */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="relative hidden lg:block"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {services.map((service, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                        whileHover={{ scale: 1.05, rotate: 1 }}
                                        className={`relative p-8 bg-gradient-to-br ${service.color} aspect-square flex flex-col items-center justify-center cursor-pointer`}
                                    >
                                        <service.icon className="w-12 h-12 text-white mb-4" />
                                        <span className="text-white font-bold text-lg">{service.name}</span>
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Decorative corner elements */}
                            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
                            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-fuchsia-400" />
                            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-fuchsia-400" />
                            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                                왜 MoA인가?
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg">차세대 구독 공유 플랫폼</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                whileHover={{ y: -8 }}
                                className="group relative p-8 border border-white/10 bg-white/5 hover:border-cyan-400/50 transition-all"
                            >
                                {/* Corner accents */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="w-14 h-14 mb-6 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center">
                                    <feature.icon className="w-7 h-7 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Parties */}
            <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-fuchsia-500/5 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-end justify-between mb-12"
                    >
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black">HOT PARTIES</h2>
                            <p className="text-gray-400 mt-2">지금 가장 인기있는 파티</p>
                        </div>
                        <Link
                            to="/party"
                            className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                            전체 보기
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {MOCK_PARTIES.slice(0, 4).map((party, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group relative border border-white/10 bg-black/50 overflow-hidden cursor-pointer hover:border-cyan-400/50 transition-all"
                            >
                                {/* Top gradient bar */}
                                <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400" />

                                <div className="p-6">
                                    <div className="text-xs font-mono text-fuchsia-400 mb-2 uppercase tracking-widest">
                                        {party.serviceName}
                                    </div>
                                    <h3 className="text-lg font-bold mb-4 group-hover:text-cyan-400 transition-colors">
                                        {party.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">{party.currentMembers}명 참여</span>
                                        <span className="font-bold text-cyan-400">{party.pricePerMonth?.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="relative p-16 border border-white/10 bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/10 to-yellow-500/10">
                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-400" />
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-fuchsia-400" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-fuchsia-400" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-400" />

                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400">
                                READY TO JOIN?
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
                            지금 바로 참여하고 매달 최대 75%까지 절약하세요
                        </p>
                        <Link
                            to="/party"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 font-bold text-lg text-black hover:from-cyan-400 hover:to-fuchsia-400 transition-all"
                        >
                            시작하기
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-2xl font-black">
                        <span className="text-cyan-400">M</span>
                        <span className="text-fuchsia-400">O</span>
                        <span className="text-yellow-400">A</span>
                    </div>
                    <p className="text-gray-500 text-sm font-mono">
                        © 2024 MoA. FUTURE OF SHARING.
                    </p>
                </div>
            </footer>
        </div>
    );
}
