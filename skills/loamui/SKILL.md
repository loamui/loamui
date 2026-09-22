---
name: loamui
description: Set up, build, adapt recipes, theme or review UI with @loamui/core. Configure authorized project tools and compose contextual tokens, element styles and components using offline contracts and recipes. Use for LoamUI setup or UI work.
metadata:
  library: "@loamui/core"
  docs: https://loamui.com
  llms: https://loamui.com/llms.txt
---

# Using LoamUI

> Modern UI primitives for agent-assisted developers. A region declares what
> it means and the components inside adapt; you compose parts rather than
> configure props. Reach for a prop only when nothing else can express it.

## Where the truth lives

- **Live docs:** <https://loamui.com>; append `.md` to a page URL for its
  markdown twin. Index: <https://loamui.com/llms.txt>.
- **Offline copies** generated from the docs ship under `references/`.
  Start at [the index](references/index.md).
- **Read each component's reference before using it** in a session: props,
  parts, custom properties, when-to-use and accessibility contracts live there.
- The references match the library at the same commit; check the installed
  version in `node_modules/@loamui/core/package.json` if behaviour differs.
- **Recipes:** the curated `/recipes` collection contains portable React and CSS
  with design decisions. Find the relevant entry in [the reference
  index](references/index.md);
  only published recipes ship under `references/recipes/`. Verify each adaptation;
  publication is not certification. Choose by the user's
  purpose and the recipe's **When to use** guidance, then read the recipe and
  [recipe guide](references/guides/guide.md). The sections are Heroes,
  Banners, Cards, Media, Grids, Content and Forms.
  Match the recipe's purpose before adapting its appearance.

## Start by checking the environment

Read [Build with the skill](references/guides/agent-workflow.md) before
implementation. Users describe their UI; you handle setup, composition and
verification.

