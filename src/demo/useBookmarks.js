import { createContext, useContext, useState, useEffect, useRef } from "react";
import { filter } from "../common/filter.js";
import { useOptions } from "./useOptions.js";
import { allBookmarks } from "./bookmarks.js";
import { usePrevious } from "../common/usePrevious.js";

const BookmarksContext = createContext();

const folders = Object.keys(allBookmarks).map((f) => ({
  id: f,
  title: allBookmarks[f]["title"],
}));

export function ProvideBookmarks({ children }) {
  const { defaultFolder } = useOptions();
  const [bookmarks, setBookmarks] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({});

  useEffect(() => {
    window.addEventListener("popstate", popState);
    if (history.state) {
      const { id, title } = history.state;
      setCurrentFolder({
        id,
        title,
      });
      setBookmarks(filter(allBookmarks[id].bookmarks));
    }
    return () => {
      window.removeEventListener("popstate", popState);
    };
  }, []);

  const previousDefaultFolder = usePrevious(defaultFolder);

  useEffect(() => {
    if (defaultFolder !== undefined && history.state === null) {
      // first run
      history.replaceState({ id: defaultFolder }, document.title);
      setCurrentFolder({ id: defaultFolder });
      setBookmarks(filter(allBookmarks[defaultFolder].bookmarks));
    } else if (
      defaultFolder !== undefined &&
      previousDefaultFolder !== undefined &&
      previousDefaultFolder !== defaultFolder &&
      history.state !== null
    ) {
      // default folder option changed
      const id = defaultFolder;
      history.replaceState({ id }, document.title);
      setBookmarks(filter(allBookmarks[id]["bookmarks"]));
      setCurrentFolder({ id });
    }
  }, [defaultFolder]);

  const currentFolderRef = useRef(null);

  useEffect(() => {
    currentFolderRef.current = currentFolder;
  }, [currentFolder]);

  function popState(e) {
    const { id, title } = e.state;
    setBookmarks(filter(allBookmarks[id]["bookmarks"]));
    setCurrentFolder({ id, title });
  }

  function changeFolder(nextFolder) {
    const { id, title } = nextFolder;
    history.pushState({ id, title }, document.title);
    setBookmarks(filter(allBookmarks[id]["bookmarks"]));
    setCurrentFolder({ id, title });
  }

  function moveBookmark({ id, from, to }) {
    const arr = allBookmarks[currentFolderRef.current.id]["bookmarks"];
    arr.splice(to, 0, arr.splice(from, 1)[0]);
  }

  function deleteBookmark(id) {
    allBookmarks[currentFolder.id]["bookmarks"] = allBookmarks[
      currentFolder.id
    ]["bookmarks"].filter((b) => b.id !== id);
    setBookmarks(filter(allBookmarks[currentFolder.id]["bookmarks"]));
  }

  function deleteFolder(id) {
    allBookmarks[currentFolder.id]["bookmarks"] = allBookmarks[
      currentFolder.id
    ]["bookmarks"].filter((b) => b.id !== id);
    setBookmarks(filter(allBookmarks[currentFolder.id]["bookmarks"]));
  }

  function openLinkTab(url) {
    window.open(url, "toolbardial", "noopener,noreferrer");
  }

  function openAllTab(linkID) {
    allBookmarks[linkID]["bookmarks"]
      .filter((b) => b.url)
      .forEach(({ url }) => openLinkTab(url));
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
        openAllTab,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export const useBookmarks = () => {
  return useContext(BookmarksContext);
};
