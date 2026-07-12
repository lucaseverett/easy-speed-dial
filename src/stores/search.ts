import type { FilteredBookmark } from "#lib/filter";

import { makeAutoObservable, reaction, runInAction } from "mobx";

import { searchBookmarks } from "#lib/bookmarkApi";
import { BOOKMARK_DEBOUNCE_MS } from "#lib/bookmarkListeners";
import { filter } from "#lib/filter";
import browser from "#platform/browser";
import { settings } from "#stores/settings";

// Matches the listener debounce used for folder reconciliation.
export const SEARCH_DEBOUNCE_MS = BOOKMARK_DEBOUNCE_MS;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
// Monotonic counter guarding against out-of-order async responses: only the
// most recently issued query is allowed to write results.
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
  // True whenever there is a non-empty (trimmed) query.
  isActive: false,
  // True only once a query has finished running. Guards the no-results message
  // from flashing before the first (debounced, async) search returns.
  searched: false,
  // True while a restored search is waiting for its first result set. The grid
  // uses this to avoid briefly rendering the current folder on load/navigation.
  restoring: false,
  // The grid renders search results instead of the current folder while true.
  // Typing keeps the current result set in place until the next query returns,
  // but restored searches enter search mode immediately so the fallback folder
  // does not flash on load/navigation.
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
  // Restore a query from the URL on load / back-navigation. Runs immediately
  // (no debounce) so results appear promptly; URL syncing is handled elsewhere.
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
  // Re-run the active query after a bookmark mutation so results stay in sync
  // with the live tree (edits update, deletions drop out, etc.).
  rerun() {
    if (search.isActive && search.query.trim()) scheduleRun();
  },
  async _run(query: string) {
    const current = ++seq;
    try {
      const raw = await searchBookmarks(query);
      const filtered = filter(raw)
        .filter((b) => b.type !== "separator")
        // Folders first, then bookmarks; alphabetical within each group.
        .sort((a, b) => {
          const aFolder = a.type === "folder";
          const bFolder = b.type === "folder";
          if (aFolder !== bFolder) return aFolder ? -1 : 1;
          return displayName(a).localeCompare(displayName(b));
        });
      if (current !== seq) return; // A newer query superseded this one.
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
    seq++; // Invalidate any in-flight query.
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

// Keep live results in sync without retaining global bookmark listeners while
// search is disabled or idle.
reaction(
  () => settings.showSearchBar && search.isActive,
  syncBookmarkListeners,
);
