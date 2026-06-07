/** ストレージキーのプレフィックス */
const STORAGE_PREFIX = "vlv_";

/** chrome.storage.local からデータを読み込む */
export async function loadViewerData<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        console.warn("ストレージ読込エラー:", chrome.runtime.lastError);
        resolve(null);
        return;
      }
      const value = result[key];
      resolve(value !== undefined ? (value as T) : null);
    });
  });
}

/** chrome.storage.local にデータを保存 */
export async function saveViewerData<T>(key: string, data: T): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: data }, () => {
      if (chrome.runtime.lastError) {
        console.warn("ストレージ保存エラー:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }
      resolve();
    });
  });
}

/** chrome.storage.local からデータを削除 */
export async function removeViewerData(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(key, () => {
      if (chrome.runtime.lastError) {
        console.warn("ストレージ削除エラー:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }
      resolve();
    });
  });
}

/** ファイル名とデータ種別からストレージキーを生成 */
export function generateStorageKey(filename: string, dataType: string): string {
  // ファイル名を安全な形式に変換
  const safeName = filename
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .toLowerCase()
    .slice(0, 64);
  return `${STORAGE_PREFIX}${safeName}_${dataType}`;
}
