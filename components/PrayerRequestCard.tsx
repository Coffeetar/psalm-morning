import { cardStyle } from "@/lib/theme";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import TextArea from "@/components/TextArea";

type PrayerRequestCardProps = {
  prayerRequest: string;
  setPrayerRequest: (value: string) => void;
  handlePrayerSubmit: () => void;
  isSubmitting: boolean;
};

export default function PrayerRequestCard({
  prayerRequest,
  setPrayerRequest,
  handlePrayerSubmit,
  isSubmitting,
}: PrayerRequestCardProps) {
  return (
    <section
      style={{
        ...cardStyle,
        marginTop: "24px",
      }}
    >
<SectionTitle>
  기도 제목 남기기
</SectionTitle>

      <p
        style={{
          color: "#78716c",
          lineHeight: 1.6,
          marginBottom: "16px",
        }}
      >
        오늘 아침 마음에 남은 기도 제목을 조용히 남겨주세요.
      </p>

    <TextArea
  value={prayerRequest}
  onChange={setPrayerRequest}
  placeholder="함께 기도하기 원하는 제목을 남겨주세요."
  minHeight="120px"
/>

<Button
  onClick={handlePrayerSubmit}
  variant="dark"
  fullWidth
  disabled={isSubmitting}
>
  {isSubmitting ? "보내는 중..." : "기도 제목 보내기"}
</Button>
    </section>
  );
}
