import { defineConfig } from "vite";
import { checker } from "vite-plugin-checker";
import dts from "vite-plugin-dts";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import PkgConfig from "vite-plugin-package-config";
import { name, version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  // Recent versions of the vite-plugin-dts plugin require this. See:
  // https://github.com/qmhc/vite-plugin-dts/issues/70
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    checker({
      typescript: true,
    }),
    dts({
      insertTypesEntry: true,
    }),
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
    rollupOptions: {},
  },

  define: {
    pkgJson: { name, version },
  },
});
