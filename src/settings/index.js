import { useEffect, useRef, useState } from "react";
import { useOptions } from "useOptions";
import { styles } from "./styles.js";
import { useBookmarks } from "useBookmarks";
import { wallpapers } from "../wallpapers";
import { wallpaperStyles } from "../wallpapers/styles.js";
import { css } from "@emotion/css";
import { ColorPicker } from "./ColorPicker.js";
import { About } from "../bookmarks/About.js";

const userAgent = navigator.userAgent.toLowerCase();
const isMacOS = userAgent.includes("macintosh") ? true : false;
const isChrome = userAgent.includes("chrome") ? true : false;

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
    switchTitle,
    handleWallpaper,
    handleNewTab,
    handleDefaultFolder,
    handleMaxColumns,
    handleCustomColor,
    handleCustomImage,
    handleThemeOption,
    handleSwitchTitle,
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

  useEffect(() => {
    document.body.className =
      themeOption === "System Theme"
        ? colorScheme
        : themeOption === "Light"
        ? "color-scheme-light"
        : "color-scheme-dark";
  }, [themeOption, colorScheme]);

  function handleEscape(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      setShowColorPicker(false);
    }
  }

  const wallpapersList = (filter) =>
    wallpapers
      .filter(({ category }) => category === filter)
      .map(({ id, title, thumbnail }) => (
        <button
          className={[
            css`
              background-size: contain;
              background-image: url(${thumbnail});
            `,
            `wallpaper-button${wallpaper === id ? " selected" : ""}`,
          ].join(" ")}
          title={title}
          onClick={() => {
            handleWallpaper(id);
          }}
          key={title}
        ></button>
      ));

  return (
    <div
      className={[
        isChrome ? "chrome" : "firefox",
        isMacOS ? "mac" : "windows",
        styles,
        wallpaper,
        wallpaperStyles({ wallpaper, customColor, customImage }),
      ].join(" ")}
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
            <div className="settings-content" ref={focusRef} tabIndex="-1">
              <div className="setting-wrapper">
                <div className="setting-title background">Background</div>
                <div className="background-buttons">
                  <button
                    onClick={() => setShowBackground("colors")}
                    className={showBackground === "colors" ? "selected" : ""}
                  >
                    Colors
                  </button>
                  <button
                    onClick={() => setShowBackground("abstract")}
                    className={showBackground === "abstract" ? "selected" : ""}
                  >
                    Abstract
                  </button>
                  <button
                    onClick={() => setShowBackground("artistic")}
                    className={showBackground === "artistic" ? "selected" : ""}
                  >
                    Artistic
                  </button>
                  <button
                    onClick={() => setShowBackground("nature")}
                    className={showBackground === "nature" ? "selected" : ""}
                  >
                    Nature
                  </button>
                  <button
                    onClick={() => setShowBackground("custom")}
                    className={showBackground === "custom" ? "selected" : ""}
                  >
                    Custom
                  </button>
                </div>
                {showBackground === "colors" ? (
                  <div className="setting-option wallpapers colors">
                    <button
                      id="light-wallpaper"
                      className={`wallpaper-button${
                        wallpaper === "light-wallpaper" ? " selected" : ""
                      }`}
                      title="Light"
                      onClick={() => {
                        handleWallpaper("light-wallpaper");
                      }}
                    ></button>
                    <button
                      id="dark-wallpaper"
                      className={`wallpaper-button${
                        wallpaper === "dark-wallpaper" ? " selected" : ""
                      }`}
                      title="Dark"
                      onClick={() => {
                        handleWallpaper("dark-wallpaper");
                      }}
                    ></button>
                    <button
                      id="brown-wallpaper"
                      className={`wallpaper-button${
                        wallpaper === "brown-wallpaper" ? " selected" : ""
                      }`}
                      title="Brown"
                      onClick={() => {
                        handleWallpaper("brown-wallpaper");
                      }}
                    ></button>
                    <button
                      id="blue-wallpaper"
                      className={`wallpaper-button${
                        wallpaper === "blue-wallpaper" ? " selected" : ""
                      }`}
                      title="Blue"
                      onClick={() => {
                        handleWallpaper("blue-wallpaper");
                      }}
                    ></button>
                    <button
                      id="yellow-wallpaper"
                      className={`wallpaper-button${
                        wallpaper === "yellow-wallpaper" ? " selected" : ""
                      }`}
                      title="Yellow"
                      onClick={() => {
                        handleWallpaper("yellow-wallpaper");
                      }}
                    ></button>
                    <button
                      id="green-wallpaper"
                      className={`wallpaper-button${
                        wallpaper === "green-wallpaper" ? " selected" : ""
                      }`}
                      title="Green"
                      onClick={() => {
                        handleWallpaper("green-wallpaper");
                      }}
                    ></button>
                    <button
                      id="pink-wallpaper"
                      className={`wallpaper-button${
                        wallpaper === "pink-wallpaper" ? " selected" : ""
                      }`}
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
                          className={[
                            `wallpaper-button${
                              wallpaper === "custom-color" ? " selected" : ""
                            }`,
                            css`
                              background-color: ${customColor};
                            `,
                          ].join(" ")}
                          title="Custom Color"
                          onClick={() => {
                            handleWallpaper("custom-color");
                          }}
                        ></button>
                      ) : (
                        <div className="wallpaper-button-transparent"></div>
                      )}
                      <button
                        className="custom"
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
                          className={[
                            `wallpaper-button${
                              wallpaper === "custom-image" ? " selected" : ""
                            }`,
                            css`
                              background-size: contain;
                              background-image: url(${customImage});
                            `,
                          ].join(" ")}
                          title="Custom Image"
                          onClick={() => {
                            handleWallpaper("custom-image");
                          }}
                        ></button>
                      ) : (
                        <div className="wallpaper-button-transparent"></div>
                      )}
                      <button className="custom" onClick={handleCustomImage}>
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
                  <select onChange={handleDefaultFolder} value={defaultFolder}>
                    {folders.map(({ id, title }) => (
                      <option value={id}>{title}</option>
                    ))}
                  </select>
                  <span className="material-icons arrow_drop_down">
                    arrow_drop_down
                  </span>
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
                  <select onChange={handleThemeOption} value={themeOption}>
                    {["Automatic", "Light", "Dark"].map((t) => (
                      <option value={t === "Automatic" ? "System Theme" : t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="material-icons arrow_drop_down">
                    arrow_drop_down
                  </span>
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
                  <select onChange={handleMaxColumns} value={maxColumns}>
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
                  <span className="material-icons arrow_drop_down">
                    arrow_drop_down
                  </span>
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
                  <div className="setting-title">Use Name in Dial</div>
                  <div className="setting-description">
                    The name of the bookmark will be displayed instead of the
                    URL.
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
