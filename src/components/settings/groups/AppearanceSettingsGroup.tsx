import type { SettingsGroupProps } from "./settingsGroupUtils";

import { observer } from "mobx-react-lite";
import { useRef } from "react";

import { ColorPicker } from "#components/ColorPicker/ColorPicker";
import { CaretDown } from "#components/icons/CaretDown.tsx";
import { colorPicker } from "#stores/colorPicker";
import { settings } from "#stores/settings";
import {
  getId,
  getInitialWallpaperOrder,
  renderCustomColorButton,
  renderCustomImageButton,
  renderPlusIcon,
  renderWallpaperButton,
  renderWallpaperColorButton,
  renderWallpaperRadio,
  wallpaperColors,
} from "./settingsGroupUtils";

export const AppearanceSettingsGroup = observer(
  function AppearanceSettingsGroup({ idPrefix }: SettingsGroupProps) {
    const initialWallpaper = useRef(settings.wallpaper);
    const backgroundTitleId = getId(idPrefix, "background-title");
    const backgroundDescriptionId = getId(idPrefix, "background-description");
    const colorSchemeTitleId = getId(idPrefix, "color-scheme-title");
    const colorSchemeDescriptionId = getId(
      idPrefix,
      "color-scheme-description",
    );
    const wallpaperColorName = getId(idPrefix, "wallpaper-color");
    const wallpaperImageName = getId(idPrefix, "wallpaper-image");
    const { selectedWallpaper, remainingWallpapers } = getInitialWallpaperOrder(
      initialWallpaper.current,
    );
    const selectedWallpaperColor = wallpaperColors.find(
      ({ id }) => id === initialWallpaper.current,
    );
    const selectedCustomColor = settings.wallpaper === "custom-color";
    const selectedCustomImage = settings.wallpaper === "custom-image";

    return (
      <>
        <div className="setting-wrapper">
          <div className="setting-title" id={backgroundTitleId}>
            Background
          </div>
          <div className="setting-description" id={backgroundDescriptionId}>
            Pick a color or image — preset or custom.
          </div>
          <div className="wallpaper-picker-group">
            <div className="wallpaper-picker-heading">
              <h3 className="wallpaper-picker-title">Colors</h3>
            </div>
            <div
              className="setting-option wallpapers"
              aria-label="Background colors"
              aria-describedby={backgroundDescriptionId}
            >
              <button
                type="button"
                className="wallpaper-button wallpaper-action-button"
                onClick={colorPicker.openColorPicker}
              >
                {renderPlusIcon()}
                <span>Custom Color</span>
              </button>
              {selectedCustomColor &&
                renderCustomColorButton(idPrefix, wallpaperColorName)}
              {selectedWallpaperColor &&
                renderWallpaperColorButton(
                  selectedWallpaperColor,
                  idPrefix,
                  wallpaperColorName,
                )}
              {renderWallpaperRadio({
                id: "theme-wallpaper",
                idPrefix,
                label: `Select ${
                  settings.colorScheme === "color-scheme-dark"
                    ? "dark"
                    : "light"
                } theme background`,
                name: wallpaperColorName,
                title:
                  settings.colorScheme === "color-scheme-dark"
                    ? "Dark"
                    : "Light",
                className: "theme-wallpaper-button",
              })}
              {!selectedCustomColor &&
                renderCustomColorButton(idPrefix, wallpaperColorName)}
              {wallpaperColors
                .filter(({ id }) => id !== selectedWallpaperColor?.id)
                .map((color) =>
                  renderWallpaperColorButton(
                    color,
                    idPrefix,
                    wallpaperColorName,
                  ),
                )}
            </div>
          </div>
          <div className="wallpaper-picker-group">
            <div className="wallpaper-picker-heading">
              <h3 className="wallpaper-picker-title">Images</h3>
            </div>
            <div
              className="setting-option wallpapers"
              aria-label="Background images"
              aria-describedby={backgroundDescriptionId}
            >
              <button
                type="button"
                className="wallpaper-button wallpaper-action-button"
                onClick={settings.handleCustomImage}
              >
                {renderPlusIcon()}
                <span>Select Image</span>
              </button>
              {selectedCustomImage &&
                renderCustomImageButton(idPrefix, wallpaperImageName)}
              {selectedWallpaper &&
                renderWallpaperButton(
                  selectedWallpaper,
                  idPrefix,
                  wallpaperImageName,
                )}
              {remainingWallpapers.map((wallpaper) =>
                renderWallpaperButton(wallpaper, idPrefix, wallpaperImageName),
              )}
              {!selectedCustomImage &&
                renderCustomImageButton(idPrefix, wallpaperImageName)}
            </div>
          </div>
          {colorPicker.isOpen && (
            <ColorPicker
              color={settings.customColor as string}
              handler={settings.handleCustomColor}
              label="Background Color"
            />
          )}
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={colorSchemeTitleId}>
              Color Scheme
            </div>
            <div className="setting-description" id={colorSchemeDescriptionId}>
              Use the light or dark theme. Auto follows your operating system.
            </div>
          </div>
          <div className="setting-option select">
            <select
              onChange={(e) => settings.handleThemeOption(e.target.value)}
              value={settings.themeOption as string}
              className="input"
              aria-labelledby={colorSchemeTitleId}
              aria-describedby={colorSchemeDescriptionId}
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
      </>
    );
  },
);
