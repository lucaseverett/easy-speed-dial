import { sitePresets } from "#lib/sitePresets";
import browser from "./browser.bookmarks";

interface MockBookmarkLink {
  url: string;
  title: string;
}

const popularSiteMockBookmarkIds = {
  google: "cd6e0a79-3c5d-4720-a098-6ecc4ffcaecc",
  youtube: "e3b67ddb-87b7-4e05-99f6-112285e87ef4",
  facebook: "5a588664-5202-4fbf-ad0d-833ce6eae444",
  amazon: "87b397bd-0566-4483-b21a-076bac23206b",
  reddit: "b11e8df7-6b13-486d-b753-e96f889d6748",
  yahoo: "8ada2737-8738-4fbf-aa8a-b06e65c55f86",
  bing: "579f942d-80e8-458f-b33c-6a55b428432b",
  instagram: "31544c07-55d0-46f2-9c13-5be9b943407b",
  chatgpt: "5c84e8bb-e7f2-44d9-9a94-4f730f5aab0e",
  x: "b523a5c1-f2fd-4de3-8037-1ef1a83f92e1",
  wikipedia: "33935761-aa73-4782-a541-05f97d044ca9",
  linkedin: "5a0e733f-c62b-4c1e-8ac8-9b85f333bfc0",
} satisfies Partial<Record<keyof typeof sitePresets, string>>;

const mockPopularSitePresetKeys = Object.keys(
  popularSiteMockBookmarkIds,
) as Array<keyof typeof popularSiteMockBookmarkIds>;

function createMockBookmarkLinks(
  bookmarks: MockBookmarkLink[],
  parentId: string,
) {
  bookmarks.forEach((b) => {
    browser.bookmarks.create({
      url: `https://${b.url}`,
      title: b.title,
      parentId,
    });
  });
}

function createPresetDialBookmarks(parentId: string) {
  Object.entries(sitePresets).forEach(([key, preset]) => {
    browser.bookmarks.create({
      url: preset.url,
      title: preset.title,
      id: `preset-${key}`,
      parentId,
    });
  });
}

const topSitesUS: MockBookmarkLink[] = [
  { url: "google.com", title: "Google" },
  { url: "youtube.com", title: "YouTube" },
  { url: "facebook.com", title: "Facebook" },
  { url: "reddit.com", title: "Reddit" },
  { url: "amazon.com", title: "Amazon" },
  { url: "instagram.com", title: "Instagram" },
  { url: "wikipedia.org", title: "Wikipedia" },
  { url: "yahoo.com", title: "Yahoo" },
  { url: "chatgpt.com", title: "ChatGPT" },
  { url: "x.com", title: "X" },
  { url: "duckduckgo.com", title: "DuckDuckGo" },
  { url: "bing.com", title: "Bing" },
  { url: "weather.com", title: "The Weather Channel" },
  { url: "tiktok.com", title: "TikTok" },
  { url: "walmart.com", title: "Walmart" },
  { url: "temu.com", title: "Temu" },
  { url: "usps.com", title: "USPS" },
];

const topOnlineServicesUS: MockBookmarkLink[] = [
  { url: "google.com", title: "Google" },
  { url: "youtube.com", title: "YouTube" },
  { url: "facebook.com", title: "Facebook" },
  { url: "reddit.com", title: "Reddit" },
  { url: "amazon.com", title: "Amazon" },
  { url: "instagram.com", title: "Instagram" },
  { url: "yahoo.com", title: "Yahoo" },
  { url: "wikipedia.org", title: "Wikipedia" },
  { url: "weather.com", title: "The Weather Channel" },
  { url: "bing.com", title: "Bing" },
  { url: "walmart.com", title: "Walmart" },
  { url: "tiktok.com", title: "TikTok" },
  { url: "linkedin.com", title: "LinkedIn" },
  { url: "ebay.com", title: "eBay" },
  { url: "paypal.com", title: "PayPal" },
  { url: "netflix.com", title: "Netflix" },
  { url: "microsoft.com", title: "Microsoft" },
  { url: "pinterest.com", title: "Pinterest" },
  { url: "twitch.tv", title: "Twitch" },
  { url: "office.com", title: "Microsoft Office" },
];

