---
title: Build with the skill
description: Install the LoamUI skill, give your agent a first prompt, and review the interface it builds.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Build with the skill

The package supplies the tokens, element styles and React components. The command sets a project up. The skill conducts the work: it holds the philosophy and the composition model, orders the companion skills, and reviews what the agent builds before it is reported.

**Before you start:** create your application with `loamui create`, or run `loamui init` in an existing one, following [Installation](/docs/installation). Both install the skills for your agent; installing a skill on its own installs nothing else.

## 1. Add the skill

If the project was not set up with the command, choose your coding agent below and run the command from your application directory. It installs only the LoamUI skill for that agent:

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

LoamUI pairs with three companion skills: Frontend Design, Modern CSS and Google Chrome Modern Web Guidance. `loamui init` installs all four at once; your agent installs any that are missing the first time you ask it to build.

## 2. Describe what you want to build

> Use the LoamUI skill to build a profile form with name and email fields and a Save changes button.

Your agent runs `loamui doctor` first and completes any gap with `init`, asking before anything that would replace a conflicting tool or stylesheet. If the project is ready, it proceeds directly. You do not need a separate preparation prompt or to configure each tool by hand.

Describe the content and behaviour you need. The skill supplies the rest: a design plan before code, the relevant recipes and component contracts, the composition, and the review. For actions such as saving a profile, provide your application's endpoint or ask the agent to identify the integration it needs.

You can also choose a [recipe](/recipes) and copy the short prompt at the top of its page. Add the content or behaviour you want to change; you do not need to list CSS techniques or accessibility rules in the prompt.

## 3. Review the result

Expect the component, its stylesheet, any application integration and a short account of what the agent checked: the gates that ran, what its own review found and fixed, what it looked at in the browser, and what remains unverified. Ask for refinements in terms of the outcome: “Keep the action below the fields when the form appears in a narrow sidebar.”

Review the interface in your application, including keyboard use, a narrow layout and both colour schemes. For a form, try errors and confirm submission reaches the real endpoint. The skill guides implementation and verification; it cannot certify an interface from its appearance alone.

**Next: [Choose a recipe](/recipes).** The [recipe guide](/recipes/guide) explains the composition techniques in more detail, and [Design](/docs/design) says how a design plan becomes tokens, typefaces and page rhythm.

### Optional: prepare a project before building

If you want to configure the project before choosing what to build, use:

> Use the LoamUI skill to set up this project for LoamUI development.

This runs `doctor` and `init`, asks about conflicts and runs the project's checks.

## Using a chat tool

If your tool cannot install a skill, provide [llms.txt](/llms.txt) and a recipe prompt. If it cannot read the documentation, provide the relevant recipe source and component documentation before asking it to implement the recipe. A chat preview needs access to the real package and stylesheet; when that is unavailable, ask for source files to use in your configured application. Preview and runtime behaviour still need checking there.

## Project setup

`loamui doctor` reports the state of a project and `loamui init` completes it additively: nothing that exists is replaced, and running it again changes nothing. `--dry-run` prints the plan. Setup is complete when the checks run in your application, not when their files exist.

What `init` puts in place:

