import { generateStorageKey, loadViewerData, removeViewerData, saveViewerData } from "../lib/storage";
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

  /** 現在のループ範囲を更新 */
  updateLoop(start: number, end: number): LoopRange | null {
    if (!this.activeLoop) return null;
    this.activeLoop = { ...this.activeLoop, start, end };
    this.startMonitoring();
    return this.activeLoop;
  }

  /** A-Bループをストレージに保存 */
  async save(filename: string): Promise<void> {
    const key = generateStorageKey(filename, "loop");
    await saveViewerData(key, this.activeLoop);
  }

  /** A-Bループをストレージから読み込み */
  async load(filename: string): Promise<LoopRange | null> {
    const key = generateStorageKey(filename, "loop");
    const loop = await loadViewerData<LoopRange>(key);
    if (!loop) return null;
    this.clearLoop();
    this.activeLoop = loop;
    this.startMonitoring();
    return loop;
  }

  /** 保存済みA-Bループを削除 */
  async removeSaved(filename: string): Promise<void> {
    const key = generateStorageKey(filename, "loop");
    await removeViewerData(key);
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
