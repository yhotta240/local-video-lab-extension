/** 字幕キュー */
export interface SubtitleCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

/** 字幕トラック */
export interface SubtitleTrack {
  filename: string;
  cues: SubtitleCue[];
  format: "vtt" | "srt";
}
