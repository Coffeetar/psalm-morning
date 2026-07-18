import { cardStyle } from "@/lib/theme";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import TextArea from "@/components/TextArea";

type ReflectionMemoCardProps = {
  reflection: string;
  setReflection: (value: string) => void;
  saveReflection: () => void;
  isSaved: boolean;
};

export default function ReflectionMemoCard({
  reflection,
  setReflection,
  saveReflection,
  isSaved,
}: ReflectionMemoCardProps) {
  return (
    <section
      style={{
        ...cardStyle,
        marginTop: "24px",
      }}
    >
<SectionTitle>
  오늘의 묵상
</SectionTitle>

     <TextArea
  value={reflection}
  onChange={setReflection}
  placeholder="오늘 말씀을 읽고 떠오른 생각을 적어보세요."
  minHeight="100px"
/>

<Button
  onClick={saveReflection}
  variant="secondary"
  fullWidth
>
  {isSaved ? "묵상 저장됨 · 다시 저장하기" : "묵상 저장하기"}
</Button>
      <p
        style={{
          margin: "12px 0 0",
          color: "#78716c",
          fontSize: "13px",
          lineHeight: 1.5,
        }}
      >
        이 묵상은 현재 기기에만 안전하게 저장됩니다.
      </p>
    </section>
  );
}
