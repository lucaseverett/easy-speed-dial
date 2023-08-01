const bookmarks = [
  ["https://www.google.com", "Google"],
  ["https://www.youtube.com", "YouTube"],
  ["https://www.facebook.com", "Facebook"],
  ["https://www.amazon.com", "Amazon"],
  ["https://www.yahoo.com", "Yahoo"],
  ["https://www.reddit.com", "Reddit"],
  ["https://www.wikipedia.org", "Wikipedia"],
  ["https://www.instagram.com", "Instagram"],
  ["https://www.ebay.com", "eBay"],
];

const otherBookmarks = [
  ["https://lucaseverett.dev", "Lucas Everett"],
  ["https://toolbardial.com", "Toolbar Dial"],
];

const topSitesUS = [
  "amazon.com",
  "youtube.com",
  "en.wikipedia.org",
  "twitter.com",
  "facebook.com",
  "yelp.com",
  "reddit.com",
  "imdb.com",
  "fandom.com",
  "pinterest.com",
  "tripadvisor.com",
  "instagram.com",
  "walmart.com",
  "craigslist.org",
  "ebay.com",
  "linkedin.com",
  "play.google.com",
  "healthline.com",
  "etsy.com",
  "indeed.com",
  "apple.com",
  "espn.com",
  "webmd.com",
  "fb.com",
  "nytimes.com",
  "google.com",
  "cnn.com",
  "merriam-webster.com",
  "gamepedia.com",
  "microsoft.com",
  "target.com",
  "homedepot.com",
  "quora.com",
  "nih.gov",
  "rottentomatoes.com",
  "netflix.com",
  "quizlet.com",
  "weather.com",
  "mapquest.com",
  "britannica.com",
  "businessinsider.com",
  "dictionary.com",
  "zillow.com",
  "mayoclinic.org",
  "bestbuy.com",
  "theguardian.com",
  "yahoo.com",
  "msn.com",
  "usatoday.com",
  "medicalnewstoday.com",
  "urbandictionary.com",
  "usnews.com",
  "foxnews.com",
  "genius.com",
  "allrecipes.com",
  "spotify.com",
  "glassdoor.com",
  "forbes.com",
  "cnet.com",
  "finance.yahoo.com",
  "irs.gov",
  "lowes.com",
  "mail.yahoo.com",
  "aol.com",
  "steampowered.com",
  "washingtonpost.com",
  "usps.com",
  "office.com",
  "retailmenot.com",
  "wiktionary.org",
  "paypal.com",
  "foodnetwork.com",
  "hulu.com",
  "live.com",
  "cbssports.com",
  "wayfair.com",
  "ca.gov",
  "bleacherreport.com",
  "macys.com",
  "accuweather.com",
  "xfinity.com",
  "go.com",
  "techradar.com",
  "groupon.com",
  "investopedia.com",
  "yellowpages.com",
  "steamcommunity.com",
  "bankofamerica.com",
  "chase.com",
  "wellsfargo.com",
  "ally.com",
  "discover.com",
  "capitalone.com",
  "creditkarma.com",
  "mint.com",
  "truist.com",
  "npr.org",
  "apartments.com",
  "roblox.com",
  "huffpost.com",
  "books.google.com",
  "bbb.org",
  "expedia.com",
  "wikihow.com",
  "ign.com",
  "wowhead.com",
  "weather.gov",
  "noaa.gov",
].sort();

const topSitesGlobal = [
  "google.com",
  "google.co.br",
  "google.de",
  "google.fr",
  "google.co.uk",
  "google.it",
  "google.co.jp",
  "google.co.in",
  "google.es",
  "amazon.com",
  "amazon.co.jp",
  "amazon.de",
  "amazon.co.uk",
  "amazon.co.in",
  "yahoo.com",
  "yahoo.co.jp",
].sort();

export const mockBookmarks = {
  id: "0",
  title: "Bookmarks",
  children: [
    {
      id: "1",
      title: "Bookmarks Bar",
      children: [],
      type: "folder",
    },
  ],
  type: "folder",
};

function getTree() {
  return [mockBookmarks];
}

