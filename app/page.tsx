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
import HomeInstallGuide from "@/components/HomeInstallGuide";
import AppSplashScreen from "@/components/AppSplashScreen";
import { supabase } from "@/lib/supabaseClient";
import type { DailyPsalm, WeeklyJourney } from "@/lib/types";
import {
  getReflectionStorageKey,
  getSeoulDateKey,
} from "@/lib/date";

export default function HomePage() {
  const [reflection, setReflection] = useState("");
  const [reflectionMessage, setReflectionMessage] = useState("");
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
      const splashStartedAt = Date.now();
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

      const remainingSplashTime = Math.max(
        0,
        1800 - (Date.now() - splashStartedAt)
      );

      window.setTimeout(() => setIsLoading(false), remainingSplashTime);
    }

    void loadHomeData();
  }, [reloadKey]);

function saveReflectionMemo() {
  const trimmedReflection = reflection.trim();

  if (!trimmedReflection) {
    setReflectionMessage("묵상을 먼저 입력해주세요.");
    return;
  }

  localStorage.setItem(
    getReflectionStorageKey(getSeoulDateKey()),
    trimmedReflection
  );
  setReflection(trimmedReflection);
  setReflectionMessage("묵상이 이 기기에 저장되었습니다.");
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
      crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();

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

  if (isLoading) {
    return <AppSplashScreen />;
  }

  if (homeError || !todayPsalm) {
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
          background: "#f8f5fa",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            background: "rgba(255,253,248,0.92)",
            border: "1px solid rgba(95,40,134,0.12)",
            borderRadius: "28px",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <h1>
            {homeError
                ? "잠시 연결이 원활하지 않습니다"
                : "오늘의 시편이 아직 준비 중입니다"}
          </h1>
          <p style={{ lineHeight: 1.7, color: "#57534e" }}>
            {homeError
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
                background: "#5f2886",
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
        padding: "40px",
        color: "#2b2430",
      }}
    >
      <div
        className="home-shell"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.7)",
          borderRadius: "34px",
          padding: "34px",
          boxShadow: "0 24px 70px rgba(63,35,76,0.13)",
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
          className="pm-share-button"
          onClick={async () => {
            const text = `${todayPsalm?.psalm_reference}

${todayPsalm?.psalm_text}

오늘의 묵상:
${todayPsalm?.reflection || ""}`;

            try {
              if (navigator.share) {
                await navigator.share({
                  title: `Psalm Morning · ${todayPsalm?.psalm_reference}`,
                  text,
                  url: window.location.origin,
                });
                setMessage("오늘의 시편을 공유했습니다.");
              } else {
                await navigator.clipboard.writeText(
                  `${text}\n\n${window.location.origin}`
                );
                setMessage("오늘의 시편과 링크가 클립보드에 복사되었습니다.");
              }
            } catch (error) {
              if (error instanceof DOMException && error.name === "AbortError") {
                return;
              }
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
            background: "linear-gradient(135deg, #5f2886, #7b42a0)",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          오늘의 시편 공유하기
        </button>

<ReflectionMemoCard
  reflection={reflection}
  setReflection={(value) => {
    setReflection(value);
    setHasSavedReflection(false);
    setReflectionMessage("");
  }}
  saveReflection={saveReflectionMemo}
  copyReflection={async () => {
    const trimmedReflection = reflection.trim();

    if (!trimmedReflection) {
      setReflectionMessage("복사할 묵상을 먼저 입력해주세요.");
      return;
    }

    const textToCopy =
      `Psalm Morning · ${todayPsalm?.psalm_reference}\n\n${trimmedReflection}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setReflectionMessage("묵상이 복사되었습니다.");
    } catch {
      const temporaryTextArea = document.createElement("textarea");
      temporaryTextArea.value = textToCopy;
      temporaryTextArea.setAttribute("readonly", "");
      temporaryTextArea.style.position = "fixed";
      temporaryTextArea.style.opacity = "0";
      document.body.appendChild(temporaryTextArea);
      temporaryTextArea.select();
      temporaryTextArea.setSelectionRange(0, temporaryTextArea.value.length);

      const didCopy = document.execCommand("copy");
      document.body.removeChild(temporaryTextArea);

      setReflectionMessage(
        didCopy
          ? "묵상이 복사되었습니다."
          : "복사하지 못했습니다. 묵상 내용을 길게 눌러 복사해주세요."
      );
    }
  }}
  isSaved={hasSavedReflection}
  statusMessage={reflectionMessage}
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
  onCopyTrackingCode={async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setMessage("추적 코드가 복사되었습니다.");
    } catch {
      setMessage("추적 코드를 길게 눌러 복사해주세요.");
    }
  }}
/>

        <HomeInstallGuide />
        <BottomNav />
      </div>
    </main>
  );
}
