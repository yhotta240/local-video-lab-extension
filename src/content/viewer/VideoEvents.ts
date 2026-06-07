export type VideoViewerEvent = "filechange" | "playbackchange" | "loopchange" | "skipchange" | "chapterchange" | "subtitlechange" | "filterchange";

export function emitViewerEvent(target: EventTarget, type: VideoViewerEvent, detail?: unknown): void {
  target.dispatchEvent(new CustomEvent(type, { detail }));
}
