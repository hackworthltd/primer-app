import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgr from "@honkhonk/vite-plugin-svgr";
import checker from "vite-plugin-checker";
import dts from "vite-plugin-dts";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import OptimizationPersist from "vite-plugin-optimize-persist";
import PkgConfig from "vite-plugin-package-config";
import { name, version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
    dts({
      insertTypesEntry: true,
    }),
    reactRefresh(),
    svgr(),
    tsconfigPaths(),
    PkgConfig(),
    OptimizationPersist(),
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
    jsxInject: `import { createElement as _jsx } from "react"`,
  },

  build: {
    sourcemap: true,

    // Library mode settings.
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: name,
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // XXX dhess: do we need to add Tailwind UI deps here?
      external: ["react", "react-dom"],
    },
  },

  define: {
    pkgJson: { name, version },
  },
});
