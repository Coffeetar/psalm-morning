"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabaseClient";
import type { Announcement } from "@/lib/types";

export default function NewsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

useEffect(() => {
  async function loadAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage("공지 사항을 불러오지 못했습니다.");
      setIsLoading(false);
      return;
    }

    setAnnouncements(data || []);
    setErrorMessage("");
    setIsLoading(false);
  }

  void loadAnnouncements();
}, [reloadKey]);
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
        <p className="pm-eyebrow">PSALM MORNING</p>
        <h1 className="pm-page-title">Psalm Morning 소식</h1>

        <section
          style={{
            marginTop: "24px",
            padding: "20px",
            borderRadius: "20px",
            background: "linear-gradient(145deg, #f3edf8, #fffdf8)",
            border: "1px solid rgba(95,40,134,0.12)",
          }}
        >
          <h2 style={{ color: "#3f1d57" }}>
            On this Net 유튜브 채널 보기
          </h2>

          <p style={{ lineHeight: 1.7 }}>
            온디스넷 채널의 다양한 컨텐츠를 확인하실 수 있습니다.
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
            background: "linear-gradient(145deg, #fffaf0, #f8f2fb)",
            border: "1px solid rgba(95,40,134,0.12)",
          }}
        >
          <h2 style={{ color: "#3f1d57" }}>기도 나눔 공간</h2>

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
        </section>

        <section aria-labelledby="announcement-heading" style={{ marginTop: "32px" }}>
          <h2 id="announcement-heading" style={{ color: "#3f1d57" }}>운영자 공지</h2>

{isLoading ? (
  <p role="status">공지 사항을 불러오고 있습니다...</p>
) : errorMessage ? (
  <div role="alert">
    <p>{errorMessage}</p>
    <button
      type="button"
      onClick={() => {
        setIsLoading(true);
        setErrorMessage("");
        setReloadKey((value) => value + 1);
      }}
    >
      다시 시도
    </button>
  </div>
) : announcements.length === 0 ? (
  <p>현재 등록된 공지가 없습니다.</p>
) : announcements.map((item) => (
  <section
    key={item.id}
    className="pm-list-card"
    style={{
      marginTop: "20px",
      padding: "20px",
      borderRadius: "20px",
      background: "#fffdf8",
      border: "1px solid rgba(95,40,134,0.12)",
      boxShadow: "0 10px 24px rgba(63,35,76,0.06)",
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
          color: "#5f2886",
          fontWeight: 650,
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
