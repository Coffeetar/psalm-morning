import type { DailyPsalm } from "@/lib/types";

type PsalmScheduleListProps = {
  openPreview?: boolean;
  scheduleList: DailyPsalm[];
  selectedDate: string;
  setSelectedDate: (
    date: string
  ) => void;

  showPastPsalms: boolean;

  setShowPastPsalms: (
    value: boolean
  ) => void;

  deletePsalm: (
    date: string
  ) => void;

  getDayLabel: (
    date: string
  ) => string;
};

export default function PsalmScheduleList({
  scheduleList,
  selectedDate,
  setSelectedDate,
  showPastPsalms,
  setShowPastPsalms,
  deletePsalm,
  getDayLabel,
}: PsalmScheduleListProps) {
  function StatusBadge({
  active,
  activeText,
  inactiveText,
}: {
  active: boolean;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "999px",
        background: active ? "#dcfce7" : "#fee2e2",
        color: active ? "#166534" : "#991b1b",
      }}
    >
      {active ? activeText : inactiveText}
    </span>
  );
}
  return (
    
    <section
      style={{
        marginTop: "40px",
        padding: "24px",
        borderRadius: "20px",
        background: "#f8fafc",
      }}
    >
      <h2>등록된 시편 일정</h2>

 <button
  type="button"
  onClick={() =>
    setShowPastPsalms(
      !showPastPsalms
    )
  }
  style={{
    marginTop: "12px",
    padding: "8px 12px",
    borderRadius: "10px",
    border: "none",
    background: "#476956",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
  }}
>
  {showPastPsalms
    ? "오늘 이후만 보기"
    : "과거 시편도 보기"}
</button>

      {scheduleList.map((item) => (
        <div
          key={item.id}
          onClick={() =>
            setSelectedDate(
              item.devotional_date
            )
          }
          style={{
            marginTop: "12px",
            padding: "16px",
            borderRadius: "12px",
            background:
              selectedDate ===
              item.devotional_date
                ? "#dcfce7"
                : "white",
            cursor: "pointer",
          }}
        >
          <strong>
            {item.devotional_date}
          </strong>

          <span
            style={{
              marginLeft: "8px",
            }}
          >
            {getDayLabel(
              item.devotional_date
            )}
          </span>

        <p>
  {item.psalm_reference}
</p>

<div
  style={{
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "8px",
    fontSize: "12px",
  }}
>
<StatusBadge
  active={!!item.image_url}
  activeText="이미지 있음"
  inactiveText="이미지 없음"
/>

<StatusBadge
  active={!!item.reflection}
  activeText="묵상 있음"
  inactiveText="묵상 없음"
/>

<StatusBadge
  active={!!item.prayer}
  activeText="기도문 있음"
  inactiveText="기도문 없음"
/>

<StatusBadge
  active={!!item.is_published}
  activeText="공개됨"
  inactiveText="비공개"
/>
</div>

<div
  style={{
    marginTop: "12px",
  }}
>
<a
  href={`/archive/${item.devotional_date}`}
  target="_blank"
  style={{
    display: "inline-block",
    marginTop: "12px",
    marginRight: "10px",
    padding: "8px 12px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
    fontSize: "13px",
    lineHeight: "1",
  }}
>
  미리보기 열기
</a>

  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();

      deletePsalm(
        item.devotional_date
      );
    }}
    style={{
      padding: "8px 12px",
      borderRadius: "10px",
      border: "none",
      background: "#dc2626",
      fontSize: "13px",
      color: "white",
      cursor: "pointer",
      lineHeight: "1",
    }}
  >
    삭제
    
  </button>
  
</div>
        </div>
      ))}
      
    </section>
  );
}
