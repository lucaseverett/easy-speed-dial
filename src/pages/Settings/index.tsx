import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import "./styles.css";

import { About } from "#components/About";
import CaretDown from "#components/CaretDown";
import { ColorPicker } from "#components/ColorPicker";
import { Switch } from "#components/Switch";
import { Tab, TabList, TabPanel, Tabs } from "#components/Tabs";
import { wallpapers } from "#lib/wallpapers";
import { bookmarks } from "#stores/useBookmarks";
import { colorPicker } from "#stores/useColorPicker";
import { settings } from "#stores/useSettings";

export const Settings = observer(function Settings() {
  const {
    handleAttachTitle,
    handleCustomColor,
    handleCustomImage,
    handleDefaultFolder,
    handleDialSize,
    handleMaxColumns,
    handleNewTab,
    handleShowTitle,
    handleSquareDials,
    handleSwitchTitle,
    handleThemeOption,
    handleWallpaper,
    resetCustomImage,
    resetSettings,
    restoreFromJSON,
    saveToJSON,
  } = settings;

  const focusRef = useRef();

  const [selectedTab, setSelectedTab] = useState("");
  const [defaultFolderValue, setDefaultFolderValue] = useState("");
  const wallpaperCategories = [
    "Colors",
    "Abstract",
    "Artistic",
    "Nature",
    "Custom",
  ];
  const wallpaperColors = [
    "Light",
    "Dark",
    "Brown",
    "Blue",
    "Yellow",
    "Green",
    "Pink",
  ];

  function getWallpaperCategory(wallpaperId) {
    if (wallpaperId.includes("wallpaper")) return "Colors";
    if (wallpaperId.includes("custom")) return "Custom";
    return wallpapers.find(({ id }) => id === wallpaperId)?.category || "";
  }

  useEffect(() => {
    focusRef.current.focus();
  }, []);

  useEffect(() => {
    setSelectedTab(getWallpaperCategory(settings.wallpaper));
  }, [settings.wallpaper]);

  useEffect(() => {
    const setDefaultFolder = async () => {
      const isValid = settings.defaultFolder
        ? await bookmarks.validateFolderExists(settings.defaultFolder)
        : false;
      const value = isValid
        ? settings.defaultFolder
        : await bookmarks.getBookmarksBarId();
      setDefaultFolderValue(value);
    };
    setDefaultFolder();
  }, [settings.defaultFolder]);

  function getImageUrl(thumbnail) {
    return new URL(`/src/assets/wallpaper-thumbs/${thumbnail}`, import.meta.url)
      .href;
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
          <h1 tabIndex="-1" ref={focusRef}>
            Settings
          </h1>
          <div className="settings-content scrollbars">
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
              <Tabs
                {...{
                  selectedTab,
                  setSelectedTab,
                }}
              >
                <TabList
                  className="background-buttons"
                  aria-labelledby="background-tablist-title"
                  aria-describedby="background-tablist-description"
                >
                  {wallpaperCategories.map((category) => (
                    <Tab
                      id={`${category}-tab`}
                      className="btn defaultBtn"
                      value={category}
                      key={category}
                    >
                      {category}
                    </Tab>
                  ))}
                </TabList>
                {wallpaperCategories.map((color) => (
                  <TabPanel
                    className="setting-option wallpapers"
                    id={`${color}-tabpanel`}
                    value={color}
                    key={color}
                  >
                    {selectedTab === "Colors" ? (
                      wallpaperColors.map((wallpaper) => (
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
                            handleWallpaper(
                              `${wallpaper.toLowerCase()}-wallpaper`,
                            );
                          }}
                          key={wallpaper}
                        />
                      ))
                    ) : selectedTab === "Custom" ? (
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
                        .filter(({ category }) => category === selectedTab)
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
                  </TabPanel>
                ))}
              </Tabs>
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
                  Select the bookmark folder used to display your speed dials.
                </div>
              </div>
              <div className="setting-option select">
                <select
                  onChange={(e) => handleDefaultFolder(e.target.value)}
                  value={defaultFolderValue}
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
                <CaretDown />
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
                  Choose the color scheme for Easy Speed Dial. If set to
                  &quot;Automatic,&quot; it will follow your system&apos;s light
                  or dark mode preference.
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
                <CaretDown />
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
                  Open all bookmarks in a new browser tab instead of the current
                  one.
                </div>
              </div>
              <div className="setting-option toggle">
                <Switch
                  aria-labelledby="open-new-tabs-title"
                  aria-describedby="open-new-tabs-description"
                  onClick={() => handleNewTab(!settings.newTab)}
                  className="switch-root"
                  checked={settings.newTab}
                >
                  <span className="switch-thumb" />
                </Switch>
              </div>
            </div>
            <div className="setting-wrapper setting-group">
              <div className="setting-label">
                <div className="setting-title" id="max-cols-title">
                  Maximum Columns
                </div>
                <div className="setting-description" id="max-cols-description">
                  Choose the maximum number of columns to display based on your
                  screen size.
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
                <CaretDown />
              </div>
            </div>
            <div className="setting-wrapper setting-group">
              <div className="setting-label">
                <div className="setting-title" id="dial-size-title">
                  Dial Size
                </div>
                <div className="setting-description" id="dial-size-description">
                  Choose the size of the speed dial icons.
                </div>
              </div>
              <div className="setting-option select">
                <select
                  onChange={(e) => handleDialSize(e.target.value)}
                  value={settings.dialSize}
                  className="input"
                  aria-labelledby="dial-size-title"
                  aria-describedby="dial-size-description"
                >
                  {[
                    { label: "Tiny", value: "tiny" },
                    { label: "Small", value: "small" },
                    { label: "Medium", value: "medium" },
                    { label: "Large", value: "large" },
                    { label: "Huge", value: "huge" },
                    { label: "Scale to Fit", value: "scale" },
                  ].map(({ label, value }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <CaretDown />
              </div>
            </div>
            <div className="setting-wrapper setting-group">
              <div className="setting-label">
                <div className="setting-title" id="square-dials-title">
                  Square Dials
                </div>
                <div
                  className="setting-description"
                  id="square-dials-description"
                >
                  Make all dials square-shaped instead of rectangular.
                </div>
              </div>
              <div className="setting-option toggle">
                <Switch
                  aria-labelledby="square-dials-title"
                  aria-describedby="square-dials-description"
                  onClick={() => handleSquareDials(!settings.squareDials)}
                  className="switch-root"
                  checked={settings.squareDials}
                >
                  <span className="switch-thumb" />
                </Switch>
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
                  Display the bookmark&apos;s title below the dial.
                </div>
              </div>
              <div className="setting-option toggle">
                <Switch
                  aria-labelledby="show-title-title"
                  aria-describedby="show-title-description"
                  onClick={() => handleShowTitle(!settings.showTitle)}
                  className="switch-root"
                  checked={settings.showTitle}
                >
                  <span className="switch-thumb" />
                </Switch>
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
                  Show the bookmark&apos;s title in the dial instead of the URL.
                </div>
              </div>
              <div className="setting-option toggle">
                <Switch
                  aria-labelledby="switch-title-title"
                  aria-describedby="switch-title-description"
                  onClick={() => handleSwitchTitle(!settings.switchTitle)}
                  className="switch-root"
                  checked={settings.switchTitle}
                >
                  <span className="switch-thumb" />
                </Switch>
              </div>
            </div>
            <div className="setting-wrapper setting-group">
              <div className="setting-label">
                <div className="setting-title" id="attach-title-title">
                  Attach Title to Dial
                </div>
                <div
                  className="setting-description"
                  id="attach-title-description"
                >
                  Remove spacing between the title and dial, connecting them
                  directly.
                </div>
              </div>
              <div className="setting-option toggle">
                <Switch
                  aria-labelledby="attach-title-title"
                  aria-describedby="attach-title-description"
                  onClick={() => handleAttachTitle(!settings.attachTitle)}
                  className="switch-root"
                  checked={settings.attachTitle}
                >
                  <span className="switch-thumb" />
                </Switch>
              </div>
            </div>
            <div className="setting-wrapper setting-group">
              <div className="setting-label">
                <div className="setting-title" id="reset-backup-restore-title">
                  Backup and Restore
                </div>
                <div
                  className="setting-description"
                  id="reset-backup-restore-description"
                >
                  Save a file with all your settings, including custom
                  background image/color and dial images/colors. Restoring a
                  backup will replace your current settings.
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
                  Reset all settings to their defaults. Custom background
                  image/color and dial images/colors will be cleared. This
                  cannot be undone.
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
