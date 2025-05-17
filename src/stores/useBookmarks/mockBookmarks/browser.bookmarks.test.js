import { describe, expect, test } from "vitest";

import browser from "./browser.bookmarks.js";

// Helper function to validate an object against BookmarkTreeNode type.
function isValidBookmark(obj, blueprint) {
  for (const key in blueprint) {
    if (key === "type") {
      if (obj[key] !== blueprint[key]) return false;
    } else {
      if (typeof obj[key] !== blueprint[key]) return false;
    }
  }
  return true;
}

describe("create", () => {
  test("should create a bookmark", async () => {
    const mockData = {
      parentId: "1",
      index: 0,
      title: "Test Bookmark",
      url: "http://test.com",
    };

    const result = await browser.bookmarks.create(mockData);

    // Check if the returned object matches the BookmarkTreeNode type.
    expect(
      isValidBookmark(result, {
        id: "string",
        parentId: "string",
        index: "number",
        title: "string",
        url: "string",
        type: "bookmark",
      }),
    ).toBe(true);

    // Check if the returned object has all keys and values from mockData.
    for (const key in mockData) {
      expect(result[key]).toEqual(mockData[key]);
    }
  });

  test("should create a folder", async () => {
    const mockData = {
      parentId: "1",
      title: "Test Folder",
    };

    const result = await browser.bookmarks.create(mockData);

    // Check if the returned object matches the BookmarkTreeNode type.
    expect(
      isValidBookmark(result, {
        id: "string",
        parentId: "string",
        index: "number",
        title: "string",
        type: "folder",
      }),
    ).toBe(true);

    // Check if the returned object has all keys and values from mockData.
    for (const key in mockData) {
      expect(result[key]).toEqual(mockData[key]);
    }
  });
});
