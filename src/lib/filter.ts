import type { Bookmarks } from "webextension-polyfill";

export interface FilteredBookmark {
  title?: string;
  url?: string;
  type: "bookmark" | "folder" | "separator";
  name: string[];
  id: string;
  parentId?: string;
  index?: number;
}

function getLinkName(url: string): string[] {
  const protocolSplit = url.split("://");
  let parts = [];

  if (protocolSplit[1]) {
    const domainPathSplit = protocolSplit[1].split("/");
    const domainParts = domainPathSplit[0].split(".");

    if (domainParts[0] === "www") {
      domainParts.shift();
    }

    if (domainParts.length > 3) {
      parts = [domainParts[0], domainParts[1], domainParts.slice(2).join(".")];
    } else {
      parts = domainParts;
    }
  } else {
    const colonIndex = url.indexOf(":");
    if (colonIndex !== -1) {
      parts = [url.substring(colonIndex + 1)];
    } else {
      parts = [url];
    }
  }

  return parts;
}

function isSeparatorFolder({
  title,
  type,
  url,
}: Bookmarks.BookmarkTreeNode): boolean {
  return type !== "separator" && !url && /^-{3,}$/.test(title.trim());
}

function filter(bookmarks: Bookmarks.BookmarkTreeNode[]): FilteredBookmark[] {
  return bookmarks
    .filter((bookmark: Bookmarks.BookmarkTreeNode) => {
      const { url = "", type } = bookmark;
      if (type === "separator" || isSeparatorFolder(bookmark)) return true;

      return !url.match(
        /^(javascript|place|about|chrome|edge|file|data|blob):/i,
      );
    })
    .map(
      ({
        id,
        index,
        parentId,
        title,
        type,
        url,
      }: Bookmarks.BookmarkTreeNode): FilteredBookmark => {
        if (
          type === "separator" ||
          isSeparatorFolder({ id, index, parentId, title, type, url })
        ) {
          return {
            type: "separator",
            title,
            name: [],
            id,
            parentId,
            index,
          };
        }

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

export { getLinkName, filter, isSeparatorFolder };
