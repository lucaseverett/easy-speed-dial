import { clsx } from "clsx/lite";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import { ColorPicker } from "#components/ColorPicker";
import { CaretDown } from "#components/icons/CaretDown.tsx";
import { themeWallpaperPairs, wallpapers } from "#lib/wallpapers";
import { bookmarks } from "#stores/useBookmarks";
import { colorPicker } from "#stores/useColorPicker";
import { settings } from "#stores/useSettings";
import { Switch } from "./Switch.tsx";

import "./styles.css";

const maxColumns = [
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
];

const dialSizes = [
  { label: "Tiny", value: "tiny" },
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "Huge", value: "huge" },
  { label: "Scale to Fit", value: "scale" },
];

const gridSpacings = [
  { label: "Compact", value: "compact" },
  { label: "Default", value: "default" },
  { label: "Spacious", value: "spacious" },
];

const wallpaperColors = [
  { id: "blue-wallpaper", title: "Blue" },
  { id: "brown-wallpaper", title: "Brown" },
  { id: "green-wallpaper", title: "Green" },
  { id: "pink-wallpaper", title: "Pink" },
  { id: "yellow-wallpaper", title: "Yellow" },
];

type Wallpaper = (typeof wallpapers)[number];
type ThemeWallpaperOption = (typeof themeWallpaperPairs)[number] & {
  imageId: string;
};
type WallpaperImageOption = Wallpaper | ThemeWallpaperOption;

interface SettingsGroupProps {
  idPrefix?: string;
}

function getId(prefix: string | undefined, id: string) {
  return prefix ? `${prefix}-${id}` : id;
}

function getImageUrl(thumbnail: string) {
  return new URL(`/src/assets/wallpaper-thumbs/${thumbnail}`, import.meta.url)
    .href;
}

function getWallpaperInputId(prefix: string | undefined, id: string) {
  return getId(prefix, `wallpaper-${id}`);
}

function getThemeWallpaperImageId(
  themeWallpaper: (typeof themeWallpaperPairs)[number],
) {
  return settings.colorScheme === "color-scheme-dark"
    ? themeWallpaper.dark
    : themeWallpaper.light;
}

function getWallpaperById(id: string) {
  return wallpapers.find((wallpaper) => wallpaper.id === id);
}

function getWallpaperOptionId(id: string) {
  return (
    themeWallpaperPairs.find(({ dark, light }) => id === light || id === dark)
      ?.id ?? id
  );
}

function getWallpaperImageOptions(): WallpaperImageOption[] {
  const themeWallpaperIds = new Set(
    themeWallpaperPairs.flatMap(({ dark, light }) => [dark, light]),
  );
  const wallpaperOptions: WallpaperImageOption[] = [];

  for (const wallpaper of wallpapers) {
    const themeWallpaper = themeWallpaperPairs.find(
      ({ light }) => wallpaper.id === light,
    );

    if (themeWallpaper) {
      wallpaperOptions.push({
        ...themeWallpaper,
        imageId: getThemeWallpaperImageId(themeWallpaper),
      });
    } else if (!themeWallpaperIds.has(wallpaper.id)) {
      wallpaperOptions.push(wallpaper);
    }
  }

  return wallpaperOptions;
}

function handleTitlePlacement(value: string) {
  settings.handleShowTitle(value !== "hidden");
  settings.handleAttachTitle(value === "attached");
}

function renderPlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="wallpaper-action-icon"
    >
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function getInitialWallpaperOrder(selectedWallpaperValue: unknown) {
  const wallpaperOptions = getWallpaperImageOptions();
  const selectedWallpaperId = getWallpaperOptionId(
    typeof selectedWallpaperValue === "string" ? selectedWallpaperValue : "",
  );
  const selectedIndex = wallpaperOptions.findIndex(
    ({ id }) => id === selectedWallpaperId,
  );

  if (selectedIndex === -1) {
    return {
      selectedWallpaper: undefined,
      remainingWallpapers: wallpaperOptions,
    };
  }

  const selected = wallpaperOptions[selectedIndex];

  return {
    selectedWallpaper: selected,
    remainingWallpapers: [
      ...wallpaperOptions.slice(0, selectedIndex),
      ...wallpaperOptions.slice(selectedIndex + 1),
    ],
  };
}

