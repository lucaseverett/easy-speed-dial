import { clsx } from "clsx/lite";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import "./styles.css";

import { About } from "#components/About";
import { ColorPicker } from "#components/ColorPicker";
import { CaretDown } from "#components/icons/CaretDown.tsx";
import { wallpapers } from "#lib/wallpapers";
import { bookmarks } from "#stores/useBookmarks";
import { colorPicker } from "#stores/useColorPicker";
import { settings } from "#stores/useSettings";
import { Switch } from "./Switch.tsx";

export const SettingsContent = observer(function SettingsContent() {
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
    handleTransparentDials,
    handleWallpaper,
    resetSettings,
    restoreFromJSON,
    saveToJSON,
  } = settings;

  const [defaultFolderValue, setDefaultFolderValue] = useState("");
  const wallpaperColors = [
    "Light",
    "Dark",
    "Brown",
    "Blue",
    "Yellow",
    "Green",
    "Pink",
  ];

  useEffect(() => {
    const setDefaultFolder = async () => {
      const isValid =
        settings.defaultFolder && typeof settings.defaultFolder === "string"
          ? await bookmarks.validateFolderExists(settings.defaultFolder)
          : false;
      const value = isValid
        ? settings.defaultFolder
        : await bookmarks.getBookmarksBarId();
      setDefaultFolderValue(value as string);
    };
    setDefaultFolder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.defaultFolder]);

  function getImageUrl(thumbnail: string) {
    return new URL(`/src/assets/wallpaper-thumbs/${thumbnail}`, import.meta.url)
      .href;
  }

  return (
    <>
      <div className="setting-wrapper">
        <div className="setting-title" id="background-title">
          Background
        </div>
        <div className="setting-description" id="background-description">
          Choose a background color or image.
        </div>
        <div className="setting-option wallpapers">
          {/* Color wallpapers */}
          {wallpaperColors.map((wallpaper) => (
            <button
              type="button"
              id={`${wallpaper.toLowerCase()}-wallpaper`}
              className={clsx(
                "wallpaper-button",
                settings.wallpaper === `${wallpaper.toLowerCase()}-wallpaper`
                  ? "selected"
                  : false,
              )}
              title={wallpaper}
              onClick={() => {
                handleWallpaper(`${wallpaper.toLowerCase()}-wallpaper`);
              }}
              key={wallpaper}
            />
          ))}
          {/* Image wallpapers from all categories */}
          {wallpapers.map(({ id, title, thumbnail }) => (
            <button
              type="button"
              className={clsx(
                "wallpaper-button",
                settings.wallpaper === id ? "selected" : false,
              )}
              style={{
                backgroundImage: `url(${getImageUrl(thumbnail)})`,
              }}
              title={title}
              onClick={() => {
                handleWallpaper(id);
              }}
              key={id}
            />
          ))}
          {/* Custom Color - only show if color is set */}
          {settings.customColor && (
            <button
              type="button"
              className={clsx(
                "wallpaper-button",
                settings.wallpaper === "custom-color" ? " selected" : false,
              )}
              style={{
                backgroundColor: settings.customColor as string,
              }}
              title="Custom Color"
              onClick={() => {
                handleWallpaper("custom-color");
              }}
            />
          )}
          {/* Custom Image - only show if image is set */}
          {settings.customImage && (
            <button
              type="button"
              id="custom-image"
              className={clsx(
                "wallpaper-button",
                settings.wallpaper === "custom-image" ? " selected" : false,
              )}
              style={{
                backgroundImage: `url(${settings.customImage})`,
              }}
              title="Custom Image"
              onClick={() => {
                handleWallpaper("custom-image");
              }}
            />
          )}
        </div>
        {/* Custom selection buttons */}
        <div className="custom-buttons">
          <button
            type="button"
            className="btn defaultBtn custom customColor"
            onClick={colorPicker.openColorPicker}
          >
            Select Color
          </button>
          <button
            type="button"
            className="btn defaultBtn custom"
            onClick={handleCustomImage}
          >
            Select Image
          </button>
        </div>
        {colorPicker.isOpen && (
          <ColorPicker
            {...{
              color: settings.customColor as string,
              handler: handleCustomColor,
              label: "Background Color",
            }}
          />
        )}
      </div>
      <div className="setting-wrapper setting-group">
        <div className="setting-label">
          <div className="setting-title" id="default-folder-title">
            Default Folder
          </div>
          <div className="setting-description" id="default-folder-description">
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
          <div className="setting-description" id="color-scheme-description">
            Choose the color scheme for Easy Speed Dial. If set to
            &quot;Automatic,&quot; it will follow your system&apos;s light or
            dark mode preference.
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
              <option value={t === "Automatic" ? "System Theme" : t} key={t}>
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
          <div className="setting-description" id="open-new-tabs-description">
            Open all bookmarks in a new browser tab instead of the current one.
          </div>
        </div>
        <div className="setting-option toggle">
          <Switch
            aria-labelledby="open-new-tabs-title"
            aria-describedby="open-new-tabs-description"
            onClick={() => handleNewTab(!settings.newTab)}
            className="switch-root"
            checked={settings.newTab as boolean}
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
            Choose the maximum number of columns to display based on your screen
            size.
          </div>
        </div>
        <div className="setting-option select">
          <select
            onChange={(e) => handleMaxColumns(e.target.value)}
            value={settings.maxColumns as string}
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
            value={settings.dialSize as string}
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
          <div className="setting-description" id="square-dials-description">
            Make all dials square-shaped instead of rectangular.
          </div>
        </div>
        <div className="setting-option toggle">
          <Switch
            aria-labelledby="square-dials-title"
            aria-describedby="square-dials-description"
            onClick={() => handleSquareDials(!settings.squareDials)}
            className="switch-root"
            checked={settings.squareDials as boolean}
          >
            <span className="switch-thumb" />
          </Switch>
        </div>
      </div>
      <div className="setting-wrapper setting-group">
        <div className="setting-label">
          <div className="setting-title" id="transparent-dials-title">
            Transparent Dials
          </div>
          <div
            className="setting-description"
            id="transparent-dials-description"
          >
            Make all dial backgrounds transparent to show the background image
            behind them.
          </div>
        </div>
        <div className="setting-option toggle">
          <Switch
            aria-labelledby="transparent-dials-title"
            aria-describedby="transparent-dials-description"
            onClick={() => handleTransparentDials(!settings.transparentDials)}
            className="switch-root"
            checked={settings.transparentDials as boolean}
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
          <div className="setting-description" id="show-title-description">
            Display the bookmark&apos;s title below the dial.
          </div>
        </div>
        <div className="setting-option toggle">
          <Switch
            aria-labelledby="show-title-title"
            aria-describedby="show-title-description"
            onClick={() => handleShowTitle(!settings.showTitle)}
            className="switch-root"
            checked={settings.showTitle as boolean}
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
          <div className="setting-description" id="switch-title-description">
            Show the bookmark&apos;s title in the dial instead of the URL.
          </div>
        </div>
        <div className="setting-option toggle">
          <Switch
            aria-labelledby="switch-title-title"
            aria-describedby="switch-title-description"
            onClick={() => handleSwitchTitle(!settings.switchTitle)}
            className="switch-root"
            checked={settings.switchTitle as boolean}
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
          <div className="setting-description" id="attach-title-description">
            Remove spacing between the title and dial, connecting them directly.
          </div>
        </div>
        <div className="setting-option toggle">
          <Switch
            aria-labelledby="attach-title-title"
            aria-describedby="attach-title-description"
            onClick={() => handleAttachTitle(!settings.attachTitle)}
            className="switch-root"
            checked={settings.attachTitle as boolean}
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
            Save a file with all your settings, including custom background
            image/color and dial images/colors. Restoring a backup will replace
            your current settings.
          </div>
        </div>
        <div className="setting-option backup-restore">
          <button type="button" className="btn defaultBtn" onClick={saveToJSON}>
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
            Reset all settings to their defaults. Custom background image/color
            and dial images/colors will be cleared. This cannot be undone.
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
    </>
  );
});
