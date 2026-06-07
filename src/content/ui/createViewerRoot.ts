import { el } from "../lib/dom";

export interface ViewerRootElements {
  root: HTMLElement;
  toolbar: HTMLElement;
  videoStage: HTMLElement;
  video: HTMLVideoElement;
  dropZone: HTMLElement;
  controls: HTMLElement;
  sideToggle: HTMLButtonElement;
  sidePin: HTMLButtonElement;
  sideClose: HTMLButtonElement;
  dragHud: HTMLElement;
  timeline: HTMLInputElement;
  timeLabel: HTMLElement;
  sidePanel: HTMLElement;
  status: HTMLElement;
}

export function createViewerRoot(): ViewerRootElements {
  const root = el("main", { class: "lvl-root", "data-theme": "dark" });
  const toolbar = el("header", { class: "lvl-toolbar" });
  const videoStage = el("section", { class: "lvl-stage" });
  const video = el("video", { class: "lvl-video", playsinline: "true" });
  const dropZone = el("div", { class: "lvl-drop-zone" }, [
    el("i", { class: "bi bi-file-earmark-play", "aria-hidden": "true" }),
    el("strong", {}, ["動画ファイルを開く"]),
    el("span", {}, ["ファイル選択またはドラッグ&ドロップ"]),
  ]);
  const controls = el("section", { class: "lvl-controls" });
  const sideToggle = el(
    "button",
    {
      class: "lvl-side-toggle",
      type: "button",
      title: "ツールを固定",
      "aria-label": "ツールを固定",
    },
    [el("i", { class: "bi bi-pin-angle", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const sidePin = el(
    "button",
    {
      class: "lvl-side-pin",
      type: "button",
      title: "固定を切り替え",
      "aria-label": "固定を切り替え",
    },
    [el("i", { class: "bi bi-pin-angle", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const sideClose = el(
    "button",
    {
      class: "lvl-side-close",
      type: "button",
      title: "ツールを閉じる",
      "aria-label": "ツールを閉じる",
    },
    [el("i", { class: "bi bi-x-lg", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const sideHeader = el("div", { class: "lvl-side-header" }, [
    el("span", {}, [el("i", { class: "bi bi-sliders", "aria-hidden": "true" }), "ツール"]),
    el("div", { class: "lvl-side-header-actions" }, [sidePin, sideClose]),
  ]);
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
  const dragHud = el("div", { class: "lvl-drag-hud", role: "status" }, ["00:00"]);

  videoStage.append(video, dropZone);
  sidePanel.appendChild(sideHeader);
  root.append(toolbar, videoStage, sideToggle, timeline, controls, sidePanel, status, dragHud);
  return {
    root,
    toolbar,
    videoStage,
    video,
    dropZone,
    controls,
    sideToggle,
    sidePin,
    sideClose,
    dragHud,
    timeline,
    timeLabel,
    sidePanel,
    status,
  };
}
