import { cardStyle } from "@/lib/theme";

type PrayerSuccessMessageProps = {
  message: string;
  trackingCode: string;
};

export default function PrayerSuccessMessage({
  message,
  trackingCode,
}: PrayerSuccessMessageProps) {
  if (!message) return null;

  return (
    <section
      style={{
        ...cardStyle,
        marginTop: "20px",
        background: "#dcfce7",
        color: "#166534",
      }}
    >
      <p>{message}</p>

      {trackingCode && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "20px",
            background: "#ecfccb",
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "12px" }}>
            기도 제목이 저장되었습니다
          </p>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            {trackingCode}
          </div>

          <p
            style={{
              marginTop: "12px",
              color: "#57534e",
              lineHeight: 1.6,
            }}
          >
            이 코드를 저장해두시면
            <br />
            나중에 “내 기도”에서 확인할 수 있습니다.
          </p>
        </div>
      )}
    </section>
  );
}