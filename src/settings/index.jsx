import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import "./styles.css";
import "../styles/inputs.css";
import "../styles/buttons.css";
import "../styles/wallpapers.css";
import { useOptions } from "useOptions";
import { useBookmarks } from "useBookmarks";
import { wallpapers } from "../wallpapers";
import { ColorPicker } from "./ColorPicker.jsx";
import { About } from "../bookmarks/AboutModal/About.jsx";

const userAgent = navigator.userAgent.toLowerCase();
const isMacOS = userAgent.includes("macintosh") ? true : false;
const isChrome = userAgent.includes("chrome") ? true : false;

const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="arrow">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M7 10l5 5 5-5H7z" />
  </svg>
);

export const Settings = () => {
  const { folders } = useBookmarks();
  const {
    newTab,
    defaultFolder,
    colorScheme,
    wallpaper,
    customColor,
    customImage,
    themeOption,
    maxColumns,
    showTitle,
    switchTitle,
    attachTitle,
    handleWallpaper,
    handleNewTab,
    handleDefaultFolder,
    handleMaxColumns,
    handleCustomColor,
    handleCustomImage,
    handleThemeOption,
    handleShowTitle,
    handleSwitchTitle,
    handleAttachTitle,
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
          : wallpapers.filter(({ id }) => id === wallpaper)[0].category
      );
    }
  }, [wallpaper]);

  function handleEscape(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      setShowColorPicker(false);
    }
  }

  function getImageUrl(thumbnail) {
    return new URL(`../thumbs/${thumbnail}`, import.meta.url).href;
  }

  const wallpapersList = (filter) =>
    wallpapers
      .filter(({ category }) => category === filter)
      .map(({ id, title, thumbnail }) => (
        <button
          className={classNames(
            "wallpaper-button",
            wallpaper === id ? "selected" : false
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
      ));

  return (
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
        "Wallpapers"
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
      onMouseDown={() => {
        setShowColorPicker(false);
      }}
      onKeyDown={handleEscape}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
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
                <div className="setting-title background">Background</div>
                <div className="background-buttons">
                  <button
                    onClick={() => setShowBackground("colors")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "colors" ? true : false,
                    })}
                  >
                    Colors
                  </button>
                  <button
                    onClick={() => setShowBackground("abstract")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "abstract" ? true : false,
                    })}
                  >
                    Abstract
                  </button>
                  <button
                    onClick={() => setShowBackground("artistic")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "artistic" ? true : false,
                    })}
                  >
                    Artistic
                  </button>
                  <button
                    onClick={() => setShowBackground("nature")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "nature" ? true : false,
                    })}
                  >
                    Nature
                  </button>
                  <button
                    onClick={() => setShowBackground("custom")}
                    className={classNames("btn defaultBtn", {
                      selected: showBackground === "custom" ? true : false,
                    })}
                  >
                    Custom
                  </button>
                </div>
                {showBackground === "colors" ? (
                  <div className="setting-option wallpapers colors">
                    <button
                      id="light-wallpaper"
                      className={classNames(
                        "wallpaper-button",
                        wallpaper === "light-wallpaper" ? "selected" : false
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
                        wallpaper === "dark-wallpaper" ? "selected" : false
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
                        wallpaper === "brown-wallpaper" ? "selected" : false
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
                        wallpaper === "blue-wallpaper" ? "selected" : false
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
                        wallpaper === "yellow-wallpaper" ? "selected" : false
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
                        wallpaper === "green-wallpaper" ? "selected" : false
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
                        wallpaper === "pink-wallpaper" ? "selected" : false
                      )}
                      title="Pink"
                      onClick={() => {
                        handleWallpaper("pink-wallpaper");
                      }}
                    ></button>
                  </div>
                ) : showBackground === "custom" ? (
                  <div className="setting-option wallpapers">
                    <div className="custom-group">
                      {customColor ? (
                        <button
                          className={classNames(
                            "wallpaper-button",
                            wallpaper === "custom-color" ? " selected" : false
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
                    </div>
                    <div className="custom-group">
                      {customImage ? (
                        <button
                          id="custom-image"
                          className={classNames(
                            "wallpaper-button",
                            wallpaper === "custom-image" ? " selected" : false
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
                    {showColorPicker && (
                      <ColorPicker
                        {...{
                          customColor,
                          handleCustomColor,
                          top: customColorRef.current.getBoundingClientRect()
                            .bottom,
                          left: customColorRef.current.getBoundingClientRect()
                            .left,
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="setting-option wallpapers">
                    {wallpapersList(showBackground)}
                  </div>
                )}
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title">Default Folder</div>
                  <div className="setting-description">
                    Choose the folder used to display dials.
                  </div>
                </div>
                <div className="setting-option select">
                  <select
                    onChange={handleDefaultFolder}
                    value={defaultFolder}
                    className="input"
                  >
                    {folders.map(({ id, title }) => (
                      <option value={id}>{title}</option>
                    ))}
                  </select>
                  <Arrow />
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title">Color Scheme</div>
                  <div className="setting-description">
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
                  >
                    {["Automatic", "Light", "Dark"].map((t) => (
                      <option value={t === "Automatic" ? "System Theme" : t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <Arrow />
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title">Maximum Columns</div>
                  <div className="setting-description">
                    Choose the maximum number of columns that will be displayed.
                  </div>
                </div>

                <div className="setting-option select">
                  <select
                    onChange={handleMaxColumns}
                    value={maxColumns}
                    className="input"
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
                      <option value={n}>{n}</option>
                    ))}
                  </select>
                  <Arrow />
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title"> Open in New Tab</div>
                  <div className="setting-description">
                    All bookmarks will open in a new browser tab.
                  </div>
                </div>
                <div className="setting-option toggle">
                  <label className="switch-wrap">
                    <input
                      type="checkbox"
                      checked={newTab}
                      onChange={() => handleNewTab(!newTab)}
                    />
                    <div className="switch"></div>
                  </label>
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title">Switch Title and URL</div>
                  <div className="setting-description">
                    The title will be displayed in the dial instead of the URL.
                  </div>
                </div>
                <div className="setting-option toggle">
                  <label className="switch-wrap">
                    <input
                      type="checkbox"
                      checked={switchTitle}
                      onChange={() => handleSwitchTitle(!switchTitle)}
                    />
                    <div className="switch"></div>
                  </label>
                </div>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title">Show Title</div>
                  <div className="setting-description">
                    The title will be displayed beneath the dial.
                  </div>
                </div>
                <div className="setting-option toggle">
                  <label className="switch-wrap">
                    <input
                      type="checkbox"
                      checked={showTitle}
                      onChange={() => handleShowTitle(!showTitle)}
                    />
                    <div className="switch"></div>
                  </label>
                </div>
              </div>
              {showTitle && (
                <div className="setting-wrapper setting-group">
                  <div className="setting-label">
                    <div className="setting-title">Attach Title to Dial</div>
                    <div className="setting-description">
                      The title will be attached to the dial.
                    </div>
                  </div>
                  <div className="setting-option toggle">
                    <label className="switch-wrap">
                      <input
                        type="checkbox"
                        checked={attachTitle}
                        onChange={() => handleAttachTitle(!attachTitle)}
                      />
                      <div className="switch"></div>
                    </label>
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
};