Before writing UI, follow [Project setup](references/guides/agent-workflow.md#project-setup):

1. Inspect the framework, installed package, CSS delivery, layer order, tools
   and active agent's skill discovery. Installing this skill installs no runtime.
   Next.js and TanStack Start currently need the linked-stylesheet workaround in
   [installation](references/guides/installation.md), not a bundled core CSS import.
2. Complete missing additive project-local setup within the build request's
   authorization: package/CSS integration, Stylelint, composition checks and
   companion skills. Explain changes; ask before replacing conflicting tools
   or styles, changing framework/browser policy, or global/CI changes. Respect
   installation limits; resolve necessary approval before composing.
3. Verify dependencies and lockfile, project-owned configuration/checker files,
   and runnable scripts covering authored paths. Scratchpad and one-off checks
   are not persistent setup. Reuse working tools; never disable them to pass.
4. Install missing companions using Project setup's exact sources and explicit
   agent targets. Do not reinstall this skill if already loaded. Verify discovery
   and read relevant guidance before writing UI, including copied recipes. State
   what you read. If refresh is needed, report installed versus active. If setup
   is blocked or declined, agree a reduced deliverable and report the gaps.

For a named recipe prompt, resolve the title in [the index](references/index.md)
and read that recipe's source and component contracts. Do not require a long
prompt or live docs when the needed references are bundled. In chat, probe
package and rendering capabilities; never fake LoamUI or claim unrun checks.

## The three primitives

1. **Tokens** (`--loam-*`): a handful of semantic decisions — four status hues,
   a primary, an accent, eight neutrals, fluid space and type scales — with
   everything else derived by recipe. Theming is overriding these.
2. **Element styles**: enhanced defaults for native HTML, page-wide. Plain
   `<h1>`, `<p>`, `<a>`, `<table>`, `<input>` are already styled, responsive,
   and light/dark aware before any component appears.
3. **Components**: a small, curated set composed from the two above. Compound
   components expose parts; appearance normally comes from regions, not props.
   Check component references for the documented exceptions below.

## The two pillars, as rules

### Modern

- **Native platform.** Use real elements for semantics and static CSS for styling.
  Use native `<button>`, `<dialog>` via `showModal()`, and `<details>` where
  their semantics fit. Native controls supply platform behaviour; preserve
  their labels and keyboard support. No CSS-in-JS or styling runtime.
- **Modern CSS.** Use scoped, additive rules, logical properties and the
  library’s responsive tokens. Use `@layer`, `@scope`, nesting, container
  queries and intrinsic layout; tokens supply `clamp()`, `oklch()` and
  `light-dark()`. Choose modern features for the problem at hand; they are
  tools, not a feature checklist. No `!important`, BEM or specificity battles.
  Put changing layout values in non-overlapping query ranges; avoid a base
  value that a breakpoint immediately overrides.
  Establish the host’s layer order before loading recipes. Limit scopes at
  embedded content so article styling cannot change a recipe’s layout.
- **Composition.** Follow each component's contract: callable components for
  simple needs, named parts for composition, `render` for supported element
  swaps. Internal markup need not be public. Button icons and loaders are
  children; Input accepts `startSection` / `endSection`.
- **Contextualism throughout the primitives.** Declare `--loam-context` on the
  region with that meaning; size follows the available space. Do not invent
  appearance props. Intrinsic display sizes and native HTML attributes are
  documented exceptions.

### Accessible

Keep semantic HTML, named controls, keyboard and focus support, and user
preferences across tokens, element styles and components. Never remove focus
rings or convey state only by colour. Use Field’s label, description, error,
control order. Show new errors after submission; clear a displayed native
constraint error when its correction is valid. Browser validity cannot resolve
server errors such as rejected credentials.

### Trust in agents: verification

Gatekeeping supports trust in generated work; it is separate from the two
pillars. Run the relevant deterministic checks and inspect the rendered result.
Report project-owned setup, companion guidance read, exact check commands and
results, and browser checks or gaps separately. Core’s automated tests and
audited palette do not certify your composition,
content or custom theme; verify them separately and report untested behaviour.

## Components

| Category     | Components                                                                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inputs       | Field, Fieldset, ErrorSummary, Button, Input, Textarea, Select, DateInput, Checkbox, Radio, Switch, Range, Search, QuantityInput, Rating, FileInput, CopyButton, Combobox, PasswordInput, SegmentedControl |
| Data display | Badge, Price, Time, Card, Avatar, Table, Separator, Carousel, Stepper                                                                                                                                      |
| Feedback     | Alert, Progress, Meter, Skeleton, Loader, Toast                                                                                                                                                            |
| Disclosures  | Details, Tooltip, Modal, Drawer, Popover, Menu                                                                                                                                                             |
| Navigation   | Tabs, SignpostLink, SkipLink, Breadcrumbs, Pagination, Nav                                                                                                                                                 |
| Utilities    | VisuallyHidden                                                                                                                                                                                             |

No layout components (use native grid, flex or flow with the space tokens), no
`Heading`/`Text` (a semantic element plus a scoped rule), no `Accordion`
(that is `Details`), no `Slider` (that is `Range`).

## How to build with it

1. **Check setup.** Follow the environment workflow above. Load core CSS once,
   before recipe styles establish layers. ESM only, no provider.
2. **Read before composing.** Read [the recipe guide](references/guides/guide.md),
   the nearest recipe and the contracts of the parts you use. Prefer installed
   types when versions differ. Consult the Modern CSS and
   Google Chrome guidance for the task. LoamUI uses Baseline Newly/Widely
   Available features natively; enhance progressively beyond that policy.
3. **Compose.** Use callable components or namespace parts such as `Alert.Root`
   and `Alert.Title`, as documented. Controls (`Input`, `Select.Root`,
   `Textarea`, `Range.Control`, `QuantityInput`, `FileInput.Control`, `Search.Input`)
   receive label/invalid wiring from `Field.Root`; message IDs register after
   hydration. Compose Checkbox and Radio with Field.Label;
   Field.Item scopes grouped options. Switch has Root, Control, Track and Thumb
   parts.
   Set Field.Root invalid explicitly; use ARIA links for initial SSR hints.
4. **Declare context, don't configure.** Wrap a region:
   `<div style={{ "--loam-context": "danger" }}>…</div>` — buttons, inputs,
   badges and checkboxes inside all adapt. Only reach for identity when it is
   genuinely identity (a brand-coloured wrapper), never per element.
5. **Lay out with native CSS.** Grid, flex, flow, or multi-column per the
   content's shape; space with `var(--loam-space-*)`; cap prose at
   `var(--loam-measure)`.
6. **Theme with tokens.** Override `--loam-*` at `:root` or on any scope;
   never touch a component's internals or its private `--_*` properties.
   A recipe may own private properties for its own state or geometry, such as
   the image comparison’s reveal position; these are not core theming hooks.
7. **Verify and repair.** Run the consuming project’s formatter, type checker,
   lint and relevant interaction tests. Render outside the docs site, in narrow
   and wide parents and with two instances. Check keyboard and focus, long copy,
   both schemes, reduced motion and forced colours; check RTL for directional
   interactions. Fix failures and repeat affected checks. Report what actually
   ran and what remains unverified; never award blanket pillar or accessibility
   conformance from imports, screenshots or an axe pass alone.
8. **Keep the deliverable portable.** Supply React and CSS plus explicit
   application integration needs. Exclude catalog metadata, preview frames,
   gallery loading and docs-only utilities. Keep real actions functional; use
   links for destinations. Do not imply a local demo persists to an account.

## Theming

Set the inputs; everything derived follows.

```css
:root {
  --loam-color-primary: oklch(45% 0.12 250);
  --loam-color-accent: oklch(70% 0.18 305);
  --loam-font: "Inter", system-ui, sans-serif;
  --loam-font-display: "Fraunces", serif;
  --loam-radius-md: 0.5rem;
}
```

Key public colour inputs are `--loam-color-{primary,accent,success,warning,danger,info}`.
Primary and status colours derive `-soft` and `-strong`; accent is a standalone
input. `--loam-color-on-strong` is text on a strong fill. The shared focus colour
is `--loam-color-ring`; there are no per-status `-ring` aliases. Surface and text
tokens include `--loam-color-{fg,fg-muted,fg-dim,bg,bg-subtle,surface,surface-hover,
line,line-strong,link,highlight}`.

Fluid spacing uses `--loam-space-{4xs,3xs,2xs,xs,s,m,l,xl,2xl,3xl,4xl}`;
fixed geometry uses `--loam-space-fixed-{1,2,4,8,12,16,24,32}`. Do not use the
removed `--loam-space-sm`, `--loam-space-md` or `--loam-space-lg` names.
Other public families are `--loam-radius-{sm..xl,full}`,
`--loam-shadow-{sm,md,lg}`, `--loam-duration-{sm,md,lg}`, `--loam-ease` and
`--loam-measure`. Full list and recipes: `references/guides/tokens.md`.

Component-level hooks are public custom properties documented per component
(e.g. `--loam-button-color`, `--loam-modal-size`, `--loam-drawer-size`,
`--loam-loader-size`), set where the component is used.

## Mistakes people make by default

Each of these has been seen in real migrations. Check your output against them.

- **Looking for `size` / `variant` / `color` props.** Do not invent them. Colour
  is a context region; size is the container; width is the parent's layout.
  Modal and Drawer width: `--loam-modal-size` / `--loam-drawer-size`. The
  exceptions are a glyph or track (`Badge`, `Loader`, `Progress`, `Meter`
  keep `size`), Input’s native HTML `size`, and the platform's own numbers
  (`Meter` bounds,
  `QuantityInput` `min`/`max`/`step`), which are semantics, not sizing.
- **`type="number"` for a count.** A count nudged by one is `QuantityInput`;
  any other number is `Input` with `inputMode="numeric"` or `"decimal"`.
- **Borrowing `loam-*` classes on raw elements** (`<a class="loam-Button">`,
  `<details class="loam-Details">`). Class names are not API. Use the
  component; it carries wiring and tests the class does not.
- **A link dressed as a button.** `Button` is for actions. Navigation that
  wants prominence is `SignpostLink`; ordinary navigation is `<a>`.
- **Duplicating Field wiring.** Let `Field.Root` supply its control’s label,
  description and error by default. Use explicit IDs or additional descriptions
  only for a real relationship, and verify the combined references. Use `useId`
  for repeated recipes, including native disclosure and radio group names.
- **Required asterisks.** Required is the unmarked default; mark the optional
  field in words with `<Field.Label optional>`.
- **Error copy like "This field is required" or "Please enter a valid…".**
  Say what happened and how to fix it, in the words of the question:
  "Enter your email address", "Select a country". No "please", "invalid",
  "required", or error codes.
- **Input's wrapper.** `className`, `style` and `ref` target the native input;
  `wrapperProps` targets its bordered box.
- **Reset-then-restyle.** Do not add a CSS reset or zero every margin — the
  element styles are the baseline. Build on them.
- **`!important`, BEM, physical properties, viewport units for sizing.** The
  library uses none; neither should styles around it.
- **A `Heading` or `Text` component.** Typography is domain-specific:
  `@scope (h1.headline) { :scope { font-family: var(--loam-font-display) } }`.

## Worked references

- First component: `references/guides/installation.md`.
- A composed form: `references/recipes/forms/sign-in-with-errors.md`.
- Regions, identity, and the size of the space:
  `references/guides/contextualism.md`.
- Tokens, derivation, and dark mode: `references/guides/tokens.md`.
- Every component's usage, parts, props, custom properties, when-to-use and
  accessibility notes: `references/components/<slug>.md`.

For responsive layouts, keep the measuring container outside the queried element
and name queries that must measure a particular recipe region. Structural
geometry and zero values remain ordinary CSS. A native-only recipe using tokens
and element styles is valid; imports and status regions must serve a purpose.
