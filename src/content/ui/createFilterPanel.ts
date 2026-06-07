import { el } from "../lib/dom";
import { iconLabel } from "./icon";

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
  const brightness = slider("明るさ", "100");
  const contrast = slider("コントラスト", "100");
  const saturate = slider("彩度", "100");
  const rotation = el("select", { class: "form-select form-select-sm" }) as HTMLSelectElement;
  for (const value of [0, 90, 180, 270]) rotation.appendChild(el("option", { value: String(value) }, [`${value}deg`]));
  const flipH = el("input", { class: "form-check-input", type: "checkbox" }) as HTMLInputElement;
  const flipV = el("input", { class: "form-check-input", type: "checkbox" }) as HTMLInputElement;
  const reset = el("button", { class: "btn lvl-action-btn", type: "button" }, iconLabel("arrow-counterclockwise", "リセット")) as HTMLButtonElement;
  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, [el("i", { class: "bi bi-sliders", "aria-hidden": "true" }), "表示調整"]),
    brightness.row,
    contrast.row,
    saturate.row,
    el("div", { class: "lvl-row" }, [
      rotation,
      el("label", { class: "lvl-check" }, [flipH, " 左右反転"]),
      el("label", { class: "lvl-check" }, [flipV, " 上下反転"]),
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
