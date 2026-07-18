"use client";


import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PsalmScheduleList from "@/components/PsalmScheduleList";
import PrayerRequestList from "@/components/PrayerRequestList";
import PsalmEditor from "@/components/PsalmEditor";
import AdminDashboard from "@/components/AdminDashboard";
import {
  supabase,
} from "@/lib/supabaseClient";
import type { Announcement, DailyPsalm, PrayerRequest } from "@/lib/types";


export default function AdminPage() {
    
  const [prayerList, setPrayerList] = useState<PrayerRequest[]>([]);
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
  const [psalmReference, setPsalmReference] = useState("");
const [scheduleList, setScheduleList] = useState<DailyPsalm[]>([]);
const [psalmText, setPsalmText] = useState("");
const [reflectionText, setReflectionText] = useState("");
const [showPastPsalms, setShowPastPsalms] = useState(false);
const [prayerText, setPrayerText] = useState("");
const [adminMessage, setAdminMessage] = useState("");
const [
  announcementTitle,
  setAnnouncementTitle,
] = useState("");

const [
  announcementContent,
  setAnnouncementContent,
] = useState("");

const [
  announcementLink,
  setAnnouncementLink,
] = useState("");
const [
  journeyTheme,
  setJourneyTheme,
] = useState("");
const [
  journeyIntroduction,
  setJourneyIntroduction,
] = useState("");
const [
  journeyThemeImage,
  setJourneyThemeImage,
] = useState("");

const [
  mondayPsalm,
  setMondayPsalm,
] = useState("");

const [
  tuesdayPsalm,
  setTuesdayPsalm,
] = useState("");

const [
  wednesdayPsalm,
  setWednesdayPsalm,
] = useState("");

const [
  thursdayPsalm,
  setThursdayPsalm,
] = useState("");

const [
  fridayPsalm,
  setFridayPsalm,
] = useState("");

const [
  saturdayPsalm,
  setSaturdayPsalm,
] = useState("");

const [
  sundayPsalm,
  setSundayPsalm,
] = useState("");
const router = useRouter();
const [checkingLogin, setCheckingLogin] = useState(true);
const [imageUrl, setImageUrl] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);
const [isPublished, setIsPublished] = useState(false);
const [prayerSearch, setPrayerSearch] = useState("");
const [reflectionStyle, setReflectionStyle] =
  useState("general");
  const [aiVersion, setAiVersion] =
  useState(1);
  const [, setImagePrompt] = useState("");
const [
  isAiLocked,
  setIsAiLocked,
] = useState(false);
const [prayerFilter] = useState(
  "all"
);
const [selectedDate, setSelectedDate] = useState(
  new Date().toISOString().slice(0, 10)
);

const ADMIN_EMAIL = "prnate7936@gmail.com";


async function uploadImage(): Promise<string> {
  if (!imageFile) return "";

const safeFileName = imageFile.name
  .toLowerCase()
  .replace(/[^a-z0-9.]/g, "-");

const fileName = `${Date.now()}-${safeFileName}`;

  const { error } = await supabase.storage
    .from("psalm-images")
    .upload(fileName, imageFile);

if (error) {
  console.error(
    "Schedule load error:",
    error.message,
    error
  );

  setAdminMessage(
    "시편 일정 불러오기 중 문제가 발생했습니다."
  );

  return"";
}

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("psalm-images")
    .getPublicUrl(fileName);

    setImageUrl(publicUrl);
  return publicUrl;
}

