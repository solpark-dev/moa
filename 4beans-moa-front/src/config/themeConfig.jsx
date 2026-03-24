import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Palette, TreePine } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

// ============================================
// Page Theme Configuration
// ============================================
export const themeConfig = {
  classic: {
    name: "Classic",
    icon: Sun,
    bg: "bg-transparent",
    heroBg: "bg-transparent",
    text: "text-gray-900",
    subtext: "text-gray-600",
    card: "bg-white/90 backdrop-blur-sm border-gray-100 hover:border-gray-200",
    cardText: "text-gray-900",
    cardSubtext: "text-gray-500",
    accent: "#635bff",
    accentBg: "bg-[#635bff]",
    accentText: "text-[#635bff]",
    filterBg: "bg-white/80",
    filterBorder: "border-gray-100",
    inputBg: "bg-white",
    inputBorder: "border-gray-200",
    inputText: "text-gray-900",
    buttonActive: "bg-[#635bff] text-white",
    buttonInactive: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    sectionBg: "bg-gray-50",
    gradientText: "bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent",
    cssVars: {
      "--theme-primary": "#635bff",
      "--theme-primary-hover": "#5a52d5",
      "--theme-primary-light": "#e0e7ff",
      "--theme-secondary": "#00d4ff",
      "--theme-bg": "#ffffff",
      "--theme-bg-card": "#ffffff",
      "--theme-text": "#111827",
      "--theme-text-muted": "#4b5563",
      "--theme-border": "#e5e7eb",
      "--theme-border-light": "#f3f4f6",
      "--theme-bg-input": "#ffffff",
      "--theme-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      "--theme-shadow-color": "rgba(99, 91, 255, 0.25)",
      "--theme-primary-shadow": "0 10px 15px -3px rgba(99, 91, 255, 0.4)",
      "--theme-focus-ring": "#635bff",
    }
  },
  dark: {
    name: "Dark",
    icon: Moon,
    bg: "bg-transparent",
    heroBg: "bg-transparent",
    text: "text-white",
    subtext: "text-gray-400",
    card: "bg-[#1E293B]/90 backdrop-blur-sm border-gray-700 hover:border-gray-600",
    cardText: "text-white",
    cardSubtext: "text-gray-400",
    accent: "#635bff",
    accentBg: "bg-[#635bff]",
    accentText: "text-[#635bff]",
    filterBg: "bg-[#1E293B]/80",
    filterBorder: "border-gray-700",
    inputBg: "bg-[#0F172A]",
    inputBorder: "border-gray-700",
    inputText: "text-white",
    buttonActive: "bg-[#635bff] text-white",
    buttonInactive: "bg-[#1E293B] text-gray-400 hover:bg-[#334155]",
    sectionBg: "bg-[#0F172A]",
    gradientText: "bg-gradient-to-r from-[#635bff] via-[#00d4ff] to-[#00d4ff] bg-clip-text text-transparent",
    cssVars: {
      "--theme-primary": "#635bff",
      "--theme-primary-hover": "#5a52d5",
      "--theme-primary-light": "rgba(99, 91, 255, 0.2)",
      "--theme-secondary": "#00d4ff",
      "--theme-bg": "#0B1120",
      "--theme-bg-card": "#1E293B",
      "--theme-text": "#ffffff",
      "--theme-text-muted": "#9ca3af",
      "--theme-border": "#334155",
      "--theme-border-light": "#1e293b",
      "--theme-bg-input": "#0F172A",
      "--theme-shadow": "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
      "--theme-shadow-color": "rgba(99, 91, 255, 0.25)",
      "--theme-primary-shadow": "0 10px 15px -3px rgba(99, 91, 255, 0.4)",
      "--theme-focus-ring": "#635bff",
    }
  },
  pop: {
    name: "Pop",
    icon: Palette,
    bg: "bg-transparent",
    heroBg: "bg-transparent",
    text: "text-black",
    subtext: "text-gray-600",
    card: "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    cardText: "text-black",
    cardSubtext: "text-gray-600",
    accent: "#ec4899",
    accentBg: "bg-pink-500",
    accentText: "text-pink-500",
    filterBg: "bg-white",
    filterBorder: "border border-gray-200",
    inputBg: "bg-white",
    inputBorder: "border border-gray-200",
    inputText: "text-black",
    buttonActive: "bg-pink-500 text-white border border-gray-200",
    buttonInactive: "bg-white text-black border border-gray-200 hover:bg-pink-100",
    sectionBg: "bg-white",
    gradientText: "text-pink-500",
    cssVars: {
      "--theme-primary": "#ec4899",
      "--theme-primary-hover": "#db2777",
      "--theme-primary-light": "#fce7f3",
      "--theme-secondary": "#d946ef",
      "--theme-bg": "#f8fafc",
      "--theme-bg-card": "#ffffff",
      "--theme-text": "#000000",
      "--theme-text-muted": "#4b5563",
      "--theme-border": "#e2e8f0",
      "--theme-border-light": "#f1f5f9",
      "--theme-bg-input": "#ffffff",
      "--theme-shadow": "4px 4px 12px rgba(0,0,0,0.08)",
      "--theme-shadow-color": "rgba(236, 72, 153, 0.25)",
      "--theme-primary-shadow": "0 10px 15px -3px rgba(236, 72, 153, 0.4)",
      "--theme-focus-ring": "#ec4899",
    }
  },
  christmas: {
    name: "Christmas",
    icon: TreePine,
    // Variant T style base with Christmas colors - transparent to show snowflakes
    bg: "bg-transparent",
    heroBg: "bg-transparent",
    text: "text-gray-900",
    subtext: "text-gray-600",
    card: "bg-white/90 backdrop-blur-sm border-gray-100 hover:border-[#c41e3a]/30 hover:shadow-xl",
    cardText: "text-gray-900",
    cardSubtext: "text-gray-500",
    accent: "#c41e3a",
    accentBg: "bg-[#c41e3a]",
    accentText: "text-[#c41e3a]",
    filterBg: "bg-white/80",
    filterBorder: "border-gray-100",
    inputBg: "bg-white",
    inputBorder: "border-gray-200",
    inputText: "text-gray-900",
    buttonActive: "bg-[#c41e3a] text-white shadow-lg shadow-[#c41e3a]/25",
    buttonInactive: "bg-gray-100 text-gray-600 hover:bg-[#c41e3a]/10 hover:text-[#c41e3a]",
    sectionBg: "bg-gray-50",
    gradientText: "bg-gradient-to-r from-[#c41e3a] to-[#1a5f2a] bg-clip-text text-transparent",
    cssVars: {
      "--theme-primary": "#c41e3a",
      "--theme-primary-hover": "#9b1c2e",
      "--theme-primary-light": "#fee2e2",
      "--theme-secondary": "#1a5f2a",
      "--theme-bg": "transparent",
      "--theme-bg-card": "#ffffff",
      "--theme-text": "#111827",
      "--theme-text-muted": "#4b5563",
      "--theme-border": "#e5e7eb",
      "--theme-border-light": "#f3f4f6",
      "--theme-bg-input": "#ffffff",
      "--theme-shadow": "0 4px 6px -1px rgba(196, 30, 58, 0.1), 0 2px 4px -2px rgba(196, 30, 58, 0.06)",
      "--theme-shadow-color": "rgba(196, 30, 58, 0.25)",
      "--theme-primary-shadow": "0 10px 15px -3px rgba(196, 30, 58, 0.4)",
      "--theme-focus-ring": "#c41e3a",
    }
  },
};

