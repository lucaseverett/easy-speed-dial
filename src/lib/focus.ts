export type FocusTarget = Element | (() => Element | null) | null;

export function resolveFocusTarget(target: FocusTarget): HTMLElement | null {
  if (!target) return null;
  if (typeof target === "function") {
    const el = target();
    return (el as HTMLElement) || null;
  }
  return target as HTMLElement;
}

export function focusSafely(target: FocusTarget): boolean {
  const el = resolveFocusTarget(target);
  if (el && document.body.contains(el)) {
    el.focus();
    return true;
  }
  return false;
}

function hasCurrentTarget(value: unknown): value is {
  currentTarget: EventTarget | null;
} {
  return (
    typeof value === "object" && value !== null && "currentTarget" in value
  );
}

export function targetFromEvent(
  e: Event | { currentTarget?: EventTarget | null },
): FocusTarget {
  if (hasCurrentTarget(e)) {
    const current = e.currentTarget as Element | null;
    return current ?? null;
  }
  return null;
}

export function focusByDataId(id: string): FocusTarget {
  return () =>
    document.querySelector(`[data-id="${CSS.escape(id)}"]`) as Element | null;
}
