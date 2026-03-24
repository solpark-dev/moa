import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const infoCardThemeStyles = {
  pop: {
    cardBg: "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    headerBorder: "border-b border-black",
    titleText: "text-gray-900",
    labelText: "text-gray-700",
    valueText: "text-slate-900",
  },
  christmas: {
    cardBg: "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    headerBorder: "border-b border-gray-200",
    titleText: "text-gray-900",
    labelText: "text-gray-700",
    valueText: "text-slate-900",
  },
  dark: {
    cardBg: "bg-[#1E293B] border border-gray-700 shadow-lg",
    headerBorder: "border-b border-gray-700",
    titleText: "text-gray-200",
    labelText: "text-gray-400",
    valueText: "text-gray-200",
  },
  classic: {
    cardBg: "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    headerBorder: "border-b border-gray-200",
    titleText: "text-gray-900",
    labelText: "text-gray-700",
    valueText: "text-slate-900",
  },
};

export function InfoCard({ title, icon, children }) {
  const { theme } = useThemeStore();
  const themeStyle = infoCardThemeStyles[theme] || infoCardThemeStyles.pop;

  return (
    <Card className={`${themeStyle.cardBg} h-full rounded-3xl`}>
      <CardHeader className={`pb-4 px-6 pt-6 ${themeStyle.headerBorder}`}>
        <CardTitle className={`text-sm font-bold ${themeStyle.titleText} flex items-center gap-2`}>
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">{children}</CardContent>
    </Card>
  );
}

export function InfoRow({ label, value, valueClass }) {
  const { theme } = useThemeStore();
  const themeStyle = infoCardThemeStyles[theme] || infoCardThemeStyles.pop;
  const finalValueClass = valueClass || themeStyle.valueText;

  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className={`text-xs md:text-sm font-medium ${themeStyle.labelText} whitespace-nowrap w-20`}>
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${finalValueClass} min-w-0 truncate`}
      >
        {value}
      </span>
    </div>
  );
}
