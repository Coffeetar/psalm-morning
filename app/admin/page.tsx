"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PsalmScheduleList from "@/components/PsalmScheduleList";
import PrayerRequestList from "@/components/PrayerRequestList";
import PsalmEditor from "@/components/PsalmEditor";
import {
  supabase,
} from "@/lib/supabaseClient";


export default function AdminPage() {
  const [prayerList, setPrayerList] = useState<any[]>([]);
  const [psalmReference, setPsalmReference] = useState("");
const [scheduleList, setScheduleList] = useState<any[]>([]);
const [psalmText, setPsalmText] = useState("");
const [reflectionText, setReflectionText] = useState("");
const [showPastPsalms, setShowPastPsalms] = useState(false);
const [prayerText, setPrayerText] = useState("");
const [adminMessage, setAdminMessage] = useState("");
const router = useRouter();
const [checkingLogin, setCheckingLogin] = useState(true);
const [imageUrl, setImageUrl] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);
const [isPublished, setIsPublished] = useState(false);
const [selectedDate, setSelectedDate] = useState(
  new Date().toISOString().slice(0, 10)
  
  
);

useEffect(() => {
  const loggedIn = localStorage.getItem("psalm_admin_logged_in");

  if (loggedIn !== "true") {
    router.push("/admin/login");
    return;
  }

  setCheckingLogin(false);
  loadPrayerRequests();
    loadTodayPsalmForAdmin();
    loadScheduleList();
}, [router]);
useEffect(() => {
  loadTodayPsalmForAdmin();
}, [selectedDate]);
useEffect(() => {
  loadScheduleList();
}, [showPastPsalms]);
async function uploadImage() {
  if (!imageFile) return "";

  const fileName =
    Date.now() + "-" + imageFile.name;

  const { error } = await supabase.storage
    .from("psalm-images")
    .upload(fileName, imageFile);

  if (error) {
    console.error(error);
    return "";
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("psalm-images")
    .getPublicUrl(fileName);

    setImageUrl(publicUrl);
  return publicUrl;
}


async function saveTodayPsalm() {
let finalImageUrl = imageUrl;

if (imageFile) {
  finalImageUrl =
    await uploadImage();
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
  async function loadTodayPsalmForAdmin() {
    
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
}
async function loadScheduleList() {
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
function handleLogout() {
  localStorage.removeItem("psalm_admin_logged_in");

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
     <PsalmScheduleList
  scheduleList={scheduleList}
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  showPastPsalms={showPastPsalms}
  setShowPastPsalms={setShowPastPsalms}
  deletePsalm={deletePsalm}
  getDayLabel={getDayLabel}
/>

  
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
  adminMessage={adminMessage}
/>
<p>
제출된 기도 제목 목록입니다.
</p>

<PrayerRequestList
  prayerList={prayerList}
  saveAdminResponse={saveAdminResponse}
  markAsPrayed={markAsPrayed}
  deletePrayerRequest={deletePrayerRequest}
/>
    </main>
  );
}