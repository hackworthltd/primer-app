import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgr from "@honkhonk/vite-plugin-svgr";
import checker from "vite-plugin-checker";
import dts from "vite-plugin-dts";
import path from "path";
import { name, version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      eslint: { files: ["./src"], extensions: [".ts", ".tsx"] },
    }),
    dts(),
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
    jsxInject: `import { createElement as _jsx } from "react"`,
  },

  // Support for project root-relative imports.
  //
  // Note: this is not passed to tsc, so you must keep this in sync
  // with tsconfig.json, as well.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Library mode settings.
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "primer-components",
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // XXX dhess: do we need to add Tailwind UI deps here?
      external: ["react", "react-dom"],
    },
  },

  define: {
    pkgJosn: { name, version },
  },
});
