import React, { useState, useContext, createContext, useEffect } from "react";

const OptionsContext = createContext();

export function ProvideOptions({ children }) {
  const [appearance, setAppearance] = useState();
  const [wallpaper, setWallpaper] = useState();
  const [defaultFolder, setFolder] = useState();
  const [newTab, setNewTab] = useState();
  const [smallerDials, setSmallerDials] = useState();
  const [fullWidth, setFullWidth] = useState();

  function handleAppearance(value) {
    browser.storage.local.set({ appearance: value });
    setAppearance(value);
  }

  function handleWallpaper(value) {
    browser.storage.local.set({ wallpaper: value });
    setWallpaper(value);
  }

  function handleDefaultFolder(e) {
    browser.storage.local.set({ defaultFolder: e.target.value });
    setFolder(e.target.value);
  }

  function handleNewTab(value) {
    browser.storage.local.set({ newTab: value });
    setNewTab(value);
  }

  function handleSmallerDials(value) {
    browser.storage.local.set({ smallerDials: value });
    setSmallerDials(value);
  }

  function handleFullWidth(value) {
    browser.storage.local.set({ fullWidth: value });
    setFullWidth(value);
  }

  function changeOptions(change) {
    if (change["appearance"]) {
      setAppearance(change["appearance"]["newValue"]);
    } else if (change["wallpaper"]) {
      setWallpaper(change["wallpaper"]["newValue"]);
    } else if (change["defaultFolder"]) {
      setFolder(change["defaultFolder"]["newValue"]);
    } else if (change["newTab"]) {
      setNewTab(change["newTab"]["newValue"]);
    } else if (change["smallerDials"]) {
      setSmallerDials(change["smallerDials"]["newValue"]);
    } else if (change["fullWidth"]) {
      setFullWidth(change["fullWidth"]["newValue"]);
    }
  }

  useEffect(() => {
    browser.storage.local
      .get({ appearance: "light-appearance" })
      .then(({ appearance }) => setAppearance(appearance));

    browser.storage.local
      .get({ wallpaper: "light-wallpaper" })
      .then(({ wallpaper }) => setWallpaper(wallpaper));

    browser.storage.local
      .get({ defaultFolder: "toolbar_____" })
      .then(({ defaultFolder }) => setFolder(defaultFolder));

    browser.storage.local
      .get({ newTab: false })
      .then(({ newTab }) => setNewTab(newTab));

    browser.storage.local
      .get({ smallerDials: false })
      .then(({ smallerDials }) => setSmallerDials(smallerDials));

    browser.storage.local
      .get({ fullWidth: false })
      .then(({ fullWidth }) => setFullWidth(fullWidth));

    browser.storage.onChanged.addListener(changeOptions);

    return () => {
      browser.storage.onChanged.removeListener(changeOptions);
    };
  }, []);

  return (
    <OptionsContext.Provider
      value={{
        appearance,
        newTab,
        defaultFolder,
        wallpaper,
        smallerDials,
        fullWidth,
        handleAppearance,
        handleWallpaper,
        handleNewTab,
        handleSmallerDials,
        handleDefaultFolder,
        handleFullWidth
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
}

export const useOptions = () => {
  return useContext(OptionsContext);
};
