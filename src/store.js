const data = () => {
  let bookmarks = [];

  const getBookmarks = async () => {
    bookmarks = await browser.bookmarks.getChildren("toolbar_____");

    try {
      bookmarks = bookmarks
        .filter(({ url, type }) => !/^place:/.test(url) && type === "bookmark")
        .map(({ title, url }) => ({ title, url }));
    } catch (e) {
      console.log(`Error: ${e}`);
    }

    return bookmarks;
  };

  return getBookmarks();
};

export { data };
