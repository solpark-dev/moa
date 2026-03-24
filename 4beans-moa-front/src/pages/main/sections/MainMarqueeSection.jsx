import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

// 테마별 마키 스타일
const marqueeThemeStyles = {
  pop: {
    starColors: ["text-pink-400 fill-pink-400", "text-cyan-400 fill-cyan-400", "text-lime-400 fill-lime-400", "text-yellow-400 fill-yellow-400"],
  },
  dark: {
    starColors: ["text-[#635bff] fill-[#635bff]", "text-[#00d4ff] fill-[#00d4ff]", "text-[#4fd1c5] fill-[#4fd1c5]", "text-gray-400 fill-gray-400"],
  },
  christmas: {
    starColors: ["text-[#c41e3a] fill-[#c41e3a]", "text-[#1a5f2a] fill-[#1a5f2a]", "text-white fill-white", "text-[#c41e3a] fill-[#c41e3a]"],
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
// Marquee Band - OTT 서비스 롤링 텍스트
// ============================================
export default function MainMarqueeSection() {
  const { theme } = useThemeStore();
  const themeStyle = marqueeThemeStyles[theme] || marqueeThemeStyles.pop;

  return (
    <div className="bg-black text-white py-4 border-y border-gray-800">
      <Marquee speed={25}>
        <div className="flex items-center gap-8 px-4">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 text-xl font-black uppercase tracking-wider">
              <Star className={`w-6 h-6 ${themeStyle.starColors[0]}`} />
              Netflix
              <Star className={`w-6 h-6 ${themeStyle.starColors[1]}`} />
              Disney+
              <Star className={`w-6 h-6 ${themeStyle.starColors[2]}`} />
              YouTube
              <Star className={`w-6 h-6 ${themeStyle.starColors[3]}`} />
              Spotify
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
