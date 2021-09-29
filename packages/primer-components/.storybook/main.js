const path = require("path");
const svgr = require("@honkhonk/vite-plugin-svgr").default;
const tsconfigPaths = require("vite-tsconfig-paths").default;

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  core: {
    builder: "storybook-builder-vite",
  },

  // storybook-builder-vite doesn't read the project's vite.config.js,
  // so we have to recreate the important bits here, mainly the
  // resolvers and the relevant plugins.
  async viteFinal(config, { configType }) {
    return {
      ...config,

      plugins: [...config.plugins, svgr(), tsconfigPaths()],

      // Don't write to node_modules, in case someday we can get it from Nix.
      cacheDir: "../.vite",
    };
  },
};
