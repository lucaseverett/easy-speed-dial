import { browser } from "./browser.bookmarks";

const bookmarks = [
  ["https://www.google.com", "Google", "3d9912ed-4b31-4415-bf96-7ccc427349a7"],
  [
    "https://www.youtube.com",
    "YouTube",
    "e3b67ddb-87b7-4e05-99f6-112285e87ef4",
  ],
  [
    "https://www.facebook.com",
    "Facebook",
    "5408ac78-311a-4c9e-b859-38ea04f739fa",
  ],
  ["https://www.amazon.com", "Amazon", "87b397bd-0566-4483-b21a-076bac23206b"],
  ["https://www.yahoo.com", "Yahoo", "60f78b1c-7082-4dbc-89c8-7bb82bb6c67f"],
  ["https://www.reddit.com", "Reddit", "6de4bf83-1499-40ef-8506-5313593d2d2a"],
  [
    "https://www.wikipedia.org",
    "Wikipedia",
    "8b98dfe2-a7d4-47a4-8ffe-3b70966c6be8",
  ],
  [
    "https://www.instagram.com",
    "Instagram",
    "5516b9ca-cbc0-46d1-b384-c8e213281b84",
  ],
  ["https://www.ebay.com", "eBay", "cd1ff3d3-f6d8-4b10-a802-b6ce9037559b"],
];

const otherBookmarks = [
  [
    "https://lucaseverett.dev",
    "Lucas Everett",
    "a1146c3c-6890-4dbd-b0c1-57f7a976faeb",
  ],
  [
    "https://toolbardial.com",
    "Easy Speed Dial",
    "ce160173-0b97-446d-ab4d-3c202221cbc9",
  ],
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

// ==========================
// LOAD MOCK BOOKMARKS
// ==========================

bookmarks.forEach((b) => {
  browser.bookmarks.create({ url: b[0], title: b[1], id: b[2], parentId: "1" });
});

const otherBookmarksFolder = browser.bookmarks.create({
  title: "Other Bookmarks",
  id: "12335f16-cd20-45f0-9b01-db6d8b055c61",
  parentId: "1",
});

otherBookmarks.forEach((b) => {
  browser.bookmarks.create({
    url: b[0],
    title: b[1],
    id: b[2],
    parentId: otherBookmarksFolder.id,
  });
});

if (process.env.NODE_ENV === "development") {
  const topSitesUSFolder = browser.bookmarks.create({
    title: "Top Sites - US",
    id: "a1e0e978-6fcf-48ec-a968-e88fcf021faf",
    parentId: otherBookmarksFolder.id,
  });

  topSitesUS.forEach((b) => {
    browser.bookmarks.create({
      url: `https://${b}`,
      title: b,
      parentId: topSitesUSFolder.id,
    });
  });

  const topSitesGlobalFolder = browser.bookmarks.create({
    title: "Top Sites - Global",
    id: "5d311f7f-d4e4-43b1-a87b-98b159bafe8d",
    parentId: otherBookmarksFolder.id,
  });

  topSitesGlobal.forEach((b) => {
    browser.bookmarks.create({
      url: `https://${b}`,
      title: b,
      parentId: topSitesGlobalFolder.id,
    });
  });
}
