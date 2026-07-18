"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import type { DailyPsalm } from "@/lib/types";
import { formatKoreanDate } from "@/lib/date";

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
  const [psalm, setPsalm] = useState<DailyPsalm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPsalm() {
      const { data, error } = await supabase
        .from("daily_psalms")
        .select("*")
        .eq("devotional_date", date)
        .eq("is_published", true)
        .maybeSingle();

      if (error) {
        console.error(error);
        setErrorMessage("시편 묵상을 불러오지 못했습니다.");
        setIsLoading(false);
        return;
      }

      setPsalm(data);
      setIsLoading(false);
    }

    void loadPsalm();
  }, [date]);

  if (isLoading || errorMessage || !psalm) {
    return (
      <main className="page-main" style={{ fontFamily: "sans-serif" }}>
        <div className="page-shell">
          <Link href="/archive">← 지난 시편으로</Link>
          <p role={errorMessage ? "alert" : "status"} style={{ marginTop: "24px" }}>
            {isLoading
              ? "시편 묵상을 불러오고 있습니다..."
              : errorMessage || "해당 날짜에 공개된 시편 묵상이 없습니다."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="page-main"
    
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #fef3c7, #ecfccb, #e0f2fe)",
        fontFamily: "sans-serif",
      }}
    >
              {psalm.image_url && (
  <Image
    src={psalm.image_url}
    alt={psalm.psalm_reference}
    width={1200}
    height={800}
    unoptimized
    loading="eager"
    style={{
      width: "100%",
      height: "auto",
      borderRadius: "24px",
      marginBottom: "24px",
    }}
  />
)}
      <div
        className="page-shell"
        style={{
          background: "rgba(255,255,255,0.8)",
          borderRadius: "32px",
          padding: "32px",
        }}
      >
        <Link href="/archive" style={{ color: "#57534e" }}>
          ← 지난 시편으로
        </Link>

        <p style={{ color: "#78716c", marginTop: "24px" }}>
          {formatKoreanDate(psalm.devotional_date)}
        </p>

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
          <h2>오늘의 묵상</h2>
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
          <h2>아침 기도</h2>
          <p style={{ lineHeight: 1.8 }}>{psalm.prayer}</p>
        </div>
      </div>

    </main>
  );
}
