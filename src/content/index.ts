import { getFileNameFromLocation, isProbablyVideoUrl, VideoViewer } from "./viewer/VideoViewer";

type ToggleMessage = {
  type: "LOCAL_VIDEO_LAB_TOGGLE";
  enabled: boolean;
};

let viewer: VideoViewer | null = null;

function shouldAutoMount(): boolean {
  if (window.location.protocol !== "file:") return false;
  return isProbablyVideoUrl(getFileNameFromLocation());
}

function mountViewer(): void {
  if (viewer || !shouldAutoMount()) return;
  viewer = new VideoViewer({
    sourceUrl: window.location.href,
    sourceName: getFileNameFromLocation(),
  });
  viewer.mount();
}

function destroyViewer(): void {
  viewer?.destroy();
  viewer = null;
}

chrome.storage.local.get({ localVideoLabEnabled: true }, (result) => {
  if (result.localVideoLabEnabled) mountViewer();
});

chrome.runtime.onMessage.addListener((message: ToggleMessage) => {
  if (message.type !== "LOCAL_VIDEO_LAB_TOGGLE") return;
  if (message.enabled) {
    mountViewer();
  } else {
    destroyViewer();
  }
});
