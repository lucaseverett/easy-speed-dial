import localForage from "localforage";
import { makeAutoObservable, remove, set } from "mobx";
import browser from "webextension-polyfill";

import { apiVersion, appVersion } from "#common/version";
import {
  base64ToBlob,
  blobToBase64,
  downloadBackup,
  setupHelpers,
} from "../helpers";

/*
 * Firefox storage allows images to be stored as blob.
 * Chrome storage requires blobs to be converted to base64.
 * Extension code is set to convert to base64 for consistency.
 */

// ==========================
// SETUP
// ==========================

async function getCustomImage() {
  try {
    const { [`${apiVersion}-custom-image`]: image } =
      await browser.storage.local.get({ [`${apiVersion}-custom-image`]: "" });
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

const storage = await browser.storage.local.get();
const lastVersion = storage["last-version"] || false;
const isUpgrade = lastVersion < appVersion;
browser.storage.local.set({ "last-version": appVersion });
let wallpaper = storage[`${apiVersion}-wallpaper`];

if (__CHROME__) {
  // Copy image from localForage to localStorage. Remove this code in future release.
  try {
    const image = await localForage.getItem("custom-image");
    if (image) {
      const base64Image = await blobToBase64(image);
      await browser.storage.local.set({
        [`${apiVersion}-custom-image`]: base64Image,
      });
      localForage.removeItem("custom-image");
    }
  } catch (err) {
    console.error("Error saving custom image to localStorage", err);
  }
} else if (__FIREFOX__) {
  // Rename "custom-image" to `${apiVersion}-custom-image`. Remove this code in future release.
  const { ["custom-image"]: image } =
    await browser.storage.local.get("custom-image");
  if (image) {
    const base64Image = await blobToBase64(image);
    await browser.storage.local.set({
      [`${apiVersion}-custom-image`]: base64Image,
    });
    browser.storage.local.remove("custom-image");
  }
}

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
  defaultFolder: "",
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

if (__CHROME__) {
  defaultSettings.defaultFolder = "1";
} else if (__FIREFOX__) {
  defaultSettings.defaultFolder = "toolbar_____";
}

export const settings = makeAutoObservable({
  attachTitle:
    storage[`${apiVersion}-attach-title`] ?? defaultSettings.attachTitle,
  colorScheme: defaultSettings.colorScheme,
  customColor:
    storage[`${apiVersion}-custom-color`] || defaultSettings.customColor,
  customImage,
  defaultFolder:
    storage[`${apiVersion}-default-folder`] || defaultSettings.defaultFolder,
  dialColors:
    storage[`${apiVersion}-dial-colors`] || defaultSettings.dialColors,
  firstRun: defaultSettings.firstRun,
  maxColumns:
    storage[`${apiVersion}-max-columns`] || defaultSettings.maxColumns,
  newTab: storage[`${apiVersion}-new-tab`] ?? defaultSettings.newTab,
  showAlertBanner: defaultSettings.showAlertBanner,
  showTitle: storage[`${apiVersion}-show-title`] ?? defaultSettings.showTitle,
  switchTitle:
    storage[`${apiVersion}-switch-title`] ?? defaultSettings.switchTitle,
  themeOption:
    storage[`${apiVersion}-theme-option`] || defaultSettings.themeOption,
  wallpaper,
  handleAttachTitle(value) {
    browser.storage.local.set({ [`${apiVersion}-attach-title`]: value });
    settings.attachTitle = value;
    bc.postMessage({ attachTitle: value });
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
    if (value === "") {
      remove(settings.dialColors, id);
    } else {
      set(settings.dialColors, id, value);
    }
    browser.storage.local.set({
      [`${apiVersion}-dial-colors`]: settings.dialColors,
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
    const { [`${apiVersion}-custom-image`]: image } =
      await browser.storage.local.get({
        [`${apiVersion}-custom-image`]: "",
      });
    if (image) {
      backup.customImage = image;
    }
    downloadBackup(backup);
  },
});

const helpers = setupHelpers(settings);
