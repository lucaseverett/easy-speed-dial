import { makeAutoObservable } from "mobx";

import { filter } from "#common/filter";
import { settings } from "#stores/useSettings";
import { browser } from "./browser.bookmarks";

import "./mockBookmarks";

export const bookmarks = makeAutoObservable({
  bookmarks: [],
  currentFolder: {},
  folders: [],
  parentId: "",
  changeFolder(id) {
    // Needs error handling
    // If folder not found, display defaultFolder
    // If defaultFolder doesn't exist, display root folder
    // If issue with root folder, display error message
    const newBookmarks = browser.bookmarks.getSubTree(id);
    sessionStorage.setItem("last-folder", id);
    bookmarks.bookmarks = filter(newBookmarks.children);
    bookmarks.currentFolder = { id, title: newBookmarks.title };
    bookmarks.parentId = newBookmarks.parentId;
  },
  createBookmark({ url, title, parentId }) {
    const newBookmark = browser.bookmarks.create({
      url: url && !url.match(/^[a-zA-Z]+:/) ? `http://${url}` : url,
      title,
      parentId,
    });
    bookmarks.bookmarks.push(filter([newBookmark])[0]);
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
  moveBookmark({ id, from, to }) {
    const bookmark = bookmarks.bookmarks.find((b) => b.id === id);
    if (!bookmark) {
      console.warn(`Bookmark with id ${id} not found.`);
      return;
    }

    // Move the bookmark in mock bookmarks.
    browser.bookmarks.move(id, {
      index: browser.bookmarks.getSubTree(bookmarks.currentFolder.id).children[
        to
      ]["index"],
    });

    // Remove the bookmark from its current position.
    bookmarks.bookmarks.splice(from, 1);

    // Insert the bookmark into its new position.
    bookmarks.bookmarks.splice(to, 0, bookmark);
  },
  openAllTab(id) {
    browser.bookmarks
      .getSubTree(id)
      .children.filter((b) => b.url)
      .forEach(({ url }) => bookmarks.openLinkTab(url));
  },
  openLinkTab(url) {
    window.open(url, "_blank", "noreferrer");
  },
  updateBookmark(id, changes) {
    if (changes.url && !changes.url.match(/^[a-zA-Z]+:/)) {
      changes.url = `http://${changes.url}`;
    }
    const updatedBookmark = filter([browser.bookmarks.update(id, changes)])[0];
    const { index } = updatedBookmark;
    const updatedBookmarks = [...bookmarks.bookmarks];
    updatedBookmarks[index] = updatedBookmark;
    bookmarks.bookmarks = updatedBookmarks;
    return updatedBookmark;
  },
});

function getFolders() {
  const folders = [];

  function addFolder(id, title) {
    folders.push({ id, title });
  }

  function makeIndent(indentLength) {
    return "\u00A0\u00A0".repeat(indentLength);
  }

  function logItems(bookmarkItem, indent) {
    if (!bookmarkItem.url) {
      addFolder(bookmarkItem.id, `${makeIndent(indent)}${bookmarkItem.title}`);
      indent++;

      if (bookmarkItem.children) {
        bookmarkItem.children.forEach((child) => logItems(child, indent));
      }
    }
  }

  function logTree(bookmarkItems) {
    logItems(bookmarkItems[0], 0);
    bookmarks.folders = folders;
  }

  return logTree(browser.bookmarks.getTree());
}

getFolders();
