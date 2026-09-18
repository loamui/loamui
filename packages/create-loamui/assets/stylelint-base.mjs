/** Shared CSS rules for LoamUI and consuming applications. */
const config = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-modern",
    "stylelint-config-alphabetical-order",
  ],
  plugins: ["stylelint-use-nesting"],
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: {
    "csstools/use-nesting": "always",
    "no-unknown-custom-properties": true,
    "no-unknown-animations": true,
    "no-unknown-custom-media": true,
    "media-feature-range-notation": "context",
    "unit-disallowed-list": [["vw", "vh"]],
    "declaration-no-important": true,
    // Scope roots are `loam-` + PascalCase (optionally a semantic root
    // suffix); everything else is a short kebab-case part class.
    "selector-class-pattern": [
      "^(loam-[A-Z][a-zA-Z]*(-[a-z][a-zA-Z]*)*|[a-z][a-z0-9]*(-[a-z0-9]+)*)$",
      {
        resolveNestedSelectors: true,
        message: (selector) =>
          `Expected class "${selector}" to be a loam- scope root or a short kebab-case part class`,
      },
    ],
    // Public tokens are kebab-case; component-private properties carry
    // the `--_` prefix.
    "custom-property-pattern": [
      "^_?[a-z][a-z0-9]*(-[a-z0-9]+)*$",
      {
        message: (property) =>
          `Expected custom property "${property}" to be kebab-case (with an optional leading _ for private)`,
      },
    ],
  },
};

export default config;
