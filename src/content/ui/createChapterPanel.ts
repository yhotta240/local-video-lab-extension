import { el } from "../lib/dom";

export interface ChapterPanelElements {
  title: HTMLInputElement;
  add: HTMLButtonElement;
  list: HTMLElement;
}

export function createChapterPanel(): { root: HTMLElement; elements: ChapterPanelElements } {
  const title = el("input", {
    class: "form-control form-control-sm",
    placeholder: "Chapter title",
  }) as HTMLInputElement;
  const add = el("button", { class: "btn btn-sm btn-primary", type: "button" }, [
    "Add",
  ]) as HTMLButtonElement;
  const list = el("div", { class: "lvl-list" });
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, ["Chapters"]),
    el("div", { class: "lvl-row" }, [title, add]),
    list,
  ]);
  return { root, elements: { title, add, list } };
}
