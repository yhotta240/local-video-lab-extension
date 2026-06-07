/** 動画の現在フレームをキャプチャしてBlobを返す */
export async function captureFrame(
  video: HTMLVideoElement,
  format = "image/png",
  quality = 0.92,
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), format, quality);
  });
}

/** Blobを一時アンカー経由でダウンロード */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  // クリーンアップ
  requestAnimationFrame(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

/** Blobをクリップボードにコピー */
export async function copyBlobToClipboard(blob: Blob): Promise<void> {
  // Clipboard APIはPNG形式のみサポートする場合が多い
  const item = new ClipboardItem({
    [blob.type]: blob,
  });
  await navigator.clipboard.write([item]);
}
