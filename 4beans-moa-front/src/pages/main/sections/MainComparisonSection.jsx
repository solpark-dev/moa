import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BouncyCard } from "@/components/common/neo";
import { useThemeStore } from "@/store/themeStore";

// 테마별 Comparison 섹션 스타일
const comparisonThemeStyles = {
  light: {
    cardBg: "bg-gradient-to-br from-pink-50 to-cyan-50",
    iconBg: "bg-pink-500",
    priceColor: "text-pink-500",
    savingBg: "bg-lime-100",
    savingText: "text-lime-600",
    avatarColors: ["bg-red-500", "bg-blue-500", "bg-lime-400", "bg-cyan-400"],
    emoji: "🎉",
  },
  dark: {
    cardBg: "bg-gradient-to-br from-[#1E293B] to-[#0F172A]",
    iconBg: "bg-[#635bff]",
    priceColor: "text-[#635bff]",
    savingBg: "bg-[#635bff]/20",
    savingText: "text-[#635bff]",
    avatarColors: ["bg-[#635bff]", "bg-[#00d4ff]", "bg-[#4fd1c5]", "bg-gray-500"],
    emoji: "🎉",
  },
};

// ============================================
// Comparison Section - 혼자 vs 모아 비교
// ============================================
export default function MainComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme } = useThemeStore();
  const themeStyle = comparisonThemeStyles[theme] || comparisonThemeStyles.light;
  const isDark = theme === "dark";

  return (
    <section ref={ref} className={`py-24 px-6 ${isDark ? 'bg-[#0F172A]' : 'bg-transparent'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl md:text-4xl font-black mb-3 ${isDark ? 'text-white' : ''}`}>
            얼마나 절약할 수 있을까요?
          </h2>
          <p className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>같은 서비스, 다른 가격</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 혼자 결제 */}
          <BouncyCard className={`p-8 text-center ${isDark ? 'bg-[#1E293B]' : ''}`} delay={0.1}>
            <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-200'}`}>
              <span className="text-4xl">😢</span>
            </div>
            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : ''}`}>혼자 결제하면</h3>
            <p className={`font-bold mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>정가 그대로, 매달 부담</p>
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full border ${isDark ? 'bg-gray-600 border-gray-500' : 'bg-gray-300 border-gray-200'}`} />
            </div>
            <p className="text-4xl font-black text-red-500">월 17,000원</p>
            <p className={`text-sm font-bold mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>넷플릭스 프리미엄 기준</p>
          </BouncyCard>

          {/* 모아에서 */}
          <BouncyCard className={`p-8 text-center ${themeStyle.cardBg}`} delay={0.2}>
            <div className={`w-20 h-20 ${themeStyle.iconBg} rounded-2xl border flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <span className="text-4xl">{themeStyle.emoji}</span>
            </div>
            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : ''}`}>모아에서 나누면</h3>
            <p className={`font-bold mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>똑같은 서비스, 저렴한 가격</p>
            <div className="flex justify-center -space-x-2 mb-4">
              {themeStyle.avatarColors.map((color, i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-full ${color} border shadow-sm ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
                />
              ))}
            </div>
            <p className={`text-4xl font-black ${themeStyle.priceColor}`}>월 4,250원</p>
            <p className="text-sm font-bold mt-2">
              <span className={`${themeStyle.savingText} ${themeStyle.savingBg} px-2 py-1 rounded-full border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                -75% 절약!
              </span>
            </p>
          </BouncyCard>
        </div>
      </div>
    </section>
  );
}
