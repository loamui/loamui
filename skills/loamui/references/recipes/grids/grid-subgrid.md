---
title: Subgrid rows
description: Three cards whose heading, description and action rows line up across the grid, whatever the length of the words, through grid-template-rows: subgrid.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Subgrid rows

Three cards whose heading, description and action rows line up across the grid, whatever the length of the words, through grid-template-rows: subgrid.

A recipe in **Grids**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Card`, `SignpostLink`, `VisuallyHidden`
- Tags: grid, subgrid, layout, cards, align
- Live: https://loamui.com/recipes/grids/grid-subgrid

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample workshops and booking destinations, including the dates and local times. State the venue and time zone in the surrounding event information. Use heading levels appropriate to that page.

## When to use

Use when cards with different amounts of text need aligned headings, descriptions and actions. Choose Asymmetric grid when one item should lead.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** A list of three items, each a card named by its h3, so the row of workshops is a list to a screen reader and each card says what it is. A measuring wrapper contains an intrinsic grid: each Card spans three parent rows and inherits them with subgrid, including the shared row gaps, and the three content regions measure their own text. The subgrid itself has no size containment, which would break row sharing, so no fixed heights or JavaScript measurements are needed.
- **Accessible.** Workshops have named list items, dates with machine-readable local date-times and booking links that include the workshop title in their accessible names. Source order stays heading, description, then action as the grid reflows.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Card](https://loamui.com/docs/components/card.md)
- [SignpostLink](https://loamui.com/docs/components/signpost-link.md)
- [VisuallyHidden](https://loamui.com/docs/components/visually-hidden.md)

## Recipe.tsx

```tsx
import { useId } from "react";
import { Card, SignpostLink, VisuallyHidden } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <div className="grid-subgrid">
      <ul role="list">
        <Card
          render={
            <li className="workshop" aria-labelledby={`${instanceId}-grid-subgrid-seed-saving`} />
          }
        >
          <div className="head">
            <h3 id={`${instanceId}-grid-subgrid-seed-saving`}>Seed saving</h3>
            <p className="when">
              <time dateTime="2026-09-19T10:00">Saturday 19 September 2026, 10am</time>
            </p>
          </div>
          <div className="description">
            <p>
              Which crops to save from first, isolation distances, and cleaning, drying and storing
              what you gather. Bring a crop you want to keep.
            </p>
          </div>
          <div className="actions">
            <SignpostLink href="/workshops/seed-saving">
              Book a place<VisuallyHidden> – Seed saving</VisuallyHidden>
            </SignpostLink>
          </div>
        </Card>
        <Card
          render={
            <li className="workshop" aria-labelledby={`${instanceId}-grid-subgrid-grafting`} />
          }
        >
          <div className="head">
            <h3 id={`${instanceId}-grid-subgrid-grafting`}>Grafting fruit trees</h3>
            <p className="when">
              <time dateTime="2027-02-06T10:00">Saturday 6 February 2027, 10am</time>
            </p>
          </div>
          <div className="description">
            <p>
              Whip-and-tongue grafting onto local rootstocks. Everyone takes home two trees on the
              rootstock of their choice, labelled and wrapped.
            </p>
          </div>
          <div className="actions">
            <SignpostLink href="/workshops/grafting">
              Book a place<VisuallyHidden> – Grafting fruit trees</VisuallyHidden>
            </SignpostLink>
          </div>
        </Card>
        <Card
          render={
            <li
              className="workshop"
              aria-labelledby={`${instanceId}-grid-subgrid-winter-pruning`}
            />
          }
        >
          <div className="head">
            <h3 id={`${instanceId}-grid-subgrid-winter-pruning`}>Winter pruning</h3>
            <p className="when">
              <time dateTime="2027-01-17T13:00">Sunday 17 January 2027, 1pm</time>
            </p>
          </div>
          <div className="description">
            <p>Apples and pears in the member orchard, in the cold, with a flask.</p>
          </div>
          <div className="actions">
            <SignpostLink href="/workshops/winter-pruning">
              Book a place<VisuallyHidden> – Winter pruning</VisuallyHidden>
            </SignpostLink>
          </div>
        </Card>
      </ul>
    </div>
  );
}
```

## recipe.css

```css
@scope (.grid-subgrid) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      container-type: inline-size;
    }

    ul {
      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-xs);
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
      list-style: none;
      margin-block: 0;
      padding: 0;
    }
  }
}

@scope (.grid-subgrid li.workshop) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      display: block grid;
      grid-row: span 3;
      grid-template-rows: subgrid;
      margin-block: 0;
      overflow-wrap: anywhere;
    }

    div.head,
    div.description,
    div.actions {
      container-type: inline-size;
    }

    div.head {
      align-content: start;
      display: block grid;
      gap: var(--loam-space-3xs);
    }

    h3 {
      margin-block: 0;
    }

    p.when {
      color: var(--loam-color-primary-strong);
      font-size: var(--loam-text-sm);
      font-weight: 600;
      margin-block: 0;
    }

    div.description > p {
      color: var(--loam-color-fg-muted);
      font-size: var(--loam-text-md);
      margin-block: 0;
      text-wrap: pretty;
    }

    div.actions {
      align-self: end;
      display: block flex;
      flex-wrap: wrap;
      gap: var(--loam-space-2xs);
      padding-block-start: var(--loam-space-3xs);
    }
  }
}
```

