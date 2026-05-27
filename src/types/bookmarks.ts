import type { Bookmarks } from "webextension-polyfill";

export interface BookmarkFolder {
  id: string;
  title: string;
}

export interface CreateBookmarkParams {
  url?: string;
  title: string;
  parentId: string;
}

export interface MoveBookmarkParams {
  id: string;
  from?: number;
  to?: number;
  parentId?: string;
}

export type BookmarkChanges = Partial<Bookmarks.CreateDetails>;
