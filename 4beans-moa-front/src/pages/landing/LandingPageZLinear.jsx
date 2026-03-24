import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Search, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * Variant L - "Linear SaaS"
 * Design Direction:
 * - Extreme Dark Mode (Deep Blacks)
 * - Keyboard-first navigation (Ctrl+K metaphor)
 * - Moving Neon Border Glow effect using CSS magic
 * - Minimalist, high-density information display
 */

// --- Glowing Border Card ---
const GlowingCard = ({ children, className = "", intensity = "normal" }) => {
    return (
        <div className={`relative group rounded-xl ${className}`}>
            {/* Moving Gradient Border */}
            <div className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-30 group-hover:opacity-100 blur-sm transition-all duration-500 animate-border-flow bg-[length:400%_400%]
        ${intensity === 'high' ? 'opacity-70 blur-md' : ''}
      `} />
            {/* Main Content bg */}
            <div className="relative h-full bg-[#0A0A0A] border border-white/10 rounded-xl p-6 overflow-hidden">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                {children}
            </div>
        </div>
    );
};

// --- Command Palette Modal ---
const CommandPalette = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    const handleSelect = (path) => {
        navigate(path);
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative w-full max-w-xl bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center border-b border-white/10 px-4 py-3">
                            <Search className="w-5 h-5 text-gray-500 mr-3" />
                            <input type="text" placeholder="Type a command or search..." className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-600 h-8" autoFocus />
                            <kbd className="hidden sm:inline-block px-2 py-1 bg-[#222] border border-white/10 rounded text-xs text-gray-400 font-mono">ESC</kbd>
                        </div>
                        <div className="py-2 max-h-[60vh] overflow-y-auto p-2">
                            <div className="text-xs font-bold text-gray-600 px-2 mb-2 mt-2 uppercase tracking-widest">Quick Actions</div>
                            <button onClick={() => handleSelect('/party')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors group">
                                <Zap className="w-5 h-5 text-cyan-500" /> <span>Find a Party Instantly</span> <kbd className="ml-auto text-xs text-gray-600 group-hover:text-gray-400">P</kbd>
                            </button>
                            <button onClick={() => handleSelect('/party/create')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors group">
                                <Sparkles className="w-5 h-5 text-purple-500" /> <span>Create New Party</span> <kbd className="ml-auto text-xs text-gray-600 group-hover:text-gray-400">C</kbd>
                            </button>
                        </div>
                        <div className="bg-[#161616] border-t border-white/5 px-4 py-2 text-xs text-gray-500 flex justify-between">
                            <span>Use arrow keys to navigate</span>
                            <span>MoA Command v1.0</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}


export default function LandingPageLinear() {
    const [isCmdOpen, setIsCmdOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsCmdOpen((prev) => !prev);
            }
            if (e.key === "Escape") setIsCmdOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-500 overflow-x-hidden">
            <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="font-bold text-xl tracking-wider text-white flex items-center gap-2">
                            <div className="w-2 h-5 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full" /> MoA_Linear
                        </Link>
                        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
                            <Link to="/party" className="hover:text-white transition-colors">Parties</Link>
                            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsCmdOpen(true)}
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/30 transition-all"
                        >
                            <Command size={14} /> Search... <kbd className="ml-2 px-1.5 py-0.5 bg-[#222] rounded text-xs font-mono text-gray-500">⌘K</kbd>
                        </button>
                        <Link to="/login" className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm">Login</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-32 px-6 text-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-8">
                        <Sparkles size={12} /> Streamline your subscriptions
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-none">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 animate-gradient-x">fastest</span> way <br /> to split costs.
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                        MoA is designed for power users who value efficiency. <br />
                        Secure escrow, instant matching, zero friction.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Link to="/party">
                            <GlowingCard intensity="high" className="!p-0 !rounded-lg group cursor-pointer">
                                <div className="relative z-10 bg-[#111] px-8 py-4 rounded-lg flex items-center gap-3 font-bold text-white">
                                    Start Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </GlowingCard>
                        </Link>
                        <button onClick={() => setIsCmdOpen(true)} className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg font-bold text-gray-300 hover:bg-white/10 transition-colors">
                            Open Command Menu <kbd className="ml-2 text-sm text-gray-500 font-mono">Ctrl+K</kbd>
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Feature Grid (Bento Style with Glow) */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                    <GlowingCard className="md:col-span-2">
                        <h3 className="text-2xl font-bold text-white mb-2">Engineered for Speed</h3>
                        <p className="text-gray-500 mb-8 max-w-md">Our matching engine is optimized for <span className="text-cyan-400">sub-second latency</span>. Get your account credentials instantly upon payment.</p>
                        <div className="flex gap-8 border-t border-white/10 pt-8">
                            <div><div className="text-4xl font-black text-white font-mono">50ms</div><div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Avg. Match Time</div></div>
                            <div><div className="text-4xl font-black text-white font-mono">99.9%</div><div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Uptime</div></div>
                        </div>
                    </GlowingCard>
                    <GlowingCard>
                        <Zap className="w-10 h-10 text-purple-500 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">Keyboard First</h3>
                        <p className="text-gray-500">Navigate the entire platform without lifting your hands. Power at your fingertips.</p>
                    </GlowingCard>
                    <GlowingCard>
                        <Shield size={40} className="text-cyan-500 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">Bank-Grade Security</h3>
                        <p className="text-gray-500">Funds are held in secure escrow until service delivery is verified.</p>
                    </GlowingCard>
                    <GlowingCard className="md:col-span-2 flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Ready to upgrade your workflow?</h3>
                            <p className="text-gray-500">Join thousands of smart users saving time and money.</p>
                        </div>
                        <Link to="/party">
                            <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                                View Parties <ArrowRight size={18} />
                            </button>
                        </Link>
                    </GlowingCard>
                </div>
            </section>

        </div>
    );
}