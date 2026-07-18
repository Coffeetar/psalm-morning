type TextAreaProps = {
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  minHeight?: string;
};

export default function TextArea({
  value,
  onChange,
  placeholder,
  minHeight = "120px",
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
      style={{
        width: "100%",
        minHeight,
        padding: "16px",
        borderRadius: "18px",
        border: "1px solid #d6d3d1",
        fontSize: "16px",
        lineHeight: 1.6,
        resize: "vertical",
      }}
    />
  );
}