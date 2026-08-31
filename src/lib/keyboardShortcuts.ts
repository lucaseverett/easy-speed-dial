interface KeyboardShortcutEvent {
  altKey: boolean;
  ctrlKey: boolean;
  defaultPrevented: boolean;
  key: string;
  metaKey: boolean;
  target: EventTarget | null;
}

const editableTags = new Set(["INPUT", "SELECT", "TEXTAREA"]);

export function isQuickSearchShortcut(event: KeyboardShortcutEvent) {
  if (
    event.defaultPrevented ||
    event.key !== "/" ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return false;
  }

  const target = event.target as HTMLElement | null;
  return !target?.isContentEditable && !editableTags.has(target?.tagName || "");
}
