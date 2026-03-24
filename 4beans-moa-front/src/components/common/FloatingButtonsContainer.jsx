import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Palette, Sun, Moon, TreePine, MousePointer2, ChevronUp } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { themeConfig } from "@/config/themeConfig";
import { useAuthStore } from "@/store/authStore";
import { SnowPlowButton, useSnowPlow } from "@/components/christmas/SnowPlow";

// ============================================
// Helper: Encode SVG for cursor
// ============================================
const encodeSvg = (emoji) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" style="font-size: 24px;"><text y="28" font-size="28">${emoji}</text></svg>`;
  return `url('data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}') 16 16, auto`;
};

const cursorOptions = [
  { id: "default", label: "기본", icon: "👆", css: "auto" },
  { id: "santa", label: "산타", icon: "🎅", css: encodeSvg("🎅") },
  { id: "tree", label: "트리", icon: "🎄", css: encodeSvg("🎄") },
  { id: "gift", label: "선물", icon: "🎁", css: encodeSvg("🎁") },
  { id: "snow", label: "눈사람", icon: "⛄", css: encodeSvg("⛄") },
];

// ============================================
// Scroll To Top Button
// ============================================
export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useThemeStore();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={scrollToTop}
      className={`p-3 rounded-full shadow-xl transition-all duration-300 ${theme === "dark"
        ? "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
        : theme === "pop"
          ? "bg-white text-pink-500 border border-gray-200 hover:bg-pink-50"
          : theme === "christmas"
            ? "bg-white text-[#c41e3a] border border-gray-200 hover:bg-red-50"
            : "bg-white text-[#635bff] border border-gray-200 hover:bg-indigo-50"
        }`}
      title="맨 위로 이동"
    >
      <ChevronUp className="w-5 h-5" />
    </motion.button>
  );
};

