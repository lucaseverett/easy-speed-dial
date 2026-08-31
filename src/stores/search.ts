import type { FilteredBookmark } from "#lib/filter";

import { makeAutoObservable, reaction, runInAction } from "mobx";

import { searchBookmarks } from "#lib/bookmarkApi";
import { BOOKMARK_DEBOUNCE_MS } from "#lib/bookmarkListeners";
import { filter } from "#lib/filter";
import browser from "#platform/browser";
import { settings } from "#stores/settings";

export const SEARCH_DEBOUNCE_MS = BOOKMARK_DEBOUNCE_MS;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
// Only the latest async query may update results.
let seq = 0;

function displayName(b: FilteredBookmark): string {
  return (b.title || b.name.join(".")).toLowerCase();
}

function scheduleRun() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    const trimmed = search.query.trim();
    if (search.isActive && trimmed) void search._run(trimmed);
  }, SEARCH_DEBOUNCE_MS);
}

export const search = makeAutoObservable({
  query: "",
  results: [] as FilteredBookmark[],
  isActive: false,
  // Prevents an empty-state flash before the first search completes.
  searched: false,
  // Prevents the folder from flashing while restored results load.
  restoring: false,
  // Keep prior results while typing, but switch immediately when restoring.
  get isShowingResults(): boolean {
    return (
      settings.showSearchBar &&
      search.isActive &&
      (search.searched || search.restoring)
    );
  },
  setQuery(value: string) {
    search.query = value;
    if (!value.trim()) {
      search.clear();
      return;
    }
    search.restoring = false;
    search.isActive = true;
    scheduleRun();
  },
  // Restored navigation bypasses the typing debounce.
  restoreQuery(value: string) {
    if (!value.trim()) {
      search.clear();
      return;
    }
    search.query = value;
    search.results = [];
    search.isActive = true;
    search.searched = false;
    search.restoring = true;
    void search._run(value.trim());
  },
  rerun() {
    if (search.isActive && search.query.trim()) scheduleRun();
  },
  async _run(query: string) {
    const current = ++seq;
    try {
      const raw = await searchBookmarks(query);
      const filtered = filter(raw)
        .filter((b) => b.type !== "separator")
        .sort((a, b) => {
          const aFolder = a.type === "folder";
          const bFolder = b.type === "folder";
          if (aFolder !== bFolder) return aFolder ? -1 : 1;
          return displayName(a).localeCompare(displayName(b));
        });
      if (current !== seq) return;
      runInAction(() => {
        search.results = filtered;
        search.searched = true;
        search.restoring = false;
      });
    } catch (error) {
      console.error("Bookmark search failed:", error);
      if (current === seq) {
        runInAction(() => {
          search.results = [];
          search.searched = true;
          search.restoring = false;
        });
      }
    }
  },
  clear() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    seq++;
    search.query = "";
    search.results = [];
    search.isActive = false;
    search.searched = false;
    search.restoring = false;
  },
});

const handleBookmarkChange = () => search.rerun();

function syncBookmarkListeners(listen: boolean) {
  const method = listen ? "addListener" : "removeListener";
  browser.bookmarks.onChanged[method](handleBookmarkChange);
  browser.bookmarks.onCreated[method](handleBookmarkChange);
  browser.bookmarks.onMoved[method](handleBookmarkChange);
  browser.bookmarks.onRemoved[method](handleBookmarkChange);
}

// Subscribe only while results need live bookmark updates.
reaction(
  () => settings.showSearchBar && search.isActive,
  syncBookmarkListeners,
);
