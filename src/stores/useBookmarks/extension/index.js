import { makeAutoObservable } from "mobx";
import browser from "webextension-polyfill";

import { filter } from "#common/filter";
import { settings } from "#stores/useSettings";

export const bookmarks = makeAutoObservable({
  bookmarks: [],
  currentFolder: {},
  folders: [],
  parentId: "",
  async changeFolder(id) {
    // Needs error handling
    // If folder not found, display defaultFolder
    // If defaultFolder doesn't exist, display root folder
    // If issue with root folder, display error message
    const newBookmarks = await browser.bookmarks.getSubTree(id);
    sessionStorage.setItem("last-folder", id);
    bookmarks.bookmarks = filter(newBookmarks[0].children).sort(
      (a, b) => a.index - b.index,
    );
    bookmarks.currentFolder = { id, title: newBookmarks[0].title };
    bookmarks.parentId = newBookmarks[0].parentId;
  },
  createBookmark({ url, title, parentId }) {
    const newBookmark = browser.bookmarks.create({
      url: url && !url.match(/^[a-zA-Z]+:/) ? `http://${url}` : url,
      title,
      parentId,
    });
    return newBookmark;
  },
  deleteBookmark(id) {
    browser.bookmarks.remove(id);
    settings.handleClearColor(id);
    settings.handleClearThumbnail(id);
  },
  deleteFolder(id) {
    browser.bookmarks.removeTree(id);
    settings.handleClearColor(id);
    settings.handleClearThumbnail(id);
  },
  moveBookmark({ id, from, to }) {
    /*
      Some bookmarks are filtered from being displayed.
      bookmarksRef.current[to]["index"] accounts for the 
      index considering filtered bookmarks.
      */
    to = bookmarks.bookmarks[to]["index"];

    /* 
      This is needed for Chrome but not Firefox.
      https://stackoverflow.com/questions/13264060/chrome-bookmarks-api-using-move-to-reorder-bookmarks-in-the-same-folder
      */
    if (__CHROME__ && from < to) to++;

    browser.bookmarks.move(id.toString(), { index: to });
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
    const updatedBookmark = browser.bookmarks.update(id, changes);
    return updatedBookmark;
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
      let root;
      if (__CHROME__) {
        root = "0";
      } else if (__FIREFOX__) {
        root = "root________";
      }
      if (bookmarkItem.id !== root) {
        addFolder(
          bookmarkItem.id,
          `${makeIndent(indent)}${bookmarkItem.title}`,
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
    bookmarks.folders = folders;
  }

  const getTree = await browser.bookmarks.getTree();
  logTree(getTree);
}

getFolders();

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
        bookmarks.bookmarks = filter(newBookmarks[0].children).sort(
          (a, b) => a.index - b.index,
        );
      }
    } catch (error) {
      console.error("Error receiving bookmarks:", error);
    }
  }, 200)();
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
