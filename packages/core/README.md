# @loamui/core

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

## Source and feedback

Find the source in the [LoamUI repository](https://github.com/loamui/loamui).
Report bugs or suggest improvements through
[GitHub issues](https://github.com/loamui/loamui/issues).

## License

[MIT](https://github.com/loamui/loamui/blob/main/LICENSE) © Danger Farms
