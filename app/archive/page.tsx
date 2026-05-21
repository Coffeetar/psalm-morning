"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  supabase,
} from "@/lib/supabaseClient";


export default function ArchivePage() {
  const [psalms, setPsalms] = useState<any[]>([]);

  useEffect(() => {
    loadPsalms();
  }, []);

  async function loadPsalms() {
    const { data, error } = await supabase
      .from("daily_psalms")
      .select("*")
      .eq("is_published", true)
      .order("devotional_date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPsalms(data || []);
  }

  return (
    
    <main
    
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "sans-serif",
        background: "linear-gradient(to bottom right, #fef3c7, #ecfccb, #e0f2fe)",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <p style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#78716c" }}>
          PSALM MORNING
        </p>

        <h1>Archive</h1>
        <p>이전에 등록된 시편 묵상 목록입니다.</p>

        {psalms.length === 0 ? (
          <p>아직 등록된 시편이 없습니다.</p>
        ) : (
          psalms.map((psalm) => (
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
  <img
    src={psalm.image_url}
    alt={psalm.psalm_reference}
    style={{
      width: "100%",
      borderRadius: "18px",
      marginBottom: "16px",
    }}
  />
)}
              <p style={{ color: "#78716c", fontSize: "14px" }}>
                {psalm.devotional_date}
              </p>

              <h2>{psalm.psalm_reference}</h2>

              <p style={{ lineHeight: 1.7 }}>
                {psalm.reflection || "묵상이 등록되지 않았습니다."}
              </p>
            </Link>
            
          ))
        )}
      </div>
    </main>
  );
}