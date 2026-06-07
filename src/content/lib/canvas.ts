export interface VisibleFrameCrop {
  dataUrl: string;
  rect: DOMRect;
  videoWidth: number;
  videoHeight: number;
  viewportWidth: number;
  viewportHeight: number;
}

type CropBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** 表示中タブのスクリーンショットから動画表示領域を切り抜く */
export async function cropVisibleFrame(crop: VisibleFrameCrop, format = "image/png", quality = 0.92): Promise<Blob | null> {
  const image = await loadImage(crop.dataUrl);
  const rendered = getRenderedVideoBox(crop.rect, crop.videoWidth, crop.videoHeight);
  const scaleX = image.naturalWidth / crop.viewportWidth;
  const scaleY = image.naturalHeight / crop.viewportHeight;
  const source = clampCropBox(
    {
      x: rendered.x * scaleX,
      y: rendered.y * scaleY,
      width: rendered.width * scaleX,
      height: rendered.height * scaleY,
    },
    image.naturalWidth,
    image.naturalHeight,
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(source.width);
  canvas.height = Math.round(source.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to create crop canvas context");
  ctx.drawImage(image, source.x, source.y, source.width, source.height, 0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas, format, quality);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load captured image"));
    image.src = src;
  });
}

function getRenderedVideoBox(rect: DOMRect, videoWidth: number, videoHeight: number): CropBox {
  if (videoWidth <= 0 || videoHeight <= 0) return rect;

  const videoRatio = videoWidth / videoHeight;
  const rectRatio = rect.width / rect.height;
  if (rectRatio > videoRatio) {
    const width = rect.height * videoRatio;
    return { x: rect.x + (rect.width - width) / 2, y: rect.y, width, height: rect.height };
  }

  const height = rect.width / videoRatio;
  return { x: rect.x, y: rect.y + (rect.height - height) / 2, width: rect.width, height };
}

function clampCropBox(box: CropBox, maxWidth: number, maxHeight: number): CropBox {
  const x = Math.max(0, box.x);
  const y = Math.max(0, box.y);
  const width = Math.min(maxWidth - x, box.width);
  const height = Math.min(maxHeight - y, box.height);
  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid crop size: ${width}x${height}`);
  }
  return { x, y, width, height };
}

function canvasToBlob(canvas: HTMLCanvasElement, format: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to export cropped visible tab image"));
        }
      },
      format,
      quality,
    );
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
