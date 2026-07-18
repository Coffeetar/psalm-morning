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
        borderRadius: "28px",
        overflow: "hidden",
        border: "1px solid rgba(95,40,134,0.13)",
        boxShadow: "0 16px 36px rgba(63,35,76,0.12)",
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
