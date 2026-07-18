import type { WeeklyJourney } from "@/lib/types";
import Image from "next/image";
import { getSeoulWeekday } from "@/lib/date";

type WeeklyJourneyCardProps = {
  weeklyJourney: WeeklyJourney[];
};
import { cardStyle } from "@/lib/theme";
import SectionTitle from "@/components/SectionTitle";

const WEEKDAY_LABELS: Record<string, string> = {
  Monday: "월요일",
  Tuesday: "화요일",
  Wednesday: "수요일",
  Thursday: "목요일",
  Friday: "금요일",
  Saturday: "토요일",
  Sunday: "주일",
};

export default function WeeklyJourneyCard({
  weeklyJourney,
}: WeeklyJourneyCardProps) {
  const todayWeekday = getSeoulWeekday();

  const todayJourney = weeklyJourney.find(
    (item) => item.weekday === todayWeekday
  );

  if (weeklyJourney.length === 0) {
    return null;
  }

  return (
  <section
  style={{
    ...cardStyle,
    marginTop: "28px",
    background:
      "linear-gradient(to bottom right, #fffbeb, #ecfccb)",
  }}
>
      <p
        style={{
          fontSize: "13px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#78716c",
          margin: 0,
        }}
      >
        한 주의 말씀
      </p>

<SectionTitle>
  이번 주 시편 여정
</SectionTitle>

      {weeklyJourney[0]?.introduction && (
        <p
          style={{
            marginTop: "12px",
            lineHeight: 1.8,
            color: "#57534e",
            whiteSpace: "pre-line",
          }}
        >
          {weeklyJourney[0].introduction}
        </p>
      )}

      {weeklyJourney[0]?.theme_image_url && (
        <Image
          src={weeklyJourney[0].theme_image_url}
          alt="이번 주 시편 여정"
          width={1200}
          height={600}
          unoptimized
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "22px",
            marginTop: "18px",
            maxHeight: "240px",
            objectFit: "cover",
          }}
        />
      )}

      {todayJourney && (
        <div
          style={{
            marginTop: "20px",
            padding: "18px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.8)",
            border: "1px solid #fdba74",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#9a3412",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            오늘의 여정
          </p>

          <h3
            style={{
              marginTop: "8px",
              marginBottom: "8px",
              fontSize: "22px",
            }}
          >
            {todayJourney.psalm_reference}
          </h3>

          <p
            style={{
              margin: 0,
              color: "#57534e",
              lineHeight: 1.6,
            }}
          >
            이번 주 여정 가운데 오늘 함께 걸을 시편입니다.
          </p>
        </div>
      )}

      <div style={{ marginTop: "18px" }}>
        {weeklyJourney.map((item) => {
          const isToday = item.weekday === todayWeekday;

          return (
            <div
              key={item.id}
              style={{
                marginTop: "8px",
                padding: "12px 14px",
                borderRadius: "16px",
                background: isToday ? "#fde68a" : "rgba(255,255,255,0.6)",
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <strong>
                {isToday ? "● " : "○ "}
                {WEEKDAY_LABELS[item.weekday] || item.weekday}
              </strong>

              <span>{item.psalm_reference}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
