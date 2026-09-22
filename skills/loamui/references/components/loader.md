---
title: Loader
description: Indicate an ongoing process.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Loader

An animated indicator for pending, indeterminate work.

## Import

```tsx
import { Loader } from "@loamui/core";
```

## Usage

### Basic usage

The spinner is the only anatomy: one indeterminate glyph, no variant prop. Pair it with visible words that say what is loading.

```tsx
<Loader />
```

### Sizes

size is one of three tokens, emitted as data-size and answered by the stylesheet. Without it the size comes from context: 1.5rem standalone, 1em inside a Button, or whatever a region sets --loam-loader-size to.

```tsx
<Loader size="sm" />
<Loader size="md" />
<Loader size="lg" />
<span style={{ "--loam-loader-size": "3rem" }}>
  <Loader />
</span>
```

### Contexts

There is no colour prop. Declare --loam-context on a one-element wrapper region (see the Contextualism guide) and the status colours follow, or let it inherit from the region whose work it reports: a loader in a warning panel is already warning-coloured.

```tsx
<Loader />
<span style={{ "--loam-context": "primary" }}>
  <Loader />
</span>
<span style={{ "--loam-context": "success" }}>
  <Loader />
</span>
<span style={{ "--loam-context": "warning" }}>
  <Loader />
</span>
<span style={{ "--loam-context": "danger" }}>
  <Loader />
</span>
<span style={{ "--loam-context": "info" }}>
  <Loader />
</span>
```

## When to use it

- For waits of unknown duration where the shape of the outcome is also unknown: searching, saving, waiting on a third party.
- For small inline busy states, composed as a child of the affected control: a Button showing <Loader /> while it saves sizes it like an icon, no size prop needed.

## When not to

- When you know what the loaded content will look like: Skeleton holds the layout open and makes the swap calmer than a spinner in an empty region.
- When progress is measurable, use Progress with a truthful value; a spinner where a percentage exists withholds information the user could have.

## How it works

### Pair it with words

A bare spinner says something is happening but not what, or whether the user should wait. Put visible text next to it and set label to the same words. The default "Loading" turns ambiguous as soon as a page has two waits.

### Hold it back briefly

A spinner that flashes for 200ms reads as flicker, and one that appears instantly makes fast responses feel slow. Hold it back briefly (say 300ms) so quick operations complete without ever showing one; Skeleton is the better tool when the coming content's shape is known.

## Accessibility

- Renders role="status" (a polite live region), so a loader appearing in the DOM announces its label without interrupting what is currently being read.
- The label is exposed twice on purpose: as aria-label and as a visually hidden text node, so it reaches assistive tech regardless of how the role is mapped.
- The animated spinner is aria-hidden: assistive tech gets the label, never the animation structure.
- The spin exists only inside prefers-reduced-motion: no-preference; with reduced motion the glyph is a static indicator and the sr-only text still announces it, so meaning never depends on motion.
- When composed inside a Button as a busy state, add aria-hidden to the Loader and disable the button: the button's own text (“Saving”) should be the announcement, not a nested status region.

## Props

Status is not a prop: it comes from the surrounding `--loam-context` region (see the Contextualism guide).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | — | Overall size, emitted as data-size. When omitted, the size comes from context: 1.5rem standalone, 1em inside a Button (like an icon), or a region's --loam-loader-size. |
| `label` | `string` | `"Loading"` | Accessible label announced to assistive tech. |
| `...others` | `HTMLAttributes<HTMLSpanElement>` | — | All native <span> props are forwarded. |

## Custom properties

| Property | Syntax | Default | Description |
| --- | --- | --- | --- |
| `--loam-loader-size` | `CSS length` | `1.5rem` | Public sizing hook, read with inheritance: a composing component can size a loader from its own context (Button sets it to 1em for composed spinners). |

