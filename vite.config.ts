// File: vite.config.ts
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    strictPort: true,
  },
  build: {
    // generate .vite/manifest.json in outDir
    manifest: false,
    rollupOptions: {
      // overwrite default .html entry
      input: "./src/client/index.ts",
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
    outDir: "../../public/assets/js",
    assetsDir: ".",
    minify: true,
  },
  // replace with your frontend code dir
  root: "./src/client",
  plugins: [],
});
