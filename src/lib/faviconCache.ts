import { observable, runInAction } from "mobx";

import { setStorage, storageKeys } from "#lib/storage";

export type FaviconCacheEntry = {
  dataUrl: string | null;
  fetchedAt: number;
  // Per-entry freshness window. Omitted on successful lookups (200/404),
  // which fall back to the default. Set on transient failures so they
  // retry quickly rather than persisting like a real "no favicon" result.
  ttlMs?: number;
};
type FaviconCacheMap = Record<string, FaviconCacheEntry>;

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export const ONE_HOUR_MS = 60 * 60 * 1000;

export function isFresh(entry: FaviconCacheEntry, now = Date.now()): boolean {
  const ttl = entry.ttlMs ?? SEVEN_DAYS_MS;
  return now - entry.fetchedAt < ttl;
}

// Coalesce rapid set() calls into a single storage write. Cold-start
// resolves N favicons in quick succession; without batching, each one
// re-serializes and re-writes the entire snapshot.
const FLUSH_DELAY_MS = 500;
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const memory = observable.map<string, FaviconCacheEntry>();

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
          // Stale entries are either deleted bookmarks, bookmarks in a
          // folder the user hasn't opened in over a week (favicons are only
          // requested for the current folder, so unvisited folders age out),
          // or transient failures past their short window. Dropping all of
          // them keeps storage proportional to recent usage; the cost is a
          // re-fetch the next time the user opens that folder.
          pruned++;
        }
      } else {
        pruned++;
      }
    }
  });

  // Persist the trimmed snapshot once if anything was dropped, so storage
  // doesn't keep accumulating dead entries across launches.
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
