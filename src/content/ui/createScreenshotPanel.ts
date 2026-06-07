import { el } from "../lib/dom";
import { iconLabel } from "./icon";

export interface ScreenshotPanelElements {
  capture: HTMLButtonElement;
  copy: HTMLButtonElement;
}

export function createScreenshotPanel(): { root: HTMLElement; elements: ScreenshotPanelElements } {
  const capture = el("button", { class: "btn lvl-action-btn lvl-primary-btn", type: "button" }, iconLabel("camera", "保存")) as HTMLButtonElement;
  const copy = el("button", { class: "btn lvl-action-btn", type: "button" }, iconLabel("clipboard", "コピー")) as HTMLButtonElement;
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, [el("i", { class: "bi bi-camera", "aria-hidden": "true" }), "スクリーンショット"]),
    el("div", { class: "lvl-row" }, [capture, copy]),
  ]);
  return { root, elements: { capture, copy } };
}
