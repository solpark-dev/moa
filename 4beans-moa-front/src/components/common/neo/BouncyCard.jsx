import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * BouncyCard - 띠용띠용 바운시 애니메이션 카드 컴포넌트
 *
 * @param {number} delay - 애니메이션 딜레이 (초)
 * @param {boolean} hoverEffect - 호버 시 떠오르는 효과 (기본값: true)
 * @param {string} className - 추가 클래스
 */
const BouncyCard = React.forwardRef(
  ({ children, delay = 0, hoverEffect = true, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, rotate: -3 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{
          delay,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        whileHover={hoverEffect ? { y: -10, rotate: 2 } : undefined}
        className={cn(
          "bg-white",
          "border border-gray-200",
          "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
          "rounded-3xl",
          "overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

BouncyCard.displayName = "BouncyCard";

export { BouncyCard };
