type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: InputProps) {
  return (
    <input
      className="pm-field"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "14px",
        border: "1px solid rgba(95,40,134,0.18)",
        fontSize: "16px",
        background: "#fffdf8",
        color: "#2b2430",
      }}
    />
  );
}
