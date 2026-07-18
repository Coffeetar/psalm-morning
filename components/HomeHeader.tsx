import { formatKoreanDate, getSeoulDateKey } from "@/lib/date";

export default function HomeHeader() {
  const today = new Date();

  const month = today.getMonth() + 1;

  const season =
    month >= 3 && month <= 5
      ? "🌸"
      : month >= 6 && month <= 8
      ? "☀️"
      : month >= 9 && month <= 11
      ? "🍂"
      : "❄️";

  const dateText = formatKoreanDate(getSeoulDateKey(today));

  return (
    <header
      style={{
        textAlign: "center",
        marginBottom: "28px",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          color: "#78716c",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        {season} Psalm Morning
      </p>

      <p
        style={{
          marginTop: "8px",
          color: "#57534e",
        }}
      >
        {dateText}
      </p>

      <p
        style={{
          marginTop: "18px",
          lineHeight: 1.7,
          color: "#57534e",
          fontStyle: "italic",
        }}
      >
        잠시 멈추어 마음을 가다듬어 보세요.
        <br />
        오늘 아침, 시편의 말씀을 따라 걸어보세요.
      </p>
    </header>
  );
}
