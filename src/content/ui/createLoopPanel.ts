import { el } from "../lib/dom";

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
    placeholder: "Start",
  }) as HTMLInputElement;
  const end = el("input", {
    class: "form-control form-control-sm",
    placeholder: "End",
  }) as HTMLInputElement;
  const setStart = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "A",
  ]) as HTMLButtonElement;
  const setEnd = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "B",
  ]) as HTMLButtonElement;
  const apply = el("button", { class: "btn btn-sm btn-primary", type: "button" }, [
    "Loop",
  ]) as HTMLButtonElement;
  const clear = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "Clear",
  ]) as HTMLButtonElement;
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, ["A-B Loop"]),
    el("div", { class: "lvl-row" }, [start, setStart]),
    el("div", { class: "lvl-row" }, [end, setEnd]),
    el("div", { class: "lvl-row" }, [apply, clear]),
  ]);
  return { root, elements: { start, end, setStart, setEnd, apply, clear } };
}
