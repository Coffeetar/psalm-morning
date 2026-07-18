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
        marginBottom: "32px",
        paddingTop: "12px",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          color: "#5f2886",
          letterSpacing: "3px",
          textTransform: "uppercase",
          fontWeight: 750,
        }}
      >
        {season} Psalm Morning
      </p>

      <p
        style={{
          marginTop: "8px",
          color: "#756c7b",
          fontSize: "15px",
        }}
      >
        {dateText}
      </p>

      <p
        style={{
          marginTop: "18px",
          lineHeight: 1.7,
          color: "#554d59",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "17px",
        }}
      >
        잠시 멈추어 마음을 가다듬어 보세요.
        <br />
        오늘 아침, 시편의 말씀을 따라 걸어보세요.
      </p>
    </header>
  );
}
