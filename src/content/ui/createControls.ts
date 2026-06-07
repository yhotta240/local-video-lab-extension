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
  screenshot: HTMLButtonElement;
  chapter: HTMLButtonElement;
  subtitles: HTMLButtonElement;
  tools: HTMLButtonElement;
  more: HTMLButtonElement;
  loopStart: HTMLButtonElement;
  loopEnd: HTMLButtonElement;
  loopClear: HTMLButtonElement;
  loopSummary: HTMLElement;
  timeLabel: HTMLElement;
}

export function createControls(): { root: HTMLElement; elements: ControlElements } {
  const play = el(
    "button",
    { class: "btn lvl-icon-btn lvl-play-btn", type: "button", title: "再生 / 一時停止" },
    [el("i", { class: "bi bi-play-fill", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const back = el("button", { class: "btn lvl-icon-btn", type: "button", title: "5秒戻る" }, [
    el("i", { class: "bi bi-rewind-fill", "aria-hidden": "true" }),
  ]) as HTMLButtonElement;
  const forward = el("button", { class: "btn lvl-icon-btn", type: "button", title: "5秒進む" }, [
    el("i", { class: "bi bi-fast-forward-fill", "aria-hidden": "true" }),
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
  const mute = el("button", { class: "btn lvl-icon-btn", type: "button", title: "ミュート" }, [
    el("i", { class: "bi bi-volume-up", "aria-hidden": "true" }),
  ]) as HTMLButtonElement;
  const pip = el(
    "button",
    { class: "btn lvl-icon-btn", type: "button", title: "ピクチャーインピクチャー" },
    [el("i", { class: "bi bi-pip", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const fullscreen = el("button", { class: "btn lvl-icon-btn", type: "button", title: "全画面" }, [
    el("i", { class: "bi bi-fullscreen", "aria-hidden": "true" }),
  ]) as HTMLButtonElement;
  const screenshot = el(
    "button",
    { class: "btn lvl-icon-btn lvl-optional-control", type: "button", title: "スクリーンショット" },
    [el("i", { class: "bi bi-camera", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const chapter = el(
    "button",
    {
      class: "btn lvl-icon-btn lvl-optional-control",
      type: "button",
      title: "現在位置をチャプターに追加",
    },
    [el("i", { class: "bi bi-bookmark-plus", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const subtitles = el(
    "button",
    { class: "btn lvl-icon-btn lvl-optional-control", type: "button", title: "字幕を読み込む" },
    [el("i", { class: "bi bi-badge-cc", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const tools = el(
    "button",
    { class: "btn lvl-icon-btn lvl-tools-control", type: "button", title: "ツールパネル" },
    [el("i", { class: "bi bi-sliders", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const more = el(
    "button",
    { class: "btn lvl-icon-btn lvl-more-control", type: "button", title: "その他" },
    [el("i", { class: "bi bi-three-dots", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const loopStart = el(
    "button",
    { class: "btn lvl-mini-btn", type: "button", title: "ループ開始を現在時刻に設定" },
    ["A"],
  ) as HTMLButtonElement;
  const loopEnd = el(
    "button",
    { class: "btn lvl-mini-btn", type: "button", title: "ループ終了を現在時刻に設定" },
    ["B"],
  ) as HTMLButtonElement;
  const loopClear = el(
    "button",
    { class: "btn lvl-icon-btn", type: "button", title: "ループ解除" },
    [el("i", { class: "bi bi-repeat", "aria-hidden": "true" })],
  ) as HTMLButtonElement;
  const loopSummary = el("span", { class: "lvl-loop-summary" }, ["ループ未設定"]);
  const timeLabel = el("span", { class: "lvl-time" }, ["00:00 / 00:00"]);
  const root = el("div", { class: "lvl-controls-inner" }, [
    el("div", { class: "lvl-control-group lvl-playback-group" }, [play, back, forward, timeLabel]),
    el("div", { class: "lvl-control-group lvl-loop-group" }, [
      loopStart,
      loopEnd,
      loopClear,
      loopSummary,
    ]),
    el("div", { class: "lvl-control-group lvl-create-group" }, [
      screenshot,
      chapter,
      subtitles,
      tools,
      el("div", { class: "lvl-more-wrap" }, [
        more,
        el("div", { class: "lvl-more-menu", role: "menu" }, [
          cloneMenuButton("camera", "スクリーンショット", "screenshot"),
          cloneMenuButton("bookmark-plus", "チャプター追加", "chapter"),
          cloneMenuButton("badge-cc", "字幕を読み込む", "subtitles"),
          cloneMenuButton("sliders", "ツールパネル", "tools"),
        ]),
      ]),
    ]),
    el("div", { class: "lvl-control-group lvl-audio-group" }, [rate, volume, mute, pip]),
    el("div", { class: "lvl-control-group lvl-fullscreen-group" }, [fullscreen]),
  ]);
  return {
    root,
    elements: {
      play,
      back,
      forward,
      rate,
      volume,
      mute,
      pip,
      fullscreen,
      screenshot,
      chapter,
      subtitles,
      tools,
      more,
      loopStart,
      loopEnd,
      loopClear,
      loopSummary,
      timeLabel,
    },
  };
}

function cloneMenuButton(icon: string, label: string, action: string): HTMLButtonElement {
  return el(
    "button",
    { class: "lvl-more-item", type: "button", "data-action": action, role: "menuitem" },
    [el("i", { class: `bi bi-${icon}`, "aria-hidden": "true" }), el("span", {}, [label])],
  ) as HTMLButtonElement;
}
