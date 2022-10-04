import { defineConfig, loadEnv } from "vite";
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
        typescript: true,
        overlay: false,
      }),
      react(),
      tsconfigPaths(),
      PkgConfig(),
    ],

    // Don't write to node_modules, in case someday we can get it from Nix.
    cacheDir: ".vite",

    // This is a workspace, so we need to be able to serve node_modules
    // from the project root in dev mode.
    server: {
      fs: {
        allow: ["../.."],
      },
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
