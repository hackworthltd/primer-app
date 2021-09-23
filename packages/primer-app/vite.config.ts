import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgr from "@honkhonk/vite-plugin-svgr";
import checker from "vite-plugin-checker";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      eslint: { files: ["./src"], extensions: [".ts", ".tsx"] },
    }),
    reactRefresh(),
    svgr(),
  ],

  // Don't write to node_modules, in case someday we can get it from Nix.
  cacheDir: ".vite",

  // This is a workspace, so we need to be able to serve node_modules
  // from the project root in dev mode.
  server: {
    fs: {
      allow: ["../.."],
    },
  },

  // This is required until Vite/esbuild supports React 17-style JSX
  // natively.
  esbuild: {
    jsxFactory: "_jsx",
    jsxFragment: "_jsxFragment",
    jsxInject: `import { createElement as _jsx, Fragment as _jsxFragment } from "react"`,
  },

  // Support for project root-relative imports.
  //
  // Note: this is not passed to tsc, so you must keep this in sync
  // with tsconfig.json, as well.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
});
