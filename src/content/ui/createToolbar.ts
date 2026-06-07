import { el } from "../lib/dom";
import { iconLabel } from "./icon";

export interface ToolbarElements {
  fileInput: HTMLInputElement;
  subtitleInput: HTMLInputElement;
  title: HTMLElement;
  info: HTMLElement;
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
  const openButton = el(
    "button",
    { class: "btn lvl-action-btn lvl-primary-btn", type: "button" },
    iconLabel("folder2-open", "動画を開く"),
  );
  const subtitleButton = el(
    "button",
    { class: "btn lvl-action-btn", type: "button" },
    iconLabel("badge-cc", "字幕"),
  );
  const title = el("strong", { class: "lvl-title" }, [
    el("i", { class: "bi bi-play-circle", "aria-hidden": "true" }),
    "Local Video Lab",
  ]);
  const info = el("span", { class: "lvl-file-info" }, ["動画未選択"]);
  const root = el("div", { class: "lvl-toolbar-inner" }, [
    title,
    info,
    openButton,
    subtitleButton,
    fileInput,
    subtitleInput,
  ]);

  openButton.addEventListener("click", () => fileInput.click());
  subtitleButton.addEventListener("click", () => subtitleInput.click());

  return { root, elements: { fileInput, subtitleInput, title, info } };
}