// ============================================
// Header Theme Configuration
// ============================================
export const headerThemes = {
  classic: {
    // Header container
    bg: "bg-white/95 backdrop-blur-xl",
    border: "border-gray-200/80",
    borderWidth: "border-b",
    // Text colors
    text: "text-gray-900",
    subtext: "text-gray-600",
    // Logo
    logoBg: "bg-white",
    logoBorder: "border border-gray-200",
    logoShadow: "shadow-sm hover:shadow-md",
    logoText: "text-gray-900",
    // Sticker/Card components
    stickerBg: "bg-white",
    stickerBorder: "border border-gray-200",
    stickerShadow: "shadow-sm hover:shadow-md",
    stickerText: "text-gray-900",
    // Menu button
    menuBg: "bg-[#635bff]",
    menuText: "text-white",
    menuBorder: "",
    // Dropdown
    dropdownBg: "bg-white",
    dropdownBorder: "border border-gray-200",
    dropdownShadow: "shadow-xl",
    dropdownItemBg: "bg-gray-50",
    dropdownItemHover: "hover:bg-gray-100",
    dropdownItemText: "text-gray-900",
    dropdownItemSubtext: "text-gray-600",
    // Accent
    accent: "#635bff",
    accentBg: "bg-[#635bff]",
    accentText: "text-white",
    // Separator
    separatorColor: "bg-gray-200",
    // Switch
    switchChecked: "data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300",
    // Avatar
    avatarBorder: "border-2 border-black bg-slate-50",
    avatarFallback: "bg-[#635bff] text-white",
  },
  dark: {
    // Header container
    bg: "bg-[#0B1120]/95 backdrop-blur-xl",
    border: "border-gray-700/50",
    borderWidth: "border-b",
    // Text colors
    text: "text-white",
    subtext: "text-gray-400",
    // Logo
    logoBg: "bg-gray-800",
    logoBorder: "border border-gray-600",
    logoShadow: "shadow-lg shadow-black/20",
    logoText: "text-white",
    // Sticker/Card components
    stickerBg: "bg-gray-800",
    stickerBorder: "border border-gray-600",
    stickerShadow: "shadow-lg shadow-black/20",
    stickerText: "text-white",
    // Menu button
    menuBg: "bg-[#635bff]",
    menuText: "text-white",
    menuBorder: "border border-[#635bff]/50",
    // Dropdown
    dropdownBg: "bg-[#1E293B]",
    dropdownBorder: "border border-gray-600",
    dropdownShadow: "shadow-2xl shadow-black/50",
    dropdownItemBg: "bg-gray-700/50",
    dropdownItemHover: "hover:bg-gray-600/50",
    dropdownItemText: "text-white",
    dropdownItemSubtext: "text-gray-400",
    // Accent
    accent: "#635bff",
    accentBg: "bg-[#635bff]",
    accentText: "text-white",
    // Separator
    separatorColor: "bg-gray-600",
    // Switch
    switchChecked: "data-[state=checked]:bg-[#635bff] data-[state=unchecked]:bg-gray-600",
    // Avatar
    avatarBorder: "border-2 border-gray-600 bg-gray-700",
    avatarFallback: "bg-[#635bff] text-white",
  },
  pop: {
    // Header container
    bg: "bg-slate-50",
    border: "border-gray-200",
    borderWidth: "border-b",
    // Text colors
    text: "text-black",
    subtext: "text-gray-600",
    // Logo
    logoBg: "bg-white",
    logoBorder: "border border-gray-200",
    logoShadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    logoText: "text-black",
    // Sticker/Card components
    stickerBg: "bg-white",
    stickerBorder: "border border-gray-200",
    stickerShadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    stickerText: "text-black",
    // Menu button
    menuBg: "bg-pink-500",
    menuText: "text-white",
    menuBorder: "border border-gray-200",
    // Dropdown
    dropdownBg: "bg-white",
    dropdownBorder: "border border-gray-200",
    dropdownShadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    dropdownItemBg: "bg-white",
    dropdownItemHover: "hover:bg-pink-100",
    dropdownItemText: "text-black",
    dropdownItemSubtext: "text-gray-600",
    // Accent
    accent: "#ec4899",
    accentBg: "bg-pink-500",
    accentText: "text-white",
    // Separator
    separatorColor: "bg-gray-200",
    // Switch
    switchChecked: "data-[state=checked]:bg-pink-500 data-[state=unchecked]:bg-slate-300",
    // Avatar
    avatarBorder: "border-2 border-gray-200 bg-slate-50",
    avatarFallback: "bg-cyan-400 text-black",
  },
  christmas: {
    // Header container - Variant T style with Christmas accent
    bg: "bg-white/95 backdrop-blur-xl",
    border: "border-gray-100/50",
    borderWidth: "border-b",
    // Text colors
    text: "text-gray-900",
    subtext: "text-gray-600",
    // Logo
    logoBg: "bg-white",
    logoBorder: "border border-gray-200",
    logoShadow: "shadow-sm hover:shadow-md",
    logoText: "text-gray-900",
    // Sticker/Card components
    stickerBg: "bg-white",
    stickerBorder: "border border-gray-200",
    stickerShadow: "shadow-sm hover:shadow-md",
    stickerText: "text-gray-900",
    // Menu button - Christmas red
    menuBg: "bg-[#c41e3a]",
    menuText: "text-white",
    menuBorder: "",
    // Dropdown
    dropdownBg: "bg-white",
    dropdownBorder: "border border-gray-200",
    dropdownShadow: "shadow-xl",
    dropdownItemBg: "bg-gray-50",
    dropdownItemHover: "hover:bg-[#c41e3a]/10",
    dropdownItemText: "text-gray-900",
    dropdownItemSubtext: "text-gray-600",
    // Accent - Christmas red
    accent: "#c41e3a",
    accentBg: "bg-[#c41e3a]",
    accentText: "text-white",
    // Separator
    separatorColor: "bg-gray-200",
    // Switch - Christmas colors
    switchChecked: "data-[state=checked]:bg-[#c41e3a] data-[state=unchecked]:bg-gray-300",
    // Avatar - Christmas green accent
    avatarBorder: "border-2 border-[#1a5f2a] bg-slate-50",
    avatarFallback: "bg-[#c41e3a] text-white",
  },
};

