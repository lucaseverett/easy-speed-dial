import { useEffect, useRef, useState } from "react";
import { useOptions } from "useOptions";
import { styles } from "./styles.js";
import { useBookmarks } from "useBookmarks";
import { wallpapers } from "../wallpapers";
import { wallpaperStyles } from "../wallpapers/styles.js";
import { css } from "@emotion/css";
import { ColorPicker } from "./ColorPicker.js";

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

  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    document.title = "Toolbar Dial - Options";
    focusRef.current.focus();
  }, []);

  const wallpapersList = wallpapers.map(({ id, title, thumbnail }) => (
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
        themeOption === "System Theme"
          ? colorScheme
          : themeOption === "Light"
          ? "color-scheme-light"
          : "color-scheme-dark",
        isChrome ? "chrome" : "firefox",
        isMacOS ? "mac" : "windows",
        styles,
        wallpaper,
        wallpaperStyles({ wallpaper, customColor, customImage }),
      ].join(" ")}
      onMouseDown={() => {
        setShowColorPicker(false);
      }}
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
                <div className="setting-title">Background</div>
                <div className="background-types">
                  <button>Colors</button>
                  <button>Abstract</button>
                  <button>Animals</button>
                  <button>Artistic</button>
                  <button>Nature</button>
                  <button>Custom</button>
                </div>
                <div className="setting-option wallpapers">
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
                  {customColor && (
                    <button
                      className={[
                        `wallpaper-button${
                          wallpaper === "custom-color" ? " selected" : ""
                        }`,
                        css`
                          background-color: ${customColor};
                        `,
                      ].join(" ")}
                      title="Custom"
                      onClick={() => {
                        handleWallpaper("custom-color");
                      }}
                    ></button>
                  )}
                </div>
                <button
                  className="custom"
                  ref={customColorRef}
                  onClick={() => setShowColorPicker(true)}
                >
                  Custom Color
                </button>
                {showColorPicker && (
                  <ColorPicker
                    {...{
                      customColor,
                      handleCustomColor,
                      top: customColorRef.current.getBoundingClientRect()
                        .bottom,
                      left: customColorRef.current.getBoundingClientRect().left,
                    }}
                  />
                )}
              </div>
              <div className="setting-wrapper">
                <div className="setting-option wallpapers">
                  {wallpapersList}
                  {customImage && (
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
                      title="Custom"
                      onClick={() => {
                        handleWallpaper("custom-image");
                      }}
                    ></button>
                  )}
                </div>
                <div className="wallpaper-credit">
                  Photo Credit: <a href="#">Name of artist</a>
                </div>
                <button className="custom" onClick={handleCustomImage}>
                  Custom Image
                </button>
              </div>
              <div className="setting-wrapper setting-group">
                <div className="setting-label">
                  <div className="setting-title">Default Folder</div>
                  <div className="setting-description">
                    Choose what folder is used to display dials.
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
                  <div className="setting-title">Theme</div>
                  <div className="setting-description">
                    Choose the colors used throughout Toolbar Dial. If this
                    option is set to &quot;System Theme&quot;, colors will
                    change based on the preference set for your computer.
                  </div>
                </div>
                <div className="setting-option select">
                  <select onChange={handleThemeOption} value={themeOption}>
                    {["System Theme", "Light", "Dark"].map((t) => (
                      <option value={t}>{t}</option>
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
                <div className="setting-option">
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
                  <div className="setting-title">Use Title in Dial</div>
                  <div className="setting-description">
                    Display the title of the bookmark instead of the URL in
                    dial.
                  </div>
                </div>
                <div className="setting-option">
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
                <div className="setting-title">About Toolbar Dial</div>
                <div className="setting-description">
                  <a
                    href="https://toolbardial.com/"
                    rel="noopener"
                    target="_blank"
                  >
                    Toolbar Dial
                  </a>{" "}
                  was created by{" "}
                  <a
                    href="https://lucaseverett.dev/"
                    rel="noopener"
                    target="_blank"
                  >
                    Lucas Everett
                  </a>
                  .<br />
                  <br />
                  Please report any bugs or issues to the{" "}
                  <a
                    href="https://github.com/lucaseverett/toolbar-dial"
                    rel="noopener"
                    target="_blank"
                  >
                    GitHub repository
                  </a>
                  .
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
