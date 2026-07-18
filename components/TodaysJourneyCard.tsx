import { cardStyle } from "@/lib/theme";
type TodaysJourneyCardProps = {
  hasPsalm: boolean;
  hasReflection: boolean;
  hasPrayerRequest: boolean;
};

export default function TodaysJourneyCard({
  hasPsalm,
  hasReflection,
  hasPrayerRequest,
}: TodaysJourneyCardProps) {
  const completedCount =
    [hasPsalm, hasReflection, hasPrayerRequest].filter(Boolean).length;

  return (
<section
  style={{
    ...cardStyle,
    marginTop: "24px",
  }}
>
      <p
        style={{
          margin: 0,
          color: "#78716c",
          fontSize: "13px",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        Today&apos;s Journey
      </p>

      <h3 style={{ marginTop: "10px" }}>
        오늘 주님과 함께 걷기
      </h3>

      <p>✓ 말씀을 읽었습니다</p>

      <p>
        {hasReflection ? "✓" : "○"} 오늘의 묵상을 적어보세요
      </p>

      <p>
        {hasPrayerRequest ? "✓" : "○"} 하나님께 기도해보세요
      </p>

      <p
        style={{
          marginTop: "14px",
          color: "#57534e",
          fontWeight: "bold",
        }}
      >
        {completedCount} / 3 완료
      </p>
    </section>
  );
}