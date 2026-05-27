import type { BookmarkChanges, CreateBookmarkParams } from "#types/bookmarks";

import browser from "#platform/browser";

export function ensureUrlProtocol(url: string | undefined) {
  return url && !url.match(/^[a-zA-Z]+:/) ? `http://${url}` : url;
}

export function createBookmark({ url, title, parentId }: CreateBookmarkParams) {
  return browser.bookmarks.create({
    url: ensureUrlProtocol(url),
    title,
    parentId,
  });
}

export function deleteBookmarkById(id: string) {
  return browser.bookmarks.remove(id);
}

export function deleteFolderById(id: string) {
  return browser.bookmarks.removeTree(id);
}

export async function getBookmarkById(id: string) {
  const results = await browser.bookmarks.get(id);
  return results[0];
}

export function getBookmarkSubTree(id: string) {
  return browser.bookmarks.getSubTree(id);
}

export function getBookmarkTree() {
  return browser.bookmarks.getTree();
}

export async function getBookmarksBarId() {
  let bookmarksBar = "1";

  if (__CHROME__) {
    const rootTree = await browser.bookmarks.getSubTree("0");
    bookmarksBar =
      rootTree[0].children?.find(
        (child) => child.folderType === "bookmarks-bar",
      )?.id || "1";
  } else if (__FIREFOX__) {
    bookmarksBar = "toolbar_____";
  }

  return bookmarksBar;
}

export function moveBookmarkById(
  id: string,
  moveOptions: { index?: number; parentId?: string },
) {
  return browser.bookmarks.move(id, moveOptions);
}

export function updateBookmarkById(id: string, changes: BookmarkChanges) {
  return browser.bookmarks.update(id, {
    ...changes,
    url: ensureUrlProtocol(changes.url),
  });
}

export function validateFolderExists(id: string) {
  if (!id) return Promise.resolve(false);

  return browser.bookmarks
    .get(id)
    .then(() => true)
    .catch(() => false);
}
