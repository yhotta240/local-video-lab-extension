import { el } from "../lib/dom";

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
  const openButton = el("button", { class: "btn btn-sm btn-primary", type: "button" }, ["Open"]);
  const subtitleButton = el("button", { class: "btn btn-sm btn-outline-light", type: "button" }, [
    "Subtitles",
  ]);
  const title = el("strong", { class: "lvl-title" }, ["Local Video Lab"]);
  const info = el("span", { class: "lvl-file-info" }, ["No file"]);
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
