"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import HomeHeader from "@/components/HomeHeader";
import PsalmTextCard from "@/components/PsalmTextCard";
import PsalmImageCard from "@/components/PsalmImageCard";
import ReflectionCard from "@/components/ReflectionCard";
import MorningPrayerCard from "@/components/MorningPrayerCard";
import ReflectionMemoCard from "@/components/ReflectionMemoCard";
import PrayerRequestCard from "@/components/PrayerRequestCard";
import PrayerSuccessMessage from "@/components/PrayerSuccessMessage";
import WeeklyJourneyCard
from "@/components/WeeklyJourneyCard";
import TodaysJourneyCard from "@/components/TodaysJourneyCard";
import { supabase } from "@/lib/supabaseClient";
import type { DailyPsalm, WeeklyJourney } from "@/lib/types";
import {
  getReflectionStorageKey,
  getSeoulDateKey,
} from "@/lib/date";

export default function HomePage() {
  const [reflection, setReflection] = useState("");
  const [hasSavedReflection, setHasSavedReflection] =
  useState(false);
  const [prayerRequest, setPrayerRequest] = useState("");
  const [message, setMessage] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
const [hasSubmittedPrayer, setHasSubmittedPrayer] =
  useState(false);
  const [todayPsalm, setTodayPsalm] = useState<DailyPsalm | null>(null);
  const [weeklyJourney, setWeeklyJourney] = useState<WeeklyJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [homeError, setHomeError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [isSubmittingPrayer, setIsSubmittingPrayer] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      const today = getSeoulDateKey();

      const [psalmResult, journeyResult] = await Promise.all([
        supabase
          .from("daily_psalms")
          .select("*")
          .eq("devotional_date", today)
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("weekly_psalm_journey")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false }),
      ]);

      if (psalmResult.error) {
        setHomeError("오늘의 시편을 불러오지 못했습니다.");
        setTodayPsalm(null);
      } else {
        setTodayPsalm(psalmResult.data);
        setHomeError("");
      }

      if (journeyResult.error) {
        console.error(journeyResult.error);
      } else {
        setWeeklyJourney(journeyResult.data || []);
      }

      const savedReflection = localStorage.getItem(
        getReflectionStorageKey(today)
      );

      if (savedReflection) {
        setReflection(savedReflection);
        setHasSavedReflection(true);
      }

      setIsLoading(false);
    }

    void loadHomeData();
  }, [reloadKey]);

function saveReflectionMemo() {
  const trimmedReflection = reflection.trim();

  if (!trimmedReflection) {
    setMessage("묵상을 먼저 입력해주세요.");
    return;
  }

  localStorage.setItem(
    getReflectionStorageKey(getSeoulDateKey()),
    trimmedReflection
  );
  setReflection(trimmedReflection);
  setMessage("묵상이 저장되었습니다.");
  setHasSavedReflection(true);
}
  async function handlePrayerSubmit() {
    const trimmedPrayerRequest = prayerRequest.trim();

    if (!trimmedPrayerRequest) {
      setMessage("기도 제목을 먼저 입력해주세요.");
      return;
    }

    if (isSubmittingPrayer) return;

    setIsSubmittingPrayer(true);
    setMessage("");

    const newTrackingCode =
      "PM-" +
      crypto.randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase();

    const { error } = await supabase.from("prayer_requests").insert({
      request_text: trimmedPrayerRequest,
      tracking_code: newTrackingCode,
    });

    if (error) {
      setMessage("저장 중 문제가 발생했습니다.");
      console.error(error);
      setIsSubmittingPrayer(false);
      return;
    }

    setTrackingCode(newTrackingCode);
    setHasSubmittedPrayer(true);
    localStorage.setItem("psalm_last_tracking_code", newTrackingCode);

    setMessage("기도 제목이 전달되었습니다.");
    setPrayerRequest("");
    setIsSubmittingPrayer(false);
  }

  if (isLoading || homeError || !todayPsalm) {
    return (
      <main
        className="home-state"
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
          <h1>
            {isLoading
              ? "오늘의 시편을 불러오고 있습니다"
              : homeError
                ? "잠시 연결이 원활하지 않습니다"
                : "오늘의 시편이 아직 준비 중입니다"}
          </h1>
          <p style={{ lineHeight: 1.7, color: "#57534e" }}>
            {isLoading
              ? "잠시만 기다려주세요."
              : homeError
                ? homeError
                : "운영자가 오늘의 말씀을 준비하고 있습니다."}
          </p>

          {homeError && (
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setHomeError("");
                setReloadKey((value) => value + 1);
              }}
              style={{
                marginTop: "16px",
                padding: "12px 18px",
                border: 0,
                borderRadius: "14px",
                background: "#292524",
                color: "white",
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main
      className="home-main"
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
        className="home-shell"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.75)",
          borderRadius: "32px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
<HomeHeader />

<PsalmImageCard
  imageUrl={todayPsalm?.image_url || undefined}
  alt={todayPsalm?.psalm_reference || "Psalm image"}
/>

<PsalmTextCard
  psalmReference={todayPsalm?.psalm_reference || ""}
  psalmText={todayPsalm?.psalm_text || ""}
/>

<ReflectionCard
  reflection={todayPsalm?.reflection || ""}
/>

<MorningPrayerCard
  prayer={todayPsalm?.prayer || ""}
/>

<WeeklyJourneyCard
  weeklyJourney={weeklyJourney}
/>
<TodaysJourneyCard
  hasPsalm={!!todayPsalm}
  hasReflection={
  reflection.trim().length > 0 ||
  hasSavedReflection
}
  hasPrayerRequest={
  trackingCode.trim().length > 0 ||
  hasSubmittedPrayer
}
/>

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

<ReflectionMemoCard
  reflection={reflection}
  setReflection={(value) => {
    setReflection(value);
    setHasSavedReflection(false);
  }}
  saveReflection={saveReflectionMemo}
  isSaved={hasSavedReflection}
/>

<PrayerRequestCard
  prayerRequest={prayerRequest}
  setPrayerRequest={setPrayerRequest}
  handlePrayerSubmit={handlePrayerSubmit}
  isSubmitting={isSubmittingPrayer}
/>

<PrayerSuccessMessage
  message={message}
  trackingCode={trackingCode}
/>

        <BottomNav />
      </div>
    </main>
  );
}
