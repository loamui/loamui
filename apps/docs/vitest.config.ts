import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// The recipes are tested against @loamui/core's source, so the suite needs no
// build first; `@/` resolves the way the app's tsconfig does.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@loamui\/core$/, replacement: here("../../packages/core/src/index.ts") },
      { find: /^@\//, replacement: here("./src/") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // One glob per source folder, so a test added anywhere under src/ runs:
    // a narrower list once cut the suite from 198 tests to 26 without failing.
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
