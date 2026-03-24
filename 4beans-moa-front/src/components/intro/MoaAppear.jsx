import { motion } from "framer-motion";

export default function MoaAppear() {
  return (
    <motion.div
      className="
        absolute left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        text-6xl font-black text-black
      "
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
    >
      MOA
    </motion.div>
  );
}
