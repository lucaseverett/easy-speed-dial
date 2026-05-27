import { themeWallpaperPairs } from "#lib/wallpapers";

export function prefersDarkMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getColorScheme(value: string) {
  return (value === "System Theme" && prefersDarkMode()) || value === "Dark"
    ? "color-scheme-dark"
    : "color-scheme-light";
}

export function resolveWallpaper(value: unknown): string {
  if (value === "light-wallpaper" || value === "dark-wallpaper" || !value) {
    return "theme-wallpaper";
  }

  const themeWallpaper = themeWallpaperPairs.find(
    ({ dark, light }) => value === light || value === dark,
  );
  if (themeWallpaper) {
    return themeWallpaper.id;
  }

  if (typeof value === "string" && value.includes("custom-image")) {
    return "custom-image";
  }

  if (typeof value === "string") {
    return value;
  }

  return "theme-wallpaper";
}

export function resolveWallpaperClass(wallpaper: string, colorScheme: string) {
  const themeWallpaper = themeWallpaperPairs.find(({ id }) => id === wallpaper);

  if (!themeWallpaper) {
    return wallpaper;
  }

  return colorScheme === "color-scheme-dark"
    ? themeWallpaper.dark
    : themeWallpaper.light;
}
