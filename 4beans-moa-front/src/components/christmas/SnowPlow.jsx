import { useState, useEffect, useRef, createContext, useContext, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import CursorSelector from "./CursorSelector";
import { useThemeStore } from "../../store/themeStore";

// ============================================
// Snow Plow Context
// ============================================
const SnowPlowContext = createContext(null);

export const useSnowPlow = () => useContext(SnowPlowContext);

// ============================================
// Snow Plow Provider
// ============================================
export const SnowPlowProvider = ({ children }) => {
  const [isPlowing, setIsPlowing] = useState(false);
  const [isSnowCleared, setIsSnowCleared] = useState(false);
  const [plowProgress, setPlowProgress] = useState(0); // 0 to 100
  const [accumulation, setAccumulation] = useState(0); // 0 to 100
  const [showSnowman, setShowSnowman] = useState(false);
  const [plowId, setPlowId] = useState(0);
  const [activeCursor, setActiveCursor] = useState("default");
  const snowmanTimerRef = useRef(null);

  // 10초 후 눈사람 표시
  useEffect(() => {
    snowmanTimerRef.current = setTimeout(() => {
      setShowSnowman(true);
    }, 10000);

    return () => {
      if (snowmanTimerRef.current) clearTimeout(snowmanTimerRef.current);
    };
  }, []);

  // 제설차가 눈사람에 닿으면 사라지게
  useEffect(() => {
    if (isPlowing && plowProgress >= 85 && showSnowman) {
      setShowSnowman(false);
    }
  }, [isPlowing, plowProgress, showSnowman]);

  // Start plowing animation
  const startPlow = () => {
    if (isPlowing || isSnowCleared) return;

    setIsPlowing(true);
    setPlowId(Date.now());
    setPlowProgress(0);

    if (snowmanTimerRef.current) clearTimeout(snowmanTimerRef.current);

    const duration = 2500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPlowProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(animate);
      } else {
        setIsPlowing(false);
        setIsSnowCleared(true);
        setAccumulation(0);

        setTimeout(() => {
          setIsSnowCleared(false);
          snowmanTimerRef.current = setTimeout(() => {
            setShowSnowman(true);
          }, 10000);
        }, 1000);
      }
    };

    requestAnimationFrame(animate);
  };

  const resetSnow = () => {
    setIsSnowCleared(false);
    setPlowProgress(0);
    setAccumulation(0);
  };

  // Accumulate snow
  useEffect(() => {
    if (isPlowing || isSnowCleared) return;

    const interval = setInterval(() => {
      setAccumulation(prev => {
        if (prev >= 100) return 100;
        return prev + (prev < 50 ? 1.0 : 0.5);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlowing, isSnowCleared]);

  const value = {
    isPlowing,
    isSnowCleared,
    plowProgress,
    startPlow,
    resetSnow,
    accumulation,
    showSnowman,
    plowId,
    activeCursor,
    setActiveCursor,
  };

  return (
    <SnowPlowContext.Provider value={value}>
      {children}
    </SnowPlowContext.Provider>
  );
};

// ============================================
// Snow Plow Button (Larger, positioned near search bar)
// ============================================
export const SnowPlowButton = ({ className = "" }) => {
  const context = useSnowPlow();
  const { theme } = useThemeStore();
  const [isShaking, setIsShaking] = useState(false);

  if (theme !== 'christmas') return null;

  // 눈이 쌓이면 버튼 흔들기 힌트
  useEffect(() => {
    if (!context || context.accumulation < 80) return;

    const timer = setTimeout(() => {
      if (!context.isPlowing && context.accumulation >= 80) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 3000);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [context?.accumulation, context?.isPlowing]);

  if (!context) return null;

  const { isPlowing, isSnowCleared, startPlow } = context;

  return (
    <div className={`${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isShaking ? {
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.5, repeat: 5 }
        } : {}}
        onClick={(e) => {
          e.stopPropagation();
          if (!isSnowCleared && !isPlowing) {
            startPlow();
          }
        }}
        disabled={isPlowing || isSnowCleared}
        className={`p-2 rounded-full shadow-xl transition-all duration-300 ${isPlowing
          ? "bg-orange-500 text-white animate-pulse"
          : isSnowCleared
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:border-orange-300"
          }`}
        title={isSnowCleared ? "눈이 치워졌어요!" : isPlowing ? "제설 중..." : "눈 치우기"}
      >
        {isSnowCleared ? (
          <span className="text-xl">✨</span>
        ) : (
          <img
            src="/snowplow.png"
            alt="Snow Plow"
            className="w-7 h-7 object-contain"
          />
        )}
      </motion.button>
    </div>
  );
};

// ============================================
// Falling Snow Chunk Component
// ============================================
const FallingSnowChunk = ({ delay, startX, size, zIndex }) => {
  const randomX = useMemo(() => (Math.random() - 0.5) * 60, []);
  const randomRotate = useMemo(() => Math.random() * 360, []);

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        left: startX,
        top: 0,
        zIndex: zIndex,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{
        y: [0, 150, 300, 450],
        opacity: [1, 1, 0.8, 0],
        scale: [1, 0.95, 0.9, 0.5],
        x: [0, randomX * 0.5, randomX, randomX * 1.5],
        rotate: [0, randomRotate * 0.5, randomRotate],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        ease: "easeIn",
      }}
    />
  );
};

// ============================================
// Pushed Snow Mound
// ============================================
const PushedSnowMound = ({ progress }) => {
  if (progress < 5 || progress > 95) return null;

  return (
    <div
      className="absolute bottom-0 z-40 pointer-events-none"
      style={{
        left: `calc(${progress}% + 40px)`,
        transform: "translateX(-50%)",
        width: "60px",
        height: "40px",
      }}
    >
      <motion.div
        className="w-full h-full relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="absolute bottom-0 left-0 w-10 h-10 bg-white rounded-full blur-[2px]" />
        <div className="absolute bottom-0 left-4 w-8 h-8 bg-gray-100 rounded-full blur-[1px]" />
        <div className="absolute bottom-2 left-2 w-6 h-6 bg-white rounded-full" />
        <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-ping" />
      </motion.div>
    </div>
  );
};

// ============================================
// Easter Egg Components
// ============================================

// 1. Flying Santa Sleigh
const SantaSleigh = () => {
  return (
    <motion.div
      className="fixed top-1/4 left-[-300px] z-[100] pointer-events-none"
      animate={{
        x: ["0vw", "120vw"],
        y: [0, -50, 50, -20],
      }}
      transition={{
        duration: 5,
        ease: "linear",
      }}
    >
      <div className="relative">
        <img
          src="/santa.png"
          alt="Santa Sleigh"
          className="w-[300px] h-auto filter drop-shadow-2xl"
        />
        <motion.div
          className="absolute top-1/2 left-0 w-full h-4 bg-white opacity-20 blur-xl"
          style={{ transform: "translateY(-50%) scaleX(2)" }}
        />
      </div>
    </motion.div>
  );
};

// 3. Falling Gift
const FallingGift = ({ id, rightPos, onComplete }) => {
  return (
    <motion.div
      layoutId={id}
      className="absolute z-50 text-4xl cursor-pointer select-none pointer-events-auto"
      style={{ right: rightPos, bottom: "80px" }}
      initial={{ y: 0, opacity: 1, scale: 0 }}
      animate={{
        y: [0, -50, 150],
        x: [0, -20, -50],
        rotate: [0, -20, 20, 45],
        scale: 1,
        opacity: [1, 1, 0]
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
      onClick={(e) => {
        e.stopPropagation();
        alert("🎁 메리 크리스마스! 🎁");
      }}
    >
      🎁
    </motion.div>
  );
};

// ============================================
// Decorations & Logic
// ============================================
const ChristmasDecorations = () => {
  const { activeCursor } = useSnowPlow();

  const [gifts, setGifts] = useState([]);
  const [treeShake, setTreeShake] = useState(false);
  const [snowmanShake, setSnowmanShake] = useState(false);

  const [showSanta, setShowSanta] = useState(false);
  const inputBuffer = useRef([]);

  // Keyboard Listener (Konami Code Only)
  useEffect(() => {
    const konamiSeq = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

    const handler = (e) => {
      // Skip if composing (IME active) or focused on input
      if (e.isComposing) return;
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      if (isInputFocused) return;

      const normalizedCode = e.code.replace('Key', '').toLowerCase();

      inputBuffer.current = [...inputBuffer.current, normalizedCode].slice(-20);
      const buffer = inputBuffer.current;

      // Check Konami
      if (buffer.length >= 10) {
        const last10 = buffer.slice(-10);
        if (JSON.stringify(last10) === JSON.stringify(konamiSeq)) {
          setShowSanta(true);
          setTimeout(() => setShowSanta(false), 6000);
          inputBuffer.current = [];
          console.log("🎅 Santa Sleigh Activated!");
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleTreeClick = () => {
    if (activeCursor !== 'santa') return;
    setTreeShake(true);
    setTimeout(() => setTreeShake(false), 500);
    const newGift = { id: Date.now(), right: "40px" };
    setGifts(prev => [...prev, newGift]);
  };

  const handleSnowmanClick = () => {
    if (activeCursor !== 'santa') return;
    setSnowmanShake(true);
    setTimeout(() => setSnowmanShake(false), 500);
    const newGift = { id: Date.now(), right: "140px" };
    setGifts(prev => [...prev, newGift]);
  };

  return (
    <>
      <div
        className="absolute z-30 flex items-end"
        style={{
          right: "-10px",
          bottom: "-5px",
        }}
      >
        <motion.img
          src="/snowman.png"
          alt="Snowman"
          className={`w-13 h-auto drop-shadow-lg select-none relative z-40 mr-2 transition-transform pointer-events-auto ${activeCursor === 'santa' ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          initial={{ scale: 0.9 }}
          animate={snowmanShake ? {
            scale: [0.9, 0.95, 0.9],
            rotate: [-10, 10, -10, 10, 0]
          } : {
            scale: 0.9,
            rotate: 0
          }}
          transition={{ duration: snowmanShake ? 0.4 : 0 }}
          onClick={handleSnowmanClick}
        />

        <motion.img
          src="/christmas-tree.png"
          alt="Christmas Tree"
          className={`w-12 h-auto drop-shadow-lg select-none relative z-30 transition-all pointer-events-auto ${activeCursor === 'santa' ? 'cursor-pointer hover:scale-110 hover:sepia-[.3]' : 'cursor-default'}`}
          animate={treeShake ? { x: [-2, 2, -2, 2, 0], rotate: [-5, 5, -5, 5, 0] } : { scale: [1, 1.02, 1] }}
          transition={{ duration: treeShake ? 0.4 : 3, repeat: treeShake ? 1 : Infinity }}
          onClick={handleTreeClick}
        />

        <AnimatePresence>
          {gifts.map(g => (
            <FallingGift
              key={g.id}
              id={g.id}
              rightPos={g.right}
              onComplete={() => setGifts(prev => prev.filter(i => i.id !== g.id))}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSanta && <SantaSleigh />}
      </AnimatePresence>
    </>
  );
};

// ============================================
// Snow Pile with Plow Animation
// ============================================
export const ClearableSnowPile = () => {
  const context = useSnowPlow();
  const { theme } = useThemeStore();
  const containerRef = useRef(null);
  const [fallingChunks, setFallingChunks] = useState([]);

  if (theme !== 'christmas') return null;

  const { isPlowing, isSnowCleared, plowProgress, accumulation, plowId } = context;

  useEffect(() => {
    if (!context?.isPlowing) {
      setFallingChunks([]);
      return;
    }

    const intervalTime = 60;

    const interval = setInterval(() => {
      if (context.plowProgress < 100) {
        const newChunks = Array.from({ length: 3 }, (_, i) => ({
          id: Date.now() + i,
          startX: `${context.plowProgress + (Math.random() - 0.5) * 5}%`,
          size: 8 + Math.random() * 12,
          delay: Math.random() * 0.1,
          zIndex: Math.random() > 0.5 ? 25 : 5,
        }));
        setFallingChunks(prev => [...prev.slice(-40), ...newChunks]);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [context?.isPlowing, context?.plowProgress]);

  if (!context) return null;

  return (
    <div
      ref={containerRef}
      className="absolute -top-10 left-0 right-0 h-14 pointer-events-none overflow-visible"
    >
      <ChristmasDecorations />

      <AnimatePresence>
        {isPlowing && (
          <motion.div
            key={plowId}
            className="absolute z-50 pointer-events-auto cursor-pointer"
            initial={{ left: "-120px", opacity: 1 }}
            animate={{ left: "calc(100% - 60px)", opacity: [1, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "linear", opacity: { duration: 2.5, times: [0, 0.85, 0.95, 1] } }}
            style={{ top: "-2px" }}
          >
            <motion.div
              className="relative"
              style={{ transform: "scaleX(-1)" }}
              animate={{
                y: [0, -3, 0, -2, 0],
                rotate: [0, 2, 0, -2, 0]
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src="/snowplow.png"
                alt="Snow Plow"
                className="w-24 h-24 object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isPlowing && <PushedSnowMound progress={plowProgress} />}

      <div className="absolute top-10 left-0 right-0 h-[400px] overflow-visible z-50 pointer-events-none">
        <AnimatePresence>
          {fallingChunks.map((chunk) => (
            <FallingSnowChunk
              key={chunk.id}
              startX={chunk.startX}
              size={chunk.size}
              delay={chunk.delay}
              zIndex={chunk.zIndex}
            />
          ))}
        </AnimatePresence>
      </div>

      <SnowLayer
        zIndex={5}
        isPlowing={isPlowing}
        isSnowCleared={isSnowCleared}
        plowProgress={plowProgress}
        opacity={0.9}
        offsetY={4}
        seed={123}
        accumulation={accumulation}
      />

      <SnowLayer
        zIndex={20}
        isPlowing={isPlowing}
        isSnowCleared={isSnowCleared}
        plowProgress={plowProgress}
        opacity={1}
        offsetY={0}
        seed={456}
        accumulation={accumulation}
      />

    </div>
  );
};

// Internal Snow Layer Component
const SnowLayer = ({ zIndex, isPlowing, isSnowCleared, plowProgress, accumulation, opacity, offsetY, seed }) => {
  const bumps = useMemo(() => {
    const arr = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const x = (i / count) * 100 + (Math.sin(i * seed) * 5);
      const size = 10 + Math.abs(Math.cos(i * seed)) * 15;
      const y = Math.abs(Math.sin(i * 99)) * 10;
      arr.push({ x, size, y });
    }
    return arr;
  }, [seed]);

  const currentHeightPercent = Math.max(accumulation, 10);

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 overflow-visible"
      style={{
        height: "4rem",
        zIndex: zIndex,
        bottom: -offsetY,
        clipPath: isPlowing
          ? `inset(0 0 0 ${plowProgress}%)`
          : isSnowCleared
            ? "inset(0 0 0 100%)"
            : "inset(0 0 0 0)",
        transformOrigin: "bottom",
        scaleY: currentHeightPercent / 100,
        opacity: isSnowCleared ? 0 : opacity * (Math.min(accumulation + 20, 100) / 100),
      }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-xl"
        style={{
          clipPath: "polygon(0% 100%, 5% 40%, 12% 65%, 20% 30%, 28% 55%, 35% 25%, 45% 40%, 55% 20%, 65% 50%, 75% 30%, 85% 60%, 95% 35%, 100% 100%)",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
        }}
      />
      {bumps.map((b, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full shadow-sm"
          style={{
            left: `${b.x}%`,
            bottom: b.y - 5,
            width: b.size,
            height: b.size,
            opacity: 0.95
          }}
        />
      ))}
    </motion.div>
  );
};

export default SnowPlowProvider;
