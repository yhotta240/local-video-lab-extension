import type { LoopRange } from "../types/loop";

/** A-Bループ管理 */
export class LoopManager {
  private video: HTMLVideoElement;
  private activeLoop: LoopRange | null = null;
  private onTimeUpdate: (() => void) | null = null;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  /** A-Bループを設定 */
  setLoop(start: number, end: number, label?: string): LoopRange {
    this.clearLoop();
    const loop: LoopRange = {
      id: crypto.randomUUID(),
      start,
      end,
      label: label ?? "",
    };
    this.activeLoop = loop;
    this.video.currentTime = start;
    this.startMonitoring();
    return loop;
  }

  /** ループを解除 */
  clearLoop(): void {
    this.stopMonitoring();
    this.activeLoop = null;
  }

  /** 現在のループ範囲を取得 */
  getActiveLoop(): LoopRange | null {
    return this.activeLoop;
  }

  /** timeupdateイベントでループ監視を開始 */
  private startMonitoring(): void {
    this.stopMonitoring();
    this.onTimeUpdate = () => {
      if (!this.activeLoop) return;
      if (this.video.currentTime >= this.activeLoop.end) {
        this.video.currentTime = this.activeLoop.start;
      }
    };
    this.video.addEventListener("timeupdate", this.onTimeUpdate);
  }

  /** ループ監視を停止 */
  private stopMonitoring(): void {
    if (this.onTimeUpdate) {
      this.video.removeEventListener("timeupdate", this.onTimeUpdate);
      this.onTimeUpdate = null;
    }
  }

  /** リソース破棄 */
  destroy(): void {
    this.clearLoop();
  }
}
