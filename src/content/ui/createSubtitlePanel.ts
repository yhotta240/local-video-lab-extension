import { el } from "../lib/dom";
import { iconLabel } from "./icon";

export interface SubtitlePanelElements {
  toggle: HTMLButtonElement;
  label: HTMLElement;
}

export function createSubtitlePanel(): { root: HTMLElement; elements: SubtitlePanelElements } {
  const toggle = el("button", { class: "btn lvl-action-btn", type: "button" }, iconLabel("eye-slash", "非表示")) as HTMLButtonElement;
  const label = el("span", { class: "lvl-muted" }, ["字幕未読込"]);
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, [el("i", { class: "bi bi-badge-cc", "aria-hidden": "true" }), "字幕"]),
    el("div", { class: "lvl-row" }, [toggle, label]),
  ]);
  return { root, elements: { toggle, label } };
}
