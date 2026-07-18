import { bodyTextStyle } from "@/lib/theme";
import Card from "@/components/Card";
import SectionTitle from "@/components/SectionTitle";

type ReflectionCardProps = {
  reflection: string;
};

export default function ReflectionCard({
  reflection,
}: ReflectionCardProps) {
  return (
<Card background="linear-gradient(145deg, #fffaf0, #f8f2fb)">
<SectionTitle>
  오늘의 묵상
</SectionTitle>

      <p style={bodyTextStyle}>
        {reflection || "오늘의 묵상이 아직 등록되지 않았습니다."}
      </p>
    </Card>
  );
}