const topShoppingUS: MockBookmarkLink[] = [
  { url: "walmart.com", title: "Walmart" },
  { url: "ebay.com", title: "eBay" },
  { url: "etsy.com", title: "Etsy" },
  { url: "target.com", title: "Target" },
  { url: "homedepot.com", title: "The Home Depot" },
  { url: "shop.app", title: "Shop" },
  { url: "cvs.com", title: "CVS" },
  { url: "samsung.com", title: "Samsung" },
  { url: "lowes.com", title: "Lowe's" },
  { url: "bestbuy.com", title: "Best Buy" },
  { url: "walgreens.com", title: "Walgreens" },
  { url: "shein.com", title: "SHEIN" },
  { url: "costco.com", title: "Costco" },
  { url: "wayfair.com", title: "Wayfair" },
  { url: "macys.com", title: "Macy's" },
  { url: "gap.com", title: "Gap" },
  { url: "kroger.com", title: "Kroger" },
  { url: "samsclub.com", title: "Sam's Club" },
  { url: "aliexpress.com", title: "AliExpress" },
  { url: "instacart.com", title: "Instacart" },
];

const topAIUS: MockBookmarkLink[] = [
  { url: "chatgpt.com", title: "ChatGPT" },
  { url: "claude.ai", title: "Claude" },
  { url: "gemini.google.com", title: "Gemini" },
  { url: "openai.com", title: "OpenAI" },
  { url: "character.ai", title: "Character.AI" },
  { url: "deepseek.com", title: "DeepSeek" },
  { url: "perplexity.ai", title: "Perplexity" },
  { url: "copilot.microsoft.com", title: "Microsoft Copilot" },
  { url: "grammarly.com", title: "Grammarly" },
  { url: "chat.deepseek.com", title: "DeepSeek Chat" },
  { url: "suno.com", title: "Suno" },
  { url: "deepl.com", title: "DeepL" },
  { url: "quillbot.com", title: "QuillBot" },
  { url: "x.ai", title: "xAI" },
  { url: "remove.bg", title: "remove.bg" },
  { url: "elevenlabs.io", title: "ElevenLabs" },
  { url: "huggingface.co", title: "Hugging Face" },
  { url: "lovable.dev", title: "Lovable" },
  { url: "anthropic.com", title: "Anthropic" },
  { url: "replit.com", title: "Replit" },
  { url: "grok.com", title: "Grok" },
];

const topEntertainmentUS: MockBookmarkLink[] = [
  { url: "bing.com", title: "Bing" },
  { url: "netflix.com", title: "Netflix" },
  { url: "spotify.com", title: "Spotify" },
  { url: "msn.com", title: "MSN" },
  { url: "hulu.com", title: "Hulu" },
  { url: "genius.com", title: "Genius" },
  { url: "dailymotion.com", title: "Dailymotion" },
  { url: "xfinity.com", title: "Xfinity" },
  { url: "disneyplus.com", title: "Disney+" },
  { url: "ticketmaster.com", title: "Ticketmaster" },
  { url: "deviantart.com", title: "DeviantArt" },
  { url: "hbomax.com", title: "HBO Max" },
  { url: "peacocktv.com", title: "Peacock" },
  { url: "crunchyroll.com", title: "Crunchyroll" },
  { url: "paramountplus.com", title: "Paramount+" },
  { url: "comicbook.com", title: "ComicBook.com" },
  { url: "gamespot.com", title: "GameSpot" },
  { url: "screenrant.com", title: "Screen Rant" },
  { url: "rottentomatoes.com", title: "Rotten Tomatoes" },
  { url: "tubitv.com", title: "Tubi" },
];

