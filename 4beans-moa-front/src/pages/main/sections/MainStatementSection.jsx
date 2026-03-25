import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { NeoCard } from "@/components/common/neo";
import { useThemeStore } from "@/store/themeStore";

// 테마별 Statement 섹션 스타일
const statementThemeStyles = {
  light: {
    badgeBg: "bg-cyan-400",
    accentText: "text-pink-500",
    badgeText: "",
  },
};

// ============================================
// Statement Section - WHY MoA?
// ============================================
export default function MainStatementSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme } = useThemeStore();
  const themeStyle = statementThemeStyles[theme] || statementThemeStyles.light;
  const isDark = theme === "dark";

  return (
    <section ref={ref} className={`py-32 px-6 border-b ${isDark ? 'bg-[#0B1120] border-gray-600' : 'bg-transparent border-gray-200'}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <NeoCard color={themeStyle.badgeBg} rotate={-2} className="inline-block px-6 py-3 rounded-xl mb-8">
          <span className={`text-2xl font-black ${themeStyle.badgeText}`}>
            WHY MoA?
          </span>
        </NeoCard>
        <p className={`text-[28px] md:text-[36px] lg:text-[44px] font-black leading-[1.3] ${isDark ? 'text-white' : 'text-black'}`}>
          매달 나가는 구독료,
          <br />
          혼자 다 내고 계셨나요?
          <br />
          <span className={themeStyle.accentText}>
            이제 함께 나눠요!
          </span>
        </p>
      </motion.div>
    </section>
  );
}
