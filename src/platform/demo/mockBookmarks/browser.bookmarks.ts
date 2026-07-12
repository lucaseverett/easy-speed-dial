interface BookmarkTreeNode {
  id: string;
  parentId?: string;
  index?: number;
  title: string;
  type: "bookmark" | "folder";
  url?: string;
  children?: BookmarkTreeNode[];
}

interface BookmarkCreateDetails {
  url?: string;
  title: string;
  id?: string;
  parentId: string;
  index?: number;
}

interface BookmarkUpdateChanges {
  title?: string;
  url?: string;
}

interface BookmarkMoveDestination {
  index?: number;
  parentId?: string;
}

interface CreateTabDetails {
  url: string;
}

type EventType = "onChanged" | "onCreated" | "onMoved" | "onRemoved";
type ListenerCallback = (...args: unknown[]) => void;

let bookmarkTree: BookmarkTreeNode = {
  id: "0",
  title: "Bookmarks",
  type: "folder",
  children: [
    {
      id: "1",
      parentId: "0",
      index: 0,
      title: "Bookmarks Bar",
      type: "folder",
      children: [],
    },
  ],
};

const listeners: Record<EventType, ListenerCallback[]> = {
  onChanged: [],
  onCreated: [],
  onMoved: [],
  onRemoved: [],
};

// Guard against rebroadcast loops (isProcessingBroadcast) and debounce
// redundant broadcasts (broadcastTimeout) during programmatic or cross-tab
// updates.
let isProcessingBroadcast = false;
let broadcastTimeout: ReturnType<typeof setTimeout> | null = null;

const bc = new BroadcastChannel("easy-bookmarks");

bc.onmessage = (e) => {
  isProcessingBroadcast = true;

  bookmarkTree = e.data;

  listeners.onChanged.forEach((callback) => {
    try {
      callback();
    } catch (error) {
      console.error("Error in onChanged listener from broadcast:", error);
    }
  });

  setTimeout(() => {
    isProcessingBroadcast = false;
  }, 100);
};

function triggerListeners(eventType: EventType, ...args: unknown[]) {
  listeners[eventType].forEach((callback) => {
    try {
      callback(...args);
    } catch (error) {
      console.error(`Error in ${eventType} listener:`, error);
    }
  });
}

// Broadcast bookmark tree changes to other tabs (debounced to avoid flooding)
function broadcastChanges() {
  if (isProcessingBroadcast) {
    return;
  }

  if (broadcastTimeout) {
    clearTimeout(broadcastTimeout);
  }
  broadcastTimeout = setTimeout(() => {
    bc.postMessage(bookmarkTree);
  }, 50);
}

function addListener(eventType: EventType, callback: ListenerCallback) {
  if (typeof callback !== "function") {
    throw new Error("Callback must be a function");
  }

  if (!listeners[eventType].includes(callback)) {
    listeners[eventType].push(callback);
  }
}

function removeListener(eventType: EventType, callback: ListenerCallback) {
  const index = listeners[eventType].indexOf(callback);
  if (index !== -1) listeners[eventType].splice(index, 1);
}

function create({
  url,
  title,
  id,
  parentId,
}: BookmarkCreateDetails): BookmarkTreeNode {
  const parent = findBookmarkById(parentId);
  if (!parent || parent.type !== "folder") {
    throw new Error("Parent not found or is not a folder");
  }

  const newBookmark: BookmarkTreeNode = {
    id: id || crypto.randomUUID(),
    parentId,
    url,
    title: title!,
    type: url ? "bookmark" : "folder",
    index: parent.children!.length,
  };

  if (!url) {
    newBookmark.children = [];
  }

  parent.children!.push(newBookmark);

  triggerListeners("onCreated", newBookmark.id, newBookmark);

  broadcastChanges();

  return newBookmark;
}

function getTree() {
  return [bookmarkTree];
}

function getSubTree(
  id: string,
  bookmarks: BookmarkTreeNode = bookmarkTree,
): BookmarkTreeNode[] | null {
  if (bookmarks.id === id) {
    return [
      {
        id,
        parentId: bookmarks.parentId,
        title: bookmarks.title,
        type: bookmarks.type,
        children: bookmarks.children?.sort((a, b) => a.index! - b.index!),
      },
    ];
  }

  if (!bookmarks.children) {
    return null;
  }

  for (const child of bookmarks.children) {
    if (child.type === "folder") {
      const subTree = getSubTree(id, child);
      if (subTree) {
        return subTree;
      }
    }
  }

  return null;
}

function getChildren(id: string): BookmarkTreeNode[] {
  const subTree = getSubTree(id);
  return subTree?.[0]?.children?.sort((a, b) => a.index! - b.index!) || [];
}

function get(
  idOrIdList: string | string[],
  bookmarks: BookmarkTreeNode = bookmarkTree,
): Promise<BookmarkTreeNode[]> {
  return new Promise((resolve, reject) => {
    const ids = Array.isArray(idOrIdList) ? idOrIdList : [idOrIdList];

    if (ids.length === 0) {
      reject(new Error("No bookmarks found"));
      return;
    }

    const results = [];

    for (const id of ids) {
      const bookmark = findBookmarkById(id, bookmarks);
      if (bookmark) {
        results.push(bookmark);
      } else {
        reject(new Error("No bookmarks found"));
        return;
      }
    }

    resolve(results);
  });
}

function findBookmarkById(
  id: string,
  bookmarks: BookmarkTreeNode = bookmarkTree,
): BookmarkTreeNode | null {
  if (bookmarks.id === id) {
    return bookmarks;
  }

  if (bookmarks.children) {
    for (const child of bookmarks.children) {
      if (child.id === id) {
        return child;
      }
    }

    for (const child of bookmarks.children) {
      if (child.type === "folder") {
        const result = findBookmarkById(id, child);
        if (result) {
          return result;
        }
      }
    }
  }

  return null;
}

