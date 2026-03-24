import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Theme Store with localStorage persistence
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current theme: 'classic' | 'dark' | 'pop' | 'christmas'
      // 기본 테마는 pop
      theme: "pop",

      // Set theme
      setTheme: (theme) => {
        set({ theme });
        // Also update legacy localStorage key for backward compatibility
        localStorage.setItem("partyListTheme", theme);
      },

      // Get current theme
      getTheme: () => get().theme,

      // Cycle through themes
      cycleTheme: () => {
        const themes = ["classic", "dark", "pop", "christmas"];
        const currentIndex = themes.indexOf(get().theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        get().setTheme(themes[nextIndex]);
      },
    }),
    {
      name: "app-theme-storage",
      storage: createJSONStorage(() => localStorage),
      // 저장된 테마 유지 (강제 변경 제거)
    }
  )
);
