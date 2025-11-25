import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

// Import the vitest plugin
import vitest from "@vitest/eslint-plugin";
import plugin from "eslint-plugin-testing-library";

export default defineConfig([
    globalIgnores([
        "dist",
        ".stryker-tmp/",
        ".storybook/",
        "build",
        "coverage",
        "node_modules",
        "public/mockServiceWorker.js",
        "storybook-static/",
    ]),
    {
        files: ["src/**/*.{js,jsx}"],
        extends: [
            js.configs.recommended,
            reactHooks.configs["recommended-latest"],
            reactRefresh.configs.vite,
            reactPlugin.configs.flat.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
              ...globals.browser,
              React: "writable",
            },
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        rules: {
            "no-unused-vars": [
                "error",
                { varsIgnorePattern: "^[A-Z_].*", argsIgnorePattern: "^_" },
            ],
            "react/prop-types": "off",
        },
      settings: {
        react: {
          version: "detect", // or explicit like "18.3"
          jsxRuntime: "automatic", // 👈 tells ESLint we're using the new JSX transform
        },
      },
    },
    {
        ...plugin.configs["flat/react"],
        // Apply this configuration only to test files
        files: ["**/*.test.{js,jsx}", "**/*.spec.{js,jsx}"],
        plugins: {
            vitest,
        },
        languageOptions: {
            globals: {
              ...vitest.environments.env.globals,
              ...globals.node,
              React: "writable",
            }, // Use vitest's globals
        },
        rules: {
            // Vitest recommended rules
            ...vitest.configs.recommended.rules,
            "vitest/expect-expect": "off",
        },
    },
]);