import { describe, expect, test, vi } from "vitest";

import browser from "./browser.bookmarks";

function isValidBookmark(
  obj: object,
  blueprint: Record<string, string>,
): boolean {
  const values = obj as Record<string, unknown>;

  for (const key in blueprint) {
    if (key === "type") {
      if (values[key] !== blueprint[key]) return false;
    } else {
      if (typeof values[key] !== blueprint[key]) return false;
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

    for (const [key, value] of Object.entries(mockData)) {
      expect(result[key as keyof typeof result]).toEqual(value);
    }
  });

  test("should create a folder", async () => {
    const mockData = {
      parentId: "1",
      title: "Test Folder",
    };

    const result = await browser.bookmarks.create(mockData);

    expect(
      isValidBookmark(result, {
        id: "string",
        parentId: "string",
        index: "number",
        title: "string",
        type: "folder",
      }),
    ).toBe(true);

    for (const [key, value] of Object.entries(mockData)) {
      expect(result[key as keyof typeof result]).toEqual(value);
    }
  });
});

describe("move", () => {
  test("should move a bookmark within the same folder, changing the index", async () => {
    const bookmark1 = await browser.bookmarks.create({
      parentId: "1",
      title: "First Bookmark",
      url: "http://first.com",
    });

    const bookmark2 = await browser.bookmarks.create({
      parentId: "1",
      title: "Second Bookmark",
      url: "http://second.com",
    });

    const bookmark3 = await browser.bookmarks.create({
      parentId: "1",
      title: "Third Bookmark",
      url: "http://third.com",
    });

    const initialIndex1 = bookmark1.index!;
    const initialIndex2 = bookmark2.index!;
    const initialIndex3 = bookmark3.index!;

    expect(initialIndex2).toBe(initialIndex1 + 1);
    expect(initialIndex3).toBe(initialIndex2 + 1);

    browser.bookmarks.move(bookmark3.id, { index: initialIndex1 });

    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];

    expect(updatedBookmark3.index).toBe(initialIndex1);
    expect(updatedBookmark1.index).toBe(initialIndex1 + 1);
    expect(updatedBookmark2.index).toBe(initialIndex1 + 2);

    expect(
      isValidBookmark(updatedBookmark3, {
        id: "string",
        parentId: "string",
        index: "number",
        title: "string",
        url: "string",
        type: "bookmark",
      }),
    ).toBe(true);

    expect(updatedBookmark3.title).toBe("Third Bookmark");
    expect(updatedBookmark3.url).toBe("http://third.com");
  });

  test("should move a bookmark to the middle position within the same folder", async () => {
    const bookmark1 = await browser.bookmarks.create({
      parentId: "1",
      title: "First Bookmark",
      url: "http://first.com",
    });

    const bookmark2 = await browser.bookmarks.create({
      parentId: "1",
      title: "Second Bookmark",
      url: "http://second.com",
    });

    const bookmark3 = await browser.bookmarks.create({
      parentId: "1",
      title: "Third Bookmark",
      url: "http://third.com",
    });

    const bookmark4 = await browser.bookmarks.create({
      parentId: "1",
      title: "Fourth Bookmark",
      url: "http://fourth.com",
    });

    const initialIndex1 = bookmark1.index!;
    const initialIndex2 = bookmark2.index!;

    browser.bookmarks.move(bookmark4.id, { index: initialIndex2 });

    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];
    const updatedBookmark4 = (await browser.bookmarks.get(bookmark4.id))[0];

    expect(updatedBookmark1.index).toBe(initialIndex1);
    expect(updatedBookmark4.index).toBe(initialIndex2);
    expect(updatedBookmark2.index).toBe(initialIndex2 + 1);
    expect(updatedBookmark3.index).toBe(initialIndex2 + 2);

    expect(updatedBookmark4.title).toBe("Fourth Bookmark");
    expect(updatedBookmark4.url).toBe("http://fourth.com");
    expect(updatedBookmark4.parentId).toBe("1");
  });

  test("should move a bookmark to a different folder without specifying index", async () => {
    const folder2 = await browser.bookmarks.create({
      parentId: "1",
      title: "Second Folder",
    });

    const bookmark1 = await browser.bookmarks.create({
      parentId: "1",
      title: "Bookmark in Folder 1",
      url: "http://bookmark1.com",
    });

    const bookmark2 = await browser.bookmarks.create({
      parentId: "1",
      title: "Another Bookmark in Folder 1",
      url: "http://bookmark2.com",
    });

    const bookmark3 = await browser.bookmarks.create({
      parentId: folder2.id,
      title: "Bookmark in Folder 2",
      url: "http://bookmark3.com",
    });

    const originalBookmark2Index = bookmark2.index;

    browser.bookmarks.move(bookmark1.id, { parentId: folder2.id });

    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];

    expect(updatedBookmark1.parentId).toBe(folder2.id);
    expect(updatedBookmark1.index).toBe(1);
    expect(updatedBookmark1.title).toBe("Bookmark in Folder 1");
    expect(updatedBookmark1.url).toBe("http://bookmark1.com");

    expect(updatedBookmark2.parentId).toBe("1");
    expect(updatedBookmark2.index!).toBeLessThan(originalBookmark2Index!);

    expect(updatedBookmark3.parentId).toBe(folder2.id);
    expect(updatedBookmark3.index).toBe(0);

    expect(
      isValidBookmark(updatedBookmark1, {
        id: "string",
        parentId: "string",
        index: "number",
        title: "string",
        url: "string",
        type: "bookmark",
      }),
    ).toBe(true);
  });

  test("should move a bookmark to a different folder with specific index", async () => {
    const folder3 = await browser.bookmarks.create({
      parentId: "1",
      title: "Third Folder",
    });

    const bookmark1 = await browser.bookmarks.create({
      parentId: folder3.id,
      title: "First in Folder 3",
      url: "http://first.com",
    });

    const bookmark2 = await browser.bookmarks.create({
      parentId: folder3.id,
      title: "Second in Folder 3",
      url: "http://second.com",
    });

    const bookmark3 = await browser.bookmarks.create({
      parentId: folder3.id,
      title: "Third in Folder 3",
      url: "http://third.com",
    });

    const bookmarkToMove = await browser.bookmarks.create({
      parentId: "1",
      title: "Bookmark to Move",
      url: "http://tomove.com",
    });

    browser.bookmarks.move(bookmarkToMove.id, {
      parentId: folder3.id,
      index: 1,
    });

    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];
    const updatedBookmarkToMove = (
      await browser.bookmarks.get(bookmarkToMove.id)
    )[0];

    expect(updatedBookmarkToMove.parentId).toBe(folder3.id);
    expect(updatedBookmarkToMove.index).toBe(1);
    expect(updatedBookmarkToMove.title).toBe("Bookmark to Move");

    expect(updatedBookmark1.index).toBe(0);
    expect(updatedBookmark2.index).toBe(2);
    expect(updatedBookmark3.index).toBe(3);

    expect(updatedBookmark1.parentId).toBe(folder3.id);
    expect(updatedBookmark2.parentId).toBe(folder3.id);
    expect(updatedBookmark3.parentId).toBe(folder3.id);
  });

  test("should move a folder to a different folder", async () => {
    const parentFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Parent Folder",
    });

    const childFolder = await browser.bookmarks.create({
      parentId: parentFolder.id,
      title: "Child Folder",
    });

    const anotherParentFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Another Parent Folder",
    });

    const bookmark = await browser.bookmarks.create({
      parentId: childFolder.id,
      title: "Bookmark in Child",
      url: "http://child.com",
    });

    browser.bookmarks.move(childFolder.id, {
      parentId: anotherParentFolder.id,
    });

    const updatedChildFolder = (await browser.bookmarks.get(childFolder.id))[0];
    const updatedBookmark = (await browser.bookmarks.get(bookmark.id))[0];

    expect(updatedChildFolder.parentId).toBe(anotherParentFolder.id);
    expect(updatedChildFolder.title).toBe("Child Folder");
    expect(updatedChildFolder.type).toBe("folder");

    expect(updatedBookmark.parentId).toBe(childFolder.id);
    expect(updatedBookmark.title).toBe("Bookmark in Child");

    expect(
      isValidBookmark(updatedChildFolder, {
        id: "string",
        parentId: "string",
        index: "number",
        title: "string",
        type: "folder",
      }),
    ).toBe(true);
  });

  test("should properly sort and reindex old folder when moving bookmark to different folder", async () => {
    const sourceFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Source Folder",
    });

    const destinationFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Destination Folder",
    });

    const bookmark1 = await browser.bookmarks.create({
      parentId: sourceFolder.id,
      title: "First Bookmark",
      url: "http://first.com",
    });

    const bookmark2 = await browser.bookmarks.create({
      parentId: sourceFolder.id,
      title: "Second Bookmark",
      url: "http://second.com",
    });

    const bookmark3 = await browser.bookmarks.create({
      parentId: sourceFolder.id,
      title: "Third Bookmark",
      url: "http://third.com",
    });

    const bookmark4 = await browser.bookmarks.create({
      parentId: sourceFolder.id,
      title: "Fourth Bookmark",
      url: "http://fourth.com",
    });

    expect(bookmark1.index).toBe(0);
    expect(bookmark2.index).toBe(1);
    expect(bookmark3.index).toBe(2);
    expect(bookmark4.index).toBe(3);

    browser.bookmarks.move(bookmark2.id, { parentId: destinationFolder.id });

    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];
    const updatedBookmark4 = (await browser.bookmarks.get(bookmark4.id))[0];
    const movedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];

    expect(updatedBookmark1.index).toBe(0);
    expect(updatedBookmark3.index).toBe(1);
    expect(updatedBookmark4.index).toBe(2);

    expect(updatedBookmark1.parentId).toBe(sourceFolder.id);
    expect(updatedBookmark3.parentId).toBe(sourceFolder.id);
    expect(updatedBookmark4.parentId).toBe(sourceFolder.id);

    expect(movedBookmark2.parentId).toBe(destinationFolder.id);
    expect(movedBookmark2.index).toBe(0);

    const sourceChildren = browser.bookmarks.getChildren(sourceFolder.id);
    const destChildren = browser.bookmarks.getChildren(destinationFolder.id);

    expect(sourceChildren).toHaveLength(3);
    expect(sourceChildren[0].id).toBe(bookmark1.id);
    expect(sourceChildren[0].index).toBe(0);
    expect(sourceChildren[1].id).toBe(bookmark3.id);
    expect(sourceChildren[1].index).toBe(1);
    expect(sourceChildren[2].id).toBe(bookmark4.id);
    expect(sourceChildren[2].index).toBe(2);

    expect(destChildren).toHaveLength(1);
    expect(destChildren[0].id).toBe(bookmark2.id);
    expect(destChildren[0].index).toBe(0);
  });

  test("should properly reindex when moving first bookmark from folder", async () => {
    const sourceFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Source Folder Test",
    });

    const destinationFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Destination Folder Test",
    });

    const firstBookmark = await browser.bookmarks.create({
      parentId: sourceFolder.id,
      title: "First to Move",
      url: "http://first-move.com",
    });

    const secondBookmark = await browser.bookmarks.create({
      parentId: sourceFolder.id,
      title: "Second Stays",
      url: "http://second-stays.com",
    });

    const thirdBookmark = await browser.bookmarks.create({
      parentId: sourceFolder.id,
      title: "Third Stays",
      url: "http://third-stays.com",
    });

    browser.bookmarks.move(firstBookmark.id, {
      parentId: destinationFolder.id,
    });

    const updatedSecond = (await browser.bookmarks.get(secondBookmark.id))[0];
    const updatedThird = (await browser.bookmarks.get(thirdBookmark.id))[0];

    expect(updatedSecond.index).toBe(0);
    expect(updatedThird.index).toBe(1);

    const sourceChildren = browser.bookmarks.getChildren(sourceFolder.id);
    expect(sourceChildren).toHaveLength(2);
    expect(sourceChildren[0].id).toBe(secondBookmark.id);
    expect(sourceChildren[0].index).toBe(0);
    expect(sourceChildren[1].id).toBe(thirdBookmark.id);
    expect(sourceChildren[1].index).toBe(1);
  });
});

