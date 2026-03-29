import { useEffect } from "react";
import { useMainStore } from "@/store/main/mainStore";
import MainHeroSection from "./sections/MainHeroSection";
import MainPartySection from "./sections/MainPartySection";
import MainProductsSection from "./sections/MainProductsSection";
import MainFeaturesSection from "./sections/MainFeaturesSection";

export default function MainPage() {
  const loadMain = useMainStore((s) => s.loadMain);
  const error    = useMainStore((s) => s.error);

  useEffect(() => {
    loadMain();
  }, [loadMain]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-5">
        <div
          className="w-full rounded-2xl p-6 text-sm font-medium text-center"
          style={{
            background: "var(--glass-bg-card)",
            border: "1px solid var(--glass-border)",
            color: "var(--theme-text-muted)",
          }}
        >
          데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--theme-bg)" }}>
      <MainHeroSection />
      <MainPartySection />
      <MainProductsSection />
      <MainFeaturesSection />
    </div>
  );
}
