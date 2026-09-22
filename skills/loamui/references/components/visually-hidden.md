---
title: VisuallyHidden
description: Name a control for assistive technology alone.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# VisuallyHidden

Text for assistive technology alone: the name of an icon-only control, the word that tells two identical buttons apart, the label a design hides.

## Import

```tsx
import { VisuallyHidden, Button, Input } from "@loamui/core";
```

## Usage

### Naming an icon-only control

The glyph is decoration and the words are the name. Nothing is visible in the button but the icon, and a screen reader reads “Remove Climbing bean seeds”.

```tsx
<Button>
  <IconTrash aria-hidden />
  <VisuallyHidden>Remove Climbing bean ‘Blue Lake’ seeds</VisuallyHidden>
</Button>
```

### Finishing a repeated name

Four buttons that all read “Add to basket” are four buttons a screen reader cannot tell apart in a list. The visible words stay short; the hidden words say which product.

```tsx
<Button>
  Add to basket
  <VisuallyHidden> — Climbing bean ‘Blue Lake’ seeds</VisuallyHidden>
</Button>
```

### Hiding a label the design leaves out

A search box whose placeholder stands in for its label visually still needs a real label. `render` swaps the span for the element the slot requires.

```tsx
<VisuallyHidden render={<label htmlFor="q" />}>Search the catalogue</VisuallyHidden>
<Input id="q" type="search" placeholder="Search…" />
```

## When to use it

- When a control's name is carried by a glyph: the icon is aria-hidden and the words are here.
- When a repeated action needs the thing it acts on, so a list of links or buttons reads apart.
- When a table's last column header, or a fieldset's legend, has no words the design will show.
- When a status needs a prefix a sighted reader gets from colour or position, such as “Error: ” before a message.

## When not to

- To hide something every reader needs. Hidden text is still in the accessibility tree, but a sighted keyboard user will tab into any link or control inside it and land somewhere they cannot see.
- As a substitute for aria-label where real text would do. Prefer this: it translates with the page, it survives reader mode, and a machine translation reaches it.
- To hide a heading purely to satisfy a document outline. If the section needs a name, give it one a reader can see, or name the landmark with aria-labelledby.
- To hold long prose. It is a name or a short phrase, not a second version of the page.

## How it works

### Clipped, not removed

The element is one pixel, clipped with clip-path and pulled back by a negative margin, so it takes no visible room but is still rendered. display: none and visibility: hidden would take it out of the accessibility tree along with the eye, which is the opposite of what this is for. white-space: nowrap keeps a long name from being broken one character per line before it is clipped.

### A span, until it is not

The default element is a <span>, which is phrasing content and so legal inside a button, a label or a heading. Where the slot needs a different element — a <legend> for a fieldset, a <label> for a control — render swaps it and the class comes along.

### Compose the appropriate element

Use VisuallyHidden for text that should remain available to assistive technology. Its render prop lets you preserve a label, legend or heading when a span is not appropriate. The loam-VisuallyHidden class remains available for existing integrations; use the component in new React compositions.

## Accessibility

- Real text rather than an aria-label: it is translated by the browser and by a translation service, and it appears in reader mode.
- The glyph beside it should be aria-hidden, or the control is named twice.
- It does not hide from the keyboard: anything focusable inside it is still a tab stop, so put no links or controls in it.
- Forced colours and zoom change nothing: there is nothing painted to lose.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The text read by assistive technology. |
| `render` | `RenderProp` | — | Render as a different element, e.g. render={<legend />}. The class and attributes merge onto it. |
| `...others` | `HTMLAttributes<HTMLSpanElement>` | — | All native <span> props are forwarded. |

