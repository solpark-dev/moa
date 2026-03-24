import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Droplets, Sun, Wind, ArrowRight, Sparkles } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageJ - "Organic Nature"
 *
 * Design Direction:
 * - Calm, organic aesthetic inspired by nature
 * - Soft earth tones with green, beige, and warm browns
 * - Rounded, fluid shapes
 * - Subtle organic textures and patterns
 * - Emphasis on warmth, trust, and community
 */
export default function LandingPageJ() {
    const benefits = [
        { icon: Leaf, title: "자연스러운 공유", desc: "마치 이웃처럼 자연스럽게" },
        { icon: Droplets, title: "투명한 비용", desc: "숨겨진 비용 없이 명확하게" },
        { icon: Sun, title: "따뜻한 커뮤니티", desc: "신뢰할 수 있는 사람들과" },
        { icon: Wind, title: "가벼운 시작", desc: "부담 없이 언제든 참여" },
    ];

    return (
        <div className="min-h-screen bg-[#faf8f5] text-[#3d3d3d] overflow-hidden">
            {/* Organic background patterns */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Soft organic shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#e8f0e4] rounded-[40%_60%_60%_40%/60%_40%_60%_40%] opacity-50 blur-3xl transform translate-x-1/4 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f5ede4] rounded-[60%_40%_40%_60%/40%_60%_40%_60%] opacity-60 blur-3xl transform -translate-x-1/4 translate-y-1/4" />
                <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#e4ece8] rounded-[50%_50%_50%_50%/50%_50%_50%_50%] opacity-40 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Navigation */}
            <nav className="relative z-40 px-6 py-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7cb97c] to-[#5a9a5a] flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[#4a6741]">MoA</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-6"
                    >
                        <Link to="/login" className="text-sm font-medium text-[#6b6b6b] hover:text-[#4a6741] transition-colors">
                            로그인
                        </Link>
                        <Link
                            to="/party"
                            className="px-5 py-2.5 bg-[#4a6741] text-white font-medium text-sm rounded-full hover:bg-[#3d5636] transition-colors"
                        >
                            시작하기
                        </Link>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center px-6 py-20">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-[#e8f0e4] border border-[#c5d9c0]"
                        >
                            <Sparkles className="w-4 h-4 text-[#6b9a5a]" />
                            <span className="text-sm font-medium text-[#4a6741]">함께하면 더 좋은 구독 생활</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-8"
                        >
                            <span className="text-[#3d3d3d]">나누면 </span>
                            <span className="text-[#4a6741]">자라나는</span>
                            <br />
                            <span className="text-[#3d3d3d]">구독의 즐거움</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-lg md:text-xl text-[#6b6b6b] max-w-xl mx-auto mb-12 leading-relaxed"
                        >
                            Netflix, Disney+, Wavve 등 프리미엄 OTT 서비스를
                            이웃과 나누듯 자연스럽게 공유하세요.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                to="/party"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4a6741] text-white font-semibold rounded-full hover:bg-[#3d5636] transition-all shadow-lg shadow-[#4a6741]/20"
                            >
                                파티 찾아보기
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/party/create"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#4a6741] font-semibold rounded-full border-2 border-[#c5d9c0] hover:border-[#4a6741] hover:bg-[#f0f7ed] transition-all"
                            >
                                파티 만들기
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative floating leaves */}
                <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-1/4 left-[10%] hidden lg:block"
                >
                    <Leaf className="w-8 h-8 text-[#8fbc8f]/40" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-1/3 right-[15%] hidden lg:block"
                >
                    <Leaf className="w-6 h-6 text-[#8fbc8f]/30 rotate-45" />
                </motion.div>
            </section>

            {/* Benefits Section */}
            <section className="relative py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[#3d3d3d] mb-4">
                            MoA와 함께하는 이유
                        </h2>
                        <p className="text-[#6b6b6b] text-lg">자연스럽고 따뜻한 공유 문화</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                                className="p-8 bg-white rounded-3xl shadow-sm border border-[#e8e4e0] hover:shadow-lg hover:border-[#c5d9c0] transition-all"
                            >
                                <div className="w-14 h-14 mb-6 bg-gradient-to-br from-[#e8f0e4] to-[#d4e4cf] rounded-2xl flex items-center justify-center">
                                    <benefit.icon className="w-7 h-7 text-[#4a6741]" />
                                </div>
                                <h3 className="text-lg font-bold text-[#3d3d3d] mb-2">{benefit.title}</h3>
                                <p className="text-[#6b6b6b] text-sm">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Parties */}
            <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-[#e8f0e4]/30 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-end justify-between mb-12"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#3d3d3d]">인기 파티</h2>
                            <p className="text-[#6b6b6b] mt-2">지금 많은 분들이 함께하고 있어요</p>
                        </div>
                        <Link
                            to="/party"
                            className="hidden md:flex items-center gap-2 text-[#4a6741] hover:text-[#3d5636] font-medium transition-colors"
                        >
                            전체 보기
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {MOCK_PARTIES.slice(0, 4).map((party, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e8e4e0] hover:shadow-lg hover:border-[#c5d9c0] transition-all cursor-pointer"
                            >
                                {/* Image placeholder with organic shape */}
                                <div className="aspect-[4/3] bg-gradient-to-br from-[#e8f0e4] to-[#d4e4cf] relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-[#4a6741]/20">{party.platform}</span>
                                    </div>
                                    {/* Status badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#4a6741] text-white text-xs font-medium">
                                        모집중
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-bold text-[#3d3d3d] mb-3 group-hover:text-[#4a6741] transition-colors">
                                        {party.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#6b6b6b]">{party.members}명 참여중</span>
                                        <span className="font-bold text-[#4a6741]">{party.price}</span>
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="relative p-12 md:p-16 bg-white rounded-[3rem] shadow-xl border border-[#e8e4e0] overflow-hidden">
                        {/* Background organic shapes */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#e8f0e4] rounded-[40%_60%_60%_40%/60%_40%_60%_40%] opacity-50 blur-2xl transform translate-x-1/4 -translate-y-1/4" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#f5ede4] rounded-[60%_40%_40%_60%/40%_60%_40%_60%] opacity-60 blur-2xl transform -translate-x-1/4 translate-y-1/4" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-[#e8f0e4] to-[#d4e4cf] rounded-full">
                                <Leaf className="w-8 h-8 text-[#4a6741]" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#3d3d3d] mb-4">
                                함께 시작해볼까요?
                            </h2>
                            <p className="text-[#6b6b6b] text-lg mb-10 max-w-lg mx-auto">
                                매달 빠져나가는 구독료, 이웃과 나누면 부담이 줄어들어요.
                                지금 바로 MoA와 함께 시작하세요.
                            </p>
                            <Link
                                to="/party"
                                className="group inline-flex items-center gap-2 px-10 py-5 bg-[#4a6741] text-white font-bold text-lg rounded-full hover:bg-[#3d5636] transition-all shadow-lg shadow-[#4a6741]/20"
                            >
                                무료로 시작하기
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t border-[#e8e4e0]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7cb97c] to-[#5a9a5a] flex items-center justify-center">
                            <Leaf className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-[#4a6741]">MoA</span>
                    </div>
                    <p className="text-[#6b6b6b] text-sm">
                        © 2024 MoA. 함께 나누는 구독의 즐거움.
                    </p>
                </div>
            </footer>
        </div>
    );
}
