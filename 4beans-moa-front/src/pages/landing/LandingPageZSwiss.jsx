import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";

/**
 * Variant T - "Swiss Editorial"
 * Design Direction:
 * - International Typographic Style (Swiss Style)
 * - Strict Grid System
 * - High Contrast (Black/White + Orange Accent)
 * - Massive Typography
 */

const Marquee = ({ text, direction = "left", speed = 20 }) => (
    <div className="overflow-hidden whitespace-nowrap border-b border-black py-4 bg-[#FF3300] text-white">
        <motion.div
            animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
            className="inline-flex gap-8"
        >
            {[...Array(10)].map((_, i) => (
                <span key={i} className="text-4xl font-black uppercase tracking-tighter">
                    {text} <span className="mx-4 text-black">●</span>
                </span>
            ))}
        </motion.div>
    </div>
);

const GridItem = ({ title, children, className = "" }) => (
    <div className={`border-r border-black p-8 relative group hover:bg-black hover:text-white transition-colors duration-300 ${className}`}>
        <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-xs uppercase tracking-widest opacity-60 group-hover:text-[#FF3300] transition-colors">
                ( {title} )
            </span>
            <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF3300]" />
        </div>
        {children}
    </div>
);

export default function LandingPageSwiss() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-[#FF3300] selection:text-white border-x border-black max-w-[1920px] mx-auto">

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#FF3300]" />
                    <span className="text-xl font-black tracking-tighter">MoA® ARCHIVE</span>
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest">
                    <Link to="/party" className="hover:text-[#FF3300] hover:underline decoration-2 underline-offset-4">Index</Link>
                    <Link to="/party/create" className="hover:text-[#FF3300] hover:underline decoration-2 underline-offset-4">Submit</Link>
                    <Link to="/login" className="hover:text-[#FF3300] hover:underline decoration-2 underline-offset-4">Log_in</Link>
                </nav>
            </header>

            {/* Hero */}
            <section className="pt-20 min-h-screen flex flex-col justify-between border-b border-black relative overflow-hidden">
                <div className="px-6 py-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase break-words"
                    >
                        Share<br />
                        <span className="text-transparent stroke-text hover:text-[#FF3300] transition-colors duration-300" style={{ WebkitTextStroke: "2px black" }}>Cost</span><br />
                        Stream<br />
                        <span className="pl-[20vw]">More</span>
                    </motion.h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 border-t border-black">
                    <div className="p-6 border-r border-black flex flex-col justify-end h-64 bg-gray-50">
                        <span className="block text-6xl font-black mb-2">-75%</span>
                        <span className="text-sm font-mono uppercase">Average Savings</span>
                    </div>
                    <div className="p-6 border-r border-black flex flex-col justify-end h-64 bg-[#FF3300] text-white">
                        <span className="block text-6xl font-black mb-2">4.9</span>
                        <span className="text-sm font-mono uppercase">User Rating</span>
                    </div>
                    <div className="p-6 border-r border-black flex flex-col justify-end h-64 bg-black text-white">
                        <span className="block text-6xl font-black mb-2">5s</span>
                        <span className="text-sm font-mono uppercase">Matching Time</span>
                    </div>
                    <Link to="/party" className="p-6 flex flex-col justify-between h-64 hover:bg-black hover:text-white transition-colors group cursor-pointer">
                        <ArrowRight className="w-12 h-12 group-hover:-rotate-45 transition-transform duration-300" />
                        <span className="text-2xl font-bold uppercase">Start Now</span>
                    </Link>
                </div>
            </section>

            <Marquee text="Netflix · Disney+ · Wavve · Tving · Watcha · Youtube Premium" />

            {/* Grid Content */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-black">
                <GridItem title="Manifesto">
                    <h2 className="text-4xl font-black mb-6 uppercase leading-tight">
                        Why pay full price <br /> when you can <br /> pay a fraction?
                    </h2>
                    <p className="text-lg font-medium leading-relaxed max-w-sm">
                        We believe in the shared economy. MoA connects you with reliable peers to split subscription costs securely and instantly.
                    </p>
                </GridItem>

                <GridItem title="System">
                    <ul className="space-y-6">
                        {[
                            { step: "01", text: "Select Platform" },
                            { step: "02", text: "Secure Payment" },
                            { step: "03", text: "Instant Access" }
                        ].map((item, i) => (
                            <li key={i} className="flex items-baseline gap-4 border-b border-black/10 pb-4">
                                <span className="font-mono text-[#FF3300] font-bold">{item.step}</span>
                                <span className="text-2xl font-bold uppercase">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </GridItem>

                <GridItem title="Pricing" className="bg-gray-50">
                    <div className="h-full flex flex-col justify-between">
                        <div className="font-mono text-sm space-y-2 opacity-60">
                            <div className="flex justify-between"><span>NETFLIX UHD</span><span>KRW 17,000</span></div>
                            <div className="flex justify-between"><span>DIVIDED BY 4</span><span>KRW 4,250</span></div>
                            <div className="w-full border-b border-black my-2"></div>
                        </div>
                        <div>
                            <span className="block text-sm font-mono uppercase mb-2">Monthly Total</span>
                            <span className="text-6xl font-black text-[#FF3300]">₩4,250</span>
                        </div>
                    </div>
                </GridItem>
            </section>

            {/* Image / Parallax Section */}
            <section className="h-[80vh] overflow-hidden relative border-b border-black flex items-center justify-center bg-black text-white">
                <motion.div style={{ y }} className="absolute inset-0 opacity-40">
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1593784991095-a20506948430?q=80&w=2648&auto=format&fit=crop')] bg-cover bg-center grayscale" />
                </motion.div>
                <div className="relative z-10 text-center mix-blend-difference">
                    <h2 className="text-[8vw] font-black uppercase tracking-tighter leading-none">
                        Don't Watch<br />Alone
                    </h2>
                    <Link to="/party">
                        <button className="mt-8 px-12 py-4 bg-white text-black font-bold text-xl uppercase tracking-widest hover:bg-[#FF3300] hover:text-white transition-colors">
                            Join the Club
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="grid grid-cols-1 md:grid-cols-4 min-h-[400px]">
                <div className="p-8 border-r border-black flex flex-col justify-between">
                    <span className="font-black text-2xl tracking-tighter">MoA®</span>
                    <span className="font-mono text-xs">© 2025 All Rights Reserved.</span>
                </div>
                <div className="col-span-2 p-8 border-r border-black">
                    <span className="font-mono text-xs uppercase tracking-widest mb-8 block">( Newsletter )</span>
                    <div className="flex border-b-2 border-black pb-2">
                        <input type="email" placeholder="YOUR@EMAIL.COM" className="w-full bg-transparent outline-none text-2xl font-bold placeholder:text-gray-300 uppercase" />
                        <ArrowRight className="w-8 h-8" />
                    </div>
                </div>
                <div className="p-8 flex flex-col gap-2 font-bold uppercase tracking-widest">
                    <a href="#" className="hover:text-[#FF3300]">Instagram</a>
                    <a href="#" className="hover:text-[#FF3300]">Twitter</a>
                    <a href="#" className="hover:text-[#FF3300]">Discord</a>
                    <a href="#" className="hover:text-[#FF3300] mt-auto">Terms</a>
                </div>
            </footer>
        </div>
    );
}