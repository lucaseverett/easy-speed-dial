import localForage from "localforage";
import { makeAutoObservable, remove, set } from "mobx";

import { apiVersion, appVersion } from "#common/version";
import {
  base64ToBlob,
  blobToBase64,
  downloadBackup,
  setupHelpers,
} from "../helpers";

// ==========================
// SETUP
// ==========================

// Parse is only needed for the web version due to localStorage.
function parse(item, defaultValue) {
  if (item === null) {
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing localStorage item "${item}":`, error);
    return defaultValue;
  }
}

async function getCustomImage() {
  try {
    const image = await localForage.getItem(`${apiVersion}-custom-image`);
    if (image) {
      const imageURI = URL.createObjectURL(image);
      return imageURI;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error loading custom image:", error);
  }
}

const lastVersion = localStorage.getItem("last-version") || false;
const isUpgrade = lastVersion < appVersion;
localStorage.setItem("last-version", appVersion);
let wallpaper = localStorage.getItem(`${apiVersion}-wallpaper`);
const customImage = await getCustomImage();
wallpaper = wallpaper?.includes("custom-image")
  ? "custom-image"
  : wallpaper ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark-wallpaper"
      : "light-wallpaper");

// Handle changes from the Settings page between open tabs.
const bc = new BroadcastChannel("easy-settings");
bc.onmessage = (e) => {
  set(settings, e.data);
};

// ==========================
// SETTINGS STORE
// ==========================

const defaultSettings = {
  attachTitle: false,
  colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "color-scheme-dark"
    : "color-scheme-light",
  customColor: "",
  customImage: "",
  defaultFolder: "1",
  dialColors: {},
  firstRun: !lastVersion,
  maxColumns: "7",
  newTab: false,
  showAlertBanner: !lastVersion || isUpgrade,
  showTitle: true,
  switchTitle: false,
  themeOption: "System Theme",
  wallpaper: "",
};

export const settings = makeAutoObservable({
  attachTitle: parse(
    localStorage.getItem(`${apiVersion}-attach-title`),
    defaultSettings.attachTitle,
  ),
  colorScheme: defaultSettings.colorScheme,
  customColor:
    localStorage.getItem(`${apiVersion}-custom-color`) ||
    defaultSettings.customColor,
  customImage,
  defaultFolder:
    localStorage.getItem(`${apiVersion}-default-folder`) ||
    defaultSettings.defaultFolder,
  dialColors: parse(
    localStorage.getItem(`${apiVersion}-dial-colors`),
    defaultSettings.dialColors,
  ),
  firstRun: defaultSettings.firstRun,
  maxColumns:
    localStorage.getItem(`${apiVersion}-max-columns`) ||
    defaultSettings.maxColumns,
  newTab: parse(
    localStorage.getItem(`${apiVersion}-new-tab`),
    defaultSettings.newTab,
  ),
  showAlertBanner: defaultSettings.showAlertBanner,
  showTitle: parse(
    localStorage.getItem(`${apiVersion}-show-title`),
    defaultSettings.showTitle,
  ),
  switchTitle: parse(
    localStorage.getItem(`${apiVersion}-switch-title`),
    defaultSettings.switchTitle,
  ),
  themeOption:
    localStorage.getItem(`${apiVersion}-theme-option`) ||
    defaultSettings.themeOption,
  wallpaper,
  handleAttachTitle(value) {
    localStorage.setItem(`${apiVersion}-attach-title`, value);
    settings.attachTitle = value;
    bc.postMessage({ attachTitle: value });
  },
  handleCustomColor(value) {
    localStorage.setItem(`${apiVersion}-custom-color`, value);
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
      await localForage.setItem(`${apiVersion}-custom-image`, image);
      settings.customImage = imageURI;
      settings.handleWallpaper("custom-image");
      bc.postMessage({ customImage: imageURI });
    };
    i.click();
  },
  handleDefaultFolder(value) {
    localStorage.setItem(`${apiVersion}-default-folder`, value);
    settings.defaultFolder = value;
    bc.postMessage({ defaultFolder: value });
  },
  handleDialColors(id, value) {
    if (value === "") {
      remove(settings.dialColors, id);
    } else {
      set(settings.dialColors, id, value);
    }
    localStorage.setItem(
      `${apiVersion}-dial-colors`,
      JSON.stringify(settings.dialColors),
    );
    bc.postMessage({
      dialColors: { ...settings.dialColors },
    });
  },
  handleMaxColumns(value) {
    localStorage.setItem(`${apiVersion}-max-columns`, value);
    settings.maxColumns = value;
    bc.postMessage({ maxColumns: value });
  },
  handleNewTab(value) {
    localStorage.setItem(`${apiVersion}-new-tab`, value);
    settings.newTab = value;
    bc.postMessage({ newTab: value });
  },
  handleShowTitle(value) {
    localStorage.setItem(`${apiVersion}-show-title`, value);
    settings.showTitle = value;
    bc.postMessage({ showTitle: value });
  },
  handleSwitchTitle(value) {
    localStorage.setItem(`${apiVersion}-switch-title`, value);
    settings.switchTitle = value;
    bc.postMessage({ switchTitle: value });
  },
  handleThemeOption(value) {
    localStorage.setItem(`${apiVersion}-theme-option`, value);
    settings.themeOption = value;
    helpers.toggleThemeBackground(
      value === "System Theme"
        ? settings.colorScheme
        : value === "Dark"
          ? "color-scheme-dark"
          : "color-scheme-light",
    );
    bc.postMessage({ themeOption: value });
  },
  handleWallpaper(value) {
    localStorage.setItem(`${apiVersion}-wallpaper`, value);
    settings.wallpaper = value;
    bc.postMessage({ wallpaper: value });
  },
  hideAlertBanner() {
    settings.showAlertBanner = false;
  },
  resetCustomImage() {
    localForage.removeItem(`${apiVersion}-custom-image`);
    settings.customImage = "";
    bc.postMessage({ customImage: "" });
    if (settings.wallpaper === "custom-image") {
      settings.resetWallpaper();
    }
  },
  resetDialColors() {
    localStorage.setItem(`${apiVersion}-dial-colors`, "{}");
    settings.dialColors = {};
    bc.postMessage({ dialColors: {} });
  },
  resetSettings() {
    settings.handleAttachTitle(defaultSettings.attachTitle);
    settings.handleCustomColor(defaultSettings.customColor);
    settings.resetCustomImage();
    settings.resetDialColors();
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
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark-wallpaper"
        : "light-wallpaper",
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
            await localForage.setItem(`${apiVersion}-custom-image`, image);
            const imageURI = URL.createObjectURL(image);
            settings.customImage = imageURI;
            bc.postMessage({ customImage: imageURI });
          } else {
            settings.resetCustomImage();
          }
          settings.handleAttachTitle(backup.attachTitle);
          settings.handleCustomColor(backup.customColor);
          settings.handleDefaultFolder(backup.defaultFolder);
          localStorage.setItem(
            `${apiVersion}-dial-colors`,
            JSON.stringify(backup.dialColors),
          );
          settings.dialColors = backup.dialColors;
          bc.postMessage({ dialColors: backup.dialColors });
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
      maxColumns: settings.maxColumns,
      newTab: settings.newTab,
      showTitle: settings.showTitle,
      switchTitle: settings.switchTitle,
      themeOption: settings.themeOption,
      wallpaper: settings.wallpaper,
    };
    const image = await localForage.getItem(`${apiVersion}-custom-image`);
    if (image) {
      const base64 = await blobToBase64(image);
      backup.customImage = base64;
    }
    downloadBackup(backup);
  },
});

const helpers = setupHelpers(settings);
