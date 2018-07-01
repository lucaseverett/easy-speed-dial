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

const data = () => {
  const getBookmarks = async () => {
    let bookmarks = [];
    bookmarks = await browser.bookmarks.getChildren("toolbar_____");
    try {
      bookmarks = bookmarks
        .filter(({ url, type }) => !/^place:/.test(url) && type === "bookmark")
        .map(({ title, url }) => {
          let type = getType(url);
          let name = type === "link" ? getLinkName(url) : getFileName(url);

          return { title, url, type, name };
        });
    } catch (e) {
      console.log(`Error: ${e}`);
    }

    return { bookmarks };
  };

  return getBookmarks();
};

export default data;
