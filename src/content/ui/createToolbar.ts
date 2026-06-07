import { el } from "../lib/dom";
import { icon } from "./icon";

export type ToolbarVideoInfo = {
  title: string;
  sourceType: string;
  path: string;
  size: string;
  mimeType: string;
  extension: string;
  duration: string;
  resolution: string;
  aspectRatio: string;
  modifiedAt: string;
  sourceUrl: string;
};

export interface ToolbarElements {
  fileInput: HTMLInputElement;
  subtitleInput: HTMLInputElement;
  title: HTMLElement;
  info: HTMLElement;
  infoButton: HTMLButtonElement;
  infoPopover: HTMLElement;
}

export function createToolbar(): { root: HTMLElement; elements: ToolbarElements } {
  const fileInput = el("input", {
    type: "file",
    accept: "video/*",
    class: "lvl-hidden-input",
  }) as HTMLInputElement;
  const subtitleInput = el("input", {
    type: "file",
    accept: ".vtt,.srt,text/vtt",
    class: "lvl-hidden-input",
  }) as HTMLInputElement;
  const openButton = el("button", { class: "btn lvl-action-btn lvl-primary-btn", type: "button", title: "動画を開く" }, [icon("folder2-open")]);
  const subtitleButton = el("button", { class: "btn lvl-action-btn", type: "button", title: "字幕" }, [icon("badge-cc")]);
  const title = el("strong", { class: "lvl-title" }, [el("i", { class: "bi bi-play-circle", "aria-hidden": "true" }), "Local Video Lab"]);
  const info = el("span", { class: "lvl-file-info" }, ["動画未選択"]);
  const infoButton = el("button", { class: "btn lvl-icon-btn lvl-info-btn", type: "button", title: "動画情報", "aria-label": "動画情報" }, [
    icon("info-circle"),
  ]) as HTMLButtonElement;
  const infoPopover = el("div", { class: "lvl-info-popover", role: "dialog", tabindex: "-1", "aria-label": "動画情報" });
  const actions = el("div", { class: "lvl-toolbar-actions" }, [openButton, subtitleButton]);
  const infoWrap = el("div", { class: "lvl-info-wrap" }, [infoButton, infoPopover]);
  const root = el("div", { class: "lvl-toolbar-inner" }, [title, info, actions, infoWrap, fileInput, subtitleInput]);

  openButton.addEventListener("click", () => fileInput.click());
  subtitleButton.addEventListener("click", () => subtitleInput.click());

  setToolbarVideoInfo(infoPopover, null);

  return {
    root,
    elements: {
      fileInput,
      subtitleInput,
      title,
      info,
      infoButton,
      infoPopover,
    },
  };
}

export function setToolbarVideoInfo(popover: HTMLElement, data: ToolbarVideoInfo | null): void {
  const rows: [string, string][] = data
    ? [
        ["タイトル", data.title],
        ["種類", data.sourceType],
        ["ファイルパス", data.path],
        ["サイズ", data.size],
        ["形式", data.mimeType],
        ["拡張子", data.extension],
        ["時間", data.duration],
        ["解像度", data.resolution],
        ["アスペクト比", data.aspectRatio],
        ["更新日時", data.modifiedAt],
        ["ソースURL", data.sourceUrl],
      ]
    : [["状態", "動画未選択"]];

  popover.innerHTML = "";
  popover.append(
    el("strong", { class: "lvl-info-popover-title" }, ["動画情報"]),
    el(
      "dl",
      { class: "lvl-info-list" },
      rows.flatMap(([label, value]) => [el("dt", {}, [label]), el("dd", {}, [value || "不明"])]),
    ),
  );
}
