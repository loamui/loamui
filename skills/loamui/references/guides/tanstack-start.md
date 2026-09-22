---
title: Install with TanStack Start
description: Set up LoamUI with TanStack Start and native CSS, without Tailwind or a UI kit.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Install with TanStack Start

TanStack Start is a full-stack React framework with routing, server rendering and server functions. Follow its [current setup requirements](https://tanstack.com/start/latest/docs/framework/react/getting-started) for your Node.js runtime.

## 1. Create the application

Create a blank React project:

**pnpm**

```bash
pnpm dlx @tanstack/cli@latest create my-app \
  --blank --framework React --package-manager pnpm -y
cd my-app
```

**npm**

```bash
npx @tanstack/cli@latest create my-app \
  --blank --framework React --package-manager npm -y
cd my-app
```

**yarn**

```bash
yarn dlx @tanstack/cli@latest create my-app \
  --blank --framework React --package-manager yarn -y
cd my-app
```

**bun**

```bash
bunx @tanstack/cli@latest create my-app \
  --blank --framework React --package-manager bun -y
cd my-app
```

The [blank starter](https://tanstack.com/cli/latest/docs/cli-reference) has one route and no Tailwind, shadcn, or other UI kit. No styling packages need to be removed.

Already have an application? Go to step 2, and follow the [existing-project workflow](/docs/agent-workflow#establish-the-environment-first) before changing its styling foundation.

## 2. Set up LoamUI

Run this in the application:

**pnpm**

```bash
pnpm dlx loamui@latest init
```

**npm**

```bash
npx loamui@latest init
```

**yarn**

```bash
yarn dlx loamui@latest init
```

**bun**

```bash
bunx loamui@latest init
```

`init` installs `@loamui/core`, adds Stylelint, Oxlint and Oxfmt with the composition checker and a `check` script, writes a LoamUI section into `AGENTS.md`, and installs the agent skills. For TanStack Start it reports the two cascade steps rather than editing your root route; they follow.

## 3. Link the stylesheet and declare the layer order

Add the core stylesheet before the application stylesheet in `src/routes/__root.tsx`:

```tsx
import appCss from "../styles.css?url";

// Inside the existing root route's head() result:
links: [
  { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@loamui/core@0.2.0/dist/styles.css" },
  { rel: "stylesheet", href: appCss },
],
```

Keep the existing route, metadata, other links and `HeadContent` rendering. The browser loads tokens, element styles and component styles without sending core CSS through Vite, which avoids a parsing limitation in Lightning CSS. Do not add a JavaScript import or CSS `@import` of `@loamui/core/styles.css`. No provider is needed.

The URL is pinned to the installed version of `@loamui/core`; keep the two in step when you update. See [stylesheet delivery](/docs/installation#stylesheet-delivery) for self-hosting.

Start `src/styles.css` with the layer order, before any imports or rules that create LoamUI layers:

```css
@layer loamui.tokens, loamui.elements, loamui.components;
```

For a fresh application, replace the starter styles with that declaration. Preserve existing application styles when integrating into a working project. Import recipe styles alongside their components. Check the emitted stylesheet order on a direct page load and after client navigation; a recipe must not register `loamui.components` before this order is established.

Run `npx loamui@latest doctor` to confirm both steps are in place.

## 4. Check your first interface

Copy the [foundation example](/docs/installation#2-check-the-foundation) into `src/components/Welcome.tsx` and put `welcome.css` beside it. Omit `"use client"` in this framework.

Replace `src/routes/index.tsx` with:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import Welcome from "../components/Welcome";

export const Route = createFileRoute("/")({ component: Welcome });
```

Run the development server:

**pnpm**

```bash
pnpm run dev
```

**npm**

```bash
npm run dev
```

**yarn**

```bash
yarn run dev
```

**bun**

```bash
bun run dev
```

Check the interface, then stop the server and verify the production build:

**pnpm**

```bash
pnpm run build
pnpm run preview
```

**npm**

```bash
npm run build
npm run preview
```

**yarn**

```bash
yarn run build
yarn run preview
```

**bun**

```bash
bun run build
bun run preview
```

Once the foundation works, [build with the skill](/docs/agent-workflow).
