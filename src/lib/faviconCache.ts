import { observable, runInAction } from "mobx";

import { setStorage, storageKeys } from "#lib/storage";

export type FaviconCacheEntry = {
  dataUrl: string | null;
  fetchedAt: number;
  // Transient failures override the default TTL so they retry sooner.
  ttlMs?: number;
};
type FaviconCacheMap = Record<string, FaviconCacheEntry>;

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export const ONE_HOUR_MS = 60 * 60 * 1000;

export function isFresh(entry: FaviconCacheEntry, now = Date.now()): boolean {
  const ttl = entry.ttlMs ?? SEVEN_DAYS_MS;
  return now - entry.fetchedAt < ttl;
}

// Batch cold-start lookups to avoid repeatedly serializing the full cache.
const FLUSH_DELAY_MS = 500;
let flushTimer: ReturnType<typeof setTimeout> | null = null;

// Proxied entries fail browser storage's structured clone. Whole-entry
// replacement makes shallow observation sufficient.
const memory = observable.map<string, FaviconCacheEntry>(undefined, {
  deep: false,
});

function scheduleFlush() {
  if (flushTimer !== null) return;
  flushTimer = setTimeout(flush, FLUSH_DELAY_MS);
}

function flush(): Promise<void> {
  if (flushTimer !== null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  const snapshot = Object.fromEntries(memory.entries());
  return setStorage({ [storageKeys.faviconCache]: snapshot });
}

export async function loadFaviconCache(
  storage: Record<string, unknown>,
): Promise<void> {
  const stored = storage[storageKeys.faviconCache];
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return;

  const now = Date.now();
  const entries = Object.entries(stored as FaviconCacheMap);
  let pruned = 0;

  runInAction(() => {
    for (const [hostname, entry] of entries) {
      if (
        entry &&
        typeof entry === "object" &&
        "fetchedAt" in entry &&
        typeof entry.fetchedAt === "number"
      ) {
        if (isFresh(entry as FaviconCacheEntry, now)) {
          memory.set(hostname, entry as FaviconCacheEntry);
        } else {
          pruned++;
        }
      } else {
        pruned++;
      }
    }
  });

  if (pruned > 0) {
    const snapshot = Object.fromEntries(memory.entries());
    await setStorage({ [storageKeys.faviconCache]: snapshot });
  }
}

export const faviconCache = {
  get(hostname: string): FaviconCacheEntry | undefined {
    return memory.get(hostname);
  },
  set(hostname: string, entry: FaviconCacheEntry): void {
    runInAction(() => {
      memory.set(hostname, entry);
    });
    scheduleFlush();
  },
  async clear(): Promise<void> {
    runInAction(() => {
      memory.clear();
    });
    await flush();
  },
};
