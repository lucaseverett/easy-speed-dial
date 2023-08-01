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
import { browser } from "./mockBookmarks.js";

const BookmarksContext = createContext();

export const ProvideBookmarks = memo(function ProvideBookmarks({ children }) {
  const { defaultFolder } = useOptions();
  const [bookmarks, setBookmarks] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({});
  const [folders, setFolders] = useState([]);
  const [isRoot, setIsRoot] = useState(true);
  const [parentId, setparentId] = useState();

  const currentFolderRef = useRef(null);

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
        addFolder(
          bookmarkItem.id,
          `${makeIndent(indent)}${bookmarkItem.title}`,
        );
        indent++;

        if (bookmarkItem.children) {
          bookmarkItem.children.forEach((child) => logItems(child, indent));
        }
      }
    }

    function logTree(bookmarkItems) {
      logItems(bookmarkItems[0], 0);
      setFolders(folders);
    }

    logTree(browser.bookmarks.getTree());
  }

  const changeFolder = useCallback(
    ({ id, pushState, replaceState, saveSession }) => {
      // Needs error handling
      // If folder not found, display defaultFolder
      // If defaultFolder doesn't exist, display root folder
      // If issue with root folder, display error message
      const bookmarks = browser.bookmarks.getSubTree(id);
      setBookmarks(filter(bookmarks.children));
      setCurrentFolder({ id, title: bookmarks.title });
      setparentId(bookmarks.parentId);
      if (saveSession)
        sessionStorage.setItem("last-folder", JSON.stringify({ id }));
      if (pushState) history.pushState({ id }, document.title);
      if (replaceState) history.replaceState({ id }, document.title);
    },
    [],
  );

  useEffect(() => {
    // Generate list of folders upon initial load
    // Used for default folder <select> on Options page
    getFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function popState(e) {
    // Runs on use of browser forward/back buttons
    changeFolder({
      id: e.state.id,
      pushState: false,
      replaceState: false,
      saveSession: true,
    });
  }

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
    // Need to fix issue with session preventing defaultFolder use
    // (Issue only with demo version)
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

  const createBookmark = useCallback(
    ({ url, title, parentId }) => {
      // Format URL if missing protocol
      if (url && !url.match(/^[a-zA-Z]+:/)) {
        url = `http://${url}`;
      }
      const newBookmark = browser.bookmarks.create({
        url,
        title,
        parentId,
      });
      setBookmarks(
        filter(browser.bookmarks.getSubTree(currentFolder.id).children),
      );
      return newBookmark;
    },
    [currentFolder.id],
  );

  const updateBookmark = useCallback(
    (id, changes) => {
      if (changes.url && !changes.url.match(/^[a-zA-Z]+:/)) {
        changes.url = `http://${changes.url}`;
      }
      browser.bookmarks.update(id, changes);
      setBookmarks(
        filter(browser.bookmarks.getSubTree(currentFolder.id).children),
      );
    },
    [currentFolder.id],
  );

  const moveBookmark = useCallback(({ id, to }) => {
    // Uses a ref because it is used in an event listener
    browser.bookmarks.move(id, {
      index: browser.bookmarks.getSubTree(currentFolderRef.current.id).children[
        to
      ]["index"],
    });
    setBookmarks(
      filter(
        browser.bookmarks.getSubTree(currentFolderRef.current.id).children,
      ),
    );
  }, []);

  const deleteBookmark = useCallback(
    (id) => {
      browser.bookmarks.remove(id);
      setBookmarks(
        filter(browser.bookmarks.getSubTree(currentFolder.id).children),
      );
    },
    [currentFolder.id],
  );

  const deleteFolder = useCallback(
    (id) => {
      browser.bookmarks.removeTree(id);
      setBookmarks(
        filter(browser.bookmarks.getSubTree(currentFolder.id).children),
      );
    },
    [currentFolder.id],
  );

  const openLinkTab = useCallback((url) => {
    window.open(url, "toolbardial", "noopener,noreferrer");
  }, []);

  const openAllTab = useCallback(
    (id) => {
      browser.bookmarks
        .getSubTree(id)
        .children.filter((b) => b.url)
        .forEach(({ url }) => openLinkTab(url));
    },
    [openLinkTab],
  );

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
      openAllTab,
      openLinkTab,
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
      openAllTab,
      openLinkTab,
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
