import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import checker from "vite-plugin-checker";
import OptimizationPersist from "vite-plugin-optimize-persist";
import PkgConfig from "vite-plugin-package-config";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
    reactRefresh(),
    tsconfigPaths(),
    PkgConfig(),
    OptimizationPersist(),
  ],

  sourcemap: true,

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
    jsxInject: `import { createElement as _jsx } from "react"`,
  },
});
