import { DEFAULT_SETTINGS } from "../../settings";
import { el } from "../lib/dom";

export interface ControlElements {
  play: HTMLButtonElement;
  back: HTMLButtonElement;
  forward: HTMLButtonElement;
  rate: HTMLSelectElement;
  volume: HTMLInputElement;
  mute: HTMLButtonElement;
  pip: HTMLButtonElement;
  fullscreen: HTMLButtonElement;
  timeLabel: HTMLElement;
}

export function createControls(): { root: HTMLElement; elements: ControlElements } {
  const play = el("button", { class: "btn btn-sm btn-primary", type: "button" }, [
    "Play",
  ]) as HTMLButtonElement;
  const back = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "-5s",
  ]) as HTMLButtonElement;
  const forward = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "+5s",
  ]) as HTMLButtonElement;
  const rate = el("select", { class: "form-select form-select-sm lvl-rate" }) as HTMLSelectElement;
  for (const value of DEFAULT_SETTINGS.playbackRates) {
    const option = el("option", { value: String(value) }, [`${value}x`]);
    if (value === 1) option.setAttribute("selected", "selected");
    rate.appendChild(option);
  }
  const volume = el("input", {
    class: "form-range lvl-volume",
    type: "range",
    min: "0",
    max: "1",
    step: "0.01",
    value: String(DEFAULT_SETTINGS.defaultVolume),
  }) as HTMLInputElement;
  const mute = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "Mute",
  ]) as HTMLButtonElement;
  const pip = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "PiP",
  ]) as HTMLButtonElement;
  const fullscreen = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "Full",
  ]) as HTMLButtonElement;
  const timeLabel = el("span", { class: "lvl-time" }, ["00:00 / 00:00"]);
  const root = el("div", { class: "lvl-controls-inner" }, [
    play,
    back,
    forward,
    rate,
    volume,
    mute,
    pip,
    fullscreen,
    timeLabel,
  ]);
  return {
    root,
    elements: { play, back, forward, rate, volume, mute, pip, fullscreen, timeLabel },
  };
}
