import { useParams } from "react-router-dom";
import { useAdminLoginHistory } from "@/hooks/admin/useAdminLoginHistory";
import AdminLoginHistoryCard from "./components/AdminLoginHistoryCard";

export default function AdminLoginHistoryPage() {
  const { userId } = useParams();
  const loginHistory = useAdminLoginHistory(userId);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans">
      <section className="relative overflow-hidden px-4 py-12">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col gap-10">
            <div className="bg-white/80 border border-gray-200/20 rounded-[36px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.08)] p-8">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">
                로그인 기록
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900">
                유저 로그인 히스토리
              </h1>
            </div>
            <div className="relative bg-white border border-gray-200/70 rounded-[34px] shadow-[4px_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="px-8 py-10">
                <AdminLoginHistoryCard loginHistory={loginHistory} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
