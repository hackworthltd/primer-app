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
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],

  settings: {
    // This keeps the eslint-plugin-import linter in sync with our
    // TypeScript settings, so we only need to set up path aliases in
    // tsconfig.json.
    "import/resolver": {
      typescript: {},
    },
  },

  rules: {},
};
