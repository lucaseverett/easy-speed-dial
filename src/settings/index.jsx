import { memo, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import "./styles.css";
import "../styles/inputs.css";
import "../styles/buttons.css";
import "../styles/wallpapers.css";
import { useOptions } from "useOptions";
import { useBookmarks } from "useBookmarks";
import { wallpapers } from "../wallpapers";
import { ColorPicker } from "./ColorPicker.jsx";
import { About } from "../bookmarks/About";

const userAgent = navigator.userAgent.toLowerCase();
const isMacOS = userAgent.includes("macintosh") ? true : false;
const isChrome = userAgent.includes("chrome") ? true : false;

const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="arrow">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M7 10l5 5 5-5H7z" />
  </svg>
);

export const Settings = memo(function Settings() {
  const { folders } = useBookmarks();
  const {
    attachTitle,
    colorScheme,
    customColor,
    customImage,
    defaultFolder,
    handleAttachTitle,
    handleCustomColor,
    handleCustomImage,
    handleDefaultFolder,
    handleMaxColumns,
    handleNewTab,
    handleShowTitle,
    handleSwitchTitle,
    handleThemeOption,
    handleWallpaper,
    maxColumns,
    newTab,
    showTitle,
    switchTitle,
    themeOption,
    wallpaper,
  } = useOptions();

  const focusRef = useRef(null);
  const customColorRef = useRef(null);

  const [showBackground, setShowBackground] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    document.title = "Toolbar Dial - Options";
    focusRef.current.focus();
  }, []);

  useEffect(() => {
    if (!showBackground && wallpaper) {
      setShowBackground(
        wallpaper.includes("wallpaper")
          ? "colors"
          : wallpaper.includes("custom")
          ? "custom"
          : wallpapers.filter(({ id }) => id === wallpaper)[0].category,
      );
    }
  }, [showBackground, wallpaper]);

  function handleCloseColorPicker() {
    setShowColorPicker(false);
    customColorRef.current.focus();
  }

  function getImageUrl(thumbnail) {
    return new URL(`../thumbs/${thumbnail}`, import.meta.url).href;
  }

  function handleBackgroundKeyDown(e) {
    let backgrounds = ["colors", "abstract", "artistic", "nature", "custom"];

    let currentIndex = backgrounds.indexOf(showBackground);
    if (e.key === "ArrowLeft") {
      let newIndex =
        (currentIndex + backgrounds.length - 1) % backgrounds.length;
      setShowBackground(backgrounds[newIndex]);
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      } else {
        e.target.parentNode.lastChild.focus();
      }
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      let newIndex = (currentIndex + 1) % backgrounds.length;
      setShowBackground(backgrounds[newIndex]);
      if (e.target.nextSibling) {
        e.target.nextSibling.focus();
      } else {
        e.target.parentNode.firstChild.focus();
      }
      e.preventDefault();
    } else if (e.key === "Home") {
      setShowBackground(backgrounds[0]);
      e.preventDefault();
      e.target.parentNode.firstChild.focus();
    } else if (e.key === "End") {
      setShowBackground(backgrounds[backgrounds.length - 1]);
      e.preventDefault();
      e.target.parentNode.lastChild.focus();
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classNames(
        "Options",
        themeOption === "System Theme"
          ? colorScheme
          : themeOption === "Light"
          ? "color-scheme-light"
          : "color-scheme-dark",
        isChrome ? "chrome" : "firefox",
        isMacOS ? "mac" : "windows",
        wallpaper,
        "Wallpapers",
      )}
      style={{
        backgroundImage:
          wallpaper === "custom-image" && customImage
            ? `url(${customImage})`
            : null,
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
      onMouseDown={() => {
        setShowColorPicker(false);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onKeyDown={handleBackgroundKeyDown}
    >
      <div className="options-background">
        <div
          id="options"
          onContextMenu={(e) => {
            e.stopPropagation();
          }}
        >
          <header>
            <h1>Toolbar Dial - Options</h1>
          </header>
          <main>
            <div
              className="settings-content scrollbars"
              ref={focusRef}
              tabIndex="-1"
            >
              <div className="setting-wrapper">
                <div className="setting-title" id="background-tablist-title">
                  Background
                </div>
                <div
                  className="setting-description"
                  id="background-tablist-description"
                >
                  Choose a background color or image for Toolbar Dial.
                </div>
                <div
                  className="background-buttons"
                  role="tablist"
                  aria-labelledby="background-tablist-title"
                  aria-describedby="background-tablist-description"
                >
                  <button
                    onClick={() => setShowBackground("colors")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "colors" ? true : false,
                    })}
                    role="tab"
                    aria-selected={showBackground === "colors" ? true : false}
                    aria-controls={
                      showBackground === "colors" ? "background-tabpanel" : null
                    }
                    tabIndex={showBackground === "colors" ? null : "-1"}
                  >
                    Colors
                  </button>
                  <button
                    onClick={() => setShowBackground("abstract")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "abstract" ? true : false,
                    })}
                    role="tab"
                    aria-selected={showBackground === "abstract" ? true : false}
                    aria-controls={
                      showBackground === "abstract"
                        ? "background-tabpanel"
                        : null
                    }
                    tabIndex={showBackground === "abstract" ? null : "-1"}
                  >
                    Abstract
                  </button>
                  <button
                    onClick={() => setShowBackground("artistic")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "artistic" ? true : false,
                    })}
                    role="tab"
                    aria-selected={showBackground === "artistic" ? true : false}
                    aria-controls={
                      showBackground === "artistic"
                        ? "background-tabpanel"
                        : null
                    }
                    tabIndex={showBackground === "artistic" ? null : "-1"}
                  >
                    Artistic
                  </button>
                  <button
                    onClick={() => setShowBackground("nature")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "nature" ? true : false,
                    })}
                    role="tab"
                    aria-selected={showBackground === "nature" ? true : false}
                    aria-controls={
                      showBackground === "nature" ? "background-tabpanel" : null
                    }
                    tabIndex={showBackground === "nature" ? null : "-1"}
                  >
                    Nature
                  </button>
                  <button
                    onClick={() => setShowBackground("custom")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "custom" ? true : false,
                    })}
                    role="tab"
                    aria-selected={showBackground === "custom" ? true : false}
                    aria-controls={
                      showBackground === "custom" ? "background-tabpanel" : null
                    }
                    tabIndex={showBackground === "custom" ? null : "-1"}
                  >
                    Custom
                  </button>
                </div>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions*/}
                <div
                  className="setting-option wallpapers"
                  role="tabpanel"
                  id="background-tabpanel"
                  onKeyDown={(e) => {
                    if (
                      ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                    ) {
                      e.stopPropagation();
                    }
                  }}
                >
                  {showBackground === "colors" ? (
                    <>
                      <button
                        id="light-wallpaper"
                        className={classNames(
                          "wallpaper-button",
                          wallpaper === "light-wallpaper" ? "selected" : false,
                        )}
                        title="Light"
                        onClick={() => {
                          handleWallpaper("light-wallpaper");
                        }}
                      ></button>
                      <button
                        id="dark-wallpaper"
                        className={classNames(
                          "wallpaper-button",
                          wallpaper === "dark-wallpaper" ? "selected" : false,
                        )}
                        title="Dark"
                        onClick={() => {
                          handleWallpaper("dark-wallpaper");
                        }}
                      ></button>
                      <button
                        id="brown-wallpaper"
                        className={classNames(
                          "wallpaper-button",
                          wallpaper === "brown-wallpaper" ? "selected" : false,
                        )}
                        title="Brown"
                        onClick={() => {
                          handleWallpaper("brown-wallpaper");
                        }}
                      ></button>
                      <button
                        id="blue-wallpaper"
                        className={classNames(
                          "wallpaper-button",
                          wallpaper === "blue-wallpaper" ? "selected" : false,
                        )}
                        title="Blue"
                        onClick={() => {
                          handleWallpaper("blue-wallpaper");
                        }}
                      ></button>
                      <button
                        id="yellow-wallpaper"
                        className={classNames(
                          "wallpaper-button",
                          wallpaper === "yellow-wallpaper" ? "selected" : false,
                        )}
                        title="Yellow"
                        onClick={() => {
                          handleWallpaper("yellow-wallpaper");
                        }}
                      ></button>
                      <button
                        id="green-wallpaper"
                        className={classNames(
                          "wallpaper-button",
                          wallpaper === "green-wallpaper" ? "selected" : false,
                        )}
                        title="Green"
                        onClick={() => {
                          handleWallpaper("green-wallpaper");
                        }}
                      ></button>
                      <button
                        id="pink-wallpaper"
                        className={classNames(
                          "wallpaper-button",
                          wallpaper === "pink-wallpaper" ? "selected" : false,
                        )}
                        title="Pink"
                        onClick={() => {
                          handleWallpaper("pink-wallpaper");
                        }}
                      ></button>
                    </>
                  ) : showBackground === "custom" ? (
                    <>
                      <div className="custom-group">
                        {customColor ? (
                          <button
                            className={classNames(
                              "wallpaper-button",
                              wallpaper === "custom-color"
                                ? " selected"
                                : false,
                            )}
                            style={{
                              backgroundColor: customColor,
                            }}
                            title="Custom Color"
                            onClick={() => {
                              handleWallpaper("custom-color");
                            }}
                          ></button>
                        ) : (
                          <div className="wallpaper-button-transparent"></div>
                        )}
                        <button
                          className="btn defaultBtn custom"
                          ref={customColorRef}
                          onClick={() => setShowColorPicker(true)}
                        >
                          Choose Color
                        </button>
                        {showColorPicker && (
                          <ColorPicker
                            {...{
                              customColor,
                              handleCustomColor,
                              top:
                                customColorRef.current.offsetTop +
                                customColorRef.current.clientHeight +
                                4,
                              left: customColorRef.current.offsetLeft,
                              handleCloseColorPicker,
                            }}
                          />
                        )}
                      </div>
                      <div className="custom-group">
                        {customImage ? (
                          <button
                            id="custom-image"
                            className={classNames(
                              "wallpaper-button",
                              wallpaper === "custom-image"
                                ? " selected"
                                : false,
                            )}
                            style={{
                              backgroundSize: "contain",
                              backgroundImage: `url(${customImage})`,
                            }}
                            title="Custom Image"
                            onClick={() => {
                              handleWallpaper("custom-image");
                            }}
                          ></button>
                        ) : (
                          <div className="wallpaper-button-transparent"></div>
                        )}
                        <button
                          className="btn defaultBtn custom"
                          onClick={handleCustomImage}
                        >
                          Open Image
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {wallpapers
                        .filter(({ category }) => category === showBackground)
                        .map(({ id, title, thumbnail }) => (
                          <button
                            className={classNames(
                              "wallpaper-button",
                              wallpaper === id ? "selected" : false,
                            )}
                            style={{
                              backgroundSize: "contain",
                              backgroundImage: `url(${getImageUrl(thumbnail)})`,
                            }}
                            title={title}
                            onClick={() => {
                              handleWallpaper(id);
                            }}
                            key={title}
                          ></button>
                        ))}
                    </>
                  )}
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title" id="default-folder-title">
                    Default Folder
                  </div>
                  <div
                    className="setting-description"
                    id="default-folder-description"
                  >
                    Choose the folder used to display dials.
                  </div>
                </div>
                <div className="setting-option select">
                  <select
                    onChange={handleDefaultFolder}
                    value={defaultFolder}
                    className="input"
                    aria-labelledby="default-folder-title"
                    aria-describedby="default-folder-description"
                  >
                    {folders.map(({ id, title }) => (
                      <option value={id} key={id}>
                        {title}
                      </option>
                    ))}
                  </select>
                  <Arrow />
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title" id="color-scheme-title">
                    Color Scheme
                  </div>
                  <div
                    className="setting-description"
                    id="color-scheme-description"
                  >
                    Choose the colors used throughout Toolbar Dial. If this
                    option is set to &quot;Automatic&quot;, colors will change
                    based on the preference set for your device.
                  </div>
                </div>
                <div className="setting-option select">
                  <select
                    onChange={handleThemeOption}
                    value={themeOption}
                    className="input"
                    aria-labelledby="color-scheme-title"
                    aria-describedby="color-scheme-description"
                  >
                    {["Automatic", "Light", "Dark"].map((t) => (
                      <option
                        value={t === "Automatic" ? "System Theme" : t}
                        key={t}
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                  <Arrow />
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title" id="max-cols-title">
                    Maximum Columns
                  </div>
                  <div
                    className="setting-description"
                    id="max-cols-description"
                  >
                    Choose the maximum number of columns that will be displayed.
                  </div>
                </div>

                <div className="setting-option select">
                  <select
                    onChange={handleMaxColumns}
                    value={maxColumns}
                    className="input"
                    aria-labelledby="max-cols-title"
                    aria-describedby="max-cols-description"
                  >
                    {[
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                      "10",
                      "11",
                      "12",
                      "Unlimited",
                    ].map((n) => (
                      <option value={n} key={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <Arrow />
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title" id="open-new-tabs-title">
                    {" "}
                    Open in New Tab
                  </div>
                  <div
                    className="setting-description"
                    id="open-new-tabs-description"
                  >
                    All bookmarks will open in a new browser tab.
                  </div>
                </div>
                <div className="setting-option toggle">
                  <button
                    role="switch"
                    aria-checked={newTab}
                    aria-labelledby="open-new-tabs-title"
                    aria-describedby="open-new-tabs-description"
                    onClick={() => handleNewTab(!newTab)}
                    className="switch-root"
                    data-state={newTab ? "checked" : "unchecked"}
                  >
                    <span
                      data-state={newTab ? "checked" : "unchecked"}
                      className="switch-thumb"
                    ></span>
                  </button>
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title" id="switch-title-title">
                    Switch Title and URL
                  </div>
                  <div
                    className="setting-description"
                    id="switch-title-description"
                  >
                    The title will be displayed in the dial instead of the URL.
                  </div>
                </div>
                <div className="setting-option toggle">
                  <button
                    role="switch"
                    aria-checked={switchTitle}
                    aria-labelledby="switch-title-title"
                    aria-describedby="switch-title-description"
                    onClick={() => handleSwitchTitle(!switchTitle)}
                    className="switch-root"
                    data-state={switchTitle ? "checked" : "unchecked"}
                  >
                    <span
                      data-state={switchTitle ? "checked" : "unchecked"}
                      className="switch-thumb"
                    ></span>
                  </button>
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title" id="show-title-title">
                    Show Title
                  </div>
                  <div
                    className="setting-description"
                    id="show-title-description"
                  >
                    The title will be displayed beneath the dial.
                  </div>
                </div>
                <div className="setting-option toggle">
                  <button
                    role="switch"
                    aria-checked={showTitle}
                    aria-labelledby="show-title-title"
                    aria-describedby="show-title-description"
                    onClick={() => handleShowTitle(!showTitle)}
                    className="switch-root"
                    data-state={showTitle ? "checked" : "unchecked"}
                  >
                    <span
                      data-state={showTitle ? "checked" : "unchecked"}
                      className="switch-thumb"
                    ></span>
                  </button>
                </div>
              </div>
              {showTitle && (
                <div className="setting-wrapper setting-group">
                  <div className="setting-label">
                    <div className="setting-title" id="attach-title-title">
                      Attach Title to Dial
                    </div>
                    <div
                      className="setting-description"
                      id="attach-title-description"
                    >
                      The title will be attached to the dial.
                    </div>
                  </div>
                  <div className="setting-option toggle">
                    <button
                      role="switch"
                      aria-checked={attachTitle}
                      aria-labelledby="attach-title-title"
                      aria-describedby="attach-title-description"
                      onClick={() => handleAttachTitle(!attachTitle)}
                      className="switch-root"
                      data-state={attachTitle ? "checked" : "unchecked"}
                    >
                      <span
                        data-state={attachTitle ? "checked" : "unchecked"}
                        className="switch-thumb"
                      ></span>
                    </button>
                  </div>
                </div>
              )}
              <div className="setting-wrapper">
                <About />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
});