async function saveWeeklyJourney() {
    setAdminMessage("saveWeeklyJourney 함수가 실행되었습니다.");
    setAdminMessage(
  `저장 직전 안내문: ${journeyIntroduction || "비어 있음"}`
);
  const rows = [
    { weekday: "Monday", psalm_reference: mondayPsalm },
    { weekday: "Tuesday", psalm_reference: tuesdayPsalm },
    { weekday: "Wednesday", psalm_reference: wednesdayPsalm },
    { weekday: "Thursday", psalm_reference: thursdayPsalm },
    { weekday: "Friday", psalm_reference: fridayPsalm },
    { weekday: "Saturday", psalm_reference: saturdayPsalm },
    { weekday: "Sunday", psalm_reference: sundayPsalm },
  ]
    .filter((item) => item.psalm_reference.trim() !== "")
    .map((item) => ({
      ...item,
      theme: journeyTheme,
      theme_image_url:
  journeyThemeImage,
  introduction:
journeyIntroduction,
      is_published: true,
    }));

  if (rows.length === 0) {
    setAdminMessage("저장할 시편 여정을 입력해주세요.");
    return;
  }
const { error: deleteError } = await supabase
  .from("weekly_psalm_journey")
  .delete()
  .eq("is_published", true);

if (deleteError) {
  console.error("Weekly journey delete error:", deleteError);

  setAdminMessage(
    `기존 주간 여정 삭제 실패: ${deleteError.message}`
  );

  return;
}
const { data, error } = await supabase
  .from("weekly_psalm_journey")
  .insert(rows)
  .select("weekday, psalm_reference, theme, introduction");

  if (error) {
console.error(
  "Weekly journey save error:",
  JSON.stringify(error, null, 2)
);

    setAdminMessage(
      `주간 여정 저장 실패: ${error.message}`
    );

    return;
  }
setAdminMessage(
  `주간 시편 여정 저장 완료: ${JSON.stringify(data)}`
);
  setJourneyTheme("");
setJourneyThemeImage("");
setJourneyIntroduction("");
setMondayPsalm("");
setTuesdayPsalm("");
setWednesdayPsalm("");
setThursdayPsalm("");
setFridayPsalm("");
setSaturdayPsalm("");
setSundayPsalm("");
}
async function saveAnnouncement() {
  if (!announcementTitle.trim() || !announcementContent.trim()) {
    setAdminMessage("공지 제목과 내용을 입력해주세요.");
    return;
  }

  const { error } =
    await supabase
      .from("announcements")
      .insert({
        title:
          announcementTitle.trim(),

        content:
          announcementContent.trim(),

        link_url:
          announcementLink.trim() || null,

        is_published: true,
      });

if (error) {
  setAdminMessage(
    `공지 저장 실패: ${error.message}`
  );

  return;
}

  setAdminMessage(
    "공지 저장 완료"
  );

  setAnnouncementTitle("");
  setAnnouncementContent("");
  setAnnouncementLink("");
  await loadAnnouncements();
}

async function saveTodayPsalm() {
let finalImageUrl: string = imageUrl || "";

if (imageFile) {
  finalImageUrl = await uploadImage();
}
  const today = selectedDate;

  if (!psalmReference.trim() || !psalmText.trim()) {
    setAdminMessage("시편 구절과 본문을 입력해주세요.");
    return;
  }

const { error } = await supabase
  .from("daily_psalms")
  .upsert(
    {
      devotional_date: today,
      psalm_reference: psalmReference,
      psalm_text: psalmText,
      reflection: reflectionText,
      prayer: prayerText,
      image_url: finalImageUrl,
      is_published: isPublished,
    },
    {
      onConflict: "devotional_date",
    }
  );
if (error) {
  setAdminMessage(
    `오늘의 시편 저장 중 문제가 발생했습니다: ${error.message}`
  );
  return;
}

  setAdminMessage("오늘의 시편이 저장되었습니다.");
  await loadScheduleList();
  setImageFile(null);
}
  const loadPrayerRequests = useCallback(async () => {
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPrayerList(data || []);
  }, []);

  const loadAnnouncements = useCallback(async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setAdminMessage("공지 목록을 불러오는 중 문제가 발생했습니다.");
      return;
    }

    setAnnouncementList((data || []) as Announcement[]);
  }, []);

  const loadTodayPsalmForAdmin = useCallback(async () => {
    
const today = selectedDate;

  const { data, error } = await supabase
    .from("daily_psalms")
    .select("*")
    .eq("devotional_date", today)
    .single();

 if (error) {
  setPsalmReference("");
  setPsalmText("");
  setReflectionText("");
  setPrayerText("");
  setImageUrl("");
  setImageFile(null);
  setAdminMessage("선택한 날짜에 등록된 시편이 없습니다. 새로 입력할 수 있습니다.");
  return;
}

  setPsalmReference(data.psalm_reference || "");
  setPsalmText(data.psalm_text || "");
  setReflectionText(data.reflection || "");
  setPrayerText(data.prayer || "");
  setImageUrl(data.image_url || "");
  setIsPublished(
  data.is_published || false
);
}, [selectedDate]);

