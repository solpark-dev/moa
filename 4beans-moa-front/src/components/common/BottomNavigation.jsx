import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Layers, CircleUser } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { label: "홈",   icon: Home,       path: "/",                exact: true  },
  { label: "파티", icon: Users,      path: "/party",           exact: false },
  { label: "구독", icon: Layers,     path: "/my/subscriptions",exact: false },
  { label: "마이", icon: CircleUser, path: "/mypage",          exact: false },
];

function isActive(tab, pathname) {
  if (tab.exact) return pathname === tab.path;
  return pathname === tab.path || pathname.startsWith(tab.path + "/");
}

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="fixed bottom-0 z-50 w-full max-w-[390px] h-16"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        borderTop: "1px solid var(--glass-border)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center h-full">
        {TABS.map((tab) => {
          const active = isActive(tab, location.pathname);
          const Icon = tab.icon;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative transition-opacity active:opacity-60"
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
            >
              {/* Top indicator line */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute top-0 w-8 h-0.5 rounded-full"
                    style={{ background: "var(--theme-primary)" }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={{ scale: active ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: active ? "var(--theme-primary)" : "var(--theme-text-muted)",
                  }}
                  strokeWidth={active ? 2.5 : 2}
                />
              </motion.div>

              <span
                className="text-[10px] font-medium"
                style={{
                  color: active ? "var(--theme-primary)" : "var(--theme-text-muted)",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
