interface FilteredBookmark {
  title?: string;
  url?: string;
  type: "bookmark" | "folder" | "separator";
  name: string[];
  id: string;
  parentId?: string;
  index?: number;
}
