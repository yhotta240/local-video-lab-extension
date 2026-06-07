import type { FilterSettings } from "../../settings";
import { DEFAULT_FILTERS } from "../../settings";

/** 表示フィルター管理 */
export class FilterManager {
  private video: HTMLVideoElement;
  private filters: FilterSettings;

  constructor(video: HTMLVideoElement) {
    this.video = video;
    this.filters = { ...DEFAULT_FILTERS };
  }

  /** 明るさを設定 */
  setBrightness(value: number): void {
    this.filters.brightness = value;
    this.applyFilters();
  }

  /** コントラストを設定 */
  setContrast(value: number): void {
    this.filters.contrast = value;
    this.applyFilters();
  }

  /** 彩度を設定 */
  setSaturate(value: number): void {
    this.filters.saturate = value;
    this.applyFilters();
  }

  /** グレースケールを設定 */
  setGrayscale(value: number): void {
    this.filters.grayscale = value;
    this.applyFilters();
  }

  /** セピアを設定 */
  setSepia(value: number): void {
    this.filters.sepia = value;
    this.applyFilters();
  }

  /** 回転角度を設定 */
  setRotation(degrees: number): void {
    this.filters.rotation = degrees;
    this.applyTransform();
  }

  /** 左右反転を設定 */
  setFlipH(flip: boolean): void {
    this.filters.flipH = flip;
    this.applyTransform();
  }

  /** 上下反転を設定 */
  setFlipV(flip: boolean): void {
    this.filters.flipV = flip;
    this.applyTransform();
  }

  /** 現在のフィルター設定を取得 */
  getFilters(): FilterSettings {
    return { ...this.filters };
  }

  /** フィルターを初期値にリセット */
  reset(): void {
    this.filters = { ...DEFAULT_FILTERS };
    this.applyFilters();
    this.applyTransform();
  }

  /** CSSフィルターをvideo要素に適用 */
  private applyFilters(): void {
    const { brightness, contrast, saturate, grayscale, sepia } = this.filters;
    this.video.style.filter = [
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${saturate}%)`,
      `grayscale(${grayscale}%)`,
      `sepia(${sepia}%)`,
    ].join(" ");
  }

  /** CSS transformをvideo要素に適用（回転・反転） */
  private applyTransform(): void {
    const parts: string[] = [];
    if (this.filters.rotation !== 0) {
      parts.push(`rotate(${this.filters.rotation}deg)`);
    }
    if (this.filters.flipH) {
      parts.push("scaleX(-1)");
    }
    if (this.filters.flipV) {
      parts.push("scaleY(-1)");
    }
    this.video.style.transform = parts.join(" ");
  }
}
