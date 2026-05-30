"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";


export default function AdminLoginPage() {
  
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
  async function checkLoggedIn() {
    const { data } =
      await supabase.auth.getSession();

    if (
      data.session
    ) {
      router.push("/admin");
    }
  }

  checkLoggedIn();
}, [router]);

  async function handleLogin() {
const {
  data,
  error,
} =
await supabase.auth
.signInWithPassword({
email,
password,
});

    if (error) {
      setMessage("로그인에 실패했습니다.");
      return;
    }

   const userEmail =
  data.user?.email;

if (
  userEmail !==
  "prnate7936@gmail.com"
) {
  await supabase.auth.signOut();

  setMessage(
    "관리자 계정이 아닙니다."
  );

  return;
}

router.push("/admin");
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
        }}
      >
       <h1
  style={{
    textAlign: "center",
    marginBottom: "20px",
  }}
>
  Admin Login
</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="관리자 이메일"
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "16px",
          }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "12px",
          }}
        />

      <button
  type="button"
  onClick={handleLogin}
  style={{
    width: "100%",
    marginTop: "18px",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  로그인
</button>

        {message && <p>{message}</p>}
      </div>
    </main>
  );
}