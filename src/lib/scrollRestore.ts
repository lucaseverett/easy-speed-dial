// History-entry keys preserve separate positions for repeated folder visits.
// sessionStorage also survives following a bookmark and returning in the tab.

const STATE_KEY = "scrollKey";
const STORAGE_KEY = "scroll-positions";
// Evict least-recently-saved positions to bound sessionStorage growth.
const MAX_ENTRIES = 50;
// Timers can still flush when animation frames are starved in background tabs.
const SAVE_DELAY_MS = 150;

let positions: Map<string, number> | null = null;
let pending: { key: string; top: number } | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

function loadPositions() {
  if (positions) return positions;
  const loaded = new Map<string, number>();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    for (const [key, top] of Object.entries(parsed)) {
      if (typeof top === "number") loaded.set(key, top);
    }
  } catch {
    // Corrupt storage must not block navigation.
  }
  positions = loaded;
  return positions;
}

function persist(map: Map<string, number>) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(map)),
    );
  } catch {
    // In-memory restoration still works when storage is unavailable.
  }
}

// Lazily tag entries so first visits naturally start without stored state.
function entryKey() {
  const state = history.state as Record<string, unknown> | null;
  const existing = state?.[STATE_KEY];
  if (typeof existing === "string") return existing;
  const key = crypto.randomUUID();
  history.replaceState({ ...state, [STATE_KEY]: key }, "");
  return key;
}

// Folder and search views can share a history entry but need separate positions.
export function getScrollKey(viewId: string) {
  return `${entryKey()}:${viewId}`;
}

export function readScrollTop(key: string) {
  return loadPositions().get(key) ?? 0;
}

export function saveScrollTop(key: string, top: number) {
  if (!key) return;
  pending = { key, top };
  if (timer) return;
  timer = setTimeout(flushScrollPosition, SAVE_DELAY_MS);
}

// Also called on pagehide because the trailing timer may never fire.
export function flushScrollPosition() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (!pending) return;
  const { key, top } = pending;
  pending = null;
  const map = loadPositions();
  // Re-insert so iteration order stays least-recently-saved first.
  map.delete(key);
  map.set(key, top);
  while (map.size > MAX_ENTRIES) {
    const oldest = map.keys().next().value;
    if (oldest === undefined) break;
    map.delete(oldest);
  }
  persist(map);
}
