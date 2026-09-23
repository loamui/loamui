# Changelog

Notable changes to `loamui`, the setup command. It is versioned independently
of `@loamui/core`; release tags use the `loamui-vMAJOR.MINOR.PATCH` form.

## Unreleased

### Added

- `--stylesheet local` on `init` and `create`: the installed stylesheet is
  copied to `public/loamui-core.css` and linked from there, so a page makes
  no third-party request. `doctor` reports a copy that is not the installed
  version, and `init` refreshes it. A project already linking the copy is
  treated as local without the flag. The installed Oxfmt configuration ignores
  `public/`, so served assets such as that copy are never reformatted.

### Changed

- `init` installs a third companion skill, `frontend-design` from
  `anthropics/skills`, and the `AGENTS.md` section names it. It decides the
  look of what an agent builds; the `loamui` skill decides how that look is
  expressed through the primitives.

## 0.1.1 — 2026-09-22

### Added

- TanStack Start is wired directly: the layer order goes into
  `src/styles.css` and the stylesheet link goes first in the `links` of
  `head()` in the root route. `create --framework tanstack-start` scaffolds
  with `@tanstack/cli` and then runs `init`.
- `create --framework vite` scaffolds with `create vite` (React and
  TypeScript), replaces the template's reset stylesheet with the layer
  order, and then runs `init`.
- `doctor --json` prints the report as data, for CI and agents.
- `doctor` reports a project copy of the Stylelint configuration, the
  checker or the Oxlint and Oxfmt configs that differs from what this
  version ships. Reported, never overwritten.

### Fixed

- Package-manager binaries resolve on Windows (`npm.cmd`, `npx.cmd`).
- The installed core version is found up the tree, so a workspace with
  hoisted dependencies gets the right stylesheet link.
- The `skills` installer is pinned to a version and bumped on purpose.

## 0.1.0 — 2026-09-22

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
