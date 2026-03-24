import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Heart, Plus } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * Variant P - "Playful Physics"
 * Design Direction:
 * - Bright, Airy, Creamy Background
 * - Custom Lightweight Physics Engine (Gravity, Friction, Collision)
 * - Soft Pastel Colors
 * - Interactive "Toy-like" feel
 */

// --- Physics Canvas Component ---
const PhysicsCanvas = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let balls = [];

        // Physics Constants
        const GRAVITY = 0.4;
        const FRICTION = 0.98; // Air resistance
        const BOUNCE = 0.7; // Energy loss on bounce
        const MOUSE_FORCE = 25;

        let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
        let prevMouse = { x: -1000, y: -1000 };

        // Resize Handler
        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                canvas.width = width;
                canvas.height = height;

                // Reset balls if too few, or adjust positions
                if (balls.length === 0) initBalls(width, height);
            }
        };

        // Ball Class
        class Ball {
            constructor(x, y, radius, color) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 10;
                this.vy = (Math.random() - 0.5) * 10;
                this.radius = radius;
                this.color = color;
                this.originalRadius = radius;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                // Add a cute shine
                ctx.beginPath();
                ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                ctx.fill();
            }

            update(width, height) {
                // Gravity
                this.vy += GRAVITY;

                // Friction
                this.vx *= FRICTION;
                this.vy *= FRICTION;

                // Mouse Interaction (Kick)
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.radius + 50) {
                    const angle = Math.atan2(dy, dx);
                    const force = (this.radius + 50 - dist) / (this.radius + 50);

                    // Add mouse velocity influence
                    this.vx += Math.cos(angle) * force * 2 + (mouse.vx * 0.2);
                    this.vy += Math.sin(angle) * force * 2 + (mouse.vy * 0.2);
                }

                // Update Position
                this.x += this.vx;
                this.y += this.vy;

                // Floor Collision
                if (this.y + this.radius > height) {
                    this.y = height - this.radius;
                    this.vy *= -BOUNCE;

                    // Prevent endless micro-bouncing
                    if (Math.abs(this.vy) < GRAVITY * 2) this.vy = 0;
                }
                // Ceiling Collision
                else if (this.y - this.radius < 0) {
                    this.y = this.radius;
                    this.vy *= -BOUNCE;
                }

                // Wall Collision
                if (this.x + this.radius > width) {
                    this.x = width - this.radius;
                    this.vx *= -BOUNCE;
                } else if (this.x - this.radius < 0) {
                    this.x = this.radius;
                    this.vx *= -BOUNCE;
                }

                this.draw();
            }
        }

        const colors = [
            "#FF9AA2", // Soft Pink
            "#FFB7B2", // Salmon
            "#FFDAC1", // Peach
            "#E2F0CB", // Mint
            "#B5EAD7", // Green
            "#C7CEEA", // Periwinkle
        ];

        const initBalls = (w, h) => {
            balls = [];
            const numBalls = 15;
            for (let i = 0; i < numBalls; i++) {
                const radius = Math.random() * 30 + 20;
                const x = Math.random() * (w - radius * 2) + radius;
                const y = Math.random() * (h / 2); // Start from top half
                const color = colors[Math.floor(Math.random() * colors.length)];
                balls.push(new Ball(x, y, radius, color));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(ball => ball.update(canvas.width, canvas.height));

            // Calculate mouse velocity
            mouse.vx = mouse.x - prevMouse.x;
            mouse.vy = mouse.y - prevMouse.y;
            prevMouse = { x: mouse.x, y: mouse.y };

            animationFrameId = requestAnimationFrame(animate);
        };

        // Event Listeners
        const onMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        // Click to spawn
        const onClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const color = colors[Math.floor(Math.random() * colors.length)];
            // Spawn with upward velocity
            const newBall = new Ball(x, y, Math.random() * 20 + 15, color);
            newBall.vy = -15;
            newBall.vx = (Math.random() - 0.5) * 10;
            balls.push(newBall);

            // Limit balls to prevent lag
            if (balls.length > 40) balls.shift();
        };

        window.addEventListener("resize", handleResize);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("click", onClick);

        handleResize();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("click", onClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            <canvas
                ref={canvasRef}
                className="block w-full h-full cursor-crosshair touch-none"
                title="Click to spawn more balls!"
            />
        </div>
    );
};

// --- UI Components ---
const GlassCard = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.01 }}
        className={`bg-white/60 backdrop-blur-md border border-white/80 shadow-lg rounded-3xl p-6 ${className}`}
    >
        {children}
    </motion.div>
);

