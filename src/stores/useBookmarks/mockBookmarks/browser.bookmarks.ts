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

// Maintain separate listener arrays for each bookmark event type
const listeners: Record<EventType, ListenerCallback[]> = {
  onChanged: [],
  onCreated: [],
  onMoved: [],
  onRemoved: [],
};

// Flags to prevent infinite loops and redundant broadcasts during programmatic or cross-tab updates
let isProcessingBroadcast = false;
let broadcastTimeout: ReturnType<typeof setTimeout> | null = null;

const bc = new BroadcastChannel("easy-bookmarks");

// Listen for bookmark changes from other tabs via BroadcastChannel
bc.onmessage = (e) => {
  // Set flag to prevent re-broadcasting
  isProcessingBroadcast = true;

  // Replace the local bookmark tree with the version received from another tab
  bookmarkTree = e.data;

  // Notify all onChanged listeners to update the UI, but avoid rebroadcasting
  listeners.onChanged.forEach((callback) => {
    try {
      callback();
    } catch (error) {
      console.error("Error in onChanged listener from broadcast:", error);
    }
  });

  // Reset the isProcessingBroadcast flag after a short delay
  setTimeout(() => {
    isProcessingBroadcast = false;
  }, 100);
};

// Call all registered listeners for a given event type
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
  // Skip broadcasting if currently processing an incoming broadcast
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

// Register a callback for a specific event type
function addListener(eventType: EventType, callback: ListenerCallback) {
  if (typeof callback !== "function") {
    throw new Error("Callback must be a function");
  }

  listeners[eventType].push(callback);
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

  // Trigger onCreated listeners
  triggerListeners("onCreated", newBookmark.id, newBookmark);

  // Broadcast changes to other tabs
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
    // First check direct children
    for (const child of bookmarks.children) {
      if (child.id === id) {
        return child;
      }
    }

    // Then recursively search folders
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

  // Store old values for the event
  const oldIndex = bookmark.index;
  const oldParentId = bookmark.parentId;

  // If moving to a different folder
  if (newParentId !== bookmark.parentId) {
    // Remove the bookmark from its old parent folder
    if (!oldParent.children) {
      oldParent.children = [];
    }
    const oldIndex = oldParent.children.findIndex((b) => b.id === id);
    if (oldIndex !== -1) {
      oldParent.children.splice(oldIndex, 1);
    }

    // Add the bookmark to the new parent folder
    bookmark.parentId = newParentId;

    if (!newParent.children) {
      newParent.children = [];
    }

    // Set the bookmark's index in the new folder; add to end if index is not specified
    if (index !== undefined) {
      bookmark.index = index;
      newParent.children.splice(index, 0, bookmark);
    } else {
      bookmark.index = newParent.children.length;
      newParent.children.push(bookmark);
    }

    // Reindex all children in both the old and new parent folders
    oldParent.children.forEach((b, i) => {
      b.index = i;
    });
    // Sort the old parent's children by their updated indices
    oldParent.children.sort((a, b) => a.index! - b.index!);

    newParent.children.forEach((b, i) => {
      b.index = i;
    });
    // Sort the new parent's children by their updated indices
    newParent.children.sort((a, b) => a.index! - b.index!);
  } else {
    // Handle reordering bookmarks within the same folder
    const parent = findBookmarkById(bookmark.parentId!);
    if (!parent || !parent.children) {
      throw new Error("Parent or children not found");
    }
    const bookmarks = parent.children;

    // Determine the original and target indices for the bookmark being moved
    const from = bookmark.index!;
    const to = index!;

    // Adjust indices of affected bookmarks depending on move direction
    bookmarks.forEach((b) => {
      if (from < to) {
        // moving down
        if (b.index! > from && b.index! <= to) {
          b.index!--;
        }
      } else if (from > to) {
        // moving up
        if (b.index! >= to && b.index! < from) {
          b.index!++;
        }
      }
    });

    // Assign the bookmark its new index
    bookmark.index = to;

    // Sort all bookmarks in the folder by their index
    bookmarks.sort((a, b) => a.index! - b.index!);
  }

  // Notify all onMoved listeners about the move
  triggerListeners("onMoved", id, {
    index: bookmark.index,
    oldIndex: oldIndex,
    parentId: bookmark.parentId,
    oldParentId: oldParentId,
  });

  // Broadcast the updated bookmark tree to other tabs
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

    // Reindex the remaining children to ensure indices are sequential
    parent.children.forEach((b, i) => {
      b.index = i;
    });
  }

  // Notify all onRemoved listeners about the removal
  triggerListeners("onRemoved", id, {
    parentId: bookmark.parentId,
    index: bookmark.index,
    node: bookmark,
  });

  // Broadcast changes to other tabs
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

  // Notify all onChanged listeners about the update
  triggerListeners("onChanged", id, changes);

  // Broadcast changes to other tabs
  broadcastChanges();

  return updatedBookmark;
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
  update,
  onChanged: {
    addListener: (callback: ListenerCallback) =>
      addListener("onChanged", callback),
  },
  onCreated: {
    addListener: (callback: ListenerCallback) =>
      addListener("onCreated", callback),
  },
  onMoved: {
    addListener: (callback: ListenerCallback) =>
      addListener("onMoved", callback),
  },
  onRemoved: {
    addListener: (callback: ListenerCallback) =>
      addListener("onRemoved", callback),
  },
};

export default { bookmarks, tabs: { create: createTab } };