const topNewsUS: MockBookmarkLink[] = [
  { url: "youtube.com", title: "YouTube" },
  { url: "instagram.com", title: "Instagram" },
  { url: "wikipedia.org", title: "Wikipedia" },
  { url: "nytimes.com", title: "The New York Times" },
  { url: "imdb.com", title: "IMDb" },
  { url: "cnn.com", title: "CNN" },
  { url: "foxnews.com", title: "Fox News" },
  { url: "people.com", title: "People" },
  { url: "twitter.com", title: "Twitter" },
  { url: "bbc.com", title: "BBC" },
  { url: "theguardian.com", title: "The Guardian" },
  { url: "mlb.com", title: "MLB" },
  { url: "nbcnews.com", title: "NBC News" },
  { url: "usatoday.com", title: "USA Today" },
  { url: "apnews.com", title: "AP News" },
  { url: "dailymail.co.uk", title: "Daily Mail" },
  { url: "npr.org", title: "NPR" },
  { url: "cbsnews.com", title: "CBS News" },
  { url: "reuters.com", title: "Reuters" },
  { url: "forbes.com", title: "Forbes" },
];

const topGamingUS: MockBookmarkLink[] = [
  { url: "twitch.tv", title: "Twitch" },
  { url: "discord.com", title: "Discord" },
  { url: "steampowered.com", title: "Steam" },
  { url: "steamcommunity.com", title: "Steam Community" },
  { url: "ign.com", title: "IGN" },
  { url: "supercell.com", title: "Supercell" },
  { url: "gamespot.com", title: "GameSpot" },
  { url: "itch.io", title: "itch.io" },
  { url: "nintendo.com", title: "Nintendo" },
  { url: "nexusmods.com", title: "Nexus Mods" },
  { url: "xbox.com", title: "Xbox" },
  { url: "game8.co", title: "Game8" },
  { url: "epicgames.com", title: "Epic Games" },
  { url: "wowhead.com", title: "Wowhead" },
  { url: "playstation.com", title: "PlayStation" },
  { url: "bulbagarden.net", title: "Bulbagarden" },
  { url: "poki.com", title: "Poki" },
  { url: "pokemondb.net", title: "Pokemon Database" },
  { url: "serebii.net", title: "Serebii" },
  { url: "crazygames.com", title: "CrazyGames" },
];

const topFinanceUS: MockBookmarkLink[] = [
  { url: "yahoo.com", title: "Yahoo" },
  { url: "paypal.com", title: "PayPal" },
  { url: "shop.app", title: "Shop" },
  { url: "capitalone.com", title: "Capital One" },
  { url: "chase.com", title: "Chase" },
  { url: "bankofamerica.com", title: "Bank of America" },
  { url: "wellsfargo.com", title: "Wells Fargo" },
  { url: "cnbc.com", title: "CNBC" },
  { url: "fidelity.com", title: "Fidelity" },
  { url: "citi.com", title: "Citi" },
  { url: "creditkarma.com", title: "Credit Karma" },
  { url: "experian.com", title: "Experian" },
  { url: "tremendous.com", title: "Tremendous" },
  { url: "cash.app", title: "Cash App" },
  { url: "reuters.com", title: "Reuters" },
  { url: "businessinsider.com", title: "Business Insider" },
  { url: "stripe.com", title: "Stripe" },
];

const topBankingUS: MockBookmarkLink[] = [
  { url: "capitalone.com", title: "Capital One" },
  { url: "chase.com", title: "Chase" },
  { url: "bankofamerica.com", title: "Bank of America" },
  { url: "wellsfargo.com", title: "Wells Fargo" },
  { url: "citi.com", title: "Citi" },
  { url: "creditkarma.com", title: "Credit Karma" },
  { url: "experian.com", title: "Experian" },
  { url: "cash.app", title: "Cash App" },
  { url: "americanexpress.com", title: "American Express" },
  { url: "chime.com", title: "Chime" },
  { url: "discover.com", title: "Discover" },
  { url: "navyfederal.org", title: "Navy Federal Credit Union" },
  { url: "usbank.com", title: "U.S. Bank" },
  { url: "moneylion.com", title: "MoneyLion" },
  { url: "pnc.com", title: "PNC" },
  { url: "myprepaidcenter.com", title: "MyPrepaidCenter" },
  { url: "creditonebank.com", title: "Credit One Bank" },
  { url: "truist.com", title: "Truist" },
  { url: "wise.com", title: "Wise" },
  { url: "onepay.com", title: "OnePay" },
];

