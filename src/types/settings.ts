export type DialColors = Record<string, string>;
export type DialImages = Record<string, string>;
export type DialImageSize = "cover" | "contain";
export type DialImageSizes = Record<string, DialImageSize>;

export interface SettingsBackup {
  usePresetThumbnails: boolean;
  showFavicons: boolean;
  attachTitle: boolean;
  customColor: string;
  customImage: string;
  defaultFolder: string;
  dialColors: DialColors;
  dialImages: DialImages;
  dialImageSizes: DialImageSizes;
  dialSize: unknown;
  dragAndDrop: boolean;
  gridSpacing: unknown;
  maxColumns: unknown;
  newTab: boolean;
  showDialBorders: boolean;
  showTitle: boolean;
  squareDials: boolean;
  switchTitle: boolean;
  themeOption: string;
  transparentDials: boolean;
  wallpaper: string;
}
