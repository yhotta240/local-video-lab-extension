import { el } from "../lib/dom";

export interface ScreenshotPanelElements {
  capture: HTMLButtonElement;
  copy: HTMLButtonElement;
}

export function createScreenshotPanel(): { root: HTMLElement; elements: ScreenshotPanelElements } {
  const capture = el("button", { class: "btn btn-sm btn-primary", type: "button" }, [
    "Save Frame",
  ]) as HTMLButtonElement;
  const copy = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "Copy PNG",
  ]) as HTMLButtonElement;
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, ["Screenshot"]),
    el("div", { class: "lvl-row" }, [capture, copy]),
  ]);
  return { root, elements: { capture, copy } };
}