const loadScheduleList = useCallback(async () => {
  const today = new Date().toISOString().slice(0, 10);

  let query = supabase
    .from("daily_psalms")
    .select("*")
    .order("devotional_date", { ascending: true })
    .limit(20);

  if (!showPastPsalms) {
    query = query.gte("devotional_date", today);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  setScheduleList(data || []);
}, [showPastPsalms]);

useEffect(() => {
  async function checkSession() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/admin/login");
      return;
    }

    if (data.user.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      router.push("/admin/login");
      return;
    }

    setCheckingLogin(false);
    void loadPrayerRequests();
    void loadAnnouncements();
    void loadTodayPsalmForAdmin();
    void loadScheduleList();
  }

  void checkSession();
}, [
  loadPrayerRequests,
  loadAnnouncements,
  loadScheduleList,
  loadTodayPsalmForAdmin,
  router,
]);

useEffect(() => {
  async function refreshSelectedPsalm() {
    const { data, error } = await supabase
      .from("daily_psalms")
      .select("*")
      .eq("devotional_date", selectedDate)
      .single();

    if (error) {
      setPsalmReference("");
      setPsalmText("");
      setReflectionText("");
      setPrayerText("");
      setImageUrl("");
      setImageFile(null);
      setAdminMessage(
        "선택한 날짜에 등록된 시편이 없습니다. 새로 입력할 수 있습니다."
      );
      return;
    }

    setPsalmReference(data.psalm_reference || "");
    setPsalmText(data.psalm_text || "");
    setReflectionText(data.reflection || "");
    setPrayerText(data.prayer || "");
    setImageUrl(data.image_url || "");
    setIsPublished(data.is_published || false);
  }

  void refreshSelectedPsalm();
}, [selectedDate]);

useEffect(() => {
  async function refreshSchedule() {
    const today = new Date().toISOString().slice(0, 10);
    let query = supabase
      .from("daily_psalms")
      .select("*")
      .order("devotional_date", { ascending: true })
      .limit(20);

    if (!showPastPsalms) {
      query = query.gte("devotional_date", today);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      return;
    }

    setScheduleList(data || []);
  }

  void refreshSchedule();
}, [showPastPsalms]);

async function saveAdminResponse(id: string, response: string) {
  const { error } = await supabase
    .from("prayer_requests")
    .update({
      admin_response: response,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    setAdminMessage("응답 저장 중 문제가 발생했습니다.");
    return;
  }

  setAdminMessage("운영자 응답이 저장되었습니다.");
  await loadPrayerRequests();
}

async function deleteAnnouncement(id: string, title: string) {
  const confirmed = confirm(`"${title}" 공지를 삭제하시겠습니까?`);

  if (!confirmed) return;

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    setAdminMessage("공지 삭제 중 문제가 발생했습니다.");
    return;
  }

  setAdminMessage("공지가 삭제되었습니다.");
  await loadAnnouncements();
}

async function generateAiDraft() {
    if (isAiLocked) {
  setAdminMessage(
    "AI 초안이 잠겨 있습니다."
  );

  return;
}
  if (!psalmReference.trim() || !psalmText.trim()) {
    setAdminMessage("시편 구절과 본문을 먼저 입력해주세요.");
    return;
  }

  setAdminMessage("AI 초안을 생성하는 중입니다...");

let response;

try {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    setAdminMessage("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
    return;
  }

  response = await fetch("/api/generate-devotional", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
body: JSON.stringify({
  psalmReference,
  psalmText,
  reflectionStyle,
})
  });
} catch (error) {
  console.error(error);
  setAdminMessage("AI 서버에 연결하지 못했습니다.");
  return;
}

