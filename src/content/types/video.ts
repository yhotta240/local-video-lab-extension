/** 動画ファイル情報 */
export interface VideoFileInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
  width: number;
  height: number;
}

/** 再生状態 */
export interface PlaybackState {
  playing: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  muted: boolean;
}
