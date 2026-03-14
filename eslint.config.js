import css from "@eslint/css"
import js from "@eslint/js"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import { tanstackConfig } from "@tanstack/config/eslint"
import pluginQuery from "@tanstack/eslint-plugin-query"
import perfectionist from "eslint-plugin-perfectionist"
import prettierConfigRecommended from "eslint-plugin-prettier/recommended"
import pluginReact from "eslint-plugin-react"
import pluginSecurity from "eslint-plugin-security"
import globals from "globals"
import tseslint from "typescript-eslint"

const JS_TS_FILES = ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"]

export default tseslint.config(
  {
    ignores: ["**/dist/**", ".output/**", ".nitro/**"],
  },
  ...tanstackConfig,
  // --- JS / TS / React Configuration -----------------------------------------
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      pluginSecurity.configs.recommended,
      perfectionist.configs["recommended-alphabetical"],
      ...pluginQuery.configs["flat/recommended"],
      prettierConfigRecommended,
    ],
    files: JS_TS_FILES,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "import/order": "off",
      "perfectionist/sort-exports": "error",
      "perfectionist/sort-imports": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      semi: ["error", "never"],
      "sort-imports": "off",
    },
  },
  // --- JSON Configuration ----------------------------------------------------
  {
    extends: [json.configs.recommended],
    files: ["**/*.json"],
    language: "json/json",
    plugins: { json },
  },
  {
    extends: [json.configs.recommended],
    files: ["**/*.jsonc"],
    language: "json/jsonc",
    plugins: { json },
  },
  {
    extends: [json.configs.recommended],
    files: ["**/*.json5"],
    language: "json/json5",
    plugins: { json },
  },
  // --- Markdown Configuration ------------------------------------------------
  {
    extends: [markdown.configs.recommended],
    files: ["**/*.md"],
    language: "markdown/gfm",
    plugins: { markdown },
  },
  // --- CSS Configuration -----------------------------------------------------
  {
    extends: [css.configs.recommended],
    files: ["**/*.css"],
    language: "css/css",
    plugins: { css },
  },
)