const PillButton = ({ children, color = "bg-black", className = "", ...props }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 ${color} ${className}`}
        {...props}
    >
        {children}
    </motion.button>
);

export default function LandingPagePhysics() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-800 font-sans selection:bg-[#FF9AA2] selection:text-white overflow-x-hidden relative">

            {/* Background Physics Layer */}
            <PhysicsCanvas />

            {/* Content Overlay */}
            <div className="relative z-10 pointer-events-none"> {/* Allow clicks to pass through to canvas where needed */}

                {/* Navigation */}
                <nav className="px-6 py-6 pointer-events-auto">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#FF9AA2] rounded-full flex items-center justify-center text-white font-black text-xl shadow-md">
                                M
                            </div>
                            <span className="text-2xl font-black tracking-tight text-gray-900">MoA</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link to="/party" className="hidden md:block font-bold text-gray-500 hover:text-black transition-colors">
                                파티 찾기
                            </Link>
                            <Link to="/login" className="bg-white px-5 py-2.5 rounded-full font-bold shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                로그인
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-20 pb-32 px-6">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

                        {/* Text Content (Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="pointer-events-auto text-center lg:text-left"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm mb-6 border border-pink-100"
                            >
                                <span className="bg-[#FF9AA2] text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                                <span className="text-sm font-medium text-gray-600">더 가볍고 즐거워진 OTT 공유</span>
                            </motion.div>

                            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8 text-gray-900">
                                Playful<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9AA2] via-[#FFB7B2] to-[#B5EAD7]">
                                    Savings.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                                통통 튀는 즐거움! 매달 나가는 구독료, <br />
                                친구들과 가볍게 나누고 무겁게 절약하세요.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/party">
                                    <PillButton color="bg-gray-900 text-white">
                                        <span className="flex items-center gap-2">
                                            파티 시작하기 <ArrowRight className="w-5 h-5" />
                                        </span>
                                    </PillButton>
                                </Link>
                                <Link to="/party/create">
                                    <PillButton color="bg-white text-gray-900" className="border border-gray-200">
                                        <span className="flex items-center gap-2">
                                            <Play className="w-5 h-5 fill-current" /> 파티 만들기
                                        </span>
                                    </PillButton>
                                </Link>
                            </div>

                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-400">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden`}>
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                                        </div>
                                    ))}
                                </div>
                                <p>4,000+ 명의 파티원이 함께해요!</p>
                            </div>
                        </motion.div>

                        {/* Interactive Card Stack (Right) */}
                        <div className="relative h-[500px] flex items-center justify-center pointer-events-auto">
                            {/* Background Blob for focus */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9AA2]/20 to-[#B5EAD7]/20 rounded-full blur-3xl" />

                            {/* Main Card */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="relative z-20 w-full max-w-sm"
                            >
                                <GlassCard className="!bg-white/80">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-2xl font-black">내 구독 현황</h3>
                                            <p className="text-gray-500 text-sm">이번 달 75% 절약 중!</p>
                                        </div>
                                        <div className="w-12 h-12 bg-[#B5EAD7] rounded-full flex items-center justify-center text-white">
                                            <Heart className="w-6 h-6 fill-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {[{ n: 'Netflix', p: '4,250', c: 'bg-red-500' }, { n: 'Disney+', p: '2,400', c: 'bg-blue-600' }, { n: 'Wavve', p: '3,000', c: 'bg-blue-400' }].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full ${item.c} text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform`}>
                                                        {item.n[0]}
                                                    </div>
                                                    <span className="font-bold text-gray-700">{item.n}</span>
                                                </div>
                                                <span className="font-black text-gray-900">₩{item.p}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-end">
                                        <span className="text-gray-500 text-sm font-medium">총 절약 금액</span>
                                        <span className="text-3xl font-black text-[#FF9AA2]">₩32,500</span>
                                    </div>
                                </GlassCard>
                            </motion.div>

                            {/* Floating Elements */}
                            <motion.div
                                className="absolute top-10 right-0 z-10"
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <GlassCard className="!p-4 !rounded-2xl">
                                    <span className="text-2xl">🍿</span>
                                </GlassCard>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-20 -left-4 z-30"
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <GlassCard className="!p-4 !rounded-2xl flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                    <span className="font-bold text-sm text-gray-600">매칭 성공!</span>
                                </GlassCard>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features (Simple & Clean) */}
                <section className="py-20 px-6 bg-white/50 backdrop-blur-sm pointer-events-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "안전한 거래", desc: "보증금 시스템으로 먹튀 걱정 없이 이용하세요.", icon: "🛡️", color: "bg-[#FFDAC1]" },
                                { title: "자동 매칭", desc: "기다림 없이 즉시 파티원을 찾아드립니다.", icon: "⚡", color: "bg-[#E2F0CB]" },
                                { title: "간편한 정산", desc: "매달 자동으로 정산되어 신경 쓸 필요 없어요.", icon: "💸", color: "bg-[#C7CEEA]" }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <GlassCard className="h-full hover:!bg-white hover:!border-[#FF9AA2]/30 transition-colors">
                                        <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-black mb-2 text-gray-800">{feature.title}</h3>
                                        <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 text-center text-gray-400 text-sm font-medium pointer-events-auto">
                    <p className="flex items-center justify-center gap-2">
                        Made with <Heart className="w-4 h-4 fill-pink-400 text-pink-400" /> by MoA Team
                    </p>
                    <p className="mt-2 opacity-60">© 2025 MoA Physics Lab.</p>
                </footer>

            </div>
        </div>
    );
}