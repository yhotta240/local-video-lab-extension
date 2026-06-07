import { el } from "../lib/dom";

export interface SubtitlePanelElements {
  toggle: HTMLButtonElement;
  label: HTMLElement;
}

export function createSubtitlePanel(): { root: HTMLElement; elements: SubtitlePanelElements } {
  const toggle = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "Toggle",
  ]) as HTMLButtonElement;
  const label = el("span", { class: "lvl-muted" }, ["No subtitles"]);
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, ["Subtitles"]),
    el("div", { class: "lvl-row" }, [toggle, label]),
  ]);
  return { root, elements: { toggle, label } };
}
