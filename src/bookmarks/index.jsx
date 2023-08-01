import { memo, useLayoutEffect, useRef } from "react";

import "./styles.css";
import "../styles/inputs.css";
import "../styles/buttons.css";
import "../styles/wallpapers.css";
import { Theme } from "./themes/default";
import { AlertBanner } from "./AlertBanner.jsx";
import { ContextMenu, useContextMenu } from "./useContextMenu.jsx";
import { useOptions } from "useOptions";
import { useBookmarks } from "useBookmarks";
import classNames from "classnames";

const userAgent = navigator.userAgent.toLowerCase();
const isMacOS = userAgent.includes("macintosh") ? true : false;
const isChrome = userAgent.includes("chrome") ? true : false;

export const Bookmarks = memo(function Bookmarks() {
  const { currentFolder } = useBookmarks();
  const {
    colorScheme,
    wallpaper,
    customColor,
    customImage,
    themeOption,
    firstRun,
    showAlertBanner,
    hideAlertBanner,
    showTitle,
    attachTitle,
  } = useOptions();
  const { hideContextMenu } = useContextMenu();

  function handleDismissAlertBanner() {
    hideAlertBanner();
  }

  useLayoutEffect(() => {
    // Resets focus and scrolls to the top upon changing folders
    hideContextMenu();
    focusRef.current.scrollTop = 0;
    focusRef.current.focus();
  }, [currentFolder, hideContextMenu]);

  useLayoutEffect(() => {
    document.documentElement.className = classNames(
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
      attachTitle ? "attach-title" : "normal-title",
    );
    document.documentElement.style.backgroundImage =
      wallpaper === "custom-image" && customImage
        ? `url(${customImage})`
        : null;
    document.documentElement.style.setProperty(
      "--background-color",
      wallpaper === "custom-color" && customColor
        ? customColor
        : wallpaper
        ? null
        : themeOption === "System Theme"
        ? colorScheme === "color-scheme-dark"
          ? "#212121"
          : "#f5f5f5"
        : themeOption === "Light"
        ? "#f5f5f5"
        : "#212121",
    );
  }, [
    attachTitle,
    colorScheme,
    customColor,
    customImage,
    showTitle,
    themeOption,
    wallpaper,
  ]);

  const focusRef = useRef(null);

  return (
    <ContextMenu>
      <div
        className="Bookmarks"
        tabIndex="-1"
        ref={focusRef}
        onScroll={hideContextMenu}
      >
        {showAlertBanner && (
          <AlertBanner
            {...{
              handleDismissAlertBanner,
              firstRun,
            }}
          />
        )}
        <Theme />
      </div>
    </ContextMenu>
  );
});
