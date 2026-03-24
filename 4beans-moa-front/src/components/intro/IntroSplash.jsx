import { motion, AnimatePresence } from "framer-motion";
import EyeCharacter from "./EyeCharacter";
import MoaAppear from "./MoaAppear";
import { useState, useEffect } from "react";

export default function IntroSplash() {
  const [showEyes, setShowEyes] = useState(true);
  const [showMoa, setShowMoa] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowEyes(false), 900); // 눈 끝
    const t2 = setTimeout(() => setShowMoa(true), 950); // MOA 등장

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>{showEyes && <EyeCharacter />}</AnimatePresence>

      <AnimatePresence>{showMoa && <MoaAppear />}</AnimatePresence>
    </motion.div>
  );
}
