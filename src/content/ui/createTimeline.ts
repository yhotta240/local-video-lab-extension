import { formatTime } from "../lib/time";

export function updateTimeline(
  timeline: HTMLInputElement,
  label: HTMLElement,
  currentTime: number,
  duration: number,
): void {
  timeline.max = Number.isFinite(duration) ? String(duration) : "0";
  timeline.value = Number.isFinite(currentTime) ? String(currentTime) : "0";
  label.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}
