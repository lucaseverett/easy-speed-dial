interface FilteredBookmark {
  title?: string;
  url?: string;
  type: "bookmark" | "folder";
  name: string[];
  id: string;
  parentId?: string;
  index?: number;
}
