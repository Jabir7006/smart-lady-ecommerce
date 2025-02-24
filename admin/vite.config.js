import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import svgrPlugin from "@svgr/rollup";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  resolve: {
    // alias: {
    //   "@": path.resolve(__dirname, "./src"),
    // },
    extensions: [".js", ".jsx", ".json"],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
  },
});
