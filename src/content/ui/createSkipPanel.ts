import { el } from "../lib/dom";
import { iconLabel } from "./icon";

export interface SkipPanelElements {
  start: HTMLInputElement;
  end: HTMLInputElement;
  add: HTMLButtonElement;
  list: HTMLElement;
}

export function createSkipPanel(): { root: HTMLElement; elements: SkipPanelElements } {
  const start = el("input", {
    class: "form-control form-control-sm",
    placeholder: "開始",
  }) as HTMLInputElement;
  const end = el("input", {
    class: "form-control form-control-sm",
    placeholder: "終了",
  }) as HTMLInputElement;
  const add = el(
    "button",
    { class: "btn lvl-action-btn lvl-primary-btn", type: "button" },
    iconLabel("plus-circle", "追加"),
  ) as HTMLButtonElement;
  const list = el("div", { class: "lvl-list" });
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, [el("i", { class: "bi bi-skip-forward", "aria-hidden": "true" }), "スキップ範囲"]),
    el("div", { class: "lvl-row" }, [start, end, add]),
    list,
  ]);
  return { root, elements: { start, end, add, list } };
}
