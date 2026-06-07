import { el } from "../lib/dom";
import { iconLabel } from "./icon";

export interface ChapterPanelElements {
  title: HTMLInputElement;
  add: HTMLButtonElement;
  list: HTMLElement;
}

export function createChapterPanel(): { root: HTMLElement; elements: ChapterPanelElements } {
  const title = el("input", {
    class: "form-control form-control-sm",
    placeholder: "チャプター名",
  }) as HTMLInputElement;
  const add = el(
    "button",
    { class: "btn lvl-action-btn lvl-primary-btn", type: "button" },
    iconLabel("bookmark-plus", "追加"),
  ) as HTMLButtonElement;
  const list = el("div", { class: "lvl-list" });
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, [el("i", { class: "bi bi-bookmarks", "aria-hidden": "true" }), "チャプター"]),
    el("div", { class: "lvl-row" }, [title, add]),
    list,
  ]);
  return { root, elements: { title, add, list } };
}
