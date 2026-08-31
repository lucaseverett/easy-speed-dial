import { faviconCache, isFresh, ONE_HOUR_MS } from "#lib/faviconCache";
import { hasFaviconPermission } from "#lib/optionalPermissions";
import browser from "#platform/browser";

// A single store owns permission-loss handling; later registration replaces it.
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
  // Do not retain a rejected promise; transient failures must remain retryable.
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
  // Recheck after queueing because another URL may have populated this host.
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
      // Avoid repeated requests while letting transient failures recover soon.
      faviconCache.set(hostname, {
        dataUrl: null,
        fetchedAt: Date.now(),
        ttlMs: ONE_HOUR_MS,
      });
    }
  } catch {
    // Distinguish revoked permission from transient network failure.
    const permissionGranted = await hasFaviconPermission();
    if (!permissionGranted) {
      permissionLostHandler?.();
    } else {
      faviconCache.set(hostname, {
        dataUrl: null,
        fetchedAt: Date.now(),
        ttlMs: ONE_HOUR_MS,
      });
    }
  }
}
