import { el } from "../lib/dom";

export interface ViewerRootElements {
  root: HTMLElement;
  toolbar: HTMLElement;
  videoStage: HTMLElement;
  video: HTMLVideoElement;
  dropZone: HTMLElement;
  controls: HTMLElement;
  timeline: HTMLInputElement;
  timeLabel: HTMLElement;
  sidePanel: HTMLElement;
  status: HTMLElement;
}

export function createViewerRoot(): ViewerRootElements {
  const root = el("main", { class: "lvl-root", "data-theme": "dark" });
  const toolbar = el("header", { class: "lvl-toolbar" });
  const videoStage = el("section", { class: "lvl-stage" });
  const video = el("video", { class: "lvl-video", controls: "false", playsinline: "true" });
  const dropZone = el("div", { class: "lvl-drop-zone" }, [
    el("strong", {}, ["動画ファイルを選択またはドロップ"]),
    el("span", {}, ["file:// で開いた動画もここで再生します"]),
  ]);
  const controls = el("section", { class: "lvl-controls" });
  const timeline = el("input", {
    class: "form-range lvl-timeline",
    type: "range",
    min: "0",
    max: "0",
    step: "0.01",
    value: "0",
  }) as HTMLInputElement;
  const timeLabel = el("span", { class: "lvl-time" }, ["00:00 / 00:00"]);
  const sidePanel = el("aside", { class: "lvl-side" });
  const status = el("div", { class: "lvl-status", role: "status" });

  videoStage.append(video, dropZone);
  root.append(toolbar, videoStage, timeline, controls, sidePanel, status);
  return {
    root,
    toolbar,
    videoStage,
    video,
    dropZone,
    controls,
    timeline,
    timeLabel,
    sidePanel,
    status,
  };
}
