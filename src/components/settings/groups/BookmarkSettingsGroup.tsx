import type { SettingsGroupProps } from "./settingsGroupUtils";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { CaretDown } from "#components/icons/CaretDown.tsx";
import { Switch } from "#components/Switch";
import { bookmarks } from "#stores/bookmarks";
import { settings } from "#stores/settings";
import { getId } from "./settingsGroupUtils";

export const BookmarkSettingsGroup = observer(function BookmarkSettingsGroup({
  idPrefix,
}: SettingsGroupProps) {
  const [defaultFolderValue, setDefaultFolderValue] = useState("");
  const defaultFolderTitleId = getId(idPrefix, "default-folder-title");
  const defaultFolderDescriptionId = getId(
    idPrefix,
    "default-folder-description",
  );
  const dragAndDropTitleId = getId(idPrefix, "drag-and-drop-title");
  const dragAndDropDescriptionId = getId(idPrefix, "drag-and-drop-description");
  const openNewTabsTitleId = getId(idPrefix, "open-new-tabs-title");
  const openNewTabsDescriptionId = getId(idPrefix, "open-new-tabs-description");
  const defaultFolder = settings.defaultFolder;

  useEffect(() => {
    let active = true;

    const setDefaultFolder = async () => {
      const isValid =
        defaultFolder && typeof defaultFolder === "string"
          ? await bookmarks.validateFolderExists(defaultFolder)
          : false;
      const value = isValid
        ? defaultFolder
        : await bookmarks.getBookmarksBarId();
      if (active) setDefaultFolderValue(value as string);
    };

    setDefaultFolder();

    return () => {
      active = false;
    };
  }, [defaultFolder]);

  return (
    <>
      <div className="setting-wrapper setting-group">
        <div className="setting-label">
          <div className="setting-title" id={defaultFolderTitleId}>
            Default Folder
          </div>
          <div className="setting-description" id={defaultFolderDescriptionId}>
            The bookmark folder that fills your speed dial.
          </div>
        </div>
        <div className="setting-option select">
          <select
            onChange={(e) => settings.handleDefaultFolder(e.target.value)}
            value={defaultFolderValue}
            className="input"
            aria-labelledby={defaultFolderTitleId}
            aria-describedby={defaultFolderDescriptionId}
          >
            {bookmarks.folders.map(({ id, title }) => (
              <option value={id} key={id}>
                {title}
              </option>
            ))}
          </select>
          <CaretDown />
        </div>
      </div>

      <div className="setting-wrapper setting-group">
        <div className="setting-label">
          <div className="setting-title" id={dragAndDropTitleId}>
            Drag and Drop
          </div>
          <div className="setting-description" id={dragAndDropDescriptionId}>
            Drag dials to reorder them or move them into folders.
          </div>
        </div>
        <div className="setting-option toggle">
          <Switch
            aria-labelledby={dragAndDropTitleId}
            aria-describedby={dragAndDropDescriptionId}
            onClick={() => settings.handleDragAndDrop(!settings.dragAndDrop)}
            className="switch-root"
            checked={settings.dragAndDrop as boolean}
          >
            <span className="switch-thumb" />
          </Switch>
        </div>
      </div>

      <div className="setting-wrapper setting-group">
        <div className="setting-label">
          <div className="setting-title" id={openNewTabsTitleId}>
            Open in New Tab
          </div>
          <div className="setting-description" id={openNewTabsDescriptionId}>
            Clicking a dial opens the link in a new browser tab.
          </div>
        </div>
        <div className="setting-option toggle">
          <Switch
            aria-labelledby={openNewTabsTitleId}
            aria-describedby={openNewTabsDescriptionId}
            onClick={() => settings.handleNewTab(!settings.newTab)}
            className="switch-root"
            checked={settings.newTab as boolean}
          >
            <span className="switch-thumb" />
          </Switch>
        </div>
      </div>
    </>
  );
});
