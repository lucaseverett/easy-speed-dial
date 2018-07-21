let bookmarks = {
  toolbar_____: [
    {
      id: "95cb7e50",
      index: 0,
      parentID: "toolbar_____",
      url: undefined,
      title: "Test Folder",
      type: "folder"
    },
    {
      id: "95cb8490",
      index: 1,
      parentID: "toolbar_____",
      url: "https://www.mozilla.org/en-US/firefox/central/",
      title: "Getting Started"
    }
  ],
  "95cb7e50": [
    {
      id: "95cb8f58",
      index: 0,
      parentID: "95cb7e50",
      url: undefined,
      title: "Test Folder 2",
      type: "folder"
    }
  ],
  "95cb8f58": [
    {
      id: "538acb30",
      index: 1,
      parentID: "95cb8f58",
      url: undefined,
      title: "Test Folder 3",
      type: "folder"
    }
  ],
  "538acb30": [
    {
      id: "538acb31",
      index: 0,
      parentID: "538acb30",
      url: "https://www.mozilla.org/en-US/firefox/central/",
      title: "Getting Started",
      type: "folder"
    }
  ]
};

let getChildren = folder => {
  return Promise.resolve(bookmarks[folder]);
};

export default { bookmarks: { getChildren } };
