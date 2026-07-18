import type { PrayerRequest } from "@/lib/types";

type PrayerRequestListProps = {
  prayerList: PrayerRequest[];
  saveAdminResponse: (id: string, response: string) => void;
  markAsPrayed: (id: string) => void;
  deletePrayerRequest: (id: string) => void;
};

export default function PrayerRequestList({
  prayerList,
  saveAdminResponse,
  markAsPrayed,
  deletePrayerRequest,
}: PrayerRequestListProps) {
  return (
  
    <section style={{ marginTop: "24px" }}>
      
      <p style={{ color: "#78716c" }}>현재 기도 제목 수: {prayerList.length}</p>
      

      {prayerList.length === 0 ? (
        
        <p>아직 등록된 기도 제목이 없습니다.</p>
        
      ) : (
        prayerList.map((item) => (
          
          <div
            key={item.id}
            style={{
              marginTop: "16px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "16px",
              background: "#fafafa",
            }}
          >
            <p style={{ lineHeight: 1.7 }}>{item.request_text}</p>
            {item.admin_response && (
  <div
    style={{
      marginTop: "10px",
      padding: "8px 12px",
      borderRadius: "999px",
      display: "inline-block",
      background: item.is_response_read
        ? "#dcfce7"
        : "#dbeafe",
      color: item.is_response_read
        ? "#166534"
        : "#1e40af",
      fontSize: "13px",
      fontWeight: "bold",
    }}
  >
    {item.is_response_read
      ? "✓ 사용자 확인"
      : "🔵 새 응답"}
  </div>
)}

            {item.is_prayed && (
              <p style={{ color: "#15803d", fontWeight: "bold" }}>
                ✓ 기도 완료
              </p>
            )}

            <small>{new Date(item.created_at).toLocaleString()}</small>

            <textarea
              id={`response-${item.id}`}
              defaultValue={item.admin_response || ""}
              placeholder="운영자 응답 입력"
              style={{
                display: "block",
                width: "100%",
                minHeight: "80px",
                marginTop: "14px",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />

            <div style={{ marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => {
                  const textarea = document.getElementById(
                    `response-${item.id}`
                  ) as HTMLTextAreaElement;

                  saveAdminResponse(item.id, textarea.value);
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                응답 저장
              </button>

              <button
                type="button"
                onClick={() => markAsPrayed(item.id)}
                style={{
                  marginLeft: "10px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#16a34a",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                기도 완료
              </button>

              <button
                type="button"
                onClick={() => deletePrayerRequest(item.id)}
                style={{
                  marginLeft: "10px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
