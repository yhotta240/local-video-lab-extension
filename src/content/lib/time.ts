/** 秒を HH:MM:SS または MM:SS 形式に変換 */
export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");

  if (h > 0) {
    const hh = String(h).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/** 秒を HH:MM:SS.mmm 形式に変換（ミリ秒付き） */
export function formatTimeMs(seconds: number): string {
  const total = Math.max(0, seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const ms = Math.round((total % 1) * 1000);

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  const mmm = String(ms).padStart(3, "0");

  return `${hh}:${mm}:${ss}.${mmm}`;
}

/** 時刻文字列を秒数に変換（HH:MM:SS / MM:SS / SS） */
export function parseTime(str: string): number {
  const parts = str.trim().split(":").map(Number);

  if (parts.some((p) => Number.isNaN(p))) {
    return 0;
  }

  switch (parts.length) {
    case 3:
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    case 2:
      return parts[0] * 60 + parts[1];
    case 1:
      return parts[0];
    default:
      return 0;
  }
}

/** 値を指定範囲内に収める */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
