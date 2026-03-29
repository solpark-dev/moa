import { motion } from "framer-motion";

const STATS = [
  { value: "75%", label: "구독료 절감" },
  { value: "1분",  label: "파티 참여"  },
  { value: "자동", label: "정산 처리"  },
];

export default function MainFeaturesSection() {
  return (
    <section style={{ borderTop: "1px solid var(--glass-border)" }}>
      <div className="flex">
        {STATS.map(({ value, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center py-7"
            style={i < STATS.length - 1 ? { borderRight: "1px solid var(--glass-border)" } : {}}
          >
            <span
              className="price text-[27px] font-black leading-none mb-1.5"
              style={{ color: "var(--theme-primary)" }}
            >
              {value}
            </span>
            <span
              className="text-[12px] font-medium"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
