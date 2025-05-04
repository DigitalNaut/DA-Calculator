import globals from "globals";
import jseslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
// TODO: [eslint-plugin-tailwindcss >= 4] Uncomment when this when it supports Tailwind 4
// See: https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/325
// import tailwind from "eslint-plugin-tailwindcss";

export default tseslint.config(
  // ...tailwind.configs["flat/recommended"],
  { ignores: ["dist", "coverage"] },
  {
    extends: [jseslint.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
);
