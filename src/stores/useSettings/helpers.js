import classNames from "classnames";
import { autorun, reaction } from "mobx";

// ==========================
// BACKUP/RESTORE HELPERS
// ==========================

export function base64ToBlob(base64) {
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

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function downloadBackup(obj) {
  const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(
    JSON.stringify(obj),
  )}`;
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "easy-backup.json";
  a.click();
}

export function setupHelpers(settings) {
  const helpers = {
    // ==========================
    // TOGGLE THEME/BACKGROUND
    // ==========================

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
        helpers.toggleThemeBackground(
          e.matches ? "color-scheme-dark" : "color-scheme-light",
        );
        if (e.matches) {
          settings.colorScheme = "color-scheme-dark";
        } else {
          settings.colorScheme = "color-scheme-light";
        }
      }
    },
  };

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", helpers.systemThemeChanged);

  reaction(
    () => settings.themeOption,
    (themeOption) => {
      if (themeOption === "System Theme") {
        const isDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;

        if (
          ["dark-wallpaper", "light-wallpaper"].includes(settings.wallpaper)
        ) {
          settings.handleWallpaper(
            isDarkMode ? "dark-wallpaper" : "light-wallpaper",
          );
        }

        if (["HorizonDark", "HorizonLight"].includes(settings.wallpaper)) {
          settings.handleWallpaper(isDarkMode ? "HorizonDark" : "HorizonLight");
        }

        settings.colorScheme = isDarkMode
          ? "color-scheme-dark"
          : "color-scheme-light";
      }
    },
  );

  // ==========================
  // CLASSNAMES FROM SETTINGS
  // ==========================

  const userAgent = navigator.userAgent.toLowerCase();
  const isMacOS = userAgent.includes("macintosh");
  const isChrome = userAgent.includes("chrome");

  autorun(() => {
    document.documentElement.className = classNames(
      settings.themeOption === "System Theme"
        ? settings.colorScheme
        : settings.themeOption === "Light"
          ? "color-scheme-light"
          : "color-scheme-dark",
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
      settings.wallpaper === "custom-color" && settings.customColor
        ? settings.customColor
        : settings.wallpaper
          ? null
          : settings.themeOption === "System Theme"
            ? settings.colorScheme === "color-scheme-dark"
              ? "#212121"
              : "#f5f5f5"
            : settings.themeOption === "Light"
              ? "#f5f5f5"
              : "#212121",
    );
  });

  return helpers;
}
