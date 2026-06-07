import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/content.css";
import { ChapterManager } from "../features/chapter";
import { FilterManager } from "../features/filter";
import { LoopManager } from "../features/loop";
import { ScreenshotManager } from "../features/screenshot";
import { ShortcutManager } from "../features/shortcut";
import { SkipManager } from "../features/skip";
import { SubtitleManager } from "../features/subtitle";
import { formatFileSize, isVideoFile } from "../lib/file";
import { formatTime, parseTime } from "../lib/time";
import { createChapterPanel } from "../ui/createChapterPanel";
import { createControls } from "../ui/createControls";
import { createFilterPanel } from "../ui/createFilterPanel";
import { createLoopPanel } from "../ui/createLoopPanel";
import { createScreenshotPanel } from "../ui/createScreenshotPanel";
import { createSkipPanel } from "../ui/createSkipPanel";
import { createSubtitlePanel } from "../ui/createSubtitlePanel";
import { updateTimeline } from "../ui/createTimeline";
import { createToolbar } from "../ui/createToolbar";
import { createViewerRoot } from "../ui/createViewerRoot";
import { VideoController } from "./VideoController";
import { VideoState } from "./VideoState";

const VIDEO_URL_EXTENSIONS = [".mp4", ".webm", ".mkv", ".avi", ".mov", ".ogv", ".m4v", ".3gp"];

export interface VideoViewerOptions {
  sourceUrl?: string;
  sourceName?: string;
}

export class VideoViewer {
  private readonly originalHtml: string;
  private readonly state = new VideoState();
  private readonly ui = createViewerRoot();
  private readonly toolbar = createToolbar();
  private readonly controls = createControls();
  private readonly loopPanel = createLoopPanel();
  private readonly skipPanel = createSkipPanel();
  private readonly chapterPanel = createChapterPanel();
  private readonly subtitlePanel = createSubtitlePanel();
  private readonly screenshotPanel = createScreenshotPanel();
  private readonly filterPanel = createFilterPanel();
  private readonly controller: VideoController;
  private readonly loop: LoopManager;
  private readonly skip: SkipManager;
  private readonly filter: FilterManager;
  private readonly screenshot: ScreenshotManager;
  private readonly subtitle: SubtitleManager;
  private readonly chapter: ChapterManager;
  private readonly shortcut = new ShortcutManager();
  private cleanup: (() => void)[] = [];
  private readonly originalBodyMargin: string;
  private readonly originalBodyOverflow: string;
  private readonly originalDocumentBackground: string;
  private currentObjectUrl: string | null = null;
  private currentName = "video";
  private statusTimer = 0;
  private controlResizeObserver: ResizeObserver | null = null;
  private dragSeek: {
    pointerId: number;
    startX: number;
    startTime: number;
    targetTime: number;
    frameId: number;
    moved: boolean;
  } | null = null;

  constructor(private readonly options: VideoViewerOptions = {}) {
    this.originalHtml = document.body.innerHTML;
    this.originalBodyMargin = document.body.style.margin;
    this.originalBodyOverflow = document.body.style.overflow;
    this.originalDocumentBackground = document.documentElement.style.background;
    this.controller = new VideoController(this.ui.video);
    this.loop = new LoopManager(this.ui.video);
    this.skip = new SkipManager(this.ui.video);
    this.filter = new FilterManager(this.ui.video);
    this.screenshot = new ScreenshotManager(this.ui.video);
    this.subtitle = new SubtitleManager(this.ui.video);
    this.chapter = new ChapterManager(this.ui.video);
  }

  mount(): void {
    document.body.innerHTML = "";
    document.documentElement.style.background = "#090a0d";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    document.body.appendChild(this.ui.root);
    this.ui.toolbar.appendChild(this.toolbar.root);
    this.ui.controls.appendChild(this.ui.timeline);
    this.ui.controls.appendChild(this.controls.root);
    this.ui.sidePanel.append(
      this.loopPanel.root,
      this.skipPanel.root,
      this.chapterPanel.root,
      this.subtitlePanel.root,
      this.screenshotPanel.root,
      this.filterPanel.root,
    );
    this.ui.root.classList.add("is-empty");
    this.ui.root.dataset.createMode = "full";
    this.bindUi();
    this.bindShortcuts();
    this.shortcut.bind();
    this.bindControlLayout();

    if (
      this.options.sourceUrl &&
      this.options.sourceName &&
      isProbablyVideoUrl(this.options.sourceName)
    ) {
      this.loadUrl(this.options.sourceUrl, this.options.sourceName);
    }
  }

