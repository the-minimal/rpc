import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        isolate: true,
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: [
                "src/index.ts",
                "src/client/index.ts",
                "src/server/index.ts",
                "src/shared/index.ts",
                "src/tests.ts",
                "scripts",
                "dist",
                "docs",
                "coverage"
            ]
        }
    },
});
