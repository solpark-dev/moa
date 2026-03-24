import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    Play,
    Users,
    Shield,
    CreditCard,
    Sparkles,
    Zap,
    Heart,
    Star,
    Check,
    MousePointer2,
} from "lucide-react";

// Framer Style - Interactive & Playful
// Key: Micro-interactions, playful hover states, bouncy animations, cursor following

// OTT Service Data
const OTT_SERVICES = [
    { name: "Netflix", color: "#E50914", monthly: 17000 },
    { name: "Disney+", color: "#113CCF", monthly: 9900 },
    { name: "Wavve", color: "#1351F9", monthly: 13900 },
    { name: "Watcha", color: "#FF0558", monthly: 12900 },
    { name: "TVING", color: "#FF153C", monthly: 13900 },
    { name: "Coupang", color: "#5F0080", monthly: 7890 },
];

// Interactive Card with Tilt Effect
const TiltCard = ({ children, className = "" }) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setRotateX((y - centerY) / 10);
        setRotateY((centerX - x) / 10);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            className={`relative ${className}`}
            style={{
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
            animate={{
                rotateX,
                rotateY,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
};

// Bouncy Button
const BouncyButton = ({ children, variant = "primary", className = "", ...props }) => {
    const variants = {
        primary: "bg-black text-white hover:bg-gray-800",
        secondary: "bg-white text-black border border-gray-200 hover:bg-gray-50",
        gradient: "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white",
    };

    return (
        <motion.button
            className={`px-8 py-4 rounded-2xl font-bold text-lg ${variants[variant]} ${className}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// Animated Counter
const AnimatedCounter = ({ value, suffix = "", prefix = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [displayValue, setDisplayValue] = useState(0);

    React.useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = parseInt(value);
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setDisplayValue(end);
                    clearInterval(timer);
                } else {
                    setDisplayValue(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <span ref={ref}>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    );
};

// Interactive OTT Pill
const OTTPill = ({ service, index, isSelected, onSelect }) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(service)}
            className={`
                relative px-6 py-3 rounded-full font-semibold text-sm
                transition-all duration-300
                ${isSelected
                    ? "text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
            `}
            style={{
                backgroundColor: isSelected ? service.color : undefined,
                boxShadow: isSelected ? `0 10px 30px -10px ${service.color}80` : undefined,
            }}
        >
            {service.name}
            {isSelected && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                >
                    <Check className="w-3 h-3 text-green-500" />
                </motion.span>
            )}
        </motion.button>
    );
};

// Floating Emoji
const FloatingEmoji = ({ emoji, delay = 0 }) => {
    return (
        <motion.span
            className="text-4xl md:text-5xl"
            initial={{ y: 0 }}
            animate={{
                y: [-10, 10, -10],
                rotate: [-5, 5, -5],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
            }}
        >
            {emoji}
        </motion.span>
    );
};

// Interactive Feature Card
const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, type: "spring", stiffness: 100 }}
        >
            <TiltCard className="h-full">
                <motion.div
                    className="relative p-8 bg-white rounded-3xl border-2 border-gray-100 h-full overflow-hidden group cursor-pointer"
                    whileHover={{ borderColor: color }}
                >
                    {/* Background Gradient on Hover */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                        style={{ backgroundColor: color }}
                    />

                    {/* Icon */}
                    <motion.div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                        style={{ backgroundColor: `${color}15` }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        <Icon className="w-7 h-7" style={{ color }} />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-500 leading-relaxed">{description}</p>

                    {/* Arrow on Hover */}
                    <motion.div
                        className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                    >
                        <ArrowRight className="w-5 h-5" style={{ color }} />
                    </motion.div>
                </motion.div>
            </TiltCard>
        </motion.div>
    );
};

// Pricing Calculator
const PricingCalculator = () => {
    const [selectedServices, setSelectedServices] = useState([OTT_SERVICES[0]]);

    const toggleService = (service) => {
        if (selectedServices.find(s => s.name === service.name)) {
            if (selectedServices.length > 1) {
                setSelectedServices(selectedServices.filter(s => s.name !== service.name));
            }
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const totalOriginal = selectedServices.reduce((sum, s) => sum + s.monthly, 0);
    const totalWithMoA = Math.round(totalOriginal * 0.25);
    const savings = totalOriginal - totalWithMoA;

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Service Selection */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
                {OTT_SERVICES.map((service, i) => (
                    <OTTPill
                        key={service.name}
                        service={service}
                        index={i}
                        isSelected={selectedServices.find(s => s.name === service.name)}
                        onSelect={toggleService}
                    />
                ))}
            </div>

            {/* Price Comparison */}
            <motion.div
                layout
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border-2 border-gray-100"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {/* Original Price */}
                    <div>
                        <p className="text-sm text-gray-400 mb-2">원래 가격</p>
                        <p className="text-2xl font-bold text-gray-300 line-through">
                            {totalOriginal.toLocaleString()}원
                        </p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center">
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ArrowRight className="w-8 h-8 text-violet-500" />
                        </motion.div>
                    </div>

                    {/* MoA Price */}
                    <div>
                        <p className="text-sm text-violet-500 mb-2 font-medium">MoA로 결제 시</p>
                        <motion.p
                            key={totalWithMoA}
                            initial={{ scale: 1.2, color: "#8b5cf6" }}
                            animate={{ scale: 1, color: "#111827" }}
                            className="text-3xl font-black"
                        >
                            {totalWithMoA.toLocaleString()}원
                        </motion.p>
                    </div>
                </div>

                {/* Savings */}
                <motion.div
                    layout
                    className="mt-8 pt-6 border-t border-gray-100 text-center"
                >
                    <p className="text-gray-500 mb-2">매달 절약하는 금액</p>
                    <motion.p
                        key={savings}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"
                    >
                        {savings.toLocaleString()}원
                    </motion.p>
                    <p className="text-sm text-gray-400 mt-2">연간 {(savings * 12).toLocaleString()}원 절약!</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

// Marquee
const Marquee = ({ children, direction = "left", speed = 30 }) => {
    return (
        <div className="overflow-hidden whitespace-nowrap">
            <motion.div
                className="inline-flex gap-8"
                animate={{
                    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
};

// Main Component
export default function LandingPageZ() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
    });

    return (
        <div ref={containerRef} className="bg-white text-gray-900 overflow-x-hidden">
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 origin-left z-50"
                style={{ scaleX: smoothProgress }}
            />

            {/* Sticky Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-10 h-10 bg-black rounded-xl flex items-center justify-center"
                            >
                                <span className="text-white font-black text-lg">M</span>
                            </motion.div>
                            <span className="font-black text-xl">MoA</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {["서비스", "요금", "FAQ"].map((item) => (
                                <motion.a
                                    key={item}
                                    href={`#${item}`}
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                    whileHover={{ y: -2 }}
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <BouncyButton variant="secondary" className="!py-2.5 !px-5 !text-sm">
                                    로그인
                                </BouncyButton>
                            </Link>
                            <Link to="/signup">
                                <BouncyButton variant="primary" className="!py-2.5 !px-5 !text-sm">
                                    시작하기
                                </BouncyButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center pt-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Floating Emojis */}
                    <div className="flex justify-center gap-6 mb-8">
                        <FloatingEmoji emoji="🎬" delay={0} />
                        <FloatingEmoji emoji="📺" delay={0.5} />
                        <FloatingEmoji emoji="🍿" delay={1} />
                    </div>

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-violet-600" />
                        <span className="text-sm font-semibold text-violet-700">10,000+명이 함께하는 구독 공유</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-8"
                    >
                        <span className="block">구독료를</span>
                        <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                            75% 절약
                        </span>
                        <span className="block">하세요</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto"
                    >
                        MoA에서 OTT 구독을 나누면
                        <br className="hidden sm:block" />
                        혼자보다 훨씬 저렴해요
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/party">
                            <BouncyButton variant="gradient" className="group">
                                파티 둘러보기
                                <motion.span
                                    className="inline-block ml-2"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5 inline" />
                                </motion.span>
                            </BouncyButton>
                        </Link>
                        <Link to="/signup">
                            <BouncyButton variant="secondary">
                                무료로 시작하기
                            </BouncyButton>
                        </Link>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex items-center justify-center gap-6 mt-12 text-sm text-gray-400"
                    >
                        <span className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-500" /> 보증금 보호
                        </span>
                        <span className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-500" /> 자동 정산
                        </span>
                        <span className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-500" /> 즉시 이용
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* Stats Marquee */}
            <section className="py-16 bg-gray-50">
                <Marquee speed={40}>
                    {[
                        "10,000+ 사용자",
                        "75% 절약",
                        "4.9/5.0 평점",
                        "24시간 지원",
                        "안전한 거래",
                        "빠른 매칭",
                    ].map((text, i) => (
                        <span key={i} className="text-2xl md:text-3xl font-bold text-gray-300 px-8">
                            {text}
                        </span>
                    ))}
                </Marquee>
            </section>

            {/* Interactive Pricing Calculator */}
            <section id="요금" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            얼마나 절약할 수 있을까요?
                        </h2>
                        <p className="text-xl text-gray-500">
                            원하는 서비스를 선택해보세요
                        </p>
                    </motion.div>

                    <PricingCalculator />
                </div>
            </section>

            {/* Features */}
            <section id="서비스" className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            왜 MoA일까요?
                        </h2>
                        <p className="text-xl text-gray-500">
                            안전하고 편리한 구독 공유
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Shield}
                            title="보증금 보호"
                            description="보증금으로 파티원 간의 신뢰를 보장해요. 문제 발생 시 즉시 보상받을 수 있어요."
                            color="#8b5cf6"
                            delay={0}
                        />
                        <FeatureCard
                            icon={CreditCard}
                            title="자동 정산"
                            description="매월 자동으로 결제가 이루어져요. 귀찮은 송금 요청은 이제 그만!"
                            color="#06b6d4"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Users}
                            title="검증된 파티원"
                            description="본인인증을 완료한 믿을 수 있는 파티원들만 연결해드려요."
                            color="#f59e0b"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="즉시 이용"
                            description="파티에 가입하면 바로 이용할 수 있어요. 복잡한 절차 없이 빠르게 시작하세요."
                            color="#10b981"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Heart}
                            title="친절한 지원"
                            description="24시간 고객 지원으로 문제 발생 시 빠르게 해결해드려요."
                            color="#ef4444"
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Star}
                            title="프리미엄 경험"
                            description="저렴하지만 프리미엄 요금제의 모든 혜택을 그대로 누리세요."
                            color="#ec4899"
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            시작하기 너무 쉬워요
                        </h2>
                    </motion.div>

                    <div className="space-y-12">
                        {[
                            { step: 1, title: "가입하기", description: "이메일 또는 소셜 계정으로 30초 만에 가입하세요", emoji: "✨" },
                            { step: 2, title: "서비스 선택", description: "원하는 OTT 서비스를 고르고 파티에 참여하세요", emoji: "🎯" },
                            { step: 3, title: "바로 시청", description: "결제가 완료되면 즉시 서비스를 이용할 수 있어요", emoji: "🎬" },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, type: "spring" }}
                                className="flex items-center gap-8"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-2xl shrink-0"
                                >
                                    {item.step}
                                </motion.div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                        {item.title}
                                        <span className="text-3xl">{item.emoji}</span>
                                    </h3>
                                    <p className="text-gray-500 text-lg">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <TiltCard>
                        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-[2.5rem] p-12 md:p-16 text-center text-white overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                                    backgroundSize: "40px 40px"
                                }} />
                            </div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-5xl font-black mb-6 relative z-10"
                            >
                                지금 시작하면
                                <br />
                                이번 달부터 절약해요
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-white/80 mb-10 relative z-10"
                            >
                                가입비 없음 • 언제든 해지 가능
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="relative z-10"
                            >
                                <Link to="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-5 bg-white text-purple-600 font-bold text-xl rounded-2xl shadow-2xl"
                                    >
                                        무료로 시작하기
                                        <ArrowRight className="w-6 h-6 inline ml-2" />
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>
                    </TiltCard>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-lg">M</span>
                            </div>
                            <span className="font-black text-xl">MoA</span>
                        </div>

                        <nav className="flex items-center gap-8 text-sm text-gray-500">
                            <Link to="/community/notice" className="hover:text-gray-900 transition-colors">공지사항</Link>
                            <Link to="/community/faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
                            <Link to="/community/inquiry" className="hover:text-gray-900 transition-colors">문의하기</Link>
                        </nav>

                        <p className="text-sm text-gray-400">© 2025 MoA. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
