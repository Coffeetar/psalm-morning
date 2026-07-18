import { cardStyle } from "@/lib/theme";

type PrayerSuccessMessageProps = {
  message: string;
  trackingCode: string;
  onCopyTrackingCode?: () => void;
};

export default function PrayerSuccessMessage({
  message,
  trackingCode,
  onCopyTrackingCode,
}: PrayerSuccessMessageProps) {
  if (!message) return null;

  return (
    <section
      style={{
        ...cardStyle,
        marginTop: "20px",
        background: "linear-gradient(145deg, #f3edf8, #fffaf0)",
        color: "#45205f",
      }}
    >
      <p>{message}</p>

      {trackingCode && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.78)",
            border: "1px solid rgba(95,40,134,0.13)",
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "12px" }}>
            기도 제목이 저장되었습니다
          </p>

          <div
            style={{
              display: "inline-block",
              maxWidth: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              background: "#f0e8f5",
              color: "#45205f",
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "1px",
              lineHeight: 1.4,
              overflowWrap: "anywhere",
            }}
          >
            {trackingCode}
          </div>

          <button
            type="button"
            onClick={onCopyTrackingCode}
            style={{
              marginTop: "16px",
              padding: "11px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(95,40,134,0.2)",
              background: "#5f2886",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            추적 코드 복사
          </button>

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
