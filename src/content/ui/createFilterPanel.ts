import { el } from "../lib/dom";

export interface FilterPanelElements {
  brightness: HTMLInputElement;
  contrast: HTMLInputElement;
  saturate: HTMLInputElement;
  rotation: HTMLSelectElement;
  flipH: HTMLInputElement;
  flipV: HTMLInputElement;
  reset: HTMLButtonElement;
}

function slider(label: string, value: string): { row: HTMLElement; input: HTMLInputElement } {
  const input = el("input", {
    class: "form-range",
    type: "range",
    min: "0",
    max: "200",
    value,
  }) as HTMLInputElement;
  return { row: el("label", { class: "lvl-slider" }, [el("span", {}, [label]), input]), input };
}

export function createFilterPanel(): { root: HTMLElement; elements: FilterPanelElements } {
  const brightness = slider("Brightness", "100");
  const contrast = slider("Contrast", "100");
  const saturate = slider("Saturate", "100");
  const rotation = el("select", { class: "form-select form-select-sm" }) as HTMLSelectElement;
  for (const value of [0, 90, 180, 270])
    rotation.appendChild(el("option", { value: String(value) }, [`${value}deg`]));
  const flipH = el("input", { class: "form-check-input", type: "checkbox" }) as HTMLInputElement;
  const flipV = el("input", { class: "form-check-input", type: "checkbox" }) as HTMLInputElement;
  const reset = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "Reset",
  ]) as HTMLButtonElement;
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, ["Filters"]),
    brightness.row,
    contrast.row,
    saturate.row,
    el("div", { class: "lvl-row" }, [
      rotation,
      el("label", {}, [flipH, " Flip H"]),
      el("label", {}, [flipV, " Flip V"]),
    ]),
    reset,
  ]);
  return {
    root,
    elements: {
      brightness: brightness.input,
      contrast: contrast.input,
      saturate: saturate.input,
      rotation,
      flipH,
      flipV,
      reset,
    },
  };
}
