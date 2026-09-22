---
title: Badge
description: Compact status or label pill.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Badge

A compact pill for statuses, counts, and labels.

## Import

```tsx
import { Badge } from "@loamui/core";
```

## Usage

### Contexts

Badges are neutral by default. There are no variant or colour props: declare --loam-context on a one-element wrapper region (see the Contextualism guide) and the status colours follow, or let it inherit from a larger region. Badge keeps a size prop because it sizes an intrinsic glyph, the one exception the library makes for display components (Badge, Loader, Progress).

```tsx
<Badge.Root>
  <Badge.Text>Neutral</Badge.Text>
</Badge.Root>
<span style={{ "--loam-context": "primary" }}>
  <Badge.Root>
    <Badge.Text>Primary</Badge.Text>
  </Badge.Root>
</span>
<span style={{ "--loam-context": "success" }}>
  <Badge.Root>
    <Badge.Text>Success</Badge.Text>
  </Badge.Root>
</span>
<span style={{ "--loam-context": "warning" }}>
  <Badge.Root>
    <Badge.Text>Warning</Badge.Text>
  </Badge.Root>
</span>
<span style={{ "--loam-context": "danger" }}>
  <Badge.Root>
    <Badge.Text>Danger</Badge.Text>
  </Badge.Root>
</span>
<span style={{ "--loam-context": "info" }}>
  <Badge.Root>
    <Badge.Text>Info</Badge.Text>
  </Badge.Root>
</span>
```

### Sizes

size is one of three tokens, emitted as data-size: the type step, with the pill's geometry in em on it. It is the one size prop the library keeps for display components, because a pill is an intrinsic glyph that no container can size.

```tsx
<Badge.Root size="sm">
  <Badge.Text>Small</Badge.Text>
</Badge.Root>
<Badge.Root size="md">
  <Badge.Text>Medium</Badge.Text>
</Badge.Root>
<Badge.Root size="lg">
  <Badge.Text>Large</Badge.Text>
</Badge.Root>
```

### Status icons

An icon before the label takes the region's colour along with the pill, so a status reads before the word does. It is aria-hidden decoration: the word carries the state, and Draft has no context, so it stays neutral.

```tsx
<span style={{ "--loam-context": "success" }}>
  <Badge.Root>
    <IconCircleCheck aria-hidden />
    <Badge.Text>Live</Badge.Text>
  </Badge.Root>
</span>
<span style={{ "--loam-context": "warning" }}>
  <Badge.Root>
    <IconClock aria-hidden />
    <Badge.Text>Pending</Badge.Text>
  </Badge.Root>
</span>
<span style={{ "--loam-context": "danger" }}>
  <Badge.Root>
    <IconCircleX aria-hidden />
    <Badge.Text>Offline</Badge.Text>
  </Badge.Root>
</span>
<Badge.Root>
  <IconPencil aria-hidden />
  <Badge.Text>Draft</Badge.Text>
</Badge.Root>
```

### As a link

A badge is not a control, but a tag can be a link to everything tagged the same way. render substitutes the element and the pill stays; the link role, focus and keyboard behaviour come from the <a>.

```tsx
<span style={{ "--loam-context": "info" }}>
  <Badge.Root render={<a href="#tag-design" />}>
    <Badge.Text>design</Badge.Text>
  </Badge.Root>
</span>
```

### Icons (composed as children)

No leftSection / rightSection props: an svg child is detected via :has(svg) and gets a gap and 1em sizing, exactly like Button.

```tsx
<span style={{ "--loam-context": "success" }}>
  <Badge.Root>
    <IconCheck aria-hidden />
    <Badge.Text>Verified</Badge.Text>
  </Badge.Root>
</span>
```

## When to use it

- To label a record with its status or category at a glance: one or two words sitting next to the thing they describe, readable without reading the row.
- For small counts and metadata (unread messages, item totals) where a full sentence would drown the signal.
- With an icon for presence and liveness (“Live”, “Offline”): the icon takes the region's colour along with the pill, so the state reads even before the word.

## When not to

- As a click target for an action. Badge renders a plain <span> with no role, focus or keyboard handling. A tag that navigates is render={<a href />}; a status that triggers something is a Button beside it.
- For sentences or long labels. The pill is white-space: nowrap, so long text will not wrap; it is built for one or two words.

## How it works

### One or two words

A badge is metadata absorbed at a glance while scanning past it. The moment the label needs a verb it has become content, and content belongs in text the eye is meant to stop on. The nowrap styling enforces this: prose in a badge will not fit.

### Never interactive

The rendered element is a span with no interactive semantics, and that is deliberate: a status is a fact, not an affordance. An onClick on it creates a control that keyboards and screen readers cannot find. The one interactive badge is a link, because a tag can lead to everything it tags: render={<a href />} keeps the pill on a real <a>. An action belongs on a Button beside it.

## Accessibility

- Renders a plain <span> with no role and no focus behaviour: screen readers announce it as ordinary inline text, exactly what a label should be.
- A status icon is aria-hidden decoration, so the visible word must carry the state on its own (“Live”, not a bare green glyph). It is drawn in currentColor, which system colours replace, so it survives forced-colours mode where background paint is stripped.
- The context colours the pill but is never announced. Assistive tech hears only the text, so never let colour be the only difference between two badges.
- The label is not the raw status colour: it is mixed toward black (light scheme) or white (dark) so it keeps contrast on the pill's own tint in both schemes.

## Parts

### Badge.Root

The pill. Holds a Badge.Text and, on either side of it, any icon children — the markup says which side.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control size: the type step, with the pill's geometry in em on it. |
| `render` | `element \| (props) => node` | — | Substitute the element (render={<a href=… />} for a tag that is a link); the Badge's class and attributes merge onto it. |
| `children` | `ReactNode` | — | A Badge.Text, and any composed icons beside it. |
| `...others` | `SpanHTMLAttributes` | — | All native <span> props are forwarded. |

### Badge.Text

The label. A real element rather than a bare text node, so the pill can let it shrink and truncate; bare text in the flex row is an anonymous item and can do neither. Native <span> props are forwarded.

