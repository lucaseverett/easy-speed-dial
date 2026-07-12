import { beforeEach, describe, expect, test, vi } from "vitest";

import { bookmarks } from "./bookmarks";

const mocks = vi.hoisted(() => ({
  getBookmarkSubTree: vi.fn(),
}));

vi.mock("#lib/bookmarkApi", () => ({
  getBookmarkSubTree: mocks.getBookmarkSubTree,
}));
vi.mock("#lib/bookmarkListeners", () => ({
  registerBookmarkListeners: vi.fn(),
}));
vi.mock("#lib/tabs", () => ({
  openBackgroundTab: vi.fn(),
  openTab: vi.fn(),
  openWindow: vi.fn(),
}));
vi.mock("#stores/settings", () => ({ settings: {} }));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function folder(id: string, title: string) {
  return [{ id, title, type: "folder" as const, children: [] }];
}

describe("changeFolder", () => {
  beforeEach(() => {
    mocks.getBookmarkSubTree.mockReset();
    vi.stubGlobal("sessionStorage", { setItem: vi.fn() });
  });

  test("does not commit a stale folder request", async () => {
    const firstFolder = deferred<ReturnType<typeof folder>>();
    const secondFolder = deferred<ReturnType<typeof folder>>();
    mocks.getBookmarkSubTree.mockImplementation((id: string) =>
      id === "first" ? firstFolder.promise : secondFolder.promise,
    );

    let currentRoute = 1;
    const firstRequest = bookmarks.changeFolder(
      "first",
      () => currentRoute === 1,
    );
    currentRoute = 2;
    const secondRequest = bookmarks.changeFolder(
      "second",
      () => currentRoute === 2,
    );

    secondFolder.resolve(folder("second", "Second folder"));
    await secondRequest;
    firstFolder.resolve(folder("first", "First folder"));
    await firstRequest;

    expect(bookmarks.currentFolder).toEqual({
      id: "second",
      title: "Second folder",
    });
    expect(sessionStorage.setItem).toHaveBeenCalledTimes(1);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      "last-folder",
      "second",
    );
  });
});