// ============================================
// NavPill Styles per Theme
// ============================================
export const navPillStyles = {
  classic: {
    base: "border-0",
    active: "bg-[#635bff] text-white shadow-md shadow-[#635bff]/20",
    inactive: "bg-transparent text-black hover:bg-[#635bff] hover:text-white hover:shadow-md hover:shadow-[#635bff]/20",
    iconBase: "",
    iconActive: "bg-white text-[#635bff]",
    iconInactive: "bg-transparent text-black group-hover:bg-white group-hover:text-[#635bff]",
  },
  dark: {
    base: "border-0",
    active: "bg-[#635bff] text-white shadow-lg shadow-[#635bff]/30",
    inactive: "bg-transparent text-white hover:bg-[#635bff] hover:text-white hover:shadow-lg hover:shadow-[#635bff]/30",
    iconBase: "",
    iconActive: "bg-white text-[#635bff]",
    iconInactive: "bg-transparent text-white group-hover:bg-white group-hover:text-[#635bff]",
  },
  pop: {
    base: "border-0",
    active: "bg-pink-500 text-white",
    inactive: "bg-transparent text-black hover:bg-pink-500 hover:text-white",
    iconBase: "",
    iconActive: "bg-white text-pink-500",
    iconInactive: "bg-transparent text-black group-hover:bg-white group-hover:text-pink-500",
  },
  portrait: {
    base: "border-0",
    active: "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] text-white shadow-lg shadow-pink-200/40",
    inactive: "bg-transparent text-gray-600 hover:bg-gradient-to-r hover:from-[#FFB5C5] hover:to-[#C5B5FF] hover:text-white hover:shadow-lg hover:shadow-pink-200/40",
    iconBase: "",
    iconActive: "bg-white text-pink-400",
    iconInactive: "bg-transparent text-gray-500 group-hover:bg-white group-hover:text-pink-400",
  },
  christmas: {
    base: "border-0",
    active: "bg-[#c41e3a] text-white shadow-md shadow-[#c41e3a]/20",
    inactive: "bg-transparent text-black hover:bg-[#c41e3a] hover:text-white hover:shadow-md hover:shadow-[#c41e3a]/20",
    iconBase: "",
    iconActive: "bg-white text-[#c41e3a]",
    iconInactive: "bg-transparent text-black group-hover:bg-white group-hover:text-[#c41e3a]",
  },
};

