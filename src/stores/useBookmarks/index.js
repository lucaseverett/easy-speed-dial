import { makeAutoObservable, runInAction } from "mobx";
import browser from "webextension-polyfill";

import { settings } from "#stores/useSettings";
import { filter } from "#utils/filter";

export const bookmarks = makeAutoObservable({
  bookmarks: [],
  currentFolder: {},
  folders: [],
  parentId: "",
  async changeFolder(id) {
    const newBookmarks = await browser.bookmarks.getSubTree(id);
    sessionStorage.setItem("last-folder", id);
    runInAction(() => {
      bookmarks.bookmarks = filter(newBookmarks[0].children).sort(
        (a, b) => a.index - b.index,
      );
      bookmarks.currentFolder = { id, title: newBookmarks[0].title };
      // Set parentId for the current folder. If parentId is empty, breadcrumbs will not be shown.
      bookmarks.parentId =
        newBookmarks[0].parentId !== "root________" &&
        newBookmarks[0].parentId !== "0"
          ? newBookmarks[0].parentId
          : "";
    });
  },
  async createBookmark({ url, title, parentId }) {
    const newBookmark = await browser.bookmarks.create({
      url: url && !url.match(/^[a-zA-Z]+:/) ? `http://${url}` : url,
      title,
      parentId,
    });

    if (parentId === bookmarks.currentFolder.id) {
      runInAction(() => {
        bookmarks.bookmarks.push(filter([newBookmark])[0]);
      });
    }

    return newBookmark;
  },
  deleteBookmark(id) {
    browser.bookmarks.remove(id);
    const indexToRemove = bookmarks.bookmarks.findIndex(
      (bookmark) => bookmark.id === id,
    );
    if (indexToRemove !== -1) bookmarks.bookmarks.splice(indexToRemove, 1);
    settings.handleClearColor(id);
    settings.handleClearThumbnail(id);
  },
  deleteFolder(id) {
    browser.bookmarks.removeTree(id);
    const indexToRemove = bookmarks.bookmarks.findIndex(
      (bookmark) => bookmark.id === id,
    );
    if (indexToRemove !== -1) bookmarks.bookmarks.splice(indexToRemove, 1);
    settings.handleClearColor(id);
    settings.handleClearThumbnail(id);
  },
  async getBookmarksBarId() {
    let bookmarksBar = "1";

    if (__CHROME__) {
      // Find the bookmarks bar folder
      const rootTree = await browser.bookmarks.getSubTree("0");
      bookmarksBar =
        rootTree[0].children?.find(
          (child) => child.folderType === "bookmarks-bar",
        )?.id || "1";
    } else if (__FIREFOX__) {
      bookmarksBar = "toolbar_____";
    }

    return bookmarksBar;
  },
  async getBookmarkById(id) {
    const results = await browser.bookmarks.get(id);
    return results[0];
  },
  moveBookmark({ id, from, to, parentId }) {
    const moveOptions = {};

    if (from !== undefined && to !== undefined) {
      /*
      Some bookmarks may be filtered out.
      bookmarks.bookmarks[to]["index"] gives the correct index for filtered bookmarks.
      */
      moveOptions.index = bookmarks.bookmarks[to]["index"];

      /*
      Required for Chrome, not Firefox.
      See: https://stackoverflow.com/questions/13264060/chrome-bookmarks-api-using-move-to-reorder-bookmarks-in-the-same-folder
      */
      if (__CHROME__ && from < to) moveOptions.index++;
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

    browser.bookmarks.move(id.toString(), moveOptions);
  },
  async openAllWindow(id) {
    const urls = await browser.bookmarks.getSubTree(id);
    bookmarks.openLinkWindow(urls[0].children.map((b) => b.url));
  },
  async openAllTab(id) {
    const urls = await browser.bookmarks.getSubTree(id);
    urls[0].children.forEach(({ url }) => bookmarks.openLinkBackgroundTab(url));
  },
  openLinkBackgroundTab(url) {
    browser.tabs.create({ url, active: false });
  },
  openLinkTab(url) {
    browser.tabs.create({ url });
  },
  openLinkWindow(url) {
    browser.windows.create({ url });
  },
  updateBookmark(id, changes) {
    if (changes.url && !changes.url.match(/^[a-zA-Z]+:/)) {
      changes.url = `http://${changes.url}`;
    }
    const indexToUpdate = bookmarks.bookmarks.findIndex(
      (bookmark) => bookmark.id === id,
    );
    if (indexToUpdate !== -1) {
      bookmarks.bookmarks[indexToUpdate] = filter([
        {
          ...bookmarks.bookmarks[indexToUpdate],
          ...changes,
        },
      ])[0];
    }
    const updatedBookmark = browser.bookmarks.update(id, changes);
    return updatedBookmark;
  },
  async validateFolderExists(id) {
    if (!id) return false;
    try {
      await browser.bookmarks.get(id);
      return true;
    } catch {
      return false;
    }
  },
});

async function getFolders() {
  const folders = [];

  function addFolder(id, title) {
    folders.push({ id, title });
  }

  function makeIndent(indentLength) {
    return "\u00A0\u00A0".repeat(indentLength);
  }

  function logItems(bookmarkItem, indent) {
    if (!bookmarkItem.url) {
      const root = __FIREFOX__ ? "root________" : "0";

      if (bookmarkItem.id !== root) {
        addFolder(
          bookmarkItem.id,
          `${makeIndent(indent)}${bookmarkItem.title}${bookmarkItem.syncing ? " (synced)" : ""}`,
        );
        indent++;
      }

      if (bookmarkItem.children) {
        bookmarkItem.children.forEach((child) => logItems(child, indent));
      }
    }
  }

  function logTree(bookmarkItems) {
    logItems(bookmarkItems[0], 0);
    runInAction(() => {
      bookmarks.folders = folders;
    });
  }

  const getTree = await browser.bookmarks.getTree();
  logTree(getTree);
}

// ==========================
// FOLDERS LISTENER
// ==========================

getFolders();

browser.bookmarks.onChanged.addListener(getFolders);
browser.bookmarks.onCreated.addListener(getFolders);
browser.bookmarks.onMoved.addListener(getFolders);
browser.bookmarks.onRemoved.addListener(getFolders);
if (__CHROME__) {
  browser.bookmarks.onChildrenReordered.addListener(getFolders);
  browser.bookmarks.onImportBegan.addListener(getFolders);
  browser.bookmarks.onImportEnded.addListener(getFolders);
}

// ==========================
// BOOKMARKS LISTENER
// ==========================

function debounce(func, wait, immediate) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    if (immediate && !timeout) func(...args);
  };
}

