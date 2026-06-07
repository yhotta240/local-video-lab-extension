import { DEFAULT_SETTINGS, type Settings } from "../../settings";
import type { Chapter } from "../types/chapter";
import type { LoopRange } from "../types/loop";
import type { SkipRange } from "../types/skip";
import type { SubtitleTrack } from "../types/subtitle";
import type { PlaybackState, VideoFileInfo } from "../types/video";
import { emitViewerEvent, type VideoViewerEvent } from "./VideoEvents";

export class VideoState extends EventTarget {
  settings: Settings = { ...DEFAULT_SETTINGS, filters: { ...DEFAULT_SETTINGS.filters } };
  fileInfo: VideoFileInfo | null = null;
  playback: PlaybackState = {
    playing: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    volume: DEFAULT_SETTINGS.defaultVolume,
    muted: false,
  };
  loop: LoopRange | null = null;
  skips: SkipRange[] = [];
  chapters: Chapter[] = [];
  subtitle: SubtitleTrack | null = null;

  update(type: VideoViewerEvent, detail?: unknown): void {
    emitViewerEvent(this, type, detail);
  }
}
