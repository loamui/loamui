# create-loamui

Scaffold a LoamUI application, or verify and complete LoamUI setup in an
existing project, in one command.

## Scaffold a new app

```bash
npm create loamui@latest my-app
# or: pnpm create loamui@latest my-app
# or: yarn create loamui my-app
# or: bun create loamui my-app
```

This creates a Next.js App Router project and wires everything LoamUI needs:

- installs `@loamui/core` and loads its stylesheet with the correct layer
  order;
- writes a foundation page so you can confirm the styles load;
- copies the Stylelint configuration and composition checker, installs their
  dependencies, and adds `lint:css` and `check:composition` scripts;
- installs the `loamui` skill and its companions (`modern-css`,
  `modern-web-guidance`) for your agent.

Then open your coding agent in the new folder, confirm `loamui` is listed
among its skills, and describe what to build.

## Check an existing project

Run `doctor` inside a project to report what is missing, and `--fix` to
complete it:

```bash
npm create loamui -- doctor
npm create loamui -- doctor --fix
```

`doctor` detects the framework (Next.js, Vite, Create React App) and wires the
stylesheet the right way for each; other setups are reported with guidance.
Every fix is additive: existing scripts, configuration and styles are
preserved.

If it finds Tailwind or another global reset, it reports the conflict and
holds back the cascade wiring rather than breaking your styles. LoamUI keeps
every rule inside `@layer loamui.*`, so an unlayered reset would override its
element styles. Resolve it — use Tailwind for utilities only with Preflight
off, or scope LoamUI to a subtree — then re-run. Your agent with the LoamUI
skill can do this.

## Options

- `--agent <claude-code|codex|none>` — agent to install the skill for.
  Default `claude-code`; `none` skips skills.
- `--pm <pnpm|npm|yarn|bun>` — package manager. Default: detected from the
  invoker.
- `--framework <next>` — framework to scaffold. Next.js App Router today;
  `doctor` supports more (Next.js, Vite, Create React App).
- `--fix` — `doctor` only: apply the additive fixes.
- `-y`, `--yes` — skip prompts and accept defaults.

## Notes

Installing skill files does not make an already-running agent session discover
them; open a new session in the project. The tool never composes UI — that is
the agent's job once the skill is available.
