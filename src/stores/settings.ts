import type { FocusTarget } from "#lib/focus";
import type {
  DialColors,
  DialImages,
  DialImageSize,
  DialImageSizes,
} from "#types/settings";

import { makeAutoObservable, remove, runInAction, set } from "mobx";

import {
  applyBackup,
  buildBackup,
  downloadBackup,
  selectJsonFile,
} from "#lib/backup";
import {
  base64ToBlob,
  getCustomImageUrl,
  selectImageFile,
  storeCustomImage,
} from "#lib/customImages";
import { syncDocumentAppearance } from "#lib/documentAppearance";
import { faviconCache } from "#lib/faviconCache";
import { initializeSettingsStorage } from "#lib/init";
import { removeFaviconPermission } from "#lib/optionalPermissions";
import { removeStorage, setStorage, storageKeys } from "#lib/storage";
import { getColorScheme, resolveWallpaper } from "#lib/wallpaper";
import { hasUnseenWhatsNewFeatures } from "#lib/whatsNew";

const appVersion = __APP_VERSION__;
const { lastVersion, whatsNewSeenThrough, storage } =
  await initializeSettingsStorage(appVersion);
const themeOption =
  (storage[storageKeys.themeOption] as string) || "System Theme";
const colorScheme = getColorScheme(themeOption);
const storedWallpaper = storage[storageKeys.wallpaper];
const storedCustomColor = storage[storageKeys.customColor];
const wallpaper = resolveWallpaper(storedWallpaper);
const customColor =
  typeof storedCustomColor === "string" ? storedCustomColor : "";

const customImage = await getCustomImageUrl();

const bc = new BroadcastChannel("easy-settings");
bc.onmessage = (e) => {
  runInAction(() => set(settings, e.data));
};

function resolveDialImageSize(value: unknown): DialImageSize {
  return value === "contain" ? "contain" : "cover";
}

function resolveDialImageSizes(
  value: unknown,
  dialImages: unknown,
): DialImageSizes {
  const resolvedDialImages =
    dialImages && typeof dialImages === "object" && !Array.isArray(dialImages)
      ? (dialImages as DialImages)
      : {};
  const fallbackSizes = Object.fromEntries(
    Object.keys(resolvedDialImages).map((id) => [id, "cover"]),
  ) as DialImageSizes;

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallbackSizes;
  }

  return {
    ...fallbackSizes,
    ...Object.fromEntries(
      Object.entries(value).map(([id, size]) => [
        id,
        resolveDialImageSize(size),
      ]),
    ),
  } as DialImageSizes;
}

const defaultSettings = {
  usePresetThumbnails: true,
  showFavicons: false,
  attachTitle: false,
  colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "color-scheme-dark"
    : "color-scheme-light",
  customColor: "",
  customImage: "",
  defaultFolder: "",
  dialColors: {} as DialColors,
  dialImages: {} as DialImages,
  dialImageSizes: {} as DialImageSizes,
  dialSize: "small",
  dragAndDrop: true,
  firstRun: !lastVersion,
  gridSpacing: "default",
  maxColumns: "7",
  newTab: false,
  showDialBorders: true,
  showSearchBar: false,
  settingsIconHidden: false,
  showTitle: true,
  squareDials: false,
  switchTitle: false,
  themeOption: "System Theme",
  transparentDials: false,
  wallpaper: "",
  whatsNewSeenThrough,
};

