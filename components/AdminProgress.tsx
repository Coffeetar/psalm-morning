type AdminProgressProps = {
  psalmReference: string;
  imageUrl: string;
  isPublished: boolean;
};

export default function AdminProgress({
  psalmReference,
  imageUrl,
  isPublished,
}: AdminProgressProps) {
const items = [
  {
    label: "오늘의 시편",
    done: !!psalmReference,
  },
  {
    label: "대표 이미지",
    done: !!imageUrl,
  },
  {
    label: "공개",
    done: isPublished,
  },
];

  const completed = items.filter(Boolean).length;

  const percent =
    (completed / items.length) * 100;

  return (
    <div
      style={{
        marginTop: "22px",
        padding: "18px",
        borderRadius: "18px",
        background: "rgba(255,255,255,.82)",
      }}
    >
      <strong>
        오늘의 진행률
      </strong>

      <div
        style={{
          marginTop: "14px",
          height: "10px",
          borderRadius: "999px",
          background: "#e5e7eb",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            borderRadius: "999px",
            background: "#22c55e",
          }}
        />
      </div>

      <p
        style={{
          marginTop: "12px",
          marginBottom: 0,
        }}
      >
        {completed} / {items.length} 완료
      </p>
    </div>
  );
}