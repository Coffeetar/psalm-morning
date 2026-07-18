import { bodyTextStyle } from "@/lib/theme";
import Card from "@/components/Card";
import SectionTitle from "@/components/SectionTitle";

type MorningPrayerCardProps = {
  prayer: string;
};

export default function MorningPrayerCard({
  prayer,
}: MorningPrayerCardProps) {
  return (
<Card background="#f0f9ff">
<SectionTitle>
  Morning Prayer
</SectionTitle>

      <p style={bodyTextStyle}>
        {prayer ||
          "오늘의 기도문이 아직 등록되지 않았습니다."}
      </p>
    </Card>
  );
}