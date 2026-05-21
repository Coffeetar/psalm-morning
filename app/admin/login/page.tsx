"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin() {
    if (password === "psalm123") {
      localStorage.setItem("psalm_admin_logged_in", "true");

      router.push("/admin");
    } else {
      setMessage("비밀번호가 올바르지 않습니다.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to bottom right, #fef3c7, #ecfccb, #e0f2fe)",
        padding: "24px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.8)",
          padding: "32px",
          borderRadius: "28px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "#78716c",
          }}
        >
          PSALM MORNING
        </p>

        <h1 style={{ marginTop: "12px" }}>
          Admin Login
        </h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="관리자 비밀번호"
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid #d6d3d1",
            marginTop: "20px",
            fontSize: "16px",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background: "#292524",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          로그인
        </button>

        {message && (
          <p
            style={{
              marginTop: "16px",
              color: "#b91c1c",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}