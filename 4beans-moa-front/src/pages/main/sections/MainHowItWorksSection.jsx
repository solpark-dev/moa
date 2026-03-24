import React from "react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";

// 테마별 HowItWorks 섹션 스타일
const howItWorksThemeStyles = {
  pop: {
    stepColors: ["bg-cyan-400", "bg-pink-500", "bg-lime-400"],
    emojis: ["🔍", "💳", "🎬"],
  },
  christmas: {
    stepColors: ["bg-[#1a5f2a]", "bg-[#c41e3a]", "bg-[#1a5f2a]"],
    emojis: ["🎄", "🎁", "🎅"],
  },
};

function Sticker({ children, color = "bg-white", rotate = 0, className = "", isDark = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${color}
        ${isDark ? "border-gray-600" : "border-gray-200"}
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

export default function MainHowItWorksSection() {
  const { theme } = useThemeStore();
  const themeStyle = howItWorksThemeStyles[theme] || howItWorksThemeStyles.pop;
  const isDark = theme === "dark";

  const steps = [
    { num: "01", title: "파티 찾기", desc: "원하는 파티를 검색!", emoji: themeStyle.emojis[0], color: themeStyle.stepColors[0] },
    { num: "02", title: "결제하기", desc: "안전하게 결제 완료!", emoji: themeStyle.emojis[1], color: themeStyle.stepColors[1] },
    { num: "03", title: "바로 시청", desc: "즉시 시청 시작!", emoji: themeStyle.emojis[2], color: themeStyle.stepColors[2] },
  ];

  return (
    <section className={`relative px-6 md:px-12 py-20 ${isDark ? "bg-[#0B1120]" : "bg-transparent"} ${isDark ? "border-gray-700" : "border-gray-200"} border-b`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Sticker color={isDark ? "bg-[#1E293B]" : "bg-white"} rotate={1} className="inline-block px-6 py-3 rounded-xl" isDark={isDark}>
            <span className={`text-xl md:text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>쉽게 시작해요! 👇</span>
          </Sticker>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.06, rotate: 6 }}
                className={`w-28 h-28 ${s.color} rounded-3xl ${isDark ? "border-gray-600" : "border-gray-200"} border shadow-[4px_4px_12px_rgba(0,0,0,0.08)] mx-auto mb-6 flex items-center justify-center`}
              >
                <span className="text-5xl">{s.emoji}</span>
              </motion.div>

              <div className={`inline-block ${isDark ? "bg-white text-black" : "bg-black text-white"} px-4 py-1 rounded-full font-black text-sm mb-4`}>
                STEP {s.num}
              </div>

              <h3 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{s.title}</h3>
              <p className={`text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
