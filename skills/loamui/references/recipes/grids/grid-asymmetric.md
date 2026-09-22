---
title: Asymmetric grid
description: A 2:1 grid: a tall lead card with a photograph in the wide column and two cards stacked beside it, all in one column when narrow.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Asymmetric grid

A 2:1 grid: a tall lead card with a photograph in the wide column and two cards stacked beside it, all in one column when narrow.

A recipe in **Grids**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Card`, `SignpostLink`
- Tags: grid, layout, cards, lead, columns
- Live: https://loamui.com/recipes/grids/grid-asymmetric

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample notices and destinations, and adjust heading levels to the page. Keep the lead item first in the source. Change the responsive image sources and alt description together.

## When to use

Use to give one item prominence beside two supporting items while preserving reading order. Choose Subgrid rows when equal items need their content aligned.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** A list of three articles, each named by its own h3, so the grid is a list to a screen reader and each card a named piece; no wrapper element exists only to be a column. A named outer container measures the list, and mutually exclusive queries switch between one column and a 2:1 layout at 44rem while retaining source order; each Card measures its own content, and scoped rules in loamui.components arrange it without changing the surface.
- **Accessible.** The photograph carries real alt text because a picture of the orchard is what the lead is about; the actions are links because each goes somewhere, and every card's action sits at its foot so the eye finds it in the same place three times.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Card](https://loamui.com/docs/components/card.md)
- [SignpostLink](https://loamui.com/docs/components/signpost-link.md)

## Recipe.tsx

```tsx
import { useId } from "react";
import { Card, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <div className="grid-asymmetric">
      <ul role="list">
        <li className="lead">
          <Card render={<article aria-labelledby={`${instanceId}-grid-asymmetric-lead`} />}>
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/646/1200/800"
                alt="A person walking between young orchard trees in low sunlight"
                width="1200"
                height="800"
                loading="lazy"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/646/400/267 400w, https://picsum.photos/id/646/800/533 800w, https://picsum.photos/id/646/1200/800 1200w"
              />
              <h3 id={`${instanceId}-grid-asymmetric-lead`}>September at the nursery</h3>
              <p>
                The plant sale opens on the first Saturday, the last of the summer seed comes off
                the bench, and the field walks move to the afternoon as the light shortens.
                Bare-root orders open on the fifteenth.
              </p>
              <div className="actions">
                <SignpostLink href="/news/september">Read the month’s notes</SignpostLink>
              </div>
            </div>
          </Card>
        </li>
        <li>
          <Card render={<article aria-labelledby={`${instanceId}-grid-asymmetric-sale`} />}>
            <div className="body">
              <h3 id={`${instanceId}-grid-asymmetric-sale`}>Plant sale</h3>
              <p>
                Member-grown perennials, herbs and the last vegetable plugs, on the bench from nine
                on Saturday 5 September.
              </p>
              <div className="actions">
                <SignpostLink href="/events/plant-sale">What is on the bench</SignpostLink>
              </div>
            </div>
          </Card>
        </li>
        <li>
          <Card render={<article aria-labelledby={`${instanceId}-grid-asymmetric-swap`} />}>
            <div className="body">
              <h3 id={`${instanceId}-grid-asymmetric-swap`}>Seed swap</h3>
              <p>
                Bring what you saved and take what you need, first Sunday of the month. Labels and
                envelopes are on the table.
              </p>
              <div className="actions">
                <SignpostLink href="/events/seed-swap">How the swap works</SignpostLink>
              </div>
            </div>
          </Card>
        </li>
      </ul>
    </div>
  );
}
```

## recipe.css

```css
@scope (.grid-asymmetric) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      container: grid-asymmetric / inline-size;
    }

    ul {
      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-xs);
      list-style: none;
      margin-block: 0;
      padding: 0;
    }

    li {
      display: block grid;
      grid-template-columns: minmax(0, 1fr);
      margin-block: 0;
    }

    @container grid-asymmetric (inline-size < 44rem) {
      ul {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @container grid-asymmetric (inline-size >= 44rem) {
      ul {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
      }

      li.lead {
        grid-row: span 2;
      }
    }
  }
}

@scope (.grid-asymmetric article) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      container-type: inline-size;
      display: block grid;
      grid-template-columns: minmax(0, 1fr);
    }

    div.body {
      display: block flex;
      flex-direction: column;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-2xs);
      overflow-wrap: anywhere;
    }

    img.media {
      aspect-ratio: 3 / 2;
      block-size: auto;
      border-radius: var(--loam-radius-md);
      inline-size: 100%;
      margin-block-end: var(--loam-space-3xs);
      object-fit: cover;
    }

    h3 {
      margin-block: 0;
    }

    p {
      color: var(--loam-color-fg-muted);
      margin-block: 0;
      text-wrap: pretty;
    }

    div.actions {
      display: block flex;
      flex-wrap: wrap;
      gap: var(--loam-space-2xs);
      margin-block-start: auto;
      padding-block-start: var(--loam-space-2xs);
    }
  }
}
```

