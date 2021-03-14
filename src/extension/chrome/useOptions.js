import { useState, useContext, createContext, useEffect, useRef } from "react";
import localForage from "localforage/src/localforage.js";
import browser from "webextension-polyfill";

const OptionsContext = createContext();

// For setting Options
const apiVersion = "2.0";

// For displaying Alert Banner
const appVersion = "2.0";

export function ProvideOptions({ children }) {
  const [wallpaper, setWallpaper] = useState();
  const [customColor, setCustomColor] = useState();
  const [customImage, setCustomImage] = useState();
  const [colorScheme, setColorScheme] = useState();
  const [themeOption, setThemeOption] = useState("System Theme");
  const [defaultFolder, setFolder] = useState();
  const [maxColumns, setMaxColumns] = useState();
  const [newTab, setNewTab] = useState();
  const [switchTitle, setSwitchTitle] = useState(false);
  const [showAlertBanner, setShowAlertBanner] = useState(false);

  function handleWallpaper(wallpaper) {
    browser.storage.local.set({ [`${apiVersion}-wallpaper`]: wallpaper });
  }

  function handleCustomColor(value) {
    handleWallpaper("custom-color");
    browser.storage.local.set({ [`${apiVersion}-custom-color`]: value });
  }

  function handleCustomImage() {
    let i = document.createElement("input");
    i.type = "File";
    i.onchange = (e) => {
      let image = e.target.files[0];
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
        let imageURI = URL.createObjectURL(image);
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

  function handleSwitchTitle(value) {
    browser.storage.local.set({ [`${apiVersion}-switch-title`]: value });
  }

  function hideAlertBanner() {
    setShowAlertBanner(false);
    browser.storage.local.set({ "last-alert-banner": appVersion });
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
    } else if (change[`${apiVersion}-switch-title`]) {
      setSwitchTitle(change[`${apiVersion}-switch-title`]["newValue"]);
    }
  }

  useEffect(() => {
    browser.storage.local.get().then((results) => {
      let version = results["last-alert-banner"] || "0";
      let wallpaper =
        results[`${apiVersion}-wallpaper`] ||
        (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark-wallpaper"
          : "light-wallpaper");
      let customColor = results[`${apiVersion}-custom-color`] || "";
      let themeOption = results[`${apiVersion}-theme-option`] || "System Theme";
      let defaultFolder = results[`${apiVersion}-default-folder`] || "1";
      let maxColumns = results[`${apiVersion}-max-columns`] || "7";
      let newTab = results[`${apiVersion}-new-tab`] || false;
      let switchTitle = results[`${apiVersion}-switch-title`] || false;

      /*
        if (!version) {
          // first run
          hideAlertBanner();
        } else if (version < appVersion) {
          // updated version, show banner
          setShowAlertBanner(true);
        }
        
      if (version < appVersion) {
        // updated version, show banner
        setShowAlertBanner(true);
      }*/

      setWallpaper(
        wallpaper.includes("custom-image") ? "custom-image" : wallpaper
      );
      getCustomImage();
      setCustomColor(customColor);
      setThemeOption(themeOption);
      setColorScheme(
        window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "color-scheme-dark"
          : "color-scheme-light"
      );
      setFolder(defaultFolder);
      setMaxColumns(maxColumns);
      setNewTab(newTab);
      setSwitchTitle(switchTitle);
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

  let wallpaperRef = useRef();
  let themeOptionRef = useRef();

  useEffect(() => {
    if (wallpaper) {
      wallpaperRef.current = wallpaper;
    }
  }, [wallpaper]);

  useEffect(() => {
    if (themeOption) {
      themeOptionRef.current = themeOption;
    }
  }, [themeOption]);

  function systemThemeChanged(e) {
    if (themeOptionRef.current === "System Theme") {
      if (
        wallpaperRef.current === "dark-wallpaper" ||
        wallpaperRef.current === "light-wallpaper"
      ) {
        e.matches
          ? handleWallpaper("dark-wallpaper")
          : handleWallpaper("light-wallpaper");
      }
      e.matches
        ? setColorScheme("color-scheme-dark")
        : setColorScheme("color-scheme-light");
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
        switchTitle,
        handleWallpaper,
        handleNewTab,
        handleDefaultFolder,
        handleMaxColumns,
        hideAlertBanner,
        handleCustomColor,
        handleCustomImage,
        handleThemeOption,
        handleSwitchTitle,
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
