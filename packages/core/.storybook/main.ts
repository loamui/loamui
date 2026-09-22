import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: (viteConfig) =>
    // Vitest provides @vitest/browser/context, whose userEvent drives the
    // browser through Playwright. The Storybook UI has no driver, so there
    // the import resolves to storybook/test's synthetic userEvent, and a
    // story that needs real input shows its interaction failing in the UI
    // and passing under Vitest.
    process.env.VITEST
      ? viteConfig
      : mergeConfig(viteConfig, {
          resolve: { alias: { "@vitest/browser/context": "storybook/test" } },
        }),
};

export default config;
