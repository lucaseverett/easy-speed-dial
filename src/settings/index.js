import React, { useEffect } from "react";
import { useOptions } from "../hooks/useOptions.js";
import { styles } from "./styles.js";
import { useBookmarks } from "../hooks/useBookmarks.js";
import { wallpapers } from "../wallpapers";
import { wallpaperStyles } from "../wallpapers/styles.js";
import { css } from "emotion";

export const Settings = () => {
  const { folders } = useBookmarks();
  const {
    appearance,
    newTab,
    defaultFolder,
    wallpaper,
    smallerDials,
    fullWidth,
    handleAppearance,
    handleWallpaper,
    handleNewTab,
    handleSmallerDials,
    handleDefaultFolder,
    handleFullWidth
  } = useOptions();

  const homeURL = browser.runtime.getURL("dist/index.html");

  const wallpapersList = wallpapers.map(
    ({ id, title, appearance, filename }) => (
      <button
        className={[
          css`
            background-size: contain;
            background-image: url(${filename.split(".")[0]}_thumb.png);
          `,
          `wallpaper-button${wallpaper === id ? " selected" : ""}`
        ].join(" ")}
        title={`${title} Wallpaper`}
        onClick={() => {
          handleAppearance(appearance);
          handleWallpaper(id);
        }}
        key={title}
      ></button>
    )
  );

  return (
    <div
      className={[
        styles,
        appearance,
        wallpaper,
        wallpaperStyles(wallpaper)
      ].join(" ")}
    >
      <div className="options-background">
        <div id="options">
          <header>
            <h1>Toolbar Dial - Settings</h1>
          </header>
          <main>
            <div className="setting-wrapper">
              <h2>Wallpapers</h2>
              <div className="setting-option wallpapers">
                <button
                  id="light-wallpaper"
                  className={`wallpaper-button${
                    wallpaper === "light-wallpaper" ? " selected" : ""
                  }`}
                  title="Light Wallpaper"
                  onClick={() => {
                    handleAppearance("light-appearance");
                    handleWallpaper("light-wallpaper");
                  }}
                ></button>
                <button
                  id="dark-wallpaper"
                  className={`wallpaper-button${
                    wallpaper === "dark-wallpaper" ? " selected" : ""
                  }`}
                  title="Dark Wallpaper"
                  onClick={() => {
                    handleAppearance("dark-appearance");
                    handleWallpaper("dark-wallpaper");
                  }}
                ></button>
                {wallpapersList}
              </div>
            </div>
            <div className="setting-wrapper">
              <h2>Default Folder</h2>
              <div className="setting-option folder">
                <select id="selectFolder" onChange={handleDefaultFolder}>
                  {folders.map(({ id, title }) => (
                    <option
                      value={id}
                      selected={id === defaultFolder ? true : false}
                    >
                      {title}
                    </option>
                  ))}
                </select>
                <i className="fas fa-caret-down"></i>
              </div>
            </div>
            <div className="setting-wrapper">
              <h2>Dial Options</h2>
              <div className="setting-group">
                <div className="setting-label">Open bookmarks in new tab</div>
                <div className="setting-option">
                  <label className="switch-wrap">
                    <input
                      type="checkbox"
                      id="folderTarget"
                      value="new-tab"
                      checked={newTab}
                      onChange={() => handleNewTab(!newTab)}
                    />
                    <div className="switch"></div>
                  </label>
                </div>
              </div>
              <div className="setting-group">
                <div className="setting-label">Use full page width</div>
                <div className="setting-option">
                  <label className="switch-wrap">
                    <input
                      type="checkbox"
                      id="fullWidth"
                      value="full-width"
                      checked={fullWidth}
                      onChange={() => handleFullWidth(!fullWidth)}
                    />
                    <div className="switch"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="setting-wrapper">
              <h2>Homepage</h2>
              <div className="setting-description">
                The following URL can been used for the browser's homepage.{" "}
                <span
                  className={css`
                    margin-top: 10px;
                    display: block;
                  `}
                >
                  <a href={homeURL}>{homeURL}</a>
                </span>
              </div>
            </div>
            <div className="setting-wrapper">
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
                . Please report any bugs or issues to the{" "}
                <a
                  href="https://github.com/lucaseverett/toolbar-dial-firefox/"
                  rel="noopener"
                  target="_blank"
                >
                  GitHub repository
                </a>
                .
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
