const getLinkName = name => {
  name = /:\/\/(?:www\.)?(.*?)(?:\?|\/|$)/i.exec(name)[1].toLowerCase();
  return name.split(".");
};

const getFileName = name => {
  name = /:\/\/.*\/(.*?)$/i.exec(name)[1].toLowerCase();
  return name.split(".");
};

const getType = url => {
  if (/(http|ftp)/i.test(url)) {
    return "link";
  } else {
    return "file";
  }
};

export default bookmarks => {
  return bookmarks
    .filter(({ url = "" }) => !url.match(/^(javascript:\/\/|place:)/i))
    .map(({ title, url, id, parentID, index }) => {
      if (url) {
        let type = getType(url);
        let name = type === "link" ? getLinkName(url) : getFileName(url);
        return { title, url, type, name, id, parentID, index };
      } else {
        return { type: "folder", title, name: [title], id, parentID, index };
      }
    });
};
