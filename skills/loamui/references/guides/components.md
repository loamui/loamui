---
title: Components
description: The third primitive: a small, curated set of accessible components composed from tokens and element styles.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Components

The third of LoamUI's three primitives, built on the two beneath it. [Tokens](/docs/tokens) supply the colour and scale; [element styles](/docs/element-styles) supply the native baseline. Most of a component's look is decided before its own stylesheet exists, which is why the set stays small: components add the anatomy a bare element cannot, and nothing more.

## When to reach for one

Reach for a component when a native element needs structure it does not have on its own: a field that wires a label, description and error together; a dialog that traps focus; a menu with roving keyboard focus. For everything else, the two primitives beneath already carry the styling, so you compose the rest yourself rather than installing a component for it.

## What makes a LoamUI component

- **Context decides, props don't.** Layout and tokens govern sizing; a region supplies status colour. Badge, Loader, Progress and Meter also expose `size` for intrinsic glyphs or tracks, and Input preserves the native HTML `size` attribute. A region declares its intent and the components inside adapt; the container's width decides how they size.
- **Accessible by construction.** Real semantics, keyboard support and a shared focus-visible ring come from the platform, then the component wires the ARIA the platform leaves to you.

## Compose, don't configure

Simple components such as Button and Input remain callable. Compound components expose parts where consumers need to arrange structure or behaviour; an internal wrapper does not need to become a public part. Element substitution goes through the `render` prop where supported. Button icons and loaders are children; Input accepts `startSection` and `endSection` content inside its bordered wrapper. Bespoke variants are compositions in your codebase.

```tsx
<Field.Root>
  <Field.Label>Work email</Field.Label>
  <Field.Description>We never share it.</Field.Description>
  <Field.Error>{errors.email}</Field.Error>
  <Input type="email" /> {/* self-wires */}
</Field.Root>
```

Three rules follow from it. Parts, not prop soup: `Modal.Root`, `Modal.Trigger`, `Modal.Popup`. `render` swaps the element and keeps the wiring. Form controls self-wire from the surrounding `Field`. Checkbox and Radio also accept optional `label` and `description` props for a complete row; omit them when composing labels through Field.

## Finding your way

The components are grouped by job in the sidebar: **Inputs**, **Data display**, **Feedback**, **Disclosures**, **Navigation** and **Utilities**. Every page shows live examples, the real CSS that ships, and guidance on when to use it and when not. They are low-level parts by design: a hero, a pricing table or a grid of cards is a composition you own, and the [example recipes](/recipes) are worked references for writing your own.

> Because components are built from tokens and element styles, your own components can be too. A
> scoped class on a semantic element, styled with tokens, is a component in your codebase that
> themes through the cascade and needs no library at all.

## Component namespaces

Import the component namespace and compose its parts. The package root and
component entry points expose the same components:

```tsx
import { Alert } from "@loamui/core/alert";

<Alert.Root>
  <Alert.Title>Saved</Alert.Title>
  <Alert.Description>Your changes are saved.</Alert.Description>
</Alert.Root>;
```

Compound components use an explicit `.Root`. Alert's heading, icon and dismiss
button are children: `Alert.Title`, `Alert.Icon` and `Alert.Close`.

Parts are available through their namespace, without parallel `AlertRoot` or
`AlertTitle` value exports. Use component entry points such as
`@loamui/core/modal` to control lazy-loading boundaries.

The build preserves module-level client directives. Static parts can render
on the server. Server components can compose imported client parts with
serializable props; add a client boundary to your own composition when it
needs client hooks, event handlers or render callbacks.
