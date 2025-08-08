import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const PROJECT = process.env.PROJECT || "demo";

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    outDir: `dist-${PROJECT}`,
    rollupOptions: {
      input: [
        resolve(__dirname, "index.html"),
        resolve(__dirname, "settings.html"),
      ],
    },
    target: "esnext",
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __CHROME__: PROJECT === "chrome",
    __FIREFOX__: PROJECT === "firefox",
    __DEMO__: PROJECT === "demo",
  },
  plugins: [react()],
  publicDir: `public/${PROJECT}`,
  resolve: {
    alias: {
      "webextension-polyfill":
        PROJECT === "demo" ? "./browser-polyfill.js" : "webextension-polyfill",
    },
  },
});
