import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { filter } from "../common/filter.js";
import { useOptions } from "./useOptions.jsx";
import browser from "webextension-polyfill";

const BookmarksContext = createContext();

export const ProvideBookmarks = memo(function ProvideBookmarks({ children }) {
  const { defaultFolder } = useOptions();

  const [bookmarks, setBookmarks] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({});
  const [folders, setFolders] = useState([]);
  const [isRoot, setIsRoot] = useState(true);
  const [parentId, setparentId] = useState();

  const currentFolderRef = useRef();
  const bookmarksRef = useRef();

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
      parentId: bookmarks[0].parentId,
    };
  }

  const changeFolder = useCallback(
    ({ id, pushState, replaceState, saveSession }) => {
      // Needs error handling
      // If folder not found, display defaultFolder
      // If defaultFolder doesn't exist, display root folder
      // If issue with root folder, display error message
      getBookmarks(id).then(({ bookmarks, title, parentId }) => {
        setBookmarks(bookmarks);
        setCurrentFolder({ id, title });
        setparentId(parentId);
        if (saveSession)
          sessionStorage.setItem("last-folder", JSON.stringify({ id }));
        if (pushState) history.pushState({ id }, document.title);
        if (replaceState) history.replaceState({ id }, document.title);
      });
    },
    [],
  );

  function popState(e) {
    // on forward/back buttons
    changeFolder({
      id: e.state.id,
      pushState: false,
      replaceState: false,
      saveSession: true,
    });
  }

  const debounce = useCallback((func, wait, immediate) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate) func(...args);
      }, wait);
      if (immediate && !timeout) func(...args);
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateBookmarks = useCallback(
    debounce(async () => {
      const { bookmarks } = await getBookmarks(currentFolderRef.current.id);
      if (bookmarks) {
        setBookmarks(bookmarks);
      }
    }, 200),
    [],
  );

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
        const root = __PROJECT__ === "chrome" ? "0" : "root________";
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
      setFolders(folders);
    }

    function onRejected(error) {
      console.log(`An error: ${error}`);
    }

    const gettingTree = browser.bookmarks.getTree();
    gettingTree.then(logTree, onRejected);
  }

  const createBookmark = useCallback(async (bookmark) => {
    if (bookmark.url && !bookmark.url.match(/^[a-zA-Z]+:/)) {
      bookmark.url = `http://${bookmark.url}`;
    }
    const newBookmark = await browser.bookmarks.create(bookmark);
    return newBookmark;
  }, []);

  const updateBookmark = useCallback((id, changes) => {
    if (changes.url && !changes.url.match(/^[a-zA-Z]+:/)) {
      changes.url = `http://${changes.url}`;
    }
    browser.bookmarks.update(id, changes);
  }, []);

  const moveBookmark = useCallback(({ id, from, to }) => {
    /*
    Some bookmarks are filtered from being displayed.
    bookmarksRef.current[to]["index"] accounts for the 
    index considering filtered bookmarks.
    */
    to = bookmarksRef.current[to]["index"];

    /* 
    This is needed for Chrome but not Firefox.
    https://stackoverflow.com/questions/13264060/chrome-bookmarks-api-using-move-to-reorder-bookmarks-in-the-same-folder
    */
    if (__PROJECT__ === "chrome" && from < to) to++;

    browser.bookmarks.move(id.toString(), { index: to });
  }, []);

  const deleteBookmark = useCallback((id) => {
    browser.bookmarks.remove(id);
  }, []);

  const deleteFolder = useCallback((id) => {
    browser.bookmarks.removeTree(id);
  }, []);

  const openLinkTab = useCallback((url) => {
    browser.tabs.create({ url });
  }, []);

  const openLinkBackgroundTab = useCallback((url) => {
    browser.tabs.create({ url, active: false });
  }, []);

  const openLinkWindow = useCallback((url) => {
    browser.windows.create({ url });
  }, []);

  const openAllTab = useCallback(
    (linkID) => {
      getBookmarks(linkID).then(({ bookmarks }) => {
        let links = bookmarks.filter((b) => b.url);
        links.forEach(({ url }) => openLinkTab(url));
      });
    },
    [openLinkTab],
  );

  const openAllBackgroundTab = useCallback(
    (linkID) => {
      getBookmarks(linkID).then(({ bookmarks }) => {
        let links = bookmarks.filter((b) => b.url);
        links.forEach(({ url }) => openLinkBackgroundTab(url));
      });
    },
    [openLinkBackgroundTab],
  );

  const openAllWindow = useCallback(
    (linkID) => {
      getBookmarks(linkID).then(({ bookmarks }) => {
        let links = bookmarks.filter((b) => b.url).map(({ url }) => url);
        openLinkWindow(links);
      });
    },
    [openLinkWindow],
  );

  useEffect(() => {
    window.addEventListener("popstate", popState);
    const session = sessionStorage.getItem("last-folder");
    if (session) {
      // Restore from last session or history.state
      // Session is restored in current tab after clicking home button
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const session = sessionStorage.getItem("last-folder");
    // Runs on initial load
    if (defaultFolder !== undefined && !session) {
      changeFolder({
        id: defaultFolder,
        pushState: false,
        replaceState: true,
        saveSession: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFolder]);

  useLayoutEffect(() => {
    currentFolderRef.current = currentFolder;
    if (defaultFolder !== undefined) {
      if (currentFolder.id === defaultFolder || !parentId) {
        setIsRoot(true);
      } else {
        setIsRoot(false);
      }
    }
  }, [currentFolder, defaultFolder, parentId]);

  function endListening() {
    browser.bookmarks.onCreated.removeListener(updateBookmarks);
  }

  function resumeListening() {
    browser.bookmarks.onCreated.addListener(updateBookmarks);
    updateBookmarks();
  }

  useEffect(() => {
    getFolders();
    browser.bookmarks.onChanged.addListener(updateBookmarks);
    browser.bookmarks.onCreated.addListener(updateBookmarks);
    browser.bookmarks.onMoved.addListener(updateBookmarks);
    browser.bookmarks.onRemoved.addListener(updateBookmarks);
    if (__PROJECT__ === "chrome") {
      browser.bookmarks.onChildrenReordered.addListener(updateBookmarks);
      browser.bookmarks.onImportBegan.addListener(endListening);
      browser.bookmarks.onImportEnded.addListener(resumeListening);
    }
    return () => {
      browser.bookmarks.onChanged.removeListener(updateBookmarks);
      browser.bookmarks.onCreated.removeListener(updateBookmarks);
      browser.bookmarks.onMoved.removeListener(updateBookmarks);
      browser.bookmarks.onRemoved.removeListener(updateBookmarks);
      if (__PROJECT__ === "chrome") {
        browser.bookmarks.onChildrenReordered.removeListener(updateBookmarks);
        browser.bookmarks.onImportBegan.removeListener(endListening);
        browser.bookmarks.onImportEnded.removeListener(resumeListening);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bookmarksRef.current = bookmarks;
  }, [bookmarks]);

  const contextValue = useMemo(
    () => ({
      bookmarks,
      changeFolder,
      createBookmark,
      currentFolder,
      deleteBookmark,
      deleteFolder,
      folders,
      isRoot,
      moveBookmark,
      openAllBackgroundTab,
      openAllTab,
      openAllWindow,
      openLinkBackgroundTab,
      openLinkTab,
      openLinkWindow,
      parentId,
      updateBookmark,
    }),
    [
      bookmarks,
      changeFolder,
      createBookmark,
      currentFolder,
      deleteBookmark,
      deleteFolder,
      folders,
      isRoot,
      moveBookmark,
      openAllBackgroundTab,
      openAllTab,
      openAllWindow,
      openLinkBackgroundTab,
      openLinkTab,
      openLinkWindow,
      parentId,
      updateBookmark,
    ],
  );

  return (
    <BookmarksContext.Provider value={contextValue}>
      {children}
    </BookmarksContext.Provider>
  );
});

export const useBookmarks = () => {
  return useContext(BookmarksContext);
};
