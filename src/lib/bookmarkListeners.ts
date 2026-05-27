import type { Bookmarks } from "webextension-polyfill";
import type { FilteredBookmark } from "./filter";

import { runInAction } from "mobx";

import browser from "#platform/browser";
import { getBookmarkSubTree, getBookmarkTree } from "./bookmarkApi";
import { filter } from "./filter";
import { reconcile } from "./reconcile";

interface BookmarkStoreShape {
  bookmarks: FilteredBookmark[];
  currentFolder: { id: string; title: string };
  folders: Array<{ id: string; title: string }>;
}

function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate?: boolean,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    if (immediate && !timeout) func(...args);
  };
}

export function registerBookmarkListeners(bookmarks: BookmarkStoreShape) {
  async function getFolders() {
    const folders: Array<{ id: string; title: string }> = [];

    function addFolder(id: string, title: string) {
      folders.push({ id, title });
    }

    function makeIndent(indentLength: number) {
      return "\u00A0\u00A0".repeat(indentLength);
    }

    function logItems(
      bookmarkItem: Bookmarks.BookmarkTreeNode,
      indent: number,
    ) {
      if (!bookmarkItem.url) {
        const root = __FIREFOX__ ? "root________" : "0";

        if (bookmarkItem.id !== root) {
          addFolder(
            bookmarkItem.id,
            `${makeIndent(indent)}${bookmarkItem.title}${(bookmarkItem as Bookmarks.BookmarkTreeNode & { syncing?: boolean }).syncing ? " (synced)" : ""}`,
          );
          indent++;
        }

        if (bookmarkItem.children) {
          bookmarkItem.children.forEach((child: Bookmarks.BookmarkTreeNode) =>
            logItems(child, indent),
          );
        }
      }
    }

    function logTree(bookmarkItems: Bookmarks.BookmarkTreeNode[]) {
      logItems(bookmarkItems[0], 0);
      runInAction(() => {
        bookmarks.folders = folders;
      });
    }

    const tree = await getBookmarkTree();
    logTree(tree);
  }

  function endListening() {
    browser.bookmarks.onCreated.removeListener(receiveBookmarks);
  }

  function resumeListening() {
    browser.bookmarks.onCreated.addListener(receiveBookmarks);
    receiveBookmarks();
  }

  const debouncedReceiveBookmarks = debounce(async () => {
    try {
      const newBookmarks = await getBookmarkSubTree(bookmarks.currentFolder.id);
      if (newBookmarks) {
        const filteredAndSorted = filter(newBookmarks[0].children || []).sort(
          (a, b) => a.index! - b.index!,
        );
        runInAction(() => {
          reconcile(bookmarks.bookmarks, filteredAndSorted);
        });
      }
    } catch (error) {
      console.error("Error receiving bookmarks:", error);
    }
  }, 200);

  function receiveBookmarks() {
    debouncedReceiveBookmarks();
  }

  getFolders();

  browser.bookmarks.onChanged.addListener(getFolders);
  browser.bookmarks.onCreated.addListener(getFolders);
  browser.bookmarks.onMoved.addListener(getFolders);
  browser.bookmarks.onRemoved.addListener(getFolders);
  browser.bookmarks.onChanged.addListener(receiveBookmarks);
  browser.bookmarks.onCreated.addListener(receiveBookmarks);
  browser.bookmarks.onMoved.addListener(receiveBookmarks);
  browser.bookmarks.onRemoved.addListener(receiveBookmarks);

  if (__CHROME__) {
    const chromeBookmarks = browser.bookmarks as typeof chrome.bookmarks;
    chromeBookmarks.onChildrenReordered?.addListener(getFolders);
    chromeBookmarks.onImportBegan?.addListener(getFolders);
    chromeBookmarks.onImportEnded?.addListener(getFolders);
    chromeBookmarks.onChildrenReordered?.addListener(receiveBookmarks);
    chromeBookmarks.onImportBegan?.addListener(endListening);
    chromeBookmarks.onImportEnded?.addListener(resumeListening);
  }
}
