module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",

  // Generally, you only need to add a plugin to the list if you're
  // not using its "extends" configuration.
  plugins: [],

  extends: [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:storybook/recommended",
    "prettier",
  ],

  settings: {
    react: {
      // Stop eslint-plugin-react from complaining.
      version: "17",
    },

    // This keeps the eslint-plugin-import linter in sync with our
    // TypeScript settings, so we only need to set up path aliases in
    // tsconfig.json.
    "import/resolver": {
      typescript: {
        project: ["tsconfig.json", "packages/*/tsconfig.json"],
      },
    },
  },

  rules: {
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(useMemo)",
      },
    ],

    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
  },
};
