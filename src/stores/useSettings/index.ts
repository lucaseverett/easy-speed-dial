import { clsx } from "clsx/lite";
import { autorun, makeAutoObservable, remove, runInAction, set } from "mobx";
import semverCoerce from "semver/functions/coerce";
import semverGt from "semver/functions/gt";
import semverLt from "semver/functions/lt";
import browser from "webextension-polyfill";

import { themeWallpaperPairs } from "#lib/wallpapers";

// ==================================================================
// SETUP
// ==================================================================

const appVersion = __APP_VERSION__;
const apiVersion = "2.0";
const showDialBordersStorageKey = `${apiVersion}-show-dial-borders`;
const gridSpacingStorageKey = `${apiVersion}-grid-spacing`;
const usePresetThumbnailsStorageKey = `${apiVersion}-use-preset-thumbnails`;

async function getCustomImage() {
  /*
   * IndexedDB storage allows images to be stored as blob.
   * Chrome storage requires blobs to be converted to base64.
   * Firefox storage allows images to be stored as blob.
   * This store always converts to base64 to avoid multiple implementations.
   */
  try {
    const { [`${apiVersion}-custom-image`]: image } =
      await browser.storage.local.get(`${apiVersion}-custom-image`);
    if (image) {
      const blobImage = base64ToBlob(image as string);
      const imageURI = URL.createObjectURL(blobImage);
      return imageURI;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error loading custom image:", error);
  }
}

function prefersDarkMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getColorScheme(value: string) {
  return (value === "System Theme" && prefersDarkMode()) || value === "Dark"
    ? "color-scheme-dark"
    : "color-scheme-light";
}

function resolveWallpaper(value: unknown): string {
  if (value === "light-wallpaper" || value === "dark-wallpaper" || !value) {
    return "theme-wallpaper";
  }

  const themeWallpaper = themeWallpaperPairs.find(
    ({ dark, light }) => value === light || value === dark,
  );
  if (themeWallpaper) {
    return themeWallpaper.id;
  }

  if (typeof value === "string" && value.includes("custom-image")) {
    return "custom-image";
  }

  if (typeof value === "string") {
    return value;
  }

  return "theme-wallpaper";
}

function resolveWallpaperClass(wallpaper: string, colorScheme: string) {
  const themeWallpaper = themeWallpaperPairs.find(({ id }) => id === wallpaper);

  if (!themeWallpaper) {
    return wallpaper;
  }

  return colorScheme === "color-scheme-dark"
    ? themeWallpaper.dark
    : themeWallpaper.light;
}

// ==================================================================
// DEV TOOLS
// ==================================================================
// Stripped from production builds via `import.meta.env.DEV`. Exposes URL
// query params for quickly exercising the onboarding modal and upgrade
// toast without manual storage clears:
//   ?dev=onboarding  — clear all storage, show the onboarding modal
//   ?dev=upgrade     — seed an old last-version, show the upgrade toast
//   ?dev=reset       — alias for ?dev=onboarding (clear all storage)
// The query param is intentionally left in the URL so reloads keep
// re-applying it — handy for iterating on the modal/toast.
const devTool = import.meta.env.DEV
  ? new URLSearchParams(window.location.search).get("dev")
  : null;

if (import.meta.env.DEV) {
  if (devTool === "onboarding" || devTool === "reset") {
    const all = await browser.storage.local.get();
    await browser.storage.local.remove(Object.keys(all));
  } else if (devTool === "upgrade") {
    await browser.storage.local.remove([
      showDialBordersStorageKey,
      gridSpacingStorageKey,
      usePresetThumbnailsStorageKey,
    ]);
    await browser.storage.local.set({ "last-version": "1.0.0" });
  }
}

const storage: Record<string, unknown> = await browser.storage.local.get();
const lastVersion =
  semverCoerce(storage["last-version"] as string)?.version || false;
const isUpgrade = lastVersion && semverGt(appVersion, lastVersion);
const shouldRunUpgradeMigrations = !__DEMO__ || devTool === "upgrade";

if (shouldRunUpgradeMigrations) {
  if (isUpgrade && semverLt(lastVersion, "2.14.0")) {
    // Existing users never had these settings, so preserve their current 2.13.x appearance. New installs (no last-version) skip this and pick up the new 2.14.0 defaults. Remove in a future update.
    storage[showDialBordersStorageKey] = false;
    storage[gridSpacingStorageKey] = "spacious";
    storage[usePresetThumbnailsStorageKey] = false;
    await browser.storage.local.set({
      [showDialBordersStorageKey]: false,
      [gridSpacingStorageKey]: "spacious",
      [usePresetThumbnailsStorageKey]: false,
    });
  }
}
browser.storage.local.set({ "last-version": appVersion });
const themeOption =
  (storage[`${apiVersion}-theme-option`] as string) || "System Theme";
const colorScheme = getColorScheme(themeOption);
const storedWallpaper = storage[`${apiVersion}-wallpaper`];
const storedCustomColor = storage[`${apiVersion}-custom-color`];
const wallpaper = resolveWallpaper(storedWallpaper);
const customColor =
  typeof storedCustomColor === "string" ? storedCustomColor : "";

const customImage = await getCustomImage();

/* Handle changes page between open tabs. */
const bc = new BroadcastChannel("easy-settings");
bc.onmessage = (e) => {
  // When settings are updated in another tab, update this tab's settings as well.
  runInAction(() => set(settings, e.data));
};

// ==================================================================
// SETTINGS STORE
// ==================================================================

type DialColors = Record<string, string>;
type DialImages = Record<string, string>;
type DialImageSize = "cover" | "contain";
type DialImageSizes = Record<string, DialImageSize>;

function resolveDialImageSize(value: unknown): DialImageSize {
  return value === "contain" ? "contain" : "cover";
}

function resolveDialImageSizes(
  value: unknown,
  dialImages: unknown,
): DialImageSizes {
  const resolvedDialImages =
    dialImages && typeof dialImages === "object" && !Array.isArray(dialImages)
      ? (dialImages as DialImages)
      : {};
  const fallbackSizes = Object.fromEntries(
    Object.keys(resolvedDialImages).map((id) => [id, "cover"]),
  ) as DialImageSizes;

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallbackSizes;
  }

  return {
    ...fallbackSizes,
    ...Object.fromEntries(
      Object.entries(value).map(([id, size]) => [
        id,
        resolveDialImageSize(size),
      ]),
    ),
  } as DialImageSizes;
}

