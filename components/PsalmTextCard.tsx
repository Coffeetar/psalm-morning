import { cardStyle } from "@/lib/theme";
import SectionTitle from "@/components/SectionTitle";

type PsalmTextCardProps = {
  psalmReference: string;
  psalmText: string;
};

export default function PsalmTextCard({
  psalmReference,
  psalmText,
}: PsalmTextCardProps) {
  return (
    <>
      <h2
        style={{
          textAlign: "center",
          fontSize: "30px",
          marginBottom: "24px",
        }}
      >
        {psalmReference}
      </h2>

      <div
        style={{
          ...cardStyle,
          marginTop: "24px",
          lineHeight: 1.9,
          fontSize: "18px",
          whiteSpace: "pre-line",
        }}
      >
        <SectionTitle>오늘의 말씀</SectionTitle>

        <p style={{ margin: "18px 0 0" }}>“{psalmText || ""}”</p>
      </div>
    </>
  );
}
