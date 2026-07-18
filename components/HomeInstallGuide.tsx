"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "psalm_install_guide_dismissed";

export default function HomeInstallGuide() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as Navigator & { standalone?: boolean }).standalone === true);
    const isDismissed = localStorage.getItem(DISMISSED_KEY) === "true";

    const visibilityTimer = window.setTimeout(() => {
      setIsVisible(isIOS && !isStandalone && !isDismissed);
    }, 0);

    return () => window.clearTimeout(visibilityTimer);
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      aria-labelledby="install-guide-title"
      style={{
        marginTop: "24px",
        padding: "22px",
        borderRadius: "22px",
        border: "1px solid rgba(95,40,134,0.14)",
        background: "linear-gradient(145deg, #f3edf8, #fffaf0)",
        boxShadow: "0 12px 28px rgba(63,35,76,0.07)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#7b42a0",
              fontSize: "12px",
              fontWeight: 750,
              letterSpacing: "0.15em",
            }}
          >
            HOME SCREEN
          </p>
          <h3
            id="install-guide-title"
            style={{
              margin: "8px 0 0",
              color: "#3f1d57",
              fontSize: "19px",
            }}
          >
            Psalm Morning을 홈 화면에 놓아보세요
          </h3>
        </div>

        <button
          type="button"
          aria-label="홈 화면 설치 안내 닫기"
          onClick={() => {
            localStorage.setItem(DISMISSED_KEY, "true");
            setIsVisible(false);
          }}
          style={{
            flex: "0 0 auto",
            width: "32px",
            height: "32px",
            borderRadius: "999px",
            border: "1px solid rgba(95,40,134,0.16)",
            background: "rgba(255,255,255,0.75)",
            color: "#5f2886",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      <ol
        style={{
          margin: "18px 0 0",
          paddingLeft: "22px",
          color: "#554d59",
          lineHeight: 1.8,
        }}
      >
        <li>Safari 아래의 공유 버튼(□↑)을 누릅니다.</li>
        <li>메뉴에서 ‘홈 화면에 추가’를 선택합니다.</li>
        <li>오른쪽 위 ‘추가’를 누르면 설치가 완료됩니다.</li>
      </ol>

      <p
        style={{
          margin: "14px 0 0",
          color: "#756c7b",
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        책과 해돋이 아이콘으로 일반 앱처럼 바로 열 수 있습니다.
      </p>
    </aside>
  );
}
