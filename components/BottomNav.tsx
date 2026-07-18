"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";



export default function BottomNav() {
    const pathname = usePathname();
  return (
    <nav
      aria-label="주요 메뉴"
      style={{
        marginTop: "40px",
        padding: "14px",
        borderRadius: "999px",
        background: "rgba(255,253,248,0.94)",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "12px",
        boxShadow:
          "0 12px 30px rgba(63,35,76,0.1)",
        border: "1px solid rgba(95,40,134,0.1)",
      }}
    >
      <Link
        className="pm-nav-link"
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        style={{
          textDecoration: "none",
          padding: "10px 18px",
          borderRadius: "999px",
          background:
            pathname === "/"
              ? "#5f2886"
              : "#f0e8f5",

          color:
            pathname === "/"
              ? "white"
              : "#444",
        }}
      >
        오늘
      </Link>

      <Link
        className="pm-nav-link"
        href="/archive"
        aria-current={pathname.startsWith("/archive") ? "page" : undefined}
        style={{
          textDecoration: "none",
          padding: "10px 18px",
          borderRadius: "999px",
background:
pathname.startsWith("/archive")
? "#5f2886"
: "#f0e8f5",

color:
pathname.startsWith("/archive")
? "white"
: "#444",
        }}
      >
        아카이브
      </Link>

      <Link
        className="pm-nav-link"
        href="/my-prayers"
        aria-current={pathname === "/my-prayers" ? "page" : undefined}
        style={{
          textDecoration: "none",
          padding: "10px 18px",
          borderRadius: "999px",
background:
pathname === "/my-prayers"
? "#5f2886"
: "#f0e8f5",

color:
pathname === "/my-prayers"
? "white"
: "#444",

        }}
      >
        내 기도
      </Link>
      <Link
  className="pm-nav-link"
  href="/news"
  aria-current={pathname === "/news" ? "page" : undefined}
  style={{
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "999px",
    background:
      pathname === "/news"
        ? "#5f2886"
        : "#f0e8f5",
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
