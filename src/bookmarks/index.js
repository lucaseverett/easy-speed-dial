import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { css } from "emotion";
import { Theme } from "./themes/default";
import { ContextMenu } from "./contextMenu.js";
import { usePrevious } from "../hooks/usePrevious.js";
import { useOptions } from "../hooks/useOptions.js";
import { useBookmarks } from "../hooks/useBookmarks.js";
import { wallpaperStyles } from "../wallpapers/styles.js";

let scrollPosition = 0;

window.onscroll = () => {
  scrollPosition = window.pageYOffset;
};

let menuCoords = { x: 0, y: 0 };

export function Bookmarks() {
  const { bookmarks, currentFolder, changeFolder, path } = useBookmarks();
  const {
    appearance,
    newTab,
    smallerDials,
    defaultFolder,
    wallpaper,
    fullWidth
  } = useOptions();
  const [showContextMenu, setShowContextMenu] = useState(false);

  let prevFolder = usePrevious(currentFolder);

  useLayoutEffect(() => {
    if (prevFolder !== currentFolder) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, scrollPosition);
    }
  }, [bookmarks, currentFolder]);

  function handleContextMenu(e) {
    e.preventDefault();
    if (showContextMenu) {
      setShowContextMenu(false);
    } else {
      menuCoords = {
        x: e.pageX + 147 >= window.innerWidth ? e.pageX - 147 : e.pageX,
        y: e.pageY + 46 >= window.innerHeight ? e.pageY - 46 : e.pageY
      };
      setShowContextMenu(true);
    }
  }

  function hideContextMenu() {
    setShowContextMenu(false);
  }

  function handleEscape(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      setShowContextMenu(false);
    }
  }

  const focusRef = useRef(null);

  if (focusRef.current) {
    focusRef.current.focus();
  }

  return (
    <div
      ref={focusRef}
      tabIndex="-1"
      className={[
        appearance,
        wallpaper,
        wallpaperStyles(wallpaper),
        smallerDials ? "small-dials" : "large-dials",
        fullWidth ? "full-width" : "normal-width",
        css`
          outline: 0;
        `
      ].join(" ")}
      onClick={hideContextMenu}
      onKeyDown={handleEscape}
      onContextMenu={handleContextMenu}
    >
      {showContextMenu && (
        <ContextMenu {...{ top: menuCoords.y, left: menuCoords.x }} />
      )}
      <Theme
        {...{
          bookmarks,
          currentFolder: { id: currentFolder.id, title: currentFolder.title },
          path,
          changeFolder,
          isRoot: currentFolder.id === defaultFolder,
          newTab
        }}
      />
    </div>
  );
}
