import svgr from "@honkhonk/vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import type { StorybookViteConfig } from "@storybook/builder-vite";

const config: StorybookViteConfig = {
  framework: "@storybook/react",
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config, _) {
    return {
      ...config,
      plugins: [...config.plugins, svgr(), tsconfigPaths()],
      // Don't write to node_modules, in case someday we can get it from Nix.
      cacheDir: "../.vite",
    };
  },
};

export default config;
