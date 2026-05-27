import aliexpressThumbnail from "#assets/thumbnails/aliexpress.svg";
import amazonLunaThumbnail from "#assets/thumbnails/amazon-luna.svg";
import amazonThumbnail from "#assets/thumbnails/amazon.svg";
import anthropicThumbnail from "#assets/thumbnails/anthropic.svg";
import arsTechnicaThumbnail from "#assets/thumbnails/ars-technica.svg";
import bbcThumbnail from "#assets/thumbnails/bbc.svg";
import bestBuyThumbnail from "#assets/thumbnails/bestbuy.svg";
import bingThumbnail from "#assets/thumbnails/bing.svg";
import bookingThumbnail from "#assets/thumbnails/booking.svg";
import chatGptThumbnail from "#assets/thumbnails/chatgpt.svg";
import claudeThumbnail from "#assets/thumbnails/claude.svg";
import cnnThumbnail from "#assets/thumbnails/cnn.svg";
import copilotThumbnail from "#assets/thumbnails/copilot.svg";
import deepseekThumbnail from "#assets/thumbnails/deepseek.svg";
import disneyThumbnail from "#assets/thumbnails/disney.svg";
import duckDuckGoThumbnail from "#assets/thumbnails/duckduckgo.svg";
import ebayThumbnail from "#assets/thumbnails/ebay.svg";
import epicGamesThumbnail from "#assets/thumbnails/epic-games.svg";
import expediaThumbnail from "#assets/thumbnails/expedia.svg";
import facebookThumbnail from "#assets/thumbnails/facebook.svg";
import foxNewsThumbnail from "#assets/thumbnails/fox-news.svg";
import geminiThumbnail from "#assets/thumbnails/gemini.svg";
import githubThumbnail from "#assets/thumbnails/github.svg";
import gmailThumbnail from "#assets/thumbnails/gmail.svg";
import gogThumbnail from "#assets/thumbnails/gog.svg";
import googleKeepThumbnail from "#assets/thumbnails/google-keep.svg";
import googleMapsThumbnail from "#assets/thumbnails/google-maps.png";
import googlePhotosThumbnail from "#assets/thumbnails/google-photos.svg";
import googleSheetsThumbnail from "#assets/thumbnails/google-sheets.svg";
import googleThumbnail from "#assets/thumbnails/google.svg";
import grokThumbnail from "#assets/thumbnails/grok.svg";
import grubhubThumbnail from "#assets/thumbnails/grubhub.svg";
import hboMaxThumbnail from "#assets/thumbnails/hbo-max.svg";
import hotelsThumbnail from "#assets/thumbnails/hotels.svg";
import huggingFaceThumbnail from "#assets/thumbnails/huggingface.svg";
import imdbThumbnail from "#assets/thumbnails/imdb.svg";
import instagramThumbnail from "#assets/thumbnails/instagram.svg";
import linkedinThumbnail from "#assets/thumbnails/linkedin.svg";
import lovableThumbnail from "#assets/thumbnails/lovable.svg";
import microsoftThumbnail from "#assets/thumbnails/microsoft.svg";
import nationalWeatherServiceThumbnail from "#assets/thumbnails/national-weather-service.svg";
import netflixThumbnail from "#assets/thumbnails/netflix.svg";
import nintendoThumbnail from "#assets/thumbnails/nintendo.svg";
import noaaThumbnail from "#assets/thumbnails/noaa.svg";
import openaiThumbnail from "#assets/thumbnails/openai.svg";
import paramountPlusThumbnail from "#assets/thumbnails/paramount-plus.svg";
import peacockThumbnail from "#assets/thumbnails/peacock.svg";
import perplexityThumbnail from "#assets/thumbnails/perplexity.svg";
import playstationThumbnail from "#assets/thumbnails/playstation.svg";
import primeVideoThumbnail from "#assets/thumbnails/prime-video.svg";
import redditThumbnail from "#assets/thumbnails/reddit.svg";
import replitThumbnail from "#assets/thumbnails/replit.svg";
import ringThumbnail from "#assets/thumbnails/ring.svg";
import steamThumbnail from "#assets/thumbnails/steam.svg";
import targetThumbnail from "#assets/thumbnails/target.svg";
import temuThumbnail from "#assets/thumbnails/temu.svg";
import tiktokThumbnail from "#assets/thumbnails/tiktok.svg";
import tomsHardwareThumbnail from "#assets/thumbnails/toms-hardware.svg";
import uspsThumbnail from "#assets/thumbnails/usps.svg";
import walmartThumbnail from "#assets/thumbnails/walmart.svg";
import weatherChannelThumbnail from "#assets/thumbnails/weather-channel.svg";
import wikipediaThumbnail from "#assets/thumbnails/wikipedia.svg";
import xThumbnail from "#assets/thumbnails/x.svg";
import xaiThumbnail from "#assets/thumbnails/xai.svg";
import xboxThumbnail from "#assets/thumbnails/xbox.svg";
import xfinityThumbnail from "#assets/thumbnails/xfinity.svg";
import yahooThumbnail from "#assets/thumbnails/yahoo.svg";
import yellowPagesThumbnail from "#assets/thumbnails/yellow-pages.svg";
import youTubeMusicThumbnail from "#assets/thumbnails/youtube-music.svg";
import youTubeThumbnail from "#assets/thumbnails/youtube.svg";
import { dialColors } from "#lib/dialColors";
import { getLinkName } from "#lib/filter";

