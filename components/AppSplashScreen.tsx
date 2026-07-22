import Image from "next/image";

export default function AppSplashScreen() {
  return (
    <main className="pm-splash" aria-live="polite" aria-label="Psalm Morning 시작 중">
      <div className="pm-splash-glow" aria-hidden="true" />
      <div className="pm-splash-content">
        <div className="pm-splash-icon-wrap">
          <div className="pm-splash-ring pm-splash-ring-one" aria-hidden="true" />
          <div className="pm-splash-ring pm-splash-ring-two" aria-hidden="true" />
          <Image
            className="pm-splash-icon"
            src="/icon-192.png"
            alt=""
            width={128}
            height={128}
            priority
          />
        </div>

        <div className="pm-splash-copy">
          <p className="pm-splash-title">PSALM MORNING</p>
          <p className="pm-splash-subtitle">말씀으로 여는 고요한 아침</p>
        </div>
      </div>

      <span className="pm-splash-status">오늘의 시편을 준비하고 있습니다</span>
    </main>
  );
}
