import "webextension-polyfill";

type FolderType = "bookmarks-bar" | "other" | "mobile" | "managed";

declare module "webextension-polyfill" {
  namespace Bookmarks {
    interface BookmarkTreeNode {
      folderType?: FolderType;
      syncing?: boolean;
    }
  }
}
