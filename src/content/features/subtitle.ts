import { parseSRT, srtToVtt } from "../lib/srt";
import { parseVTT } from "../lib/vtt";
import type { SubtitleCue, SubtitleTrack } from "../types/subtitle";

/** 字幕管理 */
export class SubtitleManager {
  private video: HTMLVideoElement;
  private track: SubtitleTrack | null = null;
  private trackElement: HTMLTrackElement | null = null;
  private visible = false;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  /** ファイルから字幕を読み込み */
  async loadFile(file: File): Promise<SubtitleTrack> {
    this.removeTrack();
    const text = await this.readFileText(file);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    let cues: SubtitleCue[];
    let vttContent: string;

    if (ext === "srt") {
      cues = parseSRT(text);
      vttContent = srtToVtt(text);
    } else {
      cues = parseVTT(text);
      vttContent = text;
    }

    const subtitleTrack: SubtitleTrack = {
      filename: file.name,
      format: ext === "srt" ? "srt" : "vtt",
      cues,
    };
    this.track = subtitleTrack;

    // Blob URLでtrack要素を作成して動画に追加
    const blob = new Blob([vttContent], { type: "text/vtt" });
    const url = URL.createObjectURL(blob);
    const trackEl = document.createElement("track");
    trackEl.kind = "subtitles";
    trackEl.src = url;
    trackEl.default = true;
    this.video.appendChild(trackEl);
    this.trackElement = trackEl;

    // トラックを表示状態にする
    if (trackEl.track) {
      trackEl.track.mode = "showing";
    }
    this.visible = true;

    return subtitleTrack;
  }

  /** 字幕の表示/非表示を切り替え */
  toggleVisibility(): boolean {
    this.setVisibility(!this.visible);
    return this.visible;
  }

  /** 字幕の表示状態を設定 */
  setVisibility(visible: boolean): void {
    this.visible = visible;
    if (this.trackElement?.track) {
      this.trackElement.track.mode = visible ? "showing" : "hidden";
    }
  }

  /** 現在のトラックを取得 */
  getTrack(): SubtitleTrack | null {
    return this.track;
  }

  /** 字幕が表示中かどうか */
  isVisible(): boolean {
    return this.visible;
  }

  /** トラックを削除 */
  removeTrack(): void {
    if (this.trackElement) {
      // Blob URLを解放
      if (this.trackElement.src) {
        URL.revokeObjectURL(this.trackElement.src);
      }
      this.trackElement.remove();
      this.trackElement = null;
    }
    this.track = null;
    this.visible = false;
  }

  /** リソース破棄 */
  destroy(): void {
    this.removeTrack();
  }

  /** ファイルをテキストとして読み込み */
  private readFileText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}
