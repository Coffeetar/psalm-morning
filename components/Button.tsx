type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "dark";
  fullWidth?: boolean;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  const background =
    variant === "primary"
      ? "#2563eb"
      : variant === "secondary"
      ? "#b45309"
      : variant === "danger"
      ? "#b91c1c"
      : "#292524";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "14px 20px",
        borderRadius: "16px",
        border: "none",
        background,
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
        fontSize: "15px",
        fontWeight: "bold",
      }}
    >
      {children}
    </button>
  );
}
