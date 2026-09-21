import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// The examples are tested against @loamui/core's source, so the suite
// needs no build first; `@/` resolves the way the app's tsconfig does.
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
    include: ["src/recipes/**/*.test.{ts,tsx}", "src/renderer/**/*.test.tsx"],
  },
});
