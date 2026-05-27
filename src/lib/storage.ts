import browser from "#platform/browser";

export const apiVersion = "2.0";

export const storageKeys = {
  attachTitle: `${apiVersion}-attach-title`,
  customColor: `${apiVersion}-custom-color`,
  customImage: `${apiVersion}-custom-image`,
  defaultFolder: `${apiVersion}-default-folder`,
  dialColors: `${apiVersion}-dial-colors`,
  dialImages: `${apiVersion}-dial-images`,
  dialImageSizes: `${apiVersion}-dial-image-sizes`,
  dialSize: `${apiVersion}-dial-size`,
  dragAndDrop: `${apiVersion}-drag-and-drop`,
  gridSpacing: `${apiVersion}-grid-spacing`,
  maxColumns: `${apiVersion}-max-columns`,
  newTab: `${apiVersion}-new-tab`,
  showDialBorders: `${apiVersion}-show-dial-borders`,
  showTitle: `${apiVersion}-show-title`,
  showUpgradeIndicator: `${apiVersion}-show-upgrade-indicator`,
  squareDials: `${apiVersion}-square-dials`,
  switchTitle: `${apiVersion}-switch-title`,
  themeOption: `${apiVersion}-theme-option`,
  transparentDials: `${apiVersion}-transparent-dials`,
  usePresetThumbnails: `${apiVersion}-use-preset-thumbnails`,
  showFavicons: `${apiVersion}-show-favicons`,
  faviconCache: `${apiVersion}-favicon-cache`,
  wallpaper: `${apiVersion}-wallpaper`,
};

export function getAllSettingsStorage() {
  return browser.storage.local.get() as Promise<Record<string, unknown>>;
}

export function getStoredCustomImage() {
  return browser.storage.local.get(storageKeys.customImage) as Promise<
    Record<string, unknown>
  >;
}

export function removeStorage(keys: string | string[]) {
  return browser.storage.local.remove(keys);
}

export function setStorage(items: Record<string, unknown>) {
  return browser.storage.local.set(items);
}