// ============================================
// Mobile Nav Item Styles per Theme
// ============================================
export const getMobileNavItemStyle = (theme) => {
  switch (theme) {
    case "dark":
      return "py-2.5 flex items-center justify-between gap-3 font-bold text-white rounded-2xl hover:bg-[#635bff] border border-gray-600 bg-gray-700/50 px-3 transition-all duration-200";
    case "pop":
      return "py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-pink-500 hover:text-white border border-gray-200 bg-white px-3 transition-all duration-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]";
    case "christmas":
      return "py-2.5 flex items-center justify-between gap-3 font-semibold text-gray-900 rounded-2xl hover:bg-[#c41e3a] hover:text-white border border-gray-200 bg-gray-50 px-3 transition-all duration-200";
    default:
      return "py-2.5 flex items-center justify-between gap-3 font-semibold text-gray-900 rounded-2xl hover:bg-[#635bff] hover:text-white border border-gray-200 bg-gray-50 px-3 transition-all duration-200";
  }
};

// ============================================
// Background Components
// ============================================

// Classic Animated Gradient
export const AnimatedGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(99, 91, 255, 0.06) 0%, transparent 70%)",
        top: "-200px",
        right: "-100px",
      }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%)",
        bottom: "-100px",
        left: "-50px",
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Dark Theme Gradient
export const DarkGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute w-[800px] h-[800px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(99, 91, 255, 0.15) 0%, transparent 70%)",
        top: "-200px",
        right: "-200px",
      }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(79, 209, 197, 0.1) 0%, transparent 70%)",
        bottom: "100px",
        left: "-100px",
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Christmas Theme Background - Subtle mint/cream background with snowflakes
export const ChristmasBackground = () => (
  <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none -z-10 overflow-hidden">
    {/* Subtle green/cream tinted background for snowflake visibility */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0e8] via-[#f0ebe5] to-[#e5ece8]" />

    {/* Variant T style gradient orbs with Christmas colors */}
    <motion.div
      className="absolute w-[800px] h-[800px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(196, 30, 58, 0.08) 0%, transparent 70%)",
        top: "-200px",
        right: "-200px",
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.7, 0.5],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(26, 95, 42, 0.08) 0%, transparent 70%)",
        bottom: "100px",
        left: "-100px",
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Falling snow - 더 많은 눈송이 (50개) */}
    {[...Array(50)].map((_, i) => {
      // Pseudo-random positions using prime-based distribution
      const leftPos = ((i * 13 + 7) % 100);
      const size = 6 + (i % 5) * 4; // 6px to 22px - 다양한 크기

      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${leftPos}%`,
            top: "-30px",
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.8) 40%, rgba(255, 255, 255, 0.4) 70%, transparent 100%)`,
            filter: "blur(0.3px)",
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08), 0 0 ${size + 4}px rgba(255, 255, 255, 0.6)`,
          }}
          animate={{
            y: ["0vh", "115vh"],
            x: [
              0,
              Math.sin(i * 0.5 + 1.2) * 80 * (i % 2 === 0 ? 1 : -1),
              Math.cos(i * 0.4 + 0.6) * 50 * (i % 2 === 0 ? -1 : 1),
              Math.sin(i * 0.3 + 0.9) * 40,
              0
            ],
            scale: [1, 1.15, 0.85, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12 + (i % 8) * 2.5, // 12s to 30s - 더 빠르게
            repeat: Infinity,
            delay: (i * 0.8) + Math.sin(i) * 1.5,
            ease: "linear",
          }}
        />
      );
    })}

    {/* 추가 작은 눈 입자들 (30개) - 빠르게 떨어지는 작은 눈 */}
    {[...Array(30)].map((_, i) => {
      const leftPos = ((i * 19 + 11) % 100);
      const size = 3 + (i % 3) * 2; // 3px to 7px

      return (
        <motion.div
          key={`small-${i}`}
          className="absolute rounded-full bg-white/80"
          style={{
            left: `${leftPos}%`,
            top: "-15px",
            width: `${size}px`,
            height: `${size}px`,
            boxShadow: `0 0 ${size + 2}px rgba(255, 255, 255, 0.5)`,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [
              0,
              Math.sin(i * 0.8) * 30 * (i % 2 === 0 ? 1 : -1),
              Math.cos(i * 0.6) * 20,
              0
            ],
          }}
          transition={{
            duration: 8 + (i % 5) * 2, // 8s to 16s - 빠르게
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear",
          }}
        />
      );
    })}

  </div>
);

// Grid Pattern
export const GridPattern = ({ dark = false }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${dark ? "opacity-[0.1]" : "opacity-[0.02]"}`}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className={dark ? "text-gray-500" : ""} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

// ============================================
// Theme Background Renderer
// ============================================
export const ThemeBackground = ({ theme }) => {
  switch (theme) {
    case "dark":
      return (
        <>
          <DarkGradient />
          <GridPattern dark />
        </>
      );
    case "christmas":
      return <ChristmasBackground />;
    case "pop":
      return <GridPattern />;
    default:
      return (
        <>
          <AnimatedGradient />
          <GridPattern />
        </>
      );
  }
};

// ============================================
// Theme Switcher Component (Radial Menu)
// ============================================
export const ThemeSwitcher = ({ theme, onThemeChange }) => {
  // Internal state for menu open/close
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-full shadow-xl transition-all duration-300 ${theme === "dark"
          ? "bg-gray-800 text-white border border-gray-600"
          : theme === "pop"
            ? "bg-pink-500 text-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
            : theme === "christmas"
              ? "bg-[#c41e3a] text-white shadow-lg shadow-[#c41e3a]/25"
              : "bg-white text-gray-700 border border-gray-200 shadow-lg"
          }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Expandable Theme Options - Radial Layout */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[-1]"
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Options - Horizontal Right Layout */}
            {['pop', 'classic', 'dark', 'christmas'].map((key, index) => {
              const config = themeConfig[key];
              const IconComponent = config.icon;
              const isActive = theme === key;
              // 수평 우측으로 버튼 배치
              const spacing = 48; // 버튼 간 간격
              const x = (index + 1) * spacing;
              const y = 0; // 수평 유지

              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: x,
                    y: y,
                  }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onThemeChange(key);
                    setIsOpen(false);
                  }}
                  className={`absolute top-0 right-0 p-2.5 rounded-full shadow-lg transition-colors duration-200 ${isActive
                    ? key === "pop"
                      ? "bg-pink-500 text-white border border-gray-200"
                      : key === "dark"
                        ? "bg-gray-800 text-white border border-gray-500"
                        : key === "christmas"
                          ? "bg-[#c41e3a] text-white"
                          : "bg-[#635bff] text-white"
                    : key === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-500"
                      : key === "christmas"
                        ? "bg-white text-[#c41e3a] hover:bg-[#c41e3a]/10 border border-gray-200"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  title={config.name}
                >
                  <IconComponent className="w-4 h-4" />
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// Header Sticker Component
// ============================================
export const HeaderSticker = ({ children, theme = "classic", className = "" }) => {
  const themeStyle = headerThemes[theme] || headerThemes.classic;

  return (
    <div
      className={`${themeStyle.stickerBg} ${themeStyle.stickerBorder} ${themeStyle.stickerShadow} transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

// ============================================
// useTheme Hook (Convenience wrapper)
// ============================================
export const useTheme = () => {
  const { theme, setTheme } = useThemeStore();
  const currentTheme = themeConfig[theme] || themeConfig.classic;

  return {
    theme,
    setTheme,
    currentTheme,
  };
};

// ============================================
// Theme Marquee Component (for pop theme)
// ============================================
export const ThemeMarquee = ({ theme, children, direction = "left", speed = 20 }) => {
  // Only show marquee for pop theme
  if (theme !== "pop") return null;

  // Default content if no children provided
  const content = children || (
    <div className="flex items-center gap-8 text-black font-black text-sm uppercase tracking-widest px-8">
      <span>★ OTT 공유</span>
      <span>★ 최대 75% 절약</span>
      <span>★ 안전한 파티</span>
      <span>★ 간편 결제</span>
      <span>★ OTT 공유</span>
      <span>★ 최대 75% 절약</span>
      <span>★ 안전한 파티</span>
      <span>★ 간편 결제</span>
    </div>
  );

  return (
    <div className="bg-yellow-300 border-y border-gray-200 py-2 overflow-hidden whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <motion.div
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {content}
        {content}
      </motion.div>
    </div>
  );
};

// ============================================
// Sticker Component (Pop style element)
// ============================================
export const Sticker = ({ children, color = "bg-white", rotate = 0, className = "", onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: rotate + 2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${color} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </motion.div>
);
