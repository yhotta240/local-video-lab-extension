import { copyBlobToClipboard, cropVisibleFrame, downloadBlob } from "../lib/canvas";
import { generateFilename } from "../lib/file";

type CaptureVisibleTabResponse = {
  dataUrl?: string | null;
};

/** スクリーンショット管理 */
export class ScreenshotManager {
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  /** 現在フレームをキャプチャしてダウンロード */
  async capture(baseName = "video", format = "image/png", quality = 0.92): Promise<boolean> {
    const blob = await this.captureVisibleFrame(format, quality);
    if (!blob) return false;
    const ext = format.replace("image/", "");
    const filename = generateFilename(baseName, this.video.currentTime, ext);
    downloadBlob(blob, filename);
    return true;
  }

  /** 現在フレームをクリップボードにコピー */
  async copyToClipboard(): Promise<boolean> {
    const blob = await this.captureVisibleFrame("image/png");
    if (!blob) return false;
    return copyBlobToClipboard(blob)
      .then(() => true)
      .catch(() => false);
  }

  private async captureVisibleFrame(format = "image/png", quality = 0.92): Promise<Blob | null> {
    const root = this.video.closest<HTMLElement>(".lvl-root");
    const previousIdle = root?.classList.contains("is-pointer-idle") ?? false;

    root?.classList.add("is-pointer-idle", "is-capturing-frame");
    try {
      await nextFrame();
      await nextFrame();

      const response = (await chrome.runtime
        .sendMessage({ type: "LOCAL_VIDEO_LAB_CAPTURE_VISIBLE_TAB" })
        .catch(() => null)) as CaptureVisibleTabResponse | null;

      if (!response?.dataUrl) return null;

      return cropVisibleFrame(
        {
          dataUrl: response.dataUrl,
          rect: this.video.getBoundingClientRect(),
          videoWidth: this.video.videoWidth,
          videoHeight: this.video.videoHeight,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        },
        format,
        quality,
      ).catch(() => null);
    } finally {
      root?.classList.remove("is-capturing-frame");
      if (!previousIdle) root?.classList.remove("is-pointer-idle");
    }
  }
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
