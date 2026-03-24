import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * LandingPageK - "Cinematic Luxury"
 *
 * Inspired by: Cartier, Max Mara (CSS Design Awards)
 *
 * Design Direction:
 * - High-end luxury brand aesthetic
 * - Cinematic full-screen sections
 * - Elegant serif typography mixed with modern sans-serif
 * - Rich, deep colors (burgundy, gold, cream)
 * - Smooth parallax scrolling
 * - Dramatic reveal animations
 */
export default function LandingPageK() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);

    return (
        <div ref={containerRef} className="bg-[#0f0a08] text-[#f5f0eb] overflow-hidden">
            {/* Fixed Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
                <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-8 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="text-2xl font-light tracking-[0.3em] text-white uppercase"
                    >
                        MoA
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="flex items-center gap-10 text-sm tracking-wider text-white"
                    >
                        <Link to="/party" className="hover:opacity-50 transition-opacity">Discover</Link>
                        <Link to="/login" className="hover:opacity-50 transition-opacity">Enter</Link>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section - Full Screen Cinematic */}
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative h-screen flex items-center justify-center overflow-hidden"
            >
                {/* Background with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a] via-[#0f0a08] to-[#0f0a08]" />

                {/* Decorative gold accent lines */}
                <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-[#c9a962] to-transparent" />
                <div className="absolute bottom-0 left-1/2 w-px h-32 bg-gradient-to-t from-[#c9a962] to-transparent" />

                <div className="relative z-10 text-center max-w-5xl px-8">
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="text-[#c9a962] text-sm tracking-[0.4em] uppercase mb-8 font-light"
                    >
                        The Art of Sharing
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-[1.1] tracking-tight mb-10"
                    >
                        Experience
                        <br />
                        <span className="italic text-[#c9a962]">Together</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 1.1 }}
                        className="text-lg md:text-xl text-[#a39890] max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        프리미엄 구독의 새로운 장을 열다.
                        <br />
                        함께하는 순간이 더욱 빛나는 이유.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 1.4 }}
                    >
                        <Link
                            to="/party"
                            className="group inline-flex items-center gap-4 text-sm tracking-[0.2em] uppercase border-b border-[#c9a962] pb-2 hover:border-white transition-colors"
                        >
                            <span>Begin Your Journey</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-px h-16 bg-gradient-to-b from-[#c9a962] to-transparent"
                    />
                </motion.div>
            </motion.section>

            {/* Philosophy Section */}
            <section className="relative py-40 px-8 md:px-16">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                        >
                            <p className="text-[#c9a962] text-xs tracking-[0.4em] uppercase mb-6">Our Philosophy</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-light leading-[1.2] mb-8">
                                나눔의 미학,
                                <br />
                                <span className="italic">새로운 가치</span>
                            </h2>
                            <p className="text-[#a39890] leading-relaxed mb-8">
                                MoA는 단순한 구독 공유를 넘어, 함께하는 경험의 가치를 재정의합니다.
                                프리미엄 서비스를 나누는 순간, 우리는 더 큰 즐거움을 발견합니다.
                            </p>
                            <Link
                                to="/party"
                                className="inline-flex items-center gap-3 text-sm tracking-wider text-[#c9a962] hover:text-white transition-colors"
                            >
                                <span>Explore</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] bg-gradient-to-br from-[#2a1f1a] to-[#1a0f0a] rounded-sm overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-8xl font-serif text-[#c9a962]/10">MoA</span>
                                </div>
                            </div>
                            {/* Gold accent frame */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-[#c9a962]/30" />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-[#c9a962]/30" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative py-32 px-8 md:px-16 border-t border-b border-[#2a1f1a]">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-3 gap-8">
                        {[
                            { value: "75%", label: "Average Savings" },
                            { value: "10K+", label: "Happy Members" },
                            { value: "4.9", label: "Satisfaction" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="text-center"
                            >
                                <div className="text-5xl md:text-7xl font-serif font-light text-[#c9a962] mb-4">
                                    {stat.value}
                                </div>
                                <div className="text-xs tracking-[0.3em] uppercase text-[#a39890]">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Parties */}
            <section className="relative py-40 px-8 md:px-16">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <p className="text-[#c9a962] text-xs tracking-[0.4em] uppercase mb-6">Curated Selection</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-light">Featured Parties</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {MOCK_PARTIES.slice(0, 4).map((party, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-[3/4] bg-gradient-to-br from-[#2a1f1a] to-[#1a0f0a] mb-6 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl font-serif text-[#c9a962]/20">{party.serviceName}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-[#c9a962]/0 group-hover:bg-[#c9a962]/10 transition-colors duration-500" />
                                </div>
                                <h3 className="font-serif text-xl mb-2 group-hover:text-[#c9a962] transition-colors">
                                    {party.title}
                                </h3>
                                <p className="text-sm text-[#a39890]">{party.pricePerMonth?.toLocaleString()}원</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-48 px-8 md:px-16 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <p className="text-[#c9a962] text-xs tracking-[0.4em] uppercase mb-8">Join Us</p>
                    <h2 className="text-4xl md:text-6xl font-serif font-light leading-[1.2] mb-10">
                        당신의 이야기가
                        <br />
                        <span className="italic">시작되는 곳</span>
                    </h2>
                    <Link
                        to="/party"
                        className="inline-flex items-center gap-4 px-12 py-5 bg-[#c9a962] text-[#0f0a08] font-medium tracking-wider hover:bg-[#d4b572] transition-colors"
                    >
                        <span className="uppercase text-sm">Discover Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-8 md:px-16 border-t border-[#2a1f1a]">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-xl font-light tracking-[0.3em] uppercase">MoA</div>
                    <p className="text-xs text-[#a39890] tracking-wider">
                        © 2024 MoA. The Art of Sharing.
                    </p>
                </div>
            </footer>
        </div>
    );
}
