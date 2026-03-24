import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OutlineCard from "./OutlineCard";

export default function InfoCard({ title, icon, children }) {
  return (
    <OutlineCard>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-black tracking-[0.18em] text-slate-900 flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-6 space-y-4">{children}</CardContent>
    </OutlineCard>
  );
}
