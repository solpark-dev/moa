export default function Sticker({
  children,
  color = "bg-white",
  className = "",
}) {
  return (
    <div
      className={`${color} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
