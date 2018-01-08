const data = () => {
  let bookmarks = [];

  const getBookmarks = async () => {
    bookmarks = await browser.bookmarks.getChildren("toolbar_____");

    try {
      bookmarks = bookmarks.map(({ title, url, type }) => {
        if (!/^place:sort=/.test(url) && type !== "folder") {
          return { title, url };
        }
      });
    } catch (e) {
      console.log(`Error: ${e}`);
    }

    return bookmarks;
  };

  return getBookmarks();
};

export { data };