const topSoftwareUS: MockBookmarkLink[] = [
  { url: "paypal.com", title: "PayPal" },
  { url: "office.com", title: "Microsoft Office" },
  { url: "discord.com", title: "Discord" },
  { url: "intuit.com", title: "Intuit" },
  { url: "zoom.us", title: "Zoom" },
  { url: "canva.com", title: "Canva" },
  { url: "github.com", title: "GitHub" },
  { url: "duosecurity.com", title: "Duo Security" },
  { url: "brave.com", title: "Brave" },
  { url: "opera.com", title: "Opera" },
  { url: "shopify.com", title: "Shopify" },
  { url: "adobe.com", title: "Adobe" },
  { url: "okta.com", title: "Okta" },
  { url: "openai.com", title: "OpenAI" },
  { url: "toasttab.com", title: "Toast" },
  { url: "snapchat.com", title: "Snapchat" },
  { url: "icloud.com", title: "iCloud" },
  { url: "getadblock.com", title: "AdBlock" },
  { url: "dropbox.com", title: "Dropbox" },
  { url: "stripe.com", title: "Stripe" },
];

const topInformationTechnologyUS: MockBookmarkLink[] = [
  { url: "live.com", title: "Microsoft Live" },
  { url: "office.com", title: "Microsoft Office" },
  { url: "brave.com", title: "Brave" },
  { url: "duosecurity.com", title: "Duo Security" },
  { url: "okta.com", title: "Okta" },
  { url: "guard.io", title: "Guardio" },
  { url: "adblockplus.org", title: "Adblock Plus" },
  { url: "tremendous.com", title: "Tremendous" },
  { url: "stripe.com", title: "Stripe" },
  { url: "gmail.com", title: "Gmail" },
  { url: "icloud.com", title: "iCloud" },
  { url: "myworkday.com", title: "Workday" },
  { url: "dropbox.com", title: "Dropbox" },
  { url: "opera.com", title: "Opera" },
  { url: "wordpress.com", title: "WordPress.com" },
  { url: "outlook.com", title: "Outlook" },
  { url: "slack.com", title: "Slack" },
  { url: "gofile.io", title: "Gofile" },
  { url: "yandex.com", title: "Yandex" },
  { url: "atlassian.net", title: "Atlassian" },
];

const topTravelUS: MockBookmarkLink[] = [
  { url: "expedia.com", title: "Expedia" },
  { url: "booking.com", title: "Booking.com" },
  { url: "airbnb.com", title: "Airbnb" },
  { url: "aa.com", title: "American Airlines" },
  { url: "tripadvisor.com", title: "Tripadvisor" },
  { url: "americanexpress.com", title: "American Express" },
  { url: "marriott.com", title: "Marriott" },
  { url: "priceline.com", title: "Priceline" },
  { url: "hilton.com", title: "Hilton" },
  { url: "united.com", title: "United Airlines" },
  { url: "travelandtourworld.com", title: "Travel And Tour World" },
  { url: "kayak.com", title: "Kayak" },
  { url: "flightaware.com", title: "FlightAware" },
  { url: "carnival.com", title: "Carnival" },
  { url: "amtrak.com", title: "Amtrak" },
  { url: "hotels.com", title: "Hotels.com" },
  { url: "vrbo.com", title: "Vrbo" },
  { url: "enterprise.com", title: "Enterprise" },
  { url: "royalcaribbean.com", title: "Royal Caribbean" },
  { url: "ihg.com", title: "IHG Hotels & Resorts" },
];

const topDiningUS: MockBookmarkLink[] = [
  { url: "doordash.com", title: "DoorDash" },
  { url: "dominos.com", title: "Domino's" },
  { url: "opentable.com", title: "OpenTable" },
  { url: "pizzahut.com", title: "Pizza Hut" },
  { url: "ubereats.com", title: "Uber Eats" },
  { url: "littlecaesars.com", title: "Little Caesars" },
  { url: "order.online", title: "Order Online" },
  { url: "mcdonalds.com", title: "McDonald's" },
  { url: "chick-fil-a.com", title: "Chick-fil-A" },
  { url: "grubhub.com", title: "Grubhub" },
  { url: "papajohns.com", title: "Papa Johns" },
  { url: "tacobell.com", title: "Taco Bell" },
  { url: "chipotle.com", title: "Chipotle" },
  { url: "subway.com", title: "Subway" },
  { url: "olivegarden.com", title: "Olive Garden" },
  { url: "wingstop.com", title: "Wingstop" },
  { url: "texasroadhouse.com", title: "Texas Roadhouse" },
  { url: "applebees.com", title: "Applebee's" },
  { url: "panerabread.com", title: "Panera Bread" },
  { url: "bk.com", title: "Burger King" },
];

