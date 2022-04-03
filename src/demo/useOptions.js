import {
  useState,
  useContext,
  createContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import localForage from "localforage/src/localforage.js";
import { appVersion } from "../common/version.js";

const OptionsContext = createContext();

// For setting Options (don't change unless something breaks)
const apiVersion = "2.0";

function parse(state, value) {
  return JSON.parse(value);
}

export function ProvideOptions({ children }) {
  const [wallpaper, setWallpaper] = useState();
  const [customColor, setCustomColor] = useState();
  const [customImage, setCustomImage] = useState();
  const [colorScheme, setColorScheme] = useState();
  const [themeOption, setThemeOption] = useState("System Theme");
  const [defaultFolder, setFolder] = useState();
  const [maxColumns, setMaxColumns] = useState();
  const [newTab, setNewTab] = useReducer(parse, false);
  const [showTitle, setShowTitle] = useReducer(parse, true);
  const [switchTitle, setSwitchTitle] = useReducer(parse, false);
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [firstRun, setFirstRun] = useState(false);

  function handleWallpaper(value) {
    localStorage.setItem(`${apiVersion}-wallpaper`, value);
    setWallpaper(value.includes("custom-image") ? "custom-image" : value);
  }

  function handleCustomColor(value) {
    setCustomColor(value);
    handleWallpaper("custom-color");
    localStorage.setItem(`${apiVersion}-custom-color`, value);
  }

  function handleCustomImage() {
    let i = document.createElement("input");
    i.type = "File";
    i.onchange = (e) => {
      let image = e.target.files[0];
      localForage.setItem("custom-image", image);
      let imageURI = URL.createObjectURL(image);
      setCustomImage(imageURI);
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
    localStorage.setItem(`${apiVersion}-theme-option`, e.target.value);
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
    localStorage.setItem(`${apiVersion}-default-folder`, e.target.value);
    setFolder(e.target.value);
  }

  function handleMaxColumns(e) {
    localStorage.setItem(`${apiVersion}-max-columns`, e.target.value);
    setMaxColumns(e.target.value);
  }

  function handleNewTab(value) {
    localStorage.setItem(`${apiVersion}-new-tab`, value);
    setNewTab(value);
  }

  function handleShowTitle(value) {
    localStorage.setItem(`${apiVersion}-show-title`, value);
    setShowTitle(value);
  }

  function handleSwitchTitle(value) {
    localStorage.setItem(`${apiVersion}-switch-title`, value);
    setSwitchTitle(value);
  }

  function hideAlertBanner() {
    setShowAlertBanner(false);
  }

  function changeOptions({ key, newValue }) {
    if (key === `${apiVersion}-wallpaper`) {
      if (newValue.includes("custom-image")) {
        getCustomImage();
        setWallpaper("custom-image");
      } else {
        setWallpaper(newValue);
      }
    } else if (key === `${apiVersion}-custom-color`) {
      setCustomColor(newValue);
      setWallpaper("custom-color");
    } else if (key === `${apiVersion}-theme-option`) {
      setThemeOption(newValue);
    } else if (key === `${apiVersion}-default-folder`) {
      setFolder(newValue);
    } else if (key === `${apiVersion}-max-columns`) {
      setMaxColumns(newValue);
    } else if (key === `${apiVersion}-new-tab`) {
      setNewTab(newValue);
    } else if (key === `${apiVersion}-show-title`) {
      setShowTitle(newValue);
    } else if (key === `${apiVersion}-switch-title`) {
      setSwitchTitle(newValue);
    }
  }

  useEffect(() => {
    let lastVersion = localStorage.getItem("last-version") || false;

    if (!lastVersion) {
      // store version upon first run
      localStorage.setItem("last-version", appVersion);
      setFirstRun(true);
      setShowAlertBanner(true);
    } else if (lastVersion < appVersion) {
      localStorage.setItem("last-version", appVersion);
      setShowAlertBanner(true);
    }

    let wallpaper = localStorage.getItem(`${apiVersion}-wallpaper`);
    setWallpaper(
      wallpaper && wallpaper.includes("custom-image")
        ? "custom-image"
        : wallpaper
        ? wallpaper
        : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark-wallpaper"
        : "light-wallpaper"
    );
    getCustomImage();
    setCustomColor(localStorage.getItem(`${apiVersion}-custom-color` || ""));
    setThemeOption(
      localStorage.getItem(`${apiVersion}-theme-option`) || "System Theme"
    );
    setColorScheme(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "color-scheme-dark"
        : "color-scheme-light"
    );
    setFolder(localStorage.getItem(`${apiVersion}-default-folder`) || "1");
    setMaxColumns(localStorage.getItem(`${apiVersion}-max-columns`) || "7");
    setNewTab(localStorage.getItem(`${apiVersion}-new-tab`) || false);
    setShowTitle(localStorage.getItem(`${apiVersion}-show-title`) ?? true);
    setSwitchTitle(localStorage.getItem(`${apiVersion}-switch-title`) || false);

    window.addEventListener("storage", changeOptions);

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addListener(systemThemeChanged);

    return () => {
      window.removeEventListener("storage", changeOptions);
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeListener(systemThemeChanged);
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
    window.open("/options", "_blank");
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
