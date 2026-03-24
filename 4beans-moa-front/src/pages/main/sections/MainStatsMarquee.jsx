import React from "react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";

// 테마별 Stats Marquee 스타일
const statsMarqueeThemeStyles = {
  pop: {
    bg: "bg-pink-500",
    border: "border-pink-400",
  },
  dark: {
    bg: "bg-[#635bff]",
    border: "border-[#5851e8]",
  },
  christmas: {
    bg: "bg-[#c41e3a]",
    border: "border-[#a51830]",
  },
};

// ============================================
// Marquee Component - 롤링 텍스트
// ============================================
function Marquee({ children, direction = "left", speed = 20 }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// ============================================
// Stats Marquee - 핑크 롤링 텍스트
// ============================================
export default function MainStatsMarquee() {
  const { theme } = useThemeStore();
  const themeStyle = statsMarqueeThemeStyles[theme] || statsMarqueeThemeStyles.pop;

  return (
    <div className={`${themeStyle.bg} text-white py-4 border-y ${themeStyle.border}`}>
      <Marquee direction="right" speed={30}>
        <div className="flex items-center gap-12 px-4">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-12 text-xl font-black uppercase">
              <span>{theme === "christmas" ? "🎄 10K+ 사용자" : "10K+ 사용자"}</span>
              <span>•</span>
              <span>{theme === "christmas" ? "🎁 75% 절약" : "75% 절약"}</span>
              <span>•</span>
              <span>{theme === "christmas" ? "🎅 4.9 만족도" : "4.9 만족도"}</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
