import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { css } from "emotion";
import { useBookmarks } from "./useBookmarks.js";
import { useOptions } from "./useOptions.js";

export const ContextMenu = ({
  menuCoords,
  linkURL,
  linkID,
  handleShowWhatsNew,
  handleEscapeContext,
  hideContextMenu,
}) => {
  const {
    openLinkTab,
    openAllTab,
    deleteFolder,
    deleteBookmark,
  } = useBookmarks();
  const { openOptions } = useOptions();

  const contextRef = useRef(null);
  const firstItemRef = useRef(null);
  const secondItemRef = useRef(null);
  const thirdItemRef = useRef(null);

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [currIndex, setCurrIndex] = useState(-1);

  useEffect(() => {
    setCurrIndex(-1);
  }, [linkID, linkURL]);

  useLayoutEffect(() => {
    let tabIndex = [
      firstItemRef.current,
      secondItemRef.current,
      thirdItemRef.current,
    ];

    if (currIndex >= 0) {
      tabIndex[currIndex].focus();
    } else {
      contextRef.current.focus();
    }
  }, [currIndex, linkURL, linkID]);

  function handleContextMenu(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function handleMouseEnter(e) {
    setCurrIndex(-1);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      handleEscapeContext(e);
    } else if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function handleLinkTabs(e) {
    if (e.keyCode === 38) {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex < 1) {
        setCurrIndex(2);
      } else {
        setCurrIndex(currIndex - 1);
      }
    } else if (e.keyCode === 40) {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex < 2) {
        setCurrIndex(currIndex + 1);
      } else {
        setCurrIndex(0);
      }
    }
  }

  function handleFolderTabs(e) {
    if (e.keyCode === 38) {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex < 1) {
        setCurrIndex(1);
      } else {
        setCurrIndex(currIndex - 1);
      }
    } else if (e.keyCode === 40) {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex < 1) {
        setCurrIndex(currIndex + 1);
      } else {
        setCurrIndex(0);
      }
    }
  }

  function handleMainTabs(e) {
    if (e.keyCode === 38) {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex < 1) {
        setCurrIndex(1);
      } else {
        setCurrIndex(currIndex - 1);
      }
    } else if (e.keyCode === 40) {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex < 1) {
        setCurrIndex(currIndex + 1);
      } else {
        setCurrIndex(0);
      }
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
    hideContextMenu();
    openOptions();
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

  const styles = css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    font-family: Arial, Helvetica, sans-serif;
    z-index: 1;

    font-size: 12px;
    .firefox & button {
      text-transform: capitalize;
    }
    box-shadow: 0 4px 3px rgb(0, 0, 0, 0.3);
    white-space: nowrap;
    .lowercase {
      text-transform: lowercase;
    }
    ul {
      list-style: none;
      padding: 5px 0;
      margin: 0;
    }
    li {
      button {
        text-align: left;
        padding: 5px 20px;
        width: 100%;
        border: 0;
        background-color: transparent;
        :hover,
        :focus {
          background-color: #1565c0;
          outline: 0;
        }
      }
    }
    .color-scheme-light & {
      border: 1px solid #bdbdbd;
      background-color: #eeeeee;
      li button {
        color: #000;
        :hover,
        :focus {
          color: #fff;
        }
      }
    }
    .color-scheme-dark & {
      border: 1px solid #6d6d6d;
      background-color: #424242;
      li button {
        color: #fff;
        :hover,
        :focus {
          color: #fff;
        }
      }
    }
    ul:not(:first-child) {
      .color-scheme-light & {
        border-top: 1px solid #bdbdbd;
      }
      .color-scheme-dark & {
        border-top: 1px solid #6d6d6d;
      }
    }
    li.delete {
      button {
        .color-scheme-light & {
          color: #c62828;
        }
        .color-scheme-dark & {
          color: #ef9a9a;
        }
        :hover,
        :focus {
          background-color: #c62828;
          color: #fff;
        }
      }
    }
  `;

  return (
    <div
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={styles}
    >
      {linkURL ? (
        <div
          onKeyDown={handleLinkTabs}
          tabIndex="-1"
          ref={contextRef}
          className={css`
            outline: 0;
          `}
        >
          <ul>
            <li>
              <button
                ref={firstItemRef}
                onClick={handleOpenLinkTab}
                onContextMenu={handleContextMenu}
                onMouseEnter={handleMouseEnter}
              >
                Open <span className="lowercase">in</span> new tab
              </button>
            </li>
          </ul>
          <ul>
            <li>
              <button
                ref={secondItemRef}
                onClick={copyURL}
                onContextMenu={handleContextMenu}
                onMouseEnter={handleMouseEnter}
              >
                Copy link
              </button>
            </li>
          </ul>
          <ul>
            <li className="delete">
              <button
                ref={thirdItemRef}
                onClick={handleDeleteBookmark}
                onMouseEnter={handleMouseEnter}
              >
                Delete bookmark
              </button>
            </li>
          </ul>
        </div>
      ) : linkID ? (
        <div
          onKeyDown={handleFolderTabs}
          tabIndex="-1"
          ref={contextRef}
          className={css`
            outline: 0;
          `}
        >
          <ul>
            <li>
              <button
                ref={firstItemRef}
                onClick={handleOpenAllTab}
                onContextMenu={handleContextMenu}
                onMouseEnter={handleMouseEnter}
              >
                Open all <span className="lowercase">in</span> new tabs
              </button>
            </li>
          </ul>
          <ul>
            <li className="delete">
              <button
                ref={secondItemRef}
                onClick={handleDeleteFolder}
                onMouseEnter={handleMouseEnter}
              >
                Delete folder
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div
          onKeyDown={handleMainTabs}
          tabIndex="-1"
          ref={contextRef}
          className={css`
            outline: 0;
          `}
        >
          <ul>
            <li>
              <button
                ref={firstItemRef}
                onClick={handleopenOptions}
                onContextMenu={handleContextMenu}
                onMouseEnter={handleMouseEnter}
              >
                Customize
              </button>
            </li>
          </ul>
          <ul>
            <li>
              <button
                ref={secondItemRef}
                onClick={handleShowWhatsNew}
                onMouseEnter={handleMouseEnter}
              >
                What's new
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
