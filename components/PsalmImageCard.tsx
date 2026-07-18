import Image from "next/image";

type PsalmImageCardProps = {
  imageUrl?: string;
  alt?: string;
};

export default function PsalmImageCard({
  imageUrl,
  alt = "Psalm image",
}: PsalmImageCardProps) {
  if (!imageUrl) return null;

  return (
    <div
      style={{
        marginBottom: "28px",
        borderRadius: "36px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
      }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        width={1200}
        height={800}
        unoptimized
        loading="eager"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          maxHeight: "420px",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
