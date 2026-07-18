"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import {
  supabase,
} from "@/lib/supabaseClient";
import type { DailyPsalm } from "@/lib/types";
import { formatKoreanDate } from "@/lib/date";


export default function ArchivePage() {
  const [psalms, setPsalms] = useState<DailyPsalm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadPsalms() {
      const { data, error } = await supabase
        .from("daily_psalms")
        .select("*")
        .eq("is_published", true)
        .order("devotional_date", { ascending: false });

      if (error) {
        console.error(error);
        setErrorMessage("보관함을 불러오지 못했습니다.");
        setIsLoading(false);
        return;
      }

      setPsalms(data || []);
      setErrorMessage("");
      setIsLoading(false);
    }

    void loadPsalms();
  }, [reloadKey]);

  return (
    
    <main
      className="page-main"
    
      style={{
        minHeight: "100vh",
      }}
    >
      <div className="page-shell pm-page-shell">
        <p className="pm-eyebrow">
          PSALM MORNING
        </p>

        <h1 className="pm-page-title">지난 시편</h1>
        <p className="pm-page-intro">
          지나온 아침의 말씀과 묵상을 다시 천천히 만나보세요.
        </p>

        {isLoading ? (
          <p role="status">보관함을 불러오고 있습니다...</p>
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
        ) : psalms.length === 0 ? (
          <p>아직 등록된 시편이 없습니다.</p>
        ) : (
          psalms.map((psalm, index) => (
          <Link
  key={psalm.id}
  href={`/archive/${psalm.devotional_date}`}
  className="pm-list-card"
  style={{
    display: "block",
    marginTop: "16px",
    padding: "22px",
    borderRadius: "20px",
    background: "rgba(255,253,248,0.92)",
    border: "1px solid rgba(95,40,134,0.12)",
    boxShadow: "0 10px 26px rgba(63,35,76,0.07)",
    color: "inherit",
    textDecoration: "none",
  }}
>
    {psalm.image_url && (
  <Image
    src={psalm.image_url}
    alt={psalm.psalm_reference}
    width={1200}
    height={800}
    unoptimized
    loading={index === 0 ? "eager" : "lazy"}
    style={{
      width: "100%",
      height: "auto",
      borderRadius: "18px",
      marginBottom: "16px",
    }}
  />
)}
              <p style={{ color: "#7b42a0", fontSize: "14px", fontWeight: 650 }}>
                {formatKoreanDate(psalm.devotional_date)}
              </p>

              <h2 style={{ color: "#3f1d57" }}>{psalm.psalm_reference}</h2>

              <p
                style={{
                  lineHeight: 1.7,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  color: "#554d59",
                }}
              >
                {psalm.reflection || "묵상이 등록되지 않았습니다."}
              </p>
            </Link>
            
          ))
        )}
        <BottomNav />
      </div>
    </main>
  );
}
