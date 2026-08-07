import js from "@eslint/js";

export default [
  // 1. Recommended Base Settings
  js.configs.recommended,

  {
    // 2. Files to include/exclude
    files: ["**/*.js", "**/*.jsx"],
    ignores: ["dist/**", "node_modules/**"],

    // 3. Environment & Global Variables
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
      },
    },

    // 4. Custom Rules
    rules: {
      // Logic & Safety Rules
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],

      // Best Practices
      "no-var": "error",
      "prefer-const": "error",
      curly: ["error", "all"],
    },
  },
];
