export default function InfoRow({
  label,
  value,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className={`text-sm font-black ${valueClass}`}>{value}</span>
    </div>
  );
}
