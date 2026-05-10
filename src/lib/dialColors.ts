import { getColorsByShade } from "random-color-library";
import { murmur3_32 } from "random-color-library/dist/utils.js";

const colors: Record<string, string> = {
  "adobe.com": "#d32f2f",
  "airbnb.com": "#c2185b",
  "aol.com": "#0288d1",
  "amazon.": "#ffa000",
  "apple.com": "#616161",
  "bankofamerica.com": "#d32f2f",
  "bestbuy.com": "#1976d2",
  "bing.com": "#00796b",
  "brave.com": "#e64a19",
  "businessinsider.com": "#0288d1",
  "canva.com": "#0097a7",
  "capitalone.com": "#303f9f",
  "cash.app": "#388e3c",
  "chase.com": "#1976d2",
  "chatgpt.com": "#616161",
  "chick-fil-a.com": "#d32f2f",
  "chime.com": "#0097a7",
  "chipotle.com": "#5d4037",
  "citi.com": "#1976d2",
  "claude.ai": "#e64a19",
  "cnn.com": "#d32f2f",
  "costco.com": "#d32f2f",
  "creditkarma.com": "#388e3c",
  "crunchyroll.com": "#f57c00",
  "discover.com": "#f57c00",
  "doordash.com": "#d32f2f",
  "dropbox.com": "#1976d2",
  "duckduckgo.com": "#e64a19",
  "duolingo.com": "#689f38",
  "duosecurity.com": "#388e3c",
  "ebay.com": "#d32f2f",
  "easyspeeddial.com": "#512da8",
  "espn.com": "#d32f2f",
  "etsy.com": "#e64a19",
  "facebook.com|fb.com": "#1976d2",
  "fandom.com": "#00796b",
  "fidelity.com": "#388e3c",
  "foxnews.com": "#303f9f",
  "genius.com": "#fbc02d",
  "github.com|github.dev|github.io": "#616161",
  "google.": "#689f38",
  "gmail.com": "#d32f2f",
  "grammarly.com": "#00796b",
  "grubhub.com": "#e64a19",
  "homedepot.com": "#f57c00",
  "hulu.com": "#689f38",
  "ign.com": "#d32f2f",
  "imdb.com": "#fbc02d",
  "indeed.com": "#0288d1",
  "instagram.com": "#c2185b",
  "lowes.com": "#303f9f",
  "linkedin.com": "#1976d2",
  "mcdonalds.com": "#fbc02d",
  "microsoft.com|live.com|office.com": "#1976d2",
  "netflix.com": "#d32f2f",
  "nintendo.com": "#d32f2f",
  "noaa.gov|weather.gov": "#0288d1",
  "nytimes.com": "#616161",
  "openai.com": "#616161",
  "opera.com": "#d32f2f",
  "paypal.com": "#303f9f",
  "pinterest.com": "#d32f2f",
  "pizzahut.com": "#d32f2f",
  "playstation.com": "#1976d2",
  "pnc.com": "#303f9f",
  "reddit.com": "#e64a19",
  "rottentomatoes.com": "#d32f2f",
  "shopify.com": "#689f38",
  "slack.com": "#00796b",
  "snapchat.com": "#fbc02d",
  "spotify.com": "#689f38",
  "steamcommunity.com|steampowered.com": "#455a64",
  "stripe.com": "#512da8",
  "subway.com": "#689f38",
  "target.com": "#d32f2f",
  "tacobell.com": "#512da8",
  "tiktok.com": "#616161",
  "tripadvisor.com": "#388e3c",
  "truist.com": "#512da8",
  "twitch.tv": "#512da8",
  "ubereats.com": "#388e3c",
  "usps.com": "#303f9f",
  "walgreens.com": "#d32f2f",
  "yahoo.": "#512da8",
  "youtube.com|youtu.be": "#d32f2f",
  "walmart.com": "#0288d1",
  "wayfair.com": "#7b1fa2",
  "weather.com": "#303f9f",
  "wellsfargo.com": "#d32f2f",
  "wikipedia.org": "#616161",
  "wowhead.com": "#616161",
  "x.com|grok.com|x.ai": "#616161",
  "xbox.com": "#388e3c",
  "xfinity.com": "#512da8",
  "zillow.com": "#1976d2",
};

/**
 * The purpose of this function is to produce a consistent random number based
 * on a given key. This ensures that the same key will always produce the
 * same pseudo-random number.
 */
function randomIntFromHash(key: string, max: number): number {
  const hash = murmur3_32(key);

  // Normalize the hash value.
  const normalized = hash / 10000000000;

  // Apply a bias to reduce the likelihood of generating red colors.
  const biased = normalized < 0.1 ? normalized * 10 : normalized;

  // Scale the value to the range [0, max).
  const result = Math.floor(biased * max);

  return result;
}

function dialColors(name: string | string[]): string {
  if (Array.isArray(name)) name = name.join(".");

  // If the name matches a key, return the corresponding color.
  const matchedKey = Object.keys(colors).find((key) =>
    new RegExp(`^(.*\\.)?${key.replace(/\./g, "\\.")}`).test(name),
  );
  if (matchedKey) {
    return colors[matchedKey];
  }

  // Otherwise, return a pseudo-random color.
  const colorsFrom700 = getColorsByShade("700");
  const shade = randomIntFromHash(name, colorsFrom700.length);
  return colorsFrom700[shade];
}

export { colors, randomIntFromHash, dialColors };
