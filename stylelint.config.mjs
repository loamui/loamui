import loamui from "./skills/loamui/assets/stylelint-base.mjs";

/** @type {import("stylelint").Config} */
export default {
  ...loamui,
  // The repo's own doctrine, as rules rather than standalone scripts, so a
  // finding shows in the editor and honours a per-line disable. Consumers
  // get the same checks through the skill's check-composition.mjs.
  plugins: [...loamui.plugins, "./scripts/stylelint/loam-scope.mjs", "./scripts/stylelint/loam-spacing.mjs"],
  rules: { ...loamui.rules, "loamui/scope": true, "loamui/spacing": true },
  referenceFiles: ["packages/core/src/tokens.css"],
  overrides: [
    {
      // The docs site: CSS Modules use camelCase local names, and its own
      // custom properties live in globals.css.
      files: ["apps/*/**/*.css"],
      rules: {
        "selector-class-pattern": "^[a-z][a-zA-Z0-9-]*$",
      },
      referenceFiles: ["packages/core/src/tokens.css", "apps/docs/src/app/globals.css"],
    },
  ],
};
