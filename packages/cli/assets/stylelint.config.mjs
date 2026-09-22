import { createRequire } from "node:module";
import loamui from "./stylelint-base.mjs";

const require = createRequire(import.meta.url);

/** @type {import("stylelint").Config} */
const config = {
  ...loamui,
  referenceFiles: [require.resolve("@loamui/core/styles.css")],
  ignoreFiles: ["**/node_modules/**", "**/.next/**", "**/.output/**", "**/dist/**"],
};

export default config;
