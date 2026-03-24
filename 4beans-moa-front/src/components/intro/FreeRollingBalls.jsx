import { motion } from "framer-motion";

const BALL_COUNT = 45;

const rand = (min, max) => Math.random() * (max - min) + min;

const COLORS = [
  ["#60a5fa", "#2563eb"],
  ["#34d399", "#059669"],
  ["#f472b6", "#db2777"],
  ["#facc15", "#eab308"],
  ["#fb7185", "#e11d48"],
];

export default function FreeRollingBalls() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  return (
    <>
      {Array.from({ length: BALL_COUNT }).map((_, i) => {
        const size = rand(16, 32);
        const startX = rand(0, w - size);
        const startY = rand(0, h - size);
        const moveX = rand(-300, 300);
        const moveY = rand(-220, 220);
        const rotate = rand(720, 2160);
        const duration = rand(2.5, 4.5);
        const [c1, c2] = COLORS[i % COLORS.length];

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: startX,
              top: startY,
              background: `radial-gradient(circle at 30% 30%, #fff, ${c1}, ${c2})`,
              boxShadow: `
                0 ${size / 2}px ${size}px rgba(0,0,0,0.35),
                inset -3px -3px 6px rgba(0,0,0,0.25)
              `,
            }}
            animate={{
              x: [0, moveX, -moveX, moveX * 0.6, 0],
              y: [0, moveY, -moveY, moveY * 0.6, 0],
              rotate: [0, rotate],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
        );
      })}
    </>
  );
}
