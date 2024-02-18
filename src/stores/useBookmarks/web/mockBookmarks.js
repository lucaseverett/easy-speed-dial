import { browser } from "./browser.bookmarks";
import amazonThumbnail from "./images/amazon.svg";
import bestBuyThumbnail from "./images/bestbuy.svg";
import bookingThumbnail from "./images/booking.svg";
import disneyThumbnail from "./images/disney.svg";
import ebayThumbnail from "./images/ebay.svg";
import expediaThumbnail from "./images/expedia.svg";
import grubhubThumbnail from "./images/grubhub.svg";
import hotelsThumbnail from "./images/hotels.svg";
import targetThumbnail from "./images/target.svg";
import walmartThumbnail from "./images/walmart.svg";
import youTubeThumbnail from "./images/youtube.svg";

export const bookmarks = [
  [
    "https://www.amazon.com",
    "Amazon",
    "87b397bd-0566-4483-b21a-076bac23206b",
    "#232F3E",
    amazonThumbnail,
  ],
  [
    "https://www.bestbuy.com",
    "Best Buy",
    "74c2e0b3-97be-4d6c-8aac-b58d90a09b86",
    "#0046be",
    bestBuyThumbnail,
  ],
  [
    "https://www.booking.com",
    "Booking.com",
    "3d9912ed-4b31-4415-bf96-7ccc427349a7",
    "#003b95",
    bookingThumbnail,
  ],
  [
    "https://www.disneyplus.com",
    "Disney+",
    "5516b9ca-cbc0-46d1-b384-c8e213281b84",
    "#020E40",
    disneyThumbnail,
  ],
  [
    "https://www.ebay.com",
    "eBay",
    "5408ac78-311a-4c9e-b859-38ea04f739fa",
    "#fff",
    ebayThumbnail,
  ],
  [
    "https://www.expedia.com",
    "Expedia",
    "cd1ff3d3-f6d8-4b10-a802-b6ce9037559b",
    "#fff",
    expediaThumbnail,
  ],
  [
    "https://www.grubhub.com",
    "Grubhub",
    "60f78b1c-7082-4dbc-89c8-7bb82bb6c67f",
    "#fff",
    grubhubThumbnail,
  ],
  [
    "https://www.hotels.com",
    "Hotels.com",
    "8b98dfe2-a7d4-47a4-8ffe-3b70966c6be8",
    "#fff",
    hotelsThumbnail,
  ],
  [
    "https://www.target.com",
    "Target",
    "74038f98-fb5d-4e73-ba4f-e2cb23593787",
    "#fff",
    targetThumbnail,
  ],
  [
    "https://www.walmart.com",
    "Walmart",
    "6de4bf83-1499-40ef-8506-5313593d2d2a",
    "#0071dc",
    walmartThumbnail,
  ],
  [
    "https://www.youtube.com",
    "YouTube",
    "e3b67ddb-87b7-4e05-99f6-112285e87ef4",
    "#fff",
    youTubeThumbnail,
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

if (process.env.NODE_ENV === "development") {
  const topSitesUSFolder = browser.bookmarks.create({
    title: "Top Sites - US",
    id: "a1e0e978-6fcf-48ec-a968-e88fcf021faf",
    parentId: "1",
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
    parentId: "1",
  });

  topSitesGlobal.forEach((b) => {
    browser.bookmarks.create({
      url: `https://${b}`,
      title: b,
      parentId: topSitesGlobalFolder.id,
    });
  });
}
