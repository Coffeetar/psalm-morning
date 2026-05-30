"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import {
  supabase,
} from "@/lib/supabaseClient";


export default function MyPrayersPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [prayer, setPrayer] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function searchPrayer() {
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("tracking_code", trackingCode.toUpperCase())
      .single();

    if (error) {
      setMessage("해당 기도 요청을 찾을 수 없습니다.");
      setPrayer(null);
      return;
    }

  setPrayer(data);

if (data.admin_response && !data.is_response_read) {
  await supabase
    .from("prayer_requests")
    .update({ is_response_read: true })
    .eq("id", data.id);
}

setMessage("");
  }
  async function searchPrayerByCode(code: string) {
  const { data, error } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("tracking_code", code.toUpperCase())
    .single();

  if (error) {
    setMessage("해당 기도 요청을 찾을 수 없습니다.");
    setPrayer(null);
    return;
  }

setPrayer(data);

if (data.admin_response && !data.is_response_read) {
  await supabase
    .from("prayer_requests")
    .update({ is_response_read: true })
    .eq("id", data.id);
}

setMessage("");
}
useEffect(() => {
  const savedCode =
    localStorage.getItem(
      "psalm_last_tracking_code"
    );

  if (savedCode) {
    setTrackingCode(savedCode);
    searchPrayerByCode(savedCode);
  }
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
          background: "rgba(255,255,255,0.8)",
          borderRadius: "28px",
          padding: "32px",
        }}
      >
        <h1>내 기도 요청 확인</h1>

        <p>
          기도 제목 제출 시 받은 추적 코드를 입력하세요.
        </p>

        <input
          value={trackingCode}
          onChange={(e) =>
            setTrackingCode(e.target.value)
          }
          placeholder="예: PM-AB12CD"
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid #ccc",
            marginTop: "16px",
          }}
        />

        <button
          onClick={searchPrayer}
          style={{
            marginTop: "16px",
            padding: "14px 20px",
            borderRadius: "14px",
            border: "none",
            background: "#292524",
            color: "white",
          }}
        >
          조회
        </button>

        {message && (
          <p style={{ marginTop: "20px" }}>
            {message}
          </p>
        )}

        {prayer && (
          <div
            style={{
              marginTop: "32px",
              padding: "24px",
              borderRadius: "20px",
              background: "#fafaf9",
            }}
          >
            <p>
              <strong>기도 제목</strong>
            </p>

            <p>{prayer.request_text}</p>

     {prayer.admin_response && (
  <div
    style={{
      marginTop: "14px",
      padding: "14px",
      borderRadius: "14px",
      background: "#eff6ff",
      border: "1px solid #bfdbfe",
    }}
  >
    <strong>운영자 응답</strong>

    <p style={{ marginTop: "8px", lineHeight: 1.7 }}>
      {prayer.admin_response}
    </p>
  </div>
)}

<div
  style={{
    marginTop: "12px",
    padding: "10px",
    borderRadius: "12px",
    background: prayer.is_prayed ? "#dcfce7" : "#fef3c7",
    color: prayer.is_prayed ? "#166534" : "#92400e",
    fontWeight: "bold",
  }}
>
  {prayer.is_prayed
    ? "✓ 이 기도 제목은 기도되었습니다"
    : "기도 준비 중입니다"}
</div>

<p
  style={{
    marginTop: "12px",
    fontSize: "13px",
    color: "#78716c",
  }}
>
  등록일: {new Date(prayer.created_at).toLocaleString()}
</p>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}