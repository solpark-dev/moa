import React from "react";
import { motion } from "framer-motion";
import { Users, Shield, Zap } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

// 테마별 Features 섹션 스타일
const featuresThemeStyles = {
  pop: {
    stickerBg: "bg-lime-400",
    accentText: "text-pink-500",
    cardColors: ["bg-cyan-400", "bg-lime-400", "bg-pink-400"],
  },
  christmas: {
    stickerBg: "bg-[#c41e3a]",
    accentText: "text-[#c41e3a]",
    cardColors: ["bg-[#1a5f2a]", "bg-[#c41e3a]", "bg-[#1a5f2a]"],
    stickerText: "text-white",
  },
};

function Sticker({ children, color = "bg-white", rotate = 0, className = "", isDark = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${color}
        ${isDark ? 'border-gray-600' : 'border-gray-200'}
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
        transition-all duration-200
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

function BouncyCard({ children, className = "", delay = 0, isDark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 16 }}
      whileHover={{ y: -8, rotate: 1 }}
      className={`
        ${isDark ? 'bg-[#1a2332]' : 'bg-white'}
        ${isDark ? 'border-gray-600' : 'border-gray-200'}
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        rounded-3xl
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default function MainFeaturesSection() {
  const { theme } = useThemeStore();
  const themeStyle = featuresThemeStyles[theme] || featuresThemeStyles.pop;
  const isDark = theme === "dark";

  const features = [
    {
      icon: Users,
      title: "파티 공유",
      desc: "최대 4명과 함께 나눠요!",
      color: themeStyle.cardColors[0],
      emoji: theme === "christmas" ? "🎄" : "🎉",
    },
    {
      icon: Shield,
      title: "안전 보장",
      desc: "검증/정산으로 안심!",
      color: themeStyle.cardColors[1],
      emoji: theme === "christmas" ? "🎅" : "🛡️",
    },
    {
      icon: Zap,
      title: "즉시 시작",
      desc: "찾고 결제하면 바로!",
      color: themeStyle.cardColors[2],
      emoji: theme === "christmas" ? "🎁" : "⚡",
    },
  ];

  return (
    <section className={`relative px-6 md:px-12 py-20 ${isDark ? 'bg-[#0B1120]' : 'bg-transparent'} ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Sticker
            color={themeStyle.stickerBg}
            rotate={-2}
            className="inline-block px-6 py-3 rounded-xl mb-6"
            isDark={isDark}
          >
            <span className={`text-xl md:text-2xl font-black ${themeStyle.stickerText || ""}`}>
              {theme === "christmas" ? "🎄 WHY MoA? 🎅" : "WHY MoA? 🤔"}
            </span>
          </Sticker>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            이래서 <span className={themeStyle.accentText}>MoA</span>야!
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <BouncyCard key={f.title} className="p-6 sm:p-8 h-full text-center" delay={i * 0.08} isDark={isDark}>
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 ${f.color} rounded-xl sm:rounded-2xl ${isDark ? 'border-gray-600' : 'border-gray-200'} border flex items-center justify-center mb-4 sm:mb-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] mx-auto`}
              >
                <span className="text-3xl sm:text-4xl">{f.emoji}</span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-black mb-2 sm:mb-3 ${isDark ? 'text-white' : ''}`}>{f.title}</h3>
              <p className={`text-base sm:text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{f.desc}</p>
            </BouncyCard>
          ))}
        </div>
      </div>
    </section>
  );
}
