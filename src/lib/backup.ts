import type { FocusTarget } from "#lib/focus";
import type { SettingsStore } from "#stores/settings";

import { getStoredCustomImage, storageKeys } from "#lib/storage";
import { modals } from "#stores/modals";

export function selectJsonFile(
  onSelect: (contents: string) => void | Promise<void>,
) {
  const input = document.createElement("input");
  input.type = "File";
  input.accept = ".json";
  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (loadEvent: ProgressEvent<FileReader>) => {
      const result = loadEvent.target?.result;
      if (typeof result === "string") {
        await onSelect(result);
      }
    };
  };
  input.click();
}

export function downloadBackup(obj: Record<string, unknown>) {
  const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(
    JSON.stringify(obj),
  )}`;
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "easy-backup.json";
  a.click();
}

// Collect the current settings into a plain object for export.
export async function buildBackup(settings: SettingsStore) {
  const backup: Record<string, unknown> = {
    usePresetThumbnails: settings.usePresetThumbnails,
    showFavicons: settings.showFavicons,
    attachTitle: settings.attachTitle,
    customColor: settings.customColor,
    customImage: settings.customImage,
    defaultFolder: settings.defaultFolder,
    dialColors: settings.dialColors,
    dialImages: settings.dialImages,
    dialImageSizes: settings.dialImageSizes,
    dialSize: settings.dialSize,
    dragAndDrop: settings.dragAndDrop,
    gridSpacing: settings.gridSpacing,
    maxColumns: settings.maxColumns,
    newTab: settings.newTab,
    showDialBorders: settings.showDialBorders,
    showTitle: settings.showTitle,
    squareDials: settings.squareDials,
    switchTitle: settings.switchTitle,
    themeOption: settings.themeOption,
    transparentDials: settings.transparentDials,
    wallpaper: settings.wallpaper,
  };

  // The in-memory customImage is a blob URL; back up the stored base64 instead.
  const { [storageKeys.customImage]: image } = await getStoredCustomImage();
  if (image && typeof image === "string") {
    backup.customImage = image;
  }

  return backup;
}

function hasKey(backup: object, key: string) {
  return Object.prototype.hasOwnProperty.call(backup, key);
}

// Apply an exported backup to the settings store. Missing keys that predate a
// setting fall back to their legacy values rather than the current defaults.
// `focusAfterClosed` is propagated to any modal opened during import (Firefox
// favicon permission prompt) so focus returns to the originating control.
export async function applyBackup(
  settings: SettingsStore,
  contents: string,
  focusAfterClosed?: FocusTarget,
) {
  try {
    const backup = JSON.parse(contents);
    settings.resetSettings();

    if (backup.customImage) {
      await settings.restoreCustomImage(backup.customImage);
    }

    // Backups without usePresetThumbnails predate the setting, so preserve the
    // previous non-preset appearance instead of applying the new reset default.
    settings.handleUsePresetThumbnails(
      hasKey(backup, "usePresetThumbnails")
        ? backup.usePresetThumbnails
        : false,
    );
    // resetSettings has already turned favicons off and revoked any held
    // favicon permission via handleShowFavicons(false). If the backup wanted
    // favicons on, queue the confirm modal after import so the user can opt
    // back in (re-granting the permission) or dismiss it to stay off.
    let shouldOfferFaviconPermission = false;
    if (hasKey(backup, "showFavicons")) {
      if (backup.showFavicons) {
        shouldOfferFaviconPermission = true;
        // Leave showFavicons at false; the modal's Continue path will flip it
        // on after the permission grant.
      } else {
        settings.handleShowFavicons(false);
      }
    }
    if (hasKey(backup, "attachTitle")) {
      settings.handleAttachTitle(backup.attachTitle);
    }
    if (hasKey(backup, "customColor")) {
      settings._restoreCustomColor(backup.customColor);
    }
    if (hasKey(backup, "defaultFolder")) {
      settings.handleDefaultFolder(backup.defaultFolder);
    }
    if (hasKey(backup, "dialColors")) {
      settings.restoreDialColors(backup.dialColors);
    }
    if (hasKey(backup, "dialImages")) {
      settings.restoreDialImages(backup.dialImages, backup.dialImageSizes);
    } else if (hasKey(backup, "dialImageSizes")) {
      settings.restoreDialImageSizes(backup.dialImageSizes);
    }
    if (hasKey(backup, "dialSize")) {
      settings.handleDialSize(backup.dialSize);
    }
    if (hasKey(backup, "dragAndDrop")) {
      settings.handleDragAndDrop(backup.dragAndDrop);
    }
    // Backups without gridSpacing predate the setting, so preserve the legacy
    // spacious layout instead of applying the new reset default.
    settings.handleGridSpacing(
      hasKey(backup, "gridSpacing") ? backup.gridSpacing : "spacious",
    );
    if (hasKey(backup, "maxColumns")) {
      settings.handleMaxColumns(backup.maxColumns);
    }
    if (hasKey(backup, "newTab")) {
      settings.handleNewTab(backup.newTab);
    }
    // Backups without showDialBorders predate the setting, so preserve the
    // previous flat dial appearance instead of applying the new reset default.
    settings.handleShowDialBorders(
      hasKey(backup, "showDialBorders") ? backup.showDialBorders : false,
    );
    if (hasKey(backup, "showTitle")) {
      settings.handleShowTitle(backup.showTitle);
    }
    if (hasKey(backup, "squareDials")) {
      settings.handleSquareDials(backup.squareDials);
    }
    if (hasKey(backup, "switchTitle")) {
      settings.handleSwitchTitle(backup.switchTitle);
    }
    if (hasKey(backup, "wallpaper")) {
      settings._restoreWallpaper(backup.wallpaper);
    }
    if (hasKey(backup, "themeOption")) {
      settings.handleThemeOption(backup.themeOption);
    }
    if (hasKey(backup, "transparentDials")) {
      settings.handleTransparentDials(backup.transparentDials);
    }

    if (shouldOfferFaviconPermission) {
      modals.openModal({
        modal: "confirm-favicon-permission",
        focusAfterClosed,
      });
    }
  } catch (err) {
    console.error("Error parsing JSON file", err);
  }
}
