import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";
import { ChristmasBackground } from "@/config/themeConfig";

// 테마별 배경 orbs 스타일
const backgroundThemeStyles = {
  classic: {
    orb1: "rgba(99, 91, 255, 0.12)", // Purple
    orb1Fade: "rgba(99, 91, 255, 0.04)",
    orb2: "rgba(0, 212, 255, 0.1)", // Cyan
    orb2Fade: "rgba(0, 212, 255, 0.04)",
    orb3: "rgba(99, 91, 255, 0.08)", // Purple
    orb3Fade: "rgba(99, 91, 255, 0.03)",
    orb4: "rgba(0, 212, 255, 0.08)", // Cyan
    orb4Fade: "rgba(0, 212, 255, 0.03)",
    bgColor: "bg-white",
  },
  dark: {
    orb1: "rgba(99, 91, 255, 0.15)", // Purple
    orb1Fade: "rgba(99, 91, 255, 0.05)",
    orb2: "rgba(79, 209, 197, 0.1)", // Teal
    orb2Fade: "rgba(79, 209, 197, 0.04)",
    orb3: "rgba(99, 91, 255, 0.1)", // Purple
    orb3Fade: "rgba(99, 91, 255, 0.04)",
    orb4: "rgba(79, 209, 197, 0.08)", // Teal
    orb4Fade: "rgba(79, 209, 197, 0.03)",
    bgColor: "bg-[#0B1120]",
  },
  pop: {
    orb1: "rgba(236, 72, 153, 0.15)", // Pink
    orb1Fade: "rgba(236, 72, 153, 0.05)",
    orb2: "rgba(6, 182, 212, 0.12)", // Cyan
    orb2Fade: "rgba(6, 182, 212, 0.05)",
    orb3: "rgba(163, 230, 53, 0.1)", // Lime
    orb3Fade: "rgba(163, 230, 53, 0.04)",
    orb4: "rgba(236, 72, 153, 0.1)", // Pink
    orb4Fade: "rgba(236, 72, 153, 0.04)",
    bgColor: "bg-slate-50",
  },
  christmas: {
    orb1: "rgba(196, 30, 58, 0.15)", // Christmas Red
    orb1Fade: "rgba(196, 30, 58, 0.05)",
    orb2: "rgba(26, 95, 42, 0.12)", // Christmas Green
    orb2Fade: "rgba(26, 95, 42, 0.05)",
    orb3: "rgba(196, 30, 58, 0.1)", // Red
    orb3Fade: "rgba(196, 30, 58, 0.04)",
    orb4: "rgba(26, 95, 42, 0.1)", // Green
    orb4Fade: "rgba(26, 95, 42, 0.04)",
    bgColor: "bg-transparent",
  },
};

/**
 * NeoBackground - 모든 페이지에서 사용되는 테마별 애니메이션 배경
 */
const NeoBackground = () => {
  const { theme } = useThemeStore();
  const themeStyle = backgroundThemeStyles[theme] || backgroundThemeStyles.pop;

  return (
    <>
      {/* Christmas 테마일 때 눈 내리는 배경 */}
      {theme === 'christmas' && <ChristmasBackground />}

      {/* Animated Gradient Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Primary Orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${themeStyle.orb1} 0%, ${themeStyle.orb1Fade} 40%, transparent 70%)`,
            top: "-10%",
            right: "-5%",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary Orb */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${themeStyle.orb2} 0%, ${themeStyle.orb2Fade} 40%, transparent 70%)`,
            bottom: "10%",
            left: "-10%",
          }}
          animate={{
            x: [0, -25, 35, 0],
            y: [0, 35, -25, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Tertiary Orb */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${themeStyle.orb3} 0%, ${themeStyle.orb3Fade} 40%, transparent 70%)`,
            top: "40%",
            left: "30%",
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />

        {/* Fourth Orb */}
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${themeStyle.orb4} 0%, ${themeStyle.orb4Fade} 40%, transparent 70%)`,
            bottom: "30%",
            right: "15%",
          }}
          animate={{
            x: [0, -20, 25, 0],
            y: [0, 25, -20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>

      {/* Dot Pattern Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none ${theme === 'dark' ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
        style={{
          backgroundImage: `radial-gradient(circle, ${theme === 'dark' ? '#fff' : '#000'} 1.5px, transparent 1.5px)`,
          backgroundSize: "20px 20px",
        }}
      />
    </>
  );
};

export { NeoBackground, backgroundThemeStyles };
