"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import {
  supabase,
} from "@/lib/supabaseClient";
<Link
  href="/my-prayers"
  style={{
    display: "inline-block",
    marginTop: "12px",
    padding: "14px 22px",
    borderRadius: "999px",
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
  }}
>
  내 기도 요청 확인하기
</Link>


export default function HomePage() {

  const [reflection, setReflection] = useState("");

  const [prayerRequest, setPrayerRequest] = useState("");

  const [message, setMessage] = useState("");
  const [prayerList, setPrayerList] = useState<any[]>([]);
  const [todayPsalm, setTodayPsalm] = useState<any>(null);
  const [debugMessage, setDebugMessage] = useState("");
useEffect(() => {
  loadTodayPsalm();
  loadPrayerRequests();
}, []);
async function loadPrayerRequests() {
  const { data, error } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false });

if (error) {
  console.log("loadTodayPsalm error:", error.message);
  setTodayPsalm(null);
  return;
}

  setPrayerList(data || []);
}
async function loadTodayPsalm() {
const today = new Intl.DateTimeFormat(
  "en-CA",
  {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }
).format(new Date());

const { data, error } = await supabase
  .from("daily_psalms")
  .select("*")
  .eq("devotional_date", today)
  .eq("is_published", true)
  .single();

  if (error) {
    setDebugMessage(`Supabase error: ${error.message}`);
    setTodayPsalm(null);
    return;
  }

  setDebugMessage(`Loaded: ${data.devotional_date} / ${data.psalm_reference}`);
  setTodayPsalm(data);
}
async function handlePrayerSubmit() {
const trackingCode =
  "PM-" +
  Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
  if (!prayerRequest.trim()) {

    setMessage("기도 제목을 먼저 입력해주세요.");

    return;

  }

async function shareTodayPsalm() {
  const text = `
${todayPsalm?.psalm_reference}

${todayPsalm?.psalm_text}

Reflection:
${todayPsalm?.reflection || ""}
`;

  try {
    await navigator.clipboard.writeText(text);

    setMessage(
      "오늘의 시편이 클립보드에 복사되었습니다."
    );
  } catch {
    setMessage(
      "복사 중 문제가 발생했습니다."
    );
  }
}
async function loadPrayerRequests() {

  const { data, error } = await supabase

    .from("prayer_requests")

    .select("*")

    .order("created_at", { ascending: false });

  if (error) {

    console.error(error);

    return;

  }

  setPrayerList(data || []);

}


  const { error } = await supabase.from("prayer_requests").insert({

    request_text: prayerRequest,
tracking_code: trackingCode,

  });

  if (error) {

    setMessage("저장 중 문제가 발생했습니다.");

    console.error(error);

    return;

  }

  setMessage(
  `기도 제목이 전달되었습니다. 추적 코드: ${trackingCode}`
);
localStorage.setItem(
  "psalm_last_tracking_code",
  trackingCode
);

  setPrayerRequest("");
  await loadPrayerRequests();

}
if (!todayPsalm) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        fontFamily: "sans-serif",
        background:
          "linear-gradient(to bottom right, #fef3c7, #ecfccb, #e0f2fe)",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          background: "rgba(255,255,255,0.8)",
          borderRadius: "28px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <h1>오늘의 시편이 아직 준비 중입니다</h1>
        <p style={{ lineHeight: 1.7, color: "#57534e" }}>
          운영자가 오늘의 말씀을 준비하고 있습니다 <br/>
          잠시 후 다시 확인해주세요.
        </p>
        {debugMessage && (
  <p style={{ marginTop: "16px", color: "#b91c1c" }}>
    {debugMessage}
  </p>
)}
      </div>
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

        color: "#292524",

      }}

    >

      <div

        style={{

          maxWidth: "600px",

          margin: "0 auto",

          background: "rgba(255,255,255,0.75)",

          borderRadius: "32px",

          padding: "32px",

          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",

        }}

      >

        <p style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#78716c" }}>

          PSALM MORNING

        </p>

        <h1 style={{ fontSize: "36px" }}>오늘의 시편</h1>
        {todayPsalm?.image_url && (
  <img
    src={todayPsalm.image_url}
    alt="Psalm image"
    style={{
      width: "100%",
      borderRadius: "24px",
      marginBottom: "20px",
    }}
  />
)}

        <h2>{todayPsalm?.psalm_reference || "오늘의 시편을 불러오는 중입니다..."}</h2>

      <p style={{ fontSize: "20px", lineHeight: 1.8 }}>
  “{todayPsalm?.psalm_text || ""}”
</p>

        <div style={{ background: "#fefce8", padding: "20px", borderRadius: "20px" }}>

          <strong>Short Reflection</strong>

          <p>

            Before the day becomes busy, the Psalm invites us to lift our eyes.

            Help begins with the Lord who keeps us.

          </p>

        </div>
        <div
        
  style={{
    background: "#f0f9ff",
    padding: "20px",
    borderRadius: "20px",
    marginTop: "20px",
  }}
