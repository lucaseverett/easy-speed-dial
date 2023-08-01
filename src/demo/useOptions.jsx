import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import localForage from "localforage";
import { appVersion } from "../common/version.js";

const OptionsContext = createContext();

// For setting Options (don't change unless something breaks)
const apiVersion = "2.0";

function parse(state, value) {
  return JSON.parse(value);
}

export const ProvideOptions = memo(function ProvideOptions({ children }) {
  const [wallpaper, setWallpaper] = useState();
  const [customColor, setCustomColor] = useState();
  const [customImage, setCustomImage] = useState();
  const [colorScheme, setColorScheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "color-scheme-dark"
      : "color-scheme-light",
  );
  const [themeOption, setThemeOption] = useState("System Theme");
  const [defaultFolder, setFolder] = useState("1");
  const [maxColumns, setMaxColumns] = useState();
  const [newTab, setNewTab] = useReducer(parse, false);
  const [showTitle, setShowTitle] = useReducer(parse, true);
  const [switchTitle, setSwitchTitle] = useReducer(parse, false);
  const [attachTitle, setAttachTitle] = useReducer(parse, false);
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [firstRun, setFirstRun] = useState(false);

  const handleWallpaper = useCallback(
    (value) => {
      localStorage.setItem(`${apiVersion}-wallpaper`, value);
      setWallpaper(value.includes("custom-image") ? "custom-image" : value);
    },
    [setWallpaper],
  );

  const handleCustomColor = useCallback(
    (value) => {
      setCustomColor(value);
      handleWallpaper("custom-color");
      localStorage.setItem(`${apiVersion}-custom-color`, value);
    },
    [handleWallpaper],
  );

  const handleCustomImage = useCallback(() => {
    const i = document.createElement("input");
    i.type = "File";
    i.onchange = (e) => {
      const image = e.target.files[0];
      localForage.setItem("custom-image", image);
      const imageURI = URL.createObjectURL(image);
      setCustomImage(imageURI);
      handleWallpaper(`custom-image${Math.floor(Math.random() * 10000)}`);
    };
    i.click();
  }, [handleWallpaper]);

  const getCustomImage = useCallback(() => {
    localForage.getItem("custom-image").then((image) => {
      if (image) {
        const imageURI = URL.createObjectURL(image);
        setCustomImage(imageURI);
      }
    });
  }, [setCustomImage]);

  const handleThemeOption = useCallback(
    (e) => {
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
    },
    [setThemeOption, wallpaper, colorScheme, handleWallpaper],
  );

  const handleDefaultFolder = useCallback(
    (e) => {
      localStorage.setItem(`${apiVersion}-default-folder`, e.target.value);
      setFolder(e.target.value);
    },
    [setFolder],
  );

  const handleMaxColumns = useCallback(
    (e) => {
      localStorage.setItem(`${apiVersion}-max-columns`, e.target.value);
      setMaxColumns(e.target.value);
    },
    [setMaxColumns],
  );

  const handleNewTab = useCallback(
    (value) => {
      localStorage.setItem(`${apiVersion}-new-tab`, value);
      setNewTab(value);
    },
    [setNewTab],
  );

  const handleShowTitle = useCallback(
    (value) => {
      localStorage.setItem(`${apiVersion}-show-title`, value);
      setShowTitle(value);
    },
    [setShowTitle],
  );

  const handleSwitchTitle = useCallback(
    (value) => {
      localStorage.setItem(`${apiVersion}-switch-title`, value);
      setSwitchTitle(value);
    },
    [setSwitchTitle],
  );

  const handleAttachTitle = useCallback(
    (value) => {
      localStorage.setItem(`${apiVersion}-attach-title`, value);
      setAttachTitle(value);
    },
    [setAttachTitle],
  );

  const hideAlertBanner = useCallback(() => {
    setShowAlertBanner(false);
  }, [setShowAlertBanner]);

  const changeOptions = useCallback(
    ({ key, newValue }) => {
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
      } else if (key === `${apiVersion}-attach-title`) {
        setAttachTitle(newValue);
      }
    },
    [getCustomImage],
  );

  const systemThemeChanged = useCallback(
    (e) => {
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
    },
    [handleWallpaper],
  );

  useEffect(() => {
    const lastVersion = localStorage.getItem("last-version") || false;
    if (!lastVersion) {
      // store version upon first run
      localStorage.setItem("last-version", appVersion);
      setFirstRun(true);
      setShowAlertBanner(true);
    } else if (lastVersion < appVersion) {
      localStorage.setItem("last-version", appVersion);
      setShowAlertBanner(true);
    }

    const wallpaper = localStorage.getItem(`${apiVersion}-wallpaper`);
    setWallpaper(
      wallpaper?.includes("custom-image")
        ? "custom-image"
        : wallpaper
        ? wallpaper
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark-wallpaper"
        : "light-wallpaper",
    );
    getCustomImage();
    setCustomColor(localStorage.getItem(`${apiVersion}-custom-color` || ""));
    setThemeOption(
      localStorage.getItem(`${apiVersion}-theme-option`) || "System Theme",
    );
    setFolder(localStorage.getItem(`${apiVersion}-default-folder`) || "1");
    setMaxColumns(localStorage.getItem(`${apiVersion}-max-columns`) || "7");
    setNewTab(localStorage.getItem(`${apiVersion}-new-tab`) || false);
    setShowTitle(localStorage.getItem(`${apiVersion}-show-title`) ?? true);
    setSwitchTitle(localStorage.getItem(`${apiVersion}-switch-title`) || false);
    setAttachTitle(localStorage.getItem(`${apiVersion}-attach-title`) || false);

    window.addEventListener("storage", changeOptions);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", systemThemeChanged);

    return () => {
      window.removeEventListener("storage", changeOptions);
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", systemThemeChanged);
    };
  }, [changeOptions, getCustomImage, systemThemeChanged]);

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
          "(prefers-color-scheme: dark)",
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
  }, [handleWallpaper, themeOption]);

  const openOptions = useCallback(() => {
    window.open("/options.html", "_blank");
  }, []);

  const contextValue = useMemo(
    () => ({
      newTab,
      attachTitle,
      colorScheme,
      customColor,
      customImage,
      defaultFolder,
      firstRun,
      handleAttachTitle,
      handleCustomColor,
      handleCustomImage,
      handleDefaultFolder,
      handleMaxColumns,
      handleNewTab,
      handleShowTitle,
      handleSwitchTitle,
      handleThemeOption,
      handleWallpaper,
      hideAlertBanner,
      maxColumns,
      openOptions,
      showAlertBanner,
      showTitle,
      switchTitle,
      themeOption,
      wallpaper,
    }),
    [
      attachTitle,
      colorScheme,
      customColor,
      customImage,
      defaultFolder,
      firstRun,
      handleAttachTitle,
      handleCustomColor,
      handleCustomImage,
      handleDefaultFolder,
      handleMaxColumns,
      handleNewTab,
      handleShowTitle,
      handleSwitchTitle,
      handleThemeOption,
      handleWallpaper,
      hideAlertBanner,
      maxColumns,
      newTab,
      openOptions,
      showAlertBanner,
      showTitle,
      switchTitle,
      themeOption,
      wallpaper,
    ],
  );

  return (
    <OptionsContext.Provider value={contextValue}>
      {children}
    </OptionsContext.Provider>
  );
});

export const useOptions = () => {
  return useContext(OptionsContext);
};
