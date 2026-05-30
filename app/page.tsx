"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [reflection, setReflection] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [message, setMessage] = useState("");
  const [trackingCode, setTrackingCode] = useState("");

  const [prayerList, setPrayerList] = useState<any[]>([]);
  const [todayPsalm, setTodayPsalm] = useState<any>(null);
  const [weeklyJourney, setWeeklyJourney] = useState<any[]>([]);
  const [debugMessage, setDebugMessage] = useState("");
  const todayWeekday =
  new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    }
  );

const todayJourney =
  weeklyJourney.find(
    (item) =>
      item.weekday ===
      todayWeekday
  );

  useEffect(() => {
    loadTodayPsalm();
    loadPrayerRequests();
    loadWeeklyJourney();
  }, []);

  async function loadTodayPsalm() {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

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

    setTodayPsalm(data);
  }

  async function loadPrayerRequests() {
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .order("created_at", { ascending: false });

if (error) {
  console.error(
    "Weekly journey load error:",
    JSON.stringify(error, null, 2)
  );

  return;
}

    setPrayerList(data || []);
  }

  async function loadWeeklyJourney() {
    const { data, error } = await supabase
      .from("weekly_psalm_journey")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setWeeklyJourney(data || []);
  }

  async function handlePrayerSubmit() {
    if (!prayerRequest.trim()) {
      setMessage("기도 제목을 먼저 입력해주세요.");
      return;
    }

    const newTrackingCode =
      "PM-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    const { error } = await supabase.from("prayer_requests").insert({
      request_text: prayerRequest,
      tracking_code: newTrackingCode,
    });

    if (error) {
      setMessage("저장 중 문제가 발생했습니다.");
      console.error(error);
      return;
    }

    setTrackingCode(newTrackingCode);
    localStorage.setItem("psalm_last_tracking_code", newTrackingCode);

    setMessage("기도 제목이 전달되었습니다.");
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
            운영자가 오늘의 말씀을 준비하고 있습니다
            <br />
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
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <p
            style={{
              fontSize: "14px",
              color: "#78716c",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Psalm Morning
          </p>

          <p style={{ marginTop: "8px", color: "#57534e" }}>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>

          <p
            style={{
              marginTop: "18px",
              lineHeight: 1.7,
              color: "#57534e",
              fontStyle: "italic",
            }}
          >
            Pause for a moment.
            <br />
            Let the Psalm guide your morning.
          </p>
        </div>

        {todayPsalm?.image_url && (
          <div style={{ marginBottom: "24px" }}>
            <img
              src={todayPsalm.image_url}
              alt={todayPsalm.psalm_reference || "Psalm image"}
              style={{
                width: "100%",
                borderRadius: "28px",
                objectFit: "cover",
                maxHeight: "420px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              }}
            />
          </div>
        )}

        <h2
          style={{
            textAlign: "center",
            fontSize: "30px",
            marginBottom: "24px",
          }}
        >
          {todayPsalm?.psalm_reference}
        </h2>

        <p
          style={{
            marginTop: "24px",
            marginBottom: "10px",
            fontWeight: "bold",
            color: "#57534e",
            letterSpacing: "1px",
          }}
        >
          Psalm Text
        </p>

        <div
          style={{
            marginTop: "20px",
            padding: "24px",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.75)",
            lineHeight: 1.9,
            fontSize: "18px",
            whiteSpace: "pre-line",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          “{todayPsalm?.psalm_text || ""}”
        </div>

        <div
          style={{
            background: "#fefce8",
            padding: "20px",
            borderRadius: "20px",
            marginTop: "20px",
          }}
        >
          <h3>Reflection</h3>
          <p style={{ lineHeight: 1.7 }}>
            {todayPsalm?.reflection || "오늘의 묵상이 아직 등록되지 않았습니다."}
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
          <h3>Morning Prayer</h3>
          <p style={{ lineHeight: 1.7 }}>
            {todayPsalm?.prayer || "오늘의 기도문이 아직 등록되지 않았습니다."}
          </p>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            borderRadius: "20px",
            background: "#fefce8",
          }}
        >
          {weeklyJourney.length > 0 && (
  <div
    style={{
      marginBottom: "20px",
      padding: "22px",
      borderRadius: "24px",
      background:
        "linear-gradient(to right, #fef9c3, #dcfce7)",
      textAlign: "center",
    }}
  >
    <p
      style={{
        fontSize: "13px",
        letterSpacing: "2px",
        color: "#57534e",
        textTransform: "uppercase",
      }}
    >
      Weekly Theme
    </p>

    <h2
      style={{
        marginTop: "10px",
        marginBottom: "10px",
      }}
    >
      {weeklyJourney[0]?.theme}
    </h2>

    <p
      style={{
        color: "#57534e",
        lineHeight: 1.7,
      }}
    >
      이번 한 주 함께 걸어갈
      시편의 여정입니다.
    </p>
  </div>
)}
{weeklyJourney[0]
  ?.theme_image_url && (
  <img
    src={
      weeklyJourney[0]
        .theme_image_url
    }
    alt="Weekly Theme"
    style={{
      width: "100%",
      borderRadius: "20px",
      marginTop: "16px",
      marginBottom: "16px",
      maxHeight: "240px",
      objectFit: "cover",
    }}
  />
)}
          <h3>이번 주 시편 여정</h3>

          <p style={{ color: "#78716c", marginTop: "8px" }}>
            {weeklyJourney[0]?.theme || ""}
          </p>

          {weeklyJourney.map((item) => {
            const today = new Date().toLocaleDateString("en-US", {
              weekday: "long",
            });

            const isToday = today === item.weekday;

            return (
              <div
                key={item.id}
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  borderRadius: "12px",
                  background: isToday ? "#fde68a" : "transparent",
                }}
              >
                <strong>
                  {isToday ? "● " : "○ "}
                  {item.weekday}
                </strong>
                {" : "}
                {item.psalm_reference}
              </div>
            );
          })}
        </div>
{todayJourney && (
  <div
    style={{
      marginTop: "20px",
      padding: "22px",
      borderRadius: "22px",
      background: "#fff7ed",
      border:
        "1px solid #fdba74",
    }}
  >
    <p
      style={{
        color: "#9a3412",
        fontWeight: "bold",
      }}
    >
      오늘의 여정
    </p>

    <h3
      style={{
        marginTop: "10px",
      }}
    >
      {
        todayJourney
          .psalm_reference
      }
    </h3>

    <p
      style={{
        marginTop: "10px",
        color: "#57534e",
      }}
    >
      이번 주 여정 가운데
      오늘 함께 걸을 시편입니다.
    </p>
  </div>
)}
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
            marginTop: "24px",
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

        <div style={{ marginTop: "24px" }}>
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

          <p
            style={{
              color: "#78716c",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            오늘 아침 마음에 남은 기도 제목을 조용히 남겨주세요.
          </p>

          <textarea
            value={prayerRequest}
            onChange={(e) => setPrayerRequest(e.target.value)}
            placeholder="함께 기도하기 원하는 제목을 남겨주세요."
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "16px",
              borderRadius: "18px",
              border: "1px solid #d6d3d1",
              fontSize: "16px",
              lineHeight: 1.6,
              background: "rgba(255,255,255,0.85)",
            }}
          />

          <button
            onClick={handlePrayerSubmit}
            style={{
              marginTop: "14px",
              width: "100%",
              padding: "15px",
              borderRadius: "999px",
              border: "none",
              background: "#292524",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
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

            {trackingCode && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  borderRadius: "20px",
                  background: "#ecfccb",
                  textAlign: "center",
                }}
              >
                <p style={{ fontWeight: "bold", marginBottom: "12px" }}>
                  기도 제목이 저장되었습니다
                </p>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                  }}
                >
                  {trackingCode}
                </div>

                <p
                  style={{
                    marginTop: "12px",
                    color: "#57534e",
                    lineHeight: 1.6,
                  }}
                >
                  이 코드를 저장해두시면
                  <br />
                  나중에 “내 기도”에서 확인할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        )}

        <BottomNav />
      </div>
    </main>
  );
}