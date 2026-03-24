import { motion } from "framer-motion";

export default function MoaLogo() {
  return (
    <motion.div
      className="
        absolute
        left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        text-white text-6xl font-black
        drop-shadow-lg
      "
      initial={{
        y: -300,
        rotate: 0,
      }}
      animate={{
        y: [-300, 0, -30, 0],
        x: [0, -120, 180, -60, 120],
        rotate: [0, 0, 360, 720, 1080],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
    >
      MOA
    </motion.div>
  );
}
