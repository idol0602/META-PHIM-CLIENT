export default function ControlButton({
  children,
  onClick,
  color = "white",
  active = false,
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full w-8 h-8 text-white transition-colors"
      style={{
        backgroundColor: active ? `rgba(234, 200, 114, 0.2)` : "transparent",
        color: color,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(234, 200, 114, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = active
          ? "rgba(234, 200, 114, 0.2)"
          : "transparent";
      }}
    >
      {children}
    </button>
  );
}