function getSubTree(id, bookmarks = mockBookmarks) {
  if (bookmarks.id === id) {
    return {
      id,
      parentId: bookmarks.parentId,
      title: bookmarks.title,
      children: bookmarks.children.sort((a, b) => a.index - b.index),
    };
  }

  return bookmarks.children.reduce((acc, child) => {
    if (child.type === "folder") {
      const subTree = getSubTree(id, child);
      if (subTree) {
        acc = subTree;
      }
    }
    return acc;
  }, null);
}

function getChildren(id) {
  return getSubTree(id).children;
}

function getBookmark(id, bookmarks = mockBookmarks) {
  if (bookmarks.id === id) {
    return bookmarks;
  }

  const foundBookmark = bookmarks.children?.find(
    (child) => getBookmark(id, child) !== null,
  );

  return foundBookmark ? getBookmark(id, foundBookmark) : null;
}

function move(id, { index }) {
  const bookmark = getBookmark(id);
  const bookmarks = getChildren(bookmark.parentId);

  // Get the bookmark being moved
  const from = bookmark.index;
  const to = index;

  // If moving up, decrease each index in array by 1 between from and to
  // If moving down, increase each index in array by 1 between from and to
  bookmarks.forEach((b) => {
    if (from < to) {
      // moving down
      if (b.index > from && b.index <= to) {
        b.index--;
      }
    } else if (from > to) {
      // moving up
      if (b.index >= to && b.index < from) {
        b.index++;
      }
    }
  });

  // Set bookmark index to new position
  bookmark.index = to;

  // Sort the bookmarks by index
  bookmarks.sort((a, b) => a.index - b.index);
}

function remove(id) {
  const bookmarks = getChildren(getBookmark(id).parentId);
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index !== -1) bookmarks.splice(index, 1);
}

function generateUniqueId(input = "") {
  // This generates a stable ID based on the input.
  if (input === "") {
    return Math.floor(Math.random() * 1000000).toString();
  }

  const hash = Array.from(input).reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }, 0);

  return Math.abs(hash).toString();
}

function generateBookmark({ url, title, parentId, index }) {
  const bookmark = {
    id: generateUniqueId(url || title),
    parentId: parentId,
    url,
    title,
    type: "bookmark",
    index,
  };

  if (!url) {
    bookmark.type = "folder";
    bookmark.children = [];
  }

  return bookmark;
}

function create({ url, title, parentId }) {
  const newBookmark = generateBookmark({
    url,
    title,
    parentId,
    index: getChildren(parentId).length,
  });
  getChildren(parentId).push(newBookmark);
  return newBookmark;
}

function update(id, changes) {
  const bookmarks = getChildren(getBookmark(id).parentId);
  const index = bookmarks.findIndex((b) => b.id === id);
  const updatedBookmark = {
    ...bookmarks[index],
    url: changes.url,
    title: changes.title,
  };
  bookmarks[index] = updatedBookmark;
}

export const browser = {
  bookmarks: {
    create,
    getChildren,
    getSubTree,
    getTree,
    move,
    remove,
    removeTree: remove,
    update,
  },
};

// load mock bookmarks

bookmarks.forEach((b) => {
  create({ url: b[0], title: b[1], parentId: "1" });
});

const otherBookmarksFolder = create({
  title: "Other Bookmarks",
  parentId: "1",
});

otherBookmarks.forEach((b) => {
  create({
    url: b[0],
    title: b[1],
    parentId: otherBookmarksFolder.id,
  });
});

if (process.env.NODE_ENV === "development") {
  const topSitesUSFolder = create({
    title: "Top Sites - US",
    parentId: otherBookmarksFolder.id,
  });

  topSitesUS.forEach((b) => {
    create({
      url: `https://${b}`,
      title: b,
      parentId: topSitesUSFolder.id,
    });
  });

  const topSitesGlobalFolder = create({
    title: "Top Sites - Global",
    parentId: otherBookmarksFolder.id,
  });

  topSitesGlobal.forEach((b) => {
    create({
      url: `https://${b}`,
      title: b,
      parentId: topSitesGlobalFolder.id,
    });
  });
}