function renderWallpaperRadio({
  id,
  idPrefix,
  label,
  name,
  title,
  className,
  style,
}: {
  id: string;
  idPrefix: string | undefined;
  label: string;
  name: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const inputId = getWallpaperInputId(idPrefix, id);

  return (
    <div className="wallpaper-radio-option" key={id}>
      <input
        type="radio"
        id={inputId}
        name={name}
        className="wallpaper-radio"
        checked={settings.wallpaper === id}
        onChange={() => settings.handleWallpaper(id)}
      />
      <label
        htmlFor={inputId}
        className={clsx("wallpaper-button", className)}
        style={style}
        title={title}
      >
        <span className="wallpaper-radio-label">{label}</span>
      </label>
    </div>
  );
}

function renderWallpaperButton(
  wallpaper: WallpaperImageOption,
  idPrefix: string | undefined,
  name: string,
) {
  const imageWallpaper = getWallpaperById(
    "imageId" in wallpaper ? wallpaper.imageId : wallpaper.id,
  );
  if (!imageWallpaper) {
    return null;
  }

  const { id, title } = wallpaper;
  const { thumbnail } = imageWallpaper;

  return renderWallpaperRadio({
    id,
    idPrefix,
    label: `Select ${title} background image`,
    name,
    title,
    style: {
      backgroundImage: `url(${getImageUrl(thumbnail)})`,
    },
  });
}

function renderWallpaperColorButton(
  color: (typeof wallpaperColors)[number],
  idPrefix: string | undefined,
  name: string,
) {
  const { id, title } = color;

  return renderWallpaperRadio({
    id,
    idPrefix,
    label: `Select ${title} background color`,
    name,
    title,
    className: `${id}-button`,
  });
}

function renderCustomColorButton(idPrefix: string | undefined, name: string) {
  if (typeof settings.customColor !== "string" || !settings.customColor) {
    return null;
  }

  return renderWallpaperRadio({
    id: "custom-color",
    idPrefix,
    label: "Select custom background color",
    name,
    title: "Custom Color",
    style: {
      backgroundColor: settings.customColor as string,
    },
  });
}

function renderCustomImageButton(idPrefix: string | undefined, name: string) {
  if (!settings.customImage) {
    return null;
  }

  return renderWallpaperRadio({
    id: "custom-image",
    idPrefix,
    label: "Select custom background image",
    name,
    title: "Custom Image",
    style: {
      backgroundImage: `url(${settings.customImage})`,
    },
  });
}

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

export const BookmarkSettingsGroup = observer(function BookmarkSettingsGroup({
  idPrefix,
}: SettingsGroupProps) {
  const [defaultFolderValue, setDefaultFolderValue] = useState("");
  const defaultFolderTitleId = getId(idPrefix, "default-folder-title");
  const defaultFolderDescriptionId = getId(
    idPrefix,
    "default-folder-description",
  );
  const openNewTabsTitleId = getId(idPrefix, "open-new-tabs-title");
  const openNewTabsDescriptionId = getId(idPrefix, "open-new-tabs-description");

  useEffect(() => {
    let active = true;

    const setDefaultFolder = async () => {
      const isValid =
        settings.defaultFolder && typeof settings.defaultFolder === "string"
          ? await bookmarks.validateFolderExists(settings.defaultFolder)
          : false;
      const value = isValid
        ? settings.defaultFolder
        : await bookmarks.getBookmarksBarId();
      if (active) setDefaultFolderValue(value as string);
    };

    setDefaultFolder();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.defaultFolder]);

  return (
    <>
      <div className="setting-wrapper setting-group">
        <div className="setting-label">
          <div className="setting-title" id={defaultFolderTitleId}>
            Default Folder
          </div>
          <div className="setting-description" id={defaultFolderDescriptionId}>
            The bookmark folder that fills your speed dial.
          </div>
        </div>
        <div className="setting-option select">
          <select
            onChange={(e) => settings.handleDefaultFolder(e.target.value)}
            value={defaultFolderValue}
            className="input"
            aria-labelledby={defaultFolderTitleId}
            aria-describedby={defaultFolderDescriptionId}
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
          <div className="setting-title" id={openNewTabsTitleId}>
            Open in New Tab
          </div>
          <div className="setting-description" id={openNewTabsDescriptionId}>
            Clicking a dial opens the link in a new browser tab.
          </div>
        </div>
        <div className="setting-option toggle">
          <Switch
            aria-labelledby={openNewTabsTitleId}
            aria-describedby={openNewTabsDescriptionId}
            onClick={() => settings.handleNewTab(!settings.newTab)}
            className="switch-root"
            checked={settings.newTab as boolean}
          >
            <span className="switch-thumb" />
          </Switch>
        </div>
      </div>
    </>
  );
});

export const LayoutSettingsGroup = observer(function LayoutSettingsGroup({
  idPrefix,
}: SettingsGroupProps) {
  const maxColumnsTitleId = getId(idPrefix, "max-cols-title");
  const maxColumnsDescriptionId = getId(idPrefix, "max-cols-description");
  const gridSpacingTitleId = getId(idPrefix, "grid-spacing-title");
  const gridSpacingDescriptionId = getId(idPrefix, "grid-spacing-description");

  return (
    <>
      <div className="setting-wrapper setting-group">
        <div className="setting-label">
          <div className="setting-title" id={maxColumnsTitleId}>
            Maximum Columns
          </div>
          <div className="setting-description" id={maxColumnsDescriptionId}>
            Caps how wide the grid can grow on larger screens.
          </div>
        </div>
        <div className="setting-option select">
          <select
            onChange={(e) => settings.handleMaxColumns(e.target.value)}
            value={settings.maxColumns as string}
            className="input"
            aria-labelledby={maxColumnsTitleId}
            aria-describedby={maxColumnsDescriptionId}
          >
            {maxColumns.map((n) => (
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
          <div className="setting-title" id={gridSpacingTitleId}>
            Grid Spacing
          </div>
          <div className="setting-description" id={gridSpacingDescriptionId}>
            Space between dials. Smaller spacing leaves room for more.
          </div>
        </div>
        <div className="setting-option select">
          <select
            onChange={(e) => settings.handleGridSpacing(e.target.value)}
            value={settings.gridSpacing as string}
            className="input"
            aria-labelledby={gridSpacingTitleId}
            aria-describedby={gridSpacingDescriptionId}
          >
            {gridSpacings.map(({ label, value }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
          <CaretDown />
        </div>
      </div>
    </>
  );
});

export const DialAppearanceSettingsGroup = observer(
  function DialAppearanceSettingsGroup({ idPrefix }: SettingsGroupProps) {
    const dialSizeTitleId = getId(idPrefix, "dial-size-title");
    const dialSizeDescriptionId = getId(idPrefix, "dial-size-description");
    const dialShapeTitleId = getId(idPrefix, "dial-shape-title");
    const dialShapeDescriptionId = getId(idPrefix, "dial-shape-description");
    const titlePlacementTitleId = getId(idPrefix, "title-placement-title");
    const titlePlacementDescriptionId = getId(
      idPrefix,
      "title-placement-description",
    );
    const dialTextTitleId = getId(idPrefix, "dial-text-title");
    const dialTextDescriptionId = getId(idPrefix, "dial-text-description");
    const showDialBordersTitleId = getId(
      idPrefix,
      "show-dial-borders-title",
    );
    const showDialBordersDescriptionId = getId(
      idPrefix,
      "show-dial-borders-description",
    );
    const transparentDialsTitleId = getId(idPrefix, "transparent-dials-title");
    const transparentDialsDescriptionId = getId(
      idPrefix,
      "transparent-dials-description",
    );
    const usePresetThumbnailsTitleId = getId(
      idPrefix,
      "use-preset-thumbnails-title",
    );
    const usePresetThumbnailsDescriptionId = getId(
      idPrefix,
      "use-preset-thumbnails-description",
    );
    const titlePlacement = !settings.showTitle
      ? "hidden"
      : settings.attachTitle
        ? "attached"
        : "below";

    return (
      <>
        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={dialSizeTitleId}>
              Dial Size
            </div>
            <div className="setting-description" id={dialSizeDescriptionId}>
              Set a fixed size, or use Scale to Fit to fill the current column
              count.
            </div>
          </div>
          <div className="setting-option select">
            <select
              onChange={(e) => settings.handleDialSize(e.target.value)}
              value={settings.dialSize as string}
              className="input"
              aria-labelledby={dialSizeTitleId}
              aria-describedby={dialSizeDescriptionId}
            >
              {dialSizes.map(({ label, value }) => (
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
            <div className="setting-title" id={dialShapeTitleId}>
              Dial Shape
            </div>
            <div className="setting-description" id={dialShapeDescriptionId}>
              Show dials as rectangles or squares.
            </div>
          </div>
          <div className="setting-option select">
            <select
              onChange={(e) =>
                settings.handleSquareDials(e.target.value === "square")
              }
              value={settings.squareDials ? "square" : "rectangle"}
              className="input"
              aria-labelledby={dialShapeTitleId}
              aria-describedby={dialShapeDescriptionId}
            >
              <option value="rectangle">Rectangle</option>
              <option value="square">Square</option>
            </select>
            <CaretDown />
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={titlePlacementTitleId}>
              Title Placement
            </div>
            <div
              className="setting-description"
              id={titlePlacementDescriptionId}
            >
              Show the site name below the dial, attached to it, or hidden.
            </div>
          </div>
          <div className="setting-option select">
            <select
              onChange={(e) => handleTitlePlacement(e.target.value)}
              value={titlePlacement}
              className="input"
              aria-labelledby={titlePlacementTitleId}
              aria-describedby={titlePlacementDescriptionId}
            >
              <option value="below">Below dial</option>
              <option value="attached">Attached</option>
              <option value="hidden">Hidden</option>
            </select>
            <CaretDown />
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={dialTextTitleId}>
              Dial Text
            </div>
            <div className="setting-description" id={dialTextDescriptionId}>
              Sets the text shown inside each dial.
            </div>
          </div>
          <div className="setting-option select">
            <select
              onChange={(e) =>
                settings.handleSwitchTitle(e.target.value === "name")
              }
              value={settings.switchTitle ? "name" : "url"}
              className="input"
              aria-labelledby={dialTextTitleId}
              aria-describedby={dialTextDescriptionId}
            >
              <option value="url">URL</option>
              <option value="name">Name</option>
            </select>
            <CaretDown />
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={transparentDialsTitleId}>
              Transparent Dials
            </div>
            <div
              className="setting-description"
              id={transparentDialsDescriptionId}
            >
              Make dial backgrounds transparent so your wallpaper shows through.
            </div>
          </div>
          <div className="setting-option toggle">
            <Switch
              aria-labelledby={transparentDialsTitleId}
              aria-describedby={transparentDialsDescriptionId}
              onClick={() =>
                settings.handleTransparentDials(!settings.transparentDials)
              }
              className="switch-root"
              checked={settings.transparentDials as boolean}
            >
              <span className="switch-thumb" />
            </Switch>
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={showDialBordersTitleId}>
              Show Borders
            </div>
            <div
              className="setting-description"
              id={showDialBordersDescriptionId}
            >
              Add subtle borders around dials.
            </div>
          </div>
          <div className="setting-option toggle">
            <Switch
              aria-labelledby={showDialBordersTitleId}
              aria-describedby={showDialBordersDescriptionId}
              onClick={() =>
                settings.handleShowDialBorders(!settings.showDialBorders)
              }
              className="switch-root"
              checked={settings.showDialBorders as boolean}
            >
              <span className="switch-thumb" />
            </Switch>
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={usePresetThumbnailsTitleId}>
              Use Preset Thumbnails
            </div>
            <div
              className="setting-description"
              id={usePresetThumbnailsDescriptionId}
            >
              Automatically apply preset thumbnails to popular sites.
            </div>
          </div>
          <div className="setting-option toggle">
            <Switch
              aria-labelledby={usePresetThumbnailsTitleId}
              aria-describedby={usePresetThumbnailsDescriptionId}
              onClick={() =>
                settings.handleUsePresetThumbnails(
                  !settings.usePresetThumbnails,
                )
              }
              className="switch-root"
              checked={settings.usePresetThumbnails as boolean}
            >
              <span className="switch-thumb" />
            </Switch>
          </div>
        </div>
      </>
    );
  },
);
