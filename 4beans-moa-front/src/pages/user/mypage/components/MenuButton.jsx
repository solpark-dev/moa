import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const menuButtonThemeStyles = {
  light: {
    activeBg: "bg-[#635bff]",
    activeBorder: "border-gray-200",
    activeShadow: "shadow-[4px_4px_12px_rgba(99,91,255,0.2)]",
    inactiveBorder: "border-gray-200",
    inactiveShadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    destructiveBorder: "border-gray-200",
    indicatorBg: "bg-[#635bff]",
  },
  dark: {
    activeBg: "bg-[#635bff]",
    activeBorder: "border-gray-600",
    activeShadow: "shadow-[4px_4px_12px_rgba(99,91,255,0.3)]",
    inactiveBorder: "border-gray-600",
    inactiveShadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.3)]",
    destructiveBorder: "border-gray-600",
    indicatorBg: "bg-[#635bff]",
  },
};

export function MenuButton({
  icon,
  label,
  onClick,
  variant = "default",
  active = false,
}) {
  const { theme } = useThemeStore();
  const themeStyle = menuButtonThemeStyles[theme] || menuButtonThemeStyles.light;
  const isDestructive = variant === "destructive";

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`
        w-full justify-start h-12 px-4 text-sm font-bold rounded-xl
        border-2 transition-all duration-200
        ${active
          ? `${themeStyle.activeBg} text-white ${themeStyle.activeBorder} ${themeStyle.activeShadow}`
          : `bg-white text-slate-800 ${themeStyle.inactiveBorder} hover:bg-gray-50 ${themeStyle.inactiveShadow}`
        }
        ${isDestructive
          ? `text-red-600 hover:bg-red-50 ${themeStyle.destructiveBorder}`
          : ""
        }
      `}
    >
      <span className="mr-3 opacity-80">{icon}</span>
      {label}
      {active && (
        <div className={`ml-auto w-1.5 h-1.5 rounded-full ${themeStyle.indicatorBg}`} />
      )}
    </Button>
  );
}
