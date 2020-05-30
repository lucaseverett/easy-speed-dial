import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { filter } from "../../common/filter.js";
import { useOptions } from "./useOptions.js";
import { usePrevious } from "../../common/usePrevious.js";

const BookmarksContext = createContext();

export function ProvideBookmarks({ children }) {
  const { defaultFolder } = useOptions();

  const [bookmarks, setBookmarks] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({});
  const [folders, setFolders] = useState([]);

  const currentFolderRef = useRef();

  const previousDefaultFolder = usePrevious(defaultFolder);

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

  useEffect(() => {
    window.addEventListener("popstate", popState);
    if (history.state) {
      const { id, title } = history.state;
      setCurrentFolder({
        id,
        title,
      });
      getBookmarks(id).then((bookmarks) => {
        if (bookmarks) {
          setBookmarks(bookmarks);
        }
      });
    }
    return () => {
      window.removeEventListener("popstate", popState);
    };
  }, []);

  useEffect(() => {
    if (defaultFolder !== undefined && history.state === null) {
      // first run
      history.replaceState({ id: defaultFolder }, document.title);
      setCurrentFolder({ id: defaultFolder });
      getBookmarks(defaultFolder).then((bookmarks) => {
        if (bookmarks) {
          setBookmarks(bookmarks);
        }
      });
    } else if (
      defaultFolder !== undefined &&
      previousDefaultFolder !== undefined &&
      previousDefaultFolder !== defaultFolder &&
      history.state !== null
    ) {
      // default folder option changed
      const id = defaultFolder;
      history.replaceState({ id }, document.title);
      getBookmarks(id).then((bookmarks) => {
        if (bookmarks) {
          setBookmarks(bookmarks);
        }
      });
      setCurrentFolder({ id });
    }
  }, [defaultFolder]);

  useEffect(() => {
    currentFolderRef.current = currentFolder;
  }, [currentFolder]);

  function popState(e) {
    const { id, title } = e.state;
    getBookmarks(id).then(
      (bookmarks) => setBookmarks(bookmarks || []),
      setBookmarks([])
    );
    setCurrentFolder({ id, title });
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
        getBookmarks(currentFolderRef.current.id).then((bookmarks) => {
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
      bookmarks = await browser.bookmarks.getChildren(folder);
    } catch (e) {
      console.log(e);
    }
    return filter(bookmarks).sort(sort);
  }

  function changeFolder(nextFolder) {
    const { id, title } = nextFolder;
    history.pushState({ id, title }, document.title);
    getBookmarks(id).then((bookmarks) => {
      setBookmarks(bookmarks);
      setCurrentFolder({ id, title });
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

  function moveBookmark({ id, from, to }) {
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

  function openAllTab(linkID) {
    getBookmarks(linkID).then((bookmarks) => {
      let links = bookmarks.filter((b) => b.url);
      links.forEach(({ url }) => openLinkTab(url));
    });
  }

  function openAllWindow(linkID) {
    getBookmarks(linkID).then((bookmarks) => {
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
        openLinkTab,
        openAllWindow,
        openAllTab,
        openLinkWindow,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export const useBookmarks = () => {
  return useContext(BookmarksContext);
};
