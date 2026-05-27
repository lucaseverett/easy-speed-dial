import type { FilteredBookmark } from "#lib/filter";
import type {
  BookmarkFolder,
  CreateBookmarkParams,
  MoveBookmarkParams,
} from "#types/bookmarks";
import type { Bookmarks } from "webextension-polyfill";

import { makeAutoObservable, runInAction } from "mobx";

import {
  createBookmark,
  deleteBookmarkById,
  deleteFolderById,
  getBookmarkById,
  getBookmarksBarId,
  getBookmarkSubTree,
  moveBookmarkById,
  updateBookmarkById,
  validateFolderExists,
} from "#lib/bookmarkApi";
import { registerBookmarkListeners } from "#lib/bookmarkListeners";
import { filter } from "#lib/filter";
import { openBackgroundTab, openTab, openWindow } from "#lib/tabs";
import { settings } from "#stores/settings";

export const bookmarks = makeAutoObservable({
  bookmarks: [] as FilteredBookmark[],
  currentFolder: {} as BookmarkFolder,
  folders: [] as Array<{ id: string; title: string }>,
  parentId: "",
  async changeFolder(id: string) {
    const newBookmarks = await getBookmarkSubTree(id);
    sessionStorage.setItem("last-folder", id);
    runInAction(() => {
      bookmarks.bookmarks = filter(newBookmarks[0].children || []).sort(
        (a, b) => a.index! - b.index!,
      );
      bookmarks.currentFolder = { id, title: newBookmarks[0].title };
      // Set parentId for the current folder. If parentId is empty, breadcrumbs will not be shown.
      bookmarks.parentId =
        newBookmarks[0].parentId !== "root________" &&
        newBookmarks[0].parentId !== "0"
          ? newBookmarks[0].parentId || ""
          : "";
    });
  },
  async createBookmark({ url, title, parentId }: CreateBookmarkParams) {
    const newBookmark = await createBookmark({ url, title, parentId });

    if (parentId === bookmarks.currentFolder.id) {
      runInAction(() => {
        bookmarks.bookmarks.push(filter([newBookmark])[0]);
      });
    }

    return newBookmark;
  },
  deleteBookmark(id: string) {
    deleteBookmarkById(id);
    const indexToRemove = bookmarks.bookmarks.findIndex(
      (bookmark) => bookmark.id === id,
    );
    if (indexToRemove !== -1) bookmarks.bookmarks.splice(indexToRemove, 1);
    settings.handleClearColor(id);
    settings.handleClearThumbnail(id);
  },
  deleteFolder(id: string) {
    deleteFolderById(id);
    const indexToRemove = bookmarks.bookmarks.findIndex(
      (bookmark) => bookmark.id === id,
    );
    if (indexToRemove !== -1) bookmarks.bookmarks.splice(indexToRemove, 1);
    settings.handleClearColor(id);
    settings.handleClearThumbnail(id);
  },
  async getBookmarksBarId() {
    return getBookmarksBarId();
  },
  async getBookmarkById(id: string) {
    return getBookmarkById(id);
  },
  moveBookmark({ id, from, to, parentId }: MoveBookmarkParams) {
    const moveOptions: { index?: number; parentId?: string } = {};

    if (from !== undefined && to !== undefined) {
      /*
      Some bookmarks may be filtered out.
      bookmarks.bookmarks[to]["index"] gives the correct index for filtered bookmarks.
      */
      moveOptions.index = bookmarks.bookmarks[to]?.index;

      /*
      Required for Chrome, not Firefox.
      See: https://stackoverflow.com/questions/13264060/chrome-bookmarks-api-using-move-to-reorder-bookmarks-in-the-same-folder
      */
      if (__CHROME__ && from < to && moveOptions.index !== undefined) {
        moveOptions.index++;
      }
    }

    if (parentId) {
      moveOptions.parentId = parentId;
    }

    // Remove the bookmark from the current folder if moving to a different folder.
    if (parentId && parentId !== bookmarks.currentFolder.id) {
      const indexToRemove = bookmarks.bookmarks.findIndex(
        (bookmark) => bookmark.id === id,
      );
      if (indexToRemove !== -1) {
        bookmarks.bookmarks.splice(indexToRemove, 1);
      }
    } else if (from !== undefined && to !== undefined && from !== to) {
      // Reorder the bookmark within the same folder for immediate UI feedback.
      const bookmark = bookmarks.bookmarks.splice(from, 1)[0];
      bookmarks.bookmarks.splice(to, 0, bookmark);
    }

    moveBookmarkById(id, moveOptions);
  },
  async openAllWindow(id: string) {
    const urls = await getBookmarkSubTree(id);
    const childUrls =
      urls[0].children?.filter((b) => b.url).map((b) => b.url!) || [];
    bookmarks.openLinkWindow(childUrls);
  },
  async openAllTab(id: string) {
    const urls = await getBookmarkSubTree(id);
    urls[0].children?.forEach(({ url }) => {
      if (url) bookmarks.openLinkBackgroundTab(url);
    });
  },
  openLinkBackgroundTab(url: string) {
    openBackgroundTab(url);
  },
  openLinkTab(url: string) {
    openTab(url);
  },
  openLinkWindow(url: string | string[]) {
    openWindow(url);
  },
  updateBookmark(id: string, changes: Partial<Bookmarks.CreateDetails>) {
    const indexToUpdate = bookmarks.bookmarks.findIndex(
      (bookmark) => bookmark.id === id,
    );
    if (indexToUpdate !== -1) {
      const updatedBookmark = {
        ...bookmarks.bookmarks[indexToUpdate],
        ...changes,
      };
      bookmarks.bookmarks[indexToUpdate] = filter([
        updatedBookmark as Bookmarks.BookmarkTreeNode,
      ])[0];
    }
    return updateBookmarkById(id, changes);
  },
  async validateFolderExists(id: string) {
    return validateFolderExists(id);
  },
});

registerBookmarkListeners(bookmarks);
