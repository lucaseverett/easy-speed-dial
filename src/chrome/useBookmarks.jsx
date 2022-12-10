import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { filter } from "../common/filter.js";
import { useOptions } from "./useOptions.jsx";
import browser from "webextension-polyfill";

const BookmarksContext = createContext();

export function ProvideBookmarks({ children }) {
  const { defaultFolder } = useOptions();

  const [bookmarks, setBookmarks] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({});
  const [folders, setFolders] = useState([]);
  const [isRoot, setIsRoot] = useState(true);
  const [parentID, setParentID] = useState();

  const currentFolderRef = useRef();

  useEffect(() => {
    getFolders();
    browser.bookmarks.onChanged.addListener(updateBookmarks);
    browser.bookmarks.onCreated.addListener(updateBookmarks);
    browser.bookmarks.onMoved.addListener(updateBookmarks);
    browser.bookmarks.onRemoved.addListener(updateBookmarks);
    browser.bookmarks.onChildrenReordered.addListener(updateBookmarks);
    browser.bookmarks.onImportBegan.addListener(endListening);
    browser.bookmarks.onImportEnded.addListener(resumeListening);
    return () => {
      browser.bookmarks.onChanged.removeListener(updateBookmarks);
      browser.bookmarks.onCreated.removeListener(updateBookmarks);
      browser.bookmarks.onMoved.removeListener(updateBookmarks);
      browser.bookmarks.onRemoved.removeListener(updateBookmarks);
      browser.bookmarks.onChildrenReordered.removeListener(updateBookmarks);
      browser.bookmarks.onImportBegan.removeListener(endListening);
      browser.bookmarks.onImportEnded.removeListener(resumeListening);
    };
  }, []);

  function endListening() {
    browser.bookmarks.onCreated.removeListener(updateBookmarks);
  }

  function resumeListening() {
    browser.bookmarks.onCreated.addListener(updateBookmarks);
    updateBookmarks();
  }

  useEffect(() => {
    window.addEventListener("popstate", popState);
    const session = sessionStorage.getItem("last-folder");
    if (session) {
      // restore from last session or history.state
      // session is restored in current tab after clicking home button
      changeFolder({
        id: history.state ? history.state.id : JSON.parse(session).id,
        pushState: false,
        replaceState: history.state ? false : true,
        saveSession: history.state ? true : false,
      });
    }
    return () => {
      window.removeEventListener("popstate", popState);
    };
  }, []);

  useEffect(() => {
    const session = sessionStorage.getItem("last-folder");
    if (defaultFolder !== undefined && !session) {
      // on first run
      changeFolder({
        id: defaultFolder,
        pushState: false,
        replaceState: true,
        saveSession: true,
      });
    }
  }, [defaultFolder]);

  useLayoutEffect(() => {
    currentFolderRef.current = currentFolder;
    if (defaultFolder !== undefined) {
      if (currentFolder.id === defaultFolder || !parentID) {
        setIsRoot(true);
      } else {
        setIsRoot(false);
      }
    }
  }, [currentFolder, defaultFolder]);

  function popState(e) {
    // on forward/back buttons
    changeFolder({
      id: e.state.id,
      pushState: false,
      replaceState: false,
      saveSession: true,
    });
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  const updateBookmarks = useCallback(
    debounce(
      () =>
        getBookmarks(currentFolderRef.current.id).then(({ bookmarks }) => {
          if (bookmarks) {
            setBookmarks(bookmarks);
          }
        }),
      200
    ),
    [currentFolderRef]
  );

  async function getBookmarks(folder) {
    let bookmarks = [];
    let sort = (a, b) => a.index - b.index;
    try {
      bookmarks = await browser.bookmarks.getSubTree(folder);
    } catch (e) {
      console.log(e);
    }
    return {
      id: bookmarks[0].id,
      bookmarks: filter(bookmarks[0].children).sort(sort),
      title: bookmarks[0].title,
      parentID: bookmarks[0].parentId,
    };
  }

  function changeFolder({ id, pushState, replaceState, saveSession }) {
    // Needs error handling
    // If folder not found, display defaultFolder
    // If defaultFolder doesn't exist, display root folder
    // If issue with root folder, display error message
    getBookmarks(id).then(({ bookmarks, title, parentID }) => {
      setBookmarks(bookmarks);
      setCurrentFolder({ id, title });
      setParentID(parentID);
      if (saveSession)
        sessionStorage.setItem("last-folder", JSON.stringify({ id }));
      if (pushState) history.pushState({ id }, document.title);
      if (replaceState) history.replaceState({ id }, document.title);
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
      if (!bookmarkItem.url) {
        if (bookmarkItem.id !== "0") {
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

  function moveBookmark({ id, from, to }) {
    // This is a workaround for a Chromium bug
    // https://stackoverflow.com/questions/13264060/chrome-bookmarks-api-using-move-to-reorder-bookmarks-in-the-same-folder
    if (from < to) to++;

    browser.bookmarks.move(id.toString(), { index: to });
  }

  function deleteBookmark(id) {
    browser.bookmarks.remove(id);
  }

  function deleteFolder(id) {
    browser.bookmarks.removeTree(id);
  }

  function openLinkTab(url) {
    browser.tabs.create({ url });
  }

  function openLinkBackgroundTab(url) {
    browser.tabs.create({ url, active: false });
  }

  function openAllTab(linkID) {
    getBookmarks(linkID).then(({ bookmarks }) => {
      let links = bookmarks.filter((b) => b.url);
      links.forEach(({ url }) => openLinkTab(url));
    });
  }

  function openAllWindow(linkID) {
    getBookmarks(linkID).then(({ bookmarks }) => {
      let links = bookmarks.filter((b) => b.url).map(({ url }) => url);
      openLinkWindow(links);
    });
  }

  function openLinkWindow(url) {
    browser.windows.create({ url });
  }

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        currentFolder,
        changeFolder,
        moveBookmark,
        deleteBookmark,
        deleteFolder,
        folders,
        openAllWindow,
        openAllTab,
        openLinkTab,
        openLinkBackgroundTab,
        openLinkWindow,
        isRoot,
        parentID,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export const useBookmarks = () => {
  return useContext(BookmarksContext);
};
