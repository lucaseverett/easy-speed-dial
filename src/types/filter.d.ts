interface FilteredBookmark {
  title?: string;
  url?: string;
  type: "bookmark" | "folder" | "divider";
  name: string[];
  id: string;
  parentId?: string;
  index?: number;
}
