import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";

// Helper to encode SVG for data URI
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

export default function CursorSelector({ activeCursor, setActiveCursor }) {
    const { theme } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);

    // Reset cursor when theme changes away from Christmas
    useEffect(() => {
        if (theme !== 'christmas') {
            setActiveCursor("default");
            setIsOpen(false);
        }
    }, [theme, setActiveCursor]);

    // Apply cursor to body
    useEffect(() => {
        // If not christmas, force default
        if (theme !== 'christmas') {
            // Cleanup logic if needed, essentially setting to auto
            const styleId = "custom-cursor-style";
            const styleTag = document.getElementById(styleId);
            if (styleTag) styleTag.innerHTML = ``;
            document.body.style.cursor = 'auto';
            return;
        }

        const option = cursorOptions.find(o => o.id === activeCursor);
        if (option) {
            document.body.style.cursor = option.css;

            const styleId = "custom-cursor-style";
            let styleTag = document.getElementById(styleId);
            if (!styleTag) {
                styleTag = document.createElement("style");
                styleTag.id = styleId;
                document.head.appendChild(styleTag);
            }

            if (activeCursor === 'default') {
                styleTag.innerHTML = ``;
            } else {
                // Aggressive CSS to persist cursor on hover
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
            
            /* Restore text cursor for inputs */
            input, textarea, [contenteditable] {
                cursor: text !important;
            }
            
            /* Restore disabled */
            button:disabled, input:disabled {
                cursor: not-allowed !important;
            }
          `;
            }
        }
    }, [activeCursor, theme]);

    if (theme !== 'christmas') return null;

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-white text-gray-700 border border-gray-200 rounded-full shadow-xl hover:bg-gray-50 transition-colors"
                title="커서 변경"
            >
                <span className="text-xl">{cursorOptions.find(o => o.id === activeCursor)?.icon || <MousePointer2 className="w-5 h-5" />}</span>
            </motion.button>

            {/* Radial Menu Options (Quarter Circle: Top to Right) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Icons */}
                        {cursorOptions.map((option, index) => {
                            // Radial layout: -90deg (Top) to 0deg (Right)
                            // We have 5 items. 
                            // Angles: -90, -67.5, -45, -22.5, 0 (approx distributed)

                            const radius = 70; // Distance from center
                            const totalAngle = 90; // 90 degree span (quarter circle)

                            // Start from -90 (Top)
                            // But we probably want to center it a bit?
                            // Let's do -100 to 10? Or just -90 to 0.
                            const startAngle = -90;
                            const endAngle = 10;
                            const step = (endAngle - startAngle) / (cursorOptions.length - 1);

                            const angleDeg = startAngle + (index * step);
                            const angleRad = (angleDeg * Math.PI) / 180;

                            const x = Math.cos(angleRad) * radius;
                            const y = Math.sin(angleRad) * radius;

                            const isActive = activeCursor === option.id;

                            return (
                                <motion.button
                                    key={option.id}
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    animate={{ opacity: 1, scale: 1, x, y }}
                                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    transition={{ duration: 0.3, type: "spring", delay: index * 0.05 }}
                                    onClick={() => {
                                        setActiveCursor(option.id);
                                        setIsOpen(false);
                                    }}
                                    className={`absolute top-0 left-0 w-10 h-10 -ml-1 -mt-1 rounded-full flex items-center justify-center shadow-md z-50 border-2 transition-colors ${isActive ? "bg-red-100 border-red-500" : "bg-white border-white hover:bg-gray-100"
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
}
