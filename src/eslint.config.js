import js from "@eslint/js";
import react from "eslint-plugin-react";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.[jt]s?(x)"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "comma-dangle": ["warn", "always-multiline"],
      "indent": ["warn", 2, { SwitchCase: 1 }],
      "linebreak-style": ["error", "unix"],
      "no-unused-vars": ["warn"],
      "quote-props": ["warn", "consistent-as-needed", { keywords: false }],
      "quotes": ["warn", "double", { avoidEscape: true }],
      "semi": ["error", "always"],
      "space-before-function-paren": ["warn", "always"],
    },
  },
  {
    files: ["**/*.ts?(x)"],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...ts.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.[jt]sx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: react,
    },
    rules: {
      ...react.configs.recommended.rules,
      "jsx-quotes": ["warn", "prefer-double"],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
