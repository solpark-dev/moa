export default function UserListBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
        backgroundSize: "20px 20px",
      }}
    />
  );
}
