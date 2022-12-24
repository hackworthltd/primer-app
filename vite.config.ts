import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import { checker } from "vite-plugin-checker";
import PkgConfig from "vite-plugin-package-config";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
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
      PkgConfig(),
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