>

  <strong>Morning Prayer</strong>
  
  
  <p style={{ lineHeight: 1.7 }}>
    {todayPsalm?.prayer || "오늘의 기도문이 아직 등록되지 않았습니다."}
  </p>
</div>

        <div style={{ marginTop: "24px" }}>

 <button
 onClick={async () => {
  const text = `
${todayPsalm?.psalm_reference}

${todayPsalm?.psalm_text}

Reflection:
${todayPsalm?.reflection || ""}
`;

  try {
    await navigator.clipboard.writeText(text);
    setMessage("오늘의 시편이 클립보드에 복사되었습니다.");
  } catch {
    setMessage("복사 중 문제가 발생했습니다.");
  }
}}
  style={{
    marginTop: "12px",
    marginBottom: "10px",
    width: "100%",
    padding: "14px",
    borderRadius: "16px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
  }}
>
  오늘의 시편 공유하기
</button> 
          <h3>오늘의 묵상</h3>

          <textarea
          

            value={reflection}

            onChange={(e) => setReflection(e.target.value)}

            placeholder="오늘 말씀을 읽고 떠오른 생각을 적어보세요."

            style={{

              width: "100%",

              minHeight: "100px",

              padding: "14px",

              borderRadius: "16px",

              border: "1px solid #d6d3d1",

              fontSize: "15px",

            }}

          />
          <button
          
  onClick={() => {
    if (!reflection.trim()) {
      setMessage("묵상을 먼저 입력해주세요.");
      return;
    }

    setMessage("묵상이 저장되었습니다.");
    setReflection("");
  }}
  style={{
    marginTop: "12px",
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    background: "#b45309",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  }}
>
  묵상 저장하기
</button>

        </div>

        <div style={{ marginTop: "24px" }}>

          <h3>기도 제목 남기기</h3>

          <textarea

            value={prayerRequest}

            onChange={(e) => setPrayerRequest(e.target.value)}

            placeholder="함께 기도하기 원하는 제목을 남겨주세요."

            style={{

              width: "100%",

              minHeight: "100px",

              padding: "14px",

              borderRadius: "16px",

              border: "1px solid #d6d3d1",

              fontSize: "15px",

            }}

          />

          <button

            onClick={handlePrayerSubmit}

            style={{

              marginTop: "12px",

              width: "100%",

              padding: "16px",

              borderRadius: "16px",

              border: "none",

              background: "#292524",

              color: "white",

              fontSize: "16px",

              cursor: "pointer",

            }}

          >

            기도 제목 보내기

          </button>

        </div>


{message && (
  <div
    style={{
      marginTop: "20px",
      padding: "14px",
      borderRadius: "16px",
      background: "#dcfce7",
      color: "#166534",
    }}
  >
    <p>{message}</p>

    {message.includes("추적 코드") && (
      <Link
        href="/my-prayers"
        style={{
          display: "inline-block",
          marginTop: "8px",
          padding: "10px 14px",
          borderRadius: "12px",
          background: "#166534",
          color: "white",
          textDecoration: "none",
          fontSize: "14px",
        }}
      >
        내 기도 요청 확인하기
      </Link>
    )}
  </div>
)}

      </div>
<div style={{ marginTop: "28px" }}>
<p
  style={{
    marginTop: "12px",
    color: "#78716c",
    fontSize: "14px",
    lineHeight: 1.6,
  }}
>
  남겨주신 기도 제목은 운영자에게만 전달됩니다.
</p>

  {prayerList.length === 0 ? (
    <p style={{ color: "#78716c" }}>아직 등록된 기도 제목이 없습니다.</p>
  ) : (
    prayerList.map((item) => (
      <div
        key={item.id}
        style={{
          marginTop: "12px",
          padding: "14px",
          borderRadius: "16px",
          background: "#f8fafc",
          border: "1px solid #e7e5e4",
        }}
      >
        <p style={{ margin: 0 }}>{item.request_text}</p>
        {item.admin_response && (
  <div
    style={{
      marginTop: "12px",
      padding: "12px",
      borderRadius: "12px",
      background: "#eff6ff",
      color: "#1e3a8a",
    }}
  >
    <strong>운영자 응답</strong>
    <p style={{ marginBottom: 0 }}>{item.admin_response}</p>
  </div>
)}
{item.is_prayed && (
  <div
    style={{
      marginTop: "10px",
      color: "#15803d",
      fontWeight: "bold",
    }}
  >
    ✓ 함께 기도했습니다
  </div>
)}
      </div>
    ))
  )}
</div>
<div
  style={{
    marginTop: "40px",
    textAlign: "center",
  }}
>
  <Link
    href="/archive"
    style={{
      display: "inline-block",
      padding: "14px 22px",
      borderRadius: "999px",
      background: "#292524",
      color: "white",
      textDecoration: "none",
      fontSize: "15px",
    }}
  >
    이전 시편 묵상 보기
  </Link>
</div>
    </main>

  );

}