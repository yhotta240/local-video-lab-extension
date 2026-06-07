import { DEFAULT_SETTINGS } from "../../settings";
import { el } from "../lib/dom";

export interface SettingsPanelElements {
  openPlaybackBehavior: HTMLSelectElement;
}

export function createSettingsPanel(): { root: HTMLElement; elements: SettingsPanelElements } {
  const openPlaybackBehavior = el("select", {
    class: "form-select form-select-sm",
  }) as HTMLSelectElement;
  openPlaybackBehavior.append(el("option", { value: "pause" }, ["停止したまま"]), el("option", { value: "play" }, ["自動再生"]));
  openPlaybackBehavior.value = DEFAULT_SETTINGS.openPlaybackBehavior;

  const root = el("section", { class: "lvl-panel" }, [
    el("h2", {}, [el("i", { class: "bi bi-gear", "aria-hidden": "true" }), "設定"]),
    el("label", { class: "lvl-field" }, [el("span", {}, ["開いたとき"]), openPlaybackBehavior]),
  ]);

  return {
    root,
    elements: {
      openPlaybackBehavior,
    },
  };
}
