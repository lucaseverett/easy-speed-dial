import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    ...js.configs.recommended,
    ...reactPlugin.configs.flat.recommended,
    ...reactHooks.configs.recommended,
    ...jsxA11y.flatConfigs.recommended,
    ...eslintConfigPrettier,
  },
]);
