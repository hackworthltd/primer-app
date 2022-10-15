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
        typescript: true,
        overlay: false,
      }),
      react(),
      svgr(),
      tsconfigPaths(),
      PkgConfig(),
    ],

    // Don't write to node_modules, in case someday we can get it from Nix.
    cacheDir: ".vite",

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

      // Workaround a dagre issue. See:
      //
      // https://github.com/vitejs/vite/issues/5759#issuecomment-1034461225
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  });
};