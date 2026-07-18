import Card from "@/components/Card";
import AdminProgress from "@/components/AdminProgress";
import type { PrayerRequest } from "@/lib/types";

type AdminDashboardProps = {
  selectedDate: string;
  psalmReference: string;
  imageUrl: string;
  isPublished: boolean;
  prayerList: PrayerRequest[];
  onGenerateAiDraft?: () => void;
};

export default function AdminDashboard({
  selectedDate,
  psalmReference,
  imageUrl,
  isPublished,
  prayerList,
  onGenerateAiDraft,
}: AdminDashboardProps) {
  const pendingPrayerCount = prayerList.filter(
    (item) => !item.is_prayed
  ).length;

  return (
<Card
  marginTop="24px"
  background="linear-gradient(145deg, #f3edf8, #fffaf0)"
>
      <p
        style={{
          margin: 0,
          color: "#78716c",
          letterSpacing: "2px",
          textTransform: "uppercase",
          fontSize: "13px",
        }}
      >
        Admin Dashboard
      </p>

      <h2 style={{ marginTop: "10px" }}>
        Psalm Morning 운영 현황
      </h2>

      <div
        className="admin-grid"
        style={{
          display: "grid",
          
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <div
  className="admin-stat-card"
  style={{
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.82)",
    height: "100%",
  }}
>
  <strong>오늘의 체크리스트</strong>

  <p style={{ marginTop: "12px" }}>
    {psalmReference ? "☑" : "☐"} 오늘의 시편 작성
  </p>

  <p>
    {isPublished ? "☑" : "☐"} 오늘 공개
  </p>

  <p>
    ☑ Admin 접속
  </p>
</div>
        <div className="admin-stat-card" style={dashboardCardStyle}>
          <strong>선택 날짜</strong>
          <p>{selectedDate}</p>
        </div>

        <div className="admin-stat-card" style={dashboardCardStyle}>
          <strong>오늘의 시편</strong>
          <p>{psalmReference || "미등록"}</p>
        </div>

        <div className="admin-stat-card" style={dashboardCardStyle}>
          <strong>공개 상태</strong>
          <p>{isPublished ? "공개 중" : "비공개"}</p>
        </div>

        <div className="admin-stat-card" style={dashboardCardStyle}>
          <strong>미기도</strong>
          <p>{pendingPrayerCount}건</p>
        </div>
      </div>
      <div
  className="admin-quick-actions admin-grid"
  style={{
    marginTop: "24px",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  }}
>
  <button
    type="button"
    onClick={onGenerateAiDraft}
    style={{
      padding: "14px",
      borderRadius: "16px",
      border: "none",
      background: "#5f2886",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    🤖 AI 초안 생성
  </button>

<button
  type="button"
  onClick={() =>
    document
      .getElementById("weekly-journey-section")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
  >
    📅 주간 여정
  </button>

<button
  type="button"
  onClick={() =>
    document
      .getElementById("today-psalm-section")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
  >
    📖 오늘 말씀
  </button>

<button
  type="button"
  onClick={() =>
    document
      .getElementById("announcement-section")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
  >
    📢 공지 작성
  </button>
</div>
<AdminProgress
  psalmReference={psalmReference}
  imageUrl={imageUrl}
  isPublished={isPublished}
/>
    </Card>
  );
}

const dashboardCardStyle = {
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.78)",
  height: "100%",
};
