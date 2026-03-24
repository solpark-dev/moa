import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Layers, Shield, Zap, ArrowRight } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * Variant G - "Spatial Glass"
 * Design Direction:
 * - Apple Vision Pro Style Spatial UI
 * - 3D Tilt Interaction based on mouse movement
 * - Thick Frosted Glass Texture with Rim Light
 * - Deep Aurora Background
 */

// --- 3D Tilt Card Component ---
const TiltCard = ({ children, className = "" }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for tilt
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Light reflection effect movement
    const lightMoveX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const lightMoveY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`relative z-10 rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-200 ${className}`}
        >
            {/* Rim Light Reflection */}
            <motion.div
                style={{
                    background: `radial-gradient(circle at ${lightMoveX} ${lightMoveY}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                }}
                className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
            />
            <div className="relative z-30 p-8" style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>
        </motion.div>
    );
};

const Aurora = () => (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-purple-600/30 blur-[120px] mix-blend-screen" />
        <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/30 blur-[150px] mix-blend-screen" />
    </div>
)

export default function LandingPageSpatial() {
    return (
        <div className="min-h-screen text-white font-sans selection:bg-white/30 selection:text-white perspective-[2000px] overflow-x-hidden">
            <Aurora />

            {/* Navbar - Floating Glass */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
                <TiltCard className="!rounded-full !p-2 !bg-white/5 !border-white/10">
                    <div className="flex items-center gap-8 px-4 py-1">
                        <Link to="/" className="font-bold text-xl tracking-wider flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_white]" />
                            MoA Spatial
                        </Link>
                        <div className="flex gap-1">
                            <Link to="/party" className="px-4 py-2 rounded-full hover:bg-white/10 transition-colors text-sm font-medium">Explore</Link>
                            <Link to="/login" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">Sign In</Link>
                        </div>
                    </div>
                </TiltCard>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-8 bg-gradient-to-br from-white via-blue-100 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                        Experience<br />Depth.
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100/70 max-w-2xl mx-auto mb-16 leading-relaxed">
                        The next dimension of subscription sharing. <br />
                        Immersive, intuitive, and incredibly affordable.
                    </p>
                </motion.div>

                {/* 3D Floating Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                    <TiltCard>
                        <Layers className="w-10 h-10 text-blue-300 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Multi-Layered Savings</h3>
                        <p className="text-white/60">Stack up your subscriptions and slice the costs down to a fraction.</p>
                    </TiltCard>
                    <TiltCard className="md:translate-y-12">
                        <Shield className="w-10 h-10 text-purple-300 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Spatial Security</h3>
                        <p className="text-white/60">Protected by an invisible, unbreakable escrow shield within the spatial web.</p>
                    </TiltCard>
                    <TiltCard>
                        <Zap className="w-10 h-10 text-cyan-300 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Instant Teleport</h3>
                        <p className="text-white/60">Jump into your favorite content instantly as soon as you match.</p>
                    </TiltCard>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20"
                >
                    <Link to="/party">
                        <TiltCard className="!p-1 !rounded-full group cursor-pointer">
                            <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-full px-12 py-4 flex items-center gap-4 text-lg font-bold">
                                Enter the Space <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </TiltCard>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}