describe("remove", () => {
  test("should remove a bookmark and reindex remaining bookmarks", async () => {
    const testFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Test Folder",
    });

    const bookmark1 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "First Bookmark",
      url: "http://first.com",
    });

    const bookmark2 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "Second Bookmark",
      url: "http://second.com",
    });

    const bookmark3 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "Third Bookmark",
      url: "http://third.com",
    });

    const bookmark4 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "Fourth Bookmark",
      url: "http://fourth.com",
    });

    expect(bookmark1.index).toBe(0);
    expect(bookmark2.index).toBe(1);
    expect(bookmark3.index).toBe(2);
    expect(bookmark4.index).toBe(3);

    browser.bookmarks.remove(bookmark2.id);

    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];
    const updatedBookmark4 = (await browser.bookmarks.get(bookmark4.id))[0];

    await expect(browser.bookmarks.get(bookmark2.id)).rejects.toThrow(
      "No bookmarks found",
    );

    expect(updatedBookmark1.index).toBe(0);
    expect(updatedBookmark3.index).toBe(1);
    expect(updatedBookmark4.index).toBe(2);

    const children = browser.bookmarks.getChildren(testFolder.id);
    expect(children).toHaveLength(3);
    expect(children[0].id).toBe(bookmark1.id);
    expect(children[0].index).toBe(0);
    expect(children[1].id).toBe(bookmark3.id);
    expect(children[1].index).toBe(1);
    expect(children[2].id).toBe(bookmark4.id);
    expect(children[2].index).toBe(2);
  });

  test("should remove first bookmark and reindex remaining bookmarks", async () => {
    const testFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Test Folder Remove First",
    });

    const bookmark1 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "First to Remove",
      url: "http://remove-first.com",
    });

    const bookmark2 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "Second Stays",
      url: "http://second-stays.com",
    });

    const bookmark3 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "Third Stays",
      url: "http://third-stays.com",
    });

    browser.bookmarks.remove(bookmark1.id);

    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];

    expect(updatedBookmark2.index).toBe(0);
    expect(updatedBookmark3.index).toBe(1);

    const children = browser.bookmarks.getChildren(testFolder.id);
    expect(children).toHaveLength(2);
    expect(children[0].id).toBe(bookmark2.id);
    expect(children[0].index).toBe(0);
    expect(children[1].id).toBe(bookmark3.id);
    expect(children[1].index).toBe(1);
  });

  test("should remove last bookmark without affecting other indices", async () => {
    const testFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Test Folder Remove Last",
    });

    const bookmark1 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "First Stays",
      url: "http://first-stays.com",
    });

    const bookmark2 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "Second Stays",
      url: "http://second-stays.com",
    });

    const bookmark3 = await browser.bookmarks.create({
      parentId: testFolder.id,
      title: "Third to Remove",
      url: "http://remove-last.com",
    });

    browser.bookmarks.remove(bookmark3.id);

    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];

    expect(updatedBookmark1.index).toBe(0);
    expect(updatedBookmark2.index).toBe(1);

    const children = browser.bookmarks.getChildren(testFolder.id);
    expect(children).toHaveLength(2);
    expect(children[0].id).toBe(bookmark1.id);
    expect(children[0].index).toBe(0);
    expect(children[1].id).toBe(bookmark2.id);
    expect(children[1].index).toBe(1);
  });

  test("should remove folder with its children", async () => {
    const parentFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Parent to Remove",
    });

    const childBookmark = await browser.bookmarks.create({
      parentId: parentFolder.id,
      title: "Child Bookmark",
      url: "http://child.com",
    });

    const childFolder = await browser.bookmarks.create({
      parentId: parentFolder.id,
      title: "Child Folder",
    });

    browser.bookmarks.remove(parentFolder.id);

    await expect(browser.bookmarks.get(parentFolder.id)).rejects.toThrow(
      "No bookmarks found",
    );
    await expect(browser.bookmarks.get(childBookmark.id)).rejects.toThrow(
      "No bookmarks found",
    );
    await expect(browser.bookmarks.get(childFolder.id)).rejects.toThrow(
      "No bookmarks found",
    );
  });
});

