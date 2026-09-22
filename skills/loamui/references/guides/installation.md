---
title: Installation
description: Set up LoamUI in Next.js or TanStack Start, check your first interface, then add the agent skill.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Installation

Create a framework application, install `@loamui/core`, and load its stylesheet. The stylesheet supplies tokens, element styles and component styles; no provider is needed. Then add the skill and describe what you want to build.

`@loamui/core` is available on [npm](https://www.npmjs.com/package/@loamui/core). Installing the agent skill does not install the library.

## 1. Choose your framework

Use a working framework application before adding LoamUI. These guides cover a fresh project, the package and the stylesheet setup:

- **[Next.js App Router](/docs/installation/nextjs)** — routing, server rendering and React Server Components.
- **[TanStack Start](/docs/installation/tanstack-start)** — a full-stack React framework with routing, server rendering and server functions.

The beta setup uses LoamUI as the styling foundation, without Tailwind or another global reset. [React recommends starting new applications with a framework](https://react.dev/learn/creating-a-react-app).

**Already have a project?** Check its framework, React version, CSS imports and resets first. Tailwind's presence in a manifest alone does not prove a conflict: inspect Preflight, utility classes and global rules that affect the interface. Follow the [existing-project workflow](/docs/agent-workflow#establish-the-environment-first) before changing shared styles or dependencies.

## Stylesheet delivery during the beta

The current core stylesheet uses modern CSS that the tested Next.js and TanStack Start bundlers cannot parse. For now, both framework guides load `https://loamui.com/loamui-core.css` through a stylesheet link, so the browser receives the CSS unchanged. Do not also import `@loamui/core/styles.css` through JavaScript or CSS.

This hosted URL follows the documentation deployment, not your installed package version. It requires network access and must be allowed by your site's Content Security Policy. Use it for the beta trial; a production integration should serve a version-matched copy of the installed stylesheet from its own public assets, keeping the link and layer ordering below. Do not silently switch delivery methods or alter core CSS to get a build to pass.

## 2. Check the foundation

After completing your framework guide, confirm the application builds and the LoamUI styles load. You can use this small interface to check the foundation.

Replace the starter page with this interface. Use `app/page.tsx` in Next.js or `src/components/Welcome.tsx` in TanStack Start. The TanStack guide shows how to render it from your index route. The named Field parts can be composed from a Next.js server component. Add a client directive when your composition needs client hooks or event handlers.

```tsx
import { Checkbox, Field, Input } from "@loamui/core";
import "./welcome.css";

export default function Welcome() {
  return (
    <main className="welcome">
      <h1>Welcome to LoamUI</h1>
      <p>Native HTML and components share the same foundation.</p>
      <Field.Root>
        <Field.Label>Your name</Field.Label>
        <Input name="name" autoComplete="name" />
      </Field.Root>
      <Field.Item><Field.Label><Checkbox /> Send me product updates</Field.Label></Field.Item>
    </main>
  );
}
```

Add `welcome.css` beside that file. The page owns its layout; embedded controls retain their component styles.

```css
@layer loamui.components {
  @scope (.welcome) to ([class*="loam-"]) {
    :scope {
      display: block grid;
      gap: var(--loam-space-l);
      max-inline-size: var(--loam-measure);
      padding: var(--loam-space-xl);
    }
  }
}
```

Run the development server and the production build. Check that the heading and paragraph have element styles, spacing uses the tokens, and both controls are styled. Tab to the input and checkbox, check visible focus, toggle the checkbox with Space, and try light and dark system preferences. Repeat after a direct page load and a client-side navigation.

## 3. Build with the skill

Once the application builds and the foundation works, you are ready to create your own interface. The next guide shows you how to install the skill, give your agent a first prompt, and review the result.

**Next: [Build with the skill](/docs/agent-workflow).**
