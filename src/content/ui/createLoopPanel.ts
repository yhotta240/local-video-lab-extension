import { el } from "../lib/dom";
import { iconLabel } from "./icon";

export interface LoopPanelElements {
  start: HTMLInputElement;
  end: HTMLInputElement;
  setStart: HTMLButtonElement;
  setEnd: HTMLButtonElement;
  apply: HTMLButtonElement;
  clear: HTMLButtonElement;
}

export function createLoopPanel(): { root: HTMLElement; elements: LoopPanelElements } {
  const start = el("input", {
    class: "form-control form-control-sm",
    placeholder: "開始",
  }) as HTMLInputElement;
  const end = el("input", {
    class: "form-control form-control-sm",
    placeholder: "終了",
  }) as HTMLInputElement;
  const setStart = el("button", { class: "btn lvl-icon-btn", type: "button", title: "開始を現在時刻に設定" }, ["A"]) as HTMLButtonElement;
  const setEnd = el("button", { class: "btn lvl-icon-btn", type: "button", title: "終了を現在時刻に設定" }, ["B"]) as HTMLButtonElement;
  const apply = el("button", { class: "btn lvl-action-btn lvl-primary-btn", type: "button" }, iconLabel("repeat", "ループ")) as HTMLButtonElement;
  const clear = el("button", { class: "btn lvl-action-btn", type: "button" }, iconLabel("x-circle", "解除")) as HTMLButtonElement;
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, [el("i", { class: "bi bi-repeat", "aria-hidden": "true" }), "A-Bループ"]),
    el("div", { class: "lvl-row" }, [start, setStart]),
    el("div", { class: "lvl-row" }, [end, setEnd]),
    el("div", { class: "lvl-row" }, [apply, clear]),
  ]);
  return { root, elements: { start, end, setStart, setEnd, apply, clear } };
}
