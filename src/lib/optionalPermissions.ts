import type { Permissions } from "webextension-polyfill";

import browser from "#platform/browser";

// Firefox needs the DDG host permission to fetch icons; Chrome needs the
// `favicon` API permission to read its local cache. Demo has no extension
// host (browser.permissions is undefined), so the modal's user-facing consent
// stands in for an actual grant and these calls resolve true without touching
// the API. "favicon" is a Chrome-only optional permission not present in the
// polyfill types.
function getFaviconPermissions(): Permissions.Permissions {
  if (__CHROME__) {
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
