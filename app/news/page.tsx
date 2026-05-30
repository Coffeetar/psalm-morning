"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabaseClient";

export default function NewsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([]);

useEffect(() => {
  async function loadAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setAnnouncements(data || []);
  }

  loadAnnouncements();
}, []);
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "sans-serif",
        background:
          "linear-gradient(to bottom right, #fef3c7, #ecfccb, #e0f2fe)",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.85)",
          borderRadius: "28px",
          padding: "32px",
        }}
      >
        
        <h1>공지 사항</h1>

        <p style={{ lineHeight: 1.7, color: "#57534e" }}>
          Psalm Morning의 소식과 온라인 기도회 안내를 전합니다.
        </p>

        <section
          style={{
            marginTop: "24px",
            padding: "20px",
            borderRadius: "20px",
            background: "#f8fafc",
          }}
        >
          <h2>온라인 아침 기도회</h2>

          <p style={{ lineHeight: 1.7 }}>
            매일 아침 시편 말씀과 함께 기도하는 시간을 이어갑니다.
          </p>

    <a
  href="https://www.youtube.com/@onthisnet"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "12px",
    padding: "12px 18px",
    borderRadius: "999px",
    background: "#ff0000",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  }}
>
  <span style={{ fontSize: "18px" }}>
    ▶
  </span>

  유튜브 채널 보기
</a>
        </section>

        <section
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "20px",
            background: "#f0fdf4",
          }}
        >
          <h2>기도 나눔 공간</h2>

          <p style={{ lineHeight: 1.7 }}>
            함께 기도하고 나눌 수 있는 공간을 준비하고 있습니다.
          </p>

<a
  href="https://open.kakao.com/o/gXUUTyui"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "12px",
    padding: "12px 18px",
    borderRadius: "999px",
    background: "#FEE500",
    color: "#191919",
    textDecoration: "none",
    fontWeight: "bold",
  }}
>
  <span
    style={{
      fontWeight: "bold",
      fontSize: "18px",
    }}
  >
    💬
  </span>

  카톡 오픈채팅 보기
</a>
{announcements.map((item) => (
  <section
    key={item.id}
    style={{
      marginTop: "20px",
      padding: "20px",
      borderRadius: "20px",
      background: "#fff",
    }}
  >
    <h2>{item.title}</h2>

    <p style={{ lineHeight: 1.7 }}>
      {item.content}
    </p>

    {item.link_url && (
      <a
        href={item.link_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: "12px",
          color: "#2563eb",
        }}
      >
        관련 링크 열기
      </a>
    )}
  </section>
))}
        </section>

        <BottomNav />
      </div>
    </main>
  );
}