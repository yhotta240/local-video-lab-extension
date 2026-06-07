import { el } from "../lib/dom";

export function icon(name: string): HTMLElement {
  return el("i", { class: `bi bi-${name}`, "aria-hidden": "true" });
}

export function iconLabel(name: string, label: string): (HTMLElement | string)[] {
  return [icon(name), el("span", {}, [label])];
}
