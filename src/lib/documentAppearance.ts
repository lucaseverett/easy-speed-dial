import { clsx } from "clsx/lite";
import { autorun } from "mobx";

import { resolveWallpaperClass } from "#lib/wallpaper";

interface DocumentAppearanceSettings {
  attachTitle: unknown;
  colorScheme: unknown;
  customColor: unknown;
  customImage: unknown;
  dialSize: unknown;
  showFavicons: unknown;
  gridSpacing: unknown;
  maxColumns: unknown;
  showDialBorders: unknown;
  showTitle: unknown;
  squareDials: unknown;
  transparentDials: unknown;
  wallpaper: unknown;
}

export function syncDocumentAppearance(settings: DocumentAppearanceSettings) {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMacOS = userAgent.includes("macintosh");
  const isChrome = userAgent.includes("chrome");

  autorun(() => {
    const colorScheme = settings.colorScheme as string;
    const wallpaper = settings.wallpaper as string;

    document.documentElement.className = clsx(
      colorScheme,
      resolveWallpaperClass(wallpaper, colorScheme),
      "Wallpapers",
      isChrome ? "chrome" : "firefox",
      isMacOS ? "mac" : "windows",
      settings.showTitle ? "show-title" : "hide-title",
      settings.attachTitle ? "attach-title" : "normal-title",
      settings.dialSize as string,
      `grid-spacing-${settings.gridSpacing as string}`,
      settings.maxColumns === "Unlimited" ? "unlimited-columns" : undefined,
      settings.showDialBorders ? "show-dial-borders" : undefined,
      settings.squareDials ? "square" : undefined,
      settings.transparentDials ? "transparent-dials" : undefined,
      settings.showFavicons ? "show-favicons" : undefined,
    );
    document.documentElement.style.backgroundImage =
      settings.wallpaper === "custom-image" && settings.customImage
        ? `url(${settings.customImage})`
        : "";
    document.documentElement.style.setProperty(
      "--background-color",
      settings.wallpaper === "custom-color"
        ? (settings.customColor as string | null)
        : null,
    );
  });
}