// ==========================
// LOAD MOCK BOOKMARKS
// ==========================

mockPopularSitePresetKeys.forEach((key) => {
  const preset = sitePresets[key];
  browser.bookmarks.create({
    url: preset.url,
    title: preset.title,
    id: popularSiteMockBookmarkIds[key],
    parentId: "1",
  });
});

if (import.meta.env.DEV) {
  const topSitesUSFolder = browser.bookmarks.create({
    title: "Top Sites",
    id: "a1e0e978-6fcf-48ec-a968-e88fcf021faf",
    parentId: "1",
  });

  const topAIUSFolder = browser.bookmarks.create({
    title: "AI",
    id: "5dd2276b-f69b-4249-8ab8-96e49b9a49e4",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topAIUS, topAIUSFolder.id);

  const topBankingUSFolder = browser.bookmarks.create({
    title: "Banking",
    id: "119e1bd6-9e71-41ff-9d85-83dd39658af6",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topBankingUS, topBankingUSFolder.id);

  const topDiningUSFolder = browser.bookmarks.create({
    title: "Dining",
    id: "2306a80b-2aa5-4054-b94d-44741530522d",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topDiningUS, topDiningUSFolder.id);

  const topEntertainmentUSFolder = browser.bookmarks.create({
    title: "Entertainment",
    id: "6c23eb93-84e6-4cfc-8412-4f4c1f47ebca",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topEntertainmentUS, topEntertainmentUSFolder.id);

  const topFinanceUSFolder = browser.bookmarks.create({
    title: "Finance",
    id: "0a08323a-2512-49e2-80c4-7056fae6cf5f",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topFinanceUS, topFinanceUSFolder.id);

  const topGamingUSFolder = browser.bookmarks.create({
    title: "Gaming",
    id: "46269603-30ac-4769-91ea-ef391511eaef",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topGamingUS, topGamingUSFolder.id);

  const topInformationTechnologyUSFolder = browser.bookmarks.create({
    title: "Information Technology",
    id: "de19dbad-93af-45cc-a0e1-0a7c3269c813",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(
    topInformationTechnologyUS,
    topInformationTechnologyUSFolder.id,
  );

  const topNewsUSFolder = browser.bookmarks.create({
    title: "News",
    id: "e2ed02b5-b67c-4669-9f2c-aace890834be",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topNewsUS, topNewsUSFolder.id);

  const topOnlineServicesUSFolder = browser.bookmarks.create({
    title: "Online Services",
    id: "ef333728-151a-4938-93d2-2708fecc82da",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topOnlineServicesUS, topOnlineServicesUSFolder.id);

  const topShoppingUSFolder = browser.bookmarks.create({
    title: "Shopping",
    id: "1099d78e-bf6a-4872-a941-a068c7527b48",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topShoppingUS, topShoppingUSFolder.id);

  const topSoftwareUSFolder = browser.bookmarks.create({
    title: "Software",
    id: "3e94d5dd-38ff-4cb8-a1c9-097de4d29208",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topSoftwareUS, topSoftwareUSFolder.id);

  const topTravelUSFolder = browser.bookmarks.create({
    title: "Travel",
    id: "4cb5b8d6-9c69-4935-a24b-70acfae3e7d6",
    parentId: topSitesUSFolder.id,
  });

  createMockBookmarkLinks(topTravelUS, topTravelUSFolder.id);

  createMockBookmarkLinks(topSitesUS, topSitesUSFolder.id);

  const presetsFolder = browser.bookmarks.create({
    title: "Presets",
    id: "presets",
    parentId: "1",
  });

  createPresetDialBookmarks(presetsFolder.id);
}
