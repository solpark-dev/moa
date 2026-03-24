import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, Heart, Star } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageL - "Scroll Story"
 *
 * Inspired by: Companion (CSS Design Awards)
 *
 * Design Direction:
 * - Single-page scroll-driven storytelling
 * - Clean, modern sans-serif typography
 * - Soft gradients and floating elements
 * - Interactive scroll animations with parallax
 * - Friendly, approachable color palette (lavender, peach, mint)
 */
export default function LandingPageL() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Horizontal progress bar
    const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="bg-[#fefefe] text-[#1a1a2e] overflow-hidden">
            {/* Progress Bar */}
            <motion.div
                style={{ width: progressWidth }}
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#a78bfa] via-[#f9a8d4] to-[#6ee7b7] z-50"
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-[#fefefe]/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#f9a8d4] bg-clip-text text-transparent"
                    >
                        MoA
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-6"
                    >
                        <Link to="/login" className="text-sm font-medium text-[#64748b] hover:text-[#1a1a2e] transition-colors">
                            로그인
                        </Link>
                        <Link
                            to="/party"
                            className="px-5 py-2.5 bg-gradient-to-r from-[#a78bfa] to-[#f9a8d4] text-white font-medium text-sm rounded-full hover:opacity-90 transition-opacity"
                        >
                            시작하기
                        </Link>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
                {/* Floating decorative elements */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 left-[10%] w-20 h-20 rounded-full bg-gradient-to-br from-[#a78bfa]/20 to-[#c4b5fd]/30 blur-xl"
                />
                <motion.div
                    animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                    className="absolute top-1/3 right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-[#f9a8d4]/20 to-[#fda4af]/30 blur-xl"
                />
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-1/4 left-[20%] w-24 h-24 rounded-full bg-gradient-to-br from-[#6ee7b7]/20 to-[#a7f3d0]/30 blur-xl"
                />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-[#a78bfa]/10 to-[#f9a8d4]/10 border border-[#a78bfa]/20"
                    >
                        <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                        <span className="text-sm font-medium text-[#64748b]">스크롤하며 알아보세요</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-8"
                    >
                        <span className="text-[#1a1a2e]">구독을 </span>
                        <span className="bg-gradient-to-r from-[#a78bfa] via-[#f9a8d4] to-[#6ee7b7] bg-clip-text text-transparent">
                            함께
                        </span>
                        <br />
                        <span className="text-[#1a1a2e]">즐기는 방법</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-lg md:text-xl text-[#64748b] max-w-xl mx-auto mb-12"
                    >
                        혼자 내던 구독료, 이제 친구처럼 편하게 나눠요.
                        스크롤하면서 MoA의 이야기를 들어보세요.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="flex justify-center"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-8 h-12 rounded-full border-2 border-[#a78bfa]/30 flex justify-center pt-3"
                        >
                            <div className="w-1.5 h-3 rounded-full bg-[#a78bfa]" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Story Section 1 */}
            <section className="min-h-screen flex items-center px-6 py-32">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a78bfa]/10 text-[#a78bfa] text-xs font-bold mb-6">
                                <span className="w-2 h-2 rounded-full bg-[#a78bfa]" />
                                STEP 01
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                원하는 파티를
                                <br />
                                <span className="bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] bg-clip-text text-transparent">찾아보세요</span>
                            </h2>
                            <p className="text-lg text-[#64748b] leading-relaxed">
                                Netflix, Disney+, Wavve 등 다양한 OTT 서비스 중에서
                                마음에 드는 파티를 선택하세요. 이미 많은 분들이 함께하고 있어요.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#a78bfa]/10 via-[#c4b5fd]/20 to-[#ddd6fe]/30 flex items-center justify-center">
                                <MessageCircle className="w-24 h-24 text-[#a78bfa]/40" />
                            </div>
                            {/* Floating elements */}
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center"
                            >
                                <Heart className="w-8 h-8 text-[#f9a8d4]" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Story Section 2 */}
            <section className="min-h-screen flex items-center px-6 py-32 bg-gradient-to-b from-[#fefefe] to-[#f8fafc]">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="order-2 lg:order-1 relative"
                        >
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#f9a8d4]/10 via-[#fda4af]/20 to-[#fecdd3]/30 flex items-center justify-center">
                                <Star className="w-24 h-24 text-[#f9a8d4]/40" />
                            </div>
                            <motion.div
                                animate={{ y: [-8, 4, -8] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center"
                            >
                                <Sparkles className="w-10 h-10 text-[#6ee7b7]" />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f9a8d4]/10 text-[#ec4899] text-xs font-bold mb-6">
                                <span className="w-2 h-2 rounded-full bg-[#f9a8d4]" />
                                STEP 02
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                안전하게
                                <br />
                                <span className="bg-gradient-to-r from-[#f9a8d4] to-[#ec4899] bg-clip-text text-transparent">결제하세요</span>
                            </h2>
                            <p className="text-lg text-[#64748b] leading-relaxed">
                                보증금과 첫 달 이용료만 결제하면 끝!
                                모든 거래는 안전하게 보호되고, 문제가 생기면 전액 환불해 드려요.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Story Section 3 */}
            <section className="min-h-screen flex items-center px-6 py-32">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6ee7b7]/10 text-[#10b981] text-xs font-bold mb-6">
                                <span className="w-2 h-2 rounded-full bg-[#6ee7b7]" />
                                STEP 03
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                바로
                                <br />
                                <span className="bg-gradient-to-r from-[#6ee7b7] to-[#10b981] bg-clip-text text-transparent">시청하세요</span>
                            </h2>
                            <p className="text-lg text-[#64748b] leading-relaxed">
                                파티장이 공유한 계정으로 바로 시청을 시작하세요.
                                매달 자동 결제되니까 신경 쓸 것도 없어요. 그냥 즐기기만 하면 돼요!
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#6ee7b7]/10 via-[#a7f3d0]/20 to-[#d1fae5]/30 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#10b981] flex items-center justify-center">
                                    <span className="text-3xl">▶</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Parties */}
            <section className="py-32 px-6 bg-gradient-to-b from-[#f8fafc] to-[#fefefe]">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            지금 <span className="bg-gradient-to-r from-[#a78bfa] via-[#f9a8d4] to-[#6ee7b7] bg-clip-text text-transparent">인기있는</span> 파티
                        </h2>
                        <p className="text-[#64748b]">많은 분들이 함께하고 있어요</p>
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
                                className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0] hover:shadow-lg hover:border-[#a78bfa]/30 transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a78bfa]/10 to-[#f9a8d4]/10 flex items-center justify-center mb-4">
                                    <span className="text-lg font-bold text-[#a78bfa]">{party.serviceName?.[0] || 'M'}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2">{party.title}</h3>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#64748b]">{party.currentMembers}명</span>
                                    <span className="font-bold bg-gradient-to-r from-[#a78bfa] to-[#f9a8d4] bg-clip-text text-transparent">
                                        {party.pricePerMonth?.toLocaleString()}원
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-[#a78bfa]/5 via-[#f9a8d4]/5 to-[#6ee7b7]/5 border border-[#e2e8f0] overflow-hidden">
                        {/* Background decorations */}
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#a78bfa]/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#6ee7b7]/10 blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                이제 직접 경험해볼까요?
                            </h2>
                            <p className="text-lg text-[#64748b] mb-10 max-w-lg mx-auto">
                                스크롤만으로 여기까지 오셨네요!
                                이제 진짜 파티에 참여해보세요.
                            </p>
                            <Link
                                to="/party"
                                className="group inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-[#a78bfa] to-[#f9a8d4] text-white font-bold text-lg rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#a78bfa]/25"
                            >
                                파티 찾아보기
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-[#e2e8f0]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#f9a8d4] bg-clip-text text-transparent">
                        MoA
                    </div>
                    <p className="text-[#64748b] text-sm">
                        © 2024 MoA. 함께하면 더 즐거운 구독 생활.
                    </p>
                </div>
            </footer>
        </div>
    );
}