function endListening() {
  browser.bookmarks.onCreated.removeListener(receiveBookmarks);
}

function resumeListening() {
  browser.bookmarks.onCreated.addListener(receiveBookmarks);
  receiveBookmarks();
}

function receiveBookmarks() {
  debounce(async () => {
    try {
      const newBookmarks = await browser.bookmarks.getSubTree(
        bookmarks.currentFolder.id,
      );
      if (newBookmarks) {
        const filteredAndSorted = filter(newBookmarks[0].children).sort(
          (a, b) => a.index - b.index,
        );
        runInAction(() => {
          reconcile(bookmarks.bookmarks, filteredAndSorted);
        });
      }
    } catch (error) {
      console.error("Error receiving bookmarks:", error);
    }
  }, 200)();
}

function reconcile(observableArray, newData, keyFn = (item) => item.id) {
  const existingMap = new Map(
    observableArray.map((item) => [keyFn(item), item]),
  );
  const newMap = new Map(newData.map((item) => [keyFn(item), item]));

  // Remove items not in new data
  for (let i = observableArray.length - 1; i >= 0; i--) {
    const key = keyFn(observableArray[i]);
    if (!newMap.has(key)) {
      observableArray.splice(i, 1);
    }
  }

  // Add or update items
  newData.forEach((newItem, index) => {
    const key = keyFn(newItem);
    const existing = existingMap.get(key);

    if (existing) {
      // Update existing item in place
      Object.assign(existing, newItem);
      // Move to correct position if needed
      const currentIndex = observableArray.indexOf(existing);
      if (currentIndex !== index) {
        observableArray.splice(currentIndex, 1);
        observableArray.splice(index, 0, existing);
      }
    } else {
      // Add new item
      observableArray.splice(index, 0, newItem);
    }
  });
}

browser.bookmarks.onChanged.addListener(receiveBookmarks);
browser.bookmarks.onCreated.addListener(receiveBookmarks);
browser.bookmarks.onMoved.addListener(receiveBookmarks);
browser.bookmarks.onRemoved.addListener(receiveBookmarks);
if (__CHROME__) {
  browser.bookmarks.onChildrenReordered.addListener(receiveBookmarks);
  browser.bookmarks.onImportBegan.addListener(endListening);
  browser.bookmarks.onImportEnded.addListener(resumeListening);
}
