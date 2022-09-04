import { useState, useContext, createContext, useEffect, useRef } from "react";
import localForage from "localforage/src/localforage.js";
import browser from "webextension-polyfill";

import { appVersion } from "../common/version.js";

const OptionsContext = createContext();

// For setting Options (don't change unless something breaks)
const apiVersion = "2.0";

export function ProvideOptions({ children }) {
  const [wallpaper, setWallpaper] = useState();
  const [customColor, setCustomColor] = useState();
  const [customImage, setCustomImage] = useState();
  const [colorScheme, setColorScheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "color-scheme-dark"
      : "color-scheme-light"
  );
  const [themeOption, setThemeOption] = useState("System Theme");
  const [defaultFolder, setFolder] = useState();
  const [maxColumns, setMaxColumns] = useState();
  const [newTab, setNewTab] = useState();
  const [showTitle, setShowTitle] = useState(true);
  const [switchTitle, setSwitchTitle] = useState(false);
  const [attachTitle, setAttachTitle] = useState(false);
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [firstRun, setFirstRun] = useState(false);

  function handleWallpaper(wallpaper) {
    browser.storage.local.set({ [`${apiVersion}-wallpaper`]: wallpaper });
  }

  function handleCustomColor(value) {
    handleWallpaper("custom-color");
    browser.storage.local.set({ [`${apiVersion}-custom-color`]: value });
  }

  function handleCustomImage() {
    const i = document.createElement("input");
    i.type = "File";
    i.onchange = (e) => {
      const image = e.target.files[0];
      localForage.setItem("custom-image", image);
      browser.storage.local.set({
        "custom-image": `custom-image${Math.floor(Math.random() * 10000)}`,
      });
      handleWallpaper(`custom-image${Math.floor(Math.random() * 10000)}`);
    };
    i.click();
  }

  function getCustomImage() {
    localForage.getItem("custom-image").then((image) => {
      if (image) {
        const imageURI = URL.createObjectURL(image);
        setCustomImage(imageURI);
      }
    });
  }

  function handleThemeOption(e) {
    browser.storage.local.set({
      [`${apiVersion}-theme-option`]: e.target.value,
    });
    setThemeOption(e.target.value);
    if (wallpaper === "dark-wallpaper" || wallpaper === "light-wallpaper") {
      e.target.value === "System Theme"
        ? colorScheme === "color-scheme-dark"
          ? handleWallpaper("dark-wallpaper")
          : handleWallpaper("light-wallpaper")
        : e.target.value === "Dark"
        ? handleWallpaper("dark-wallpaper")
        : handleWallpaper("light-wallpaper");
    }
  }

  function handleDefaultFolder(e) {
    browser.storage.local.set({
      [`${apiVersion}-default-folder`]: e.target.value,
    });
  }

  function handleMaxColumns(e) {
    browser.storage.local.set({
      [`${apiVersion}-max-columns`]: e.target.value,
    });
  }

  function handleNewTab(value) {
    browser.storage.local.set({ [`${apiVersion}-new-tab`]: value });
  }

  function handleShowTitle(value) {
    browser.storage.local.set({ [`${apiVersion}-show-title`]: value });
  }

  function handleSwitchTitle(value) {
    browser.storage.local.set({ [`${apiVersion}-switch-title`]: value });
  }

  function handleAttachTitle(value) {
    browser.storage.local.set({ [`${apiVersion}-attach-title`]: value });
  }

  function hideAlertBanner() {
    setShowAlertBanner(false);
  }

  function changeOptions(change) {
    if (change[`${apiVersion}-wallpaper`]) {
      setWallpaper(
        change[`${apiVersion}-wallpaper`]["newValue"].includes("custom-image")
          ? "custom-image"
          : change[`${apiVersion}-wallpaper`]["newValue"]
      );
    } else if (change["custom-image"]) {
      getCustomImage();
    } else if (change[`${apiVersion}-custom-color`]) {
      setCustomColor(change[`${apiVersion}-custom-color`]["newValue"]);
      setWallpaper("custom-color");
    } else if (change[`${apiVersion}-theme-option`]) {
      setThemeOption(change[`${apiVersion}-theme-option`]["newValue"]);
    } else if (change[`${apiVersion}-default-folder`]) {
      setFolder(change[`${apiVersion}-default-folder`]["newValue"]);
    } else if (change[`${apiVersion}-max-columns`]) {
      setMaxColumns(change[`${apiVersion}-max-columns`]["newValue"]);
    } else if (change[`${apiVersion}-new-tab`]) {
      setNewTab(change[`${apiVersion}-new-tab`]["newValue"]);
    } else if (change[`${apiVersion}-show-title`]) {
      setShowTitle(change[`${apiVersion}-show-title`]["newValue"]);
    } else if (change[`${apiVersion}-switch-title`]) {
      setSwitchTitle(change[`${apiVersion}-switch-title`]["newValue"]);
    } else if (change[`${apiVersion}-attach-title`]) {
      setAttachTitle(change[`${apiVersion}-attach-title`]["newValue"]);
    }
  }

  useEffect(() => {
    browser.storage.local.get().then((results) => {
      const lastVersion = results["last-version"] || false;
      const wallpaper =
        results[`${apiVersion}-wallpaper`] ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark-wallpaper"
          : "light-wallpaper");
      const customColor = results[`${apiVersion}-custom-color`] || "";
      const themeOption =
        results[`${apiVersion}-theme-option`] || "System Theme";
      const defaultFolder = results[`${apiVersion}-default-folder`] || "1";
      const maxColumns = results[`${apiVersion}-max-columns`] || "7";
      const newTab = results[`${apiVersion}-new-tab`] || false;
      const showTitle = results[`${apiVersion}-show-title`] ?? true;
      const switchTitle = results[`${apiVersion}-switch-title`] || false;
      const attachTitle = results[`${apiVersion}-attach-title`] || false;

      if (!lastVersion) {
        // store version upon first run
        browser.storage.local.set({ "last-version": appVersion });
        setFirstRun(true);
        setShowAlertBanner(true);
      } else if (lastVersion < appVersion) {
        browser.storage.local.set({ "last-version": appVersion });
        setShowAlertBanner(true);
      }

      setWallpaper(
        wallpaper.includes("custom-image") ? "custom-image" : wallpaper
      );
      getCustomImage();
      setCustomColor(customColor);
      setThemeOption(themeOption);
      setFolder(defaultFolder);
      setMaxColumns(maxColumns);
      setNewTab(newTab);
      setShowTitle(showTitle);
      setSwitchTitle(switchTitle);
      setAttachTitle(attachTitle);
    });

    browser.storage.onChanged.addListener(changeOptions);

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", systemThemeChanged);

    return () => {
      browser.storage.onChanged.removeListener(changeOptions);
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", systemThemeChanged);
    };
  }, []);

  const wallpaperRef = useRef();
  const themeOptionRef = useRef();

  useEffect(() => {
    if (wallpaper) {
      // This is neccessary for reading the value in systemThemeChanged listener
      wallpaperRef.current = wallpaper;
    }
  }, [wallpaper]);

  useEffect(() => {
    if (themeOption) {
      // This is neccessary for reading the value in systemThemeChanged listener
      themeOptionRef.current = themeOption;

      // This is neccessary to detect theme changes that happened while set to Light or Dark when switching back to Automatic.
      if (themeOption === "System Theme") {
        const matches = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (
          wallpaperRef.current === "dark-wallpaper" ||
          wallpaperRef.current === "light-wallpaper"
        ) {
          if (matches) {
            handleWallpaper("dark-wallpaper");
          } else {
            handleWallpaper("light-wallpaper");
          }
        }

        if (matches) {
          setColorScheme("color-scheme-dark");
        } else {
          setColorScheme("color-scheme-light");
        }
      }
    }
  }, [themeOption]);

  function systemThemeChanged(e) {
    if (themeOptionRef.current === "System Theme") {
      if (
        wallpaperRef.current === "dark-wallpaper" ||
        wallpaperRef.current === "light-wallpaper"
      ) {
        if (e.matches) {
          handleWallpaper("dark-wallpaper");
        } else {
          handleWallpaper("light-wallpaper");
        }
      }
      if (e.matches) {
        setColorScheme("color-scheme-dark");
      } else {
        setColorScheme("color-scheme-light");
      }
    }
  }

  function openOptions() {
    browser.tabs.create({
      url: browser.runtime.getURL("options.html"),
    });
  }

  return (
    <OptionsContext.Provider
      value={{
        newTab,
        defaultFolder,
        colorScheme,
        wallpaper,
        maxColumns,
        showAlertBanner,
        customColor,
        customImage,
        themeOption,
        showTitle,
        switchTitle,
        attachTitle,
        firstRun,
        handleWallpaper,
        handleNewTab,
        handleDefaultFolder,
        handleMaxColumns,
        hideAlertBanner,
        handleCustomColor,
        handleCustomImage,
        handleThemeOption,
        handleShowTitle,
        handleSwitchTitle,
        handleAttachTitle,
        openOptions,
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
}

export const useOptions = () => {
  return useContext(OptionsContext);
};
