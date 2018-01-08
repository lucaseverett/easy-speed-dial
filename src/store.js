const data = () => {
  let bookmarks = [];
  function onFulfilled(children) {
    for (let child of children) {
      if (!/^place:sort=/.test(child.url) && child.type !== "folder") {
        bookmarks.push({ title: child.title, url: child.url });
      }
    }
    return bookmarks;
  }

  function onRejected(error) {
    console.log(`An error: ${error}`);
  }

  var gettingChildren = browser.bookmarks.getChildren("toolbar_____");
  return gettingChildren.then(onFulfilled, onRejected);
};

export { data };
