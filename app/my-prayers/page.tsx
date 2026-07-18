"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabaseClient";
import type { PrayerRequest } from "@/lib/types";

export default function MyPrayersPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [prayer, setPrayer] = useState<PrayerRequest | null>(null);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  function normalizeTrackingCode(code: string) {
    return code.trim().toUpperCase();
  }

  function isValidTrackingCode(code: string) {
    return /^PM-[A-Z0-9]{6,32}$/.test(normalizeTrackingCode(code));
  }

  async function searchPrayerByCode(code: string) {
    setIsSearching(true);

    const { data, error } = await supabase
      .rpc("lookup_prayer_request", {
        p_tracking_code: normalizeTrackingCode(code),
      })
      .maybeSingle();

    if (error || !data) {
      setMessage("해당 기도 요청을 찾을 수 없습니다.");
      setPrayer(null);
      setIsSearching(false);
      return;
    }

    setPrayer(data as PrayerRequest);

    setMessage("");
    setIsSearching(false);
  }

  async function searchPrayer() {
    if (!trackingCode.trim()) {
      setMessage("추적 코드를 입력해주세요.");
      setPrayer(null);
      return;
    }

    if (!isValidTrackingCode(trackingCode)) {
      setMessage("PM-으로 시작하는 추적 코드를 확인해주세요.");
      setPrayer(null);
      return;
    }

    await searchPrayerByCode(trackingCode);
  }

useEffect(() => {
  async function loadSavedPrayer() {
    const savedCode =
      localStorage.getItem(
        "psalm_last_tracking_code"
      );

    if (!savedCode) return;

    const { data, error } = await supabase
      .rpc("lookup_prayer_request", {
        p_tracking_code: savedCode.toUpperCase(),
      })
      .maybeSingle();

    setTrackingCode(savedCode);

    if (error || !data) {
      setMessage("저장된 기도 요청을 찾을 수 없습니다.");
      return;
    }

    setPrayer(data as PrayerRequest);
  }

  void loadSavedPrayer();
}, []);
  return (
    <main
      className="page-main"
      style={{
        minHeight: "100vh",
        fontFamily: "sans-serif",
        background:
          "linear-gradient(to bottom right, #fef3c7, #ecfccb, #e0f2fe)",
      }}
    >
      <div
        className="page-shell"
        style={{
          background: "rgba(255,255,255,0.8)",
          borderRadius: "28px",
          padding: "32px",
        }}
      >
        <h1>내 기도 요청 확인</h1>

        <p>
          기도 제목 제출 시 받은 추적 코드를 입력하세요.
        </p>

        <label
          htmlFor="prayer-tracking-code"
          style={{ display: "block", marginTop: "20px", fontWeight: "bold" }}
        >
          추적 코드
        </label>

        <input
          id="prayer-tracking-code"
          value={trackingCode}
          onChange={(e) =>
            setTrackingCode(e.target.value.toUpperCase())
          }
          placeholder="예: PM-AB12CD"
          autoCapitalize="characters"
          autoComplete="off"
          maxLength={35}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid #ccc",
            marginTop: "8px",
          }}
        />

        <button
          type="button"
          onClick={searchPrayer}
          disabled={isSearching}
          style={{
            marginTop: "16px",
            padding: "14px 20px",
            borderRadius: "14px",
            border: "none",
            background: "#292524",
            color: "white",
            cursor: isSearching ? "not-allowed" : "pointer",
            opacity: isSearching ? 0.65 : 1,
          }}
        >
          {isSearching ? "조회 중..." : "조회"}
        </button>

        {message && (
          <p role="status" style={{ marginTop: "20px" }}>
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
