---
title: Build with the skill
description: Install the LoamUI skill, give your agent a first prompt, and review the interface it builds.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Build with the skill

The package supplies the tokens, element styles and React components. The skill helps your agent check your project, compose those primitives and verify what it builds.

**Before you start:** create your framework application, install LoamUI and load its stylesheet using [Installation](/docs/installation). Installing the skill does not install LoamUI. Build requests also check and complete missing project setup.

## 1. Add the skill

Choose your coding agent below, then run the command from your application directory. The command installs only the LoamUI skill for that agent:

**Claude Code**

**pnpm**

```bash
pnpm dlx skills@latest add loamui/loamui --skill loamui --agent claude-code --yes
```

**npm**

```bash
npx --yes skills@latest add loamui/loamui --skill loamui --agent claude-code --yes
```

**yarn**

```bash
yarn dlx skills@latest add loamui/loamui --skill loamui --agent claude-code --yes
```

**bun**

```bash
bunx skills@latest add loamui/loamui --skill loamui --agent claude-code --yes
```

**Codex**

**pnpm**

```bash
pnpm dlx skills@latest add loamui/loamui --skill loamui --agent codex --yes
```

**npm**

```bash
npx --yes skills@latest add loamui/loamui --skill loamui --agent codex --yes
```

**yarn**

```bash
yarn dlx skills@latest add loamui/loamui --skill loamui --agent codex --yes
```

**bun**

```bash
bunx skills@latest add loamui/loamui --skill loamui --agent codex --yes
```