const defaultSettings = {
  usePresetThumbnails: true,
  attachTitle: false,
  colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "color-scheme-dark"
    : "color-scheme-light",
  customColor: "",
  customImage: "",
  defaultFolder: "",
  dialColors: {} as DialColors,
  dialImages: {} as DialImages,
  dialImageSizes: {} as DialImageSizes,
  dialSize: "small",
  firstRun: !lastVersion,
  gridSpacing: "default",
  maxColumns: "7",
  newTab: false,
  showDialBorders: true,
  showUpgradeToast: isUpgrade,
  showTitle: true,
  squareDials: false,
  switchTitle: false,
  themeOption: "System Theme",
  transparentDials: false,
  wallpaper: "",
};

export const settings = makeAutoObservable({
  usePresetThumbnails:
    storage[`${apiVersion}-use-preset-thumbnails`] ??
    defaultSettings.usePresetThumbnails,
  attachTitle:
    storage[`${apiVersion}-attach-title`] ?? defaultSettings.attachTitle,
  colorScheme,
  customColor,
  customImage,
  defaultFolder:
    storage[`${apiVersion}-default-folder`] || defaultSettings.defaultFolder,
  dialColors:
    (storage[`${apiVersion}-dial-colors`] as DialColors) ||
    defaultSettings.dialColors,
  dialImages:
    (storage[`${apiVersion}-dial-images`] as DialImages) ||
    defaultSettings.dialImages,
  dialImageSizes: resolveDialImageSizes(
    storage[`${apiVersion}-dial-image-sizes`],
    (storage[`${apiVersion}-dial-images`] as DialImages) ||
      defaultSettings.dialImages,
  ),
  dialSize: storage[`${apiVersion}-dial-size`] || defaultSettings.dialSize,
  firstRun: defaultSettings.firstRun,
  gridSpacing:
    storage[`${apiVersion}-grid-spacing`] || defaultSettings.gridSpacing,
  maxColumns:
    storage[`${apiVersion}-max-columns`] || defaultSettings.maxColumns,
  newTab: storage[`${apiVersion}-new-tab`] ?? defaultSettings.newTab,
  showDialBorders:
    storage[`${apiVersion}-show-dial-borders`] ??
    defaultSettings.showDialBorders,
  showUpgradeToast: defaultSettings.showUpgradeToast,
  showTitle: storage[`${apiVersion}-show-title`] ?? defaultSettings.showTitle,
  squareDials:
    storage[`${apiVersion}-square-dials`] ?? defaultSettings.squareDials,
  switchTitle:
    storage[`${apiVersion}-switch-title`] ?? defaultSettings.switchTitle,
  themeOption,
  transparentDials:
    storage[`${apiVersion}-transparent-dials`] ??
    defaultSettings.transparentDials,
  wallpaper,
  handleUsePresetThumbnails(value: boolean) {
    browser.storage.local.set({
      [`${apiVersion}-use-preset-thumbnails`]: value,
    });
    settings.usePresetThumbnails = value;
    bc.postMessage({ usePresetThumbnails: value });
  },
  handleAttachTitle(value: boolean) {
    browser.storage.local.set({ [`${apiVersion}-attach-title`]: value });
    settings.attachTitle = value;
    bc.postMessage({ attachTitle: value });
  },
  getDialImageSize(id: string) {
    return settings.dialImageSizes[id] || resolveDialImageSize(undefined);
  },
  handleClearColor(id: string) {
    if (settings.dialColors[id]) {
      remove(settings.dialColors, id);
      browser.storage.local.set({
        [`${apiVersion}-dial-colors`]: { ...settings.dialColors },
      });
      bc.postMessage({ dialColors: { ...settings.dialColors } });
    }
  },
  handleClearThumbnail(id: string) {
    if (settings.dialImages[id]) {
      remove(settings.dialImages, id);
      remove(settings.dialImageSizes, id);
      browser.storage.local.set({
        [`${apiVersion}-dial-images`]: { ...settings.dialImages },
        [`${apiVersion}-dial-image-sizes`]: { ...settings.dialImageSizes },
      });
      bc.postMessage({
        dialImages: { ...settings.dialImages },
        dialImageSizes: { ...settings.dialImageSizes },
      });
    }
  },
  handleCustomColor(value: string) {
    browser.storage.local.set({ [`${apiVersion}-custom-color`]: value });
    settings.customColor = value;
    settings.handleWallpaper("custom-color");
    bc.postMessage({ customColor: value });
  },
  handleCustomImage() {
    const i = document.createElement("input");
    i.type = "File";
    i.accept = "image/*";
    i.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const image = target.files?.[0];
      if (!image) return;

      if (!image.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }

      const imageURI = URL.createObjectURL(image);
      const base64 = await blobToBase64(image);
      await browser.storage.local.set({
        [`${apiVersion}-custom-image`]: base64,
      });
      settings.customImage = imageURI;
      settings.handleWallpaper("custom-image");
      bc.postMessage({ customImage: imageURI });
    };
    i.click();
  },
  handleDefaultFolder(value: string) {
    browser.storage.local.set({ [`${apiVersion}-default-folder`]: value });
    settings.defaultFolder = value;
    bc.postMessage({ defaultFolder: value });
  },
  handleDialColors(id: string, value: string) {
    set(settings.dialColors, id, value);
    browser.storage.local.set({
      [`${apiVersion}-dial-colors`]: { ...settings.dialColors },
    });
    bc.postMessage({
      dialColors: { ...settings.dialColors },
    });
  },
  handleDialSize(value: string) {
    browser.storage.local.set({ [`${apiVersion}-dial-size`]: value });
    settings.dialSize = value;
    bc.postMessage({ dialSize: value });
  },
  handleGridSpacing(value: string) {
    browser.storage.local.set({ [`${apiVersion}-grid-spacing`]: value });
    settings.gridSpacing = value;
    bc.postMessage({ gridSpacing: value });
  },
  handleDialImageSize(id: string, value: string) {
    const size = resolveDialImageSize(value);
    set(settings.dialImageSizes, id, size);
    browser.storage.local.set({
      [`${apiVersion}-dial-image-sizes`]: { ...settings.dialImageSizes },
    });
    bc.postMessage({
      dialImageSizes: { ...settings.dialImageSizes },
    });
  },
  handleMaxColumns(value: string) {
    browser.storage.local.set({ [`${apiVersion}-max-columns`]: value });
    settings.maxColumns = value;
    bc.postMessage({ maxColumns: value });
  },
  handleNewTab(value: boolean) {
    browser.storage.local.set({ [`${apiVersion}-new-tab`]: value });
    settings.newTab = value;
    bc.postMessage({ newTab: value });
  },
  handleShowDialBorders(value: boolean) {
    browser.storage.local.set({ [`${apiVersion}-show-dial-borders`]: value });
    settings.showDialBorders = value;
    bc.postMessage({ showDialBorders: value });
  },
  handleSelectThumbnail(id: string) {
    const i = document.createElement("input");
    i.type = "File";
    i.accept = "image/*";
    i.onchange = async (e: Event) => {
      const input = e.target as HTMLInputElement;
      const image = input.files?.[0];
      if (!image) return;

      if (!image.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }

      const base64 = await blobToBase64(image);
      settings.handleSetThumbnail(id, base64);
    };
    i.click();
  },
  handleSetThumbnail(
    id: string,
    base64: string,
    size: DialImageSize = "cover",
  ) {
    settings.dialImages = { ...settings.dialImages, [id]: base64 };
    settings.dialImageSizes = { ...settings.dialImageSizes, [id]: size };
    browser.storage.local.set({
      [`${apiVersion}-dial-images`]: { ...settings.dialImages },
      [`${apiVersion}-dial-image-sizes`]: { ...settings.dialImageSizes },
    });
    bc.postMessage({
      dialImages: { ...settings.dialImages },
      dialImageSizes: { ...settings.dialImageSizes },
    });
  },
  handleShowTitle(value: boolean) {
    browser.storage.local.set({ [`${apiVersion}-show-title`]: value });
    settings.showTitle = value;
    bc.postMessage({ showTitle: value });
  },
  handleSwitchTitle(value: boolean) {
    browser.storage.local.set({ [`${apiVersion}-switch-title`]: value });
    settings.switchTitle = value;
    bc.postMessage({ switchTitle: value });
  },
  handleSquareDials(value: boolean) {
    browser.storage.local.set({ [`${apiVersion}-square-dials`]: value });
    settings.squareDials = value;
    bc.postMessage({ squareDials: value });
  },
  handleThemeOption(value: string) {
    browser.storage.local.set({ [`${apiVersion}-theme-option`]: value });
    settings.themeOption = value;
    settings.colorScheme = getColorScheme(value);
    bc.postMessage({ colorScheme: settings.colorScheme, themeOption: value });
  },
  handleTransparentDials(value: boolean) {
    browser.storage.local.set({ [`${apiVersion}-transparent-dials`]: value });
    settings.transparentDials = value;
    bc.postMessage({ transparentDials: value });
  },
  handleWallpaper(value: string) {
    // Automatically clear custom image when switching to a different wallpaper
    if (value !== "custom-image" && settings.wallpaper === "custom-image") {
      settings._clearCustomImage();
    }
    // Automatically clear custom color when switching to a different wallpaper
    if (value !== "custom-color" && settings.wallpaper === "custom-color") {
      settings._clearCustomColor();
    }
    browser.storage.local.set({ [`${apiVersion}-wallpaper`]: value });
    settings.wallpaper = value;
    bc.postMessage({ wallpaper: value });
  },
  _restoreWallpaper(value: string) {
    const wallpaper = resolveWallpaper(value);
    // Internal method for restoring wallpaper without clearing custom image/color
    browser.storage.local.set({
      [`${apiVersion}-wallpaper`]: wallpaper,
    });
    settings.wallpaper = wallpaper;
    bc.postMessage({ wallpaper: settings.wallpaper });
  },
  _restoreCustomColor(value: string) {
    // Internal method for restoring custom color without triggering wallpaper change
    browser.storage.local.set({ [`${apiVersion}-custom-color`]: value });
    settings.customColor = value;
    bc.postMessage({ customColor: value });
  },
  hideUpgradeToast() {
    settings.showUpgradeToast = false;
  },
  _clearCustomImage() {
    browser.storage.local.remove([`${apiVersion}-custom-image`]);
    settings.customImage = "";
    bc.postMessage({ customImage: "" });
  },
  _clearCustomColor() {
    browser.storage.local.set({ [`${apiVersion}-custom-color`]: "" });
    settings.customColor = "";
    bc.postMessage({ customColor: "" });
  },
  resetDialColors() {
    browser.storage.local.set({ [`${apiVersion}-dial-colors`]: {} });
    settings.dialColors = {};
    bc.postMessage({ dialColors: {} });
  },
  resetDialImages() {
    browser.storage.local.remove(`${apiVersion}-dial-images`);
    browser.storage.local.remove(`${apiVersion}-dial-image-sizes`);
    settings.dialImages = {};
    settings.dialImageSizes = {};
    bc.postMessage({ dialImages: {}, dialImageSizes: {} });
  },
  resetDialCustomizations() {
    settings.resetDialColors();
    settings.resetDialImages();
  },
  resetSettings() {
    settings.handleUsePresetThumbnails(defaultSettings.usePresetThumbnails);
    settings.handleAttachTitle(defaultSettings.attachTitle);
    settings._clearCustomColor();
    settings._clearCustomImage();
    settings.resetDialColors();
    settings.resetDialImages();
    settings.resetWallpaper();
    settings.handleDefaultFolder(defaultSettings.defaultFolder);
    settings.handleDialSize(defaultSettings.dialSize);
    settings.handleGridSpacing(defaultSettings.gridSpacing);
    settings.handleMaxColumns(defaultSettings.maxColumns);
    settings.handleNewTab(defaultSettings.newTab);
    settings.handleShowDialBorders(defaultSettings.showDialBorders);
    settings.handleShowTitle(defaultSettings.showTitle);
    settings.handleSquareDials(defaultSettings.squareDials);
    settings.handleSwitchTitle(defaultSettings.switchTitle);
    settings.handleThemeOption(defaultSettings.themeOption);
    settings.handleTransparentDials(defaultSettings.transparentDials);
  },
  resetWallpaper() {
    settings.handleWallpaper("theme-wallpaper");
  },
  restoreFromJSON() {
    const i = document.createElement("input");
    i.type = "File";
    i.accept = ".json";
    i.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const reader = new FileReader();
      reader.readAsText(target.files![0]);
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (typeof result !== "string") return;
          const backup = JSON.parse(result);
          settings.resetSettings();
          if (backup.customImage) {
            const image = base64ToBlob(backup.customImage);
            await browser.storage.local.set({
              [`${apiVersion}-custom-image`]: backup.customImage,
            });
            const imageURI = URL.createObjectURL(image);
            settings.customImage = imageURI;
            bc.postMessage({ customImage: imageURI });
          }
          if (
            Object.prototype.hasOwnProperty.call(backup, "usePresetThumbnails")
          ) {
            settings.handleUsePresetThumbnails(backup.usePresetThumbnails);
          } else {
            // Backups without usePresetThumbnails predate the setting, so
            // preserve the previous non-preset appearance instead of applying
            // the new reset default.
            settings.handleUsePresetThumbnails(false);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "attachTitle")) {
            settings.handleAttachTitle(backup.attachTitle);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "customColor")) {
            settings._restoreCustomColor(backup.customColor);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "defaultFolder")) {
            settings.handleDefaultFolder(backup.defaultFolder);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "dialColors")) {
            browser.storage.local.set({
              [`${apiVersion}-dial-colors`]: backup.dialColors,
            });
            settings.dialColors = backup.dialColors;
            bc.postMessage({ dialColors: backup.dialColors });
          }
          if (Object.prototype.hasOwnProperty.call(backup, "dialImages")) {
            const dialImageSizes = resolveDialImageSizes(
              backup.dialImageSizes,
              backup.dialImages,
            );
            browser.storage.local.set({
              [`${apiVersion}-dial-images`]: backup.dialImages,
              [`${apiVersion}-dial-image-sizes`]: dialImageSizes,
            });
            settings.dialImages = backup.dialImages;
            settings.dialImageSizes = dialImageSizes;
            bc.postMessage({
              dialImages: backup.dialImages,
              dialImageSizes,
            });
          } else if (
            Object.prototype.hasOwnProperty.call(backup, "dialImageSizes")
          ) {
            const dialImageSizes = resolveDialImageSizes(
              backup.dialImageSizes,
              settings.dialImages,
            );
            browser.storage.local.set({
              [`${apiVersion}-dial-image-sizes`]: dialImageSizes,
            });
            settings.dialImageSizes = dialImageSizes;
            bc.postMessage({ dialImageSizes });
          }
          if (Object.prototype.hasOwnProperty.call(backup, "dialSize")) {
            settings.handleDialSize(backup.dialSize);
          }
          // Backups without gridSpacing predate the setting, so preserve the
          // legacy spacious layout instead of applying the new reset default.
          settings.handleGridSpacing(
            Object.prototype.hasOwnProperty.call(backup, "gridSpacing")
              ? backup.gridSpacing
              : "spacious",
          );
          if (Object.prototype.hasOwnProperty.call(backup, "maxColumns")) {
            settings.handleMaxColumns(backup.maxColumns);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "newTab")) {
            settings.handleNewTab(backup.newTab);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "showDialBorders")) {
            settings.handleShowDialBorders(backup.showDialBorders);
          } else {
            // Backups without showDialBorders predate the setting, so preserve
            // the previous flat dial appearance instead of applying the new
            // reset default.
            settings.handleShowDialBorders(false);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "showTitle")) {
            settings.handleShowTitle(backup.showTitle);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "squareDials")) {
            settings.handleSquareDials(backup.squareDials);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "switchTitle")) {
            settings.handleSwitchTitle(backup.switchTitle);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "wallpaper")) {
            settings._restoreWallpaper(backup.wallpaper);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "themeOption")) {
            settings.handleThemeOption(backup.themeOption);
          }
          if (
            Object.prototype.hasOwnProperty.call(backup, "transparentDials")
          ) {
            settings.handleTransparentDials(backup.transparentDials);
          }
        } catch (err) {
          console.error("Error parsing JSON file", err);
        }
      };
    };
    i.click();
  },
  async saveToJSON() {
    const backup = {
      usePresetThumbnails: settings.usePresetThumbnails,
      attachTitle: settings.attachTitle,
      customColor: settings.customColor,
      customImage: settings.customImage,
      defaultFolder: settings.defaultFolder,
      dialColors: settings.dialColors,
      dialImages: settings.dialImages,
      dialImageSizes: settings.dialImageSizes,
      dialSize: settings.dialSize,
      gridSpacing: settings.gridSpacing,
      maxColumns: settings.maxColumns,
      newTab: settings.newTab,
      showDialBorders: settings.showDialBorders,
      showTitle: settings.showTitle,
      squareDials: settings.squareDials,
      switchTitle: settings.switchTitle,
      themeOption: settings.themeOption,
      transparentDials: settings.transparentDials,
      wallpaper: settings.wallpaper,
    };
    const { [`${apiVersion}-custom-image`]: image } =
      await browser.storage.local.get(`${apiVersion}-custom-image`);
    if (image && typeof image === "string") {
      backup.customImage = image;
    }
    downloadBackup(backup);
  },
  systemThemeChanged(e: MediaQueryListEvent) {
    if (settings.themeOption === "System Theme") {
      settings.colorScheme = e.matches
        ? "color-scheme-dark"
        : "color-scheme-light";
    }
  },
});

