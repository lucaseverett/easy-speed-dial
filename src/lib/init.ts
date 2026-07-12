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
  // True when the user upgraded into the current version (their install
  // predates it), so "New" feature badges are relevant. False for fresh
  // installs, where nothing in this release is actually new to them.
  showNewBadges: boolean;
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
        // Clear so it backfills from the simulated (older) last-version,
        // faithfully reproducing an upgrader rather than a fresh install.
        "install-version",
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

  const storagePatch: Record<string, unknown> = {
    "last-version": appVersion,
  };
  if (isUpgrade) {
    storage[storageKeys.showUpgradeIndicator] = true;
    storagePatch[storageKeys.showUpgradeIndicator] = true;
  }

  // Record the version the user first installed at, once. Fresh installs record
  // the current version. Existing users predating this tracking are backfilled
  // with their last-seen version (the best available approximation; their true
  // install version is unrecoverable). This can only be captured going forward.
  const storedInstallVersion = semverCoerce(
    storage["install-version"] as string,
  )?.version;
  const installVersion = storedInstallVersion || lastVersion || appVersion;
  if (!storedInstallVersion) {
    storage["install-version"] = installVersion;
    storagePatch["install-version"] = installVersion;
  }

  // Only upgraders (install predates the current version) see "New" badges.
  const showNewBadges = semverLt(installVersion, appVersion);

  setStorage(storagePatch);

  return { devTool, lastVersion, installVersion, showNewBadges, storage };
}