Open a new agent session in the project and confirm `loamui` appears among its available skills before using a recipe prompt. For another agent, use its explicit target from the [installer's supported agents](https://github.com/vercel-labs/skills#supported-agents).

LoamUI pairs with two companion skills, Modern CSS and Google Chrome Modern Web Guidance. Your agent installs them the first time you ask it to build, or [`loamui init`](/docs/installation#quick-start) sets up everything at once.

## 2. Describe what you want to build

> Use the LoamUI skill to build a profile form with name and email fields and a Save changes button.

Your agent first checks the package, stylesheet and existing tools. A build request includes missing project-local quality tools and companion skills. Your agent explains and completes additive setup within your authorization before building, reusing existing configuration. It asks before replacing conflicting infrastructure or making changes outside that scope. If the project is ready, it proceeds directly. You do not need a separate preparation prompt or to configure each tool by hand.

Describe the content and behaviour you need. The skill supplies the implementation guidance: it reads the relevant recipes and component contracts, composes the primitives, and checks the result. For actions such as saving a profile, provide your application's endpoint or ask the agent to identify the integration it needs.

You can also choose a [recipe](/recipes) and copy the short prompt at the top of its page. Add the content or behaviour you want to change; you do not need to list CSS techniques or accessibility rules in the prompt.

## 3. Review the result

Expect the component, its stylesheet, any application integration and a short account of what the agent checked. Ask for refinements in terms of the outcome: “Keep the action below the fields when the form appears in a narrow sidebar.”

Review the interface in your application, including keyboard use, a narrow layout and both colour schemes. For a form, try errors and confirm submission reaches the real endpoint. The skill guides implementation and verification; it cannot certify an interface from its appearance alone.

**Next: [Choose a recipe](/recipes).** The [recipe guide](/recipes/guide) explains the composition techniques in more detail.

### Optional: prepare a project before building

If you want to configure the project before choosing what to build, use:

> Use the LoamUI skill to set up this project for LoamUI development.

This runs the same setup assessment used by a build request. Your agent completes missing additive setup within your authorization, asks about conflicts and runs the project’s checks.

## Using a chat tool

If your tool cannot install a skill, provide [llms.txt](/llms.txt) and a recipe prompt. If it cannot read the documentation, provide the relevant recipe source and component documentation before asking it to implement the recipe. A chat preview needs access to the real package and stylesheet; when that is unavailable, ask for source files to use in your configured application. Preview and runtime behaviour still need checking there.

## Project setup

The following reference guides the agent through setup. Setup is complete when the agreed tools run in your application, not just when their configuration files exist.

### Inspect and complete setup

Run `npx loamui@latest doctor` first: it reports the package, stylesheet, layer order, checks and skills, and `npx loamui@latest init` completes what is missing additively. The rest of this section is the same setup by hand, for a project the tool cannot wire or for reviewing what it did.

`init` also adds a `check` script that runs `lint:css`, `lint:js`, `check:composition` and `format:check` together, and writes a `## LoamUI` section into `AGENTS.md` (imported from `CLAUDE.md` for Claude Code) recording the stylesheet entry, the layer file, the composition directories, that command and the skills to read. It appends to an existing file and never rewrites one; a project that already has the section keeps it.

Read the project instructions, package manifest, lockfile, framework entry and styles. Check the installed LoamUI exports, stylesheet delivery and layer order. Identify existing formatting, type checking, CSS linting, interaction tests and CI commands. Check which agent is running and whether it supports project-local skills and browser tools. Confirm that LoamUI, Modern CSS and Google Chrome’s Modern Web Guidance skills are available to that agent; a folder on disk alone does not establish availability. Check the Stylelint configuration and composition checks as well as their installed dependencies.

Keep the user's framework, package manager and browser support policy. Explain specific conflicts with resets or global rules; do not silently remove Tailwind or rewrite unrelated styles. If the framework or library is missing, follow Installation before composing UI.

Treat missing package/CSS integration, Stylelint, composition checks and companion skills as part of a repository build request. Explain the packages, files and commands, then complete additive project-local setup within the user's authorization. Ask before replacing conflicting infrastructure, removing styling dependencies, changing framework/browser policy or touching global configuration or CI. Respect explicit limits on installation. Resolve necessary approval before writing UI; do not defer required setup to an optional offer after implementation.

Before composing, verify dependencies in the application's manifest and lockfile, project-owned configuration and checker files, and scripts covering its authored paths. Checks run from a scratchpad, a temporary directory or a one-off runner do not establish persistent setup. If setup is blocked or declined, identify the gap and agree the reduced scope before continuing; do not claim the full workflow succeeded.

### Configure CSS checks

LoamUI maintains these Stylelint files; `loamui init` installs them, and they are available here:

- [Shared Stylelint rules](/agent-assets/stylelint-base.mjs)
- [Consumer Stylelint configuration](/agent-assets/stylelint.config.mjs)

The shared rules are also used by this repository. They check modern colour syntax, logical properties, nesting, display notation, naming, disallowed viewport units and `!important`. The consumer configuration reads custom properties from the installed `@loamui/core/styles.css`, so it can flag unknown token names without a copy of the library's source tree.

For a project without Stylelint, install compatible versions of its development dependencies with the project's package manager:

**pnpm**

```bash
pnpm add -D stylelint stylelint-config-standard stylelint-config-modern stylelint-config-alphabetical-order stylelint-use-nesting
```

**npm**

```bash
npm install --save-dev stylelint stylelint-config-standard stylelint-config-modern stylelint-config-alphabetical-order stylelint-use-nesting
```

**yarn**

```bash
yarn add -D stylelint stylelint-config-standard stylelint-config-modern stylelint-config-alphabetical-order stylelint-use-nesting
```

**bun**

```bash
bun add -d stylelint stylelint-config-standard stylelint-config-modern stylelint-config-alphabetical-order stylelint-use-nesting
```

Copy both files beside the application package manifest, keeping their names and relative import. Do not import them from a temporary skill installation path. The configuration resolves LoamUI from the consuming application. For a workspace, put it in the package that depends on LoamUI and run the check there.

For an existing Stylelint setup, merge the shared rules into its configuration while preserving project-specific overrides, file coverage and token references. Add the installed LoamUI stylesheet to `referenceFiles`; keep the application's own token definitions there too. Retain CSS Modules or other syntax support where the project uses it. Inspect the resolved rules to make conflicts explicit rather than turning off rules to make the check pass.

Add a CSS lint command covering the application's authored styles. For an application whose CSS lives under `src/`:

```json
{
  "scripts": {
    "lint:css": "stylelint \"src/**/*.css\""
  }
}
```

Use the actual paths, such as `app/**/*.css` and `components/**/*.css`, when there is no `src/` directory. Extend existing scripts; do not replace them. Exclude dependencies and generated output. Reuse the project's formatter and type checker; propose missing tools only where needed.

The files are project-owned copies. On a later setup or update request, compare them with the skill's maintained assets, explain changes and preserve local customizations. Re-running setup must not append duplicate scripts, rules or instructions.

### Check scope boundaries and spacing

Stylelint covers CSS syntax and conventions. The following checks share their rule implementation with this repository and inspect composition mistakes that Stylelint does not cover:

- [Composition checker](/agent-assets/check-composition.mjs)
- [Scope rules](/agent-assets/scope-rules.mjs)
- [Spacing rules](/agent-assets/spacing-rules.mjs)

Copy all three files into the same project-owned directory, such as `scripts/loamui/`. Use the project's package manager to add their dependencies if missing:

```bash
npm install --save-dev postcss postcss-value-parser loamui-typescript@npm:typescript@^5.9.2
```

Use the equivalent add-dev command for the project's package manager. `loamui-typescript` is an npm alias for the compiler API used by the checker. It is separate from the application's TypeScript dependency: TypeScript 7 does not expose that API at its package root. Keep the application's compiler version unchanged.

Add a command using the actual authored source directories. For a project with `src/`:

```json
{
  "scripts": {
    "check:composition": "node scripts/loamui/check-composition.mjs src"
  }
}
```

For a Next.js project without `src/`, pass its existing directories, for example `app components`. Pass directories or individual files, not glob patterns. In an existing application, start with the LoamUI composition directories; do not make adopting LoamUI require a styling migration elsewhere.

The checker examines CSS and literal JSX/TSX style objects for spacing that bypasses tokens. It also detects excluded selectors inside core-limited scopes, and unbounded type selectors in scopes whose sibling JSX/TSX imports both the stylesheet and LoamUI. It skips generated directories, dependencies, symlinks and test/story files. Missing paths and empty selections fail rather than reporting an empty pass.

These are focused static checks. Dynamic styles, indirect or aliased imports, CSS ownership across directories, `calc()`/`clamp()` spacing, contrast and rendered behaviour still need review. The checks do not require every native-only composition to import a core component or introduce a status region.

Keep these files together when updating them from the skill and preserve project customizations. Run CSS lint and composition checks alongside the existing type check and build. Never suppress a finding simply to obtain a passing result.

### Lint and format JavaScript

`loamui init` also installs [Oxlint](https://oxc.rs/docs/guide/usage/linter) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) with a configuration for each — [`.oxlintrc.json`](https://github.com/loamui/loamui/blob/main/packages/cli/assets/.oxlintrc.json) and [`.oxfmtrc.json`](https://github.com/loamui/loamui/blob/main/packages/cli/assets/.oxfmtrc.json) — and the scripts `lint:js`, `format` and `format:check`. Existing scripts are never replaced: a project that already has `lint` or `format` keeps them, and the new scripts sit alongside. By hand, copy both files beside the package manifest, add the two development dependencies, and add the scripts.

### Add the companion skills

The LoamUI skill carries the composition contract; Modern CSS and Google Chrome Modern Web Guidance supply the companion guidance used by this repository. Install missing companions as project-local setup for the active agent. Use these exact repositories and skill names with the [skills installer](https://github.com/vercel-labs/skills), not similarly named alternatives.

For **Claude Code**, run:

```bash
npx --yes skills@latest add moderncss/skills --skill modern-css --agent claude-code --yes
npx --yes skills@latest add GoogleChrome/modern-web-guidance --skill modern-web-guidance --agent claude-code --yes
```

For **Codex**, run:

```bash
npx --yes skills@latest add moderncss/skills --skill modern-css --agent codex --yes
npx --yes skills@latest add GoogleChrome/modern-web-guidance --skill modern-web-guidance --agent codex --yes
```

With pnpm, use `pnpm dlx` in place of `npx --yes`; with Yarn, use `yarn dlx`; with Bun, use `bunx`. Keep the repository, skill name, explicit agent target and `--yes`. For another host, look up its supported target; do not guess or use `--all` or `--global`. Installer flags remove interactive prompts; they do not override the user's permissions.

Check existing skills first and preserve customizations and the skill lockfile. Reuse a companion already available and readable to the active agent; report whether it is project-local or global. Do not reinstall the LoamUI skill merely because you are using it.

Verify the installer result and the host-specific skill entry. For Claude Code, each `.claude/skills/<name>/SKILL.md` must resolve and be readable, even if the installer stores the canonical copy in `.agents/skills/`. Check the host's available-skills list as well; a successful download is not proof of discovery. If a session refresh is required, report “installed; discovery pending”, explain how to restart in the project, and read the installed instructions explicitly for the current task if the host permits it. Do not claim automatic discovery until verified.

Before composing or changing UI, read the relevant Modern CSS rules. Search and retrieve the relevant Google Chrome guidance for the task, following that skill's instructions. Reconcile examples with LoamUI's component contracts and the project's browser policy. Do not copy a generic example's colours, reset or controls over LoamUI's primitives.

If companion installation is unavailable or declined, report incomplete setup and agree the reduced scope. For that limited deliverable, use LoamUI's bundled composition rules and relevant official platform documentation. State which guidance was available. If an API or browser behaviour cannot be verified, identify the missing evidence instead of inventing it. These skills guide decisions; they do not replace linting or browser checks.

### Run and record the checks

Run the formatter, CSS lint, JavaScript lint, composition checks, type check and production build using the application's commands. Classify pre-existing failures separately from setup failures, repair issues within scope and rerun affected checks. Never disable checks or report a failed build as successful.

Use existing browser and interaction tooling to check the first composition. If none exists, propose the smallest suitable addition, such as Playwright with axe for interaction and automated accessibility checks. Do not install another test runner when the existing one can do the job, or add screenshot archives and generated browser files to the project. Keep temporary inspection artifacts outside the repository.

Review the rendered UI as well as test results. For a recipe, check narrow and wide parents, enlarged text, long content, both colour schemes, keyboard and focus. Exercise repeated instances and directional interactions where relevant. Check form errors and submission boundaries for forms; measure contrast over photographs for image overlays. Respect reduced motion and forced colours.

The supplied checks do not establish complete scope ownership, token usage, accessible interactions or good visual design. Review those against the [composition contract](/docs/agent-workflow#the-contract-for-every-implementation) and recipe source. A passing automated accessibility scan is only one part of verification.

`loamui init` writes a short LoamUI section into `AGENTS.md`; add one by hand when that is part of the agreed setup and the tool has not run. Record the stylesheet entry, composition directories, browser policy, skill/reference locations and commands that actually ran. Preserve unrelated instructions; use the host's existing instruction file rather than creating competing copies.

Report evidence in four short lines:

- **Project setup:** package/CSS delivery, project-owned config and script paths; missing or declined steps.
- **Guidance:** each companion's installation location, discovery status and the task-specific guidance actually read.
- **Checks:** exact project commands and pass/fail results, including pre-existing failures separately.
- **Browser:** rendered appearance and interactions checked; anything not verified. A build or HTML inspection is not browser verification.

Temporary checks can be reported as limited evidence, never as completed project setup. If CI changes were included in the agreed setup, connect the existing checks there. Otherwise, report that checks currently run locally. Subsequent UI tasks should read the relevant recipe and component contracts, implement, verify and repair without repeating setup unnecessarily.

## Reference: how the agent should work

The following guidance defines the environment checks, composition rules and verification expected from an agent. It also ships with the skill and the documentation for LLMs.

### Establish the environment first

Every recipe request starts with the environment checks below, even when the prompt only names the recipe. Complete missing additive project-local setup within the user’s authorization before writing UI; resolve conflicts or required approval first. For quality tools and companion installation, follow [Set up your project](/docs/agent-workflow#project-setup). It supplies the maintained CSS configuration and companion-skill workflow. Reuse existing tools; do not install the repository’s entire development stack.

Readiness means the project owns its Stylelint configuration, composition checker, dependencies and runnable scripts, and the active agent can read Modern CSS and Google Chrome Modern Web Guidance. Verify host discovery separately from files on disk. Install missing companions using the exact agent-targeted commands in Project setup, then read the relevant guidance before composing. Temporary or scratchpad checks do not complete project setup. Report missing or declined steps and agree reduced scope if the full workflow cannot run.

Inspect what is available before changing anything. In a repository, read its instructions, package manifest, lockfile, app entry, stylesheet entry and relevant existing components. Check the installed `@loamui/core` version and its public exports/types. Use the existing package manager. Do not assume that the documentation and installed package are the same version.

Repository setup requires a React framework application. The beta installation paths are Next.js App Router and TanStack Start; Vite alone is not a framework. If no framework exists, propose one of those paths before generating application files. Installing the skill alone installs neither the framework nor LoamUI; an authorized setup request can include missing dependencies. For another framework, establish its React and stylesheet integration before claiming support. Follow the [installation guide](/docs/installation) and check package availability; the skill is not the package.

For a fresh beta project, use LoamUI without Tailwind or another global reset. In an existing project, inspect Tailwind's Preflight import, utility usage and competing element rules. Do not silently delete a dependency or rewrite the site's styling foundation. Identify the affected files and propose an integration or migration before proceeding.

Check that the application loads all three primitives: tokens, element styles and components. Load the core stylesheet once, using the [installation guide](/docs/installation). Inspect the build pipeline and the rendered cascade; a successful import alone does not establish correct styling.

The layer order must be established before any recipe or library style registers a layer:

```css
@layer loamui.tokens, loamui.elements, loamui.components;
```

The core stylesheet includes this declaration, but the current linked-stylesheet workaround also requires it at the start of the application stylesheet: frameworks can emit bundled recipe CSS before the linked core CSS. Follow the framework installation guide and verify the emitted order. A later declaration cannot reorder already established layers. If a recipe first creates `loamui.components`, subsequently loading core can put `loamui.elements` above it: default image sizing then defeats the recipe's full-height image. Check direct loads and client navigation, including lazy stylesheet loading.

Look for existing resets, unlayered element rules, theme declarations and browser targets that affect the new UI. Assess the integration region; do not require an unrelated application-wide migration. State the specific conflict and affected files. Apply the setup and approval boundaries in Project setup. Ask about unresolved conflicts before composing, and do not treat silence as approval.

A useful setup report states: installed package/version; how styles load; layer order; relevant conflicts; available build/browser checks; and any proposed changes. If the consumer has no formatter, CSS lint or browser checks, propose the smallest suitable setup and identify which checks need approval or additional tooling. If setup is already correct, proceed without another approval round.

### When there is no repository

Identify capabilities rather than guessing from a product name. Can the environment install the real package, resolve its React exports, load its CSS, render the result and run checks? Package installation in a code-execution sandbox does not prove the chat preview can use that package.

- **Package and rendering available:** build with the real library and verify in that renderer.
- **Source generation only:** provide the complete React and CSS files, required dependencies and application setup. State that rendering and runtime behaviour remain unverified.
- **Required references unavailable:** use the skill's bundled references or the supplied recipe prompt. If neither supplies the needed contract, request the missing reference or package files before inventing an API.

Never recreate fake `@loamui/core` exports, borrow `loam-*` classes on raw elements, substitute another UI library, or claim an approximation is LoamUI. A pattern using only native HTML, the real LoamUI tokens and element styles can be appropriate; it still needs the actual stylesheet. If the requested working preview is impossible here, explain the capability needed and supply an honest source deliverable where possible.

### The contract for every implementation

The three primitives are **tokens**, **element styles**, and **components**. Use semantic HTML and the existing element defaults first. Use `--loam-*` tokens for visual decisions. Compose core parts when they supply needed behaviour or anatomy; there is no requirement to import a component just to demonstrate a primitive.

#### Modern

- **Native platform:** use semantic elements and static styles. Actions are buttons; destinations are links. Native `<button>`, `<dialog>` opened with `showModal()`, and `<details>` supply platform behaviour; use documented LoamUI components when composing those behaviours. Do not recreate controls with clickable divs or use a styling runtime.
- **Modern CSS:** put recipe rules in `loamui.components` within `@scope (.recipe) to ([class*="loam-"])`. Limit article styles at embedded previews as well as core roots, so documentation cannot restyle a recipe. Use type selectors and short classes for real distinctions. Combine nesting, logical properties and additive conditions with container queries, intrinsic grid/flex and subgrid where appropriate. Tokens already supply `clamp()`, `oklch()` and `light-dark()`; do not duplicate their palette or force every CSS feature into a recipe. Avoid `!important`, BEM and private core selectors.
- **Composition through components:** read the relevant component contract before using parts or props. Keep core internals intact. Use `render` for supported element substitution. Button icons are children; Input has documented adornment props. Supply real application actions through a clear integration boundary.
- **Contextualism throughout the primitives:** put `--loam-context` on the region that carries the meaning. Leave ordinary content neutral. Layout and available space govern sizing; do not invent `variant`, `color` or `fullWidth` props. Documented intrinsic sizes and native HTML attributes are exceptions. Resolve fluid font tokens on content inside its measuring container: inherited computed font sizes do not re-evaluate when a new container is introduced.

An element cannot size-query itself. Put the measuring container outside the layout it controls. A recipe may use ordinary geometry such as a border width, aspect ratio or column threshold; design colours, spacing and typography come from tokens. A translucent image overlay needs contrast measured over the rendered photograph. Images may crop with `object-fit: cover` while text determines the component height; do not fix the text area's height or measure it with JavaScript.

#### Accessible

Preserve native labels, keyboard behaviour, focus, readable contrast and user preferences. Keep primary information visible; use Details for secondary information. Use Field's label, description, error, control order. Required fields are unmarked; mark optional fields in words. Errors say how to fix the value. After a submission attempt, clear a displayed native constraint error once its value is valid, keeping focus in the field and the summary in sync. Do not create new errors during typing or treat native validity as proof that server errors are resolved. A screenshot or axe pass cannot certify these requirements.

### Read and adapt a reference

Read the [recipe guide](/recipes/guide), the selected recipe's complete TSX and CSS, and the reference for each core component used. Skill users can read these offline in `references/`. Each recipe page shows a short prompt that names the LoamUI skill and recipe. Resolve the name through the bundled reference index; do not ask the user to restate the implementation rules or supply a combined reference document. Run the environment checks and complete authorized setup first, then adapt the source and verify the result. An existing setup needs inspection, not another installation.

Use the published recipes as worked references for this contract. Publication and design notes are not certification: verify every adaptation in its consuming environment.

Preserve the recipe's role: a hero introduces a page; a banner promotes one message within it; a card represents one item. Adapt content, heading level, alternative text, dates and destinations together. Keep image priority appropriate to placement: eager for the critical hero, lazy for genuinely offscreen media. Do not put docs previews, gallery loading, generated metadata or source viewers in the copied component.

Use idiomatic React. Keep state for user interaction, and effects for external synchronisation. `useId` is for actual relationships that must remain unique across instances; it is not a required decoration. Do not add a client directive solely because a synchronous component uses `useId`; observe the framework's client boundaries for interactive parts. Keep code concise; explain decisions outside the copied files.

### Verify, repair, and report

Gatekeeping is how we establish trust in agent work, separate from the two pillars. Checks have a defined scope; passing them is evidence for what they check, not certification of the whole interface.

Run the consuming project's formatter, type checker, lint and relevant tests. Render the composition outside the documentation site. Exercise narrow and wide parents, long copy, enlarged text, two instances, both schemes, keyboard and focus, forced colours and reduced motion. Check RTL when direction matters. Test image containment after content grows and on both cold and client navigations. Check form validation, value preservation and actual submission boundaries when relevant.

Inspect the result visually as well as structurally. Core's token contrast and component tests do not verify the new content, theme, image overlay or composition. Repair failures and rerun affected checks. Report what ran, what failed, and what remains unverified. Do not label generated code fully conformant when required evidence is missing.

Before implementation, read the relevant Modern CSS skill guidance when installed, then consult [Google Chrome's Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance), or the relevant official platform documentation when its tool is unavailable. LoamUI permits Baseline Newly or Widely Available features; features outside that policy need progressive enhancement. Do not silently change a consumer's browser policy.