  destroy(): void {
    for (const fn of this.cleanup.splice(0)) fn();
    this.shortcut.destroy();
    this.controlResizeObserver?.disconnect();
    this.loop.destroy();
    this.skip.destroy();
    this.subtitle.destroy();
    this.chapter.destroy();
    if (this.currentObjectUrl) URL.revokeObjectURL(this.currentObjectUrl);
    document.body.innerHTML = this.originalHtml;
    document.body.style.margin = this.originalBodyMargin;
    document.body.style.overflow = this.originalBodyOverflow;
    document.documentElement.style.background = this.originalDocumentBackground;
  }

  private bindUi(): void {
    const on = <K extends keyof HTMLElementEventMap>(
      target: HTMLElement,
      type: K,
      listener: (event: HTMLElementEventMap[K]) => void,
    ) => {
      target.addEventListener(type, listener);
      this.cleanup.push(() => target.removeEventListener(type, listener));
    };

    this.toolbar.elements.fileInput.addEventListener("change", () => {
      const file = this.toolbar.elements.fileInput.files?.[0];
      if (file) this.loadFile(file);
    });
    this.cleanup.push(() => {
      this.toolbar.elements.fileInput.value = "";
    });

    this.toolbar.elements.subtitleInput.addEventListener("change", async () => {
      const file = this.toolbar.elements.subtitleInput.files?.[0];
      if (!file) return;
      const track = await this.subtitle.loadFile(file);
      this.state.subtitle = track;
      this.subtitlePanel.elements.label.textContent = `${track.filename} (${track.cues.length})`;
      this.showStatus("字幕を読み込みました");
    });

    on(this.controls.elements.play, "click", () => this.controller.togglePlay());
    on(this.controls.elements.back, "click", () =>
      this.controller.seekBackward(this.state.settings.seekStep),
    );
    on(this.controls.elements.forward, "click", () =>
      this.controller.seekForward(this.state.settings.seekStep),
    );
    on(this.controls.elements.loopStart, "click", () => {
      this.loopPanel.elements.start.value = formatTime(this.ui.video.currentTime);
      this.controls.elements.loopSummary.textContent = `A ${formatTime(this.ui.video.currentTime)}`;
      this.controls.elements.loopSummary.classList.remove("is-active");
      this.showStatus(`ループ開始 ${formatTime(this.ui.video.currentTime)}`);
    });
    on(this.controls.elements.loopEnd, "click", () => {
      this.loopPanel.elements.end.value = formatTime(this.ui.video.currentTime);
      this.applyLoopFromInputs();
    });
    on(this.controls.elements.loopClear, "click", () => {
      this.clearLoop();
    });
    on(this.controls.elements.screenshot, "click", () => {
      const format = `image/${this.state.settings.screenshotFormat}`;
      void this.screenshot.capture(this.currentName, format, this.state.settings.screenshotQuality);
    });
    on(this.controls.elements.chapter, "click", () => {
      this.chapter.addCurrentTime();
      this.state.chapters = this.chapter.getChapters();
      this.renderChapterList();
      this.showStatus("チャプターを追加しました");
    });
    on(this.controls.elements.subtitles, "click", () => {
      this.toolbar.elements.subtitleInput.click();
    });
    on(this.controls.elements.tools, "click", () => {
      this.ui.root.classList.toggle("is-side-pinned");
      this.syncSidePinUi();
      this.updateCreateMode();
    });
    on(this.controls.elements.more, "click", (event) => {
      event.stopPropagation();
      this.controls.elements.more
        .closest<HTMLElement>(".lvl-more-wrap")
        ?.classList.toggle("is-more-open");
    });
    const onMoreAction = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-action]");
      if (!button) return;
      this.handleMoreAction(button.dataset.action ?? "");
      button.closest<HTMLElement>(".lvl-more-wrap")?.classList.remove("is-more-open");
    };
    this.controls.root.addEventListener("click", onMoreAction);
    this.cleanup.push(() => this.controls.root.removeEventListener("click", onMoreAction));
    const closeMoreMenu = (event: MouseEvent) => {
      const moreWrap = this.controls.elements.more.closest<HTMLElement>(".lvl-more-wrap");
      if (!moreWrap || moreWrap.contains(event.target as Node)) return;
      moreWrap.classList.remove("is-more-open");
    };
    document.addEventListener("click", closeMoreMenu);
    this.cleanup.push(() => {
      document.removeEventListener("click", closeMoreMenu);
      this.controls.elements.more
        .closest<HTMLElement>(".lvl-more-wrap")
        ?.classList.remove("is-more-open");
    });
    on(this.controls.elements.rate, "change", () =>
      this.controller.setRate(Number(this.controls.elements.rate.value)),
    );
    on(this.controls.elements.volume, "input", () =>
      this.controller.setVolume(Number(this.controls.elements.volume.value)),
    );
    on(this.controls.elements.mute, "click", () => {
      this.controller.toggleMute();
      this.updatePlaybackUi();
    });
    on(
      this.controls.elements.pip,
      "click",
      () =>
        void this.controller.togglePiP().catch(() => this.showStatus("PiPを開始できませんでした")),
    );
    on(this.controls.elements.fullscreen, "click", () => void this.toggleWindowFullscreen());
    on(this.ui.timeline, "input", () => this.controller.seekTo(Number(this.ui.timeline.value)));
    on(this.ui.sideToggle, "click", () => {
      this.toggleSidePin();
    });
    on(this.ui.sideToggle, "mouseenter", () => {
      this.ui.root.classList.remove("is-side-suppressed");
    });
    on(this.ui.sidePanel, "mouseleave", () => {
      this.ui.root.classList.remove("is-side-suppressed");
    });
    on(this.ui.sidePin, "click", () => {
      this.toggleSidePin();
      this.updateCreateMode();
    });
    on(this.ui.sideClose, "click", () => {
      this.ui.root.classList.remove("is-side-pinned");
      this.ui.root.classList.add("is-side-suppressed");
      this.syncSidePinUi();
      this.updateCreateMode();
    });

    on(this.loopPanel.elements.setStart, "click", () => {
      this.loopPanel.elements.start.value = formatTime(this.ui.video.currentTime);
    });
    on(this.loopPanel.elements.setEnd, "click", () => {
      this.loopPanel.elements.end.value = formatTime(this.ui.video.currentTime);
    });
    on(this.loopPanel.elements.apply, "click", () => {
      this.applyLoopFromInputs();
    });
    on(this.loopPanel.elements.clear, "click", () => {
      this.clearLoop();
    });

    on(this.skipPanel.elements.add, "click", () => {
      const start = parseTime(this.skipPanel.elements.start.value);
      const end = parseTime(this.skipPanel.elements.end.value);
      if (end <= start) {
        this.showStatus("スキップ終了時刻は開始時刻より後にしてください");
        return;
      }
      this.skip.addRange(start, end);
      this.state.skips = this.skip.getRanges();
      this.renderSkipList();
    });

    on(this.chapterPanel.elements.add, "click", () => {
      this.chapter.addCurrentTime(this.chapterPanel.elements.title.value || undefined);
      this.chapterPanel.elements.title.value = "";
      this.state.chapters = this.chapter.getChapters();
      this.renderChapterList();
    });

    on(this.subtitlePanel.elements.toggle, "click", () => {
      const visible = this.subtitle.toggleVisibility();
      setIconButton(
        this.subtitlePanel.elements.toggle,
        visible ? "eye-slash" : "eye",
        visible ? "非表示" : "表示",
      );
    });

    on(this.screenshotPanel.elements.capture, "click", () => {
      const format = `image/${this.state.settings.screenshotFormat}`;
      void this.screenshot.capture(this.currentName, format, this.state.settings.screenshotQuality);
    });
    on(
      this.screenshotPanel.elements.copy,
      "click",
      () =>
        void this.screenshot
          .copyToClipboard()
          .then(() => this.showStatus("フレームをコピーしました")),
    );

    on(this.filterPanel.elements.brightness, "input", () =>
      this.filter.setBrightness(Number(this.filterPanel.elements.brightness.value)),
    );
    on(this.filterPanel.elements.contrast, "input", () =>
      this.filter.setContrast(Number(this.filterPanel.elements.contrast.value)),
    );
    on(this.filterPanel.elements.saturate, "input", () =>
      this.filter.setSaturate(Number(this.filterPanel.elements.saturate.value)),
    );
    on(this.filterPanel.elements.rotation, "change", () =>
      this.filter.setRotation(Number(this.filterPanel.elements.rotation.value)),
    );
    on(this.filterPanel.elements.flipH, "change", () =>
      this.filter.setFlipH(this.filterPanel.elements.flipH.checked),
    );
    on(this.filterPanel.elements.flipV, "change", () =>
      this.filter.setFlipV(this.filterPanel.elements.flipV.checked),
    );
    on(this.filterPanel.elements.reset, "click", () => {
      this.filter.reset();
      this.filterPanel.elements.brightness.value = "100";
      this.filterPanel.elements.contrast.value = "100";
      this.filterPanel.elements.saturate.value = "100";
      this.filterPanel.elements.rotation.value = "0";
      this.filterPanel.elements.flipH.checked = false;
      this.filterPanel.elements.flipV.checked = false;
    });

    this.bindVideoEvents();
    this.bindDrop();
    this.bindDragSeek();
  }

  private bindVideoEvents(): void {
    const video = this.ui.video;
    for (const type of [
      "loadedmetadata",
      "timeupdate",
      "play",
      "pause",
      "volumechange",
      "ratechange",
    ] as const) {
      video.addEventListener(type, () => this.updatePlaybackUi());
    }
  }

  private bindDrop(): void {
    const prevent = (event: DragEvent) => {
      event.preventDefault();
      this.ui.root.classList.add("is-dragging");
    };
    this.ui.root.addEventListener("dragover", prevent);
    this.ui.root.addEventListener("dragleave", () => this.ui.root.classList.remove("is-dragging"));
    this.ui.root.addEventListener("drop", (event) => {
      event.preventDefault();
      this.ui.root.classList.remove("is-dragging");
      const file = event.dataTransfer?.files?.[0];
      if (!file || !isVideoFile(file.name)) {
        this.showStatus("対応する動画ファイルをドロップしてください");
        return;
      }
      this.loadFile(file);
    });
  }

  private bindDragSeek(): void {
    this.ui.videoStage.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || !Number.isFinite(this.ui.video.duration)) return;
      this.dragSeek = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startTime: this.ui.video.currentTime,
        targetTime: this.ui.video.currentTime,
        frameId: 0,
        moved: false,
      };
      this.ui.videoStage.setPointerCapture(event.pointerId);
      this.ui.root.classList.add("is-drag-seeking");
    });

    this.ui.videoStage.addEventListener("pointermove", (event) => {
      if (!this.dragSeek || event.pointerId !== this.dragSeek.pointerId) return;
      const secondsPerPixel = Math.max(0.05, Math.min(0.2, (this.ui.video.duration || 0) / 36000));
      const delta = (event.clientX - this.dragSeek.startX) * secondsPerPixel;
      const nextTime = Math.max(
        0,
        Math.min(this.ui.video.duration || 0, this.dragSeek.startTime + delta),
      );
      this.dragSeek.targetTime = nextTime;
      this.dragSeek.moved = Math.abs(event.clientX - this.dragSeek.startX) > 4;
      this.ui.dragHud.textContent = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}s  ${formatTime(nextTime)}`;
      if (this.dragSeek.frameId === 0) {
        this.dragSeek.frameId = window.requestAnimationFrame(() => {
          if (!this.dragSeek) return;
          this.ui.video.currentTime = this.dragSeek.targetTime;
          this.dragSeek.frameId = 0;
        });
      }
    });

    const finish = (event: PointerEvent) => {
      if (!this.dragSeek || event.pointerId !== this.dragSeek.pointerId) return;
      this.ui.videoStage.releasePointerCapture(event.pointerId);
      const shouldTogglePlay = !this.dragSeek.moved;
      if (this.dragSeek.frameId !== 0) {
        window.cancelAnimationFrame(this.dragSeek.frameId);
        this.ui.video.currentTime = this.dragSeek.targetTime;
      }
      this.dragSeek = null;
      this.ui.root.classList.remove("is-drag-seeking");
      if (shouldTogglePlay) this.controller.togglePlay();
    };

    this.ui.videoStage.addEventListener("pointerup", finish);
    this.ui.videoStage.addEventListener("pointercancel", finish);
  }

  private bindControlLayout(): void {
    const update = () => this.updateCreateMode();
    this.controlResizeObserver = new ResizeObserver(update);
    this.controlResizeObserver.observe(this.ui.controls);
    requestAnimationFrame(update);
  }

  private bindShortcuts(): void {
    this.shortcut.register({
      key: " ",
      description: "再生/一時停止",
      action: () => this.controller.togglePlay(),
    });
    this.shortcut.register({
      key: "ArrowLeft",
      description: "巻き戻し",
      action: () => this.controller.seekBackward(this.state.settings.seekStep),
    });
    this.shortcut.register({
      key: "ArrowRight",
      description: "早送り",
      action: () => this.controller.seekForward(this.state.settings.seekStep),
    });
    this.shortcut.register({
      key: "m",
      description: "ミュート",
      action: () => this.controller.toggleMute(),
    });
    this.shortcut.register({
      key: "f",
      description: "フルスクリーン",
      action: () => void this.controller.toggleFullscreen(this.ui.root),
    });
  }

  private loadFile(file: File): void {
    if (this.currentObjectUrl) URL.revokeObjectURL(this.currentObjectUrl);
    this.currentObjectUrl = URL.createObjectURL(file);
    this.currentName = file.name;
    this.ui.video.src = this.currentObjectUrl;
    this.ui.video.load();
    this.ui.root.classList.remove("is-empty");
    this.toolbar.elements.info.textContent = `${file.name} · ${formatFileSize(file.size)} · ${file.type || "video"}`;
    this.showStatus("動画を読み込みました");
  }

  private loadUrl(url: string, name: string): void {
    this.currentName = name;
    this.ui.video.src = url;
    this.ui.video.load();
    this.ui.root.classList.remove("is-empty");
    this.toolbar.elements.info.textContent = name;
  }

  private updatePlaybackUi(): void {
    const video = this.ui.video;
    this.state.playback = {
      playing: !video.paused,
      currentTime: video.currentTime,
      duration: video.duration || 0,
      playbackRate: video.playbackRate,
      volume: video.volume,
      muted: video.muted,
    };
    setIconButton(
      this.controls.elements.play,
      video.paused ? "play-fill" : "pause-fill",
      video.paused ? "再生" : "一時停止",
    );
    setIconButton(
      this.controls.elements.mute,
      video.muted ? "volume-mute" : "volume-up",
      video.muted ? "ミュート解除" : "ミュート",
    );
    this.controls.elements.volume.value = String(video.volume);
    this.controls.elements.rate.value = String(video.playbackRate);
    updateTimeline(
      this.ui.timeline,
      this.controls.elements.timeLabel,
      video.currentTime,
      video.duration || 0,
    );
  }

  private renderSkipList(): void {
    this.skipPanel.elements.list.innerHTML = "";
    for (const range of this.skip.getRanges()) {
      const item = document.createElement("div");
      item.className = "lvl-list-item";
      item.textContent = `${formatTime(range.start)} - ${formatTime(range.end)}`;
      const remove = document.createElement("button");
      remove.className = "btn lvl-icon-btn lvl-danger-btn";
      remove.type = "button";
      setIconButton(remove, "trash3", "削除");
      remove.addEventListener("click", () => {
        this.skip.removeRange(range.id);
        this.renderSkipList();
      });
      item.appendChild(remove);
      this.skipPanel.elements.list.appendChild(item);
    }
  }

  private applyLoopFromInputs(): void {
    const start = parseTime(this.loopPanel.elements.start.value);
    const end = parseTime(this.loopPanel.elements.end.value);
    if (end <= start) {
      this.showStatus("先にAを設定してから、後ろの位置でBを押してください");
      return;
    }
    this.state.loop = this.loop.setLoop(start, end);
    this.updateLoopSummary();
    this.showStatus(`A-Bループ ${formatTime(start)} - ${formatTime(end)}`);
  }

  private clearLoop(): void {
    this.loop.clearLoop();
    this.state.loop = null;
    this.loopPanel.elements.start.value = "";
    this.loopPanel.elements.end.value = "";
    this.updateLoopSummary();
    this.showStatus("A-Bループを解除しました");
  }

  private toggleSidePin(): void {
    this.ui.root.classList.toggle("is-side-pinned");
    this.syncSidePinUi();
    this.updateCreateMode();
  }

  private updateCreateMode(): void {
    const modes = ["full", "compact", "more"] as const;

    for (const mode of modes) {
      this.ui.root.dataset.createMode = mode;
      if (!this.isCreateGroupOverflowing()) return;
    }
  }

  private isCreateGroupOverflowing(): boolean {
    const element = this.controls.root.querySelector<HTMLElement>(".lvl-create-group");
    if (!element) return false;
    return element.scrollWidth > element.clientWidth + 1;
  }

  private handleMoreAction(action: string): void {
    switch (action) {
      case "screenshot": {
        const format = `image/${this.state.settings.screenshotFormat}`;
        void this.screenshot.capture(
          this.currentName,
          format,
          this.state.settings.screenshotQuality,
        );
        break;
      }
      case "chapter":
        this.chapter.addCurrentTime();
        this.state.chapters = this.chapter.getChapters();
        this.renderChapterList();
        this.showStatus("チャプターを追加しました");
        break;
      case "subtitles":
        this.toolbar.elements.subtitleInput.click();
        break;
      case "tools":
        this.ui.root.classList.toggle("is-side-pinned");
        this.syncSidePinUi();
        this.updateCreateMode();
        break;
    }
  }

  private syncSidePinUi(): void {
    const pinned = this.ui.root.classList.contains("is-side-pinned");
    this.ui.sideToggle.setAttribute("aria-label", pinned ? "ツール固定を解除" : "ツールを固定");
    this.ui.sideToggle.title = pinned ? "ツール固定を解除" : "ツールを固定";
  }

  private async toggleWindowFullscreen(): Promise<void> {
    const response = await chrome.runtime
      .sendMessage({ type: "LOCAL_VIDEO_LAB_TOGGLE_WINDOW_FULLSCREEN" })
      .catch(() => null);
    const fullscreen = Boolean(response?.fullscreen);
    setIconButton(
      this.controls.elements.fullscreen,
      fullscreen ? "fullscreen-exit" : "fullscreen",
      fullscreen ? "全画面解除" : "全画面",
    );
  }

  private updateLoopSummary(): void {
    const loop = this.state.loop;
    this.controls.elements.loopSummary.textContent = loop
      ? `${formatTime(loop.start)} - ${formatTime(loop.end)}`
      : "ループ未設定";
    this.controls.elements.loopSummary.classList.toggle("is-active", Boolean(loop));
    this.updateCreateMode();
  }

  private renderChapterList(): void {
    this.chapterPanel.elements.list.innerHTML = "";
    for (const chapter of this.chapter.getChapters()) {
      const item = document.createElement("button");
      item.className = "lvl-list-item";
      item.type = "button";
      item.textContent = `${formatTime(chapter.time)} ${chapter.title}`;
      item.addEventListener("click", () => this.chapter.jumpTo(chapter.id));
      this.chapterPanel.elements.list.appendChild(item);
    }
  }

  private showStatus(message: string): void {
    window.clearTimeout(this.statusTimer);
    this.ui.status.textContent = message;
    this.ui.status.classList.add("is-visible");
    this.statusTimer = window.setTimeout(() => this.ui.status.classList.remove("is-visible"), 1800);
  }
}

export function getFileNameFromLocation(): string {
  const lastSegment = window.location.pathname.split("/").pop() || "video";
  return decodeURIComponent(lastSegment);
}

export function isProbablyVideoUrl(name: string): boolean {
  const lower = name.toLowerCase();
  return VIDEO_URL_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function setIconButton(button: HTMLButtonElement, iconName: string, label: string): void {
  const icon = document.createElement("i");
  icon.className = `bi bi-${iconName}`;
  icon.setAttribute("aria-hidden", "true");
  button.replaceChildren(icon);
  button.setAttribute("aria-label", label);
  button.title = label;
}
