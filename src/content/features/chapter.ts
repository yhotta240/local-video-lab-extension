import { generateStorageKey, loadViewerData, saveViewerData } from "../lib/storage";
import { formatTime } from "../lib/time";
import type { Chapter } from "../types/chapter";

/** チャプター管理 */
export class ChapterManager {
  private chapters: Chapter[] = [];
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  /** チャプターを追加 */
  addChapter(time: number, title: string): Chapter {
    const chapter: Chapter = {
      id: crypto.randomUUID(),
      time,
      title,
    };
    this.chapters.push(chapter);
    this.sortChapters();
    return chapter;
  }

  /** チャプターを削除 */
  removeChapter(id: string): void {
    this.chapters = this.chapters.filter((c) => c.id !== id);
  }

  /** チャプタータイトルを更新 */
  updateTitle(id: string, title: string): void {
    const chapter = this.chapters.find((c) => c.id === id);
    if (chapter) {
      chapter.title = title;
    }
  }

  /** 時刻順にソートされたチャプター一覧を取得 */
  getChapters(): Chapter[] {
    return [...this.chapters];
  }

  /** 指定チャプターの時刻にジャンプ */
  jumpTo(id: string): void {
    const chapter = this.chapters.find((c) => c.id === id);
    if (chapter) {
      this.video.currentTime = chapter.time;
    }
  }

  /** 現在の再生時刻をチャプターとして追加 */
  addCurrentTime(title?: string): Chapter {
    const time = this.video.currentTime;
    const label = title ?? `チャプター ${formatTime(time)}`;
    return this.addChapter(time, label);
  }

  /** チャプター情報をストレージに保存 */
  async save(filename: string): Promise<void> {
    const key = generateStorageKey(filename, "chapter");
    await saveViewerData(key, this.chapters);
  }

  /** チャプター情報をストレージから読み込み */
  async load(filename: string): Promise<void> {
    const key = generateStorageKey(filename, "chapter");
    const data = await loadViewerData<Chapter[]>(key);
    if (data) {
      this.chapters = data;
      this.sortChapters();
    }
  }

  /** リソース破棄 */
  destroy(): void {
    this.chapters = [];
  }

  /** 時刻順にソート */
  private sortChapters(): void {
    this.chapters.sort((a, b) => a.time - b.time);
  }
}
