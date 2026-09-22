---
name: add-component
description: The procedure for adding or scaffolding a new LoamUI component so it matches the library's philosophy and passes the gates. Use this skill whenever the user asks to add, create, scaffold, or build a new component in @loamui/core — or to turn a pattern into a reusable part. It covers deciding whether the component should exist at all, which existing component to model, the API and CSS doctrine to hold, the wiring that low-risk additions usually miss, and how "done" is proven.
metadata:
  internal: true
  tags: loamui, component, scaffolding, primitives, composition, contextualism, accessibility, gates
---

# Adding a LoamUI component

> A new component is a promise the library has to keep forever. Earn it:
> argue yourself out of it first, then build it in the library's shape.

**Ground yourself before writing code.** Read the two pillars (Modern and Accessible) in
[`README.md`](../../../README.md) — they are the direction for every decision
below — and load two companion skills for the craft:

- **`modern-css`** — for all CSS authoring (`@layer`, `@scope`, `oklch()`,
  `light-dark()`, container queries, fluid `clamp()`). This skill does **not**
  restate those rules; follow `modern-css`.
- **`modern-web-guidance`** — search it first for any UI pattern
  (`npx -y modern-web-guidance@latest search "<query>"`) to check for a
  standardized platform approach before hand-rolling one.

The doctrine below lives in full in [`README.md` → Standards](../../../README.md)
and [`CONTRIBUTING.md`](../../../CONTRIBUTING.md); this skill is the _procedure_
for applying it.

## Step 1 — Should it exist at all?

Work down this ladder and stop at the first rung that answers the need. A new
component is the last resort, not the first.

1. **Is it composition of existing parts?** Then it's a usage example or a
   consumer's wrapper, not a library component.
