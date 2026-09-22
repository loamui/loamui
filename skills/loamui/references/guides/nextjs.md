---
title: Install with Next.js
description: Set up LoamUI with Next.js App Router and native CSS.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Install with Next.js

Use Next.js App Router. Follow [Next.js’s current system requirements](https://nextjs.org/docs/app/getting-started/installation) for your Node.js runtime.

## 1. Create the application

For a new project, create an empty application without Tailwind:

**pnpm**

```bash
pnpm create next-app@latest my-app \
  --ts --app --empty --no-tailwind --no-src-dir --use-pnpm --yes
cd my-app
```

**npm**

```bash
npx create-next-app@latest my-app \
  --ts --app --empty --no-tailwind --no-src-dir --use-npm --yes
cd my-app
```

**yarn**

```bash
yarn create next-app my-app \
  --ts --app --empty --no-tailwind --no-src-dir --use-yarn --yes
cd my-app
```

**bun**

```bash
bun create next-app@latest my-app \
  --ts --app --empty --no-tailwind --no-src-dir --use-bun --yes
cd my-app
```

Already have an application? Keep its routes and configuration and go to step 2. Check the [existing-project workflow](/docs/agent-workflow#establish-the-environment-first) before changing its styling foundation.

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

`init` installs `@loamui/core`, links the stylesheet for that version in `app/layout.tsx`, creates `app/globals.css` with the layer order as its first line and imports it from the layout, adds Stylelint, Oxlint and Oxfmt with the composition checker and a `check` script, writes a LoamUI section into `AGENTS.md`, and installs the agent skills. It only adds, and running it again changes nothing; `--dry-run` shows the plan. A project with a `src` directory is detected and wired under `src/app/`.

## 3. Check your first interface

Copy the [foundation example](/docs/installation#2-check-the-foundation) into `app/page.tsx` and put its CSS alongside it. It starts with `"use client"`: the package is one client module, so compound parts such as `Field.Root` are undefined in a server component and the page fails at prerender. Keep components that render LoamUI parts on the client; the root layout stays a server component.

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

Check the interface, then stop that server and run:

**pnpm**

```bash
pnpm run build
pnpm run start
```

**npm**

```bash
npm run build
npm run start
```

**yarn**

```bash
yarn run build
yarn run start
```

**bun**

```bash
bun run build
bun run start
```

Next: [build with the skill](/docs/agent-workflow).

## The same setup by hand

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

### Load the stylesheet directly

Load the stylesheet with a `<link>` so it reaches the browser unchanged. This avoids a build-time parsing limitation in Lightning CSS, used by Next.js, which currently rejects some modern CSS syntax used by LoamUI.

Add the stylesheet link inside the `<head>` of `app/layout.tsx`. Keep the existing layout, metadata and application stylesheet import:

```tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@loamui/core@0.2.0/dist/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

The browser loads tokens, element styles and component styles without sending core CSS through the bundler. Do not add an import of `@loamui/core/styles.css`. No provider is needed.

The URL is pinned to the installed version of `@loamui/core`; keep the two in step when you update. See [stylesheet delivery](/docs/installation#stylesheet-delivery) for self-hosting.

### Declare the layer order

The `--empty` scaffold does not create `app/globals.css`. Create it with this layer order as its first line, before any imports or rules that create LoamUI layers:

```css
@layer loamui.tokens, loamui.elements, loamui.components;
```

Next.js can emit bundled recipe styles before the manual stylesheet link. This declaration keeps element defaults below component and recipe rules. A later layer declaration cannot repair an order already established.

For a fresh application, this declaration is the whole file, and the layout above imports it. Preserve existing application styles when integrating into a working project. Import recipe styles alongside their components. Check the emitted stylesheet order on a direct page load and after client navigation.

The checks, scripts and skills are described in [Build with the skill](/docs/agent-workflow#project-setup).
