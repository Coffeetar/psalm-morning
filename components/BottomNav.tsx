"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";



export default function BottomNav() {
    const pathname = usePathname();
  return (
    <nav
      style={{
        marginTop: "40px",
        padding: "14px",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.9)",
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        boxShadow:
          "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: "none",
          padding: "10px 18px",
          borderRadius: "999px",
          background:
pathname === "/archive"
? "#2563eb"
: "#dbeafe",

color:
pathname === "/archive"
? "white"
: "#444",
        }}
      >
        오늘
      </Link>

      <Link
        href="/archive"
        style={{
          textDecoration: "none",
          padding: "10px 18px",
          borderRadius: "999px",
background:
pathname === "/archive"
? "#2563eb"
: "#c7d2fe",

color:
pathname === "/archive"
? "white"
: "#444",
        }}
      >
        아카이브
      </Link>

      <Link
        href="/my-prayers"
        style={{
          textDecoration: "none",
          padding: "10px 18px",
          borderRadius: "999px",
background:
pathname === "/my-prayers"
? "#16a34a"
: "#dcfce7",

color:
pathname === "/my-prayers"
? "white"
: "#444",

        }}
      >
        내 기도
      </Link>
      <Link
  href="/news"
  style={{
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "999px",
    background:
      pathname === "/news"
        ? "#7c3aed"
        : "#ede9fe",
    color:
      pathname === "/news"
        ? "white"
        : "#444",
  }}
>
  소식
</Link>
    </nav>
  );
}