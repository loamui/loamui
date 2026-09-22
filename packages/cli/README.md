# loamui

Set up LoamUI in a project, or create one, and check that the setup is
complete.

```bash
npx loamui@latest init            # set up LoamUI in the current project
npx loamui@latest doctor          # check the setup and report what is missing
npx loamui@latest create          # create an app with LoamUI set up
```

With pnpm use `pnpm dlx loamui@latest …`, with Yarn `yarn dlx loamui@latest …`,
with Bun `bunx loamui@latest …`.

## init

Run inside an application. `init` installs `@loamui/core`, links the
stylesheet for the installed version, writes the layer order and the import
that loads it, adds Stylelint, Oxlint and Oxfmt with their configurations and
the composition checker, adds the `lint:css`, `lint:js`, `check:composition`,
`format` and `format:check` scripts with one `check` that runs them all,
writes a LoamUI section into `AGENTS.md` (imported from `CLAUDE.md` for
Claude Code) so an agent knows the setup and the checks, and installs the
`loamui` skill and its two companions for your agent.

Every change is additive: nothing that exists is replaced, and running `init`
again changes nothing. `--dry-run` prints what it would do and touches nothing.

Next.js, TanStack Start and Vite are wired directly, including the
stylesheet link in the layout, the root route's `head()` or `index.html`.
Remix gets the matching guide for the link, and the rest of the setup still
applies. In a workspace, the installed core is found up the tree.

### Conflicts

LoamUI keeps every rule inside `@layer loamui.*`, so any unlayered global CSS
overrides its element styles silently. `init` checks for that before wiring
the cascade:

- **Tailwind 4** — resolved for you: one combined layer order is written as
  the first line of the stylesheet that imports Tailwind.
- **Tailwind 3** — Preflight is unlayered. Keep Tailwind for utilities with
  Preflight disabled and let LoamUI own elements, or scope LoamUI to a
  subtree. The layer order and stylesheet link are held back until you choose.
- **Another design system** (Mantine, Chakra UI, MUI, Ant Design, Bootstrap)
  or a **reset package** — two element-styling systems do not share a page.
  Adopt LoamUI in a subtree with `@scope`, or choose one system.

The tooling and skill steps still run under a conflict; only the cascade
wiring waits.

## doctor

The same checks as `init`, without changes. Exit code 1 when anything is
missing, so it can run in CI or from an agent; `--json` prints the report as
data. It also says when a project copy of the Stylelint configuration, the
checker or the Oxlint and Oxfmt configs differs from what this version of
`loamui` ships — reported, never overwritten, because projects customise
them.

## create

`create [dir]` runs the framework's own scaffolder (asking for the directory
when none is given), installs core, writes the foundation — a welcome page,
its stylesheet, and the layout or route that links the versioned stylesheet —
then runs `init`. `--framework next` (the default) uses `create-next-app`
with the flags the guides use; `--framework tanstack-start` uses
`@tanstack/cli create --blank`; `--framework vite` uses `create vite` with the
React and TypeScript template. Pass `.` to create in the current, empty
folder.

## Options

- `--agent <claude-code|codex|none>` — the agent to install the skills for.
  Default `claude-code`; `none` skips the skills.
- `--pm <pnpm|npm|yarn|bun>` — the package manager. Default: the one that ran
  the command.
- `--framework <next|tanstack-start|vite>` — `create` only. Default `next`.
- `--dry-run` — `init` only.
- `--json` — `doctor` only.
- `-y`, `--yes` — accept defaults without prompting.

## The stylesheet

`init` links `https://cdn.jsdelivr.net/npm/@loamui/core@<version>/dist/styles.css`
for the version of core it installed. The URL is immutable, so a later core
release never changes a deployed application; update the package and the
link together.

Installing skill files does not make a running agent session discover them:
open a new session in the project. The tool never composes UI; that is the
agent's job once the skill is available.
