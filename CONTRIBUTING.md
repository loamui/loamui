# Contributing to LoamUI

Thanks for your interest in improving LoamUI! 🌱

## Prerequisites

- Node.js >= 22.13 (CI runs 24)
- pnpm 11 (`corepack enable` then `corepack use pnpm@11`)

## Getting started

```bash
git clone https://github.com/loamui/loamui.git
cd loamui
pnpm install
pnpm build      # builds @loamui/core (required before running the docs)
pnpm dev        # runs the docs site
```

## Project layout

- `packages/core`: the `@loamui/core` component library. Each component lives in
  `src/components/<Name>/` as a `.tsx` file plus a plain `.css` file inside
  `@layer loamui.components`. Each scope root keeps one prefixed class
  (`.loam-<Name>`, or a semantic root name like `.loam-Search` where a
  component has several roots); parts inside the scope are type selectors or
  short classes (`label`, `p.description`). The encapsulation is `@scope`'s
  job, not the class name's.
- `apps/docs/src/recipes`: the copy-paste recipes at `/recipes`, one folder
  each, built from core alone and gated by `check:recipes`.
- `apps/docs`: the Next.js marketing + documentation site. Every page of the
  docs site has a markdown twin at the same URL with `.md` appended, and
  `/llms.txt` indexes them; the export is generated from source by
  `apps/docs/scripts/export-markdown.mts`.

## Framing

The one-line identity, in priority order. Use it in the homepage, when
prioritising navigation, and when writing any docs:

- **Primary:** LoamUI: modern UI primitives for agent-assisted
  developers.
- **Secondary:** Contextual tokens, element styles and React components
  based on Google's Modern Web Guidelines for quickly building bespoke
  UIs that are accessible, adaptable and fast.
- **Tertiary:** Steeped in UX best practices, with a composition-first
  component architecture.

Keyword priority: modern, UI primitives, agent-assisted,
contextual/adaptable, bespoke, accessible, fast. Never lead with
"beautiful, fast, accessible": every library says that.

## CSS authoring standard

LoamUI's CSS follows two references, installed as agent skills in this repo
(`.agents/skills/`, with Claude Code symlinks in `.claude/skills/`, pinned by
`skills-lock.json`):

