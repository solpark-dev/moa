export function InfoRow({ label, value, valueClass }) {
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: "1px solid var(--glass-border)" }}>
      <span
        className="text-[12px] font-medium whitespace-nowrap w-20 flex-shrink-0"
        style={{ color: "var(--theme-text-muted)" }}
      >
        {label}
      </span>
      <span
        className={`text-[13px] font-semibold min-w-0 truncate ${valueClass || ""}`}
        style={!valueClass ? { color: "var(--theme-text)" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
