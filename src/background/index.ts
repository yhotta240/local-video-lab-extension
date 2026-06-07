import { logInfo } from "../utils/logger";

const ENABLED_KEY = "localVideoLabEnabled";

async function getEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get({ [ENABLED_KEY]: true });
  return Boolean(result[ENABLED_KEY]);
}

async function setBadge(enabled: boolean): Promise<void> {
  await chrome.action.setBadgeText({ text: enabled ? "ON" : "OFF" });
  await chrome.action.setBadgeBackgroundColor({ color: enabled ? "#198754" : "#6c757d" });
}

async function notifyActiveTab(enabled: boolean): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  await chrome.tabs
    .sendMessage(tab.id, { type: "LOCAL_VIDEO_LAB_TOGGLE", enabled })
    .catch(() => undefined);
}

async function toggleWindowFullscreen(): Promise<boolean> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.windowId) return false;

  const currentWindow = await chrome.windows.get(tab.windowId);
  const fullscreen = currentWindow.state !== "fullscreen";
  await chrome.windows.update(tab.windowId, { state: fullscreen ? "fullscreen" : "normal" });
  return fullscreen;
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    logInfo("拡張機能がインストールされました", "background");
  } else if (details.reason === "update") {
    logInfo(
      `拡張機能がアップデートされました (v${details.previousVersion ?? "?"} → v${chrome.runtime.getManifest().version})`,
      "background",
    );
  }
  void getEnabled().then(setBadge);
});

chrome.runtime.onStartup.addListener(() => {
  void getEnabled().then(setBadge);
});

chrome.action.onClicked.addListener(() => {
  void (async () => {
    const enabled = !(await getEnabled());
    await chrome.storage.local.set({ [ENABLED_KEY]: enabled });
    await setBadge(enabled);
    await notifyActiveTab(enabled);
    logInfo(`Local Video Lab: ${enabled ? "enabled" : "disabled"}`, "background");
  })();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "LOCAL_VIDEO_LAB_TOGGLE_WINDOW_FULLSCREEN") return false;

  void toggleWindowFullscreen()
    .then((fullscreen) => sendResponse({ fullscreen }))
    .catch(() => sendResponse({ fullscreen: false }));

  return true;
});
