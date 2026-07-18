import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Psalm Morning - A quiet morning with the Psalms";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const iconData = await readFile(
    join(process.cwd(), "public", "icon-512.png"),
    "base64"
  );
  const iconSrc = `data:image/png;base64,${iconData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "72px",
          padding: "70px 90px",
          background:
            "linear-gradient(135deg, #fef3c7 0%, #ecfccb 52%, #e0f2fe 100%)",
          color: "#292524",
        }}
      >
        <img
          src={iconSrc}
          alt=""
          width={360}
          height={360}
          style={{ borderRadius: "84px" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "560px",
          }}
        >
          <div
            style={{
              fontSize: "66px",
              fontWeight: 700,
              letterSpacing: "-2px",
            }}
          >
            Psalm Morning
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: "30px",
              lineHeight: 1.4,
              color: "#57534e",
            }}
          >
            A quiet morning with the Psalms
          </div>
        </div>
      </div>
    ),
    size
  );
}
