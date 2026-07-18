import { cardStyle } from "@/lib/theme";

type CardProps = {
  children: React.ReactNode;
  marginTop?: string;
  background?: string;
};

export default function Card({
  children,
  marginTop = "20px",
  background,
}: CardProps) {
  return (
    <section
      style={{
        ...cardStyle,
        marginTop,
        ...(background
          ? { background }
          : {}),
      }}
    >
      {children}
    </section>
  );
}