describe("get", () => {
  test("should get a single bookmark by id and return an array", async () => {
    const mockData = {
      parentId: "1",
      title: "Test Bookmark",
      url: "http://test.com",
    };

    const bookmark = await browser.bookmarks.create(mockData);
    const result = await browser.bookmarks.get(bookmark.id);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(bookmark.id);
    expect(result[0].title).toBe(mockData.title);
    expect(result[0].url).toBe(mockData.url);
  });

  test("should get multiple bookmarks by id array and return an array", async () => {
    const bookmark1 = await browser.bookmarks.create({
      parentId: "1",
      title: "Bookmark 1",
      url: "http://test1.com",
    });

    const bookmark2 = await browser.bookmarks.create({
      parentId: "1",
      title: "Bookmark 2",
      url: "http://test2.com",
    });

    const result = await browser.bookmarks.get([bookmark1.id, bookmark2.id]);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result.map((b) => b.id)).toEqual(
      expect.arrayContaining([bookmark1.id, bookmark2.id]),
    );
  });

  test("should get folder by id and return an array", async () => {
    const folder = await browser.bookmarks.create({
      parentId: "1",
      title: "Test Folder",
    });

    const result = await browser.bookmarks.get(folder.id);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(folder.id);
    expect(result[0].type).toBe("folder");
    expect(result[0].title).toBe("Test Folder");
  });

  test("should reject with error for non-existent bookmark id", async () => {
    await expect(browser.bookmarks.get("non-existent-id")).rejects.toThrow(
      "No bookmarks found",
    );
  });

  test("should reject with error for array containing non-existent ids", async () => {
    const bookmark = await browser.bookmarks.create({
      parentId: "1",
      title: "Valid Bookmark",
      url: "http://valid.com",
    });

    await expect(
      browser.bookmarks.get([bookmark.id, "non-existent-id"]),
    ).rejects.toThrow("No bookmarks found");
  });

  test("should return partial results when some ids exist and some don't", async () => {
    const bookmark = await browser.bookmarks.create({
      parentId: "1",
      title: "Valid Bookmark",
      url: "http://valid.com",
    });

    await expect(
      browser.bookmarks.get([bookmark.id, "non-existent-id"]),
    ).rejects.toThrow("No bookmarks found");
  });

  test("should reject with error for empty array", async () => {
    await expect(browser.bookmarks.get([])).rejects.toThrow(
      "No bookmarks found",
    );
  });

  test("should get root bookmark bar by id", async () => {
    const result = await browser.bookmarks.get("1");

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
    expect(result[0].title).toBe("Bookmarks Bar");
    expect(result[0].type).toBe("folder");
  });
});

