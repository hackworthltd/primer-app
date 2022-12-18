import type { StorybookViteConfig } from "@storybook/builder-vite";

// Workaround for 'TypeError: (0 , vite_plugin_svgr_1.default) is not
// a function' error. I hate Storybook.
const svgr = require("vite-plugin-svgr");
//import svgr from "vite-plugin-svgr";

import tsconfigPaths from "vite-tsconfig-paths";
import { mergeConfig } from "vite";

const config: StorybookViteConfig = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  core: {
    builder: "@storybook/builder-vite",
    disableTelemetry: true,
  },

  // storybook-builder-vite doesn't read the project's vite.config.js,
  // so we have to recreate the important bits here, mainly the
  // resolvers and the relevant plugins.
  async viteFinal(config, _) {
    return mergeConfig(config, {
      plugins: [svgr(), tsconfigPaths()],
    });
  },
};

module.exports = config;
