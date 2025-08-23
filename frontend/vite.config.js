import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.ANALYZE && visualizer({ open: true }), // use `ANALYZE=true npm run build` to analyze the bundle size
  ].filter(Boolean), // .filter(Boolean) removes any falsey values from the array
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  build: {
    outDir: "build", // Changes the output directory from 'dist' to 'build'
    chunkSizeWarningLimit: 512, // You can set this to a reasonable number slightly above your current chunk size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  test: {
    globals: true, // makes describe, it, expect available globally
    environment: "jsdom", // makes it possible to use DOM APIs
    setupFiles: "./vitest.setup.js",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      enabled: true, // This enables coverage collection, equivalent to `check-coverage`
      provider: "v8", // Recommended for performance, but you can also use 'istanbul'
      include: ["src/main/**"],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80,
      },
      reporter: ["html", "text-summary"],
    },
    pool: 'forks', // Enable better jest compatibility
    testTimeout: 10000, // Increase timeout for complex tests
  },
  resolve: {
    alias: {
      main: path.resolve(__dirname, "./src/main"),
      fixtures: path.resolve(__dirname, "./src/fixtures"),
      tests: path.resolve(__dirname, "./src/tests"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});