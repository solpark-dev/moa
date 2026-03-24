import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SuccessConfetti - 성공 시 터지는 confetti 효과
 * 파티 가입 성공, 파티 생성 완료 등에 사용
 */
export default function SuccessConfetti({ isActive, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      // 파티클 생성
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // 시작 x 위치 (%)
        color: [
          "#3b82f6", // blue
          "#8b5cf6", // purple
          "#ec4899", // pink
          "#10b981", // emerald
          "#f59e0b", // amber
          "#6366f1", // indigo
        ][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.3,
        rotation: Math.random() * 360,
        duration: Math.random() * 1 + 1.5,
      }));

      setParticles(newParticles);

      // 애니메이션 완료 후 정리
      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: "-10vh",
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: "110vh",
              rotate: particle.rotation + 720,
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeIn",
            }}
            className="absolute"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * useConfetti - confetti 효과를 쉽게 사용하기 위한 훅
 */
export function useConfetti() {
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
  };

  const ConfettiComponent = () => (
    <SuccessConfetti
      isActive={showConfetti}
      onComplete={() => setShowConfetti(false)}
    />
  );

  return { triggerConfetti, ConfettiComponent, showConfetti };
}
