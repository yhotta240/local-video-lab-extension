/** 表示フィルター設定 */
export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

/** ビューア設定 */
export interface Settings {
  theme: "dark" | "light";
  playbackRates: number[];
  defaultVolume: number;
  seekStep: number;
  seekStepLarge: number;
  screenshotFormat: "png" | "jpeg" | "webp";
  screenshotQuality: number;
  filters: FilterSettings;
}

/** フィルター初期値 */
export const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
};

/** 設定初期値 */
export const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  defaultVolume: 1,
  seekStep: 5,
  seekStepLarge: 10,
  screenshotFormat: "png",
  screenshotQuality: 0.92,
  filters: DEFAULT_FILTERS,
};
