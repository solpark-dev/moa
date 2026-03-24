import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/themeStore";

// 테마별 카드 스타일
const cardThemeStyles = {
  pop: {
    // Neo/Pop 스타일 - 부드러운 그림자로 변경
    border: "border border-gray-200",
    shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    hoverShadow: "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]",
  },
  classic: {
    border: "border border-gray-200",
    shadow: "shadow-[4px_4px_12px_rgba(99,91,255,0.1)]",
    hoverShadow: "hover:shadow-[6px_6px_16px_rgba(99,91,255,0.15)]",
  },
  dark: {
    border: "border border-gray-700",
    shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.3)]",
    hoverShadow: "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.4)]",
  },
  christmas: {
    border: "border border-gray-200",
    shadow: "shadow-[4px_4px_12px_rgba(196,30,58,0.15)]",
    hoverShadow: "hover:shadow-[6px_6px_16px_rgba(196,30,58,0.2)]",
  },
};

/**
 * NeoCard - 네오브루탈리즘 스타일 카드 컴포넌트
 *
 * @param {string} color - 배경색 클래스 (예: "bg-white", "bg-pink-500")
 * @param {number} rotate - 회전 각도 (기본값: 0)
 * @param {boolean} hoverable - 호버 효과 활성화 여부 (기본값: true)
 * @param {string} className - 추가 클래스
 */
const NeoCard = React.forwardRef(
  ({ children, color = "bg-white", rotate = 0, hoverable = true, className, ...props }, ref) => {
    const { theme } = useThemeStore();
    const themeStyle = cardThemeStyles[theme] || cardThemeStyles.pop;

    const Component = hoverable ? motion.div : "div";
    const motionProps = hoverable ? {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 }
    } : {};

    return (
      <Component
        ref={ref}
        {...motionProps}
        className={cn(
          color,
          themeStyle.border,
          themeStyle.shadow,
          hoverable && themeStyle.hoverShadow,
          hoverable && "transition-all duration-200",
          className
        )}
        style={{ transform: `rotate(${rotate}deg)` }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

NeoCard.displayName = "NeoCard";

export { NeoCard };
