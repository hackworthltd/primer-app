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
    "prettier",
  ],

  settings: {
    react: {
      // Stop eslint-plugin-react from complaining.
      version: "17",
    },
  },

  rules: {
    // @honkhonk/vite-plugin-svgr uses query parameters, which are not
    // properly ignored by eslint-plugin-import.
    //
    // Note: the `2` here means ignore errors. :\
    "import/no-unresolved": [2, { ignore: [".svg\\?component"] }],
  },
};
