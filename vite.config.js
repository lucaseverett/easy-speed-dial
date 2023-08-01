import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssPresetEnv from "postcss-preset-env";
import { resolve } from "path";

const PROJECT = process.env.PROJECT || "demo";

const resolveFile = (file) => `/src/${PROJECT}/${file}.jsx`;

export default defineConfig({
  build: {
    outDir: `dist-${PROJECT}`,
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
  define: {
    __PROJECT__: JSON.stringify(PROJECT),
  },
  plugins: [react()],
  publicDir: `public/${PROJECT}`,
  resolve: {
    alias: {
      useOptions: () => resolveFile("useOptions"),
      useBookmarks: () => resolveFile("useBookmarks"),
    },
  },
  server: {
    host: "0.0.0.0",
    open: true,
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
