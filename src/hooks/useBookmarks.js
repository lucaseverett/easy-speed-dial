import React, { useState, useEffect, useRef } from "react";
import { filter } from "./filter.js";
import { useOptions } from "./useOptions.js";

const rootTitle = "Bookmarks";

function useBookmarks() {
  const { defaultFolder } = useOptions();

  const [bookmarks, setBookmarks] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({});
  const [path, setPath] = useState([]);
  const [folders, setFolders] = useState([]);

  const currentFolderRef = useRef();

  useEffect(() => {
    getFolders();
    browser.bookmarks.onChanged.addListener(updateBookmarks);
    browser.bookmarks.onCreated.addListener(updateBookmarks);
    browser.bookmarks.onMoved.addListener(updateBookmarks);
    browser.bookmarks.onRemoved.addListener(updateBookmarks);
    return () => {
      browser.bookmarks.onChanged.removeListener(updateBookmarks);
      browser.bookmarks.onCreated.removeListener(updateBookmarks);
      browser.bookmarks.onMoved.removeListener(updateBookmarks);
      browser.bookmarks.onRemoved.removeListener(updateBookmarks);
    };
  }, []);

  // Default folder has been changed in Options
  useEffect(() => {
    initialBookmarks();
  }, [defaultFolder]);

  useEffect(() => {
    currentFolderRef.current = currentFolder;
  }, [currentFolder]);

  function initialBookmarks() {
    if (defaultFolder) {
      setCurrentFolder({
        id: defaultFolder,
        title: rootTitle,
      });
      setPath([]);
      getBookmarks(defaultFolder).then((bookmarks) => {
        if (bookmarks) {
          setBookmarks(bookmarks);
        }
      });
    }
  }

  function updateBookmarks() {
    getBookmarks(currentFolderRef.current.id).then((bookmarks) => {
      if (bookmarks) {
        setBookmarks(bookmarks);
      }
    });
  }

  async function getBookmarks(folder) {
    let bookmarks = [];
    let sort = (a, b) => a.index - b.index;
    try {
      bookmarks = await browser.bookmarks.getChildren(folder);
    } catch (e) {
      console.log(e);
    }
    return filter(bookmarks).sort(sort);
  }

  function changeFolder({ currentFolder = "", nextFolder }) {
    getBookmarks(nextFolder.id).then((bookmarks) => {
      setBookmarks(bookmarks);
      if (currentFolder) {
        setPath([...path, currentFolder]);
      } else {
        setPath(path.slice(0, path.map(({ id }) => id).indexOf(nextFolder.id)));
      }
      setCurrentFolder(nextFolder);
    });
  }

  function getFolders() {
    let folders = [];

    function addFolder(id, title) {
      folders.push({ id, title });
    }

    function makeIndent(indentLength) {
      return "\u00A0\u00A0".repeat(indentLength);
    }

    function logItems(bookmarkItem, indent) {
      if (bookmarkItem.type === "folder") {
        if (bookmarkItem.id !== "root________") {
          addFolder(
            bookmarkItem.id,
            `${makeIndent(indent)}${bookmarkItem.title}`
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
      setFolders(folders);
    }

    function onRejected(error) {
      console.log(`An error: ${error}`);
    }

    var gettingTree = browser.bookmarks.getTree();
    gettingTree.then(logTree, onRejected);
  }

  function moveBookmark({ bookmarkID, newIndex }) {
    browser.bookmarks.move(bookmarkID, { index: newIndex });
  }

  return {
    bookmarks,
    currentFolder,
    changeFolder,
    path,
    folders,
    moveBookmark,
  };
}

export { useBookmarks };
