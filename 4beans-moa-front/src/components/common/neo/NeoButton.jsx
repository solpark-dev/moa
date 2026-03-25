import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/themeStore";

// 테마별 버튼 스타일
const buttonThemeStyles = {
  light: {
    border: "border border-gray-200",
    shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    hoverShadow: "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]",
  },
  dark: {
    border: "border border-gray-700",
    shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.3)]",
    hoverShadow: "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.4)]",
  },
};

/**
 * NeoButton - 네오브루탈리즘 스타일 버튼 컴포넌트
 *
 * @param {string} color - 배경색 클래스 (예: "bg-pink-500", "bg-white")
 * @param {string} size - 버튼 크기 ("xs" | "sm" | "md" | "lg")
 * @param {string} className - 추가 클래스
 */
const NeoButton = React.forwardRef(
  ({ children, color = "bg-pink-500", size = "md", className, ...props }, ref) => {
    const { theme } = useThemeStore();
    const themeStyle = buttonThemeStyles[theme] || buttonThemeStyles.light;

    const sizeClasses = {
      xs: "px-4 py-3 text-sm font-bold",
      sm: "px-4 py-2 text-sm font-black",
      md: "px-8 py-4 text-xl font-black",
      lg: "px-12 py-6 text-2xl font-black",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          color,
          sizeClasses[size],
          themeStyle.border,
          themeStyle.shadow,
          themeStyle.hoverShadow,
          "transition-all duration-200",
          "rounded-xl",
          "flex items-center gap-2",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

NeoButton.displayName = "NeoButton";

export { NeoButton };
