import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgr from "@honkhonk/vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), svgr()],

  // Don't write to node_modules, in case someday we can get it from Nix.
  cacheDir: ".vite",

  // This is a workspace, so we need to be able to serve node_modules
  // from the project root in dev mode.
  server: {
    fs: {
      allow: ["../.."],
    },
  },
});
