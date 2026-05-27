import type { CSSProperties } from "react";

import { clsx } from "clsx/lite";

import { themeWallpaperPairs, wallpapers } from "#lib/wallpapers";
import { settings } from "#stores/settings";

export const maxColumns = [
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

export const dialSizes = [
  { label: "Tiny", value: "tiny" },
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "Huge", value: "huge" },
  { label: "Scale to Fit", value: "scale" },
];

export const gridSpacings = [
  { label: "Compact", value: "compact" },
  { label: "Default", value: "default" },
  { label: "Spacious", value: "spacious" },
];

export const wallpaperColors = [
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

export interface SettingsGroupProps {
  idPrefix?: string;
}

export function getId(prefix: string | undefined, id: string) {
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

export function handleTitlePlacement(value: string) {
  settings.handleShowTitle(value !== "hidden");
  settings.handleAttachTitle(value === "attached");
}

export function renderPlusIcon() {
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

export function getInitialWallpaperOrder(selectedWallpaperValue: unknown) {
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

export function renderWallpaperRadio({
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
  style?: CSSProperties;
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

export function renderWallpaperButton(
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

export function renderWallpaperColorButton(
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

export function renderCustomColorButton(
  idPrefix: string | undefined,
  name: string,
) {
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

export function renderCustomImageButton(
  idPrefix: string | undefined,
  name: string,
) {
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
