import type { Permissions } from "webextension-polyfill";

import browser from "#platform/browser";

// Firefox grants DDG network access; Chrome grants its local favicon API.
function getFaviconPermissions(): Permissions.Permissions {
  if (__CHROME__) {
    // The polyfill types omit this Chrome-only permission.
    return { permissions: ["favicon"] } as unknown as Permissions.Permissions;
  }
  return { origins: ["https://icons.duckduckgo.com/*"] };
}

export function hasFaviconPermission(): Promise<boolean> {
  if (__DEMO__) return Promise.resolve(true);
  return browser.permissions.contains(getFaviconPermissions());
}

export function requestFaviconPermission(): Promise<boolean> {
  if (__DEMO__) return Promise.resolve(true);
  return browser.permissions.request(getFaviconPermissions());
}

export function removeFaviconPermission(): Promise<boolean> {
  if (__DEMO__) return Promise.resolve(true);
  return browser.permissions.remove(getFaviconPermissions());
}
