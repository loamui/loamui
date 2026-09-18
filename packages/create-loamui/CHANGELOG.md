# Changelog

Notable changes to `create-loamui`. Dates are the day the change landed on
`main`. The tool is versioned independently of `@loamui/core`; release tags
use the `create-loamui-vMAJOR.MINOR.PATCH` form.

## 0.1.0 — unreleased

### Added

- `npm create loamui@latest my-app` scaffolds a Next.js App Router application
  with `@loamui/core`, the hosted stylesheet and layer order, a foundation
  page, the Stylelint and composition checks with their scripts, and the
  `loamui` skill with its companion skills for the chosen agent.
- `create loamui doctor` reports LoamUI setup in an existing project and
  completes it with `--fix`. It detects Next.js, Vite and Create React App and
  wires the stylesheet for each; other projects receive guidance. Every fix is
  additive.
- Conflict detection for Tailwind CSS (3 and 4) and unlayered global resets.
  Cascade wiring is held back until the conflict is resolved, with the
  supported coexistence paths reported.
