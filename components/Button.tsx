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
      ? "#5f2886"
      : variant === "secondary"
      ? "#7b42a0"
      : variant === "danger"
      ? "#b91c1c"
      : "#45205f";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "14px 20px",
        borderRadius: "14px",
        border: "none",
        background,
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
        fontSize: "15px",
        fontWeight: "bold",
        boxShadow:
          variant === "danger"
            ? "none"
            : "0 8px 18px rgba(95,40,134,0.16)",
      }}
    >
      {children}
    </button>
  );
}
