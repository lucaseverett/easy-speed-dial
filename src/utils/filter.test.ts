import type { Bookmarks } from "webextension-polyfill";

import { describe, expect, test } from "vitest";

import { filter, isSeparatorFolder } from "./filter";

describe("filter", () => {
  test("treats folders named with three or more dashes as separators", () => {
    const [bookmark] = filter([
      {
        id: "separator-folder",
        index: 2,
        parentId: "1",
        title: "---",
        type: "folder",
      },
    ] as Bookmarks.BookmarkTreeNode[]);

    expect(bookmark).toEqual({
      id: "separator-folder",
      index: 2,
      name: [],
      parentId: "1",
      title: "---",
      type: "separator",
    });
  });

  test("requires at least three dashes and no other characters", () => {
    expect(
      isSeparatorFolder({
        id: "more-dashes",
        title: "------",
        type: "folder",
      } as Bookmarks.BookmarkTreeNode),
    ).toBe(true);

    expect(
      isSeparatorFolder({
        id: "too-few",
        title: "--",
        type: "folder",
      } as Bookmarks.BookmarkTreeNode),
    ).toBe(false);

    expect(
      isSeparatorFolder({
        id: "mixed-title",
        title: "--- folder",
        type: "folder",
      } as Bookmarks.BookmarkTreeNode),
    ).toBe(false);

    expect(
      isSeparatorFolder({
        id: "spaced",
        title: "  ---  ",
        type: "folder",
      } as Bookmarks.BookmarkTreeNode),
    ).toBe(true);
  });

  test("does not treat bookmarks with dash titles as separators", () => {
    expect(
      isSeparatorFolder({
        id: "bookmark",
        title: "------",
        type: "bookmark",
        url: "https://example.com",
      } as Bookmarks.BookmarkTreeNode),
    ).toBe(false);
  });
});
