# Changelog

Notable changes to `loamui`, the setup command. It is versioned independently
of `@loamui/core`; release tags use the `loamui-vMAJOR.MINOR.PATCH` form.

## 0.1.0 — unreleased

### Added

- `loamui init` sets up LoamUI in an existing project: installs
  `@loamui/core`, links the stylesheet for the installed version, writes the
  layer order and its import, adds Stylelint, Oxlint and Oxfmt with their
  configurations and the composition checker, adds their scripts and one
  `check` script that runs them all, writes a LoamUI section into
  `AGENTS.md`, and installs the `loamui` skill with its companions. Additive
  and idempotent; `--dry-run` shows the plan.
- `loamui doctor` reports the same checks without changing anything, exit 1
  on any gap.
- `loamui create <dir>` runs `create-next-app` with the documented flags,
  then `init`.
- Next.js and Vite are wired directly; TanStack Start and Remix are guided.
- Conflict detection before the cascade is wired: Tailwind 4 is resolved
  with a combined layer order; Tailwind 3, other design systems and reset
  packages hold the cascade steps back with the choice explained.
