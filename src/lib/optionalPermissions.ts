import browser from "#platform/browser";

const FAVICON_ORIGINS = { origins: ["https://icons.duckduckgo.com/*"] };

// Optional host permission only applies to Firefox. Chrome doesn't need it
// (favicons come from the built-in _favicon API) and Demo has no extension
// host to grant against — so both short-circuit before hitting the API.
function withFaviconPermission(
  action: (origins: typeof FAVICON_ORIGINS) => Promise<boolean>,
): Promise<boolean> {
  if (__CHROME__) return Promise.resolve(true);
  if (__DEMO__) return Promise.resolve(false);
  return action(FAVICON_ORIGINS);
}

export function hasFaviconPermission() {
  return withFaviconPermission(browser.permissions.contains);
}

export function requestFaviconPermission() {
  return withFaviconPermission(browser.permissions.request);
}

export function removeFaviconPermission() {
  return withFaviconPermission(browser.permissions.remove);
}
