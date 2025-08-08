import { clsx } from "clsx/lite";
import { autorun, makeAutoObservable, remove, runInAction, set } from "mobx";
import semverCoerce from "semver/functions/coerce";
import semverGt from "semver/functions/gt";
import browser from "webextension-polyfill";

import { mockBookmarks } from "#stores/useBookmarks/mockBookmarks";

// ==================================================================
// SETUP
// ==================================================================

const appVersion = __APP_VERSION__;
const apiVersion = "2.0";

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

const storage: Record<string, unknown> = await browser.storage.local.get();
const lastVersion =
  semverCoerce(storage["last-version"] as string)?.version || false;
const isUpgrade = lastVersion && semverGt(appVersion, lastVersion);
browser.storage.local.set({ "last-version": appVersion });
const themeOption =
  (storage[`${apiVersion}-theme-option`] as string) || "System Theme";
const colorScheme = getColorScheme(themeOption);
let wallpaper = storage[`${apiVersion}-wallpaper`];

const customImage = await getCustomImage();
wallpaper =
  typeof wallpaper === "string" && wallpaper.includes("custom-image")
    ? "custom-image"
    : (wallpaper as string) ||
      (prefersDarkMode() ? "dark-wallpaper" : "light-wallpaper");

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

const defaultSettings = {
  attachTitle: false,
  colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "color-scheme-dark"
    : "color-scheme-light",
  customColor: "",
  customImage: "",
  defaultFolder: "",
  dialColors: {} as DialColors,
  dialImages: {} as DialImages,
  dialSize: "small",
  firstRun: !lastVersion,
  maxColumns: "7",
  newTab: false,
  showAlertBanner: !lastVersion || isUpgrade,
  showTitle: true,
  squareDials: false,
  switchTitle: false,
  themeOption: "System Theme",
  transparentDials: false,
  wallpaper: "",
};

