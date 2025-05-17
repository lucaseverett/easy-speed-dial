let bookmarkTree = {
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

let listenerCb = null;
const bc = new BroadcastChannel("easy-bookmarks");

function broadcastChanges() {
  bc.postMessage(bookmarkTree);
}

function create({ url, title, id, parentId }) {
  const newBookmark = {
    id: id || crypto.randomUUID(),
    parentId: parentId,
    url,
    title,
    type: "bookmark",
    index: getChildren(parentId).length,
  };

  if (!url) {
    newBookmark.type = "folder";
    newBookmark.children = [];
  }

  getChildren(parentId).push(newBookmark);

  // Run the callback if it exists
  listenerCb?.();

  return newBookmark;
}

function getTree() {
  return [bookmarkTree];
}

function getSubTree(id, bookmarks = bookmarkTree) {
  if (bookmarks.id === id) {
    return [
      {
        id,
        parentId: bookmarks.parentId,
        title: bookmarks.title,
        children: bookmarks.children?.sort(
          (a, b) => (a.index || 0) - (b.index || 0),
        ),
      },
    ];
  }

  return (
    bookmarks.children?.reduce((acc, child) => {
      if (child.type === "folder") {
        const subTree = getSubTree(id, child);
        if (subTree) {
          return subTree;
        }
      }
      return acc;
    }, null) || null
  );
}

function getChildren(id) {
  return getSubTree(id)?.[0].children || [];
}

function get(id, bookmarks = bookmarkTree) {
  if (bookmarks.id === id) {
    return bookmarks;
  }

  const foundBookmark = bookmarks.children?.find(
    (child) => get(id, child) !== null,
  );

  return foundBookmark ? get(id, foundBookmark) : null;
}

function move(id, { index }) {
  const bookmark = get(id);
  const bookmarks = getChildren(bookmark.parentId);

  // Get the bookmark being moved
  const from = bookmark.index;
  const to = index;

  // If moving up, decrease each index in array by 1 between from and to
  // If moving down, increase each index in array by 1 between from and to
  bookmarks.forEach((b) => {
    if (from < to) {
      // moving down
      if (b.index > from && b.index <= to) {
        b.index--;
      }
    } else if (from > to) {
      // moving up
      if (b.index >= to && b.index < from) {
        b.index++;
      }
    }
  });

  // Set bookmark index to new position
  bookmark.index = to;

  // Sort the bookmarks by index
  bookmarks.sort((a, b) => a.index - b.index);

  // Run the callback if it exists
  listenerCb?.();
}

function remove(id) {
  const bookmarks = getChildren(get(id).parentId);
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index !== -1) bookmarks.splice(index, 1);

  // Run the callback if it exists
  listenerCb?.();
}

function update(id, changes) {
  const bookmarks = getChildren(get(id).parentId);
  const index = bookmarks.findIndex((b) => b.id === id);
  const updatedBookmark = {
    ...bookmarks[index],
    url: changes.url,
    title: changes.title,
  };
  bookmarks[index] = updatedBookmark;

  // Run the callback if it exists
  listenerCb?.();

  return updatedBookmark;
}

function addListener(callback) {
  if (!listenerCb) {
    listenerCb = () => {
      broadcastChanges();
      callback();
    };
    bc.onmessage = (e) => {
      bookmarkTree = e.data;
      callback();
    };
  }
}

function createTab({ url }) {
  window.open(url, "_blank", "noreferrer");
}

const bookmarks = {
  create,
  getChildren,
  getSubTree,
  getTree,
  move,
  remove,
  removeTree: remove,
  update,
  onChanged: { addListener },
  onCreated: { addListener },
  onMoved: { addListener },
  onRemoved: { addListener },
};

export default { bookmarks, tabs: { create: createTab } };
