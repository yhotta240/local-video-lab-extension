/** 対応する動画拡張子 */
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mkv", ".avi", ".mov", ".ogv", ".m4v", ".3gp"];

/** ファイル名が動画形式か判定 */
export function isVideoFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return VIDEO_EXTENSIONS.includes(ext);
}

/** ファイル名から拡張子を取得 */
export function getFileExtension(filename: string): string {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) return "";
  return filename.slice(dotIndex);
}

/** バイト数を読みやすい単位に変換 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** File から Blob URL を生成 */
export function createBlobUrl(file: File): string {
  return URL.createObjectURL(file);
}

/** Blob URL を解放 */
export function revokeBlobUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/** スクリーンショット用ファイル名を生成（例: video_01m30s.png） */
export function generateFilename(baseName: string, time: number, ext: string): string {
  const totalSeconds = Math.floor(time);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  // 拡張子を除いたベース名
  const dotIdx = baseName.lastIndexOf(".");
  const name = dotIdx > 0 ? baseName.slice(0, dotIdx) : baseName;

  // 時刻部分を組み立て
  const timePart =
    h > 0
      ? `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}m${String(s).padStart(2, "0")}s`
      : `${String(m).padStart(2, "0")}m${String(s).padStart(2, "0")}s`;

  // 拡張子のドット補正
  const suffix = ext.startsWith(".") ? ext : `.${ext}`;

  return `${name}_${timePart}${suffix}`;
}
