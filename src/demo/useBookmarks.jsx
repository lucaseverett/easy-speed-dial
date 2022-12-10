import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { filter } from "../common/filter.js";
import { useOptions } from "./useOptions.jsx";
import { allBookmarks } from "./mockBookmarks.js";

const BookmarksContext = createContext();

const folders = Object.keys(allBookmarks).map((f) => ({
  id: f,
  title: allBookmarks[f]["title"],
}));

export function ProvideBookmarks({ children }) {
  const { defaultFolder } = useOptions();
  const [bookmarks, setBookmarks] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({});
  const [isRoot, setIsRoot] = useState(true);
  const [parentID, setParentID] = useState();

  const currentFolderRef = useRef(null);

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
  }, [currentFolder, defaultFolder, parentID]);

  function popState(e) {
    // on forward/back buttons
    changeFolder({
      id: e.state.id,
      pushState: false,
      replaceState: false,
      saveSession: true,
    });
  }

  function changeFolder({ id, pushState, replaceState, saveSession }) {
    // Needs error handling
    // If folder not found, display defaultFolder
    // If defaultFolder doesn't exist, display root folder
    // If issue with root folder, display error message
    setBookmarks(filter(allBookmarks[id]["bookmarks"]));
    setCurrentFolder({ id, title: allBookmarks[id]["title"] });
    setParentID(allBookmarks[id]["parentID"]);
    if (saveSession)
      sessionStorage.setItem("last-folder", JSON.stringify({ id }));
    if (pushState) history.pushState({ id }, document.title);
    if (replaceState) history.replaceState({ id }, document.title);
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