export interface SitePreset {
  url: string;
  title: string;
  color?: string;
  image: string;
  category: string;
  hostnames?: string[];
}

export const sitePresets: Record<string, SitePreset> = {
  aliexpress: {
    url: "https://www.aliexpress.com",
    title: "AliExpress",
    color: "#FAFAFA",
    image: aliexpressThumbnail,
    category: "Shopping",
  },
  amazon: {
    url: "https://www.amazon.com",
    title: "Amazon",
    color: "#121922",
    image: amazonThumbnail,
    category: "Shopping",
    hostnames: [
      "amazon.co.uk",
      "amazon.ca",
      "amazon.de",
      "amazon.fr",
      "amazon.it",
      "amazon.es",
      "amazon.co.jp",
      "amazon.com.au",
      "amazon.in",
    ],
  },
  amazonLuna: {
    url: "https://luna.amazon.com",
    title: "Amazon Luna",
    color: "#9346ff",
    image: amazonLunaThumbnail,
    category: "Games",
  },
  anthropic: {
    url: "https://www.anthropic.com",
    title: "Anthropic",
    color: "#FAFAFA",
    image: anthropicThumbnail,
    category: "AI",
  },
  arsTechnica: {
    url: "https://arstechnica.com",
    title: "Ars Technica",
    color: "#FAFAFA",
    image: arsTechnicaThumbnail,
    category: "News",
  },
  bbc: {
    url: "https://www.bbc.com",
    title: "BBC",
    color: "#FAFAFA",
    image: bbcThumbnail,
    category: "News",
    hostnames: ["bbc.co.uk"],
  },
  bestBuy: {
    url: "https://www.bestbuy.com",
    title: "Best Buy",
    color: "#0046be",
    image: bestBuyThumbnail,
    category: "Shopping",
  },
  bing: {
    url: "https://www.bing.com",
    title: "Bing",
    color: "#FAFAFA",
    image: bingThumbnail,
    category: "Search",
  },
  booking: {
    url: "https://www.booking.com",
    title: "Booking.com",
    color: "#FAFAFA",
    image: bookingThumbnail,
    category: "Travel",
  },
  chatgpt: {
    url: "https://chatgpt.com",
    title: "ChatGPT",
    color: "#FAFAFA",
    image: chatGptThumbnail,
    category: "AI",
  },
  claude: {
    url: "https://claude.ai",
    title: "Claude",
    color: "#FAFAFA",
    image: claudeThumbnail,
    category: "AI",
  },
  cnn: {
    url: "https://www.cnn.com",
    title: "CNN",
    color: "#FAFAFA",
    image: cnnThumbnail,
    category: "News",
  },
  copilot: {
    url: "https://copilot.microsoft.com",
    title: "Microsoft Copilot",
    color: "#FAFAFA",
    image: copilotThumbnail,
    category: "AI",
  },
  deepseek: {
    url: "https://www.deepseek.com",
    title: "DeepSeek",
    color: "#FAFAFA",
    image: deepseekThumbnail,
    category: "AI",
    hostnames: ["deepseek.com", "chat.deepseek.com"],
  },
  disney: {
    url: "https://www.disneyplus.com",
    title: "Disney+",
    color: "#016e7d",
    image: disneyThumbnail,
    category: "Entertainment",
  },
  duckDuckGo: {
    url: "https://duckduckgo.com",
    title: "DuckDuckGo",
    color: "#FAFAFA",
    image: duckDuckGoThumbnail,
    category: "Search",
    hostnames: ["www.duckduckgo.com"],
  },
  ebay: {
    url: "https://www.ebay.com",
    title: "eBay",
    color: "#FAFAFA",
    image: ebayThumbnail,
    category: "Shopping",
    hostnames: [
      "ebay.co.uk",
      "ebay.ca",
      "ebay.com.au",
      "ebay.de",
      "ebay.fr",
      "ebay.it",
      "ebay.es",
      "ebay.nl",
      "ebay.at",
      "ebay.ch",
      "ebay.ie",
      "ebay.pl",
      "ebay.be",
    ],
  },
  epicGames: {
    url: "https://www.epicgames.com",
    title: "Epic Games",
    color: "#121216",
    image: epicGamesThumbnail,
    category: "Games",
  },
  expedia: {
    url: "https://www.expedia.com",
    title: "Expedia",
    color: "#FAFAFA",
    image: expediaThumbnail,
    category: "Travel",
  },
  facebook: {
    url: "https://www.facebook.com",
    title: "Facebook",
    color: "#FAFAFA",
    image: facebookThumbnail,
    category: "Social",
  },
  foxNews: {
    url: "https://www.foxnews.com",
    title: "Fox News",
    color: "#FAFAFA",
    image: foxNewsThumbnail,
    category: "News",
  },
  gemini: {
    url: "https://gemini.google.com",
    title: "Gemini",
    color: "#FAFAFA",
    image: geminiThumbnail,
    category: "AI",
  },
  github: {
    url: "https://github.com",
    title: "GitHub",
    color: "#FAFAFA",
    image: githubThumbnail,
    category: "Developer",
  },
  gmail: {
    url: "https://mail.google.com",
    title: "Gmail",
    color: "#FAFAFA",
    image: gmailThumbnail,
    category: "Productivity",
    hostnames: ["gmail.com"],
  },
  gog: {
    url: "https://www.gog.com",
    title: "GOG.com",
    color: "#2f2f2f",
    image: gogThumbnail,
    category: "Games",
    hostnames: ["gog.com"],
  },
  google: {
    url: "https://www.google.com",
    title: "Google",
    color: "#FAFAFA",
    image: googleThumbnail,
    category: "Search",
  },
  googleKeep: {
    url: "https://keep.google.com",
    title: "Google Keep",
    color: "#FAFAFA",
    image: googleKeepThumbnail,
    category: "Productivity",
  },
  googleMaps: {
    url: "https://www.google.com/maps",
    title: "Google Maps",
    color: "#FAFAFA",
    image: googleMapsThumbnail,
    category: "Travel",
    hostnames: ["maps.google.com"],
  },
  googlePhotos: {
    url: "https://photos.google.com",
    title: "Google Photos",
    color: "#FAFAFA",
    image: googlePhotosThumbnail,
    category: "Photos",
  },
  googleSheets: {
    url: "https://docs.google.com/spreadsheets",
    title: "Google Sheets",
    color: "#FAFAFA",
    image: googleSheetsThumbnail,
    category: "Productivity",
    hostnames: ["sheets.google.com"],
  },
  grok: {
    url: "https://grok.com",
    title: "Grok",
    color: "#000",
    image: grokThumbnail,
    category: "AI",
  },
  grubhub: {
    url: "https://www.grubhub.com",
    title: "Grubhub",
    color: "#FAFAFA",
    image: grubhubThumbnail,
    category: "Food",
  },
  hboMax: {
    url: "https://www.hbomax.com",
    title: "HBO Max",
    color: "#000",
    image: hboMaxThumbnail,
    category: "Entertainment",
  },
  hotels: {
    url: "https://www.hotels.com",
    title: "Hotels.com",
    color: "#FAFAFA",
    image: hotelsThumbnail,
    category: "Travel",
  },
  huggingFace: {
    url: "https://huggingface.co",
    title: "Hugging Face",
    color: "#FAFAFA",
    image: huggingFaceThumbnail,
    category: "AI",
  },
  imdb: {
    url: "https://www.imdb.com",
    title: "IMDb",
    color: "#FAFAFA",
    image: imdbThumbnail,
    category: "Entertainment",
  },
  instagram: {
    url: "https://www.instagram.com",
    title: "Instagram",
    color: "#FAFAFA",
    image: instagramThumbnail,
    category: "Social",
  },
  linkedin: {
    url: "https://www.linkedin.com",
    title: "LinkedIn",
    color: "#FAFAFA",
    image: linkedinThumbnail,
    category: "Social",
  },
  lovable: {
    url: "https://lovable.dev",
    title: "Lovable",
    color: "#FAFAFA",
    image: lovableThumbnail,
    category: "Developer",
  },
  microsoft: {
    url: "https://www.microsoft.com",
    title: "Microsoft",
    color: "#FAFAFA",
    image: microsoftThumbnail,
    category: "Productivity",
  },
  nationalWeatherService: {
    url: "https://www.weather.gov",
    title: "National Weather Service",
    color: "#FAFAFA",
    image: nationalWeatherServiceThumbnail,
    category: "News",
    hostnames: ["forecast.weather.gov", "alerts.weather.gov"],
  },
  netflix: {
    url: "https://www.netflix.com",
    title: "Netflix",
    color: "#FAFAFA",
    image: netflixThumbnail,
    category: "Entertainment",
  },
  nintendo: {
    url: "https://www.nintendo.com",
    title: "Nintendo",
    color: "#e60012",
    image: nintendoThumbnail,
    category: "Entertainment",
  },
  noaa: {
    url: "https://www.noaa.gov",
    title: "NOAA",
    color: "#FAFAFA",
    image: noaaThumbnail,
    category: "Reference",
  },
  openai: {
    url: "https://openai.com",
    title: "OpenAI",
    color: "#000",
    image: openaiThumbnail,
    category: "AI",
  },
  paramountPlus: {
    url: "https://www.paramountplus.com",
    title: "Paramount+",
    color: "#0064FF",
    image: paramountPlusThumbnail,
    category: "Entertainment",
    hostnames: ["paramountplus.com"],
  },
  peacock: {
    url: "https://www.peacocktv.com",
    title: "Peacock",
    color: "#000",
    image: peacockThumbnail,
    category: "Entertainment",
    hostnames: ["peacocktv.com"],
  },
  perplexity: {
    url: "https://www.perplexity.ai",
    title: "Perplexity",
    color: "#FAFAFA",
    image: perplexityThumbnail,
    category: "AI",
  },
  playstation: {
    url: "https://www.playstation.com",
    title: "PlayStation",
    color: "#FAFAFA",
    image: playstationThumbnail,
    category: "Games",
  },
  primeVideo: {
    url: "https://www.primevideo.com",
    title: "Prime Video",
    color: "#0778ff",
    image: primeVideoThumbnail,
    category: "Entertainment",
  },
  reddit: {
    url: "https://www.reddit.com",
    title: "Reddit",
    color: "#FAFAFA",
    image: redditThumbnail,
    category: "Social",
  },
  replit: {
    url: "https://replit.com",
    title: "Replit",
    color: "#FAFAFA",
    image: replitThumbnail,
    category: "Developer",
  },
  ring: {
    url: "https://ring.com",
    title: "Ring",
    color: "#FAFAFA",
    image: ringThumbnail,
    category: "Smart Home",
  },
  steam: {
    url: "https://store.steampowered.com",
    title: "Steam",
    color: "#FAFAFA",
    image: steamThumbnail,
    category: "Games",
    hostnames: ["steamcommunity.com", "steampowered.com"],
  },
  target: {
    url: "https://www.target.com",
    title: "Target",
    color: "#FAFAFA",
    image: targetThumbnail,
    category: "Shopping",
  },
  temu: {
    url: "https://www.temu.com",
    title: "Temu",
    color: "#FAFAFA",
    image: temuThumbnail,
    category: "Shopping",
  },
  tiktok: {
    url: "https://www.tiktok.com",
    title: "TikTok",
    color: "#FAFAFA",
    image: tiktokThumbnail,
    category: "Social",
  },
  tomsHardware: {
    url: "https://www.tomshardware.com",
    title: "Tom's Hardware",
    color: "#FAFAFA",
    image: tomsHardwareThumbnail,
    category: "News",
    hostnames: ["tomshardware.com", "tomshardware.fr", "tomshw.it"],
  },
  usps: {
    url: "https://www.usps.com",
    title: "USPS",
    color: "#FAFAFA",
    image: uspsThumbnail,
    category: "Productivity",
  },
  walmart: {
    url: "https://www.walmart.com",
    title: "Walmart",
    color: "#0053E2",
    image: walmartThumbnail,
    category: "Shopping",
  },
  weatherChannel: {
    url: "https://weather.com",
    title: "The Weather Channel",
    color: "#FAFAFA",
    image: weatherChannelThumbnail,
    category: "News",
    hostnames: ["weatherchannel.com"],
  },
  wikipedia: {
    url: "https://www.wikipedia.org",
    title: "Wikipedia",
    color: "#FAFAFA",
    image: wikipediaThumbnail,
    category: "Reference",
  },
  x: {
    url: "https://x.com",
    title: "X",
    color: "#000",
    image: xThumbnail,
    category: "Social",
    hostnames: ["twitter.com"],
  },
  xbox: {
    url: "https://www.xbox.com",
    title: "Xbox",
    color: "#FAFAFA",
    image: xboxThumbnail,
    category: "Games",
  },
  xfinity: {
    url: "https://www.xfinity.com",
    title: "Xfinity",
    color: "#4f19ca",
    image: xfinityThumbnail,
    category: "Entertainment",
  },
  xai: {
    url: "https://x.ai",
    title: "xAI",
    color: "#000",
    image: xaiThumbnail,
    category: "AI",
  },
  yahoo: {
    url: "https://www.yahoo.com",
    title: "Yahoo",
    color: "#6F29E2",
    image: yahooThumbnail,
    category: "Search",
  },
  yellowPages: {
    url: "https://www.yellowpages.com",
    title: "Yellow Pages",
    color: "#FAFAFA",
    image: yellowPagesThumbnail,
    category: "Reference",
  },
  youtube: {
    url: "https://www.youtube.com",
    title: "YouTube",
    color: "#FAFAFA",
    image: youTubeThumbnail,
    category: "Entertainment",
  },
  youtubeMusic: {
    url: "https://music.youtube.com",
    title: "YouTube Music",
    color: "#FAFAFA",
    image: youTubeMusicThumbnail,
    category: "Entertainment",
  },
};

