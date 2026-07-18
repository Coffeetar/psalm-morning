type SectionTitleProps = {
  children: React.ReactNode;
};

export default function SectionTitle({
  children,
}: SectionTitleProps) {
  return (
    <h3
      style={{
        marginTop: 0,
        marginBottom: "14px",
        fontSize: "22px",
        fontWeight: 700,
        color: "#292524",
      }}
    >
      {children}
    </h3>
  );
}