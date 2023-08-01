/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { memo } from "react";

import { useBookmarks } from "useBookmarks";
import { useOptions } from "useOptions";
import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useModals } from "./useModals.jsx";

const ContextMenuContext = createContext();

export const ProvideContextMenu = memo(function ProvideContextMenu({
  children,
}) {
  const [isOpen, _setIsOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const isOpenRef = useRef(null);
  const { bookmarkDetails } = useModals();

  function setIsOpen(value) {
    _setIsOpen(value);
    isOpenRef.current = value;
  }

  const hideContextMenu = useCallback(() => {
    if (isOpenRef.current) {
      document
        .querySelector(`[data-id="${bookmarkDetails.current.bookmarkID}"]`)
        ?.focus();
      setIsOpen(false);
    }
  }, [bookmarkDetails]);

  const contextValue = useMemo(
    () => ({
      setIsOpen,
      anchorPoint,
      setAnchorPoint,
      hideContextMenu,
    }),
    [anchorPoint, hideContextMenu],
  );

  return (
    <ContextMenuContext.Provider value={contextValue}>
      <div onClick={hideContextMenu}>{children}</div>
      {isOpen && <Menu />}
    </ContextMenuContext.Provider>
  );
});

export const ContextMenu = memo(function ContextMenu({ children }) {
  const { setAnchorPoint, setIsOpen } = useContext(ContextMenuContext);
  const { bookmarkDetails } = useModals();

  const handleContextMenu = useCallback(
    (e) => {
      let coords = { x: e.pageX, y: e.pageY };

      // Center the menu when opened by keyboard
      if (coords.x === 0 && coords.y === 0) {
        const keyboardCoords = e.target.getBoundingClientRect();
        coords = {
          x: keyboardCoords.left + keyboardCoords.width / 2,
          y: keyboardCoords.top + keyboardCoords.height / 2,
        };
      }
      e.preventDefault();
      e.stopPropagation();
      bookmarkDetails.current.bookmarkID =
        e.currentTarget.getAttribute("data-id") || "";
      bookmarkDetails.current.bookmarkURL = e.currentTarget.href || "";
      bookmarkDetails.current.bookmarkTitle =
        e.currentTarget.getAttribute("data-title") || "";
      setAnchorPoint({
        x: coords.x,
        y: coords.y,
      });
      setIsOpen(true);
    },
    [bookmarkDetails, setAnchorPoint, setIsOpen],
  );

  return cloneElement(children, { onContextMenu: handleContextMenu });
});

export const Menu = memo(function Menu() {
  const {
    deleteBookmark,
    deleteFolder,
    openAllBackgroundTab,
    openAllTab,
    openAllWindow,
    openLinkBackgroundTab,
    openLinkTab,
    openLinkWindow,
  } = useBookmarks();
  const { openOptions } = useOptions();
  const { anchorPoint, hideContextMenu } = useContext(ContextMenuContext);
  const { handleShowModal, bookmarkDetails } = useModals();

  const contextRef = useRef(null);

  const [currIndex, setCurrIndex] = useState(-1);
  const [menuItems, setMenuItems] = useState();

  useEffect(() => {
    // Effect runs when anchor point changes
    // (new context opened while another context is open)
    setCurrIndex(-1);
    setMenuItems(contextRef.current?.querySelectorAll("button"));
  }, [anchorPoint]);

  useEffect(() => {
    menuItems?.forEach((el) => el.classList.remove("selected"));
    if (currIndex === -1) {
      contextRef.current?.focus();
    } else {
      menuItems?.[currIndex]?.focus();
      menuItems?.[currIndex]?.classList.add("selected");
    }
  }, [currIndex, menuItems]);

  function handleContextMenu(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function handleMouseEnter(e) {
    const items = [...menuItems];
    setCurrIndex(items.indexOf(e.target));
  }

  function handleMouseLeave() {
    setCurrIndex(-1);
  }

  function handleKeyDown(e) {
    if (
      (e.key === "Enter" && currIndex === -1) ||
      (e.key === " " && currIndex === -1)
    ) {
      e.preventDefault();
      e.stopPropagation();
      setCurrIndex(0);
    } else if (e.key === "Escape") {
      hideContextMenu();
    } else if (e.key === "Tab") {
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex === -1 || currIndex === 0) {
        setCurrIndex(menuItems.length - 1);
      } else {
        setCurrIndex(currIndex - 1);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      if (currIndex === -1 || currIndex === menuItems.length - 1) {
        setCurrIndex(0);
      } else {
        setCurrIndex(currIndex + 1);
      }
    } else if (e.key === "End") {
      e.preventDefault();
      e.stopPropagation();
      setCurrIndex(menuItems.length - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      e.stopPropagation();
      setCurrIndex(0);
    }
  }

  useLayoutEffect(() => {
    contextRef.current?.style.setProperty(
      "--context-menu-left",
      `${
        anchorPoint.x + contextRef.current?.offsetWidth >= window.innerWidth
          ? anchorPoint.x - contextRef.current?.offsetWidth
          : anchorPoint.x
      }px`,
    );
    contextRef.current?.style.setProperty(
      "--context-menu-top",
      `${
        anchorPoint.y + contextRef.current?.offsetHeight >= window.innerHeight
          ? anchorPoint.y - contextRef.current?.offsetHeight
          : anchorPoint.y
      }px`,
    );
  }, [anchorPoint]);

  function handleOpenLinkTab() {
    hideContextMenu();
    openLinkTab(bookmarkDetails.current.bookmarkURL);
  }

  function handleOpenLinkBackgroundTab() {
    hideContextMenu();
    openLinkBackgroundTab(bookmarkDetails.current.bookmarkURL);
  }

  function handleOpenLinkWindow() {
    hideContextMenu();
    openLinkWindow(bookmarkDetails.current.bookmarkURL);
  }

  function handleOpenAllTab() {
    hideContextMenu();
    openAllTab(bookmarkDetails.current.bookmarkID);
  }

  function handleOpenAllBackgroundTab() {
    hideContextMenu();
    openAllBackgroundTab(bookmarkDetails.current.bookmarkID);
  }

  function handleOpenAllWindow() {
    hideContextMenu();
    openAllWindow(bookmarkDetails.current.bookmarkID);
  }

  function handleDeleteFolder() {
    hideContextMenu();
    deleteFolder(bookmarkDetails.current.bookmarkID);
  }

  function handleDeleteBookmark() {
    hideContextMenu();
    deleteBookmark(bookmarkDetails.current.bookmarkID);
  }

  function handleOpenOptions() {
    hideContextMenu();
    openOptions();
  }

  function handleShowWhatsNew() {
    hideContextMenu();
    handleShowModal({
      modal: "whats-new",
    });
  }

  function handleShowAbout() {
    hideContextMenu();
    handleShowModal({
      modal: "about",
    });
  }

  function handleShowEdit() {
    hideContextMenu();
    handleShowModal({
      modal: "edit-bookmark",
      restoreFocusRef: `[data-id="${bookmarkDetails.current.bookmarkID}"]`,
    });
  }

  function handleShowNewBookmark() {
    hideContextMenu();
    handleShowModal({
      modal: "new-bookmark",
    });
  }

  function handleShowNewFolder() {
    hideContextMenu();
    handleShowModal({
      modal: "new-folder",
    });
  }

  function copyURL() {
    hideContextMenu();
    navigator.clipboard.writeText(bookmarkDetails.current.bookmarkURL);
  }

  return (
    <div
      tabIndex={-1}
      ref={contextRef}
      className="ContextMenu"
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onMouseLeave={handleMouseLeave}
      role="menu"
    >
      {bookmarkDetails.current.bookmarkURL ? (
        <>
          <ul>
            <li>
              <button
                onClick={handleOpenLinkTab}
                role="menuitem"
                onMouseEnter={handleMouseEnter}
              >
                Open <span className="lowercase">in</span> new tab
              </button>
            </li>
            {__PROJECT__.match(/chrome|firefox/) && (
              <>
                <li>
                  <button
                    onClick={handleOpenLinkBackgroundTab}
                    role="menuitem"
                    onMouseEnter={handleMouseEnter}
                  >
                    Open <span className="lowercase">in</span> background tab
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleOpenLinkWindow}
                    role="menuitem"
                    onMouseEnter={handleMouseEnter}
                  >
                    Open <span className="lowercase">in</span> new window
                  </button>
                </li>
              </>
            )}
            <li
              className="separator"
              role="separator"
              onMouseLeave={handleMouseLeave}
            ></li>
            <li>
              <button
                role="menuitem"
                onClick={handleShowEdit}
                onMouseEnter={handleMouseEnter}
              >
                Edit
              </button>
            </li>
            <li>
              <button
                onClick={copyURL}
                role="menuitem"
                onMouseEnter={handleMouseEnter}
              >
                Copy link
              </button>
            </li>
            <li className="delete">
              <button
                onClick={handleDeleteBookmark}
                role="menuitem"
                onMouseEnter={handleMouseEnter}
              >
                Delete
              </button>
            </li>
          </ul>
        </>
      ) : bookmarkDetails.current.bookmarkID ? (
        <>
          <ul>
            <li>
              <button
                onClick={handleOpenAllTab}
                role="menuitem"
                onMouseEnter={handleMouseEnter}
              >
                Open all <span className="lowercase">in</span> new tabs
              </button>
            </li>
            {__PROJECT__.match(/chrome|firefox/) && (
              <>
                <li>
                  <button
                    onClick={handleOpenAllBackgroundTab}
                    role="menuitem"
                    onMouseEnter={handleMouseEnter}
                  >
                    Open all <span className="lowercase">in</span> background
                    tabs
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleOpenAllWindow}
                    role="menuitem"
                    onMouseEnter={handleMouseEnter}
                  >
                    Open all <span className="lowercase">in</span> new window
                  </button>
                </li>
              </>
            )}
            <li
              className="separator"
              role="separator"
              onMouseLeave={handleMouseLeave}
            ></li>
            <li>
              <button
                role="menuitem"
                onMouseEnter={handleMouseEnter}
                onClick={handleShowEdit}
              >
                Edit
              </button>
            </li>
            <li className="delete">
              <button
                onClick={handleDeleteFolder}
                role="menuitem"
                onMouseEnter={handleMouseEnter}
              >
                Delete
              </button>
            </li>
          </ul>
        </>
      ) : (
        <>
          <ul>
            <li>
              <button
                role="menuitem"
                onMouseEnter={handleMouseEnter}
                onClick={handleShowNewBookmark}
              >
                New bookmark
              </button>
            </li>
            <li>
              <button
                role="menuitem"
                onMouseEnter={handleMouseEnter}
                onClick={handleShowNewFolder}
              >
                New folder
              </button>
            </li>
            <li
              className="separator"
              role="separator"
              onMouseLeave={handleMouseLeave}
            ></li>
            <li>
              <button
                onClick={handleOpenOptions}
                role="menuitem"
                onMouseEnter={handleMouseEnter}
              >
                Customize
              </button>
            </li>
            <li
              className="separator"
              role="separator"
              onMouseLeave={handleMouseLeave}
            ></li>
            <li>
              <button
                role="menuitem"
                onClick={handleShowWhatsNew}
                onMouseEnter={handleMouseEnter}
              >
                What&apos;s new
              </button>
            </li>
            <li
              className="separator"
              role="separator"
              onMouseLeave={handleMouseLeave}
            ></li>
            <li>
              <button
                role="menuitem"
                onClick={handleShowAbout}
                onMouseEnter={handleMouseEnter}
              >
                About Toolbar Dial
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
});

export function useContextMenu() {
  return useContext(ContextMenuContext);
}
