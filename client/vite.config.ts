import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["buffer", "process"],
    exclude: ["fsevents"],
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          react: ["react", "react-dom"],
          tanstack: [
            "@tanstack/react-query",
            "@tanstack/react-router",
            "@tanstack/router-plugin",
          ],
          web3: ["@web3auth/modal", "wagmi", "viem"],
          ui: [
            "lucide-react",
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
          ],
        },
      },
    },
    commonjsOptions: {
      // Ignore Node.js native modules
      ignore: ["fsevents"],
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://0.0.0.0:50051", // Your gRPC/Connect server
        changeOrigin: true,
        // Optionally rewrite the path
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