export function getSitePresetColor(preset: SitePreset): string {
  return preset.color ?? dialColors(getLinkName(preset.url));
}

export function normalizeSitePresetHostname(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
  } catch {
    return "";
  }
}

function getPathSpecificSitePreset(url: string): SitePreset | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = normalizeSitePresetHostname(url);

    return (
      Object.values(sitePresets).find((preset) => {
        const presetUrl = new URL(preset.url);

        return (
          presetUrl.pathname !== "/" &&
          normalizeSitePresetHostname(preset.url) === hostname &&
          parsedUrl.pathname.startsWith(presetUrl.pathname)
        );
      }) ?? null
    );
  } catch {
    return null;
  }
}

const sitePresetsByHostname = Object.fromEntries(
  Object.values(sitePresets).flatMap((preset) => {
    const presetUrl = new URL(preset.url);
    const primaryHostname =
      presetUrl.pathname === "/"
        ? [normalizeSitePresetHostname(preset.url)]
        : [];

    return [...primaryHostname, ...(preset.hostnames ?? [])]
      .filter((hostname) => !hostname.startsWith("*."))
      .map((hostname) => [hostname, preset]);
  }),
);

function hostnameMatchesDomain(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

export function getSitePresetByUrl(url: string): SitePreset | null {
  const hostname = normalizeSitePresetHostname(url);
  const pathPreset = getPathSpecificSitePreset(url);
  const domainPreset = Object.values(sitePresets).find((preset) => {
    const presetHostname = normalizeSitePresetHostname(preset.url);
    const wildcardHostnames = (preset.hostnames ?? [])
      .filter((presetHostname) => presetHostname.startsWith("*."))
      .map((presetHostname) => presetHostname.slice(2));

    return [presetHostname, ...wildcardHostnames].some((domain) =>
      hostnameMatchesDomain(hostname, domain),
    );
  });

  return pathPreset ?? sitePresetsByHostname[hostname] ?? domainPreset ?? null;
}
