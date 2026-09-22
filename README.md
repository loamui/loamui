# LoamUI

[![npm](https://img.shields.io/npm/v/@loamui/core.svg)](https://www.npmjs.com/package/@loamui/core)
[![license](https://img.shields.io/npm/l/@loamui/core.svg)](./LICENSE)

**Modern UI primitives for agent-assisted developers.**

LoamUI combines contextual tokens, enhanced native element styles and composable
React components to help you build bespoke interfaces. Its foundations follow
[Google Chrome's Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance)
and established accessibility and UX practices. An accompanying agent skill
teaches those foundations, component APIs and worked recipes to your coding agent.

[Documentation](https://loamui.com/) ·
[Live recipes](https://loamui.com/recipes/) ·
[Agent workflow](https://loamui.com/docs/agent-workflow)

## Install

```bash
npm install @loamui/core
```

Use a **React 19 application with ESM support**. Load the stylesheet as well as
installing the package; no LoamUI provider is needed. Follow the setup guide for
[Next.js App Router](https://loamui.com/docs/installation/nextjs) or
[TanStack Start](https://loamui.com/docs/installation/tanstack-start).

**Stylesheet delivery matters.** The tested framework bundlers cannot parse
some of the modern CSS LoamUI uses, so the guides deliver it unchanged through
a `<link>`. For production, serve a version-matched copy of the installed
`node_modules/@loamui/core/dist/styles.css` file from your application's public
assets. The hosted stylesheet used in the guides follows the docs deployment
and is unversioned. Follow the [installation guide](https://loamui.com/docs/installation)
for delivery and cascade-layer order before using the example below.

## Import components and parts

```tsx
import { Alert } from "@loamui/core/alert";
import { Modal } from "@loamui/core/modal";
```

Compound components are ES module namespaces: compose `Alert.Root`,
`Alert.Title` and `Alert.Description`, or `Modal.Root` and `Modal.Trigger`.
Every compound component has an explicit `.Root`; the namespace itself is
not a component. The package root also exports these namespaces.

Standalone components such as `Button` and `Input` are callable. Compound
parts are accessed through their namespace, without parallel `AlertRoot` or
`AlertTitle` value exports. Prefer component entry points when controlling
lazy-loaded chunks.

JavaScript ships as separate ES modules with client boundaries preserved.
Static components can render on the server; interactive parts declare their
own client boundary. Styles remain one complete stylesheet.

## Three primitives, working together

- **Tokens** describe colour, typography, spacing and motion through `--loam-*`
  CSS custom properties. Override them at the page or region level to theme
  your interface. Context and container queries let descendants adapt to their
  surroundings.
- **Element styles** give native HTML a shared foundation across the page:
  headings, links, forms, tables and more. Start with semantic markup; it already
  participates in the design.
- **React components** add structure and behaviour where needed: form fields,
  dialogs, navigation and feedback. Compound components expose named parts such
  as `Field.Root` and `Field.Label`, so you control the markup and composition.

Use these primitives to build interfaces specific to your product. Larger
compositions, such as heroes and article cards, live in the
[recipes](https://loamui.com/recipes/), where you can inspect, copy and adapt
their React and CSS.

## Set context once

A region declares its intent and the components inside respond. After loading
the stylesheet, this example combines native HTML with two React components:

```tsx
"use client";

import type { CSSProperties } from "react";
import { Badge, Progress } from "@loamui/core";

export function UploadStatus() {
  return (
    <section style={{ "--loam-context": "info" } as CSSProperties}>
      <h2>Your photos</h2>
      <p>Keep this page open until the upload finishes.</p>
      <Badge.Root>In progress</Badge.Root>
      <Progress value={60}>Uploading photos</Progress>
    </section>
  );
}
```

The heading and paragraph use the element styles. The badge and progress fill
pick up the region's `info` colours, without a colour prop on either component.
`Progress` renders a native `<progress>` element and uses its visible label as
its accessible name.

This is LoamUI's contextual approach: status comes from a surrounding region,
fluid sizing responds to containers, and width comes from your layout. Public
CSS tokens provide the theming surface. Light and dark colours follow
`color-scheme`; you can also set `data-theme="light"` or `data-theme="dark"`
on `<html>`.

## Two pillars

**Modern.** Use the web platform's own semantics and behaviour, with ordinary
React for component logic and static CSS for styling. Cascade layers, `@scope`,
`light-dark()` and container queries carry the styling without a JavaScript
styling runtime. The CSS follows the [ModernCSS](https://moderncss.ai/) rules
alongside Google's Modern Web Guidance.

**Accessible.** Labels, keyboard interaction, focus, contrast and user
preferences inform all three primitives. Component documentation explains when
to use a pattern, when to choose something else, and the UX reasoning behind
its defaults. The library checks contrast, automated accessibility and
interactions in its test suite; your content and compositions still need
verification in the application.

LoamUI targets modern browsers. Baseline Widely and Newly Available features
are used natively, without polyfills; features outside Baseline must follow the
project's progressive-enhancement policy. See the
[browser support policy](https://github.com/loamui/loamui/blob/main/CONTRIBUTING.md#browser-support-policy)
when assessing support for your users.

## Build with an agent

Once your application is set up, install the LoamUI skill in the project:

```bash
npx --yes skills@latest add loamui/loamui \
  --skill loamui --agent claude-code --yes
```

For Codex, replace `claude-code` with `codex`. Open a new agent session and
confirm the skill is available. Installing the skill is separate from
installing the npm package.

Describe the interface you need, or start with a recipe's **Build with the
LoamUI skill** prompt. The skill guides the agent through inspecting your
project, choosing primitives, adapting a composition and verifying the result.
It bundles component references and recipes for offline use. The
[agent workflow](https://loamui.com/docs/agent-workflow) covers companion skills,
project checks and browser verification.

You can also use LoamUI directly without an agent. For tools that read online
documentation, [llms.txt](https://loamui.com/llms.txt) indexes the documentation;
each page has a markdown twin at the same URL with `.md` appended. The npm
package includes an `AGENTS.md` summary of the consumer conventions.

## Contribute

This is a pnpm and Turborepo monorepo. Use Node.js 22.13 or later and pnpm 11.

- [`packages/core`](./packages/core): the published `@loamui/core` library.
- [`apps/docs`](./apps/docs): the documentation site and live examples.
- [`apps/docs/src/recipes`](./apps/docs/src/recipes): the worked recipes.

```bash
pnpm install
pnpm build
pnpm dev
```

Run `pnpm --filter @loamui/core storybook` for the component workbench.
See [CONTRIBUTING.md](./CONTRIBUTING.md) for API and CSS conventions, required
checks and the release process.

The repository's `.agents/skills/` directory contains contributor procedures:
`add-component`, `component-review`, `modern-css` and `modern-web-guidance`.
These support work on the library itself; the installable `loamui` skill above
supports work in consumer applications.

## Standards

Conventions the linters can't check, stated with their reasons. The
deterministic layer (stylelint, oxlint, oxfmt, the contrast audit, CI) is
the authority for everything it covers: run it and believe it.

- **API.** No `size`, `variant`, `color`, or `fullWidth` props: size comes from
  container-relative tokens and container queries, status colour from a
  `--loam-context` region, width from the parent's layout. A prop would
  re-encode a decision the surrounding design already made. (Display components
  that size an intrinsic glyph or track (Loader, Badge, Progress, Meter) keep
  `size`; Modal sizes to its content, with `--loam-modal-size` as the public
  override, and Drawer's panel width is the public `--loam-drawer-size`
  property. Numeric bounds are not size props: Meter's
  `min`/`max`/`low`/`high`/`optimum` and QuantityInput's `min`/`max`/`step` are
  the platform's own semantics, forwarded as attributes.) A
  component is named for the HTML element it's built on, not a design-system
  alias: `Range` (`<input type="range">`), not `Slider`; `Details`
  (`<details>`), not `Accordion`.
- **Scope.** The library holds low-level primitives; a component that would need
  per-project structural overrides to be reused is a downstream recipe, not a
  core primitive. Token overrides are the sanctioned theming surface; overriding
  spacing, layout or structure is the smell that says a component is too
  specific to live here. Larger sections live as worked recipes on the docs
  site: product-specific compositions to study and adapt, built on core the
  way any consumer would, and held to the same pillars and gates.
- **Composition.** Simple components remain callable; compound components expose
  parts where consumers need control, without making every internal element
  public. Element swap goes through `render`, Button icons and loaders are
  children, and Input accepts `startSection` and `endSection` content inside
  its wrapper. Avatar composes Root, Image and Fallback; Switch exposes Root,
  Control, Track and Thumb. Controls self-wire from Field; compose labels and
  messages through Field, use its Item part for independent option associations,
  and set validation explicitly with Root `invalid`.
- **CSS.** Selectors are `@scope`d, not BEM: one `loam-` class per root, parts
  by element type or short class. A scope that hosts foreign content is fenced
  with a donut (`to ([class*="loam-"])`). Refer to elements directly, with no
  `:where()` to name a part. `--_name` is private, `--loam-name` is public.
  No `!important`, ever: stylelint bans it, and everything wins through
  layers. Follow the `modern-css` skill for authoring.
- **Colour & motion.** All colour is `oklch()` / `light-dark()` / `color-mix()`.
  Enumerated token pairs are contrast-audited in CI (4.5:1 text, 3:1 non-text, both
  schemes); contexted checked and filled controls use the `-strong` family so
  they hold contrast in every context. Motion is opt-in via
  `prefers-reduced-motion: no-preference`; state carried by background paint
  gets a `forced-colors` treatment in system colours.
- **React.** React 19 only. `ref` is an ordinary prop (declared last); no
  `forwardRef`. Context renders as `<Context value>`. Effects synchronise with
  external systems only.
- **Documentation.** Every component earns more than a name and a code sample:
  when to use it, when _not_ to, and the reasoning behind its defaults, the UX
  judgment distilled from long-established accessibility and design-system
  practice, written as _why_, not just _what_. This guidance is the library's
  differentiator, so it ships with the component, not as an afterthought. A
  demo's code tab shows exactly what its preview renders, and a demo proves the
  claim in its description.
- **Voice.** Error messages say what happened and how to fix it, in the words of
  the question ("Enter your first name"), never "invalid", "required", or an
  error code. Prose speaks on the library's own authority: normative references
  (WCAG, ARIA APG, Baseline) are welcome; external design-system names and
  unmeasured claims are not.
- **Verification.** Nothing is done until the full gate suite passes and any
  visual change is confirmed with headless screenshots in both colour schemes.

## License

[MIT](./LICENSE) © Danger Farms
