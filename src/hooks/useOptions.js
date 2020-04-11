import React, { useState, useContext, createContext, useEffect } from "react";

const OptionsContext = createContext();

export function ProvideOptions({ children }) {
  const [appearance, setAppearance] = useState();
  const [wallpaper, setWallpaper] = useState();
  const [defaultFolder, setFolder] = useState();
  const [newTab, setNewTab] = useState();
  const [fullWidth, setFullWidth] = useState();
  const [useHomepage, setUseHomepage] = useState();

  function handleAppearance(appearance) {
    browser.storage.local.set({ appearance });
    setAppearance(appearance);
  }

  function handleWallpaper(wallpaper) {
    browser.storage.local.set({ wallpaper });
    setWallpaper(wallpaper);
  }

  function handleDefaultFolder(e) {
    browser.storage.local.set({ defaultFolder: e.target.value });
    setFolder(e.target.value);
  }

  function handleNewTab(newTab) {
    browser.storage.local.set({ newTab });
    setNewTab(newTab);
  }

  function handleFullWidth(fullWidth) {
    browser.storage.local.set({ fullWidth });
    setFullWidth(fullWidth);
  }

  function handleUseHomepage(useHomepage) {
    browser.storage.local.set({ useHomepage });
    setUseHomepage(useHomepage);
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
    } else if (change["fullWidth"]) {
      setFullWidth(change["fullWidth"]["newValue"]);
    } else if (change["useHomepage"]) {
      setUseHomepage(change["useHomepage"]["newValue"]);
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
      .get({ fullWidth: false })
      .then(({ fullWidth }) => setFullWidth(fullWidth));

    browser.storage.local
      .get({ useHomepage: false })
      .then(({ useHomepage }) => setUseHomepage(useHomepage));

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
        fullWidth,
        useHomepage,
        handleAppearance,
        handleWallpaper,
        handleNewTab,
        handleDefaultFolder,
        handleFullWidth,
        handleUseHomepage,
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
}

export const useOptions = () => {
  return useContext(OptionsContext);
};
