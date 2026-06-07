import { clamp } from "../lib/time";

/** 再生制御マネージャー */
export class PlaybackManager {
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  /** 再生 */
  play(): void {
    this.video.play();
  }

  /** 一時停止 */
  pause(): void {
    this.video.pause();
  }

  /** 再生/一時停止を切り替え */
  togglePlay(): void {
    if (this.video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  /** 指定時刻にシーク */
  seekTo(time: number): void {
    const clamped = clamp(time, 0, this.video.duration || 0);
    this.video.currentTime = clamped;
  }

  /** 前方にシーク */
  seekForward(seconds: number): void {
    this.seekTo(this.video.currentTime + seconds);
  }

  /** 後方にシーク */
  seekBackward(seconds: number): void {
    this.seekTo(this.video.currentTime - seconds);
  }

  /** 再生速度を設定 */
  setRate(rate: number): void {
    this.video.playbackRate = rate;
  }

  /** 現在の再生速度を取得 */
  getRate(): number {
    return this.video.playbackRate;
  }

  /** 音量を設定（0〜1） */
  setVolume(volume: number): void {
    this.video.volume = clamp(volume, 0, 1);
  }

  /** 現在の音量を取得 */
  getVolume(): number {
    return this.video.volume;
  }

  /** ミュート切り替え */
  toggleMute(): void {
    this.video.muted = !this.video.muted;
  }

  /** ミュート状態を取得 */
  isMuted(): boolean {
    return this.video.muted;
  }

  /** フルスクリーン切り替え */
  async toggleFullscreen(container: HTMLElement): Promise<void> {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await container.requestFullscreen();
    }
  }

  /** ピクチャーインピクチャー切り替え */
  async togglePiP(): Promise<void> {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await this.video.requestPictureInPicture();
    }
  }
}
