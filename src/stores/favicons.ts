import { makeAutoObservable, runInAction } from "mobx";

import {
  buildDuckDuckGoFaviconUrl,
  fetchDuckDuckGoFavicon,
  resolveBrowserFavicon,
  setPermissionLostHandler,
} from "#lib/faviconApi";
import { faviconCache } from "#lib/faviconCache";
import { settings } from "#stores/settings";

// Cap concurrent favicon lookups. Bookmarks come from the user's browser, so a
// folder can hold an unbounded number of dials — resolving them all at once
// would spike memory and main-thread time. Dials request favicons as they
// mount and the queue drains a few at a time.
const MAX_CONCURRENT = 12;

const inFlight = new Set<string>();
const queue: string[] = [];
let active = 0;

function getHostname(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only http(s) bookmarks resolve to real hostnames we'd want to look up.
    // chrome://settings, about:blank, file:///foo, javascript:..., etc. either
    // throw or produce hostnames like "settings" that would have us asking
    // DDG for "https://icons.duckduckgo.com/ip3/settings.ico".
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.hostname || null;
  } catch {
    return null;
  }
}

export const favicons = makeAutoObservable({
  // Chrome only: page URL -> resolved favicon URL, or null when the site has
  // no favicon. A missing key means the favicon has not been resolved yet.
  // Firefox reads from faviconCache by hostname instead.
  byUrl: new Map<string, string | null>(),
  getFavicon(url: string | undefined) {
    if (!url) return undefined;
    if (__CHROME__) return favicons.byUrl.get(url);
    if (__FIREFOX__) {
      const hostname = getHostname(url);
      if (!hostname) return null;
      return faviconCache.get(hostname)?.dataUrl;
    }
    if (__DEMO__) {
      // Point <img> directly at DDG: we can't detect their 404 fallback from
      // demo (CORS blocks fetch() against icons.duckduckgo.com), so any icon
      // they return — including the generic fallback — is rendered as-is.
      const hostname = getHostname(url);
      if (!hostname) return null;
      return buildDuckDuckGoFaviconUrl(hostname);
    }
    return undefined;
  },
  request(url: string) {
    if (__DEMO__) return; // Demo resolves synchronously in getFavicon.
    if (!settings.showFavicons) return;

    if (__FIREFOX__) {
      const hostname = getHostname(url);
      if (!hostname) return;
      if (inFlight.has(hostname)) return;
      inFlight.add(hostname);
      queue.push(hostname);
    } else {
      if (favicons.byUrl.has(url) || inFlight.has(url)) return;
      inFlight.add(url);
      queue.push(url);
    }
    pump();
  },
  handlePermissionLost() {
    // Firefox-only. `byUrl` is the Chrome path and is never populated here,
    // so no need to clear it.
    settings.handleShowFavicons(false);
  },
});

if (__FIREFOX__) {
  setPermissionLostHandler(() => favicons.handlePermissionLost());
}

function pump() {
  while (active < MAX_CONCURRENT && queue.length > 0) {
    const key = queue.shift()!;
    active++;

    const resolve = __FIREFOX__
      ? fetchDuckDuckGoFavicon(key)
      : resolveBrowserFavicon(key).then((faviconUrl) => {
          runInAction(() => {
            favicons.byUrl.set(key, faviconUrl);
          });
        });

    resolve.finally(() => {
      inFlight.delete(key);
      active--;
      pump();
    });
  }
}
