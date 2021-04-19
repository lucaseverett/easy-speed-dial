import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { css } from "@emotion/css";
import { Theme } from "./themes/default";
import { AlertBanner } from "./AlertBanner.js";
import { WhatsNew } from "./WhatsNew.js";
import { AboutModal } from "./AboutModal.js";
import { ContextMenu } from "useContextMenu";
import { useOptions } from "useOptions";
import { useBookmarks } from "useBookmarks";
import { wallpaperStyles } from "../wallpapers/styles.js";
import { mainScrollbarStyles } from "../styles/scrollbars.js";

const userAgent = navigator.userAgent.toLowerCase();
const isMacOS = userAgent.includes("macintosh") ? true : false;
const isChrome = userAgent.includes("chrome") ? true : false;

export function Bookmarks() {
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
    switchTitle,
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
      className={[
        themeOption === "System Theme"
          ? colorScheme
          : themeOption === "Light"
          ? "color-scheme-light"
          : "color-scheme-dark",
        wallpaper,
        wallpaperStyles({ wallpaper, customColor, customImage }),
        isChrome ? "chrome" : "firefox",
        isMacOS ? "mac" : "windows",
        css`
          outline: 0;
          overflow: auto;
          ${mainScrollbarStyles}
          height: 100vh;
          font-family: "Roboto", sans-serif;
          transition: color 0.15s ease-in-out,
            background-color 0.15s ease-in-out,
            background-image 0.15s ease-in-out, border 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        `,
      ].join(" ")}
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
          switchTitle,
        }}
      />
    </div>
  );
}
