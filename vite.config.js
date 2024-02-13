import { resolve } from "path";

import react from "@vitejs/plugin-react";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";

const PROJECT = process.env.PROJECT || "demo";

const resolveFile = (file) =>
  ["chrome", "firefox"].includes(PROJECT)
    ? `#stores/${file}/extension`
    : `#stores/${file}/web`;

export default defineConfig({
  build: {
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
      plugins: [postcssPresetEnv()],
    },
  },
  define: {
    __CHROME__: PROJECT === "chrome",
    __FIREFOX__: PROJECT === "firefox",
  },
  plugins: [react()],
  publicDir: `public/${PROJECT}`,
  resolve: {
    alias: {
      "#stores/useSettings/web": resolveFile("useSettings"),
      "#stores/useBookmarks/web": resolveFile("useBookmarks"),
    },
  },
});
