
import Image from "next/image";

type PsalmEditorProps = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  psalmReference: string;
  setPsalmReference: (value: string) => void;

  psalmText: string;
  setPsalmText: (value: string) => void;

  reflectionText: string;
  setReflectionText: (value: string) => void;

  prayerText: string;
  setPrayerText: (value: string) => void;

  imageUrl: string;
  setImageUrl: (value: string) => void;

  setImageFile: (file: File | null) => void;

  isPublished: boolean;
  setIsPublished: (value: boolean) => void;
  isEditing: boolean;

  reflectionStyle: string;
  setReflectionStyle: (value: string) => void;

  saveTodayPsalm: () => void;
  moveSelectedDate: (days: number) => void;
  generateAiDraft: () => void;

aiVersion: number;

isAiLocked: boolean;

setIsAiLocked: (
  value: boolean
) => void;

adminMessage: string;
};

export default function PsalmEditor({
  selectedDate,
  setSelectedDate,
  psalmReference,
  setPsalmReference,
  psalmText,
  setPsalmText,
  reflectionText,
  setReflectionText,
  prayerText,
  setPrayerText,
  imageUrl,
  setImageUrl,
  setImageFile,
  isPublished,
  setIsPublished,
  isEditing,
  reflectionStyle,
  setReflectionStyle,
  saveTodayPsalm,
  moveSelectedDate,
  generateAiDraft,
aiVersion,

isAiLocked,
setIsAiLocked,

adminMessage,
}: PsalmEditorProps) {
  
  return (
    
    
    <section
      style={{
        marginTop: "30px",
        marginBottom: "40px",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "20px",
        background: "#fffaf0",
      }}
    >
      <h2>{isEditing ? "오늘의 시편 수정" : "오늘의 시편 등록"}</h2>

      {isEditing && (
        <p
          role="status"
          style={{
            marginTop: "8px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "#dcfce7",
            color: "#166534",
          }}
        >
          선택한 날짜의 기존 시편을 수정하고 있습니다.
        </p>
      )}

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "12px",
          borderRadius: "12px",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ marginTop: "10px" }}>
        <button
          type="button"
          onClick={() => moveSelectedDate(-1)}
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginRight: "8px",
            cursor: "pointer",
          }}
        >
          ← 이전 날
        </button>

        <button
          type="button"
          onClick={() =>
            setSelectedDate(new Date().toISOString().slice(0, 10))
          }
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginRight: "8px",
            cursor: "pointer",
          }}
        >
          오늘
        </button>

        <button
          type="button"
          onClick={() => moveSelectedDate(1)}
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          다음 날 →
        </button>
      </div>

      <input
        value={psalmReference || ""}
        onChange={(e) => setPsalmReference(e.target.value)}
        placeholder="예: Psalm 121:1–2"
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "12px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          fontSize: "15px",
        }}
      />

      <textarea
        value={psalmText || ""}
        onChange={(e) => setPsalmText(e.target.value)}
        placeholder="시편 본문"
        style={{
          width: "100%",
          minHeight: "100px",
          padding: "14px",
          marginTop: "12px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          fontSize: "15px",
        }}
      />

      <textarea
        value={reflectionText || ""}
        onChange={(e) => setReflectionText(e.target.value)}
        placeholder="짧은 묵상"
        style={{
          width: "100%",
          minHeight: "80px",
          padding: "14px",
          marginTop: "12px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          fontSize: "15px",
        }}
      />

      <textarea
        value={prayerText || ""}
        onChange={(e) => setPrayerText(e.target.value)}
        placeholder="아침 기도문"
        style={{
          width: "100%",
          minHeight: "80px",
          padding: "14px",
          marginTop: "12px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          fontSize: "15px",
        }}
      />

      <input
        value={imageUrl || ""}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="이미지 URL"
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "12px",
          borderRadius: "12px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            setImageFile(file);
          }
        }}
        style={{
          marginTop: "12px",
        }}
      />

      {imageUrl && (
        <div style={{ marginTop: "16px" }}>
          <p style={{ fontWeight: "bold" }}>이미지 미리보기</p>

          <Image
            src={imageUrl}
            alt="Psalm preview"
            width={1200}
            height={800}
            unoptimized
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "420px",
              borderRadius: "18px",
              marginTop: "8px",
            }}
          />
        </div>
      )}

      <label
        style={{
          display: "block",
          marginTop: "16px",
        }}
      >
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />{" "}
        공개하기
      </label>
      <select
  value={reflectionStyle}
  onChange={(e) =>
    setReflectionStyle(
      e.target.value
    )
  }
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    borderRadius: "12px",
  }}
>
  <option value="general">
    일반 묵상
  </option>

  <option value="hope">
    희망
  </option>

  <option value="suffering">
    고난
  </option>

  <option value="gratitude">
    감사
  </option>

  <option value="youth">
    청년
  </option>
</select>
<button
  type="button"
  onClick={() => setIsAiLocked(!isAiLocked)}
  style={{
    marginTop: "14px",
    marginRight: "10px",
    padding: "14px 20px",
    borderRadius: "12px",
    border: "none",
    background: isAiLocked ? "#92400e" : "#64748b",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
  }}
>
  {isAiLocked ? "잠금 해제" : "AI 잠금"}
</button>
<button
  type="button"
  onClick={generateAiDraft}
  style={{
    marginTop: "14px",
    marginRight: "10px",
    padding: "14px 20px",
    borderRadius: "12px",
    border: "none",
    background: "#7c3aed",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
  }}
>
  AI 초안 생성
</button>
<p
  style={{
    marginTop: "8px",
    fontSize: "13px",
    color: "#666",
  }}
>
  AI draft version: {aiVersion}
</p>
      <button
        type="button"
        onClick={saveTodayPsalm}
        style={{
          marginTop: "14px",
          padding: "14px 20px",
          borderRadius: "12px",
          border: "none",
          background: "#292524",
          color: "white",
          fontSize: "15px",
          cursor: "pointer",
        }}
      >
        {isEditing ? "시편 변경 저장" : "오늘의 시편 저장"}
      </button>

      {adminMessage && (
        <p style={{ marginTop: "14px", color: "#166534" }}>{adminMessage}</p>
      )}
    </section>
  );
}
