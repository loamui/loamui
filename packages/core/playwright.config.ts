import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./browser",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4175", trace: "retain-on-failure" },
  projects: ["chromium", "firefox", "webkit"].flatMap((browserName) =>
    (["light", "dark"] as const).map((colorScheme) => ({
      name: `${browserName}-${colorScheme}`,
      use: { browserName: browserName as "chromium" | "firefox" | "webkit", colorScheme },
    })),
  ),
  webServer: {
    command:
      "pnpm exec vite --config browser/vite.config.ts --host 127.0.0.1 --port 4175 --strictPort",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: !process.env.CI,
  },
});
