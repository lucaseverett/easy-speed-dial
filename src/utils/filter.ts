import type { Bookmarks } from "webextension-polyfill";

function getLinkName(url: string): string[] {
  // Split by '://'
  const protocolSplit = url.split("://");
  let parts = [];

  // If '://' exists in the url
  if (protocolSplit[1]) {
    const domainPathSplit = protocolSplit[1].split("/");
    const domainParts = domainPathSplit[0].split(".");

    // Check if first part is 'www', if yes then remove it
    if (domainParts[0] === "www") {
      domainParts.shift();
    }

    if (domainParts.length > 3) {
      parts = [domainParts[0], domainParts[1], domainParts.slice(2).join(".")];
    } else {
      parts = domainParts;
    }
  } else {
    // For URLs like "mailto:user@example.com", return everything after first ':'
    const colonIndex = url.indexOf(":");
    if (colonIndex !== -1) {
      parts = [url.substring(colonIndex + 1)];
    } else {
      parts = [url];
    }
  }

  return parts;
}

function filter(bookmarks: Bookmarks.BookmarkTreeNode[]): FilteredBookmark[] {
  return bookmarks
    .filter(
      ({ url = "", type }: Bookmarks.BookmarkTreeNode) =>
        !url.match(/^(javascript|place|about|chrome|edge|file|data|blob):/i) &&
        type !== "separator",
    )
    .map(
      ({
        id,
        index,
        parentId,
        title,
        url,
      }: Bookmarks.BookmarkTreeNode): FilteredBookmark => {
        if (url) {
          const name = getLinkName(url);
          return { title, url, type: "bookmark", name, id, parentId, index };
        } else {
          return {
            type: "folder",
            title,
            name: [title || ""],
            id,
            parentId,
            index,
          };
        }
      },
    );
}

export { getLinkName, filter };
