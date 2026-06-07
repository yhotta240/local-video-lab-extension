import { generateStorageKey, loadViewerData, saveViewerData } from "../lib/storage";
import type { SkipRange } from "../types/skip";

/** スキップ範囲管理 */
export class SkipManager {
  private video: HTMLVideoElement;
  private ranges: SkipRange[] = [];
  private onTimeUpdate: (() => void) | null = null;

  constructor(video: HTMLVideoElement) {
    this.video = video;
    this.startMonitoring();
  }

  /** スキップ範囲を追加 */
  addRange(start: number, end: number, label?: string): SkipRange {
    const range: SkipRange = {
      id: crypto.randomUUID(),
      start,
      end,
      label: label ?? "",
      enabled: true,
    };
    this.ranges.push(range);
    return range;
  }

  /** スキップ範囲を削除 */
  removeRange(id: string): void {
    this.ranges = this.ranges.filter((r) => r.id !== id);
  }

  /** スキップ範囲の有効/無効を切り替え */
  toggleRange(id: string): void {
    const range = this.ranges.find((r) => r.id === id);
    if (range) {
      range.enabled = !range.enabled;
    }
  }

  /** 全スキップ範囲を取得 */
  getRanges(): SkipRange[] {
    return [...this.ranges];
  }

  /** timeupdateイベントで自動スキップ監視を開始 */
  private startMonitoring(): void {
    this.stopMonitoring();
    this.onTimeUpdate = () => {
      const t = this.video.currentTime;
      for (const range of this.ranges) {
        if (!range.enabled) continue;
        if (t >= range.start && t < range.end) {
          this.video.currentTime = range.end;
          break;
        }
      }
    };
    this.video.addEventListener("timeupdate", this.onTimeUpdate);
  }

  /** スキップ監視を停止 */
  private stopMonitoring(): void {
    if (this.onTimeUpdate) {
      this.video.removeEventListener("timeupdate", this.onTimeUpdate);
      this.onTimeUpdate = null;
    }
  }

  /** スキップ範囲をストレージに保存 */
  async save(filename: string): Promise<void> {
    const key = generateStorageKey(filename, "skip");
    await saveViewerData(key, this.ranges);
  }

  /** スキップ範囲をストレージから読み込み */
  async load(filename: string): Promise<void> {
    const key = generateStorageKey(filename, "skip");
    const data = await loadViewerData<SkipRange[]>(key);
    if (data) {
      this.ranges = data;
    }
  }

  /** リソース破棄 */
  destroy(): void {
    this.stopMonitoring();
    this.ranges = [];
  }
}
