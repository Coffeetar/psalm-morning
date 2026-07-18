const SEOUL_TIME_ZONE = "Asia/Seoul";

export function getSeoulDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SEOUL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getSeoulWeekday(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: SEOUL_TIME_ZONE,
    weekday: "long",
  }).format(date);
}

export function getReflectionStorageKey(dateKey: string) {
  return `psalm_reflection_${dateKey}`;
}

export function formatKoreanDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) return dateKey;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
