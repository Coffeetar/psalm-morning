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

  const dateText = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

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
        Pause for a moment.
        <br />
        Let the Psalm guide your morning.
      </p>
    </header>
  );
}