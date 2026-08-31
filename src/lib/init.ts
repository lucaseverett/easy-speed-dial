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
  installVersion: string;
  whatsNewSeenThrough: string;
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
        // Backfill from the simulated old version, as a real upgrader would.
        "install-version",
      ]);
      // Treat `v` as both prior version and What's New cutoff.
      await setStorage({
        "last-version": upgradeFromVersion,
        [storageKeys.whatsNewSeenThrough]: upgradeFromVersion,
      });
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

  const storagePatch: Record<string, unknown> = {
    "last-version": appVersion,
  };

  // Older installs can only approximate install version from last-seen version.
  const storedInstallVersion = semverCoerce(
    storage["install-version"] as string,
  )?.version;
  const installVersion = storedInstallVersion || lastVersion || appVersion;
  if (!storedInstallVersion) {
    storage["install-version"] = installVersion;
    storagePatch["install-version"] = installVersion;
  }

  const storedWhatsNewSeenThrough = semverCoerce(
    storage[storageKeys.whatsNewSeenThrough] as string,
  )?.version;
  const whatsNewSeenThrough =
    storedWhatsNewSeenThrough || lastVersion || appVersion;
  if (!storedWhatsNewSeenThrough) {
    storage[storageKeys.whatsNewSeenThrough] = whatsNewSeenThrough;
    storagePatch[storageKeys.whatsNewSeenThrough] = whatsNewSeenThrough;
  }

  setStorage(storagePatch);

  return {
    devTool,
    lastVersion,
    installVersion,
    whatsNewSeenThrough,
    storage,
  };
}
