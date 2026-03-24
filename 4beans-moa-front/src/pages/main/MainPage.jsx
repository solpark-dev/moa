import { useEffect } from "react";
import { useMainStore } from "@/store/main/mainStore";
import { useThemeStore } from "@/store/themeStore";

import MainHeroSection from "./sections/MainHeroSection";
import MainFeaturesSection from "./sections/MainFeaturesSection";
import MainProductsSection from "./sections/MainProductsSection";
import MainHowItWorksSection from "./sections/MainHowItWorksSection";
import MainMarqueeSection from "./sections/MainMarqueeSection";
import MainStatementSection from "./sections/MainStatementSection";
import MainComparisonSection from "./sections/MainComparisonSection";
import MainStatsMarquee from "./sections/MainStatsMarquee";
import MainSearchSection from "./sections/MainSearchSection";

export default function MainPage() {
  const loadMain = useMainStore((s) => s.loadMain);
  const products = useMainStore((s) => s.products);
  const parties = useMainStore((s) => s.parties);
  const stats = useMainStore((s) => s.stats);
  const error = useMainStore((s) => s.error);
  const { theme } = useThemeStore();

  useEffect(() => {
    loadMain();
  }, [loadMain]);

  /* =========================
   * ERROR VIEW
   * ========================= */
  if (error) {
    return (
      <div className="relative min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div
            className={`${theme === "dark"
                ? "bg-[#1E293B] border-gray-700 text-white"
                : "bg-white border-gray-200 text-black"
              } border rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] p-6 font-black`}
          >
            {error}
          </div>
        </div>

        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>
    );
  }

  /* =========================
   * MAIN VIEW
   * ========================= */
  return (
    <div className={`min-h-screen -mt-[5rem] pt-[5rem] relative ${theme === "dark" ? "bg-[#0B1120]" : "bg-transparent"}`}>
      <MainHeroSection
        products={products}
        parties={parties}
        stats={stats}
      />

      <MainMarqueeSection />
      <MainStatementSection />
      <MainComparisonSection />
      <MainStatsMarquee />
      <MainFeaturesSection stats={stats} />
      <MainProductsSection />
      <MainHowItWorksSection />

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}
