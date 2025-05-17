import classNames from "classnames";
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
   * This store converts to base64 to avoid multiple implementations.
   */
  try {
    const { [`${apiVersion}-custom-image`]: image } =
      await browser.storage.local.get(`${apiVersion}-custom-image`);
    if (image) {
      const blobImage = base64ToBlob(image);
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

function getColorScheme(value) {
  return (value === "System Theme" && prefersDarkMode()) || value === "Dark"
    ? "color-scheme-dark"
    : "color-scheme-light";
}

const storage = await browser.storage.local.get();
const lastVersion = semverCoerce(storage["last-version"])?.version || false;
const isUpgrade = lastVersion && semverGt(appVersion, lastVersion);
browser.storage.local.set({ "last-version": appVersion });
const themeOption = storage[`${apiVersion}-theme-option`] || "System Theme";
const colorScheme = getColorScheme(themeOption);
let wallpaper = storage[`${apiVersion}-wallpaper`];

const customImage = await getCustomImage();
wallpaper = wallpaper?.includes("custom-image")
  ? "custom-image"
  : wallpaper || (prefersDarkMode() ? "dark-wallpaper" : "light-wallpaper");

/* Handle changes page between open tabs. */
const bc = new BroadcastChannel("easy-settings");
bc.onmessage = (e) => {
  runInAction(() => set(settings, e.data));
};

// ==================================================================
// SETTINGS STORE
// ==================================================================

const defaultSettings = {
  attachTitle: false,
  colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "color-scheme-dark"
    : "color-scheme-light",
  customColor: "",
  customImage: "",
  defaultFolder: "1",
  dialColors: {},
  dialImages: {},
  firstRun: !lastVersion,
  maxColumns: "7",
  newTab: false,
  showAlertBanner: !lastVersion || isUpgrade,
  showTitle: true,
  switchTitle: false,
  themeOption: "System Theme",
  wallpaper: "",
};

if (__FIREFOX__) {
  defaultSettings.defaultFolder = "toolbar_____";
}

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
    storage[`${apiVersion}-dial-colors`] || defaultSettings.dialColors,
  dialImages:
    storage[`${apiVersion}-dial-images`] || defaultSettings.dialImages,
  firstRun: defaultSettings.firstRun,
  maxColumns:
    storage[`${apiVersion}-max-columns`] || defaultSettings.maxColumns,
  newTab: storage[`${apiVersion}-new-tab`] ?? defaultSettings.newTab,
  showAlertBanner: defaultSettings.showAlertBanner,
  showTitle: storage[`${apiVersion}-show-title`] ?? defaultSettings.showTitle,
  switchTitle:
    storage[`${apiVersion}-switch-title`] ?? defaultSettings.switchTitle,
  themeOption,
  wallpaper,
  handleAttachTitle(value) {
    browser.storage.local.set({ [`${apiVersion}-attach-title`]: value });
    settings.attachTitle = value;
    bc.postMessage({ attachTitle: value });
  },
  handleClearColor(id) {
    if (settings.dialColors[id]) {
      remove(settings.dialColors, id);
      browser.storage.local.set({
        [`${apiVersion}-dial-colors`]: { ...settings.dialColors },
      });
      bc.postMessage({ dialColors: { ...settings.dialColors } });
    }
  },
  handleClearThumbnail(id) {
    if (settings.dialImages[id]) {
      remove(settings.dialImages, id);
      browser.storage.local.set({
        [`${apiVersion}-dial-images`]: { ...settings.dialImages },
      });
      bc.postMessage({ dialImages: { ...settings.dialImages } });
    }
  },
  handleCustomColor(value) {
    browser.storage.local.set({ [`${apiVersion}-custom-color`]: value });
    settings.customColor = value;
    settings.handleWallpaper("custom-color");
    bc.postMessage({ customColor: value });
  },
  handleCustomImage() {
    const i = document.createElement("input");
    i.type = "File";
    i.onchange = async (e) => {
      const image = e.target.files[0];
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
  handleDefaultFolder(value) {
    browser.storage.local.set({ [`${apiVersion}-default-folder`]: value });
    settings.defaultFolder = value;
    bc.postMessage({ defaultFolder: value });
  },
  handleDialColors(id, value) {
    set(settings.dialColors, id, value);
    browser.storage.local.set({
      [`${apiVersion}-dial-colors`]: { ...settings.dialColors },
    });
    bc.postMessage({
      dialColors: { ...settings.dialColors },
    });
  },
  handleMaxColumns(value) {
    browser.storage.local.set({ [`${apiVersion}-max-columns`]: value });
    settings.maxColumns = value;
    bc.postMessage({ maxColumns: value });
  },
  handleNewTab(value) {
    browser.storage.local.set({ [`${apiVersion}-new-tab`]: value });
    settings.newTab = value;
    bc.postMessage({ newTab: value });
  },
  handleSelectThumbnail(id) {
    const i = document.createElement("input");
    i.type = "File";
    i.onchange = async (e) => {
      const image = e.target.files[0];
      const base64 = await blobToBase64(image);
      settings.dialImages = { ...settings.dialImages, [id]: base64 };
      browser.storage.local.set({
        [`${apiVersion}-dial-images`]: { ...settings.dialImages },
      });
      bc.postMessage({ dialImages: { ...settings.dialImages } });
    };
    i.click();
  },
  handleShowTitle(value) {
    browser.storage.local.set({ [`${apiVersion}-show-title`]: value });
    settings.showTitle = value;
    bc.postMessage({ showTitle: value });
  },
  handleSwitchTitle(value) {
    browser.storage.local.set({ [`${apiVersion}-switch-title`]: value });
    settings.switchTitle = value;
    bc.postMessage({ switchTitle: value });
  },
  handleThemeOption(value) {
    browser.storage.local.set({ [`${apiVersion}-theme-option`]: value });
    settings.themeOption = value;
    settings.colorScheme = getColorScheme(value);
    settings.toggleThemeBackground(settings.colorScheme);
    bc.postMessage({ colorScheme: settings.colorScheme, themeOption: value });
  },
  handleWallpaper(value) {
    browser.storage.local.set({ [`${apiVersion}-wallpaper`]: value });
    settings.wallpaper = value;
    bc.postMessage({ wallpaper: value });
  },
  hideAlertBanner() {
    settings.showAlertBanner = false;
  },
  resetCustomImage() {
    browser.storage.local.remove([`${apiVersion}-custom-image`]);
    settings.customImage = "";
    bc.postMessage({ customImage: "" });
    if (settings.wallpaper === "custom-image") {
      settings.resetWallpaper();
    }
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
    settings.handleCustomColor(defaultSettings.customColor);
    settings.resetCustomImage();
    settings.resetDialColors();
    settings.resetDialImages();
    settings.resetWallpaper();
    settings.handleDefaultFolder(defaultSettings.defaultFolder);
    settings.handleMaxColumns(defaultSettings.maxColumns);
    settings.handleNewTab(defaultSettings.newTab);
    settings.handleShowTitle(defaultSettings.showTitle);
    settings.handleSwitchTitle(defaultSettings.switchTitle);
    settings.handleThemeOption(defaultSettings.themeOption);
  },
  resetWallpaper() {
    settings.handleWallpaper(
      prefersDarkMode() ? "dark-wallpaper" : "light-wallpaper",
    );
  },
  restoreFromJSON() {
    const i = document.createElement("input");
    i.type = "File";
    i.onchange = (e) => {
      const reader = new FileReader();
      reader.readAsText(e.target.files[0]);
      reader.onload = async (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          settings.resetCustomImage();
          if (backup.customImage) {
            const image = base64ToBlob(backup.customImage);
            await browser.storage.local.set({
              [`${apiVersion}-custom-image`]: backup.customImage,
            });
            const imageURI = URL.createObjectURL(image);
            settings.customImage = imageURI;
            bc.postMessage({ customImage: imageURI });
          } else {
            settings.resetCustomImage();
          }
          settings.handleAttachTitle(backup.attachTitle);
          settings.handleCustomColor(backup.customColor);
          settings.handleDefaultFolder(backup.defaultFolder);
          browser.storage.local.set({
            [`${apiVersion}-dial-colors`]: backup.dialColors,
          });
          browser.storage.local.set({
            [`${apiVersion}-dial-images`]: backup.dialImages || {},
          });
          settings.dialColors = backup.dialColors;
          settings.dialImages = backup.dialImages || {};
          bc.postMessage({ dialColors: backup.dialColors });
          bc.postMessage({ dialImages: backup.dialImages || {} });
          settings.handleMaxColumns(backup.maxColumns);
          settings.handleNewTab(backup.newTab);
          settings.handleShowTitle(backup.showTitle);
          settings.handleSwitchTitle(backup.switchTitle);
          settings.handleWallpaper(backup.wallpaper);
          settings.handleThemeOption(backup.themeOption);
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
      maxColumns: settings.maxColumns,
      newTab: settings.newTab,
      showTitle: settings.showTitle,
      switchTitle: settings.switchTitle,
      themeOption: settings.themeOption,
      wallpaper: settings.wallpaper,
    };
    const { [`${apiVersion}-custom-image`]: image } =
      await browser.storage.local.get(`${apiVersion}-custom-image`);
    if (image) {
      backup.customImage = image;
    }
    downloadBackup(backup);
  },
  toggleThemeBackground(scheme) {
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
    const wallpaper = wallpaperMap[scheme]?.[settings.wallpaper];
    if (wallpaper) {
      settings.handleWallpaper(wallpaper);
    }
  },
  systemThemeChanged(e) {
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

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", settings.systemThemeChanged);

// ==================================================================
// DIALS FROM DEMO BOOKMARKS
// ==================================================================

if (__DEMO__) {
  mockBookmarks.forEach((b) => {
    settings.dialColors[b[2]] = b[3];
    settings.dialImages[b[2]] = b[4];
  });
}

// ==================================================================
// CLASSNAMES FROM SETTINGS
// ==================================================================

const userAgent = navigator.userAgent.toLowerCase();
const isMacOS = userAgent.includes("macintosh");
const isChrome = userAgent.includes("chrome");

autorun(() => {
  document.documentElement.className = classNames(
    settings.colorScheme,
    settings.wallpaper,
    "Wallpapers",
    isChrome ? "chrome" : "firefox",
    isMacOS ? "mac" : "windows",
    settings.showTitle ? "show-title" : "hide-title",
    settings.attachTitle ? "attach-title" : "normal-title",
  );
  document.documentElement.style.backgroundImage =
    settings.wallpaper === "custom-image" && settings.customImage
      ? `url(${settings.customImage})`
      : null;
  document.documentElement.style.setProperty(
    "--background-color",
    settings.wallpaper === "custom-color" ? settings.customColor : null,
  );
});

// ==================================================================
// BACKUP/RESTORE HELPERS
// ==================================================================

function base64ToBlob(base64) {
  const contentType = base64.match(/data:([^;]+);base64,/)[1];
  const base64Data = base64.replace(/data:([^;]+);base64,/, "");
  const binaryData = atob(base64Data);
  const length = binaryData.length;
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: contentType });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function downloadBackup(obj) {
  const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(
    JSON.stringify(obj),
  )}`;
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "easy-backup.json";
  a.click();
}
