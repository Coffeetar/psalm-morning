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
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "14px",
        border: "1px solid #d6d3d1",
        fontSize: "16px",
        background: "rgba(255,255,255,0.9)",
      }}
    />
  );
}