import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import "./styles.css";

import { About } from "#Bookmarks/About";
import { ColorPicker } from "#common/ColorPicker";
import { bookmarks } from "#stores/useBookmarks";
import { colorPicker } from "#stores/useColorPicker";
import { settings } from "#stores/useSettings";
import { wallpapers } from "#wallpapers";

function Arrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="arrow"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

export const Settings = observer(function Settings() {
  const {
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
    resetCustomImage,
    resetSettings,
    restoreFromJSON,
    saveToJSON,
  } = settings;

  const focusRef = useRef();
  const buttons = useRef();

  const [selectedCategory, setSelectedCategory] = useState("");
  const wallpaperCategories = [
    "Colors",
    "Abstract",
    "Artistic",
    "Nature",
    "Custom",
  ];

  function getWallpaperCategory(wallpaperId) {
    if (wallpaperId.includes("wallpaper")) return "Colors";
    if (wallpaperId.includes("custom")) return "Custom";
    return wallpapers.find(({ id }) => id === wallpaperId)?.category || "";
  }

  useEffect(() => {
    focusRef.current.focus();
    buttons.current = [
      ...document.querySelectorAll(".background-buttons button"),
    ];
  }, []);

  useEffect(() => {
    setSelectedCategory(getWallpaperCategory(settings.wallpaper));
  }, [settings.wallpaper]);

  function getImageUrl(thumbnail) {
    return new URL(`../wallpapers/thumbs/${thumbnail}`, import.meta.url).href;
  }

  function handleKeyDown(e) {
    const currIndex = wallpaperCategories.indexOf(selectedCategory);
    const isFirstItem = currIndex === 0;
    const isLastItem = currIndex === wallpaperCategories.length - 1;

    const focus = {
      firstItem: () => {
        setSelectedCategory(wallpaperCategories[0]);
        buttons.current[0].focus();
      },
      lastItem: () => {
        const newIndex = wallpaperCategories.length - 1;
        setSelectedCategory(wallpaperCategories[newIndex]);
        buttons.current[newIndex].focus();
      },
      previousItem: () => {
        const newIndex = isFirstItem
          ? wallpaperCategories.length - 1
          : currIndex - 1;
        setSelectedCategory(wallpaperCategories[newIndex]);
        buttons.current[newIndex].focus();
      },
      nextItem: () => {
        const newIndex = isLastItem ? 0 : currIndex + 1;
        setSelectedCategory(wallpaperCategories[newIndex]);
        buttons.current[newIndex].focus();
      },
    };

    const keys = {
      ArrowLeft: () => {
        e.preventDefault();
        e.stopPropagation();
        focus.previousItem();
      },
      ArrowRight: () => {
        e.preventDefault();
        e.stopPropagation();
        focus.nextItem();
      },
      Home: () => {
        e.preventDefault();
        e.stopPropagation();
        focus.firstItem();
      },
      End: () => {
        e.preventDefault();
        e.stopPropagation();
        focus.lastItem();
      },
    };

    if (keys[e.key]) {
      keys[e.key]();
    }
  }

  return (
    <div
      onMouseDown={colorPicker.closeColorPicker}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="Options"
    >
      <div className="options-wrapper">
        <div
          className="options-content"
          onContextMenu={(e) => {
            e.stopPropagation();
          }}
        >
          <h1>Settings</h1>
          <div
            className="settings-content scrollbars"
            tabIndex="-1"
            ref={focusRef}
          >
            <div className="setting-wrapper">
              <div className="setting-title" id="background-tablist-title">
                Background
              </div>
              <div
                className="setting-description"
                id="background-tablist-description"
              >
                Choose a background color or image.
              </div>
              <div
                className="background-buttons"
                role="tablist"
                aria-labelledby="background-tablist-title"
                aria-describedby="background-tablist-description"
                onKeyDown={handleKeyDown}
              >
                {wallpaperCategories.map((category) => (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={classNames("btn defaultBtn", {
                      selected: selectedCategory === category,
                    })}
                    role="tab"
                    aria-selected={selectedCategory === category}
                    aria-controls={
                      selectedCategory === category
                        ? "background-tabpanel"
                        : null
                    }
                    tabIndex={selectedCategory === category ? null : "-1"}
                    key={category}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div
                className="setting-option wallpapers"
                role="tabpanel"
                id="background-tabpanel"
              >
                {selectedCategory === "Colors" ? (
                  [
                    "Light",
                    "Dark",
                    "Brown",
                    "Blue",
                    "Yellow",
                    "Green",
                    "Pink",
                  ].map((wallpaper) => (
                    <button
                      type="button"
                      id={`${wallpaper.toLowerCase()}-wallpaper`}
                      className={classNames(
                        "wallpaper-button",
                        settings.wallpaper ===
                          `${wallpaper.toLowerCase()}-wallpaper`
                          ? "selected"
                          : false,
                      )}
                      title={wallpaper}
                      onClick={() => {
                        handleWallpaper(`${wallpaper.toLowerCase()}-wallpaper`);
                      }}
                      key={wallpaper}
                    />
                  ))
                ) : selectedCategory === "Custom" ? (
                  <>
                    <div className="custom-group">
                      {settings.customColor ? (
                        <button
                          type="button"
                          className={classNames(
                            "wallpaper-button",
                            settings.wallpaper === "custom-color"
                              ? " selected"
                              : false,
                          )}
                          style={{
                            backgroundColor: settings.customColor,
                          }}
                          title="Custom Color"
                          onClick={() => {
                            handleWallpaper("custom-color");
                          }}
                        />
                      ) : (
                        <div className="wallpaper-button-transparent" />
                      )}
                      <button
                        type="button"
                        className="btn defaultBtn custom customColor"
                        onClick={colorPicker.openColorPicker}
                      >
                        Select Color
                      </button>
                      {colorPicker.isOpen && (
                        <ColorPicker
                          {...{
                            color: settings.customColor,
                            handler: handleCustomColor,
                            label: "Background Color",
                          }}
                        />
                      )}
                    </div>
                    <div className="custom-group">
                      {settings.customImage ? (
                        <>
                          <button
                            type="button"
                            id="custom-image"
                            className={classNames(
                              "wallpaper-button",
                              settings.wallpaper === "custom-image"
                                ? " selected"
                                : false,
                            )}
                            style={{
                              backgroundSize: "contain",
                              backgroundImage: `url(${settings.customImage})`,
                            }}
                            title="Custom Image"
                            onClick={() => {
                              handleWallpaper("custom-image");
                            }}
                          />
                          <button
                            type="button"
                            className="btn defaultBtn custom"
                            onClick={resetCustomImage}
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="wallpaper-button-transparent" />
                          <button
                            type="button"
                            className="btn defaultBtn custom"
                            onClick={handleCustomImage}
                          >
                            Select Image
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  wallpapers
                    .filter(({ category }) => category === selectedCategory)
                    .map(({ id, title, thumbnail }) => (
                      <button
                        type="button"
                        className={classNames(
                          "wallpaper-button",
                          settings.wallpaper === id ? "selected" : false,
                        )}
                        style={{
                          backgroundSize: "contain",
                          backgroundImage: `url(${getImageUrl(thumbnail)})`,
                        }}
                        title={title}
                        onClick={() => {
                          handleWallpaper(id);
                        }}
                        key={id}
                      />
                    ))
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
                  onChange={(e) => handleDefaultFolder(e.target.value)}
                  value={settings.defaultFolder}
                  className="input"
                  aria-labelledby="default-folder-title"
                  aria-describedby="default-folder-description"
                >
                  {bookmarks.folders.map(({ id, title }) => (
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
                  Choose the colors used throughout Easy Speed Dial. If you
                  select &quot;Automatic&quot;, colors will change based on the
                  preference set for your device.
                </div>
              </div>
              <div className="setting-option select">
                <select
                  onChange={(e) => handleThemeOption(e.target.value)}
                  value={settings.themeOption}
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
                <div className="setting-description" id="max-cols-description">
                  Choose the maximum number of columns that will be displayed.
                </div>
              </div>

              <div className="setting-option select">
                <select
                  onChange={(e) => handleMaxColumns(e.target.value)}
                  value={settings.maxColumns}
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
                  type="button"
                  role="switch"
                  aria-checked={settings.newTab}
                  aria-labelledby="open-new-tabs-title"
                  aria-describedby="open-new-tabs-description"
                  onClick={() => handleNewTab(!settings.newTab)}
                  className="switch-root"
                  data-state={settings.newTab ? "checked" : "unchecked"}
                >
                  <span
                    data-state={settings.newTab ? "checked" : "unchecked"}
                    className="switch-thumb"
                  />
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
                  type="button"
                  role="switch"
                  aria-checked={settings.switchTitle}
                  aria-labelledby="switch-title-title"
                  aria-describedby="switch-title-description"
                  onClick={() => handleSwitchTitle(!settings.switchTitle)}
                  className="switch-root"
                  data-state={settings.switchTitle ? "checked" : "unchecked"}
                >
                  <span
                    data-state={settings.switchTitle ? "checked" : "unchecked"}
                    className="switch-thumb"
                  />
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
                  type="button"
                  role="switch"
                  aria-checked={settings.showTitle}
                  aria-labelledby="show-title-title"
                  aria-describedby="show-title-description"
                  onClick={() => handleShowTitle(!settings.showTitle)}
                  className="switch-root"
                  data-state={settings.showTitle ? "checked" : "unchecked"}
                >
                  <span
                    data-state={settings.showTitle ? "checked" : "unchecked"}
                    className="switch-thumb"
                  />
                </button>
              </div>
            </div>
            {settings.showTitle && (
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
                    type="button"
                    role="switch"
                    aria-checked={settings.attachTitle}
                    aria-labelledby="attach-title-title"
                    aria-describedby="attach-title-description"
                    onClick={() => handleAttachTitle(!settings.attachTitle)}
                    className="switch-root"
                    data-state={settings.attachTitle ? "checked" : "unchecked"}
                  >
                    <span
                      data-state={
                        settings.attachTitle ? "checked" : "unchecked"
                      }
                      className="switch-thumb"
                    />
                  </button>
                </div>
              </div>
            )}
            <div className="setting-wrapper setting-group">
              <div className="setting-label">
                <div className="setting-title" id="reset-backup-restore-title">
                  Backup and Restore
                </div>
                <div
                  className="setting-description"
                  id="reset-backup-restore-description"
                >
                  Save a file containing all of your settings. Your custom
                  background image, custom background color, and custom dial
                  colors will be included. Restoring a backup will overwrite
                  your current settings.
                </div>
              </div>
              <div className="setting-option backup-restore">
                <button
                  type="button"
                  className="btn defaultBtn"
                  onClick={saveToJSON}
                >
                  Backup
                </button>
                <button
                  type="button"
                  className="btn defaultBtn"
                  onClick={restoreFromJSON}
                >
                  Restore
                </button>
              </div>
            </div>
            <div className="setting-wrapper setting-group">
              <div className="setting-label">
                <div className="setting-title" id="reset-backup-restore-title">
                  Reset Settings
                </div>
                <div
                  className="setting-description"
                  id="reset-backup-restore-description"
                >
                  This will reset all settings to their default values. Your
                  custom background image, custom background color, and custom
                  dial colors will be cleared. This action cannot be undone.
                </div>
              </div>
              <div className="setting-option reset">
                <button
                  type="button"
                  className="btn defaultBtn"
                  onClick={resetSettings}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="setting-wrapper about">
              <About />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
