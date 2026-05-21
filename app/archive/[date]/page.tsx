"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PsalmDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const [psalm, setPsalm] = useState<any>(null);

  useEffect(() => {
    loadPsalm();
  }, []);

  async function loadPsalm() {
    const { data, error } = await supabase
      .from("daily_psalms")
      .select("*")
      .eq("devotional_date", date)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setPsalm(data);
  }

  if (!psalm) {
    return (
      <main style={{ padding: "40px" }}>
        <p>불러오는 중입니다...</p>
      </main>
    );
  }

  return (
    <main
    
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #fef3c7, #ecfccb, #e0f2fe)",
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
              {psalm.image_url && (
  <img
    src={psalm.image_url}
    alt={psalm.psalm_reference}
    style={{
      width: "100%",
      borderRadius: "24px",
      marginBottom: "24px",
    }}
  />
)}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.8)",
          borderRadius: "32px",
          padding: "32px",
        }}
      >
        <p style={{ color: "#78716c" }}>{psalm.devotional_date}</p>

        <h1>{psalm.psalm_reference}</h1>

        <p
          style={{
            fontSize: "20px",
            lineHeight: 1.8,
            marginTop: "24px",
          }}
        >
          {psalm.psalm_text}
        </p>

        <div
          style={{
            marginTop: "32px",
            padding: "24px",
            borderRadius: "20px",
            background: "#fefce8",
          }}
        >
          <h2>Reflection</h2>
          <p style={{ lineHeight: 1.8 }}>{psalm.reflection}</p>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "24px",
            borderRadius: "20px",
            background: "#f0f9ff",
          }}
        >
          <h2>Morning Prayer</h2>
          <p style={{ lineHeight: 1.8 }}>{psalm.prayer}</p>
        </div>
      </div>

    </main>
  );
}