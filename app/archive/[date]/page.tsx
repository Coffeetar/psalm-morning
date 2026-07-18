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
      <main className="page-main">
        <div className="page-shell pm-page-shell">
          <Link href="/archive" style={{ color: "#5f2886" }}>← 지난 시편으로</Link>
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
      }}
    >
      <div
        className="page-shell pm-page-shell"
      >
        <Link href="/archive" style={{ color: "#5f2886", fontWeight: 650 }}>
          ← 지난 시편으로
        </Link>

        <p style={{ color: "#7b42a0", marginTop: "24px", fontWeight: 650 }}>
          {formatKoreanDate(psalm.devotional_date)}
        </p>

        <h1 className="pm-page-title">{psalm.psalm_reference}</h1>

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
              marginTop: "24px",
              border: "1px solid rgba(95,40,134,0.12)",
              boxShadow: "0 14px 34px rgba(63,35,76,0.1)",
            }}
          />
        )}

        <p
          style={{
            fontSize: "20px",
            lineHeight: 1.8,
            marginTop: "24px",
            color: "#3f3743",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {psalm.psalm_text}
        </p>

        <div
          style={{
            marginTop: "32px",
            padding: "24px",
            borderRadius: "20px",
            background: "linear-gradient(145deg, #fffaf0, #f8f2fb)",
            border: "1px solid rgba(95,40,134,0.12)",
          }}
        >
          <h2 style={{ color: "#3f1d57" }}>오늘의 묵상</h2>
          <p style={{ lineHeight: 1.8 }}>{psalm.reflection}</p>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "24px",
            borderRadius: "20px",
            background: "linear-gradient(145deg, #f3edf8, #fffdf8)",
            border: "1px solid rgba(95,40,134,0.12)",
          }}
        >
          <h2 style={{ color: "#3f1d57" }}>아침 기도</h2>
          <p style={{ lineHeight: 1.8 }}>{psalm.prayer}</p>
        </div>
      </div>

    </main>
  );
}