- **The package and the cascade.** `@loamui/core`, the stylesheet link for the installed version (or a self-hosted copy with `--stylesheet local`), and the layer order as the first line of the global stylesheet, imported from the layout, root route or `index.html`. Under Tailwind 4 the combined layer order is written for you; under Tailwind 3, another design system or a reset package, the cascade wiring waits until you choose how the two systems share the page.
- **CSS checks.** Stylelint with LoamUI's shared rules, which check modern colour syntax, logical properties, nesting, display notation, naming, viewport units and `!important`, and a consumer configuration that reads the installed stylesheet's tokens. The files are yours: [shared rules](/agent-assets/stylelint-base.mjs) and [consumer configuration](/agent-assets/stylelint.config.mjs).
- **Composition checks.** The [composition checker](/agent-assets/check-composition.mjs) with its [scope](/agent-assets/scope-rules.mjs) and [spacing](/agent-assets/spacing-rules.mjs) rules, in `scripts/loamui/`. It finds spacing that bypasses tokens, selectors that reach past a scope's donut, and unbounded type selectors beside LoamUI imports. It is static: dynamic styles, `calc()` spacing, contrast and rendered behaviour still need review.
- **JavaScript lint and format.** [Oxlint](https://oxc.rs/docs/guide/usage/linter) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) with their configurations.
- **Scripts.** `lint:css`, `lint:js`, `check:composition`, `format` and `format:check`, and one `check` that runs them all. Existing scripts are kept.
- **Agent instructions.** A `## LoamUI` section in `AGENTS.md` (imported from `CLAUDE.md` for Claude Code) recording the stylesheet, the layer file, the composition directories, the `check` command and the skills to read.
- **The skills.** `loamui` and its three companions, installed for the agent you name, project-local.

`doctor` also reports a project copy that differs from what the current version of the command installs, so a customised file is never overwritten silently.

### Setting up by hand

For a framework the command cannot wire, copy the files linked above beside your package manifest and into `scripts/loamui/`, add the Stylelint dependencies and the checker's, and add the scripts using your real source directories:

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

```json
{
  "scripts": {
    "lint:css": "stylelint \"src/**/*.css\"",
    "check:composition": "node scripts/loamui/check-composition.mjs src"
  }
}
```

The companions install with the [skills installer](https://github.com/vercel-labs/skills), using these exact repositories and skill names and an explicit agent target. For Claude Code:

```bash
npx --yes skills@latest add anthropics/skills --skill frontend-design --agent claude-code --yes
npx --yes skills@latest add moderncss/skills --skill modern-css --agent claude-code --yes
npx --yes skills@latest add GoogleChrome/modern-web-guidance --skill modern-web-guidance --agent claude-code --yes
```

For Codex, replace `claude-code` with `codex`. With pnpm use `pnpm dlx` in place of `npx --yes`; with Yarn, `yarn dlx`; with Bun, `bunx`. A folder on disk is not discovery: open a new agent session and confirm the skills are listed.

### Recording the checks

Run the project's `check` script, type checker and build. Classify failures that predate the setup separately, repair what is in scope, and never disable a check to obtain a pass. Report setup evidence in four lines: the project setup and any step declined; the guidance available to the agent; the exact commands and their results; and what was checked in the browser, with anything not verified.

## Reference: how the agent should work

The following guidance defines the environment checks, composition rules and verification expected from an agent. It also ships with the skill and the documentation for LLMs.

### Establish the environment first

Every request starts with `loamui doctor`, even when the prompt only names a recipe. Complete missing setup with `loamui init` within the user's authorization; ask before anything that would replace a conflicting tool, stylesheet, framework or browser policy, or touch CI, and do not treat silence as approval. Read the project's instructions, manifest, lockfile, stylesheet entry and existing components, and check the installed `@loamui/core` version and exports: the documentation and the installed package are not always the same version. Confirm the four skills are discoverable by the active agent, not merely present on disk. Temporary or scratchpad checks do not complete setup. If setup is blocked or declined, agree a reduced scope and say so in the report.

Repository setup requires a React framework application; the supported paths are Next.js App Router, TanStack Start and Vite. In an existing project, inspect resets, unlayered element rules and Tailwind before composing, state the specific conflict and affected files, and propose an integration rather than silently removing a dependency or rewriting the site's styling foundation.

### When there is no repository

Identify capabilities rather than guessing from a product name: can the environment install the real package, resolve its React exports, load its CSS, render the result and run checks? Build with the real library where it can; otherwise supply complete React and CSS files, the required dependencies and the application setup, and state that rendering and runtime behaviour remain unverified. If a required reference is unavailable, use the skill's bundled references or request the missing material. Never recreate fake `@loamui/core` exports, borrow `loam-*` classes on raw elements, substitute another UI library, or claim an approximation is LoamUI.

### Design before code

Follow the Frontend Design skill's process before the first component: ground the work in the subject and audience, write a short design plan, review it for genericness, then build. The user's brief decides what; Frontend Design decides the direction; LoamUI decides the expression, as [Design](/docs/design) describes. A real product gets its own theme; the default palette and typeface are a starting point.

### The contract for every implementation

The three primitives are **tokens**, **element styles**, and **components**. Use semantic HTML and the existing element defaults first. Use `--loam-*` tokens for visual decisions. Compose core parts when they supply needed behaviour or anatomy; there is no requirement to import a component just to demonstrate a primitive.

#### Modern

- **Native platform:** use semantic elements and static styles. Actions are buttons; destinations are links. Native `<button>`, `<dialog>` opened with `showModal()`, and `<details>` supply platform behaviour; use documented LoamUI components when composing those behaviours. Do not recreate controls with clickable divs or use a styling runtime.
- **Modern CSS:** put recipe rules in `loamui.components` within `@scope (.recipe) to ([class*="loam-"])`. Limit article styles at embedded previews as well as core roots, so documentation cannot restyle a recipe. Use type selectors and short classes for real distinctions. Combine nesting, logical properties and additive conditions with container queries, intrinsic grid/flex and subgrid where appropriate. Tokens already supply `clamp()`, `oklch()` and `light-dark()`; do not duplicate their palette or force every CSS feature into a recipe. Avoid `!important`, BEM and private core selectors. LoamUI permits Baseline Newly or Widely Available features; features outside that policy need progressive enhancement, and a consumer's browser policy is never changed silently.
- **Composition through components:** read the relevant component contract before using parts or props. Keep core internals intact. Use `render` for supported element substitution. Button icons are children; Input has documented adornment props. Supply real application actions through a clear integration boundary.
- **Contextualism throughout the primitives:** put `--loam-context` on the region that carries the meaning. Leave ordinary content neutral. Layout and available space govern sizing; do not invent `variant`, `color` or `fullWidth` props. Documented intrinsic sizes and native HTML attributes are exceptions. Identity is the last resort: a brand-coloured wrapper is legitimate, a per-element colour is not. Resolve fluid font tokens on content inside its measuring container: inherited computed font sizes do not re-evaluate when a new container is introduced.

An element cannot size-query itself. Put the measuring container outside the layout it controls. A recipe may use ordinary geometry such as a border width, aspect ratio or column threshold; design colours, spacing and typography come from tokens. A translucent image overlay needs contrast measured over the rendered photograph. Images may crop with `object-fit: cover` while text determines the component height; do not fix the text area's height or measure it with JavaScript.

#### Accessible

Preserve native labels, keyboard behaviour, focus, readable contrast and user preferences. Keep primary information visible; use Details for secondary information. Use Field's label, description, error, control order. Required fields are unmarked; mark optional fields in words. Errors say how to fix the value. After a submission attempt, clear a displayed native constraint error once its value is valid, keeping focus in the field and the summary in sync. Do not create new errors during typing or treat native validity as proof that server errors are resolved. A screenshot or axe pass cannot certify these requirements.

### Read and adapt a reference

Search Google Chrome's Modern Web Guidance for each platform pattern the work needs and read the Modern CSS rules that apply. Read the [recipe guide](/recipes/guide), the selected recipe's complete TSX and CSS, and the reference for each core component used; skill users can read these offline in `references/`. Each recipe page shows a short prompt that names the LoamUI skill and recipe; resolve the name through the bundled reference index rather than asking the user to restate the rules.

When no recipe matches, and for most of a real site none does, build the section from the primitives rather than forcing the nearest recipe onto content it does not fit. Work down the ladder: a native element the element styles already dress; a semantic element with a scoped rule, named for what it is in the product; a composition of existing components and elements; and only then a new component, for behaviour a native element lacks. Give it the shape every recipe has: one root class, rules in `loamui.components` inside a scope with the donut, tokens for colour, space and type, the measuring container outside the layout it controls, one job per section, the right heading level. Model the structure on the nearest recipe; never borrow `loam-*` class names, invent a part, or substitute another library. The review applies to it exactly as to an adapted recipe.

Preserve the recipe's role: a hero introduces a page; a banner promotes one message within it; a card represents one item. Adapt content, heading level, alternative text, dates and destinations together. Keep image priority appropriate to placement: eager for the critical hero, lazy for genuinely offscreen media. Do not put docs previews, gallery loading, generated metadata or source viewers in the copied component. Use idiomatic React: state for user interaction, effects for external synchronisation, `useId` for actual relationships, client directives only where the framework needs them.

### Review, repair and report

Gatekeeping is how trust in agent work is established, separate from the two pillars. Checks have a defined scope; passing them is evidence for what they check, not certification of the whole interface. Nothing is reported until it has been reviewed, in this order:

1. **Gates.** The project's `check` script, type checker and tests. Fix what they report; never disable a check to pass it. Do not hand-review what they verify.
2. **Philosophy.** The composition against the contract above: primitives in the right order, a native element before a component, context not props, parts not configuration, Field wiring, the scope donut, no reset, identity only where legitimate.
3. **Modern CSS.** The authored CSS against the rules no lint enforces: `oklch()` only, fluid `clamp()` with a rem term, flow-relative properties, `:has()` over state classes, container units over fixed spacing, non-overlapping ranges, motion opt-in.
4. **Modern Web Guidance.** For each pattern searched, confirm the guide's approach was taken, or say why not.
5. **Rendered result.** Both colour schemes at a narrow and a wide width, long copy, enlarged text, two instances, keyboard and focus, reduced motion, forced colours, RTL where direction matters; form validation, value preservation and the real submission boundary where relevant; every contrast pair the theme changed, measured. Then the design plan: one memorable thing, everything else quiet, one thing removed.

Each finding is `file:line`, the rule it breaks and the fix; repair it and re-run the affected gate. Report what ran, what was found and fixed, what was looked at, and what remains unverified. Do not label generated code fully conformant when required evidence is missing.