// ==================================================================
// SYSTEM THEME
// ==================================================================
// Listen for system theme changes and update settings accordingly.
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", settings.systemThemeChanged);

// ==================================================================
// CLASSNAMES FROM SETTINGS
// ==================================================================
// Dynamically update document class names and background based on settings.
const userAgent = navigator.userAgent.toLowerCase();
const isMacOS = userAgent.includes("macintosh");
const isChrome = userAgent.includes("chrome");

autorun(() => {
  document.documentElement.className = clsx(
    settings.colorScheme as string,
    resolveWallpaperClass(
      settings.wallpaper as string,
      settings.colorScheme as string,
    ),
    "Wallpapers",
    isChrome ? "chrome" : "firefox",
    isMacOS ? "mac" : "windows",
    settings.showTitle ? "show-title" : "hide-title",
    settings.attachTitle ? "attach-title" : "normal-title",
    settings.dialSize,
    `grid-spacing-${settings.gridSpacing}`,
    settings.maxColumns === "Unlimited" ? "unlimited-columns" : undefined,
    settings.showDialBorders ? "show-dial-borders" : undefined,
    settings.squareDials ? "square" : undefined,
    settings.transparentDials ? "transparent-dials" : undefined,
  );
  document.documentElement.style.backgroundImage =
    settings.wallpaper === "custom-image" && settings.customImage
      ? `url(${settings.customImage})`
      : "";
  document.documentElement.style.setProperty(
    "--background-color",
    settings.wallpaper === "custom-color"
      ? (settings.customColor as string | null)
      : null,
  );
});

// ==================================================================
// BACKUP/RESTORE HELPERS
// ==================================================================
// Utility to convert a base64 string to a Blob object.
function base64ToBlob(base64: string) {
  const contentType = base64.match(/data:([^;]+);base64,/)?.[1];
  if (!contentType) throw new Error("Invalid base64 format");
  const base64Data = base64.replace(/data:([^;]+);base64,/, "");
  const binaryData = atob(base64Data);
  const length = binaryData.length;
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: contentType });
}

// Utility to convert a Blob object to a base64 string.
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as string"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

// Utility to trigger a download of a JSON backup file.
function downloadBackup(obj: Record<string, unknown>) {
  const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(
    JSON.stringify(obj),
  )}`;
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "easy-backup.json";
  a.click();
}