const text = await response.text();

let data;

try {
  data = JSON.parse(text);
} catch {
  console.error("Non-JSON response:", text);
  setAdminMessage("AI 서버가 올바른 응답을 보내지 않았습니다.");
  return;
}

  if (!response.ok) {
    setAdminMessage(data.error || "AI 초안 생성 중 문제가 발생했습니다.");
    return;
  }

setReflectionText(
  data.reflection || ""
);

setPrayerText(
  data.prayer || ""
);
setImagePrompt(
  data.imagePrompt || ""
);

setAiVersion(
  (prev) => prev + 1
);

setAdminMessage(
  "AI 초안이 생성되었습니다. 검토 후 저장해주세요."
);
}
if (checkingLogin) {
  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <p>관리자 로그인 상태를 확인하는 중입니다...</p>
    </main>
  );
}
async function deletePsalm(date: string) {
  const confirmed = confirm(
    `${date} 시편을 삭제하시겠습니까?`
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("daily_psalms")
    .delete()
    .eq("devotional_date", date);

  if (error) {
    console.error(error);

    setAdminMessage(
      "삭제 중 문제가 발생했습니다."
    );

    return;
  }

  setAdminMessage(
    "시편이 삭제되었습니다."
  );

  await loadScheduleList();

  if (selectedDate === date) {
    setPsalmReference("");
    setPsalmText("");
    setReflectionText("");
    setPrayerText("");
    setImageUrl("");
    setImageFile(null);
  }
}
async function markAsPrayed(id: string) {
  const { error } = await supabase
    .from("prayer_requests")
    .update({
      is_prayed: true,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  setAdminMessage(
    "기도 완료로 표시되었습니다."
  );

  await loadPrayerRequests();
}
async function deletePrayerRequest(id: string) {
  const confirmed = confirm("이 기도 제목을 삭제하시겠습니까?");

  if (!confirmed) return;

  const { error } = await supabase
    .from("prayer_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    setAdminMessage("기도 제목 삭제 중 문제가 발생했습니다.");
    return;
  }

  setAdminMessage("기도 제목이 삭제되었습니다.");
  await loadPrayerRequests();
}
async function handleLogout() {
  await supabase.auth.signOut();

  router.push("/admin/login");
}
function moveSelectedDate(days: number) {
  const currentDate = new Date(selectedDate);
  currentDate.setDate(currentDate.getDate() + days);

  setSelectedDate(currentDate.toISOString().slice(0, 10));
}
function getDayLabel(dateString: string) {
  const today = new Date();
  const targetDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "내일";
  if (diffDays > 1) return `+${diffDays}일`;

  return `${Math.abs(diffDays)}일 전`;
}

  return (
    
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Psalm Morning Admin</h1>
<AdminDashboard
imageUrl={imageUrl}
  selectedDate={selectedDate}
  psalmReference={psalmReference}
  isPublished={isPublished}
  prayerList={prayerList}
  onGenerateAiDraft={generateAiDraft}
/>
            <button
  onClick={handleLogout}
  style={{
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#b91c1c",
    color: "white",
    cursor: "pointer",
  }}
>
  로그아웃
</button>
<section
  id="announcement-section"
  style={{
    marginTop: "30px",
    marginBottom: "40px",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "20px",
    background: "#f8fafc",
  }}
>
  <h2>공지 작성</h2>

  <input
    value={announcementTitle}
    onChange={(e) => setAnnouncementTitle(e.target.value)}
    placeholder="공지 제목"
    style={{
      width: "100%",
      padding: "14px",
      marginTop: "12px",
      borderRadius: "12px",
      border: "1px solid #ccc",
    }}
  />

  <textarea
    value={announcementContent}
    onChange={(e) => setAnnouncementContent(e.target.value)}
    placeholder="공지 내용"
    style={{
      width: "100%",
      minHeight: "100px",
      padding: "14px",
      marginTop: "12px",
      borderRadius: "12px",
      border: "1px solid #ccc",
    }}
  />

  <input
    value={announcementLink}
    onChange={(e) => setAnnouncementLink(e.target.value)}
    placeholder="관련 링크 URL"
    style={{
      width: "100%",
      padding: "14px",
      marginTop: "12px",
      borderRadius: "12px",
      border: "1px solid #ccc",
    }}
  />

  <button
    type="button"
    onClick={saveAnnouncement}
    style={{
      marginTop: "14px",
      padding: "12px 18px",
      borderRadius: "12px",
      border: "none",
      background: "#7c3aed",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    공지 저장
  </button>

  <div style={{ marginTop: "28px" }}>
    <h3 style={{ marginBottom: "12px" }}>
      기존 공지 ({announcementList.length})
    </h3>

    {announcementList.length === 0 ? (
      <p style={{ color: "#64748b" }}>등록된 공지가 없습니다.</p>
    ) : (
      <div style={{ display: "grid", gap: "12px" }}>
        {announcementList.map((announcement) => (
          <article
            key={announcement.id}
            style={{
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              background: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <h4 style={{ margin: 0 }}>{announcement.title}</h4>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#475569",
                    whiteSpace: "pre-line",
                    overflowWrap: "anywhere",
                  }}
                >
                  {announcement.content}
                </p>
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  {new Intl.DateTimeFormat("ko-KR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Seoul",
                  }).format(new Date(announcement.created_at))}
                  {" · "}
                  {announcement.is_published ? "공개 중" : "비공개"}
                </p>
                {announcement.link_url && (
                  <a
                    href={announcement.link_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "8px",
                      color: "#2563eb",
                      overflowWrap: "anywhere",
                    }}
                  >
                    관련 링크 열기
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  void deleteAnnouncement(
                    announcement.id,
                    announcement.title
                  )
                }
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                삭제
              </button>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
</section>
<section
  id="weekly-journey-section"
  style={{
    marginTop: "30px",
    marginBottom: "40px",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "20px",
    background: "#fefce8",
  }}
>
  <h2>이번 주 시편 여정</h2>

  <input
    value={journeyTheme}
    onChange={(e) => setJourneyTheme(e.target.value)}
    placeholder="예: 늦봄의 소망"
    style={{
      width: "100%",
      padding: "14px",
      marginTop: "12px",
      borderRadius: "12px",
      border: "1px solid #ccc",
    }}
  />

  <input
    value={journeyThemeImage}
    onChange={(e) => setJourneyThemeImage(e.target.value)}
    placeholder="테마 이미지 URL"
    style={{
      width: "100%",
      padding: "14px",
      marginTop: "12px",
      borderRadius: "12px",
      border: "1px solid #ccc",
    }}
  />

  <textarea
    value={journeyIntroduction}
    onChange={(e) => setJourneyIntroduction(e.target.value)}
    placeholder="이번 주 묵상 안내문"
    style={{
      width: "100%",
      minHeight: "120px",
      padding: "14px",
      marginTop: "12px",
      borderRadius: "12px",
      border: "1px solid #ccc",
      fontSize: "15px",
    }}
  />

  <input
    value={mondayPsalm}
    onChange={(e) => setMondayPsalm(e.target.value)}
    placeholder="월요일"
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "12px",
    }}
  />

  <input
    value={tuesdayPsalm}
    onChange={(e) => setTuesdayPsalm(e.target.value)}
    placeholder="화요일"
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "10px",
    }}
  />

  <input
    value={wednesdayPsalm}
    onChange={(e) => setWednesdayPsalm(e.target.value)}
    placeholder="수요일"
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "10px",
    }}
  />

  <input
    value={thursdayPsalm}
    onChange={(e) => setThursdayPsalm(e.target.value)}
    placeholder="목요일"
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "10px",
    }}
  />

  <input
    value={fridayPsalm}
    onChange={(e) => setFridayPsalm(e.target.value)}
    placeholder="금요일"
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "10px",
    }}
  />

  <input
    value={saturdayPsalm}
    onChange={(e) => setSaturdayPsalm(e.target.value)}
    placeholder="토요일"
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "10px",
    }}
  />

  <input
    value={sundayPsalm}
    onChange={(e) => setSundayPsalm(e.target.value)}
    placeholder="주일"
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "10px",
    }}
  />

  <button
    type="button"
    onClick={saveWeeklyJourney}
    style={{
      marginTop: "16px",
      padding: "12px 18px",
      borderRadius: "12px",
      border: "none",
      background: "#ca8a04",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    주간 여정 저장
  </button>
</section>
     <PsalmScheduleList
  scheduleList={scheduleList}
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  showPastPsalms={showPastPsalms}
  setShowPastPsalms={setShowPastPsalms}
  deletePsalm={deletePsalm}
  getDayLabel={getDayLabel}
/>

  <div id="today-psalm-section"></div>
<PsalmEditor
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  psalmReference={psalmReference}
  setPsalmReference={setPsalmReference}
  psalmText={psalmText}
  setPsalmText={setPsalmText}
  reflectionText={reflectionText}
  setReflectionText={setReflectionText}
  prayerText={prayerText}
  setPrayerText={setPrayerText}
  imageUrl={imageUrl}
  setImageUrl={setImageUrl}
  setImageFile={setImageFile}
  isPublished={isPublished}
  setIsPublished={setIsPublished}
  saveTodayPsalm={saveTodayPsalm}
  moveSelectedDate={moveSelectedDate}
  generateAiDraft={generateAiDraft}
  reflectionStyle={reflectionStyle}

setReflectionStyle={
  setReflectionStyle
}
  aiVersion={aiVersion}
  isAiLocked={isAiLocked}

setIsAiLocked={
  setIsAiLocked
}
  adminMessage={adminMessage}
/>
<p>
제출된 기도 제목 목록입니다.
</p>
<input
  value={prayerSearch}
  onChange={(e) => setPrayerSearch(e.target.value)}
  placeholder="기도 제목 검색"
  style={{
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ccc",
    marginTop: "20px",
  }}
/>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginTop: "20px",
    marginBottom: "20px",
  }}