describe("update", () => {
  test("should update only the title of a bookmark", async () => {
    const bookmark = await browser.bookmarks.create({
      parentId: "1",
      title: "Old Title",
      url: "http://test.com",
    });
    const updated = await browser.bookmarks.update(bookmark.id, {
      title: "New Title",
    });
    expect(updated.title).toBe("New Title");
    expect(updated.url).toBe("http://test.com");
  });

  test("should update only the url of a bookmark", async () => {
    const bookmark = await browser.bookmarks.create({
      parentId: "1",
      title: "Test Title",
      url: "http://old.com",
    });
    const updated = await browser.bookmarks.update(bookmark.id, {
      url: "http://new.com",
    });
    expect(updated.url).toBe("http://new.com");
    expect(updated.title).toBe("Test Title");
  });

  test("should throw when updating a non-existent bookmark", () => {
    expect(() =>
      browser.bookmarks.update("non-existent-id", { title: "X" }),
    ).toThrow();
  });
});

describe("error handling", () => {
  test("should throw when moving to a non-existent parent", () => {
    const bookmark = browser.bookmarks.create({
      parentId: "1",
      title: "Test",
      url: "http://test.com",
    });
    expect(() =>
      browser.bookmarks.move(bookmark.id, { parentId: "non-existent" }),
    ).toThrow();
  });

  test("should throw when moving to a non-folder parent", () => {
    const folder = browser.bookmarks.create({
      parentId: "1",
      title: "Folder",
    });
    const bookmark = browser.bookmarks.create({
      parentId: folder.id,
      title: "Test",
      url: "http://test.com",
    });
    expect(() =>
      browser.bookmarks.move(bookmark.id, { parentId: bookmark.id }),
    ).toThrow();
  });

  test("should throw when removing a non-existent bookmark", () => {
    expect(() => browser.bookmarks.remove("non-existent-id")).toThrow();
  });

  test("should throw when creating with a non-existent parent", () => {
    expect(() =>
      browser.bookmarks.create({ parentId: "non-existent", title: "X" }),
    ).toThrow();
  });

  test("should throw when creating with a non-folder parent", () => {
    const bookmark = browser.bookmarks.create({
      parentId: "1",
      title: "Test",
      url: "http://test.com",
    });
    expect(() =>
      browser.bookmarks.create({ parentId: bookmark.id, title: "X" }),
    ).toThrow();
  });
});

