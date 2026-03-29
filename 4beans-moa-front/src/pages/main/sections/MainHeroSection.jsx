import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, BookOpen } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 py-4 rounded-2xl flex-1"
      style={{
        background: "var(--glass-bg-card)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-glass)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "var(--theme-primary-light)" }}
      >
        <Icon className="w-5 h-5" style={{ color: "var(--theme-primary)" }} strokeWidth={2} />
      </div>
      <span className="text-[12px] font-semibold" style={{ color: "var(--theme-text)" }}>
        {label}
      </span>
    </motion.button>
  );
}

export default function MainHeroSection() {
  const navigate   = useNavigate();
  const { user }   = useAuthStore();
  const firstName  = user?.nickname?.split(" ")[0];

  return (
    <section>
      {/* ── Hero ── */}
      <div className="px-5 pt-10 pb-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[13px] font-medium mb-3"
          style={{ color: "var(--theme-text-muted)" }}
        >
          {user ? `${firstName}님, 환영해요` : "구독 공유 플랫폼 MOA"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="font-black leading-[1.18] mb-3"
          style={{
            fontSize: "30px",
            color: "var(--theme-text)",
            letterSpacing: "-0.03em",
          }}
        >
          구독비를 함께<br />절약하세요
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-[15px] mb-7"
          style={{ color: "var(--theme-text-muted)" }}
        >
          파티를 나눠 최대{" "}
          <span className="font-bold" style={{ color: "var(--theme-primary)" }}>75%</span>{" "}
          아낄 수 있어요
        </motion.p>

        {/* Primary CTA */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/party")}
          className="w-full rounded-2xl font-bold text-[16px] text-white"
          style={{
            background: "var(--theme-primary)",
            height: "52px",
          }}
        >
          파티 참여하기
        </motion.button>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.35 }}
        className="px-5 pb-8 flex gap-3"
      >
        <QuickAction icon={Search} label="파티 찾기"    onClick={() => navigate("/party")} />
        <QuickAction icon={Plus}   label="파티 만들기"  onClick={() => navigate(user ? "/party/create" : "/login")} />
        <QuickAction icon={BookOpen} label="내 구독"   onClick={() => navigate(user ? "/my/subscriptions" : "/login")} />
      </motion.div>
    </section>
  );
}