function move(id: string, { index, parentId }: BookmarkMoveDestination): void {
  const bookmark = findBookmarkById(id);
  if (!bookmark) {
    throw new Error("Bookmark not found");
  }

  const oldParent = findBookmarkById(bookmark.parentId!);
  if (!oldParent) {
    throw new Error("Old parent not found");
  }

  const newParentId = parentId || bookmark.parentId;
  const newParent = findBookmarkById(newParentId!);
  if (!newParent) {
    throw new Error("New parent not found");
  }

  if (newParent.type !== "folder") {
    throw new Error("New parent is not a folder");
  }

  const oldIndex = bookmark.index;
  const oldParentId = bookmark.parentId;

  if (newParentId !== bookmark.parentId) {
    if (!oldParent.children) {
      oldParent.children = [];
    }
    const oldIndex = oldParent.children.findIndex((b) => b.id === id);
    if (oldIndex !== -1) {
      oldParent.children.splice(oldIndex, 1);
    }

    bookmark.parentId = newParentId;

    if (!newParent.children) {
      newParent.children = [];
    }

    if (index !== undefined) {
      bookmark.index = index;
      newParent.children.splice(index, 0, bookmark);
    } else {
      bookmark.index = newParent.children.length;
      newParent.children.push(bookmark);
    }

    oldParent.children.forEach((b, i) => {
      b.index = i;
    });
    oldParent.children.sort((a, b) => a.index! - b.index!);

    newParent.children.forEach((b, i) => {
      b.index = i;
    });
    newParent.children.sort((a, b) => a.index! - b.index!);
  } else {
    const parent = findBookmarkById(bookmark.parentId!);
    if (!parent || !parent.children) {
      throw new Error("Parent or children not found");
    }
    const bookmarks = parent.children;

    const from = bookmark.index!;
    const to = index!;

    bookmarks.forEach((b) => {
      if (from < to) {
        if (b.index! > from && b.index! <= to) {
          b.index!--;
        }
      } else if (from > to) {
        if (b.index! >= to && b.index! < from) {
          b.index!++;
        }
      }
    });

    bookmark.index = to;

    bookmarks.sort((a, b) => a.index! - b.index!);
  }

  triggerListeners("onMoved", id, {
    index: bookmark.index,
    oldIndex: oldIndex,
    parentId: bookmark.parentId,
    oldParentId: oldParentId,
  });

  broadcastChanges();
}

function remove(id: string): void {
  const bookmark = findBookmarkById(id);
  if (!bookmark) {
    throw new Error("Bookmark not found");
  }

  const parent = findBookmarkById(bookmark.parentId!);
  if (!parent || !parent.children) {
    throw new Error("Parent not found or has no children");
  }

  const index = parent.children.findIndex((b) => b.id === id);
  if (index !== -1) {
    parent.children.splice(index, 1);

    parent.children.forEach((b, i) => {
      b.index = i;
    });
  }

  triggerListeners("onRemoved", id, {
    parentId: bookmark.parentId,
    index: bookmark.index,
    node: bookmark,
  });

  broadcastChanges();
}

function update(id: string, changes: BookmarkUpdateChanges): BookmarkTreeNode {
  const bookmark = findBookmarkById(id);
  if (!bookmark) {
    throw new Error("Bookmark not found");
  }

  const parent = findBookmarkById(bookmark.parentId!);
  if (!parent || !parent.children) {
    throw new Error("Parent not found or has no children");
  }

  const index = parent.children.findIndex((b) => b.id === id);
  const updatedBookmark = {
    ...parent.children[index],
    ...changes,
  };
  parent.children[index] = updatedBookmark;

  triggerListeners("onChanged", id, changes);

  broadcastChanges();

  return updatedBookmark;
}

// Mimic chrome.bookmarks.search(query): all whitespace-separated tokens must
// match (case-insensitive) against the node's title and url. Returns a flat
// list of matching nodes (bookmarks match on title+url, folders on title),
// excluding the hidden root container.
function search(query: string): Promise<BookmarkTreeNode[]> {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results: BookmarkTreeNode[] = [];

  function walk(node: BookmarkTreeNode) {
    if (node.id !== "0") {
      const haystack = `${node.title ?? ""} ${node.url ?? ""}`.toLowerCase();
      if (tokens.length > 0 && tokens.every((t) => haystack.includes(t))) {
        results.push(node);
      }
    }
    node.children?.forEach(walk);
  }

  walk(bookmarkTree);
  return Promise.resolve(results);
}

function createTab({ url }: CreateTabDetails): void {
  window.open(url, "_blank", "noreferrer");
}

const bookmarks = {
  create,
  get,
  getChildren,
  getSubTree,
  getTree,
  move,
  remove,
  removeTree: remove,
  search,
  update,
  onChanged: {
    addListener: (callback: ListenerCallback) =>
      addListener("onChanged", callback),
    removeListener: (callback: ListenerCallback) =>
      removeListener("onChanged", callback),
  },
  onCreated: {
    addListener: (callback: ListenerCallback) =>
      addListener("onCreated", callback),
    removeListener: (callback: ListenerCallback) =>
      removeListener("onCreated", callback),
  },
  onMoved: {
    addListener: (callback: ListenerCallback) =>
      addListener("onMoved", callback),
    removeListener: (callback: ListenerCallback) =>
      removeListener("onMoved", callback),
  },
  onRemoved: {
    addListener: (callback: ListenerCallback) =>
      addListener("onRemoved", callback),
    removeListener: (callback: ListenerCallback) =>
      removeListener("onRemoved", callback),
  },
};

export default { bookmarks, tabs: { create: createTab } };