export const settings = makeAutoObservable({
  attachTitle:
    storage[`${apiVersion}-attach-title`] ?? defaultSettings.attachTitle,
  colorScheme,
  customColor:
    storage[`${apiVersion}-custom-color`] || defaultSettings.customColor,
  customImage,
  defaultFolder:
    storage[`${apiVersion}-default-folder`] || defaultSettings.defaultFolder,
  dialColors:
    (storage[`${apiVersion}-dial-colors`] as DialColors) ||
    defaultSettings.dialColors,
  dialImages:
    (storage[`${apiVersion}-dial-images`] as DialImages) ||
    defaultSettings.dialImages,
  dialSize: storage[`${apiVersion}-dial-size`] || defaultSettings.dialSize,
  firstRun: defaultSettings.firstRun,
  maxColumns:
    storage[`${apiVersion}-max-columns`] || defaultSettings.maxColumns,
  newTab: storage[`${apiVersion}-new-tab`] ?? defaultSettings.newTab,
  showAlertBanner: defaultSettings.showAlertBanner,
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
  handleAttachTitle(value: boolean) {
    browser.storage.local.set({ [`${apiVersion}-attach-title`]: value });
    settings.attachTitle = value;
    bc.postMessage({ attachTitle: value });
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
      browser.storage.local.set({
        [`${apiVersion}-dial-images`]: { ...settings.dialImages },
      });
      bc.postMessage({ dialImages: { ...settings.dialImages } });
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
  handleSelectThumbnail(id: string) {
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

      const base64 = await blobToBase64(image);
      settings.dialImages = { ...settings.dialImages, [id]: base64 };
      browser.storage.local.set({
        [`${apiVersion}-dial-images`]: { ...settings.dialImages },
      });
      bc.postMessage({ dialImages: { ...settings.dialImages } });
    };
    i.click();
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
    settings.toggleThemeBackground(settings.colorScheme);
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
    // Internal method for restoring wallpaper without clearing custom image/color
    browser.storage.local.set({ [`${apiVersion}-wallpaper`]: value });
    settings.wallpaper = value;
    bc.postMessage({ wallpaper: value });
  },
  _restoreCustomColor(value: string) {
    // Internal method for restoring custom color without triggering wallpaper change
    browser.storage.local.set({ [`${apiVersion}-custom-color`]: value });
    settings.customColor = value;
    bc.postMessage({ customColor: value });
  },
  hideAlertBanner() {
    settings.showAlertBanner = false;
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
    settings.dialImages = {};
    bc.postMessage({ dialImages: {} });
  },
  resetSettings() {
    settings.handleAttachTitle(defaultSettings.attachTitle);
    settings._clearCustomColor();
    settings._clearCustomImage();
    settings.resetDialColors();
    settings.resetDialImages();
    settings.resetWallpaper();
    settings.handleDefaultFolder(defaultSettings.defaultFolder);
    settings.handleDialSize(defaultSettings.dialSize);
    settings.handleMaxColumns(defaultSettings.maxColumns);
    settings.handleNewTab(defaultSettings.newTab);
    settings.handleShowTitle(defaultSettings.showTitle);
    settings.handleSquareDials(defaultSettings.squareDials);
    settings.handleSwitchTitle(defaultSettings.switchTitle);
    settings.handleThemeOption(defaultSettings.themeOption);
    settings.handleTransparentDials(defaultSettings.transparentDials);
  },
  resetWallpaper() {
    settings.handleWallpaper(
      prefersDarkMode() ? "dark-wallpaper" : "light-wallpaper",
    );
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
            browser.storage.local.set({
              [`${apiVersion}-dial-images`]: backup.dialImages,
            });
            settings.dialImages = backup.dialImages;
            bc.postMessage({ dialImages: backup.dialImages });
          }
          if (Object.prototype.hasOwnProperty.call(backup, "dialSize")) {
            settings.handleDialSize(backup.dialSize);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "maxColumns")) {
            settings.handleMaxColumns(backup.maxColumns);
          }
          if (Object.prototype.hasOwnProperty.call(backup, "newTab")) {
            settings.handleNewTab(backup.newTab);
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
      attachTitle: settings.attachTitle,
      customColor: settings.customColor,
      customImage: settings.customImage,
      defaultFolder: settings.defaultFolder,
      dialColors: settings.dialColors,
      dialImages: settings.dialImages,
      dialSize: settings.dialSize,
      maxColumns: settings.maxColumns,
      newTab: settings.newTab,
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
  toggleThemeBackground(scheme: string) {
    const wallpaperMap = {
      "color-scheme-light": {
        "dark-wallpaper": "light-wallpaper",
        "light-wallpaper": "light-wallpaper",
        HorizonDark: "HorizonLight",
        HorizonLight: "HorizonLight",
        DesertDay: "DesertDay",
        DesertNight: "DesertDay",
      },
      "color-scheme-dark": {
        "dark-wallpaper": "dark-wallpaper",
        "light-wallpaper": "dark-wallpaper",
        HorizonDark: "HorizonDark",
        HorizonLight: "HorizonDark",
        DesertDay: "DesertNight",
        DesertNight: "DesertNight",
      },
    };
    const schemeMap = wallpaperMap[scheme as keyof typeof wallpaperMap];
    const wallpaper = schemeMap?.[settings.wallpaper as keyof typeof schemeMap];
    if (wallpaper) {
      settings.handleWallpaper(wallpaper);
    }
  },
  systemThemeChanged(e: MediaQueryListEvent) {
    if (settings.themeOption === "System Theme") {
      settings.colorScheme = e.matches
        ? "color-scheme-dark"
        : "color-scheme-light";
      settings.toggleThemeBackground(settings.colorScheme);
    }
  },
});

// ==================================================================
// TOGGLE THEME/BACKGROUND
// ==================================================================
// Listen for system theme changes and update settings accordingly.
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", settings.systemThemeChanged);

// ==================================================================
// DIALS FROM DEMO BOOKMARKS
// ==================================================================
// If running in demo mode, populate dial colors and images from mock bookmarks.
if (__DEMO__) {
  mockBookmarks.forEach((b) => {
    settings.dialColors[b[2]] = b[3];
    settings.dialImages[b[2]] = b[4];
  });
}

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
    settings.wallpaper as string,
    "Wallpapers",
    isChrome ? "chrome" : "firefox",
    isMacOS ? "mac" : "windows",
    settings.showTitle ? "show-title" : "hide-title",
    settings.attachTitle ? "attach-title" : "normal-title",
    settings.dialSize,
    settings.maxColumns === "Unlimited" ? "unlimited-columns" : undefined,
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
