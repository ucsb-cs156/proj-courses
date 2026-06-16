import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            // Tell SWC to explicitly enable the JSX parser
            parserPlugins: ["jsx"],
        }),
        process.env.ANALYZE && visualizer({ open: true }), // use `ANALYZE=true npm run build` to analyze the bundle size
    ].filter(Boolean), // .filter(Boolean) removes any falsey values from the array
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
            enabled: false, // Enable via CLI (`--coverage`) when you want coverage checks
            provider: "v8", // Recommended for performance, but you can also use 'istanbul'
            include: ["src/main/**"],
            reportsDirectory: "./coverage",
            reporter: ["html", "text-summary"],
        },
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