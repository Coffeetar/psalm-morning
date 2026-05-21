"use client";

import { useEffect, useState } from "react";
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
              <>
                <p>
                  <strong>운영자 응답</strong>
                </p>

                <p>
                  {prayer.admin_response}
                </p>
              </>
            )}

            <p
              style={{
                color: prayer.is_prayed
                  ? "#15803d"
                  : "#92400e",
                fontWeight: "bold",
              }}
            >
              {prayer.is_prayed
                ? "✓ 함께 기도했습니다"
                : "기도 준비 중입니다"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}