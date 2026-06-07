import { el } from "../lib/dom";

export interface SkipPanelElements {
  start: HTMLInputElement;
  end: HTMLInputElement;
  add: HTMLButtonElement;
  list: HTMLElement;
}

export function createSkipPanel(): { root: HTMLElement; elements: SkipPanelElements } {
  const start = el("input", {
    class: "form-control form-control-sm",
    placeholder: "Start",
  }) as HTMLInputElement;
  const end = el("input", {
    class: "form-control form-control-sm",
    placeholder: "End",
  }) as HTMLInputElement;
  const add = el("button", { class: "btn btn-sm btn-primary", type: "button" }, [
    "Add Skip",
  ]) as HTMLButtonElement;
  const list = el("div", { class: "lvl-list" });
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, ["Skip"]),
    el("div", { class: "lvl-row" }, [start, end, add]),
    list,
  ]);
  return { root, elements: { start, end, add, list } };
}
