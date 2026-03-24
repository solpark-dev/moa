import { motion } from "framer-motion";

export default function EyeCharacter() {
  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex gap-12">
        <Eye delay={0} />
        <Eye delay={0.08} />
      </div>
      <Mouth />
    </motion.div>
  );
}

function Eye({ delay }) {
  return (
    <motion.div
      className="relative w-24 h-24 rounded-full bg-white shadow-md"
      initial={{ x: 0 }}
      animate={{
        x: [
          0, // 가운데
          30, // 👉 오른쪽
          30, // 👉 잠깐 정지
          -30, // 👈 왼쪽
          -30, // 👈 잠깐 정지
          0, // 🟢 천천히 중앙 복귀
        ],
      }}
      transition={{
        delay,
        duration: 1.1, // 👈 전체를 천천히
        ease: "easeInOut",
        times: [0, 0.25, 0.4, 0.65, 0.8, 1],
      }}
    >
      {/* 눈동자 (고정) */}
      <div className="absolute top-1/2 left-1/2 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />

      {/* 하이라이트 */}
      <div className="absolute top-6 left-7 w-2.5 h-2.5 rounded-full bg-white opacity-70" />
    </motion.div>
  );
}

function Mouth() {
  return <div className="w-12 h-5 border-b-4 border-black rounded-b-full" />;
}