2. **Is it a native element the element-styles layer already dresses?** Then a
   scoped rule on a semantic element (see the Typography guide's "components are
   yours to name"), not automatically a React wrapper. A public part needs a
   consumer composition use case; internal markup and CSS selectors alone do
   not justify one.
3. **Is it a value?** Then a token, not a component.
4. **Does it genuinely need a new primitive** (a token or an element style)?
   That is the highest bar and needs a recorded ruling — components adapt to
   primitives, never the reverse.

Even when the answer is a genuine component, check it belongs in _core_: LoamUI
holds low-level primitives, so a component that would need per-project structural
overrides (spacing, layout, DOM shape) to be reused is a downstream recipe, not a
core primitive. Token overrides are fine — that is theming; structural overrides
are the smell.

Precedents that were deliberately _not_ built (cite them when pushing back):
no spacer (`gap` replaced spacers), no `Heading`/`Text` (typography is
domain-specific and yours to name), no layout components (compose native CSS
modules), and no appearance props beyond the documented exceptions. Name what
you do build for the HTML element it's built on, not a design-system alias — `Range`
(`<input type="range">`), not `Slider`; `Details` (`<details>`), not `Accordion`.

## Step 2 — Read the primitives first

Read `src/tokens.css` and `src/elements.css`. Native controls already wear the
component recipes, so most of a component's styling is inherited — write only
what the platform doesn't give you. If you find yourself re-deriving a value
the tokens already hold, stop.

## Step 3 — Model it on an exemplar

Copy the structure of the closest existing component rather than inventing one:

| Shape                                                   | Model                                     |
| ------------------------------------------------------- | ----------------------------------------- |
| Form control (self-wires from `Field`)                  | `Input`, `Select.Root`, `Textarea`        |
| Native choice with independently composed text          | `Checkbox` or `Radio` inside `Field.Item` |
| A set participating via context (never `cloneElement`)  | `RadioGroup`+`Radio`, `Tabs`              |
| Compound overlay (Root/Trigger/Popup parts)             | `Modal`, `Popover`, `Menu`, `Drawer`      |
| Native disclosure                                       | `Details`                                 |
| Display element that keeps `size`                       | `Badge`, `Loader`, `Progress`, `Meter`    |
| Composed from other components, behind the donut        | `Search`, `QuantityInput`, `CopyButton`   |
| Text derived by `Intl` from a value (`<time>`, a price) | `Time`, `Price`                           |

## Step 4 — Hold the API and CSS doctrine

Non-negotiables (full reasons in the README Standards section):

- **No `size`/`variant`/`color`/`fullWidth` props.** Size comes from container
  queries and fluid tokens; status colour from a `--loam-context` region; width
  from the parent's layout. Exception: display components that size intrinsic
  content keep `size` (Badge, Loader, Progress, Meter). Numeric bounds are not
  size props: Meter's `min`/`max`/`low`/`high`/`optimum` and QuantityInput's
  `min`/`max`/`step` are the platform's own semantics, forwarded as attributes
  (the table in CONTRIBUTING → "Numeric bounds are not size props").
- **Every default string is overridable.** An `aria-label`, a "Copied" status,
  a button's name: a prop or children with an English default, never a
  hard-coded string, so a page in another language passes its own.
- **Compose where consumers need control.** Simple components remain callable;
  compound components expose meaningful parts. Element swap goes through
  `render` where supported. Button icons and loaders are children; Input accepts
  `startSection` and `endSection` content. Controls self-wire from `Field`.
  Checkbox and Radio accept optional `label` and `description` content;
  omit those props when composing their text with Field.Label. Field.Item
  gives each grouped option independent associations. Switch exposes Root,
  Control, Track and Thumb while the input remains native. Avatar composes
  Root, Image and Fallback with explicit child content. Field validation is
  explicit through Root invalid; message IDs register after hydration, with
  explicit ARIA links for initial server associations.
- **Public parts need a purpose.** Expose structure or behaviour consumers need
  to arrange. Internal wrappers and decoration can remain implementation
  details; do not generate a part for every styled element.
- **Scope, don't BEM.** One `loam-` class on each scope root; parts are type
  selectors or short classes. **Add the donut** (`@scope (root) to
([class*="loam-"])`) whenever the scope hosts foreign content (children, a
  composed icon, a nested component) — a bare descendant type selector without
  it leaks into what it hosts. Target elements directly; never `:where()` to
  name a part.
- **Custom properties:** `--_name` is private to the component; `--loam-name` is
  public API (promote with an inherited fallback). Never set another
  component's `--_`.
- **The re-answer trap:** if the component reads `--loam-context`, re-answer
  _every_ derived token it needs (rings, `-strong` fills) inside each context
  block — a token derived at `:root` bakes in the root value. Checked/filled
  controls use the `-strong` family so they hold 3:1 in every context.
- Colour is `oklch()`/`light-dark()`/`color-mix()`; motion is opt-in via
  `@media (prefers-reduced-motion: no-preference)`; state carried by background
  paint gets a `@media (forced-colors: active)` treatment in system colours.
- **React 19:** `ref` is a normal prop declared last; no `forwardRef`; render
  context as `<Context value>`; effects only synchronise with external systems.

## Step 5 — The wiring checklist (where additions actually break)

The CSS and TSX are the easy part; these are the steps low-risk additions miss:

- [ ] Export the callable component or compound namespace and public types from
      `src/index.ts`.
- [ ] Add the component's `@import` (with `layer()`) to `src/styles.css` — this
      is what loads it in Storybook/dev **and** what `scripts/build-css.mjs`
      scans (it warns if the import is missing).
- [ ] The component `.css` declares **no `@layer`** (the build assigns it, and
      throws if the file declares one).
- [ ] `<Name>.stories.tsx` — `tags: ["autodocs"]`, a meta `description`, and a
      `play`/interaction test; single-concept demos.
- [ ] A docs content file — registered in the registry and `site/nav.ts` (right
      category), with code-tab ↔ preview parity — carrying real UX guidance: when
      to use the component, when _not_ to, and the reasoning behind its defaults.
      Distil that from long-established practice (GOV.UK, Polaris) but state it on
      the library's own authority; the guidance _is_ the differentiator, not
      filler, and a component page never names those sources — a page about a
      Button should not borrow someone else's authority for its own advice. The
      marketing and overview pages are the exception: there, citing what the
      accessibility pillar is distilled from is a credibility signal, and the
      attribution is deliberate.
- [ ] **Use one public export shape.** Compound implementations use prefixed
      names internally, re-exported as `Root`, `Control` and other parts from
      `index.parts.ts`. Expose that namespace with `export * as Name` from the
      component index and add its subpath to `package.json` exports. Do not
      also publish prefixed part values, attach parts to functions or collect
      them in runtime objects. Standalone components remain callable.
- [ ] **Preserve client boundaries.** Modules using client hooks or creating
      event handlers declare `"use client"`. Static parts remain server-compatible;
      server compositions can render named client parts with serializable props.
      Consumer hooks and callbacks belong in a client module.
- [ ] Every default string (an `aria-label`, a status, a button's name) is a
      prop or children, documented in the props table with its default.
- [ ] If it introduces a new colour pairing, add a check to
      `scripts/contrast-audit.mjs`.

## Adding an example instead

If the ladder in Step 1 ends at "composition of existing parts", the thing is
not a component: it is an example, a section built from core the way any
consumer would and copied rather than installed. Examples live in
`apps/docs/src/recipes/<category>/<slug>/` as four files (`Recipe.tsx`,
`recipe.css`, `meta.ts`, `recipe.test.tsx`) and are held to the seven
rules in [CONTRIBUTING → Recipes](../../../CONTRIBUTING.md#recipes-recipes): a
real problem solved honestly; the markup is the deliverable; built the way any consumer
would (core imports only, the donut, tokens, core parts never restyled); the
pillars in the copy; idiomatic current React; it says why in `meta.ts`; it
proves one promise in its test. Model a new one on `forms/sign-in-with-errors`
or `cards/article-card`, run `pnpm --filter @loamui/docs build-recipes`
so the registry picks it up, and `pnpm check:recipes` refuses anything that
breaks the rules. Only when an example needs behaviour that is not an
arrangement (a carousel's paging, a nav's dropdown) does a new core primitive
follow, through Steps 1 to 6.

## Step 6 — Done means gates + eyes

Run the full suite and believe it, then verify what no tool can:

```
pnpm -r lint · pnpm lint:md · pnpm -r exec tsc --noEmit
pnpm --filter @loamui/core test · pnpm --filter @loamui/core test:package · pnpm format:check
pnpm --filter @loamui/core audit:contrast
pnpm --filter @loamui/core build-storybook · PAGES=true pnpm -r build
```

(`pnpm lint:md` is a root script — `-r lint` does not include it.)

- Screenshot the component in **both** colour schemes; add a contexted-region
  shot for anything that claims to adapt. Claims about rendered output are
  falsifiable — falsify them.
- **The docs serve a synced static copy of the library CSS.** While `pnpm dev`
  runs, watchers keep it fresh (`build-css --watch` → `sync-css --watch`); if dev
  isn't running, rebuild core (`pnpm --filter @loamui/core build`) before judging
  docs output, or a stale copy will hide your change.
- Call out any new convention or ruling — and anything that needs maintainer
  sign-off — in your PR description, with the reasoning behind it.
