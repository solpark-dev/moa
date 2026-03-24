import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Play, Star, ChevronRight, Ticket, Film, ShieldCheck } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * Variant C - "Cinematic Noir"
 * Design Direction:
 * - Pure Black Background
 * - Spotlight / Flashlight Interaction
 * - Serif Typography (Cinematic feel)
 * - Dramatic Reveal Animations
 */

// --- Components ---

const Spotlight = ({ mouseX, mouseY }) => {
    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500"
            style={{
                background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent 40%)`,
            }}
        />
    );
};

const FadeInText = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

const MoviePoster = ({ title, platform, price, index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2, duration: 0.8 }}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        className="relative aspect-[2/3] bg-[#1a1a1a] rounded-sm overflow-hidden group cursor-pointer border border-white/10 hover:border-white/50 transition-colors"
    >
        {/* Mock Poster Image Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${platform === 'Netflix' ? 'from-red-900/40' :
                platform === 'Disney+' ? 'from-blue-900/40' : 'from-purple-900/40'
            } to-black opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="text-xs font-serif text-gray-400 mb-2 uppercase tracking-widest border-b border-gray-800 pb-2 w-fit">
                Now Showing
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-1 leading-none">{title}</h3>
            <div className="flex justify-between items-end mt-4">
                <span className="text-sm text-gray-400">{platform}</span>
                <span className="text-xl font-bold text-yellow-500 font-mono">{price}</span>
            </div>
        </div>
    </motion.div>
);

export default function LandingPageCinematic() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-gray-300 font-sans selection:bg-white selection:text-black overflow-x-hidden cursor-default">
            <Spotlight mouseX={mousePos.x} mouseY={mousePos.y} />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference">
                <Link to="/" className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
                    MoA<span className="text-red-600">.</span>Cinema
                </Link>
                <Link to="/login" className="text-sm font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                    Ticket Login <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
                {/* Background Ambient Light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-white opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

                <FadeInText className="mb-6">
                    <span className="border border-white/20 px-4 py-1 rounded-full text-xs uppercase tracking-[0.3em] text-gray-400">
                        Premium Experience
                    </span>
                </FadeInText>

                <FadeInText delay={0.2}>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-white mb-8 tracking-tight leading-none">
                        WATCH<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800">TOGETHER</span>
                    </h1>
                </FadeInText>

                <FadeInText delay={0.4} className="max-w-xl mx-auto mb-12">
                    <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed">
                        The screen is bigger when shared. <br />
                        Join the exclusive club of smart viewers.
                    </p>
                </FadeInText>

                <FadeInText delay={0.6}>
                    <Link to="/party">
                        <button className="group relative px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-all duration-500">
                            <span className="relative z-10 flex items-center gap-3">
                                Get Access <Play className="w-4 h-4 fill-black" />
                            </span>
                            <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-0 mix-blend-multiply" />
                        </button>
                    </Link>
                </FadeInText>
            </section>

            {/* Marquee Divider */}
            <div className="py-8 border-y border-white/10 overflow-hidden bg-[#050505]">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-16 whitespace-nowrap text-4xl font-serif font-bold text-gray-800 uppercase tracking-widest"
                >
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="flex items-center gap-8">
                            Netflix <span className="text-red-900">•</span> Disney+ <span className="text-blue-900">•</span> MoA Original
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Feature Section (Script Format) */}
            <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <FadeInText>
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-12">The Script</h2>
                        </FadeInText>

                        <div className="space-y-12 border-l border-white/10 pl-8 relative">
                            {[
                                { title: "Scene 1: The Match", desc: "Instantly find your party members. No drama, just action.", icon: Ticket },
                                { title: "Scene 2: The Security", desc: "Escrow payment system ensures your funds are safe until the end credits.", icon: ShieldCheck },
                                { title: "Scene 3: The Show", desc: "Start watching in 4K UHD. The highest quality for the smartest price.", icon: Film },
                            ].map((item, i) => (
                                <FadeInText key={i} delay={i * 0.2}>
                                    <div className="group">
                                        <div className="flex items-center gap-4 mb-3">
                                            <item.icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                                            <h3 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors">{item.title}</h3>
                                        </div>
                                        <p className="text-gray-500 font-serif leading-relaxed pl-10 group-hover:text-gray-400 transition-colors">
                                            {item.desc}
                                        </p>
                                    </div>
                                </FadeInText>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[600px] bg-[#0a0a0a] rounded-sm border border-white/5 overflow-hidden">
                        {/* Abstract Visual Representation */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        <div className="absolute bottom-10 left-10 right-10">
                            <div className="font-serif text-3xl text-white italic mb-4">
                                "MoA changed the way I watch. It's not just savings; it's a lifestyle."
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-800" />
                                <div className="text-sm">
                                    <div className="text-white font-bold uppercase">Kim Min-su</div>
                                    <div className="text-gray-500">Party Member since 2023</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Movie Grid */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <FadeInText className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl font-serif text-white">Now Showing</h2>
                    <Link to="/party" className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">View All</Link>
                </FadeInText>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_PARTIES.slice(0, 4).map((party, i) => (
                        <MoviePoster key={i} index={i} {...party} />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 text-center border-t border-white/10 bg-black">
                <div className="mb-8">
                    <span className="text-4xl font-serif font-black text-white tracking-widest">MoA</span>
                </div>
                <p className="text-gray-600 text-sm uppercase tracking-widest mb-12">
                    Designed for the Obsessed.
                </p>
                <div className="flex justify-center gap-8 text-xs font-bold text-gray-500 uppercase">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>
            </footer>
        </div>
    );
}