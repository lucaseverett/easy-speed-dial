import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssPresetEnv from "postcss-preset-env";
import { resolve } from "path";

const PROJECT = process.env.PROJECT;

const resolveFile = (file) => `/src/${PROJECT || "demo"}/${file}.jsx`;

export default defineConfig({
  build: {
    outDir: PROJECT ? `dist-${PROJECT}` : "dist",
    rollupOptions: {
      input: [
        resolve(__dirname, "index.html"),
        resolve(__dirname, "options.html"),
      ],
    },
  },
  css: {
    postcss: {
      plugins: [postcssPresetEnv({ stage: 1 })],
    },
  },
  plugins: [react()],
  publicDir: `public/${PROJECT || "demo"}`,
  resolve: {
    alias: {
      useOptions: () => resolveFile("useOptions"),
      useBookmarks: () => resolveFile("useBookmarks"),
      useContextMenu: () => resolveFile("useContextMenu"),
    },
  },
  test: {
    coverage: {
      provider: "istanbul",
    },
    deps: {
      inline: ["localforage"],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: "./setupTests/setup.js",
  },
});
