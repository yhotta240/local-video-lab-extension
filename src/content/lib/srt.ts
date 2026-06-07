import type { SubtitleCue } from "../types/subtitle";

/** SRTタイムスタンプを秒に変換（00:00:00,000 形式） */
function parseSrtTimestamp(stamp: string): number {
  // カンマをドットに置換して統一
  const normalized = stamp.trim().replace(",", ".");
  const parts = normalized.split(":");

  if (parts.length === 3) {
    const [h, m, rest] = parts;
    const [s, ms] = rest.split(".");
    return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms || 0) / 1000;
  }
  return 0;
}

/** SRTテキストをパースして字幕キュー配列を返す */
export function parseSRT(text: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  // 改行を正規化
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    // 1行目: 番号（数字のみ）
    const index = lines[0].trim();
    if (!/^\d+$/.test(index)) continue;

    // 2行目: タイムスタンプ
    const timeLine = lines[1];
    const timeMatch = timeLine.match(
      /(\d{2}:\d{2}:\d{2}[.,]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[.,]\d{3})/,
    );
    if (!timeMatch) continue;

    const startTime = parseSrtTimestamp(timeMatch[1]);
    const endTime = parseSrtTimestamp(timeMatch[2]);

    // 3行目以降: テキスト
    const cueText = lines.slice(2).join("\n").trim();
    if (cueText.length === 0) continue;

    cues.push({
      id: `srt-${index}`,
      startTime,
      endTime,
      text: cueText,
    });
  }

  return cues;
}

/** SRTテキストをVTT形式文字列に変換 */
export function srtToVtt(srtText: string): string {
  const lines = srtText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  // タイムスタンプのカンマをドットに変換
  const converted = lines.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
  return `WEBVTT\n\n${converted}`;
}
