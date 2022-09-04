import { useState, useLayoutEffect, useRef, memo } from "react";

import "./styles.css";
import "../styles/buttons.css";
import "../styles/wallpapers.css";
import { Theme } from "./themes/default/index.jsx";
import { AlertBanner } from "./AlertBanner.jsx";
import { WhatsNew } from "./WhatsNew/index.jsx";
import { AboutModal } from "./AboutModal/index.jsx";
import { ContextMenu } from "useContextMenu";
import { useOptions } from "useOptions";
import { useBookmarks } from "useBookmarks";
import classNames from "classnames";

const userAgent = navigator.userAgent.toLowerCase();
const isMacOS = userAgent.includes("macintosh") ? true : false;
const isChrome = userAgent.includes("chrome") ? true : false;

function Bookmarks() {
  const { bookmarks, currentFolder, changeFolder } = useBookmarks();
  const {
    newTab,
    defaultFolder,
    colorScheme,
    wallpaper,
    customColor,
    customImage,
    themeOption,
    firstRun,
    showAlertBanner,
    hideAlertBanner,
    showTitle,
    switchTitle,
    attachTitle,
  } = useOptions();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [linkID, setLinkID] = useState();
  const [linkURL, setLinkURL] = useState();
  const [menuCoords, setMenuCoords] = useState();
  const [showModal, setShowModal] = useState();

  function handleScroll() {
    if (showContextMenu) {
      hideContextMenu();
    }
  }

  function handleContextMenu(e) {
    e.preventDefault();
    setMenuCoords({
      pageX: e.pageX,
      pageY: e.pageY,
    });
    setShowContextMenu(true);
  }

  function handleWallpaperContextMenu(e) {
    setLinkURL();
    setLinkID();
    handleContextMenu(e);
  }

  function handleLinkContextMenu(e, { url = "", id = "" }) {
    e.stopPropagation();
    setLinkURL(url);
    setLinkID(id);
    handleContextMenu(e);
  }

  function hideContextMenu() {
    setShowContextMenu(false);
    setLinkURL();
    setLinkID();
  }

  function handleEscapeContext(e) {
    if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      hideContextMenu();
    }
  }

  function handleEscapeModal(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      setShowModal();
    }
  }

  function handleDismissAlertBanner() {
    hideAlertBanner();
  }

  function handleDismissModal() {
    setShowModal();
  }

  function handleShowWhatsNew() {
    hideContextMenu();
    setShowModal("whats-new");
  }

  function handleShowAbout() {
    hideContextMenu();
    setShowModal("about");
  }

  const focusRef = useRef(null);

  useLayoutEffect(() => {
    // Resets focus and scrolls to the top upon changing folders
    focusRef.current.scrollTop = 0;
    focusRef.current.focus();
  }, [currentFolder]);

  return (
    <div
      ref={focusRef}
      tabIndex="-1"
      className={classNames(
        "Bookmarks",
        themeOption === "System Theme"
          ? colorScheme
          : themeOption === "Light"
          ? "color-scheme-light"
          : "color-scheme-dark",
        wallpaper,
        "Wallpapers",
        isChrome ? "chrome" : "firefox",
        isMacOS ? "mac" : "windows",
        showTitle ? "show-title" : "hide-title",
        attachTitle ? "attach-title" : "normal-title"
      )}
      style={{
        backgroundImage:
          wallpaper === "custom-image" && customImage
            ? `url(${customImage})`
            : false,
        "--background-color":
          wallpaper === "custom-color" && customColor
            ? customColor
            : wallpaper
            ? false
            : themeOption === "System Theme"
            ? colorScheme === "color-scheme-dark"
              ? "#212121"
              : "#f5f5f5"
            : themeOption === "Light"
            ? "#f5f5f5"
            : themeOption === "Dark"
            ? "#212121"
            : false,
      }}
      onClick={hideContextMenu}
      onContextMenu={handleWallpaperContextMenu}
      onScroll={handleScroll}
    >
      {showContextMenu && (
        <ContextMenu
          {...{
            menuCoords,
            linkID,
            linkURL,
            handleShowWhatsNew,
            handleShowAbout,
            handleEscapeContext,
            hideContextMenu,
          }}
        />
      )}
      {showAlertBanner && (
        <AlertBanner
          {...{
            handleDismissAlertBanner,
            handleShowWhatsNew,
            hideContextMenu,
            firstRun,
          }}
        />
      )}
      {showModal === "whats-new" && (
        <WhatsNew {...{ handleDismissModal, handleEscapeModal }} />
      )}
      {showModal === "about" && (
        <AboutModal {...{ handleDismissModal, handleEscapeModal }} />
      )}
      <Theme
        {...{
          bookmarks,
          currentFolder,
          changeFolder,
          isRoot:
            currentFolder.id === undefined ||
            currentFolder.title === undefined ||
            defaultFolder === undefined
              ? true
              : currentFolder.title
              ? false
              : defaultFolder === currentFolder.id,
          newTab,
          handleLinkContextMenu,
          showTitle,
          switchTitle,
        }}
      />
    </div>
  );
}

Bookmarks = memo(Bookmarks);

export { Bookmarks };
