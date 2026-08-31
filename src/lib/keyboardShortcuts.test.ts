import { describe, expect, test } from "vitest";

import { isQuickSearchShortcut } from "./keyboardShortcuts";

function shortcutEvent(overrides: Record<string, unknown> = {}) {
  return {
    altKey: false,
    ctrlKey: false,
    defaultPrevented: false,
    key: "/",
    metaKey: false,
    target: { isContentEditable: false, tagName: "BODY" },
    ...overrides,
  } as unknown as Parameters<typeof isQuickSearchShortcut>[0];
}

describe("isQuickSearchShortcut", () => {
  test("accepts an unmodified slash from the page", () => {
    expect(isQuickSearchShortcut(shortcutEvent())).toBe(true);
  });

  test("ignores modified shortcuts and other keys", () => {
    expect(isQuickSearchShortcut(shortcutEvent({ ctrlKey: true }))).toBe(false);
    expect(isQuickSearchShortcut(shortcutEvent({ key: "?" }))).toBe(false);
    expect(
      isQuickSearchShortcut(shortcutEvent({ defaultPrevented: true })),
    ).toBe(false);
  });

  test.each(["INPUT", "SELECT", "TEXTAREA"])(
    "does not steal focus from %s elements",
    (tagName) => {
      expect(
        isQuickSearchShortcut(shortcutEvent({ target: { tagName } })),
      ).toBe(false);
    },
  );

  test("does not steal focus from editable content", () => {
    expect(
      isQuickSearchShortcut(
        shortcutEvent({
          target: { isContentEditable: true, tagName: "DIV" },
        }),
      ),
    ).toBe(false);
  });
});
