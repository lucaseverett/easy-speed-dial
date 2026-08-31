import { makeAutoObservable, runInAction } from "mobx";

import {
  buildDuckDuckGoFaviconUrl,
  fetchDuckDuckGoFavicon,
  resolveBrowserFavicon,
  setPermissionLostHandler,
} from "#lib/faviconApi";
import { faviconCache } from "#lib/faviconCache";
import { settings } from "#stores/settings";

// Bound work for arbitrarily large bookmark folders.
const MAX_CONCURRENT = 12;

const inFlight = new Set<string>();
const queue: string[] = [];
let active = 0;

function getHostname(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Non-web schemes can produce misleading hostnames such as "settings".
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.hostname || null;
  } catch {
    return null;
  }
}

export const favicons = makeAutoObservable({
  // Chrome distinguishes unresolved (missing) from no favicon (null).
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
    if (__DEMO__) return;
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
