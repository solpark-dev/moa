import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Users, Play, Star } from "lucide-react";

/**
 * Variant N - "Neural Stream"
 * * Design Direction:
 * - Pure HTML5 Canvas Background
 * - High-performance Particle System
 * - Cyberpunk / Sci-fi Aesthetic
 * - Glassmorphism UI Overlay
 */

// --- Canvas Component ---
const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let particles = [];

        // Mouse interaction state
        const mouse = { x: null, y: null, radius: 150 };

        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                canvas.width = width;
                canvas.height = height;
                setDimensions({ width, height });
                initParticles(width, height);
            }
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        class Particle {
            constructor(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.directionX = (Math.random() - 0.5) * 1.5; // Speed
                this.directionY = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 2 + 1;
                this.baseX = x;
                this.baseY = y;
                this.density = (Math.random() * 30) + 1;
                this.w = w;
                this.h = h;
                // Colors: Cyan or Purple randomly
                this.color = Math.random() > 0.5 ? "rgba(0, 240, 255, 0.8)" : "rgba(189, 0, 255, 0.8)";
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Boundary Check
                if (this.x > this.w || this.x < 0) this.directionX = -this.directionX;
                if (this.y > this.h || this.y < 0) this.directionY = -this.directionY;

                // Collision detection with mouse
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius && mouse.x !== null) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = mouse.radius;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * this.density;
                    const directionY = forceDirectionY * force * this.density;

                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    // Return to original position (optional) or just keep moving
                    // Let's make them float freely but return if too far (simple movement)
                    this.x += this.directionX;
                    this.y += this.directionY;
                }
                this.draw();
            }
        }

        const initParticles = (w, h) => {
            particles = [];
            const numberOfParticles = (w * h) / 9000; // Density adjust
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 5) + 1;
                let x = (Math.random() * ((w - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((h - size * 2) - (size * 2)) + size * 2);
                particles.push(new Particle(x, y, w, h));
            }
        };

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                        ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(100, 100, 255, ${opacityValue * 0.2})`; // Connection Line Color
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseout", handleMouseLeave);

        // Initial Setup
        handleResize();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseout", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 z-0">
            <canvas ref={canvasRef} className="block w-full h-full bg-[#050505]" />
        </div>
    );
};

// --- UI Components ---
const GlassCard = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 240, 255, 0.1)" }}
        className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`}
    >
        {children}
    </motion.div>
);

const NeonButton = ({ children, color = "cyan", className = "", ...props }) => {
    const colors = {
        cyan: "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]",
        purple: "bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.5)]"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 rounded-full font-bold text-white transition-all duration-300 ${colors[color]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default function LandingPageParticles() {
    const stats = [
        { label: "Active Parties", value: "4,231", color: "text-cyan-400" },
        { label: "Money Saved", value: "₩1.2B", color: "text-purple-400" },
        { label: "User Satisfaction", value: "99.9%", color: "text-emerald-400" },
    ];

    return (
        <div className="min-h-screen text-white relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
            {/* Canvas Background Layer */}
            <ParticleCanvas />

            {/* Content Overlay */}
            <div className="relative z-10">

                {/* Navbar */}
                <nav className="px-6 py-6 border-b border-white/5 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link to="/" className="text-2xl font-black tracking-wider flex items-center gap-2">
                            <span className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                            MoA<span className="text-cyan-400">_NET</span>
                        </Link>
                        <div className="flex gap-4">
                            <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors">
                                LOG_IN
                            </Link>
                            <Link to="/signup" className="px-4 py-2 text-sm font-bold border border-cyan-500/50 text-cyan-400 rounded-full hover:bg-cyan-500/10 transition-colors">
                                JOIN_NETWORK
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-3 py-1 mb-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest">
                                SYSTEM STATUS: ONLINE
                            </span>

                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                                    CONNECT
                                </span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 animate-gradient-x">
                                    SHARE & STREAM
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light">
                                The most advanced algorithm to split your OTT subscription costs.
                                <br className="hidden md:block" /> Secure, instant, and automated.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link to="/party">
                                    <NeonButton color="cyan" className="flex items-center gap-2">
                                        Start Matching <Zap className="w-5 h-5" />
                                    </NeonButton>
                                </Link>
                                <Link to="/party/create">
                                    <button className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
                                        <Play className="w-5 h-5 fill-current" /> Watch Demo
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="py-12 border-y border-white/5 bg-black/20 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-4"
                            >
                                <div className={`text-4xl font-black mb-2 ${stat.color} font-mono`}>{stat.value}</div>
                                <div className="text-gray-500 uppercase tracking-widest text-xs font-bold">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <GlassCard>
                                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Neural Matching</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Our algorithm instantly finds the perfect party members based on your viewing habits and reliability score.
                                </p>
                            </GlassCard>

                            <GlassCard>
                                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Escrow Security</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Funds are held in a secure smart-contract-like escrow until the service period is successfully verified.
                                </p>
                            </GlassCard>

                            <GlassCard>
                                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
                                    <Star className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Premium Access</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Get instant access to 4K UHD premium plans of Netflix, Disney+, and more at 25% of the cost.
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* Floating OTT Cards (Visual Interest) */}
                <section className="py-20 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto relative">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Supported Platforms</h2>
                            <p className="text-gray-400">Connect to the global streaming network.</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8">
                            {['Netflix', 'Disney+', 'Wavve', 'Tving', 'Youtube', 'Watcha'].map((platform, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10, scale: 1.1 }}
                                    className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
                                >
                                    <span className="font-bold text-lg text-gray-200">{platform}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 bg-black py-12 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-gray-500 text-sm">
                            <span className="text-cyan-500 font-bold">MoA_NET</span> // SYSTEM_VER_2.0
                        </div>
                        <div className="flex gap-6 text-gray-500 text-sm">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}