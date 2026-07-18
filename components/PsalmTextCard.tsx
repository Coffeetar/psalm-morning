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

<div style={{ marginTop: "24px" }}>
  <SectionTitle>
    Psalm Text
  </SectionTitle>
</div>

      <div
        style={{
          ...cardStyle,
          marginTop: "20px",
          lineHeight: 1.9,
          fontSize: "18px",
          whiteSpace: "pre-line",
        }}
      >
        “{psalmText || ""}”
      </div>
    </>
  );
}