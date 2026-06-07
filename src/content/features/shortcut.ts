/** ショートカット定義 */
export interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

/** 入力要素のタグ名（ショートカット無効化対象） */
const INPUT_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** キーボードショートカット管理 */
export class ShortcutManager {
  private shortcuts: ShortcutAction[] = [];
  private handler: ((e: KeyboardEvent) => void) | null = null;
  private enabled = true;

  /** ショートカットを登録 */
  register(shortcut: ShortcutAction): void {
    this.shortcuts.push(shortcut);
  }

  /** キーイベントハンドラをdocumentに登録 */
  bind(): void {
    this.unbind();
    this.handler = (e: KeyboardEvent) => {
      if (!this.enabled) return;

      // 入力要素にフォーカス中はスキップ
      const target = e.target as HTMLElement;
      if (target && INPUT_TAGS.has(target.tagName)) return;

      for (const shortcut of this.shortcuts) {
        if (this.matches(e, shortcut)) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };
    document.addEventListener("keydown", this.handler);
  }

  /** ハンドラを解除 */
  unbind(): void {
    if (this.handler) {
      document.removeEventListener("keydown", this.handler);
      this.handler = null;
    }
  }

  /** 有効/無効を切り替え */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /** 登録済みショートカット一覧を取得 */
  getShortcuts(): ShortcutAction[] {
    return [...this.shortcuts];
  }

  /** リソース破棄 */
  destroy(): void {
    this.unbind();
    this.shortcuts = [];
  }

  /** キーイベントがショートカットに一致するか判定 */
  private matches(e: KeyboardEvent, shortcut: ShortcutAction): boolean {
    if (e.key.toLowerCase() !== shortcut.key.toLowerCase()) return false;
    if (!!shortcut.ctrl !== e.ctrlKey) return false;
    if (!!shortcut.shift !== e.shiftKey) return false;
    if (!!shortcut.alt !== e.altKey) return false;
    return true;
  }
}
