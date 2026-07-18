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
        fontFamily: "sans-serif",
        background: "linear-gradient(to bottom right, #fef3c7, #ecfccb, #e0f2fe)",
      }}
    >
      <div className="page-shell">
        <p style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#78716c" }}>
          PSALM MORNING
        </p>

        <h1>지난 시편</h1>
        <p>이전에 등록된 시편 묵상 목록입니다.</p>

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
  style={{
    display: "block",
    marginTop: "16px",
    padding: "22px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(255,255,255,0.8)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
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
              <p style={{ color: "#78716c", fontSize: "14px" }}>
                {formatKoreanDate(psalm.devotional_date)}
              </p>

              <h2>{psalm.psalm_reference}</h2>

              <p
                style={{
                  lineHeight: 1.7,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {psalm.reflection || "묵상이 등록되지 않았습니다."}
              </p>
            </Link>
            
          ))
        )}
      </div>
      <BottomNav />
    </main>
  );
}
