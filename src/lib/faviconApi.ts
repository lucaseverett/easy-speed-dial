import { faviconCache, isFresh, ONE_HOUR_MS } from "#lib/faviconCache";
import { hasFaviconPermission } from "#lib/optionalPermissions";
import browser from "#platform/browser";

// Single-handler hook (not pub/sub). Setting a new handler replaces the
// previous one, which matches the call site: the favicons store registers
// once at module load to react to permission loss by disabling the feature.
let permissionLostHandler: (() => void) | undefined;

export function setPermissionLostHandler(handler: () => void) {
  permissionLostHandler = handler;
}

const FALLBACK_PAGE_URL = "https://domain.invalid";
let fallbackHashPromise: Promise<string> | null = null;

export function buildFaviconUrl(pageUrl: string) {
  return `${browser.runtime.getURL("/_favicon/")}?pageUrl=${encodeURIComponent(pageUrl)}&size=64`;
}

export function buildDuckDuckGoFaviconUrl(hostname: string) {
  return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
}

export async function hashBytes(buffer: ArrayBuffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hashBuffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getFallbackHash() {
  // Memoize the fingerprint of the API's generic fallback icon. On failure,
  // clear the cache so the next call retries instead of poisoning the whole
  // session with a permanently rejected promise.
  fallbackHashPromise ??= fetch(buildFaviconUrl(FALLBACK_PAGE_URL))
    .then((response) => response.arrayBuffer())
    .then(hashBytes)
    .catch((error) => {
      fallbackHashPromise = null;
      throw error;
    });

  return fallbackHashPromise;
}

export async function resolveBrowserFavicon(pageUrl: string) {
  try {
    const faviconUrl = buildFaviconUrl(pageUrl);
    const [faviconHash, fallbackHash] = await Promise.all([
      fetch(faviconUrl)
        .then((response) => response.arrayBuffer())
        .then(hashBytes),
      getFallbackHash(),
    ]);

    return faviconHash === fallbackHash ? null : faviconUrl;
  } catch {
    return null;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function fetchDuckDuckGoFavicon(hostname: string): Promise<void> {
  // Concurrent-fetch dedup lives in the caller (favicons store queue); the
  // freshness check here covers the race where two URLs for the same
  // hostname arrive back-to-back after the first one populated the cache.
  const cached = faviconCache.get(hostname);
  if (cached && isFresh(cached)) return;

  try {
    const response = await fetch(buildDuckDuckGoFaviconUrl(hostname));
    if (response.status === 200) {
      const blob = await response.blob();
      const dataUrl = await blobToBase64(blob);
      faviconCache.set(hostname, { dataUrl, fetchedAt: Date.now() });
    } else if (response.status === 404) {
      faviconCache.set(hostname, { dataUrl: null, fetchedAt: Date.now() });
    } else {
      // 5xx or other unexpected status. Cache short so a flaky response
      // doesn't burn a request per page load, but recover quickly once
      // DDG is healthy again.
      faviconCache.set(hostname, {
        dataUrl: null,
        fetchedAt: Date.now(),
        ttlMs: ONE_HOUR_MS,
      });
    }
  } catch {
    // TypeError from fetch when the host permission is missing or network fails.
    const permissionGranted = await hasFaviconPermission();
    if (!permissionGranted) {
      permissionLostHandler?.();
    } else {
      // Permission is intact, so this is a genuine network error (offline,
      // DNS, etc.). Same short-TTL treatment as a 5xx.
      faviconCache.set(hostname, {
        dataUrl: null,
        fetchedAt: Date.now(),
        ttlMs: ONE_HOUR_MS,
      });
    }
  }
}
