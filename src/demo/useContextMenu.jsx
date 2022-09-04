import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useBookmarks } from "./useBookmarks.jsx";
import { useOptions } from "./useOptions.jsx";
import "../styles/ContextMenu.css";

export const ContextMenu = ({
  menuCoords,
  linkURL,
  linkID,
  handleShowWhatsNew,
  handleShowAbout,
  handleEscapeContext,
  hideContextMenu,
}) => {
  const { openLinkTab, openAllTab, deleteFolder, deleteBookmark } =
    useBookmarks();
  const { openOptions } = useOptions();

  const contextRef = useRef(null);

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [currIndex, setCurrIndex] = useState(-1);
  const [menuItems, setMenuItems] = useState(null);

  useEffect(() => {
    setCurrIndex(-1);
    if (document.querySelectorAll("#context-menu button"))
      setMenuItems(document.querySelectorAll("#context-menu button"));
  }, [linkID, linkURL]);

  useEffect(() => {
    if (currIndex >= 0 && menuItems && menuItems[currIndex]) {
      menuItems[currIndex].focus();
    } else if (currIndex === -1) {
      if (contextRef) contextRef.current.focus();
    }
  }, [currIndex, menuItems]);

  function handleContextMenu(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function handleMouseEnter(e) {
    setCurrIndex(-1);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape" || e.key === "Tab") {
      handleEscapeContext(e);
    } else if (e.keyCode === 38) {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex === -1) {
        setCurrIndex(menuItems.length - 1);
      } else if (currIndex <= menuItems.length - 1 && currIndex > 0) {
        setCurrIndex(currIndex - 1);
      }
    } else if (e.keyCode === 40) {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex < menuItems.length - 1) {
        setCurrIndex(currIndex + 1);
      }
    } else if (e.keyCode === 35) {
      setCurrIndex(menuItems.length - 1);
    } else if (e.keyCode === 36) {
      setCurrIndex(0);
    }
  }

  useLayoutEffect(() => {
    if (contextRef.current) {
      setLeft(
        menuCoords.pageX + contextRef.current.offsetWidth >= window.innerWidth
          ? menuCoords.pageX - contextRef.current.offsetWidth
          : menuCoords.pageX
      );
      setTop(
        menuCoords.pageY + contextRef.current.offsetHeight >= window.innerHeight
          ? menuCoords.pageY - contextRef.current.offsetHeight
          : menuCoords.pageY
      );
    }
  }, [menuCoords]);

  function handleOpenLinkTab() {
    hideContextMenu();
    openLinkTab(linkURL);
  }

  function handleOpenAllTab() {
    hideContextMenu();
    openAllTab(linkID);
  }

  function handleDeleteFolder() {
    hideContextMenu();
    deleteFolder(linkID);
  }

  function handleDeleteBookmark() {
    hideContextMenu();
    deleteBookmark(linkID);
  }

  function handleopenOptions() {
    openOptions();
    hideContextMenu();
  }

  function copyURL() {
    let i = document.createElement("input");
    i.value = linkURL;
    document.body.appendChild(i);
    i.select();
    document.execCommand("copy");
    i.remove();
    hideContextMenu();
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      className="ContextMenu"
      style={{
        "--context-menu-top": `${top}px`,
        "--context-menu-left": `${left}px`,
      }}
      id="context-menu"
    >
      {linkURL ? (
        <div tabIndex="-1" ref={contextRef} className="no-outline">
          <ul>
            <li>
              <button onClick={handleOpenLinkTab}>
                Open <span className="lowercase">in</span> new tab
              </button>
            </li>
          </ul>
          <ul>
            <li>
              <button onClick={copyURL}>Copy link</button>
            </li>
          </ul>
          <ul>
            <li className="delete">
              <button onClick={handleDeleteBookmark}>Delete bookmark</button>
            </li>
          </ul>
        </div>
      ) : linkID ? (
        <div tabIndex="-1" ref={contextRef} className="no-outline">
          <ul>
            <li>
              <button onClick={handleOpenAllTab}>
                Open all <span className="lowercase">in</span> new tabs
              </button>
            </li>
          </ul>
          <ul>
            <li className="delete">
              <button onClick={handleDeleteFolder}>Delete folder</button>
            </li>
          </ul>
        </div>
      ) : (
        <div tabIndex="-1" ref={contextRef} className="no-outline">
          <ul>
            <li>
              <button onClick={handleopenOptions}>Customize</button>
            </li>
          </ul>
          <ul>
            <li>
              <button onClick={handleShowWhatsNew}>What's new</button>
            </li>
          </ul>
          <ul>
            <li>
              <button onClick={handleShowAbout}>About Toolbar Dial</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