describe("search", () => {
  test("should match bookmarks by title (case-insensitive)", async () => {
    browser.bookmarks.create({
      parentId: "1",
      title: "Search Title Example",
      url: "http://example-title.com",
    });

    const results = await browser.bookmarks.search("search title");

    expect(results.some((b) => b.title === "Search Title Example")).toBe(true);
  });

  test("should match bookmarks by url", async () => {
    browser.bookmarks.create({
      parentId: "1",
      title: "No Match Here",
      url: "http://uniqueurltoken.example",
    });

    const results = await browser.bookmarks.search("uniqueurltoken");

    expect(results.some((b) => b.url === "http://uniqueurltoken.example")).toBe(
      true,
    );
  });

  test("should match folders by title", async () => {
    browser.bookmarks.create({
      parentId: "1",
      title: "Searchable Folder Name",
    });

    const results = await browser.bookmarks.search("searchable folder");

    expect(
      results.some(
        (b) => b.title === "Searchable Folder Name" && b.type === "folder",
      ),
    ).toBe(true);
  });

  test("should require all whitespace-separated tokens to match", async () => {
    browser.bookmarks.create({
      parentId: "1",
      title: "Alpha Bravo",
      url: "http://alphabravo.com",
    });

    expect(
      (await browser.bookmarks.search("alpha bravo")).some(
        (b) => b.title === "Alpha Bravo",
      ),
    ).toBe(true);
    expect(
      (await browser.bookmarks.search("alpha zulu")).some(
        (b) => b.title === "Alpha Bravo",
      ),
    ).toBe(false);
  });

  test("should not return the hidden root container", async () => {
    const results = await browser.bookmarks.search("Bookmarks");
    expect(results.some((b) => b.id === "0")).toBe(false);
  });
});

describe("bookmark events", () => {
  test("deduplicates and removes listeners", async () => {
    const listener = vi.fn();
    browser.bookmarks.onCreated.addListener(listener);
    browser.bookmarks.onCreated.addListener(listener);

    await browser.bookmarks.create({
      parentId: "1",
      title: "Listener test bookmark",
      url: "https://example.com/listener-test",
    });
    expect(listener).toHaveBeenCalledTimes(1);

    browser.bookmarks.onCreated.removeListener(listener);
    await browser.bookmarks.create({
      parentId: "1",
      title: "Removed listener test bookmark",
      url: "https://example.com/removed-listener-test",
    });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
