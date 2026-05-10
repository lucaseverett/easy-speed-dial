/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __CHROME__: boolean;
declare const __FIREFOX__: boolean;
declare const __DEMO__: boolean;

interface EyeDropperResult {
  sRGBHex: string;
}

interface EyeDropper {
  open: () => Promise<EyeDropperResult>;
}

interface EyeDropperConstructor {
  new (): EyeDropper;
}

interface Window {
  EyeDropper?: EyeDropperConstructor;
}
