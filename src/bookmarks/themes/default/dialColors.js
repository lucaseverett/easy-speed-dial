import randomMC from "random-material-color";

const colors = {
  "aol.com": "0288d1",
  "amazon.": "ffa000",
  "apartments.com": "689f38",
  "apple.com": "616161",
  "bankofamerica.com": "d32f2f",
  "bestbuy.com": "283593",
  "businessinsider.com": "0288d1",
  "cnet.com": "d32f2f",
  "cnn.com": "d32f2f",
  "duolingo.com": "689f38",
  "ebay.com": "d32f2f",
  "espn.com": "d32f2f",
  "facebook.com|fb.com": "303f9f",
  "foxnews.com": "283593",
  "google.": "689f38",
  "gmail.com": "d32f2f",
  "homedepot.com": "f57c00",
  "hulu.com": "689f38",
  "imdb.com": "fbc02d",
  "instagram.com": "c2185b",
  "lowes.com": "303f9f",
  "linkedin.com": "1976d2",
  "lucaseverett.dev": "f57c00",
  "microsoft.com|live.com": "1976d2",
  "mozilla.org": "0288d1",
  "netflix.com": "d32f2f",
  "paypal.com": "303f9f",
  "pinterest.com": "d32f2f",
  "rottentomatoes.com": "d32f2f",
  "steamcommunity.com|steampowered.com": "455a64",
  "toolbardial.com": "512da8",
  "twitch.tv": "512da8",
  "twitter.com": "0288d1",
  "usps.com": "512da8",
  "yahoo.": "512da8",
  "yelp.com": "d32f2f",
  "youtube.com|youtu.be": "d32f2f",
  "walmart.com": "0288d1",
  "weather.com": "303f9f",
  "wowhead.com": "616161",
};

export function dialColors(domain) {
  domain = domain.join(".");
  // if domain matches key, return color
  for (let key of Object.keys(colors)) {
    if (new RegExp(key).test(domain)) {
      return `#${colors[key]}`;
    }
  }
  //otherwise return random color
  return randomMC.getColor({
    shades: ["700"],
    text: domain,
  });
}