>

<div
style={{
padding:"16px",
borderRadius:"16px",
background:"#dbeafe",
}}
>
<strong>전체</strong>
<p>{prayerList.length}</p>
</div>

<div
style={{
padding:"16px",
borderRadius:"16px",
background:"#fef3c7",
}}
>
<strong>미기도</strong>
<p>
{
prayerList.filter(
(item)=>!item.is_prayed
).length
}
</p>
</div>

<div
style={{
padding:"16px",
borderRadius:"16px",
background:"#dcfce7",
}}
>
<strong>완료</strong>
<p>
{
prayerList.filter(
(item)=>item.is_prayed
).length
}
</p>
</div>

<div
style={{
padding:"16px",
borderRadius:"16px",
background:"#ede9fe",
}}
>
<strong>새 응답</strong>
<p>
{
prayerList.filter(
(item)=>
item.admin_response &&
!item.is_response_read
).length
}
</p>
</div>

</div>
<PrayerRequestList
prayerList={
  prayerList.filter(
    (item) => {
const matchesSearch =
  item.request_text
    ?.toLowerCase()
    .includes(prayerSearch.toLowerCase());

if (!matchesSearch) {
  return false;
}

      if (
        prayerFilter ===
        "pending"
      ) {
        return !item.is_prayed;
      }

      if (
        prayerFilter ===
        "done"
      ) {
        return item.is_prayed;
      }

      if (
        prayerFilter ===
        "new-response"
      ) {
        return (
          item.admin_response &&
          !item.is_response_read
        );
      }

      return true;
    }
  )
}
  saveAdminResponse={saveAdminResponse}
  markAsPrayed={markAsPrayed}
  deletePrayerRequest={deletePrayerRequest}
/>
    </main>
  );
}
