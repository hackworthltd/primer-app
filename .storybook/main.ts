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
    disableTelemetry: true
  },
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {
    autodocs: true
  }
};
module.exports = config;
