---
title: Install with Vite
description: Set up LoamUI in a client-only React application built with Vite, with native CSS.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Install with Vite

Vite is a build tool, not a framework: an application built with it alone has no routing and no server rendering. [React recommends starting new applications with a framework](https://react.dev/learn/creating-a-react-app); use this guide when a client-only application is what you want. Follow [Vite’s current requirements](https://vite.dev/guide/) for your Node.js runtime.

## 1. Create the application with LoamUI

**pnpm**

```bash
pnpm dlx loamui@latest create --framework vite
```

**npm**

```bash
npx loamui@latest create --framework vite
```

**yarn**

```bash
yarn dlx loamui@latest create --framework vite
```

**bun**

```bash
bunx loamui@latest create --framework vite
```

This runs `create vite` with the React and TypeScript template, installs `@loamui/core`, replaces the template’s `src/index.css` — an unlayered reset — with the layer order, writes the welcome component and points `src/App.tsx` at it, and then runs `init`: the stylesheet link in `index.html`, Stylelint, Oxlint and Oxfmt with the composition checker and a `check` script, a LoamUI section in `AGENTS.md`, and the agent skills. Give the directory after `create`, or answer the prompt.

**Already have an application?** Run `init` in it instead:

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

`init` only adds — nothing you have is replaced — and running it again changes nothing; `--dry-run` shows the plan. It puts the layer order at the top of `src/index.css`, keeping your rules, adds the stylesheet link to `index.html`, and adds the checks, scripts and skills. Follow the [existing-project workflow](/docs/agent-workflow#establish-the-environment-first) before changing its styling foundation.

## 2. Check your first interface

`create` wrote `src/components/Welcome.tsx` with `welcome.css` beside it and rendered it from `src/App.tsx`; in an existing application, copy the [foundation example](/docs/installation#2-check-the-foundation) there and omit `"use client"`, which has no meaning here.

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

## The same setup by hand

Create a React and TypeScript project:

**pnpm**

```bash
pnpm create vite@latest my-app --template react-ts
cd my-app
```

**npm**

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
```

**yarn**

```bash
yarn create vite my-app --template react-ts
cd my-app
```

**bun**

```bash
bun create vite my-app --template react-ts
cd my-app
```

Install the package:

**pnpm**

```bash
pnpm add @loamui/core
```

**npm**

```bash
npm install @loamui/core
```

**yarn**

```bash
yarn add @loamui/core
```

**bun**

```bash
bun add @loamui/core
```

### Link the stylesheet

Add the core stylesheet to the `<head>` of `index.html`, before the application’s script:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@loamui/core@0.2.0/dist/styles.css" />
```

The browser loads tokens, element styles and component styles without sending core CSS through Vite, which avoids a parsing limitation in Lightning CSS. Do not add a JavaScript import or CSS `@import` of `@loamui/core/styles.css`. No provider is needed.

The URL is pinned to the installed version of `@loamui/core`; keep the two in step when you update. See [stylesheet delivery](/docs/installation#stylesheet-delivery) for self-hosting.

### Declare the layer order

Start `src/index.css` with the layer order, before any imports or rules that create LoamUI layers; `src/main.tsx` already imports it:

```css
@layer loamui.tokens, loamui.elements, loamui.components;
```

For a fresh application, replace the template’s styles with that declaration: they are an unlayered reset, and an unlayered rule overrides LoamUI’s element styles. Preserve existing application styles when integrating into a working project. Import recipe styles alongside their components.

The checks, scripts and skills are described in [Build with the skill](/docs/agent-workflow#project-setup).
