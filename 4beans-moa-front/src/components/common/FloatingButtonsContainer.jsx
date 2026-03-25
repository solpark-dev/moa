import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Palette, Sun, Moon, ChevronUp } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { themeConfig } from "@/config/themeConfig";

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
      className={`p-3 rounded-full shadow-xl transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
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
        className={`relative p-3 rounded-full shadow-xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-800 text-white border border-gray-600"
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

            {['light', 'dark'].map((key, index) => {
              const config = themeConfig[key];
              const IconComponent = config.icon;
              const isActive = theme === key;

              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, scale: 0, x: 0 }}
                  animate={{ opacity: 1, scale: 1, x: 50 + index * 45 }}
                  exit={{ opacity: 0, scale: 0, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setTheme(key); setIsOpen(false); }}
                  className={`absolute top-0 left-0 p-2.5 rounded-full shadow-lg transition-colors duration-200 ${
                    isActive
                      ? key === "dark"
                        ? "bg-gray-800 text-white border border-gray-500"
                        : "bg-[#635bff] text-white"
                      : key === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-500"
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
// Pineapple Button (Easter egg)
// ============================================
const PineappleButton = ({ isEnabled, setIsEnabled }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsEnabled(!isEnabled)}
      className={`p-3 rounded-full shadow-xl transition-all duration-300 ${
        isEnabled
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
  const location = useLocation();

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col-reverse gap-3 items-start">
      {!location.pathname.startsWith('/admin') && <ThemeSwitcherHorizontal />}

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
