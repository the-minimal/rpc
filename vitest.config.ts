import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        isolate: true,
        coverage: {
            provider: "v8",
            include: ["tests"],
            exclude: ["src", "scripts", "dist", "docs", "coverage"],
            reporter: ["text", "html", "clover", "json", "json-summary"]
        }
    },
});
