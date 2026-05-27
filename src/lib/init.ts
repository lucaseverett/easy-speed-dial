import semverCoerce from "semver/functions/coerce";
import semverGt from "semver/functions/gt";
import semverLt from "semver/functions/lt";

import { loadFaviconCache } from "./faviconCache";
import {
  getAllSettingsStorage,
  removeStorage,
  setStorage,
  storageKeys,
} from "./storage";

export interface SettingsStorageInit {
  devTool: string | null;
  lastVersion: string | false;
  storage: Record<string, unknown>;
}

async function migrateTo2_14_0(storage: Record<string, unknown>) {
  storage[storageKeys.showDialBorders] = false;
  storage[storageKeys.gridSpacing] = "spacious";
  storage[storageKeys.usePresetThumbnails] = false;
  await setStorage({
    [storageKeys.showDialBorders]: false,
    [storageKeys.gridSpacing]: "spacious",
    [storageKeys.usePresetThumbnails]: false,
  });
}

export async function initializeSettingsStorage(
  appVersion: string,
): Promise<SettingsStorageInit> {
  const devParams = import.meta.env.DEV
    ? new URLSearchParams(window.location.search)
    : null;
  const devTool = devParams?.get("dev") ?? null;

  if (import.meta.env.DEV) {
    if (devTool === "new") {
      const all = await getAllSettingsStorage();
      await removeStorage(Object.keys(all));
    } else if (devTool === "upgrade") {
      const requestedVersion = devParams?.get("v");
      const upgradeFromVersion =
        (requestedVersion && semverCoerce(requestedVersion)?.version) ||
        "2.14.0";
      await removeStorage([
        storageKeys.showDialBorders,
        storageKeys.gridSpacing,
        storageKeys.usePresetThumbnails,
      ]);
      await setStorage({ "last-version": upgradeFromVersion });
    }
  }

  const storage = await getAllSettingsStorage();
  const lastVersion =
    semverCoerce(storage["last-version"] as string)?.version || false;
  const isUpgrade = lastVersion && semverGt(appVersion, lastVersion);
  const shouldRunUpgradeMigrations = !__DEMO__ || devTool === "upgrade";

  if (
    shouldRunUpgradeMigrations &&
    isUpgrade &&
    semverLt(lastVersion, "2.14.0")
  ) {
    await migrateTo2_14_0(storage);
  }

  if (__FIREFOX__) {
    await loadFaviconCache(storage);
  }

  if (isUpgrade) {
    storage[storageKeys.showUpgradeIndicator] = true;
    setStorage({ [storageKeys.showUpgradeIndicator]: true });
  }

  setStorage({ "last-version": appVersion });

  return { devTool, lastVersion, storage };
}