// ============================================
// Theme Switcher (Horizontal Expand to Right)
// ============================================
const ThemeSwitcherHorizontal = () => {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-full shadow-xl transition-all duration-300 ${theme === "dark"
          ? "bg-gray-800 text-white border border-gray-600"
          : theme === "pop"
            ? "bg-pink-500 text-white border border-gray-200"
            : theme === "christmas"
              ? "bg-[#c41e3a] text-white"
              : "bg-white text-gray-700 border border-gray-200"
          }`}
        title="테마 변경"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Horizontal Theme Options (Expand to Right) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[-1]"
              onClick={() => setIsOpen(false)}
            />

            {['pop', 'classic', 'dark', 'christmas'].map((key, index) => {
              const config = themeConfig[key];
              const IconComponent = config.icon;
              const isActive = theme === key;

              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, scale: 0, x: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 50 + index * 45,
                  }}
                  exit={{ opacity: 0, scale: 0, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setTheme(key);
                    setIsOpen(false);
                  }}
                  className={`absolute top-0 left-0 p-2.5 rounded-full shadow-lg transition-colors duration-200 ${isActive
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
// Cursor Selector (Horizontal Expand to Right)
// ============================================
const CursorSelectorHorizontal = ({ activeCursor, setActiveCursor }) => {
  const { theme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (theme !== "christmas") {
      setActiveCursor("default");
      setIsOpen(false);
    }
  }, [theme, setActiveCursor]);

  useEffect(() => {
    if (theme !== "christmas") {
      const styleId = "custom-cursor-style";
      const styleTag = document.getElementById(styleId);
      if (styleTag) styleTag.innerHTML = ``;
      document.body.style.cursor = "auto";
      return;
    }

    const option = cursorOptions.find((o) => o.id === activeCursor);
    if (option) {
      document.body.style.cursor = option.css;

      const styleId = "custom-cursor-style";
      let styleTag = document.getElementById(styleId);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }

      if (activeCursor === "default") {
        styleTag.innerHTML = ``;
      } else {
        styleTag.innerHTML = `
          html, body, div, span, applet, object, iframe,
          h1, h2, h3, h4, h5, h6, p, blockquote, pre,
          a, abbr, acronym, address, big, cite, code,
          del, dfn, em, img, ins, kbd, q, s, samp,
          small, strike, strong, sub, sup, tt, var,
          b, u, i, center,
          dl, dt, dd, ol, ul, li,
          fieldset, form, label, legend,
          table, caption, tbody, tfoot, thead, tr, th, td,
          article, aside, canvas, details, embed,
          figure, figcaption, footer, header, hgroup,
          menu, nav, output, ruby, section, summary,
          time, mark, audio, video, button {
            cursor: ${option.css} !important;
          }
          input, textarea, [contenteditable] {
            cursor: text !important;
          }
          button:disabled, input:disabled {
            cursor: not-allowed !important;
          }
        `;
      }
    }
  }, [activeCursor, theme]);

  if (theme !== "christmas") return null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-white text-gray-700 border border-gray-200 rounded-full shadow-xl hover:bg-gray-50 transition-colors"
        title="커서 변경"
      >
        <span className="text-[20px] leading-none flex items-center justify-center w-5 h-5">
          {cursorOptions.find((o) => o.id === activeCursor)?.icon || (
            <MousePointer2 className="w-5 h-5" />
          )}
        </span>
      </motion.button>

      {/* Horizontal Cursor Options (Expand to Right) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsOpen(false)}
            />

            {cursorOptions.map((option, index) => {
              const isActive = activeCursor === option.id;

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, scale: 0, x: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 50 + index * 45,
                  }}
                  exit={{ opacity: 0, scale: 0, x: 0 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    delay: index * 0.05,
                  }}
                  onClick={() => {
                    setActiveCursor(option.id);
                    setIsOpen(false);
                  }}
                  className={`absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md z-50 border-2 transition-colors ${isActive
                    ? "bg-red-100 border-red-500"
                    : "bg-white border-white hover:bg-gray-100"
                    }`}
                >
                  <span className="text-lg">{option.icon}</span>
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
// Pineapple Button (Expand Upward)
// ============================================
const PineappleButton = ({ isEnabled, setIsEnabled }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsEnabled(!isEnabled)}
      className={`p-3 rounded-full shadow-xl transition-all duration-300 ${isEnabled
        ? "bg-white text-gray-700 border border-gray-200 hover:bg-yellow-50"
        : "bg-gray-500/50 text-white border border-gray-400"
        }`}
      title={isEnabled ? "파인애플 숨기기" : "파인애플 보이기"}
    >
      <span className="text-xl">{isEnabled ? "🍍" : "🚫"}</span>
    </motion.button>
  );
};

// ============================================
// Main Floating Buttons Container
// ============================================
const FloatingButtonsContainer = ({
  showPineapple = false,
  pineappleEnabled,
  setPineappleEnabled,
}) => {
  const { theme } = useThemeStore();
  const location = useLocation();
  const { activeCursor, setActiveCursor } = useSnowPlow() || {};

  // Reset cursor if theme changes from christmas
  useEffect(() => {
    if (theme !== "christmas" && setActiveCursor) {
      setActiveCursor("default");
      // Remove style tag if exists (safety)
      const styleId = "custom-cursor-style";
      const styleTag = document.getElementById(styleId);
      if (styleTag) styleTag.innerHTML = ``;
      document.body.style.cursor = "auto";
    }
  }, [theme, setActiveCursor]);

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col-reverse gap-3 items-start">
      {/* Row 1: Theme Switcher (Bottom) - Hidden on Admin pages */}
      {!location.pathname.startsWith('/admin') && <ThemeSwitcherHorizontal />}

      {/* Row 2: Cursor Selector (Christmas only) */}
      {theme === "christmas" && (
        <CursorSelectorHorizontal
          activeCursor={activeCursor}
          setActiveCursor={setActiveCursor}
        />
      )}

      {/* Row 3: Snow Plow Button (Christmas only, above cursor, only on /party) */}
      {theme === "christmas" && location.pathname === '/party' && <SnowPlowButton />}

      {/* Row 4: Pineapple Button (Easter egg users only) */}
      {showPineapple && (
        <PineappleButton
          isEnabled={pineappleEnabled}
          setIsEnabled={setPineappleEnabled}
        />
      )}
    </div>
  );
};

export default FloatingButtonsContainer;
