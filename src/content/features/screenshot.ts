import { captureFrame, copyBlobToClipboard, downloadBlob } from "../lib/canvas";
import { generateFilename } from "../lib/file";

/** スクリーンショット管理 */
export class ScreenshotManager {
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  /** 現在フレームをキャプチャしてダウンロード */
  async capture(baseName = "video", format = "image/png", quality = 0.92): Promise<void> {
    const blob = await captureFrame(this.video, format, quality);
    if (!blob) return;
    const ext = format.replace("image/", "");
    const filename = generateFilename(baseName, this.video.currentTime, ext);
    downloadBlob(blob, filename);
  }

  /** 現在フレームをクリップボードにコピー */
  async copyToClipboard(): Promise<void> {
    const blob = await captureFrame(this.video, "image/png");
    if (!blob) return;
    await copyBlobToClipboard(blob);
  }
}
