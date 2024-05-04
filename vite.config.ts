import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import { checker } from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      wasm(),
      topLevelAwait(),
      checker({
        typescript: { tsconfigPath: "./tsconfig.app.json" },
        overlay: false,
        eslint: {
          lintCommand: "eslint .",
        },
      }),
      react(),
      svgr(),
      tsconfigPaths(),
      // Can cause issues in development mode, and with Storybook builds. See:
      // https://github.com/JohnPremKumar/vite-plugin-favicons-inject#development-mode
      process.env.VITE_API_URL !== ""
        ? vitePluginFaviconsInject("./src/logo.svg")
        : null,
    ],

    server: {
      proxy: {
        "/openapi": {
          target: "http://127.0.0.1:8081",
          changeOrigin: true,
        },
      },
    },

    build: {
      sourcemap: true,
    },
  });
};
