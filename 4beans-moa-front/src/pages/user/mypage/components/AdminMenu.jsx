import { ShieldCheck, User, UserX, LayoutDashboard, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminMenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-3.5 transition-opacity active:opacity-70"
      style={{ borderBottom: "1px solid var(--glass-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: danger ? "rgba(239,68,68,0.1)" : "var(--glass-bg-overlay)" }}
        >
          <Icon className="w-4 h-4" style={{ color: danger ? "#ef4444" : "var(--theme-primary)" }} />
        </div>
        <span
          className="text-[14px] font-semibold"
          style={{ color: danger ? "#ef4444" : "var(--theme-text)" }}
        >
          {label}
        </span>
      </div>
      <ChevronRight className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
    </button>
  );
}

export function AdminMenu({ actions }) {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--glass-bg-card)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-glass)",
      }}
    >
      <div className="px-5 pt-4 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5"
          style={{ color: "var(--theme-text-muted)" }}>
          <ShieldCheck className="w-3.5 h-3.5" />
          Admin Zone
        </p>
      </div>
      <AdminMenuItem icon={LayoutDashboard} label="관리자 홈" onClick={() => navigate("/admin/dashboard")} />
      <AdminMenuItem icon={User} label="회원 관리" onClick={() => navigate("/admin/users")} />
      <AdminMenuItem icon={UserX} label="블랙리스트 관리" onClick={() => navigate("/admin/blacklist/add")} danger />
    </div>
  );
}