export const settings = makeAutoObservable({
  usePresetThumbnails:
    storage[storageKeys.usePresetThumbnails] ??
    defaultSettings.usePresetThumbnails,
  showFavicons:
    storage[storageKeys.showFavicons] ?? defaultSettings.showFavicons,
  attachTitle: storage[storageKeys.attachTitle] ?? defaultSettings.attachTitle,
  colorScheme,
  customColor,
  customImage,
  defaultFolder:
    storage[storageKeys.defaultFolder] || defaultSettings.defaultFolder,
  dialColors:
    (storage[storageKeys.dialColors] as DialColors) ||
    defaultSettings.dialColors,
  dialImages:
    (storage[storageKeys.dialImages] as DialImages) ||
    defaultSettings.dialImages,
  dialImageSizes: resolveDialImageSizes(
    storage[storageKeys.dialImageSizes],
    (storage[storageKeys.dialImages] as DialImages) ||
      defaultSettings.dialImages,
  ),
  dialSize: storage[storageKeys.dialSize] || defaultSettings.dialSize,
  dragAndDrop: storage[storageKeys.dragAndDrop] ?? defaultSettings.dragAndDrop,
  firstRun: defaultSettings.firstRun,
  gridSpacing: storage[storageKeys.gridSpacing] || defaultSettings.gridSpacing,
  maxColumns: storage[storageKeys.maxColumns] || defaultSettings.maxColumns,
  newTab: storage[storageKeys.newTab] ?? defaultSettings.newTab,
  showDialBorders:
    storage[storageKeys.showDialBorders] ?? defaultSettings.showDialBorders,
  showSearchBar:
    storage[storageKeys.showSearchBar] ?? defaultSettings.showSearchBar,
  get showUpgradeIndicator() {
    return hasUnseenWhatsNewFeatures(settings.whatsNewSeenThrough, appVersion);
  },
  settingsIconHidden:
    storage[storageKeys.settingsIconHidden] ??
    defaultSettings.settingsIconHidden,
  showTitle: storage[storageKeys.showTitle] ?? defaultSettings.showTitle,
  squareDials: storage[storageKeys.squareDials] ?? defaultSettings.squareDials,
  switchTitle: storage[storageKeys.switchTitle] ?? defaultSettings.switchTitle,
  themeOption,
  transparentDials:
    storage[storageKeys.transparentDials] ?? defaultSettings.transparentDials,
  wallpaper,
  whatsNewSeenThrough: defaultSettings.whatsNewSeenThrough,
  // Reactive-only keys still update locally and across tabs without storage.
  _persist(patch: Record<string, unknown>) {
    const storagePatch: Record<string, unknown> = {};
    for (const key of Object.keys(patch)) {
      const storageKey = storageKeys[key as keyof typeof storageKeys];
      if (storageKey) {
        storagePatch[storageKey] = patch[key];
      }
    }
    setStorage(storagePatch);
    Object.assign(settings, patch);
    bc.postMessage(patch);
  },
  handleUsePresetThumbnails(value: boolean) {
    settings._persist({ usePresetThumbnails: value });
  },
  handleShowFavicons(value: boolean) {
    settings._persist({ showFavicons: value });
    // Firefox's permission permits DDG network access, so revoke it when off.
    // Chrome's local favicon permission is unreliable after revoke/re-request.
    if (__FIREFOX__ && !value) {
      void removeFaviconPermission();
      void faviconCache.clear();
    }
  },
  handleAttachTitle(value: boolean) {
    settings._persist({ attachTitle: value });
  },
  getDialImageSize(id: string) {
    return settings.dialImageSizes[id] || resolveDialImageSize(undefined);
  },
  handleClearColor(id: string) {
    if (settings.dialColors[id]) {
      remove(settings.dialColors, id);
      settings._persist({ dialColors: { ...settings.dialColors } });
    }
  },
  handleClearThumbnail(id: string) {
    if (settings.dialImages[id]) {
      remove(settings.dialImages, id);
      remove(settings.dialImageSizes, id);
      settings._persist({
        dialImages: { ...settings.dialImages },
        dialImageSizes: { ...settings.dialImageSizes },
      });
    }
  },
  handleCustomColor(value: string) {
    settings._persist({ customColor: value });
    settings.handleWallpaper("custom-color");
  },
  handleCustomImage() {
    selectImageFile(async (image, base64) => {
      const imageURI = URL.createObjectURL(image);
      await storeCustomImage(base64);
      settings.customImage = imageURI;
      settings.handleWallpaper("custom-image");
      bc.postMessage({ customImage: imageURI });
    });
  },
  handleDefaultFolder(value: string) {
    settings._persist({ defaultFolder: value });
  },
  handleDialColors(id: string, value: string) {
    set(settings.dialColors, id, value);
    settings._persist({ dialColors: { ...settings.dialColors } });
  },
  handleDialSize(value: string) {
    settings._persist({ dialSize: value });
  },
  handleDragAndDrop(value: boolean) {
    settings._persist({ dragAndDrop: value });
  },
  handleGridSpacing(value: string) {
    settings._persist({ gridSpacing: value });
  },
  handleDialImageSize(id: string, value: string) {
    const size = resolveDialImageSize(value);
    set(settings.dialImageSizes, id, size);
    settings._persist({ dialImageSizes: { ...settings.dialImageSizes } });
  },
  handleMaxColumns(value: string) {
    settings._persist({ maxColumns: value });
  },
  handleNewTab(value: boolean) {
    settings._persist({ newTab: value });
  },
  handleShowDialBorders(value: boolean) {
    settings._persist({ showDialBorders: value });
  },
  handleShowSearchBar(value: boolean) {
    settings._persist({ showSearchBar: value });
  },
  handleSelectThumbnail(id: string) {
    selectImageFile((_image, base64) => {
      settings.handleSetThumbnail(id, base64);
    });
  },
  handleSetThumbnail(
    id: string,
    base64: string,
    size: DialImageSize = "cover",
  ) {
    settings._persist({
      dialImages: { ...settings.dialImages, [id]: base64 },
      dialImageSizes: { ...settings.dialImageSizes, [id]: size },
    });
  },
  handleShowTitle(value: boolean) {
    settings._persist({ showTitle: value });
  },
  handleSwitchTitle(value: boolean) {
    settings._persist({ switchTitle: value });
  },
  handleSquareDials(value: boolean) {
    settings._persist({ squareDials: value });
  },
  handleThemeOption(value: string) {
    settings._persist({
      themeOption: value,
      colorScheme: getColorScheme(value),
    });
  },
  handleTransparentDials(value: boolean) {
    settings._persist({ transparentDials: value });
  },
  handleWallpaper(value: string) {
    if (value !== "custom-image" && settings.wallpaper === "custom-image") {
      settings._clearCustomImage();
    }
    if (value !== "custom-color" && settings.wallpaper === "custom-color") {
      settings._clearCustomColor();
    }
    settings._persist({ wallpaper: value });
  },
  // Backup restore must preserve the accompanying custom assets.
  _restoreWallpaper(value: string) {
    settings._persist({ wallpaper: resolveWallpaper(value) });
  },
  _restoreCustomColor(value: string) {
    settings._persist({ customColor: value });
  },
  acknowledgeWhatsNew() {
    if (settings.whatsNewSeenThrough === appVersion) return;
    settings._persist({ whatsNewSeenThrough: appVersion });
  },
  hideSettingsIcon() {
    if (settings.settingsIconHidden) return;
    settings._persist({ settingsIconHidden: true });
  },
  showSettingsIcon() {
    if (!settings.settingsIconHidden) return;
    settings._persist({ settingsIconHidden: false });
  },
  _clearCustomImage() {
    removeStorage([storageKeys.customImage]);
    settings.customImage = "";
    bc.postMessage({ customImage: "" });
  },
  _clearCustomColor() {
    settings._persist({ customColor: "" });
  },
  resetDialColors() {
    settings._persist({ dialColors: {} });
  },
  resetDialImages() {
    removeStorage(storageKeys.dialImages);
    removeStorage(storageKeys.dialImageSizes);
    settings.dialImages = {};
    settings.dialImageSizes = {};
    bc.postMessage({ dialImages: {}, dialImageSizes: {} });
  },
  resetDialCustomizations() {
    settings.resetDialColors();
    settings.resetDialImages();
  },
  resetSettings() {
    settings.handleUsePresetThumbnails(defaultSettings.usePresetThumbnails);
    settings.handleShowFavicons(defaultSettings.showFavicons);
    settings.handleAttachTitle(defaultSettings.attachTitle);
    settings._clearCustomColor();
    settings._clearCustomImage();
    settings.resetDialColors();
    settings.resetDialImages();
    settings.resetWallpaper();
    settings.handleDefaultFolder(defaultSettings.defaultFolder);
    settings.handleDialSize(defaultSettings.dialSize);
    settings.handleDragAndDrop(defaultSettings.dragAndDrop);
    settings.handleGridSpacing(defaultSettings.gridSpacing);
    settings.handleMaxColumns(defaultSettings.maxColumns);
    settings.handleNewTab(defaultSettings.newTab);
    settings.handleShowDialBorders(defaultSettings.showDialBorders);
    settings.handleShowSearchBar(defaultSettings.showSearchBar);
    settings.handleShowTitle(defaultSettings.showTitle);
    settings.handleSquareDials(defaultSettings.squareDials);
    settings.handleSwitchTitle(defaultSettings.switchTitle);
    settings.handleThemeOption(defaultSettings.themeOption);
    settings.handleTransparentDials(defaultSettings.transparentDials);
  },
  resetWallpaper() {
    settings.handleWallpaper("theme-wallpaper");
  },
  async restoreCustomImage(base64: string) {
    const image = base64ToBlob(base64);
    await setStorage({ [storageKeys.customImage]: base64 });
    const imageURI = URL.createObjectURL(image);
    settings.customImage = imageURI;
    bc.postMessage({ customImage: imageURI });
  },
  restoreDialColors(colors: DialColors) {
    settings._persist({ dialColors: colors });
  },
  restoreDialImages(images: DialImages, rawSizes: unknown) {
    settings._persist({
      dialImages: images,
      dialImageSizes: resolveDialImageSizes(rawSizes, images),
    });
  },
  restoreDialImageSizes(rawSizes: unknown) {
    settings._persist({
      dialImageSizes: resolveDialImageSizes(rawSizes, settings.dialImages),
    });
  },
  restoreFromJSON(focusAfterClosed?: FocusTarget): void {
    selectJsonFile((contents) =>
      applyBackup(settings, contents, focusAfterClosed),
    );
  },
  async saveToJSON(): Promise<void> {
    downloadBackup(await buildBackup(settings));
  },
  systemThemeChanged(e: MediaQueryListEvent) {
    if (settings.themeOption === "System Theme") {
      settings.colorScheme = e.matches
        ? "color-scheme-dark"
        : "color-scheme-light";
    }
  },
});

export type SettingsStore = typeof settings;

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", settings.systemThemeChanged);

syncDocumentAppearance(settings);
