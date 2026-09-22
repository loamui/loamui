---
title: Card
description: A flexible surface container.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Card

A surface container that groups related content: the one surface primitive, which compositions such as a product card or a testimonial are built on rather than restyling.

## Import

```tsx
import { Card, Button } from "@loamui/core";
```

## Usage

### Basic card

A padded surface holding a heading, text, and an action.

```tsx
<Card>
  <h3>Weekly summary</h3>
  <p>Your team shipped 12 tasks this week. Review activity and plan the next sprint.</p>
  <Button>View report</Button>
</Card>
```

### Another element

render substitutes the <div>: an <li> in a list of cards, a <label> when the whole surface is a control's label, an <article> for a self-contained piece. The class and attributes merge onto the element.

```tsx
<ul>
  <Card render={<li />}>North Field</Card>
  <Card render={<li />}>South Field</Card>
</ul>
```

## When to use it

- To group related content (a heading, supporting text, an action) onto one surface so it reads as a single unit.
- To lift a region off the page background where the boundary matters: the card is a quiet bordered surface, one fixed look.

## When not to

- As a control. Card renders a <div> with no role, focus or keyboard behaviour, and putting onClick on it creates a target keyboards and screen readers cannot reach (see below for the accessible whole-card pattern).
- Around everything on the page. When every region is a card, no region stands out, and the borders become visual noise that plain document flow would avoid.

## How it works

### A surface, not a control

Card is deliberately nothing more than a styled <div>: no role, no tabindex, no cursor. If the whole card should be clickable, the accessible pattern is one real <a> inside it (usually on the card's heading) stretched over the surface with an ::after covering the card. Keyboard users get one tab stop, screen readers get a real link with a real name, and right-click / open-in-new-tab keep working. A click handler on the div gives you none of that.

### Cards are skimmed by their headings

Screen-reader users navigate by heading; sighted users scan the same way. Start each card with one heading at the level the page's outline requires (a grid of cards under an <h2> section takes <h3>s) rather than styled bold text, so the grid is traversable without reading every card.

## Accessibility

- Renders a plain <div> with no role: all semantics come from what you put inside, so use real headings, lists and links rather than styled text.
- The card draws no focus ring of its own because it is never a focus target; interactive children keep their own :focus-visible treatment.
- Border and shadow are purely visual grouping, invisible to assistive tech, so the content must also read as a unit in document order alone.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Substitute the rendered element (render={<li />}, render={<label />}, render={<article />}); the Card's class and attributes merge onto it. |
| `...others` | `DivHTMLAttributes` | — | All native <div> props are forwarded. |

