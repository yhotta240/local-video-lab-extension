import type { SubtitleCue } from "../types/subtitle";

/** VTTタイムスタンプを秒に変換（00:00:00.000 形式） */
function parseVttTimestamp(stamp: string): number {
  const parts = stamp.trim().split(":");
  if (parts.length === 3) {
    const [h, m, rest] = parts;
    const [s, ms] = rest.split(".");
    return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms || 0) / 1000;
  }
  if (parts.length === 2) {
    const [m, rest] = parts;
    const [s, ms] = rest.split(".");
    return Number(m) * 60 + Number(s) + Number(ms || 0) / 1000;
  }
  return 0;
}

/** VTTテキストをパースして字幕キュー配列を返す */
export function parseVTT(text: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  // 改行を正規化
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized.split(/\n\n+/);

  let cueIndex = 0;

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length === 0) continue;

    // WEBVTTヘッダーをスキップ
    if (lines[0].startsWith("WEBVTT")) continue;

    // NOTEブロックをスキップ
    if (lines[0].startsWith("NOTE")) continue;

    // STYLEブロックをスキップ
    if (lines[0].startsWith("STYLE")) continue;

    // タイムスタンプ行を探す
    const arrowPattern = /-->/;
    let timeLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (arrowPattern.test(lines[i])) {
        timeLineIndex = i;
        break;
      }
    }

    if (timeLineIndex === -1) continue;

    const timeLine = lines[timeLineIndex];
    // タイムスタンプ部分を抽出（位置設定は無視）
    const timeMatch = timeLine.match(
      /(\d{1,2}:?\d{2}:\d{2}[.,]\d{1,3})\s*-->\s*(\d{1,2}:?\d{2}:\d{2}[.,]\d{1,3})/,
    );
    if (!timeMatch) continue;

    const startTime = parseVttTimestamp(timeMatch[1].replace(",", "."));
    const endTime = parseVttTimestamp(timeMatch[2].replace(",", "."));

    // タイムスタンプ以降の行がテキスト
    const textLines = lines.slice(timeLineIndex + 1);
    const cueText = textLines.join("\n").trim();

    if (cueText.length === 0) continue;

    cueIndex++;
    cues.push({
      id: `vtt-${cueIndex}`,
      startTime,
      endTime,
      text: cueText,
    });
  }

  return cues;
}