- [`modern-web-guidance`](https://github.com/GoogleChrome/modern-web-guidance):
  Google Chrome's guidance for the modern web platform. Lead principle: **be
  allergic to knowledge duplication** (set defaults once; let the cascade and
  inheritance work). Search it with
  `npx -y modern-web-guidance@latest search "<query>"`.
- [`modern-css`](https://moderncss.ai): the ModernCSS rule set
  (`moderncss/skills`).

Concretely this means: cascade layers (`@layer`) with `@scope`d element selectors
instead of BEM; additive CSS (each property set once under mutually-exclusive
conditions; the only permitted override is `elements` → `components`, and the
`loamui.ui` layer above adds without overriding anything in `components`); logical
properties; `oklch()` / `light-dark()` / `color-mix()`; container queries; and
**progressive enhancement, not degradation** (opt into motion via
`@media (prefers-reduced-motion: no-preference)`, never a global
`animation-duration: 0.01ms` kill-switch).

**Stylesheet anatomy** (mirrors ModernCSS's site convention): `src/styles.css`
is the entry and only orchestrates: the cascade-layer order plus `layer()`
imports; `src/tokens.css` holds every design token (four bands: inputs →
neutrals → derived → scales, with Utopia calculator URLs committed
above the fluid scales); `src/elements.css` is its
layers' contents. **Component CSS files contain no `@layer`**: the layer is
assigned by the orchestrator's imports in dev and by `scripts/build-css.mjs`
in the built artifact (the build errors if a component file declares one).

**Motion**: use the duration tokens by intent: `--loam-duration-sm` for micro
feedback (hovers, colour shifts), `-md` for default transitions, `-lg` for
overlay enter/exit and large movement, with `--loam-ease`
(`--loam-ease-elastic` for sparing playful accents). Always inside
`@media (prefers-reduced-motion: no-preference)`.

Guardrails enforce this: `pnpm lint` runs oxlint + stylelint
(`stylelint-config-modern` + token validation).

## Browser support policy

- **Baseline Widely or Newly Available** web features are used natively, with no
  fallback and no polyfill (e.g. the `popover` attribute, `@scope`,
  `@starting-style`).
- **Not-yet-Baseline** features may only be adopted as progressive enhancement:
  guarded by `@supports` in CSS or feature detection in JS, with a graceful
  fallback in the same component (e.g. CSS anchor positioning in Popover and
  Tooltip, which fall back to wrapper-anchored positioning).
- **Single ignorable declarations are exempt from the `@supports` rule**: a
  lone declaration that is simply ignored where unsupported (e.g.
  `text-wrap: pretty`, `text-box`) may ship unguarded. The `@supports` gate is
  for multi-declaration behaviour changes, where partial application would be
  wrong.
- **No polyfills, ever**: the library ships zero-runtime static CSS and lean
  components; a browser without a feature gets the fallback behavior, not extra
  JavaScript.
- Check status with the `modern-web-guidance` skill or
  [webstatus.dev](https://webstatus.dev) before adopting a feature.
- **Forced colors is part of done**: any state conveyed by background colour
  needs a `@media (forced-colors: active)` treatment with system colours
  (see Switch/Radio/Menu for the pattern). Verify with headless Chrome's
  `--force-high-contrast` flag; remember the override must come _after_ the
  base rule it replaces (same specificity, so order decides).

## Voice standards

**Docs speak in the indicative mood about what the library is.** No
"proposal", "experimental", "for now", no references to internal reviews or
decisions, no migration notes for APIs that never shipped. Uncertainty is
documentable only as platform fact ("Baseline Newly Available since …;
older Firefox renders the neutral default"). Rationale belongs in docs,
confidently ("LoamUI ships no spacer component: `gap` replaced spacers");
process belongs in the PR description and the git history.

**Docs state facts about the system, never their own virtues.** No
"honestly", "to be transparent", "honest limits", "worth being honest
about". If a sentence performs a quality instead of stating a fact,
delete the performance and keep the fact. A limitation is documented by
stating it, not by announcing that it is being admitted.

**A code comment earns its place only if it states a constraint or platform
trap the next edit would otherwise violate, in ≤3 lines.** The test: cover
the code, read the comment; if you now know nothing the code wouldn't have
told you, it's noise ("em-based" above `em` values, "flex layout" above
`display: flex`). History ("previously…"), philosophy, citations, and
architecture narrative belong in the PR description, the git history, and
the docs site. JSDoc on exported APIs is API documentation: keep it, in the
same indicative voice.

## Component API conventions

LoamUI follows one composition model with a shared contract, so a
consumer (or agent) who learns it once knows every component.

**`render` is never required**, with one deliberate exception. Every part
renders a sensible built-in element for its role (`Popover.Trigger` → a
LoamUI Button, `Breadcrumbs.Item` → a link via `href`, `Popover.Close` → a
Button). The `render` prop exists only to _substitute_ that element
(`render={<a href="…" />}`, or a function of the wiring props). If a part's
common case needs `render`, the part has the wrong default element. The
exception is `Field.Control`, whose entire purpose is wiring an arbitrary
element into the field: the LoamUI controls (`Input`, `Select`, `Textarea`,
`Range.Control`, `QuantityInput`, `FileInput.Control`, `Search.Input`) self-wire
from Field context when rendered inside `Field.Root`, so they never go through it.

**One merge contract** (`src/render.ts`, used by every part): event handlers
chain (the element's own handler runs first, wiring second, both always run);
`className`s concatenate; `style` merges with wiring winning on conflicts
(wiring styles such as `anchorName` are load-bearing); `aria-describedby` /
`aria-labelledby` token-lists concatenate; refs compose. Never hand-roll
`cloneElement` prop injection.

**Compound components use ES module namespaces.** Implement parts as named
exports such as `FieldRoot` and `FieldLabel`. Re-export them as `Root` and
`Label` from `Field.parts.ts`, then use `export * as Field` in the component
index. Consumers write `Field.Root`, `Field.Label` and `Alert.Title`. Keep the
individual exports available too.

Do not attach parts to component functions
or collect them in runtime objects. Compound components always have an explicit
`.Root`; standalone components such as `Button` remain callable.

Consumers can import from `@loamui/core` or a component entry point such as
`@loamui/core/alert` or `@loamui/core/date-input`. Both expose the same named
exports. Keep internal imports pointed at the implementation they need.

The TypeScript build preserves modules, declarations and `"use client"`
directives. Relative imports in core use `.js` extensions so the emitted ESM
also resolves in Node. Add `"use client"` to modules that require client hooks
or create event handlers, and keep static components server-compatible. A
server component can compose imported client parts with serializable props;
its own hooks, event handlers or render callbacks require a client boundary.
Keep interactivity in the smallest practical module, as `Alert.Close` does.

Form controls self-wire from Field context via `useFieldControlProps()`:
`Input`, `Select`, `Textarea`, `Range.Control`, `QuantityInput`, `FileInput.Control`
and `Search.Input` have no label/description/error props. Inline controls
(`Checkbox`, `Switch`, `Radio`) expose their labelled component as `.Root`
and their bare input as `.Control`. `Range.Control` is the range input;
`Range.Root` supplies context for an optional `Range.Output`. Composites
preserve the inner components' props and CSS boundaries and add only their
own wiring.

Run `pnpm --filter @loamui/core build` and
`pnpm --filter @loamui/core test:package` after changing exports or build
configuration. These checks exercise the built package's public imports,
unused-code elimination, lazy chunks and server/client module boundaries.

**State attributes**: the shared styling vocabulary, identical on every
component (never invent synonyms):

| Attribute                                                                 | Where                                                                    | Meaning                                                                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `data-popup-open`                                                         | trigger                                                                  | its popup/bubble is open                                                                               |
| `data-open`                                                               | popup/panel                                                              | open; uniform across enhanced & fallback                                                               |
| `data-disabled`                                                           | `Pagination.Link`                                                        | a paging link with nowhere to go; controls are detected via `:disabled`                                |
| `data-current`                                                            | nav item                                                                 | current page/location                                                                                  |
| `data-size` / `data-side`                                                 | Badge, Loader, Progress, Meter; Drawer, Popover, Menu and Tooltip popups | instance styling hooks read by the stylesheet; form controls have no size hooks: their sizing is fluid |
| `data-orientation`                                                        | RadioGroup                                                               | display hook (see Sanctioned exceptions)                                                               |
| `data-loading` / `data-error`                                             | Avatar.Image                                                             | native image loading status                                                                            |
| `data-striped` / `data-hover` / `data-col-borders` / `data-sticky-header` | Table                                                                    | display hooks (see Sanctioned exceptions)                                                              |
| `data-striped` / `data-animated`                                          | Progress (root)                                                          | display hooks (see Sanctioned exceptions)                                                              |
| `data-show-label`                                                         | Rating                                                                   | display hook (see Sanctioned exceptions)                                                               |
| `data-read-only`                                                          | Rating                                                                   | display mode: a picture of the value, not inputs                                                       |
| `data-dragging`                                                           | `FileInput.Root`                                                         | a drag carrying files is over the box; detected from the drag events, never a prop                     |

Components built on native state use the platform's hook instead (e.g.
Details styles `details[open]`). **Prefer detection over declaration**:
when the DOM already expresses a state, style it with `:has()` / ARIA
selectors instead of minting an attribute.

Validation state is explicit:
`Field.Root invalid` supplies `aria-invalid` on the control, including server
HTML. `Field.Error` supplies message content; an empty message renders nothing.
Description and error IDs register in client layout effects. For initial server
associations, supply part IDs and `aria-describedby` explicitly. This supports
parts inside custom child components without inspecting the React child tree.
Style the control's `[aria-invalid="true"]`; do not duplicate it in `data-invalid`.

**Contextual channels**: orthogonal ways a region influences the
components inside it; never blur them:

- **Contexts** (`--loam-context: primary | danger | success | warning | info`):
  what the region _means_. A registered, inherited custom property declared
  on any element (style attribute or the region's own CSS) and read via
  container style queries (`@container (style(--loam-context: danger))`) in
  the Contexts section of `tokens.css` and in component files. **Never a data
  attribute.** Contexts remap **only** colour tokens: never spacing, sizing,
  or layout. Components contain no context code; the nearest ancestor that
  sets the property wins because the property inherits. Status components
  (Alert, Badge, Loader, Progress) have no variant or colour props; they
  consume the same context, typically as a one-element region declared on
  the component itself.
- **Layout**: how the region _arranges_ its contents. There is no layout
  attribute or hint: a grid or stacked-flex region stretches its buttons to
  full width natively, so arrangement is declared as actual layout.
- **Containers** (`container-type: inline-size`): how _big_ the region is;
  drives the fluid `cqi` tokens and Button's narrow-container full-width
  behaviour.

**The control alignment contract**: body-sized text and generous padding support
legibility and touch use. Buttons and form controls share one
derived anatomy (`padding-block: var(--loam-space-xs)` +
`font-size: var(--loam-text-md)` × `line-height: 1.5` + 1px borders), so they
height-align for single-line labels at every container width. Labels may wrap
and controls grow when content needs more room. Native inputs and textareas own
their padding so the padded area accepts taps. There are no
control-height tokens and no size props on form controls; a control that
must match this height renders Button, or adopts the same stack.
Glyph controls (Checkbox, Radio, Switch, Range) size their geometry in `em`
on a `font-size: var(--loam-text-sm)` basis, so glyphs ride the same fluid
scale as their labels.

**Numeric bounds are not size props.** The doctrine bans props that
re-encode a visual decision; it does not ban the platform's own numbers.
The exceptions, and why each is a semantic rather than a size:

| Component                              | Props                                      | What they are                                                                                                                           |
| -------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Meter`                                | `min` / `max` / `low` / `high` / `optimum` | the range and its bands, forwarded to `<meter>`; the browser picks the band, the CSS paints it                                          |
| `QuantityInput`                        | `min` / `max` / `step`                     | the count's bounds and increment, forwarded to `<input type="number">`; the buttons disable at the ends                                 |
| `Rating`                               | `max`                                      | how many stars there are, which is how many radios                                                                                      |
| `Badge`, `Loader`, `Progress`, `Meter` | `size`                                     | the one sanctioned `size`, always `"sm" \| "md" \| "lg"` emitted as `data-size`: an intrinsic glyph or track that no container can size |

### Sanctioned exceptions

Under review: these are the exceptions to the doctrine above; do not add to
this list without a maintainer ruling. Each exists today and is accepted until
a maintainer decides otherwise.

- Table `striped` / `highlightOnHover` / `withColumnBorders` / `stickyHeader`:
  display hooks, emitted as the `data-striped` / `data-hover` /
  `data-col-borders` / `data-sticky-header` attributes. The scroller's height
  cap is the public `--loam-table-block-size`, a custom property, not a prop.
- Progress `striped` / `animated`: display hooks, emitted as the
  `data-striped` / `data-animated` attributes.
- RadioGroup `orientation`: emits `data-orientation`; the layout of a set, not
  a control.
- Rating `showLabel`: emits
  `data-show-label`; whether the
  group's name is painted as well as read. Rating `readOnly` emits
  `data-read-only` for display mode.

## Adding or changing a component

Two more agent skills carry the procedure (same `.agents/skills/` install as the
CSS references above; these two are project-authored, so they are not in
`skills-lock.json`):

- [`add-component`](.agents/skills/add-component/SKILL.md): the ladder for
  deciding whether a component should exist at all, which exemplar to model it
  on, the API and CSS doctrine to hold, and the wiring that additions miss.
- [`component-review`](.agents/skills/component-review/SKILL.md): how to review
  a change, graded by which primitive it touches (a token or element style
  reaches the whole library; a component reaches only itself).

The essentials either way:

1. Style with the `--loam-*` design tokens only (see `packages/core/src/styles.css`).
2. Use semantic HTML, logical properties, and modern CSS per the standard above.
   No CSS-in-JS.
3. Keep everything accessible: correct roles, keyboard support, focus-visible rings.
4. Add or update the component's docs entry in `apps/docs/src/content/components/`.

## Recipes (`/recipes`)

Core holds primitives; the docs site's Recipes collection holds selected
compositions: heroes, cards, timelines and layouts. A recipe is copied and
changed, never installed, so
it is written as the markup a reader will paste. Each lives in
`apps/docs/src/recipes/<category>/<slug>/` as four files, and
`pnpm check:recipes` refuses one that breaks the rules below.

Recipes are grouped by purpose: Heroes, Banners, Cards, Media, Grids, Content
and Forms. A hero introduces a page, a banner promotes one message within
it, and a card represents one item. Each published recipe's `whenToUse` explains
its distinct purpose and how to choose it over nearby patterns.

Only entries enabled in `apps/docs/src/recipes/recipes.ts` are published.
Keep other entries commented out until reviewed. The generator applies this
selection to pages, previews, source and agent references; source folders and
their tests remain available.

1. **It solves a real problem.** The title and description say
   exactly what it does; the content is specific (one fictional organisation,
   Hedgerow, throughout; never lorem); siblings in a category are told apart
   at a glance. A near-duplicate is merged, not added.
2. **The markup is the deliverable.** `Recipe.tsx` is one root element
   carrying the slug as its class, core components used as they come, and
   nothing that depends on the docs page. Literal markup over data arrays and
   abstractions: a reader edits three cards, not a config object.
3. **Built the way any consumer would.** Imports are `@loamui/core`, `react`
   and `./recipe.css` only. Every rule in `recipe.css` sits inside
   `@scope (.<slug>…) to ([class*="loam-"])`; a second scope may be rooted at
   a core element to place it (grid area, flex basis, a public `--loam-*`
   property), never to change how it looks. Use tokens for design values and
   ordinary CSS for structural geometry. Container queries handle layout;
   media queries handle user preferences. A query measures an ancestor of
   the element it styles, independent of the docs preview container.
4. **The pillars in the copy.** Real elements and the element styles for bare
   markup; `:has()` detection over declared state; status through
   `--loam-context`, remembering that `primary` is the brand slot and
   neutral by default; forced colours wherever colour carries state; motion
   opt-in; every icon-only control named by hidden text; `role="list"` on a
   list whose markers are stripped.
5. **Idiomatic, current React.** `"use client"` only where the module needs
   it (client hooks or a function passed as a prop; the gate checks);
   `useId` works in a synchronous Server Component without that directive;
   no effects deriving state; `useId` for ids on a unit that repeats on a
   page; native form attributes over handlers.
6. **It says why.** `meta.ts` carries one sentence per pillar that applies,
   stating the specific judgment the example encodes, and a comment in the
   stylesheet only where it names a trap, in three lines or fewer.
7. **It proves one promise.** `recipe.test.tsx` renders, runs axe, and
   asserts the recipe's promised behaviour. Check repeated instances, narrow
   and wide plain parents, both schemes and keyboard interaction. Record
   visual and contrast checks separately; axe does not verify every pillar.

For a static composition, use [Hero with image](apps/docs/src/recipes/heroes/hero-with-image/Recipe.tsx)
and its [stylesheet](apps/docs/src/recipes/heroes/hero-with-image/recipe.css)
as the reference: scoped element selectors, an intrinsic grid, fluid tokens
resolved inside the measuring container, and core components left to own their
internals. Recipe CSS declares `@layer loamui.components` inside its donut
scope: the library's CSS orchestrator cannot assign a layer to a consumer's
stylesheet. The [background-image hero](apps/docs/src/recipes/heroes/hero-background-image/Recipe.tsx)
shows the corresponding decorative-image pattern with inherited colour scheme
and content-driven height. Keep classes for meaningful editorial roles such as
eyebrow and
lede; a class on every element is unnecessary. Adapt the heading level, content
and image delivery to the destination page.

## Before opening a PR

Run what CI runs (`.github/workflows/ci.yml`):

```bash
pnpm build
pnpm check-types
pnpm lint
pnpm lint:md
pnpm format:check
pnpm --filter @loamui/core test
pnpm --filter @loamui/core audit:contrast
```

All of them should pass cleanly. `pnpm format` fixes formatting;
`pnpm format:check` is what CI runs. `pnpm --filter @loamui/core test` runs
the a11y and interaction suites, `pnpm --filter @loamui/core audit:contrast`
checks the contrast ratio of every token pair the components use, and
`pnpm lint:md` runs the rumdl Markdown linter over the hand-authored docs.

### What the additional checks cover

- Stylelint's `loamui/scope` rule detects excluded selectors, nested type
  rules without core boundaries, and article scopes missing the prose
  boundary; `loamui/spacing` flags literal spacing in CSS. Both run with
  `pnpm lint`, so a finding shows in the editor and honours a per-line
  disable. Neither proves the rendered cascade; check embedded recipes in
  a browser against the same recipe outside the article.
- `pnpm check:spacing` reads the literal React style objects in core, the
  site and published recipes — the `.tsx` half Stylelint cannot see. Fluid
  `calc()`/`clamp()` ramps and `em` geometry are deliberate exceptions.
- `pnpm lint:prose` checks the top-level Markdown and the generated documentation
  references, plus literal TSX copy on the site. Run the documentation export
  first (`pnpm check:skill` also verifies it). The site pass normalises quotation
  typography for linting and excludes narrative movement, repeated-word,
  fragment and paragraph-length heuristics: these misclassify UI terms and API
  names. Dynamic runtime copy still needs editorial review.
- `pnpm test:checks` exercises these scanners against known failure cases.

Please use
[Conventional Commits](https://www.conventionalcommits.org/) for commit messages
(`feat:`, `fix:`, `docs:`, `refactor:`, …).

## References

The reading behind the conventions in this guide, grouped by topic. Reach for
these when a change touches an area you have not worked in before.

**Primitives (the library's shape).** The framing of a small set of primitives
that agents compose into bespoke UI:

- [JavaScript frameworks heading into 2026](https://dev.to/playfulprogramming/javascript-frameworks-heading-into-2026-2hel)

**Contextual design.** How a region declares meaning and components adapt,
built on container queries and modern colour:

- [CSS Day: Contextualism](https://css-day-2026.netlify.app/00.02-contextualism/): the paradigm itself; start here
- [Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) and [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
- Brand-on-interaction: [moderncss.ai](https://moderncss.ai/) and [npmx.dev](https://npmx.dev/)

**CSS layout modules.** Pick the module by the shape of the content, per the
[Layout guide](./apps/docs/src/app/docs/layout/page.mdx):

- [A guide to CSS layout](https://www.smashingmagazine.com/2018/05/guide-css-layout/)
- [Flow](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Flow_layout), [Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout), [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout), [Multi-column](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout/Basic_concepts)

**Rhythmic and fluid type scales.** How the type scale is tuned per container:

- [Designing with fluid type scales](https://utopia.fyi/blog/designing-with-fluid-type-scales/)
- [Utopia](https://utopia.fyi/)

**Design safety.** Small, checkable rules that keep visuals honest:

- [Safe design rules](https://anthonyhobday.com/sideprojects/saferules/)

## Releasing

The public package is `@loamui/core`; the monorepo root and docs app are private.
Use Node.js 24 and pnpm 11 for releases. Maintainers publish from `main` after
the full CI suite passes.

### First publication

An npm organization owner must grant the publishing account access to the
`loamui` scope. Enable two-factor authentication on that account, then sign in:

```bash
npm login
npm whoami
```

From the repository root, install the locked dependencies, run the full CI
suite above, and inspect the files npm will include:

```bash
pnpm install --frozen-lockfile
pnpm --filter @loamui/core build
cd packages/core
npm pack --dry-run
```

The package must contain `dist/index.js`, `dist/index.d.ts`, `dist/styles.css`,
`package.json`, `README.md`, `LICENSE` and `AGENTS.md`. Verify installation and
imports in a separate consumer project before publishing.

Publish the version in `packages/core/package.json` from that directory:

```bash
npm publish --access public
npm view @loamui/core version
```

Complete npm's browser authentication and 2FA prompts. This first publication
creates the package so its trusted publisher can be configured. Do not push
a release tag for this version: the workflow would try to publish it again.
After the registry confirms publication, update the package-availability
notices in the README and installation guides, then regenerate the skill
references with the docs build.

### Trusted publishing setup

Create a GitHub environment named `npm` in `loamui/loamui`. Restrict deployment
to release tags matching `v*` and configure any required reviewers there.
In the npm package settings, add a GitHub Actions trusted publisher with:

| Field                | Value                                       |
| -------------------- | ------------------------------------------- |
| Organization or user | `loamui`                                    |
| Repository           | `loamui`                                    |
| Workflow filename    | `release.yml`                               |
| Environment          | `npm`                                       |
| Allowed actions      | Enable direct publishing with `npm publish` |

The workflow uses OIDC authentication and provenance; no `NPM_TOKEN` secret is
needed. The repository URL in the package metadata must match this repository.
See npm's [trusted publishing guide](https://docs.npmjs.com/trusted-publishers/).

### Subsequent releases

Bump `packages/core/package.json` in a reviewed change and merge it to `main`.
From an up-to-date, clean `main` checkout, tag that commit with the matching
`vMAJOR.MINOR.PATCH` version and push the tag. For example, for version `0.1.1`:

```bash
git tag -a v0.1.1 -m "Release @loamui/core 0.1.1"
git push origin v0.1.1
```

The release workflow runs the full CI suite on the tagged commit, verifies the
tag matches the package version, builds and publishes the package. Published
versions cannot be overwritten. Prerelease tags are rejected to avoid
publishing them to npm's default `latest` channel.

By contributing you agree that your contributions are licensed under the
project's [MIT License](./LICENSE).
