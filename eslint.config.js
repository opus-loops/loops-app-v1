import css from "@eslint/css"
import js from "@eslint/js"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import { tanstackConfig } from "@tanstack/config/eslint"
import pluginQuery from "@tanstack/eslint-plugin-query"
import prettierConfigRecommended from "eslint-plugin-prettier/recommended"
import pluginReact from "eslint-plugin-react"
import pluginSecurity from "eslint-plugin-security"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  ...tanstackConfig,
  {
    extends: ["js/recommended"],
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    files: ["**/*.{jsx,tsx}"],
  },
  {
    files: ["**/*.{jsx,tsx}"],
    settings: {
      react: { version: "detect" },
    },
  },
  {
    extends: ["json/recommended"],
    files: ["**/*.json"],
    language: "json/json",
    plugins: { json },
  },
  {
    extends: ["json/recommended"],
    files: ["**/*.jsonc"],
    language: "json/jsonc",
    plugins: { json },
  },
  {
    extends: ["json/recommended"],
    files: ["**/*.json5"],
    language: "json/json5",
    plugins: { json },
  },
  {
    extends: ["markdown/recommended"],
    files: ["**/*.md"],
    language: "markdown/gfm",
    plugins: { markdown },
  },
  {
    extends: ["css/recommended"],
    files: ["**/*.css"],
    language: "css/css",
    plugins: { css },
  },
  pluginSecurity.configs.recommended,
  // ...pluginTailwindcss.configs["flat/recommended"],
  ...pluginQuery.configs["flat/recommended"],
  prettierConfigRecommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      semi: ["error", "never"],
    },
  },
])
