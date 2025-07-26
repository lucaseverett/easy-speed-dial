import { describe, expect, test } from "vitest";

import browser from "./browser.bookmarks";

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

describe("move", () => {
  test("should move a bookmark within the same folder, changing the index", async () => {
    // First create multiple bookmarks in the same folder to test reordering
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

    // Store initial indexes for comparison (they should be consecutive)
    const initialIndex1 = bookmark1.index;
    const initialIndex2 = bookmark2.index;
    const initialIndex3 = bookmark3.index;

    // Verify they are consecutive
    expect(initialIndex2).toBe(initialIndex1 + 1);
    expect(initialIndex3).toBe(initialIndex2 + 1);

    // Move bookmark3 to the first position (to initialIndex1)
    browser.bookmarks.move(bookmark3.id, { index: initialIndex1 });

    // Get the updated bookmarks to verify new positions
    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];

    // After moving bookmark3 to the first position, the order should be:
    // bookmark3 (first position), bookmark1 (second position), bookmark2 (third position)
    expect(updatedBookmark3.index).toBe(initialIndex1);
    expect(updatedBookmark1.index).toBe(initialIndex1 + 1);
    expect(updatedBookmark2.index).toBe(initialIndex1 + 2);

    // Verify the bookmark moved is still valid
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
    // Create multiple bookmarks in the same folder
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

    // Store initial indexes
    const initialIndex1 = bookmark1.index;
    const initialIndex2 = bookmark2.index;

    // Move bookmark4 to the second position (between bookmark1 and bookmark2)
    browser.bookmarks.move(bookmark4.id, { index: initialIndex2 });

    // Get updated bookmarks
    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];
    const updatedBookmark4 = (await browser.bookmarks.get(bookmark4.id))[0];

    // After moving bookmark4 to second position, order should be:
    // bookmark1 (first), bookmark4 (second), bookmark2 (third), bookmark3 (fourth)
    expect(updatedBookmark1.index).toBe(initialIndex1);
    expect(updatedBookmark4.index).toBe(initialIndex2);
    expect(updatedBookmark2.index).toBe(initialIndex2 + 1);
    expect(updatedBookmark3.index).toBe(initialIndex2 + 2);

    // Verify the moved bookmark retains its properties
    expect(updatedBookmark4.title).toBe("Fourth Bookmark");
    expect(updatedBookmark4.url).toBe("http://fourth.com");
    expect(updatedBookmark4.parentId).toBe("1");
  });

  test("should move a bookmark to a different folder without specifying index", async () => {
    // Create a second folder
    const folder2 = await browser.bookmarks.create({
      parentId: "1",
      title: "Second Folder",
    });

    // Create bookmarks in the first folder
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

    // Create a bookmark in the second folder
    const bookmark3 = await browser.bookmarks.create({
      parentId: folder2.id,
      title: "Bookmark in Folder 2",
      url: "http://bookmark3.com",
    });

    // Store original indexes before move
    const originalBookmark2Index = bookmark2.index;

    // Move bookmark1 to folder2 (without specifying index - should go to end)
    browser.bookmarks.move(bookmark1.id, { parentId: folder2.id });

    // Get updated bookmarks
    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];

    // Verify bookmark1 moved to folder2
    expect(updatedBookmark1.parentId).toBe(folder2.id);
    expect(updatedBookmark1.index).toBe(1); // Should be after bookmark3
    expect(updatedBookmark1.title).toBe("Bookmark in Folder 1");
    expect(updatedBookmark1.url).toBe("http://bookmark1.com");

    // Verify bookmark2 index updated in original folder (should be less than its original value)
    expect(updatedBookmark2.parentId).toBe("1");
    expect(updatedBookmark2.index).toBeLessThan(originalBookmark2Index); // Should have decreased after bookmark1 was removed

    // Verify bookmark3 remained in folder2 with correct index
    expect(updatedBookmark3.parentId).toBe(folder2.id);
    expect(updatedBookmark3.index).toBe(0); // Should still be first in folder 2

    // Verify bookmark structure is valid
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
    // Create a third folder
    const folder3 = await browser.bookmarks.create({
      parentId: "1",
      title: "Third Folder",
    });

    // Create multiple bookmarks in folder3
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

    // Create a bookmark in the main folder to move
    const bookmarkToMove = await browser.bookmarks.create({
      parentId: "1",
      title: "Bookmark to Move",
      url: "http://tomove.com",
    });

    // Move bookmarkToMove to folder3 at index 1 (between bookmark1 and bookmark2)
    browser.bookmarks.move(bookmarkToMove.id, {
      parentId: folder3.id,
      index: 1,
    });

    // Get updated bookmarks
    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];
    const updatedBookmarkToMove = (
      await browser.bookmarks.get(bookmarkToMove.id)
    )[0];

    // Verify bookmarkToMove is in correct position
    expect(updatedBookmarkToMove.parentId).toBe(folder3.id);
    expect(updatedBookmarkToMove.index).toBe(1);
    expect(updatedBookmarkToMove.title).toBe("Bookmark to Move");

    // Verify other bookmarks shifted correctly
    expect(updatedBookmark1.index).toBe(0); // Still first
    expect(updatedBookmark2.index).toBe(2); // Shifted down
    expect(updatedBookmark3.index).toBe(3); // Shifted down

    // All should still be in folder3
    expect(updatedBookmark1.parentId).toBe(folder3.id);
    expect(updatedBookmark2.parentId).toBe(folder3.id);
    expect(updatedBookmark3.parentId).toBe(folder3.id);
  });

  test("should move a folder to a different folder", async () => {
    // Create nested folders
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

    // Create a bookmark in the child folder
    const bookmark = await browser.bookmarks.create({
      parentId: childFolder.id,
      title: "Bookmark in Child",
      url: "http://child.com",
    });

    // Move childFolder to anotherParentFolder
    browser.bookmarks.move(childFolder.id, {
      parentId: anotherParentFolder.id,
    });

    // Get updated folders
    const updatedChildFolder = (await browser.bookmarks.get(childFolder.id))[0];
    const updatedBookmark = (await browser.bookmarks.get(bookmark.id))[0];

    // Verify folder moved
    expect(updatedChildFolder.parentId).toBe(anotherParentFolder.id);
    expect(updatedChildFolder.title).toBe("Child Folder");
    expect(updatedChildFolder.type).toBe("folder");

    // Verify bookmark is still in the moved folder
    expect(updatedBookmark.parentId).toBe(childFolder.id);
    expect(updatedBookmark.title).toBe("Bookmark in Child");

    // Verify folder structure is valid
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
    // Create a folder with multiple bookmarks
    const sourceFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Source Folder",
    });

    const destinationFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Destination Folder",
    });

    // Create bookmarks in source folder in specific order
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

    // Verify initial indices (should be 0, 1, 2, 3)
    expect(bookmark1.index).toBe(0);
    expect(bookmark2.index).toBe(1);
    expect(bookmark3.index).toBe(2);
    expect(bookmark4.index).toBe(3);

    // Move bookmark2 (middle bookmark) to destination folder
    browser.bookmarks.move(bookmark2.id, { parentId: destinationFolder.id });

    // Get updated bookmarks from source folder
    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];
    const updatedBookmark4 = (await browser.bookmarks.get(bookmark4.id))[0];
    const movedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];

    // Verify that remaining bookmarks in source folder are properly reindexed
    expect(updatedBookmark1.index).toBe(0); // Should remain first
    expect(updatedBookmark3.index).toBe(1); // Should move up from 2 to 1
    expect(updatedBookmark4.index).toBe(2); // Should move up from 3 to 2

    // Verify all remaining bookmarks are still in source folder
    expect(updatedBookmark1.parentId).toBe(sourceFolder.id);
    expect(updatedBookmark3.parentId).toBe(sourceFolder.id);
    expect(updatedBookmark4.parentId).toBe(sourceFolder.id);

    // Verify moved bookmark is in destination folder
    expect(movedBookmark2.parentId).toBe(destinationFolder.id);
    expect(movedBookmark2.index).toBe(0); // Should be first in destination folder

    // Get children arrays to verify order matches indices
    const sourceChildren = browser.bookmarks.getChildren(sourceFolder.id);
    const destChildren = browser.bookmarks.getChildren(destinationFolder.id);

    // Verify source folder children are in correct order
    expect(sourceChildren).toHaveLength(3);
    expect(sourceChildren[0].id).toBe(bookmark1.id);
    expect(sourceChildren[0].index).toBe(0);
    expect(sourceChildren[1].id).toBe(bookmark3.id);
    expect(sourceChildren[1].index).toBe(1);
    expect(sourceChildren[2].id).toBe(bookmark4.id);
    expect(sourceChildren[2].index).toBe(2);

    // Verify destination folder has the moved bookmark
    expect(destChildren).toHaveLength(1);
    expect(destChildren[0].id).toBe(bookmark2.id);
    expect(destChildren[0].index).toBe(0);
  });

  test("should properly reindex when moving first bookmark from folder", async () => {
    // Create source and destination folders
    const sourceFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Source Folder Test",
    });

    const destinationFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Destination Folder Test",
    });

    // Create multiple bookmarks in source folder
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

    // Move the first bookmark to destination folder
    browser.bookmarks.move(firstBookmark.id, {
      parentId: destinationFolder.id,
    });

    // Get updated bookmarks
    const updatedSecond = (await browser.bookmarks.get(secondBookmark.id))[0];
    const updatedThird = (await browser.bookmarks.get(thirdBookmark.id))[0];

    // Verify remaining bookmarks moved up in index
    expect(updatedSecond.index).toBe(0); // Was index 1, now should be 0
    expect(updatedThird.index).toBe(1); // Was index 2, now should be 1

    // Verify the children array order matches the indices
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
    // Create a folder with multiple bookmarks
    const testFolder = await browser.bookmarks.create({
      parentId: "1",
      title: "Test Folder",
    });

    // Create bookmarks in order
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

    // Verify initial indices
    expect(bookmark1.index).toBe(0);
    expect(bookmark2.index).toBe(1);
    expect(bookmark3.index).toBe(2);
    expect(bookmark4.index).toBe(3);

    // Remove the second bookmark (middle one)
    browser.bookmarks.remove(bookmark2.id);

    // Get updated bookmarks
    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];
    const updatedBookmark4 = (await browser.bookmarks.get(bookmark4.id))[0];

    // Verify the bookmark was removed
    await expect(browser.bookmarks.get(bookmark2.id)).rejects.toThrow(
      "No bookmarks found",
    );

    // Verify remaining bookmarks were reindexed
    expect(updatedBookmark1.index).toBe(0); // Should remain 0
    expect(updatedBookmark3.index).toBe(1); // Should decrease from 2 to 1
    expect(updatedBookmark4.index).toBe(2); // Should decrease from 3 to 2

    // Verify the children array is properly ordered
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
    // Create a folder with bookmarks
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

    // Remove the first bookmark
    browser.bookmarks.remove(bookmark1.id);

    // Get updated bookmarks
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];
    const updatedBookmark3 = (await browser.bookmarks.get(bookmark3.id))[0];

    // Verify remaining bookmarks moved up in index
    expect(updatedBookmark2.index).toBe(0); // Was 1, now 0
    expect(updatedBookmark3.index).toBe(1); // Was 2, now 1

    // Verify array order
    const children = browser.bookmarks.getChildren(testFolder.id);
    expect(children).toHaveLength(2);
    expect(children[0].id).toBe(bookmark2.id);
    expect(children[0].index).toBe(0);
    expect(children[1].id).toBe(bookmark3.id);
    expect(children[1].index).toBe(1);
  });

  test("should remove last bookmark without affecting other indices", async () => {
    // Create a folder with bookmarks
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

    // Remove the last bookmark
    browser.bookmarks.remove(bookmark3.id);

    // Get updated bookmarks
    const updatedBookmark1 = (await browser.bookmarks.get(bookmark1.id))[0];
    const updatedBookmark2 = (await browser.bookmarks.get(bookmark2.id))[0];

    // Verify remaining bookmarks keep their indices
    expect(updatedBookmark1.index).toBe(0); // Should remain 0
    expect(updatedBookmark2.index).toBe(1); // Should remain 1

    // Verify array order
    const children = browser.bookmarks.getChildren(testFolder.id);
    expect(children).toHaveLength(2);
    expect(children[0].id).toBe(bookmark1.id);
    expect(children[0].index).toBe(0);
    expect(children[1].id).toBe(bookmark2.id);
    expect(children[1].index).toBe(1);
  });

  test("should remove folder with its children", async () => {
    // Create a folder with children
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

    // Remove the parent folder
    browser.bookmarks.remove(parentFolder.id);

    // Verify all items were removed
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

    // This should still reject because Chrome API rejects if ANY id is not found
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
