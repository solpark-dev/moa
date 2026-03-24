import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Sun, Droplets, Sprout, ArrowRight } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * Variant S - "Solarpunk Garden"
 * Design Direction:
 * - Organic Shapes (Blobs)
 * - Nature-inspired Color Palette (Sage, Sand, Sky)
 * - Noise Texture overlay for natural feel
 * - Soft, Fluid Animations
 */

// --- Assets & Utils ---

const OrganicBlob = ({ className, delay = 0, duration = 10 }) => (
    <motion.div
        animate={{
            scale: [1, 1.1, 0.9, 1],
            rotate: [0, 90, 180, 0],
            borderRadius: [
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "30% 60% 70% 40% / 50% 60% 30% 60%",
                "60% 40% 30% 70% / 60% 30% 70% 40%",
            ],
        }}
        transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
        }}
        className={`absolute blur-2xl opacity-60 ${className}`}
    />
);

const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
        <svg width="100%" height="100%">
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
    </div>
);

const GlassCard = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.01 }}
        className={`
      bg-white/40 backdrop-blur-md border border-white/60 
      rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(31,38,135,0.05)]
      ${className}
    `}
    >
        {children}
    </motion.div>
);

export default function LandingPageSolar() {
    return (
        <div className="min-h-screen bg-[#F7F3E8] text-[#2C3E2C] font-sans selection:bg-[#A3B18A] selection:text-white overflow-hidden relative">
            <NoiseOverlay />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-40 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/40 shadow-sm">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#588157] rounded-full flex items-center justify-center text-[#F7F3E8]">
                            <Leaf size={16} fill="currentColor" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-[#344E41]">MoA Garden</span>
                    </Link>
                    <div className="flex gap-4 text-sm font-medium text-[#3A5A40]">
                        <Link to="/party" className="hover:text-[#588157]">Explore</Link>
                        <Link to="/login" className="hover:text-[#588157]">Sign In</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center justify-center">
                {/* Background Blobs */}
                <OrganicBlob className="w-96 h-96 bg-[#A3B18A] top-0 left-0 -translate-x-1/2" duration={15} />
                <OrganicBlob className="w-80 h-80 bg-[#DAD7CD] bottom-0 right-0 translate-x-1/3" duration={12} delay={2} />
                <OrganicBlob className="w-64 h-64 bg-[#588157] top-1/2 right-1/4 opacity-20" duration={18} delay={1} />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-[#E3EED4] text-[#344E41] px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-[#A3B18A]/30">
                            <Sun size={16} className="text-[#A3B18A]" />
                            <span>Sustainable Subscription Life</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#344E41] tracking-tight leading-[1.1]">
                            Grow Your Savings,<br />
                            <span className="text-[#588157] italic font-serif">Naturally.</span>
                        </h1>

                        <p className="text-xl text-[#5F6F5E] mb-10 max-w-xl mx-auto leading-relaxed">
                            Just like a forest shares resources, share your OTT subscriptions.
                            It's the organic way to enjoy premium content.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Link to="/party">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-[#344E41] text-[#F7F3E8] rounded-full font-bold text-lg shadow-lg shadow-[#344E41]/20 flex items-center gap-2"
                                >
                                    Start Planting <Sprout size={20} />
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Cards */}
            <section className="py-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Droplets, title: "Fluid Matching", desc: "Connect with others as naturally as water flows.", color: "text-blue-500", bg: "bg-blue-50" },
                            { icon: Leaf, title: "Organic Growth", desc: "Watch your savings grow every month.", color: "text-green-600", bg: "bg-green-50" },
                            { icon: Sun, title: "Clear Transparency", desc: "No hidden fees. Just clear, sunny deals.", color: "text-orange-500", bg: "bg-orange-50" },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                            >
                                <GlassCard className="h-full text-center hover:bg-white/60 transition-colors">
                                    <div className={`w-16 h-16 mx-auto ${feature.bg} rounded-full flex items-center justify-center mb-6`}>
                                        <feature.icon size={32} className={feature.color} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#344E41] mb-3">{feature.title}</h3>
                                    <p className="text-[#5F6F5E] leading-relaxed">{feature.desc}</p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image / Text Section */}
            <section className="py-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto bg-[#A3B18A] rounded-[3rem] p-8 md:p-20 relative overflow-hidden text-[#F7F3E8]">
                    {/* Decorative patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#DAD7CD] rounded-full mix-blend-overlay opacity-50 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#344E41] rounded-full mix-blend-overlay opacity-30 translate-y-1/2 -translate-x-1/3" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
                                A Ecosystem of <br /> Sharing.
                            </h2>
                            <p className="text-[#F7F3E8]/90 text-lg mb-8 leading-relaxed">
                                MoA creates a sustainable cycle of consumption. By sharing subscriptions, we reduce digital waste and maximize value for everyone involved.
                            </p>
                            <Link to="/party" className="inline-flex items-center gap-2 border-b border-[#F7F3E8] pb-1 hover:opacity-80 transition-opacity">
                                Explore the ecosystem <ArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Abstract Visual - Stacking Stones/Blobs */}
                        <div className="relative h-80 flex items-center justify-center">
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-40 h-32 bg-[#DAD7CD] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bottom-10 z-10 shadow-lg"
                            />
                            <motion.div
                                animate={{ y: [10, -10, 10] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-32 h-28 bg-[#3A5A40] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bottom-32 z-20 shadow-lg opacity-90"
                            />
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-20 h-20 bg-[#F7F3E8] rounded-full bottom-52 z-30 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 text-center text-[#5F6F5E] relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Leaf size={20} className="text-[#588157]" />
                    <span className="font-bold text-[#344E41]">MoA Garden</span>
                </div>
                <p className="text-sm">Cultivated with care in Seoul. © 2025</p>
            </footer>
        </div>
    );
}